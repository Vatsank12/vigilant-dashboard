import { useState } from 'react';
import { Search, Bell, User, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSystemStore } from '@/stores/systemStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

export function TopBar() {
  const { healthScore, alerts, sidebarCollapsed, markAlertRead } = useSystemStore();
  const [searchQuery, setSearchQuery] = useState('');
  const unreadAlerts = alerts.filter((a) => !a.read);

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getHealthGlow = (score: number) => {
    if (score >= 80) return 'drop-shadow-[0_0_10px_hsl(var(--success))]';
    if (score >= 60) return 'drop-shadow-[0_0_10px_hsl(var(--warning))]';
    return 'drop-shadow-[0_0_10px_hsl(var(--destructive))]';
  };

  return (
    <header
      className={cn(
        'fixed top-0 right-0 z-30 h-16 glass-card border-b border-border/50 flex items-center justify-between px-6 transition-all duration-300',
        sidebarCollapsed ? 'left-16' : 'left-64'
      )}
    >
      {/* Search */}
      <div className="relative w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search threats, processes, files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-secondary/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
        />
      </div>

      <div className="flex items-center gap-4">
        {/* Health Score */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-secondary/30 border border-border/30">
          <div className="relative">
            <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="3"
              />
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={`${healthScore} 100`}
                strokeLinecap="round"
                className={cn(getHealthColor(healthScore), getHealthGlow(healthScore), 'transition-all duration-500')}
              />
            </svg>
            <Activity className={cn('absolute inset-0 m-auto h-4 w-4', getHealthColor(healthScore))} />
          </div>
          <div>
            <div className={cn('text-lg font-bold font-mono', getHealthColor(healthScore))}>
              {healthScore}%
            </div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Health
            </div>
          </div>
        </div>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] text-[10px] font-bold rounded-full bg-destructive text-destructive-foreground animate-pulse">
                  {unreadAlerts.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 glass-card">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              {unreadAlerts.length > 0 && (
                <Badge variant="destructive" className="text-[10px]">
                  {unreadAlerts.length} new
                </Badge>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {alerts.slice(0, 5).map((alert) => (
              <DropdownMenuItem
                key={alert.id}
                className={cn('flex flex-col items-start gap-1 cursor-pointer', !alert.read && 'bg-primary/5')}
                onClick={() => markAlertRead(alert.id)}
              >
                <div className="flex items-center gap-2 w-full">
                  <span
                    className={cn(
                      'w-2 h-2 rounded-full',
                      alert.type === 'critical' && 'bg-destructive',
                      alert.type === 'warning' && 'bg-warning',
                      alert.type === 'info' && 'bg-primary'
                    )}
                  />
                  <span className="font-medium text-sm">{alert.title}</span>
                </div>
                <span className="text-xs text-muted-foreground pl-4">{alert.message}</span>
              </DropdownMenuItem>
            ))}
            {alerts.length === 0 && (
              <div className="p-4 text-center text-muted-foreground text-sm">
                No notifications
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                <User className="h-4 w-4 text-primary" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="glass-card">
            <DropdownMenuLabel>Admin User</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile Settings</DropdownMenuItem>
            <DropdownMenuItem>Security Preferences</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
