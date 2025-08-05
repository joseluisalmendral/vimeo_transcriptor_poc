// src/api/vimeo.js
class VimeoAPIError extends Error {
  constructor(message, status, videoId) {
    super(message);
    this.name = 'VimeoAPIError';
    this.status = status;
    this.videoId = videoId;
  }
}

// Determinar la URL base para las APIs
const getApiBaseUrl = () => {
  // En desarrollo con Vite
  if (import.meta.env.DEV) {
    return 'http://localhost:3000'; // vercel dev usa puerto 3000 por defecto
  }
  
  // En producción en Vercel
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // Fallback
  return '';
};

const API_BASE_URL = getApiBaseUrl();

const makeRequest = async (endpoint, params = {}) => {
  const searchParams = new URLSearchParams(params);
  const url = `${API_BASE_URL}/api/${endpoint}?${searchParams}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      // Error de red/conexión
      throw new Error('Error de conexión: Verifica que el servidor esté funcionando');
    }
    throw error;
  }
};

// NUEVA FUNCIÓN UNIFICADA - UNA SOLA LLAMADA API
export const processVideoTranscriptUnified = async (videoId, onProgress) => {
  try {
    if (onProgress) onProgress(`Procesando video ${videoId}...`);
    
    // Una sola llamada que hace todo el procesamiento
    const result = await makeRequest('vimeo-process', { videoId });
    
    if (result.status === 'error') {
      throw new VimeoAPIError(result.error, 404, videoId);
    }

    if (onProgress) onProgress(`¡Video ${videoId} procesado exitosamente!`);

    return {
      videoId: result.videoId,
      title: result.title,
      transcript: result.transcript,
      language: result.language,
      trackName: result.trackName
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

// FUNCIÓN PRINCIPAL ACTUALIZADA
export const processVideoTranscript = processVideoTranscriptUnified;

// ===============================
// FUNCIONES LEGACY (por si acaso)
// ===============================
export const getVideoTextTracks = async (videoId) => {
  try {
    const data = await makeRequest('vimeo-texttracks', { videoId });
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
    const data = await makeRequest('vimeo-transcript', { videoId, textTrackId });
    return data;
  } catch (error) {
    throw new VimeoAPIError(
      `Error fetching transcript: ${error.message}`,
      error.status || 500,
      videoId
    );
  }
};

export const getVideoInfo = async (videoId) => {
  try {
    const data = await makeRequest('vimeo-video-info', { videoId });
    return data;
  } catch (error) {
    throw new VimeoAPIError(
      `Error fetching video info: ${error.message}`,
      error.status || 500,
      videoId
    );
  }
};

// FUNCIÓN LEGACY ORIGINAL (mantenerla por compatibilidad)
export const processVideoTranscriptLegacy = async (videoId, onProgress) => {
  try {
    let videoTitle = `Video ${videoId}`;
    
    // Intentar obtener el título del video
    try {
      if (onProgress) onProgress(`Obteniendo información del video ${videoId}...`);
      const videoInfo = await getVideoInfo(videoId);
      videoTitle = videoInfo.name || `Video ${videoId}`;
    } catch (error) {
      // Continuar sin el título, no es crítico
    }
    
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
      transcriptText = transcriptResponse.data
        .map(cue => {
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
      transcriptText = transcriptResponse.cues
        .map(cue => cue.text)
        .filter(text => text && text.trim())
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
    } else if (transcriptResponse.transcript) {
      transcriptText = transcriptResponse.transcript;
    }

    if (!transcriptText) {
      throw new VimeoAPIError('La transcripción está vacía o no tiene formato válido', 404, videoId);
    }

    return {
      videoId,
      title: videoTitle,
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