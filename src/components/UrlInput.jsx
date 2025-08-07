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
    <Card className="w-full border-zinc-200 dark:border-zinc-800">
      <CardHeader>
        <CardTitle className="text-zinc-900 dark:text-zinc-100">URLs de Vimeo</CardTitle>
        <CardDescription className="text-zinc-600 dark:text-zinc-400">
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
              className="w-full h-32 px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-800 rounded-lg 
                         bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 
                         placeholder-zinc-500 dark:placeholder-zinc-400 
                         focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-500
                         disabled:opacity-50 disabled:cursor-not-allowed
                         resize-none transition-colors"
              rows={6}
            />
          </div>

          {/* Preview de URLs */}
          {previewUrls.length > 0 && (
            <Card className="bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm text-zinc-900 dark:text-zinc-100">
                    Vista previa
                  </CardTitle>
                  <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-500" />
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
                          ? 'bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900'
                          : 'bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900'
                      }`}
                    >
                      <div className="flex-1 min-w-0 space-y-1">
                        <p className={`font-mono text-xs truncate ${
                          url.isValid 
                            ? 'text-emerald-800 dark:text-emerald-200' 
                            : 'text-red-800 dark:text-red-200'
                        }`}>
                          {url.originalUrl}
                        </p>
                        <p className={`text-xs ${
                          url.isValid 
                            ? 'text-emerald-600 dark:text-emerald-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {url.isValid ? `ID: ${url.videoId}` : url.error}
                        </p>
                      </div>
                      <div className={`ml-3 w-2 h-2 rounded-full flex-shrink-0 ${
                        url.isValid ? 'bg-emerald-500' : 'bg-red-500'
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