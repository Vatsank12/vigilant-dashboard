import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { FileScanner } from '@/components/dashboard/FileScanner';
import { AIAssistant } from '@/components/dashboard/AIAssistant';
import { FileSearch, ShieldCheck, Zap } from 'lucide-react';

export default function ScannerPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileSearch className="h-6 w-6 text-primary" />
            File Security Scanner
          </h1>
          <p className="text-muted-foreground mt-1">
            Upload files for deep security analysis and threat detection
          </p>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Multi-Stage Scan</h3>
                <p className="text-xs text-muted-foreground">
                  Hash, signature, and AI analysis
                </p>
              </div>
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <Zap className="h-5 w-5 text-success" />
              </div>
              <div>
                <h3 className="font-medium">Real-time Results</h3>
                <p className="text-xs text-muted-foreground">
                  Instant threat detection
                </p>
              </div>
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <FileSearch className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <h3 className="font-medium">Auto Quarantine</h3>
                <p className="text-xs text-muted-foreground">
                  Isolate malicious files
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scanner Component */}
        <FileScanner />
      </div>

      <AIAssistant />
    </DashboardLayout>
  );
}
