import { useState } from 'react';
import { parseVimeoUrls } from '../utils/urlParser';

const UrlInput = ({ onSubmit, isProcessing, onReset }) => {
  const [urls, setUrls] = useState('');
  const [previewUrls, setPreviewUrls] = useState([]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setUrls(value);
    
    // Preview de URLs parseadas
    if (value.trim()) {
      const parsed = parseVimeoUrls(value);
      setPreviewUrls(parsed);
    } else {
      setPreviewUrls([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (urls.trim() && !isProcessing) {
      onSubmit(urls);
    }
  };

  const handleReset = () => {
    setUrls('');
    setPreviewUrls([]);
    onReset();
  };

  const validCount = previewUrls.filter(url => url.isValid).length;
  const invalidCount = previewUrls.filter(url => !url.isValid).length;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="urls" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            URLs de Vimeo
          </label>
          <textarea
            id="urls"
            value={urls}
            onChange={handleInputChange}
            disabled={isProcessing}
            placeholder="Pega aquí las URLs de Vimeo (una por línea o separadas por comas)&#10;&#10;Ejemplos:&#10;https://vimeo.com/1021420858/52b8cbc1dc&#10;https://vimeo.com/846914777/d2eb34adb1&#10;https://vimeo.com/123456789"
            className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            rows={6}
          />
        </div>

        {/* Preview de URLs */}
        {previewUrls.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Vista previa ({validCount} válidas, {invalidCount} inválidas)
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {previewUrls.map((url, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-2 rounded text-xs ${
                    url.isValid
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                      : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-mono truncate">{url.originalUrl}</p>
                    {url.isValid && (
                      <p className="text-xs opacity-75">ID: {url.videoId}</p>
                    )}
                    {!url.isValid && (
                      <p className="text-xs opacity-75">{url.error}</p>
                    )}
                  </div>
                  <div className={`ml-2 flex-shrink-0 w-2 h-2 rounded-full ${
                    url.isValid ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isProcessing || !urls.trim() || validCount === 0}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Procesando…' : 'Obtener Transcripciones'}
          </button>
          
          {(urls.trim() || previewUrls.length > 0) && (
            <button
              type="button"
              onClick={handleReset}
              disabled={isProcessing}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Limpiar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default UrlInput;