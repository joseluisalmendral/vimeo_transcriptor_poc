import { useState, useEffect } from 'react';
import { getRandomJoke } from '../utils/jokes';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { Loader2, Smile } from 'lucide-react';

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

  const progressPercentage = progress.total > 0 ? (progress.current / progress.total) * 100 : 0;

  return (
    <Card className="w-full bg-gradient-to-br from-violet-50 to-emerald-50 dark:from-zinc-900 dark:to-zinc-800 border-violet-200 dark:border-zinc-700">
      <CardContent className="p-8">
        <div className="text-center space-y-6">
          {/* Animated Spinner */}
          <div className="flex justify-center">
            <div className="relative">
              <Loader2 className="w-12 h-12 text-violet-600 dark:text-violet-400 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 bg-violet-600 dark:bg-violet-400 rounded-full opacity-20 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Progress Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                Progreso
              </span>
              <span className="text-zinc-500 dark:text-zinc-400">
                {progress.current} de {progress.total}
              </span>
            </div>
            
            <Progress value={progressPercentage} className="h-2" />
            
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              {Math.round(progressPercentage)}% completado
            </div>
          </div>

          {/* Current Status */}
          {currentStatus && (
            <Card className="bg-white/50 dark:bg-zinc-800/50 border-white/20 dark:border-zinc-700/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 font-medium">
                    {currentStatus}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <Separator className="bg-zinc-200 dark:bg-zinc-800" />

          {/* Joke Section */}
          <Card className="bg-white/70 dark:bg-zinc-800/70 border-white/30 dark:border-zinc-700/30">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Smile className="w-5 h-5 text-amber-500" />
                <span className="text-zinc-600 dark:text-zinc-300">
                  Mientras esperas...
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-zinc-800 dark:text-zinc-200 leading-relaxed">
                {currentJoke}
              </p>
            </CardContent>
          </Card>

          {/* Footer Message */}
          <div className="space-y-2">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Procesando transcripciones de Vimeo...
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-zinc-500 dark:text-zinc-500">
              <div className="w-1 h-1 bg-zinc-400 rounded-full animate-bounce" />
              <div className="w-1 h-1 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.1s]" />
              <div className="w-1 h-1 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.2s]" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoadingJokes;