import { useState, useEffect } from 'react';
import UrlInput from './components/UrlInput';
import LoadingJokes from './components/LoadingJokes';
import TranscriptList from './components/TranscriptList';
import { useTranscripts } from './hooks/useTranscripts';
import { Analytics } from '@vercel/analytics/react';


function App() {
  const [darkMode, setDarkMode] = useState(false);
  
  const {
    results,
    isProcessing,
    progress,
    currentStatus,
    processUrls,
    resetResults
  } = useTranscripts();

  // Detectar preferencia de tema del sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setDarkMode(mediaQuery.matches);

    const handleChange = (e) => setDarkMode(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Aplicar tema
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleReset = () => {
    resetResults();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                ThePower Vimeo Transcriptor
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Extrae transcripciones automáticas de videos de Vimeo de forma masiva
              </p>
            </div>
            
            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              title={darkMode ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
            >
              {darkMode ? (
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
              🚀 Cómo usar esta herramienta
            </h2>
            <ul className="text-blue-800 dark:text-blue-200 space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-0.5">1.</span>
                Pega las URLs de Vimeo en el campo de texto (una por línea o separadas por comas)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-0.5">2.</span>
                Haz clic en "Obtener Transcripciones" y disfruta de los chistes mientras esperas
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-0.5">3.</span>
                Copia o descarga las transcripciones individualmente o todas juntas
              </li>
            </ul>
            <p className="text-blue-700 dark:text-blue-300 text-xs mt-3 font-medium">
              💡 Solo funcionará con videos que tengan transcripciones automáticas habilitadas y con el token correcto configurado en el servidor.
            </p>
          </div>

          {/* URL Input */}
          <UrlInput 
            onSubmit={processUrls}
            isProcessing={isProcessing}
            onReset={handleReset}
          />

          {/* Loading State */}
          <LoadingJokes 
            isVisible={isProcessing}
            progress={progress}
            currentStatus={currentStatus}
          />

          {/* Results */}
          <TranscriptList results={results} />
          
          {/* Footer Info */}
          {!isProcessing && results.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">🎬</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                ¡Listo para procesar videos!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                Introduce las URLs de Vimeo arriba para comenzar a extraer las transcripciones automáticamente.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
            <p>
              Creado por <a href="https://github.com/joseluisalmendral" target='_blank' className='font-black'>Pepelu</a> • 
              <a 
                href="https://developer.vimeo.com/api" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 ml-1"
              >
                API de Vimeo
              </a>
            </p>
          </div>
        </div>
      </footer>

      <Analytics />
    </div>
  );
}

export default App;