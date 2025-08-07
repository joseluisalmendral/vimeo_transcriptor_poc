import { useState } from 'react';
import { copyToClipboard, downloadTextFile } from '../utils/download';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { useToast } from '../hooks/use-toast';
import { 
  Copy, 
  Download, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle, 
  XCircle, 
  ExternalLink,
  FileText,
  Globe,
  Hash
} from 'lucide-react';

const TranscriptCard = ({ result }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();

  // Función para truncar el título
  const truncateTitle = (title, maxLength = 60) => {
    if (!title || title.length <= maxLength) return title;
    return title.substring(0, maxLength).trim() + '...';
  };

  const handleCopy = async () => {
    if (!result.transcript) return;

    const success = await copyToClipboard(result.transcript);
    if (success) {
      toast({
        title: "¡Copiado!",
        description: "Transcripción copiada al portapapeles",
      });
    } else {
      toast({
        title: "Error",
        description: "No se pudo copiar al portapapeles",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    if (!result.transcript) return;
    
    // Crear nombre de archivo seguro basado en el título del video
    const sanitizeFilename = (name) => {
      return name.replace(/[^a-z0-9\s\-\_]/gi, '').replace(/\s+/g, '_').substring(0, 50);
    };
    
    const safeTitle = result.title ? sanitizeFilename(result.title) : `video_${result.videoId}`;
    const filename = `transcript_${safeTitle}_${Date.now()}.txt`;
    
    const content = `Transcripción de Vimeo\n` +
                   `Título: ${result.title || 'Sin título'}\n` +
                   `Video ID: ${result.videoId}\n` +
                   `URL Original: ${result.originalUrl}\n` +
                   `Idioma: ${result.language || 'N/A'}\n` +
                   `Pista: ${result.trackName || 'N/A'}\n` +
                   `Fecha: ${new Date().toISOString()}\n\n` +
                   `--- TRANSCRIPCIÓN ---\n\n` +
                   `${result.transcript}`;
    
    downloadTextFile(content, filename);
    
    toast({
      title: "¡Descarga iniciada!",
      description: "El archivo se está descargando",
    });
  };

  const truncatedTranscript = result.transcript && result.transcript.length > 300
    ? result.transcript.substring(0, 300) + '...'
    : result.transcript;

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-800">
      <CardHeader className="pb-4">
        {/* Status Badge & Title */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
              <CardTitle className="text-lg truncate" title={result.title || `Video ${result.videoId || 'Desconocido'}`}>
                {truncateTitle(result.title || `Video ${result.videoId || 'Desconocido'}`)}
              </CardTitle>
            </div>
            
            <CardDescription className="flex items-center gap-2 text-sm">
              <ExternalLink className="w-3 h-3 flex-shrink-0" />
              <span className="truncate" title={result.originalUrl}>
                {result.originalUrl}
              </span>
            </CardDescription>
          </div>
          
          {/* Status Badge */}
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
            result.status === 'success'
              ? 'bg-green-100 dark:bg-green-950/30 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
              : 'bg-red-100 dark:bg-red-950/30 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
          }`}>
            {result.status === 'success' ? (
              <CheckCircle className="w-3 h-3" />
            ) : (
              <XCircle className="w-3 h-3" />
            )}
            {result.status === 'success' ? 'Éxito' : 'Error'}
          </div>
        </div>

        {/* Metadata */}
        {result.status === 'success' && (
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            {result.language && (
              <div className="flex items-center gap-1">
                <Globe className="w-3 h-3" />
                <span>{result.language}</span>
              </div>
            )}
            {result.videoId && (
              <div className="flex items-center gap-1">
                <Hash className="w-3 h-3" />
                <span>{result.videoId}</span>
              </div>
            )}
            {result.trackName && (
              <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                {result.trackName}
              </span>
            )}
          </div>
        )}
      </CardHeader>

      <Separator />

      <CardContent className="pt-4">
        {result.status === 'success' && result.transcript ? (
          <div className="space-y-4">
            {/* Transcript Content */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Transcripción
                </h4>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {result.transcript.length.toLocaleString()} caracteres
                </div>
              </div>
              
              <div className="relative">
                <pre className={`text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-sans leading-relaxed ${
                  isExpanded ? 'max-h-none' : 'max-h-32 overflow-hidden'
                }`}>
                  {isExpanded ? result.transcript : truncatedTranscript}
                </pre>
                
                {result.transcript.length > 300 && (
                  <div className={`${
                    isExpanded ? 'static mt-3' : 'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-50 dark:from-gray-900/50 to-transparent h-8'
                  } flex ${isExpanded ? 'justify-start' : 'items-end justify-center'}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="text-xs bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      {isExpanded ? (
                        <>
                          Ver menos <ChevronUp className="w-3 h-3 ml-1" />
                        </>
                      ) : (
                        <>
                          Ver más <ChevronDown className="w-3 h-3 ml-1" />
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={handleCopy}
                className="flex-1"
                size="sm"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar
              </Button>
              
              <Button
                variant="outline"
                onClick={handleDownload}
                size="sm"
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                Descargar
              </Button>
            </div>
          </div>
        ) : (
          /* Error State */
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-red-800 dark:text-red-300">
                  No hay transcripción disponible
                </h4>
                <p className="text-sm text-red-700 dark:text-red-400">
                  {result.error || 'Error desconocido al procesar el video'}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TranscriptCard;