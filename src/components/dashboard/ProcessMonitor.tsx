import { useState, useMemo } from 'react';
import {
  Search,
  AlertTriangle,
  X,
  RefreshCw,
  Cpu,
  MemoryStick,
  ArrowUpDown,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSystemStore, Process } from '@/stores/systemStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type SortKey = 'pid' | 'name' | 'cpu' | 'memory';
type SortOrder = 'asc' | 'desc';

export function ProcessMonitor() {
  const { processes, killProcess } = useSystemStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('cpu');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [killDialog, setKillDialog] = useState<Process | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const filteredAndSortedProcesses = useMemo(() => {
    let filtered = processes.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.pid.toString().includes(searchQuery)
    );

    filtered.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      const modifier = sortOrder === 'asc' ? 1 : -1;

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return aVal.localeCompare(bVal) * modifier;
      }
      return ((aVal as number) - (bVal as number)) * modifier;
    });

    return filtered;
  }, [processes, searchQuery, sortKey, sortOrder]);

  const stats = useMemo(() => {
    const totalCpu = processes.reduce((acc, p) => acc + p.cpu, 0);
    const totalMemory = processes.reduce((acc, p) => acc + p.memory, 0);
    return {
      count: processes.length,
      totalCpu: totalCpu.toFixed(1),
      totalMemory: totalMemory.toFixed(1),
    };
  }, [processes]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsRefreshing(false);
  };

  const handleKill = (process: Process) => {
    killProcess(process.pid);
    setKillDialog(null);
  };

  const getCpuColor = (cpu: number) => {
    if (cpu > 50) return 'text-destructive';
    if (cpu > 20) return 'text-warning';
    return 'text-foreground';
  };

  const getMemoryColor = (memory: number) => {
    if (memory > 20) return 'text-destructive';
    if (memory > 10) return 'text-warning';
    return 'text-foreground';
  };

  const SortButton = ({ column, label }: { column: SortKey; label: string }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleSort(column)}
      className="h-auto p-0 hover:bg-transparent text-muted-foreground hover:text-foreground"
    >
      {label}
      <ArrowUpDown className={cn('ml-1 h-3 w-3', sortKey === column && 'text-primary')} />
    </Button>
  );

  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Cpu className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono">{stats.totalCpu}%</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Total CPU</div>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10">
            <MemoryStick className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono">{stats.totalMemory}%</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Total Memory</div>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-success/10">
            <RefreshCw className="h-5 w-5 text-success" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono">{stats.count}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Processes</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search processes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary/50"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              Sort by: {sortKey}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="glass-card">
            <DropdownMenuItem onClick={() => handleSort('pid')}>PID</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSort('name')}>Name</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSort('cpu')}>CPU %</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSort('memory')}>Memory %</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="gap-2"
        >
          <RefreshCw className={cn('h-4 w-4', isRefreshing && 'animate-spin')} />
          Refresh
        </Button>
      </div>

      {/* Process Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="w-20">
                <SortButton column="pid" label="PID" />
              </TableHead>
              <TableHead>
                <SortButton column="name" label="Name" />
              </TableHead>
              <TableHead>User</TableHead>
              <TableHead className="text-right">
                <SortButton column="cpu" label="CPU %" />
              </TableHead>
              <TableHead className="text-right">
                <SortButton column="memory" label="Mem %" />
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedProcesses.map((process) => (
              <TableRow key={process.pid} className="border-border/50 group">
                <TableCell className="font-mono text-muted-foreground">{process.pid}</TableCell>
                <TableCell className="font-medium">{process.name}</TableCell>
                <TableCell className="text-muted-foreground">{process.user}</TableCell>
                <TableCell className={cn('text-right font-mono', getCpuColor(process.cpu))}>
                  {process.cpu.toFixed(1)}%
                </TableCell>
                <TableCell className={cn('text-right font-mono', getMemoryColor(process.memory))}>
                  {process.memory.toFixed(1)}%
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      process.status === 'running' && 'border-success/30 text-success',
                      process.status === 'sleeping' && 'border-warning/30 text-warning',
                      process.status === 'stopped' && 'border-destructive/30 text-destructive'
                    )}
                  >
                    {process.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setKillDialog(process)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Kill
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Kill Confirmation Dialog */}
      <Dialog open={!!killDialog} onOpenChange={() => setKillDialog(null)}>
        <DialogContent className="glass-card border-destructive/30">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Kill Process
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to terminate{' '}
              <span className="font-semibold text-foreground">{killDialog?.name}</span> (PID:{' '}
              {killDialog?.pid})? This action cannot be undone and may cause data loss.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setKillDialog(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => killDialog && handleKill(killDialog)}
            >
              Kill Process
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
