import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileSearch,
  Cpu,
  AlertTriangle,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSystemStore } from '@/stores/systemStore';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: FileSearch, label: 'File Scanner', path: '/scanner' },
  { icon: Cpu, label: 'Process Monitor', path: '/processes' },
  { icon: AlertTriangle, label: 'Security Alerts', path: '/alerts' },
  { icon: MessageSquare, label: 'AI Assistant', path: '/assistant' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar() {
  const location = useLocation();
  const { sidebarCollapsed, toggleSidebar, alerts } = useSystemStore();
  const unreadAlerts = alerts.filter((a) => !a.read).length;

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen glass-card border-r border-border/50 transition-all duration-300 flex flex-col',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-4 border-b border-border/50">
        <div className="relative">
          <Shield className="h-8 w-8 text-primary" />
          <div className="absolute inset-0 blur-lg bg-primary/30 -z-10" />
        </div>
        {!sidebarCollapsed && (
          <div className="animate-fade-in">
            <h1 className="font-bold text-lg tracking-tight">
              Vigilant<span className="text-primary">AI</span>
            </h1>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Security Dashboard
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const hasNotification = item.path === '/alerts' && unreadAlerts > 0;

          const linkContent = (
            <Link
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative',
                isActive
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              )}
            >
              <item.icon
                className={cn(
                  'h-5 w-5 shrink-0 transition-transform group-hover:scale-110',
                  isActive && 'drop-shadow-[0_0_8px_hsl(var(--primary))]'
                )}
              />
              {!sidebarCollapsed && (
                <span className="text-sm font-medium animate-fade-in">{item.label}</span>
              )}
              {hasNotification && (
                <span
                  className={cn(
                    'flex items-center justify-center min-w-[18px] h-[18px] text-[10px] font-bold rounded-full bg-destructive text-destructive-foreground',
                    sidebarCollapsed ? 'absolute -top-1 -right-1' : 'ml-auto'
                  )}
                >
                  {unreadAlerts}
                </span>
              )}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
              )}
            </Link>
          );

          if (sidebarCollapsed) {
            return (
              <Tooltip key={item.path} delayDuration={0}>
                <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                <TooltipContent side="right" className="glass-card">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          }

          return <div key={item.path}>{linkContent}</div>;
        })}
      </nav>

      {/* Collapse Button */}
      <div className="p-3 border-t border-border/50">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="w-full justify-center text-muted-foreground hover:text-foreground"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span className="text-xs">Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
