import { useState } from 'react';
import { parseVimeoUrls } from '../utils/urlParser';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';

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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>URLs de Vimeo</CardTitle>
        <CardDescription>
          Pega aquí las URLs de Vimeo que quieres procesar
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Textarea */}
          <div>
            <textarea
              value={urls}
              onChange={handleInputChange}
              disabled={isProcessing}
              placeholder={`Pega aquí las URLs de Vimeo (una por línea o separadas por comas)

Ejemplos:
https://vimeo.com/1021420858/52b8cbc1dc
https://vimeo.com/846914777/d2eb34adb1
https://vimeo.com/123456789`}
              className="w-full h-32 px-3 py-2 text-sm border border-gray-200 dark:border-gray-800 rounded-lg 
                         bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 
                         placeholder-gray-500 dark:placeholder-gray-400 
                         focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500
                         disabled:opacity-50 disabled:cursor-not-allowed
                         resize-none transition-colors"
              rows={6}
            />
          </div>

          {/* Preview de URLs */}
          {previewUrls.length > 0 && (
            <Card className="bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">
                    Vista previa
                  </CardTitle>
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span>{validCount} válidas</span>
                    </div>
                    {invalidCount > 0 && (
                      <div className="flex items-center gap-1">
                        <XCircle className="w-3 h-3 text-red-500" />
                        <span>{invalidCount} inválidas</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {previewUrls.map((url, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-lg text-sm transition-colors ${
                        url.isValid
                          ? 'bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900'
                          : 'bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900'
                      }`}
                    >
                      <div className="flex-1 min-w-0 space-y-1">
                        <p className={`font-mono text-xs truncate ${
                          url.isValid 
                            ? 'text-green-800 dark:text-green-200' 
                            : 'text-red-800 dark:text-red-200'
                        }`}>
                          {url.originalUrl}
                        </p>
                        <p className={`text-xs ${
                          url.isValid 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {url.isValid ? `ID: ${url.videoId}` : url.error}
                        </p>
                      </div>
                      <div className={`ml-3 w-2 h-2 rounded-full flex-shrink-0 ${
                        url.isValid ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={isProcessing || !urls.trim() || validCount === 0}
              className="flex-1"
            >
              {isProcessing ? 'Procesando…' : 'Obtener Transcripciones'}
            </Button>
            
            {(urls.trim() || previewUrls.length > 0) && (
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={isProcessing}
                size="icon"
                className="px-3"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default UrlInput;