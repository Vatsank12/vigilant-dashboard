import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MetricsGrid } from '@/components/dashboard/MetricsGrid';
import { FileScanner } from '@/components/dashboard/FileScanner';
import { ProcessMonitor } from '@/components/dashboard/ProcessMonitor';
import { AIAssistant } from '@/components/dashboard/AIAssistant';
import { useAlertSystem } from '@/hooks/useAlertSystem';
import { useSystemStore } from '@/stores/systemStore';
import { Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  useAlertSystem();
  const { alerts } = useSystemStore();
  const criticalAlerts = alerts.filter((a) => a.type === 'critical' && !a.read).length;
  const warningAlerts = alerts.filter((a) => a.type === 'warning' && !a.read).length;

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              Security Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Real-time system monitoring and threat detection
            </p>
          </div>
          <div className="flex items-center gap-4">
            {criticalAlerts > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-destructive/10 border border-destructive/30 animate-pulse">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <span className="text-sm font-medium text-destructive">
                  {criticalAlerts} Critical
                </span>
              </div>
            )}
            {warningAlerts > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-warning/10 border border-warning/30">
                <Clock className="h-4 w-4 text-warning" />
                <span className="text-sm font-medium text-warning">
                  {warningAlerts} Warnings
                </span>
              </div>
            )}
            {criticalAlerts === 0 && warningAlerts === 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-success/10 border border-success/30">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="text-sm font-medium text-success">All Clear</span>
              </div>
            )}
          </div>
        </div>

        {/* Real-Time Metrics */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            System Metrics
          </h2>
          <MetricsGrid />
        </section>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* File Scanner */}
          <section>
            <h2 className="text-lg font-semibold mb-4">File Security Scanner</h2>
            <FileScanner />
          </section>

          {/* Process Monitor */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Process Monitor</h2>
            <ProcessMonitor />
          </section>
        </div>
      </div>

      {/* Floating AI Assistant */}
      <AIAssistant />
    </DashboardLayout>
  );
}
