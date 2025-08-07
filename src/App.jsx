import { useState, useEffect, useRef } from 'react';
import { Moon, Sun, FileText, Zap, Github, ExternalLink, ChevronDown, Info } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';

// Radix UI Components
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Switch } from './components/ui/switch';
import { Separator } from './components/ui/separator';
import { Toaster } from './components/ui/toaster';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './components/ui/collapsible';

// Custom Components
import UrlInput from './components/UrlInput';
import LoadingJokes from './components/LoadingJokes';
import TranscriptList from './components/TranscriptList';
import { useTranscripts } from './hooks/useTranscripts';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    // Inicializar desde localStorage o preferencia del sistema
    const saved = localStorage.getItem('theme');
    if (saved) {
      return saved === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [showInstructions, setShowInstructions] = useState(false);
  const resultsRef = useRef(null);
  
  const {
    results,
    isProcessing,
    progress,
    currentStatus,
    processUrls,
    resetResults
  } = useTranscripts();

  // Manejar cambios de tema
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Escuchar cambios de tema del sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (!localStorage.getItem('theme')) {
        setDarkMode(e.matches);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleReset = () => {
    resetResults();
  };

  const handleProcessUrls = (urls) => {
    processUrls(urls);
    
    // Scroll suave hacia la sección de resultados después de un pequeño delay
    setTimeout(() => {
      if (resultsRef.current) {
        resultsRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }
    }, 100);
  };

  const handleThemeToggle = (checked) => {
    setDarkMode(checked);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-zinc-900 dark:bg-zinc-100 rounded-lg">
                <FileText className="w-5 h-5 text-white dark:text-zinc-900" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  Vimeo Transcriptor
                </h1>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  by ThePower
                </p>
              </div>
            </div>
            
            {/* Theme Toggle */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4 text-zinc-500" />
                <Switch 
                  checked={darkMode} 
                  onCheckedChange={handleThemeToggle}
                  aria-label="Toggle dark mode"
                />
                <Moon className="h-4 w-4 text-zinc-500" />
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
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              Extrae transcripciones de Vimeo
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Una herramienta moderna para obtener transcripciones automáticas de videos de Vimeo 
              de forma masiva y eficiente.
            </p>
          </div>

          {/* URL Input - Moved up as main functionality */}
          <UrlInput 
            onSubmit={handleProcessUrls}
            isProcessing={isProcessing}
            onReset={handleReset}
          />

          {/* Instructions - Now Collapsible */}
          <div className="space-y-4">
            <Collapsible open={showInstructions} onOpenChange={setShowInstructions}>
              <Card className="border-emerald-200 dark:border-emerald-800/30">
                <CardHeader className="pb-3">
                  <CollapsibleTrigger className="group">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <Info className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        <CardTitle className="text-emerald-900 dark:text-emerald-100 text-left">
                          Cómo usar esta herramienta
                        </CardTitle>
                      </div>
                      <ChevronDown className="h-4 w-4 text-emerald-600 dark:text-emerald-400 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    </div>
                  </CollapsibleTrigger>
                </CardHeader>
                
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="space-y-3 text-sm text-emerald-800 dark:text-emerald-200">
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-100 rounded-full flex items-center justify-center text-xs font-semibold">1</span>
                        <p>Pega las URLs de Vimeo en el campo de texto (una por línea o separadas por comas)</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-100 rounded-full flex items-center justify-center text-xs font-semibold">2</span>
                        <p>Haz clic en "Obtener Transcripciones" y disfruta de los chistes mientras esperas</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-100 rounded-full flex items-center justify-center text-xs font-semibold">3</span>
                        <p>Copia o descarga las transcripciones individualmente o todas juntas</p>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800/30">
                      <p className="text-emerald-700 dark:text-emerald-300 text-xs font-medium">
                        💡 Solo funcionará con videos que tengan transcripciones automáticas habilitadas y con el token correcto configurado en el servidor.
                      </p>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Quick Help Button */}
            {!showInstructions && (
              <div className="text-center">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowInstructions(true)}
                  className="text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800"
                >
                  <Info className="w-4 h-4 mr-2" />
                  ¿Necesitas ayuda?
                </Button>
              </div>
            )}
          </div>

          {/* Features - More subtle styling */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="text-center hover:shadow-md transition-shadow border-zinc-200 dark:border-zinc-800">
              <CardContent className="pt-6">
                <Zap className="w-6 h-6 mx-auto mb-3 text-violet-600 dark:text-violet-400" />
                <h3 className="font-semibold mb-2 text-zinc-900 dark:text-zinc-100">Procesamiento masivo</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Múltiples videos simultáneamente
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-md transition-shadow border-zinc-200 dark:border-zinc-800">
              <CardContent className="pt-6">
                <FileText className="w-6 h-6 mx-auto mb-3 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-semibold mb-2 text-zinc-900 dark:text-zinc-100">Múltiples formatos</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Diferentes formatos de URLs
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-md transition-shadow border-zinc-200 dark:border-zinc-800">
              <CardContent className="pt-6">
                <ExternalLink className="w-6 h-6 mx-auto mb-3 text-rose-600 dark:text-rose-400" />
                <h3 className="font-semibold mb-2 text-zinc-900 dark:text-zinc-100">Fácil exportación</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Copia o descarga transcripciones
                </p>
              </CardContent>
            </Card>
          </div>

          <Separator className="bg-zinc-200 dark:bg-zinc-800" />

          {/* Results Section - Scroll Target */}
          <div ref={resultsRef}>
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
              <Card className="text-center py-12 border-zinc-200 dark:border-zinc-800">
                <CardContent>
                  <div className="text-zinc-400 dark:text-zinc-500 text-6xl mb-6">🎬</div>
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
                    ¡Listo para procesar videos!
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
                    Introduce las URLs de Vimeo arriba para comenzar a extraer las transcripciones automáticamente.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Creado por{' '}
                <a 
                  href="https://github.com/joseluisalmendral" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-semibold text-zinc-900 dark:text-zinc-100 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
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
                  className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
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
                  className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
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