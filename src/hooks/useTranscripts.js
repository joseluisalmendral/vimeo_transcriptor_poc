import { useState, useCallback } from 'react';
import { processVideoTranscript, VimeoAPIError } from '../api/vimeo';
import { parseVimeoUrls } from '../utils/urlParser';

export const useTranscripts = () => {
  const [results, setResults] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [currentStatus, setCurrentStatus] = useState('');

  const processUrls = useCallback(async (urlsInput) => {
    if (!urlsInput.trim()) return;

    setIsProcessing(true);
    setResults([]);
    setProgress({ current: 0, total: 0 });

    try {
      const parsedUrls = parseVimeoUrls(urlsInput);
      const validUrls = parsedUrls.filter(item => item.isValid);
      const invalidUrls = parsedUrls.filter(item => !item.isValid);

      if (validUrls.length === 0) {
        setResults(invalidUrls.map(item => ({
          originalUrl: item.originalUrl,
          videoId: null,
          transcript: null,
          error: item.error || 'URL no válida',
          status: 'error'
        })));
        return;
      }

      setProgress({ current: 0, total: validUrls.length });

      // Procesar URLs válidas en paralelo con límite de concurrencia
      const processInBatches = async (urls, batchSize = 3) => {
        const results = [];
        
        for (let i = 0; i < urls.length; i += batchSize) {
          const batch = urls.slice(i, i + batchSize);
          const batchPromises = batch.map(async (urlData) => {
            try {
              setCurrentStatus(`Procesando video ${urlData.videoId}...`);
              
              const result = await processVideoTranscript(
                urlData.videoId,
                (status) => setCurrentStatus(status)
              );

              setProgress(prev => ({ ...prev, current: prev.current + 1 }));

              console.log('Resultado procesado:', result); // Debug log

              return {
                originalUrl: urlData.originalUrl,
                videoId: urlData.videoId,
                title: result.title, // Asegurar que se pasa el título
                transcript: result.transcript,
                language: result.language,
                trackName: result.trackName,
                error: null,
                status: 'success'
              };
            } catch (error) {
              setProgress(prev => ({ ...prev, current: prev.current + 1 }));

              let errorMessage = 'Error desconocido';
              if (error instanceof VimeoAPIError) {
                if (error.status === 404) {
                  errorMessage = 'No hay transcripción disponible para este video';
                } else if (error.status === 403) {
                  errorMessage = 'No tienes permisos para acceder a este video';
                } else if (error.status === 429) {
                  errorMessage = 'Límite de API excedido, intenta más tarde';
                } else {
                  errorMessage = error.message;
                }
              } else {
                errorMessage = error.message;
              }

              return {
                originalUrl: urlData.originalUrl,
                videoId: urlData.videoId,
                transcript: null,
                error: errorMessage,
                status: 'error'
              };
            }
          });

          const batchResults = await Promise.all(batchPromises);
          results.push(...batchResults);

          // Actualizar resultados incrementalmente
          setResults(prevResults => [
            ...prevResults,
            ...batchResults
          ]);

          // Pequeña pausa entre lotes para evitar saturar la API
          if (i + batchSize < urls.length) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }

        return results;
      };

      await processInBatches(validUrls);

      // Agregar URLs inválidas al final
      if (invalidUrls.length > 0) {
        setResults(prevResults => [
          ...prevResults,
          ...invalidUrls.map(item => ({
            originalUrl: item.originalUrl,
            videoId: null,
            transcript: null,
            error: item.error || 'URL no válida',
            status: 'error'
          }))
        ]);
      }

      setCurrentStatus('¡Proceso completado!');

    } catch (error) {
      console.error('Error procesando URLs:', error);
      setCurrentStatus('Error procesando las URLs');
    } finally {
      setIsProcessing(false);
      setTimeout(() => setCurrentStatus(''), 3000);
    }
  }, []);

  const resetResults = useCallback(() => {
    setResults([]);
    setProgress({ current: 0, total: 0 });
    setCurrentStatus('');
  }, []);

  return {
    results,
    isProcessing,
    progress,
    currentStatus,
    processUrls,
    resetResults
  };
};