import { useState, useCallback } from 'react';
import {
  FileUp,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Hash,
  Loader2,
  Trash2,
  FileText,
  File,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ScannedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  hash: string;
  threatScore: number;
  status: 'clean' | 'suspicious' | 'malicious';
  scannedAt: Date;
}

type ScanStage = 'idle' | 'hashing' | 'signature' | 'heuristics' | 'complete';

const stageLabels: Record<ScanStage, string> = {
  idle: 'Ready to scan',
  hashing: 'Computing SHA-256 hash...',
  signature: 'Checking virus signatures...',
  heuristics: 'Running AI heuristics...',
  complete: 'Scan complete',
};

const stageProgress: Record<ScanStage, number> = {
  idle: 0,
  hashing: 25,
  signature: 55,
  heuristics: 85,
  complete: 100,
};

function generateHash(): string {
  return Array.from({ length: 64 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function FileScanner() {
  const [isDragging, setIsDragging] = useState(false);
  const [scanStage, setScanStage] = useState<ScanStage>('idle');
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [scannedFiles, setScannedFiles] = useState<ScannedFile[]>([]);
  const [quarantineDialog, setQuarantineDialog] = useState<ScannedFile | null>(null);

  const allowedTypes = [
    'application/pdf',
    'application/zip',
    'application/x-executable',
    'text/plain',
    'image/png',
    'image/jpeg',
    'application/javascript',
    'text/html',
  ];

  const simulateScan = useCallback(async (file: File) => {
    setCurrentFile(file.name);
    setScanStage('hashing');
    await new Promise((r) => setTimeout(r, 800));
    
    setScanStage('signature');
    await new Promise((r) => setTimeout(r, 1000));
    
    setScanStage('heuristics');
    await new Promise((r) => setTimeout(r, 1200));
    
    setScanStage('complete');

    // Generate threat score (weighted towards clean files)
    const randomValue = Math.random();
    let threatScore: number;
    let status: ScannedFile['status'];

    if (randomValue < 0.7) {
      threatScore = Math.floor(Math.random() * 20);
      status = 'clean';
    } else if (randomValue < 0.9) {
      threatScore = Math.floor(Math.random() * 40) + 30;
      status = 'suspicious';
    } else {
      threatScore = Math.floor(Math.random() * 30) + 70;
      status = 'malicious';
    }

    const scannedFile: ScannedFile = {
      id: Date.now().toString(),
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type || 'unknown',
      hash: generateHash(),
      threatScore,
      status,
      scannedAt: new Date(),
    };

    setScannedFiles((prev) => [scannedFile, ...prev]);
    
    await new Promise((r) => setTimeout(r, 500));
    setScanStage('idle');
    setCurrentFile(null);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      for (const file of files) {
        await simulateScan(file);
      }
    },
    [simulateScan]
  );

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      for (const file of files) {
        await simulateScan(file);
      }
      e.target.value = '';
    },
    [simulateScan]
  );

  const handleQuarantine = (file: ScannedFile) => {
    setScannedFiles((prev) => prev.filter((f) => f.id !== file.id));
    setQuarantineDialog(null);
  };

  const getStatusIcon = (status: ScannedFile['status']) => {
    switch (status) {
      case 'clean':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'suspicious':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'malicious':
        return <XCircle className="h-4 w-4 text-destructive" />;
    }
  };

  const getStatusBadge = (status: ScannedFile['status']) => {
    switch (status) {
      case 'clean':
        return <Badge className="bg-success/20 text-success border-success/30">Clean</Badge>;
      case 'suspicious':
        return <Badge className="bg-warning/20 text-warning border-warning/30">Suspicious</Badge>;
      case 'malicious':
        return <Badge className="bg-destructive/20 text-destructive border-destructive/30">Malicious</Badge>;
    }
  };

  const getThreatColor = (score: number) => {
    if (score < 30) return 'text-success';
    if (score < 60) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className="space-y-6">
      {/* Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          'relative glass-card border-2 border-dashed rounded-xl p-8 transition-all duration-300 cursor-pointer',
          isDragging
            ? 'border-primary bg-primary/5 scale-[1.02]'
            : 'border-border/50 hover:border-primary/50',
          scanStage !== 'idle' && 'pointer-events-none opacity-80'
        )}
      >
        <input
          type="file"
          multiple
          onChange={handleFileSelect}
          className="absolute inset-0 opacity-0 cursor-pointer"
          disabled={scanStage !== 'idle'}
        />

        <div className="flex flex-col items-center gap-4 text-center">
          <div
            className={cn(
              'p-4 rounded-full transition-all',
              isDragging ? 'bg-primary/20 scale-110' : 'bg-secondary'
            )}
          >
            {scanStage !== 'idle' ? (
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            ) : (
              <FileUp className={cn('h-8 w-8', isDragging ? 'text-primary' : 'text-muted-foreground')} />
            )}
          </div>

          {scanStage === 'idle' ? (
            <>
              <div>
                <h3 className="text-lg font-semibold">Drop files to scan</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  or click to browse your files
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="outline">.pdf</Badge>
                <Badge variant="outline">.zip</Badge>
                <Badge variant="outline">.exe</Badge>
                <Badge variant="outline">.js</Badge>
                <Badge variant="outline">.html</Badge>
              </div>
            </>
          ) : (
            <>
              <div>
                <h3 className="text-lg font-semibold text-primary">{currentFile}</h3>
                <p className="text-sm text-muted-foreground mt-1">{stageLabels[scanStage]}</p>
              </div>
              <div className="w-full max-w-md">
                <Progress value={stageProgress[scanStage]} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>Hash</span>
                  <span>Signature</span>
                  <span>AI Analysis</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Results Table */}
      {scannedFiles.length > 0 && (
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Scan Results</h3>
              <Badge variant="outline">{scannedFiles.length} files</Badge>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead>Status</TableHead>
                <TableHead>File Name</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Threat Score</TableHead>
                <TableHead className="hidden lg:table-cell">SHA-256</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scannedFiles.map((file) => (
                <TableRow key={file.id} className="border-border/50">
                  <TableCell>{getStatusBadge(file.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <File className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{file.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{file.size}</TableCell>
                  <TableCell>
                    <span className={cn('font-mono font-bold', getThreatColor(file.threatScore))}>
                      {file.threatScore}%
                    </span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <code className="text-xs text-muted-foreground font-mono">
                      {file.hash.substring(0, 16)}...
                    </code>
                  </TableCell>
                  <TableCell>
                    {file.status !== 'clean' && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setQuarantineDialog(file)}
                        className="gap-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        Quarantine
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Quarantine Dialog */}
      <Dialog open={!!quarantineDialog} onOpenChange={() => setQuarantineDialog(null)}>
        <DialogContent className="glass-card border-destructive/30">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Quarantine File
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to quarantine{' '}
              <span className="font-semibold text-foreground">{quarantineDialog?.name}</span>?
              This will isolate the file and prevent it from running.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setQuarantineDialog(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => quarantineDialog && handleQuarantine(quarantineDialog)}>
              Quarantine
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
