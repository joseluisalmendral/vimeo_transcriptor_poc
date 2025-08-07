import TranscriptCard from './TranscriptCard';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { useToast } from '../hooks/use-toast';
import { 
  Download, 
  Copy, 
  CheckCircle, 
  XCircle, 
  FileText, 
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

const TranscriptList = ({ results }) => {
  const { toast } = useToast();

  if (!results || results.length === 0) {
    return null;
  }

  const successCount = results.filter(r => r.status === 'success').length;
  const errorCount = results.filter(r => r.status === 'error').length;

  const handleDownloadAll = () => {
    const allTranscripts = results
      .filter(r => r.status === 'success' && r.transcript)
      .map(r => `=== ${r.title || `Video ${r.videoId}`} ===\nURL: ${r.originalUrl}\n\n${r.transcript}\n\n`)
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
      
      toast({
        title: "¡Descarga iniciada!",
        description: `Descargando ${successCount} transcripción${successCount !== 1 ? 'es' : ''}`,
      });
    }
  };

  const handleCopyAll = async () => {
    const allTranscripts = results
      .filter(r => r.status === 'success' && r.transcript)
      .map(r => `=== ${r.title || `Video ${r.videoId}`} ===\n${r.transcript}`)
      .join('\n\n');
    
    if (allTranscripts) {
      try {
        await navigator.clipboard.writeText(allTranscripts);
        toast({
          title: "¡Copiado!",
          description: `${successCount} transcripción${successCount !== 1 ? 'es' : ''} copiada${successCount !== 1 ? 's' : ''} al portapapeles`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo copiar al portapapeles",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Summary */}
      <Card className="border-2 border-dashed border-zinc-200 dark:border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
            <TrendingUp className="w-5 h-5" />
            Resultados del Procesamiento
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-violet-50 dark:bg-violet-950/20 rounded-lg border border-violet-200 dark:border-violet-800">
              <div className="text-3xl font-bold text-violet-600 dark:text-violet-400 mb-1">
                {results.length}
              </div>
              <div className="text-sm text-violet-700 dark:text-violet-300 font-medium">
                Videos Procesados
              </div>
              <FileText className="w-6 h-6 mx-auto mt-2 text-violet-500 dark:text-violet-400" />
            </div>
            
            <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                {successCount}
              </div>
              <div className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">
                Transcripciones Exitosas
              </div>
              <CheckCircle className="w-6 h-6 mx-auto mt-2 text-emerald-500 dark:text-emerald-400" />
            </div>
            
            <div className="text-center p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
              <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">
                {errorCount}
              </div>
              <div className="text-sm text-red-700 dark:text-red-300 font-medium">
                Con Errores
              </div>
              <XCircle className="w-6 h-6 mx-auto mt-2 text-red-500 dark:text-red-400" />
            </div>
          </div>

          {/* Success Message */}
          {successCount > 0 && (
            <div className="flex items-start gap-3 p-4 mb-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                  ¡Perfecto! Se han procesado exitosamente {successCount} transcripción{successCount !== 1 ? 'es' : ''}.
                </p>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                  Puedes copiar o descargar las transcripciones individualmente o todas juntas.
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorCount > 0 && (
            <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  {errorCount} video{errorCount !== 1 ? 's' : ''} no se pudo{errorCount !== 1 ? 'ieron' : ''} procesar.
                </p>
                <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                  Verifica que los videos tengan transcripciones automáticas habilitadas.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {results.map((result, index) => (
          <TranscriptCard 
            key={`${result.videoId || 'invalid'}-${index}`} 
            result={result}
          />
        ))}
      </div>

      {/* Global Actions */}
      {successCount > 0 && (
        <Card className="border-zinc-200 dark:border-zinc-800">
          <CardHeader>
            <CardTitle className="text-lg text-zinc-900 dark:text-zinc-100">Acciones Globales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                onClick={handleDownloadAll}
                className="flex items-center justify-center gap-2"
                size="lg"
              >
                <Download className="w-5 h-5" />
                Descargar Todas ({successCount})
              </Button>
              
              <Button
                variant="outline"
                onClick={handleCopyAll}
                className="flex items-center justify-center gap-2"
                size="lg"
              >
                <Copy className="w-5 h-5" />
                Copiar Todas ({successCount})
              </Button>
            </div>
            
            <Separator className="my-4 bg-zinc-200 dark:bg-zinc-800" />
            
            <div className="text-center text-xs text-zinc-500 dark:text-zinc-400">
              {successCount > 1 ? 'Las transcripciones se combinarán' : 'La transcripción se procesará'} en un solo archivo
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TranscriptList;