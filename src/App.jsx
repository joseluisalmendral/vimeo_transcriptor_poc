import { useState, useEffect } from 'react';
import { Moon, Sun, FileText, Zap, Github, ExternalLink } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';

// Radix UI Components
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Switch } from './components/ui/switch';
import { Separator } from './components/ui/separator';
import { Toaster } from './components/ui/toaster';

// Custom Components
import UrlInput from './components/UrlInput';
import LoadingJokes from './components/LoadingJokes';
import TranscriptList from './components/TranscriptList';
import { useTranscripts } from './hooks/useTranscripts';

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
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-gray-900 dark:bg-gray-100 rounded-lg">
                <FileText className="w-5 h-5 text-white dark:text-gray-900" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Vimeo Transcriptor
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  by ThePower
                </p>
              </div>
            </div>
            
            {/* Theme Toggle */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4 text-gray-500" />
                <Switch 
                  checked={darkMode} 
                  onCheckedChange={setDarkMode}
                  aria-label="Toggle dark mode"
                />
                <Moon className="h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Extrae transcripciones de Vimeo
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Una herramienta moderna para obtener transcripciones automáticas de videos de Vimeo 
              de forma masiva y eficiente.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Zap className="w-8 h-8 mx-auto mb-3 text-gray-600 dark:text-gray-400" />
                <h3 className="font-semibold mb-2">Procesamiento masivo</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Procesa múltiples videos simultáneamente
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <FileText className="w-8 h-8 mx-auto mb-3 text-gray-600 dark:text-gray-400" />
                <h3 className="font-semibold mb-2">Múltiples formatos</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Soporta diferentes formatos de URLs
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <ExternalLink className="w-8 h-8 mx-auto mb-3 text-gray-600 dark:text-gray-400" />
                <h3 className="font-semibold mb-2">Fácil exportación</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Copia o descarga transcripciones
                </p>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Instructions */}
          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-blue-900 dark:text-blue-100">
                🚀 Cómo usar esta herramienta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-blue-800 dark:text-blue-200">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100 rounded-full flex items-center justify-center text-xs font-semibold">1</span>
                  <p>Pega las URLs de Vimeo en el campo de texto (una por línea o separadas por comas)</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100 rounded-full flex items-center justify-center text-xs font-semibold">2</span>
                  <p>Haz clic en "Obtener Transcripciones" y disfruta de los chistes mientras esperas</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100 rounded-full flex items-center justify-center text-xs font-semibold">3</span>
                  <p>Copia o descarga las transcripciones individualmente o todas juntas</p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <p className="text-blue-700 dark:text-blue-300 text-xs font-medium">
                  💡 Solo funcionará con videos que tengan transcripciones automáticas habilitadas y con el token correcto configurado en el servidor.
                </p>
              </div>
            </CardContent>
          </Card>

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
          
          {/* Empty State */}
          {!isProcessing && results.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-gray-400 dark:text-gray-500 text-6xl mb-6">🎬</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  ¡Listo para procesar videos!
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  Introduce las URLs de Vimeo arriba para comenzar a extraer las transcripciones automáticamente.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Creado por{' '}
                <a 
                  href="https://github.com/joseluisalmendral" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Pepelu
                </a>
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <a 
                  href="https://github.com/joseluisalmendral" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
              </Button>
              
              <Button variant="ghost" size="sm" asChild>
                <a 
                  href="https://developer.vimeo.com/api" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  API de Vimeo
                </a>
              </Button>
            </div>
          </div>
        </div>
      </footer>

      {/* Toast Notifications */}
      <Toaster />
      
      {/* Analytics */}
      <Analytics />
    </div>
  );
}

export default App;