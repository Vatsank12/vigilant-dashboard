import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useSystemStore } from '@/stores/systemStore';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { sidebarCollapsed } = useSystemStore();

  return (
    <div className="min-h-screen bg-background cyber-grid-bg">
      <Sidebar />
      <TopBar />
      <main
        className={cn(
          'pt-20 pb-6 px-6 transition-all duration-300',
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        )}
      >
        {children}
      </main>
    </div>
  );
}
