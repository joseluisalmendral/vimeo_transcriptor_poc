import TranscriptCard from './TranscriptCard';

const TranscriptList = ({ results }) => {
  if (!results || results.length === 0) {
    return null;
  }

  const successCount = results.filter(r => r.status === 'success').length;
  const errorCount = results.filter(r => r.status === 'error').length;

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Summary */}
      <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Resultados del Procesamiento
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {results.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Videos Procesados
            </div>
          </div>
          
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {successCount}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Transcripciones Exitosas
            </div>
          </div>
          
          <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {errorCount}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Con Errores
            </div>
          </div>
        </div>

        {successCount > 0 && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">
                ¡Perfecto! Se han procesado exitosamente {successCount} transcripción{successCount !== 1 ? 'es' : ''}.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {results.map((result, index) => (
          <TranscriptCard 
            key={`${result.videoId || 'invalid'}-${index}`} 
            result={result}
          />
        ))}
      </div>

      {/* Action Buttons */}
      {successCount > 0 && (
        <div className="mt-8 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Acciones Globales
            </h3>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  const allTranscripts = results
                    .filter(r => r.status === 'success' && r.transcript)
                    .map(r => `=== Video ${r.videoId} ===\nURL: ${r.originalUrl}\n\n${r.transcript}\n\n`)
                    .join('');
                  
                  if (allTranscripts) {
                    const blob = new Blob([allTranscripts], { type: 'text/plain;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `all_transcripts_${Date.now()}.txt`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                  }
                }}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Descargar Todas las Transcripciones
              </button>
              
              <button
                onClick={async () => {
                  const allTranscripts = results
                    .filter(r => r.status === 'success' && r.transcript)
                    .map(r => `=== Video ${r.videoId} ===\n${r.transcript}`)
                    .join('\n\n');
                  
                  if (allTranscripts) {
                    try {
                      await navigator.clipboard.writeText(allTranscripts);
                      // Mostrar confirmación temporal
                      const button = event.target.closest('button');
                      const originalText = button.textContent;
                      button.textContent = '¡Copiado!';
                      setTimeout(() => {
                        button.textContent = originalText;
                      }, 2000);
                    } catch (error) {
                      console.error('Error copiando:', error);
                    }
                  }
                }}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Copiar Todas al Portapapeles
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TranscriptList;