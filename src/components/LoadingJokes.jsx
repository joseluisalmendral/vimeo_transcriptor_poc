import { useState, useEffect } from 'react';
import { getRandomJoke } from '../utils/jokes';

const LoadingJokes = ({ isVisible, progress, currentStatus }) => {
  const [currentJoke, setCurrentJoke] = useState('');

  useEffect(() => {
    if (!isVisible) return;

    // Establecer chiste inicial
    setCurrentJoke(getRandomJoke());

    // Cambiar chiste cada 2.5 segundos
    const interval = setInterval(() => {
      setCurrentJoke(getRandomJoke());
    }, 2500);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="w-full max-w-2xl mx-auto bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-8 border border-blue-200 dark:border-gray-600 shadow-lg">
      <div className="text-center space-y-6">
        {/* Spinner animado */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 dark:border-gray-600 rounded-full animate-spin">
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-blue-600 dark:text-blue-400">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Progreso */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Progreso</span>
            <span>{progress.current} de {progress.total}</span>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
            <div 
              className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ 
                width: progress.total > 0 ? `${(progress.current / progress.total) * 100}%` : '0%' 
              }}
            />
          </div>
        </div>

        {/* Estado actual */}
        {currentStatus && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
            <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
              {currentStatus}
            </p>
          </div>
        )}

        {/* Chiste malo */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-600 shadow-sm">
          <div className="flex items-start space-x-3">
            <div className="text-yellow-500 text-2xl">😄</div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Mientras esperas, aquí tienes un chiste malo:
              </h3>
              <p className="text-gray-800 dark:text-gray-200 text-base leading-relaxed">
                {currentJoke}
              </p>
            </div>
          </div>
        </div>

        {/* Mensaje motivacional */}
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Procesando transcripciones de Vimeo... ¡Esto puede tomar unos momentos!
        </p>
      </div>
    </div>
  );
};

export default LoadingJokes;