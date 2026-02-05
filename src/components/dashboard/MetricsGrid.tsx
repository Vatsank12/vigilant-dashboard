import { useEffect, useMemo } from 'react';
import { Cpu, MemoryStick, HardDrive, Wifi, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSystemStore } from '@/stores/systemStore';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';

interface MetricCardProps {
  title: string;
  value: number;
  unit: string;
  icon: React.ElementType;
  history: number[];
  color: 'cyan' | 'purple' | 'orange' | 'green';
}

const colorMap = {
  cyan: {
    stroke: 'hsl(185, 100%, 50%)',
    fill: 'url(#cyanGradient)',
    text: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/20',
  },
  purple: {
    stroke: 'hsl(270, 100%, 65%)',
    fill: 'url(#purpleGradient)',
    text: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
  },
  orange: {
    stroke: 'hsl(38, 92%, 50%)',
    fill: 'url(#orangeGradient)',
    text: 'text-warning',
    bg: 'bg-warning/10',
    border: 'border-warning/20',
  },
  green: {
    stroke: 'hsl(142, 70%, 45%)',
    fill: 'url(#greenGradient)',
    text: 'text-success',
    bg: 'bg-success/10',
    border: 'border-success/20',
  },
};

function MetricCard({ title, value, unit, icon: Icon, history, color }: MetricCardProps) {
  const colors = colorMap[color];
  const chartData = useMemo(() => history.map((v, i) => ({ value: v, index: i })), [history]);

  const trend = useMemo(() => {
    if (history.length < 2) return 0;
    const recent = history.slice(-5);
    const older = history.slice(-10, -5);
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const olderAvg = older.length > 0 ? older.reduce((a, b) => a + b, 0) / older.length : recentAvg;
    return recentAvg - olderAvg;
  }, [history]);

  const TrendIcon = trend > 2 ? TrendingUp : trend < -2 ? TrendingDown : Minus;
  const trendColor = trend > 2 ? 'text-destructive' : trend < -2 ? 'text-success' : 'text-muted-foreground';

  const getStatusColor = (val: number) => {
    if (val >= 90) return 'bg-destructive';
    if (val >= 70) return 'bg-warning';
    return 'bg-success';
  };

  return (
    <div className={cn('glass-card-hover p-4 relative overflow-hidden', colors.border)}>
      {/* Background glow */}
      <div
        className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: colors.stroke }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className={cn('p-2 rounded-lg', colors.bg)}>
            <Icon className={cn('h-5 w-5', colors.text)} />
          </div>
          <div className="flex items-center gap-1">
            <TrendIcon className={cn('h-4 w-4', trendColor)} />
            <span className={cn('text-xs font-mono', trendColor)}>
              {Math.abs(trend).toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Value */}
        <div className="mb-2">
          <div className={cn('data-value', colors.text)}>
            {value.toFixed(1)}
            <span className="text-lg text-muted-foreground ml-1">{unit}</span>
          </div>
          <div className="data-label">{title}</div>
        </div>

        {/* Sparkline */}
        <div className="h-12 -mx-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id={`${color}Gradient`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors.stroke} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={colors.stroke} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={colors.stroke}
                strokeWidth={2}
                fill={`url(#${color}Gradient)`}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1 bg-secondary rounded-full overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all duration-500', getStatusColor(value))}
            style={{ width: `${Math.min(100, value)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export function MetricsGrid() {
  const { metrics, updateMetrics } = useSystemStore();

  useEffect(() => {
    const interval = setInterval(() => {
      const newCpu = Math.max(5, Math.min(95, metrics.cpu + (Math.random() - 0.5) * 10));
      const newRam = Math.max(20, Math.min(95, metrics.ram + (Math.random() - 0.5) * 5));
      const newDisk = Math.max(50, Math.min(95, metrics.disk + (Math.random() - 0.5) * 2));
      const newNetwork = Math.max(1, Math.min(100, metrics.network + (Math.random() - 0.5) * 20));

      updateMetrics({
        cpu: newCpu,
        ram: newRam,
        disk: newDisk,
        network: newNetwork,
        cpuHistory: [...metrics.cpuHistory.slice(-29), newCpu],
        ramHistory: [...metrics.ramHistory.slice(-29), newRam],
        diskHistory: [...metrics.diskHistory.slice(-29), newDisk],
        networkHistory: [...metrics.networkHistory.slice(-29), newNetwork],
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [metrics, updateMetrics]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="CPU Usage"
        value={metrics.cpu}
        unit="%"
        icon={Cpu}
        history={metrics.cpuHistory}
        color="cyan"
      />
      <MetricCard
        title="Memory"
        value={metrics.ram}
        unit="%"
        icon={MemoryStick}
        history={metrics.ramHistory}
        color="purple"
      />
      <MetricCard
        title="Disk I/O"
        value={metrics.disk}
        unit="%"
        icon={HardDrive}
        history={metrics.diskHistory}
        color="orange"
      />
      <MetricCard
        title="Network"
        value={metrics.network}
        unit="Mb/s"
        icon={Wifi}
        history={metrics.networkHistory}
        color="green"
      />
    </div>
  );
}
