import { useState } from 'react';
import { copyToClipboard, downloadTextFile } from '../utils/download';

const TranscriptCard = ({ result }) => {
  const [copyStatus, setCopyStatus] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  // Función para truncar el título
  const truncateTitle = (title, maxLength = 60) => {
    if (!title || title.length <= maxLength) return title;
    return title.substring(0, maxLength).trim() + '...';
  };

  const handleCopy = async () => {
    if (!result.transcript) return;

    const success = await copyToClipboard(result.transcript);
    if (success) {
      setCopyStatus('¡Copiado!');
      setTimeout(() => setCopyStatus(''), 2000);
    } else {
      setCopyStatus('Error');
      setTimeout(() => setCopyStatus(''), 2000);
    }
  };

  const handleDownload = () => {
    if (!result.transcript) return;
    
    // Crear nombre de archivo seguro basado en el título del video
    const sanitizeFilename = (name) => {
      return name.replace(/[^a-z0-9\s\-\_]/gi, '').replace(/\s+/g, '_').substring(0, 50);
    };
    
    const safeTitle = result.title ? sanitizeFilename(result.title) : `video_${result.videoId}`;
    const filename = `transcript_${safeTitle}_${Date.now()}.txt`;
    
    const content = `Transcripción de Vimeo\n` +
                   `Título: ${result.title || 'Sin título'}\n` +
                   `Video ID: ${result.videoId}\n` +
                   `URL Original: ${result.originalUrl}\n` +
                   `Idioma: ${result.language || 'N/A'}\n` +
                   `Pista: ${result.trackName || 'N/A'}\n` +
                   `Fecha: ${new Date().toISOString()}\n\n` +
                   `--- TRANSCRIPCIÓN ---\n\n` +
                   `${result.transcript}`;
    
    downloadTextFile(content, filename);
  };

  const truncatedTranscript = result.transcript && result.transcript.length > 300
    ? result.transcript.substring(0, 300) + '...'
    : result.transcript;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1" title={result.title || `Video ${result.videoId || 'Desconocido'}`}>
              {truncateTitle(result.title || `Video ${result.videoId || 'Desconocido'}`)}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate" title={result.originalUrl}>
              {result.originalUrl}
            </p>
            <div className="flex items-center gap-3 mt-1">
              {result.language && (
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {result.trackName} ({result.language})
                </p>
              )}
              {result.videoId && (
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  ID: {result.videoId}
                </p>
              )}
            </div>
          </div>
          
          {/* Status Badge */}
          <div className={`ml-4 flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium ${
            result.status === 'success'
              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
              : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
          }`}>
            {result.status === 'success' ? 'Éxito' : 'Error'}
          </div>
        </div>

        {/* Content */}
        {result.status === 'success' && result.transcript ? (
          <div className="space-y-4">
            {/* Transcript Preview */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Transcripción
                </h4>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {result.transcript.length} caracteres
                </div>
              </div>
              
              <div className="relative">
                <pre className={`text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-sans leading-relaxed ${
                  isExpanded ? 'max-h-none' : 'max-h-32 overflow-hidden'
                }`}>
                  {isExpanded ? result.transcript : truncatedTranscript}
                </pre>
                
                {result.transcript.length > 300 && (
                  <div className={`${
                    isExpanded ? 'static mt-3' : 'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-50 dark:from-gray-900 to-transparent h-8'
                  } flex ${isExpanded ? 'justify-start' : 'items-end justify-center'}`}>
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium bg-gray-50 dark:bg-gray-900 px-2 py-1 rounded"
                    >
                      {isExpanded ? 'Ver menos' : 'Ver más'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleCopy}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                {copyStatus || 'Copiar'}
              </button>
              
              <button
                onClick={handleDownload}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Descargar
              </button>
            </div>
          </div>
        ) : (
          /* Error State */
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
            <div className="flex items-start gap-3">
              <div className="text-red-500 text-xl flex-shrink-0">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">
                  No hay transcripción disponible
                </h4>
                <p className="text-sm text-red-700 dark:text-red-400">
                  {result.error || 'Error desconocido al procesar el video'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TranscriptCard;