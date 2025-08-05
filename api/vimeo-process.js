// api/vimeo-process.js
const VIMEO_ACCESS_TOKEN = process.env.VIMEO_ACCESS_TOKEN;
const VIMEO_API_BASE = 'https://api.vimeo.com';

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Manejar preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Solo permitir GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verificar que existe el token
  if (!VIMEO_ACCESS_TOKEN) {
    return res.status(500).json({ 
      error: 'Vimeo access token not configured' 
    });
  }

  const { videoId } = req.query;

  if (!videoId) {
    return res.status(400).json({ 
      error: 'videoId is required' 
    });
  }

  try {
    // Función helper para hacer requests a Vimeo
    const makeVimeoRequest = async (endpoint) => {
      const response = await fetch(`${VIMEO_API_BASE}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${VIMEO_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Vimeo API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      return response.json();
    };

    // Resultado final que vamos a construir
    const result = {
      videoId,
      title: `Video ${videoId}`, // Valor por defecto
      transcript: null,
      language: null,
      trackName: null,
      error: null,
      status: 'success'
    };

    // 1. Intentar obtener información del video (título) - NO CRÍTICO
    try {
      const videoInfo = await makeVimeoRequest(`/videos/${videoId}?fields=name`);
      if (videoInfo.name) {
        result.title = videoInfo.name;
      }
    } catch (error) {
      // No es crítico si falla, continuamos sin el título
      console.warn(`Could not fetch video info for ${videoId}:`, error.message);
    }

    // 2. Obtener pistas de texto - CRÍTICO
    const textTracksResponse = await makeVimeoRequest(`/videos/${videoId}/texttracks?include_transcript=true`);
    
    if (!textTracksResponse.data || textTracksResponse.data.length === 0) {
      return res.status(404).json({
        ...result,
        error: 'No hay pistas de texto disponibles',
        status: 'error'
      });
    }

    // Buscar una pista de transcripción automática o la primera disponible
    const autoTrack = textTracksResponse.data.find(track => 
      track.type === 'captions' && (track.language === 'en-x-autogen' || track.language.includes('en'))
    ) || textTracksResponse.data[0];

    if (!autoTrack) {
      return res.status(404).json({
        ...result,
        error: 'No se encontró una pista de texto válida',
        status: 'error'
      });
    }

    // 3. Obtener la transcripción completa - CRÍTICO
    const textTrackId = autoTrack.uri.split('/').pop();
    const transcriptResponse = await makeVimeoRequest(`/videos/${videoId}/transcripts/${textTrackId}`);

    // Procesar los cues para convertirlos en texto plano
    let transcriptText = '';
    if (transcriptResponse.data && Array.isArray(transcriptResponse.data)) {
      // La respuesta de Vimeo tiene la estructura: { data: [{ lines: [{ text: "..." }] }] }
      transcriptText = transcriptResponse.data
        .map(cue => {
          // Extraer el texto de cada cue desde lines[0].text
          if (cue.lines && Array.isArray(cue.lines) && cue.lines[0] && cue.lines[0].text) {
            return cue.lines[0].text;
          }
          return null;
        })
        .filter(text => text && text.trim())
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
    } else if (transcriptResponse.cues && Array.isArray(transcriptResponse.cues)) {
      // Fallback para formato anterior (por si acaso)
      transcriptText = transcriptResponse.cues
        .map(cue => cue.text)
        .filter(text => text && text.trim())
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
    } else if (transcriptResponse.transcript) {
      // Algunas respuestas pueden venir directamente con el texto
      transcriptText = transcriptResponse.transcript;
    }

    if (!transcriptText) {
      return res.status(404).json({
        ...result,
        error: 'La transcripción está vacía o no tiene formato válido',
        status: 'error'
      });
    }

    // Resultado exitoso
    result.transcript = transcriptText;
    result.language = autoTrack.language;
    result.trackName = autoTrack.name || 'Transcripción automática';

    return res.status(200).json(result);

  } catch (error) {
    console.error('Error processing video:', error);
    
    // Determinar el tipo de error y status code apropiado
    let statusCode = 500;
    let errorMessage = 'Internal server error';
    
    if (error.message.includes('404')) {
      statusCode = 404;
      errorMessage = 'Video no encontrado o sin transcripción disponible';
    } else if (error.message.includes('403')) {
      statusCode = 403;
      errorMessage = 'No tienes permisos para acceder a este video';
    } else if (error.message.includes('429')) {
      statusCode = 429;
      errorMessage = 'Límite de API excedido, intenta más tarde';
    } else {
      errorMessage = error.message;
    }

    return res.status(statusCode).json({ 
      videoId,
      title: `Video ${videoId}`,
      transcript: null,
      language: null,
      trackName: null,
      error: errorMessage,
      status: 'error'
    });
  }
}