import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AIAssistant } from '@/components/dashboard/AIAssistant';
import {
  Settings as SettingsIcon,
  Bell,
  Volume2,
  Moon,
  Shield,
  User,
  Monitor,
  Save,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    notifications: true,
    criticalAlerts: true,
    warningAlerts: true,
    infoAlerts: false,
    soundEnabled: true,
    soundVolume: [70],
    darkMode: true,
    scanInterval: '30',
    autoQuarantine: true,
    logRetention: '30',
    displayName: 'Admin',
    email: 'admin@vigilantai.com',
  });

  const handleSave = () => {
    toast({
      title: 'Settings saved',
      description: 'Your preferences have been updated successfully.',
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in max-w-4xl">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <SettingsIcon className="h-6 w-6 text-primary" />
              Settings
            </h1>
            <p className="text-muted-foreground mt-1">
              Configure your dashboard preferences
            </p>
          </div>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Profile Settings */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center gap-2 pb-4 border-b border-border/50">
              <User className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Profile</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={settings.displayName}
                  onChange={(e) => setSettings({ ...settings, displayName: e.target.value })}
                  className="bg-secondary/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="bg-secondary/50"
                />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center gap-2 pb-4 border-b border-border/50">
              <Bell className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Notifications</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts for security events
                  </p>
                </div>
                <Switch
                  checked={settings.notifications}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, notifications: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Critical Alerts</Label>
                <Switch
                  checked={settings.criticalAlerts}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, criticalAlerts: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Warning Alerts</Label>
                <Switch
                  checked={settings.warningAlerts}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, warningAlerts: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Info Alerts</Label>
                <Switch
                  checked={settings.infoAlerts}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, infoAlerts: checked })
                  }
                />
              </div>
            </div>
          </div>

          {/* Sound Settings */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center gap-2 pb-4 border-b border-border/50">
              <Volume2 className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Sound</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Alert Sounds</Label>
                <Switch
                  checked={settings.soundEnabled}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, soundEnabled: checked })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Volume: {settings.soundVolume}%</Label>
                <Slider
                  value={settings.soundVolume}
                  onValueChange={(value) => setSettings({ ...settings, soundVolume: value })}
                  max={100}
                  step={1}
                  disabled={!settings.soundEnabled}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Display Settings */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center gap-2 pb-4 border-b border-border/50">
              <Monitor className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Display</h2>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Use dark theme</p>
              </div>
              <Switch
                checked={settings.darkMode}
                onCheckedChange={(checked) => setSettings({ ...settings, darkMode: checked })}
              />
            </div>
          </div>

          {/* Security Settings */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center gap-2 pb-4 border-b border-border/50">
              <Shield className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Security</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-Quarantine</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically isolate malicious files
                  </p>
                </div>
                <Switch
                  checked={settings.autoQuarantine}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, autoQuarantine: checked })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Scan Interval</Label>
                  <Select
                    value={settings.scanInterval}
                    onValueChange={(value) => setSettings({ ...settings, scanInterval: value })}
                  >
                    <SelectTrigger className="bg-secondary/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-card">
                      <SelectItem value="15">Every 15 minutes</SelectItem>
                      <SelectItem value="30">Every 30 minutes</SelectItem>
                      <SelectItem value="60">Every hour</SelectItem>
                      <SelectItem value="360">Every 6 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Log Retention</Label>
                  <Select
                    value={settings.logRetention}
                    onValueChange={(value) => setSettings({ ...settings, logRetention: value })}
                  >
                    <SelectTrigger className="bg-secondary/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-card">
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AIAssistant />
    </DashboardLayout>
  );
}
