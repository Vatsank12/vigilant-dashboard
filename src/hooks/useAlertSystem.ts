import { useEffect, useCallback } from 'react';
import { useSystemStore } from '@/stores/systemStore';
import { useToast } from '@/hooks/use-toast';

const alertMessages = [
  {
    type: 'critical' as const,
    title: 'Brute Force Attack Detected',
    message: 'Multiple failed login attempts from IP 45.33.32.156',
  },
  {
    type: 'warning' as const,
    title: 'High CPU Usage',
    message: 'Process "node" exceeding 90% CPU threshold',
  },
  {
    type: 'critical' as const,
    title: 'Suspicious File Detected',
    message: 'Malware signature found in /tmp/payload.exe',
  },
  {
    type: 'warning' as const,
    title: 'Unusual Network Activity',
    message: 'Outbound traffic spike to unknown destination',
  },
  {
    type: 'info' as const,
    title: 'System Update Available',
    message: 'Security patches ready for installation',
  },
  {
    type: 'warning' as const,
    title: 'SSL Certificate Expiring',
    message: 'Certificate for api.example.com expires in 7 days',
  },
  {
    type: 'critical' as const,
    title: 'Unauthorized Access Attempt',
    message: 'Failed SSH login for root user blocked',
  },
  {
    type: 'info' as const,
    title: 'Firewall Rule Updated',
    message: 'New rule added to block port 23 (Telnet)',
  },
];

export function useAlertSystem() {
  const { addAlert } = useSystemStore();
  const { toast } = useToast();

  const triggerRandomAlert = useCallback(() => {
    const alert = alertMessages[Math.floor(Math.random() * alertMessages.length)];
    
    addAlert(alert);

    toast({
      title: alert.title,
      description: alert.message,
      variant: alert.type === 'critical' ? 'destructive' : 'default',
      duration: alert.type === 'critical' ? 10000 : 5000,
    });
  }, [addAlert, toast]);

  useEffect(() => {
    // Trigger alerts randomly between 15-45 seconds
    const scheduleNextAlert = () => {
      const delay = 15000 + Math.random() * 30000;
      return setTimeout(() => {
        triggerRandomAlert();
        scheduleNextAlert();
      }, delay);
    };

    const timeoutId = scheduleNextAlert();
    return () => clearTimeout(timeoutId);
  }, [triggerRandomAlert]);

  return { triggerRandomAlert };
}
