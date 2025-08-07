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
      <Card className="border-2 border-dashed border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Resultados del Procesamiento
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                {results.length}
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                Videos Procesados
              </div>
              <FileText className="w-6 h-6 mx-auto mt-2 text-blue-500 dark:text-blue-400" />
            </div>
            
            <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                {successCount}
              </div>
              <div className="text-sm text-green-700 dark:text-green-300 font-medium">
                Transcripciones Exitosas
              </div>
              <CheckCircle className="w-6 h-6 mx-auto mt-2 text-green-500 dark:text-green-400" />
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
            <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  ¡Perfecto! Se han procesado exitosamente {successCount} transcripción{successCount !== 1 ? 'es' : ''}.
                </p>
                <p className="text-xs text-green-700 dark:text-green-300 mt-1">
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
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Acciones Globales</CardTitle>
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
            
            <Separator className="my-4" />
            
            <div className="text-center text-xs text-gray-500 dark:text-gray-400">
              {successCount > 1 ? 'Las transcripciones se combinarán' : 'La transcripción se procesará'} en un solo archivo
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TranscriptList;