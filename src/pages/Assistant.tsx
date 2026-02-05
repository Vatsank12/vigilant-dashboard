import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AIAssistant } from '@/components/dashboard/AIAssistant';
import { MessageSquare } from 'lucide-react';

export default function AssistantPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            AI Security Assistant
          </h1>
          <p className="text-muted-foreground mt-1">
            Your intelligent security companion
          </p>
        </div>

        {/* Centered AI Chat */}
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4 max-w-md">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto neon-glow">
              <MessageSquare className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">AI Assistant Ready</h2>
            <p className="text-muted-foreground">
              Click the chat button in the bottom right corner to start a conversation 
              with your AI Security Assistant. Ask questions about system security, 
              run scans, or get recommendations.
            </p>
          </div>
        </div>
      </div>

      <AIAssistant />
    </DashboardLayout>
  );
}
