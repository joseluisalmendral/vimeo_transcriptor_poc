const VIMEO_ACCESS_TOKEN = import.meta.env.VITE_VIMEO_ACCESS_TOKEN;
const VIMEO_API_BASE = 'https://api.vimeo.com';

class VimeoAPIError extends Error {
  constructor(message, status, videoId) {
    super(message);
    this.name = 'VimeoAPIError';
    this.status = status;
    this.videoId = videoId;
  }
}

const makeRequest = async (url) => {
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${VIMEO_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
};

export const getVideoTextTracks = async (videoId) => {
  try {
    const url = `${VIMEO_API_BASE}/videos/${videoId}/texttracks?include_transcript=true`;
    const data = await makeRequest(url);
    return data;
  } catch (error) {
    throw new VimeoAPIError(
      `Error fetching text tracks: ${error.message}`,
      error.status || 500,
      videoId
    );
  }
};

export const getTranscript = async (videoId, textTrackId) => {
  try {
    const url = `${VIMEO_API_BASE}/videos/${videoId}/transcripts/${textTrackId}`;
    const data = await makeRequest(url);
    return data;
  } catch (error) {
    throw new VimeoAPIError(
      `Error fetching transcript: ${error.message}`,
      error.status || 500,
      videoId
    );
  }
};

export const processVideoTranscript = async (videoId, onProgress) => {
  try {
    if (onProgress) onProgress(`Obteniendo pistas de texto para video ${videoId}...`);
    
    // Obtener las pistas de texto disponibles
    const textTracksResponse = await getVideoTextTracks(videoId);
    
    if (!textTracksResponse.data || textTracksResponse.data.length === 0) {
      throw new VimeoAPIError('No hay pistas de texto disponibles', 404, videoId);
    }

    // Buscar una pista de transcripción automática o la primera disponible
    const autoTrack = textTracksResponse.data.find(track => 
      track.type === 'captions' && (track.language === 'en-x-autogen' || track.language.includes('en'))
    ) || textTracksResponse.data[0];

    if (!autoTrack) {
      throw new VimeoAPIError('No se encontró una pista de texto válida', 404, videoId);
    }

    if (onProgress) onProgress(`Descargando transcripción para video ${videoId}...`);

    // Obtener la transcripción completa
    const transcriptResponse = await getTranscript(videoId, autoTrack.uri.split('/').pop());

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
      throw new VimeoAPIError('La transcripción está vacía o no tiene formato válido', 404, videoId);
    }

    return {
      videoId,
      transcript: transcriptText,
      language: autoTrack.language,
      trackName: autoTrack.name || 'Transcripción automática'
    };

  } catch (error) {
    if (error instanceof VimeoAPIError) {
      throw error;
    }
    throw new VimeoAPIError(
      `Error procesando video ${videoId}: ${error.message}`,
      error.status || 500,
      videoId
    );
  }
};

export { VimeoAPIError };