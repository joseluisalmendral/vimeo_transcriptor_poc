// src/utils/urlParser.js
export const parseVimeoUrls = (input) => {
    if (!input || typeof input !== 'string') return [];
  
    const urls = input
      .split(/[\n,]/)
      .map(url => url.trim())
      .filter(url => url.length > 0);
  
    const videoIds = [];
  
    urls.forEach(url => {
      try {
        // Patrones para diferentes formatos de URL de Vimeo
        const patterns = [
          /vimeo\.com\/(\d+)\/([a-f0-9]{10})/i,  // https://vimeo.com/1021420858/52b8cbc1dc
          /vimeo\.com\/(\d+)/i,                   // https://vimeo.com/1021420858
          /player\.vimeo\.com\/video\/(\d+)/i     // https://player.vimeo.com/video/1021420858
        ];
  
        let videoId = null;
        for (const pattern of patterns) {
          const match = url.match(pattern);
          if (match) {
            videoId = match[1];
            break;
          }
        }
  
        if (videoId) {
          videoIds.push({
            originalUrl: url,
            videoId: videoId,
            isValid: true
          });
        } else {
          videoIds.push({
            originalUrl: url,
            videoId: null,
            isValid: false,
            error: 'URL de Vimeo no válida'
          });
        }
      } catch (error) {
        videoIds.push({
          originalUrl: url,
          videoId: null,
          isValid: false,
          error: 'Error procesando URL'
        });
      }
    });
  
    return videoIds;
  };