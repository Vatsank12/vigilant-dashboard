import { create } from 'zustand';

export interface SystemMetrics {
  cpu: number;
  ram: number;
  disk: number;
  network: number;
  cpuHistory: number[];
  ramHistory: number[];
  diskHistory: number[];
  networkHistory: number[];
}

export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface Process {
  pid: number;
  name: string;
  user: string;
  cpu: number;
  memory: number;
  status: 'running' | 'sleeping' | 'stopped';
}

interface SystemStore {
  metrics: SystemMetrics;
  healthScore: number;
  alerts: Alert[];
  processes: Process[];
  sidebarCollapsed: boolean;
  updateMetrics: (metrics: Partial<SystemMetrics>) => void;
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp' | 'read'>) => void;
  dismissAlert: (id: string) => void;
  markAlertRead: (id: string) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  updateProcesses: (processes: Process[]) => void;
  killProcess: (pid: number) => void;
}

const generateInitialHistory = () => Array.from({ length: 30 }, () => Math.random() * 40 + 20);

export const useSystemStore = create<SystemStore>((set) => ({
  metrics: {
    cpu: 45,
    ram: 62,
    disk: 78,
    network: 23,
    cpuHistory: generateInitialHistory(),
    ramHistory: generateInitialHistory(),
    diskHistory: generateInitialHistory(),
    networkHistory: generateInitialHistory(),
  },
  healthScore: 87,
  alerts: [
    {
      id: '1',
      type: 'warning',
      title: 'High Memory Usage',
      message: 'RAM usage exceeded 80% threshold',
      timestamp: new Date(Date.now() - 300000),
      read: false,
    },
    {
      id: '2',
      type: 'info',
      title: 'System Scan Complete',
      message: 'No threats detected in scheduled scan',
      timestamp: new Date(Date.now() - 600000),
      read: true,
    },
  ],
  processes: [
    { pid: 1, name: 'systemd', user: 'root', cpu: 0.1, memory: 0.5, status: 'running' },
    { pid: 234, name: 'chrome', user: 'user', cpu: 12.5, memory: 8.2, status: 'running' },
    { pid: 567, name: 'node', user: 'user', cpu: 5.3, memory: 4.1, status: 'running' },
    { pid: 890, name: 'postgres', user: 'postgres', cpu: 2.1, memory: 6.8, status: 'running' },
    { pid: 1234, name: 'nginx', user: 'www-data', cpu: 0.8, memory: 1.2, status: 'running' },
    { pid: 1567, name: 'redis-server', user: 'redis', cpu: 0.3, memory: 2.5, status: 'running' },
    { pid: 1890, name: 'docker', user: 'root', cpu: 3.2, memory: 5.4, status: 'running' },
    { pid: 2123, name: 'vscode', user: 'user', cpu: 8.7, memory: 12.3, status: 'running' },
  ],
  sidebarCollapsed: false,

  updateMetrics: (newMetrics) =>
    set((state) => ({
      metrics: { ...state.metrics, ...newMetrics },
      healthScore: Math.max(0, Math.min(100, 100 - (newMetrics.cpu || state.metrics.cpu) * 0.3 - (newMetrics.ram || state.metrics.ram) * 0.3)),
    })),

  addAlert: (alert) =>
    set((state) => ({
      alerts: [
        {
          ...alert,
          id: Date.now().toString(),
          timestamp: new Date(),
          read: false,
        },
        ...state.alerts,
      ].slice(0, 50),
    })),

  dismissAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.filter((a) => a.id !== id),
    })),

  markAlertRead: (id) =>
    set((state) => ({
      alerts: state.alerts.map((a) => (a.id === id ? { ...a, read: true } : a)),
    })),

  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  setSidebarCollapsed: (collapsed) =>
    set({ sidebarCollapsed: collapsed }),

  updateProcesses: (processes) =>
    set({ processes }),

  killProcess: (pid) =>
    set((state) => ({
      processes: state.processes.filter((p) => p.pid !== pid),
    })),
}));
