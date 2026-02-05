import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProcessMonitor } from '@/components/dashboard/ProcessMonitor';
import { AIAssistant } from '@/components/dashboard/AIAssistant';
import { Cpu } from 'lucide-react';

export default function ProcessesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Cpu className="h-6 w-6 text-primary" />
            Process Monitor
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor and manage system processes in real-time
          </p>
        </div>

        {/* Process Monitor Component */}
        <ProcessMonitor />
      </div>

      <AIAssistant />
    </DashboardLayout>
  );
}
