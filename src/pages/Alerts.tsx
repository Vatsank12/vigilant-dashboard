import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AIAssistant } from '@/components/dashboard/AIAssistant';
import { useSystemStore } from '@/stores/systemStore';
import {
  AlertTriangle,
  CheckCircle,
  Info,
  X,
  Filter,
  Bell,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function AlertsPage() {
  const { alerts, dismissAlert, markAlertRead } = useSystemStore();
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');

  const filteredAlerts = alerts.filter((a) => filter === 'all' || a.type === filter);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case 'warning':
        return <Clock className="h-5 w-5 text-warning" />;
      default:
        return <Info className="h-5 w-5 text-primary" />;
    }
  };

  const getAlertBg = (type: string) => {
    switch (type) {
      case 'critical':
        return 'border-destructive/30 bg-destructive/5';
      case 'warning':
        return 'border-warning/30 bg-warning/5';
      default:
        return 'border-primary/30 bg-primary/5';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Bell className="h-6 w-6 text-primary" />
              Security Alerts
            </h1>
            <p className="text-muted-foreground mt-1">
              Monitor and respond to security events
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                {filter === 'all' ? 'All Alerts' : filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="glass-card">
              <DropdownMenuItem onClick={() => setFilter('all')}>All Alerts</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('critical')}>Critical Only</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('warning')}>Warnings Only</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('info')}>Info Only</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="glass-card p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <div className="text-2xl font-bold font-mono">
                {alerts.filter((a) => a.type === 'critical').length}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Critical</div>
            </div>
          </div>
          <div className="glass-card p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <div className="text-2xl font-bold font-mono">
                {alerts.filter((a) => a.type === 'warning').length}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Warnings</div>
            </div>
          </div>
          <div className="glass-card p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <div>
              <div className="text-2xl font-bold font-mono">
                {alerts.filter((a) => a.read).length}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Resolved</div>
            </div>
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-3">
          {filteredAlerts.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
              <h3 className="font-semibold text-lg">No alerts</h3>
              <p className="text-muted-foreground">All systems operating normally</p>
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  'glass-card p-4 border rounded-lg flex items-start gap-4 transition-all',
                  getAlertBg(alert.type),
                  !alert.read && 'ring-1 ring-primary/20'
                )}
                onClick={() => markAlertRead(alert.id)}
              >
                <div className="mt-0.5">{getAlertIcon(alert.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{alert.title}</h3>
                    {!alert.read && (
                      <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px]">
                        New
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                  <span className="text-xs text-muted-foreground mt-2 block">
                    {formatTime(alert.timestamp)}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    dismissAlert(alert.id);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>

      <AIAssistant />
    </DashboardLayout>
  );
}
