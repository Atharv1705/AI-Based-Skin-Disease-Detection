import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { 
  Settings as SettingsIcon,
  Bell,
  Shield,
  Smartphone,
  Moon,
  Sun,
  Download,
  Trash2,
  AlertTriangle,
  Camera,
  Image,
  Clock
} from "lucide-react";

export default function Settings() {
  const [notifications, setNotifications] = useState({
    analysis: true,
    reminders: false,
    updates: true,
    weekly: true
  });

  const [privacy, setPrivacy] = useState({
    dataSharing: false,
    analytics: true,
    crashReports: true
  });

  const [scanSettings, setScanSettings] = useState({
    autoSave: true,
    highQuality: true,
    flashEnabled: false,
    reminderInterval: '7'
  });

  const [darkMode, setDarkMode] = useState(false);

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }));
    toast({
      title: "Notification Settings Updated",
      description: `${key} notifications ${value ? 'enabled' : 'disabled'}`
    });
  };

  const handlePrivacyChange = (key: string, value: boolean) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: value
    }));
    toast({
      title: "Privacy Settings Updated",
      description: `${key} ${value ? 'enabled' : 'disabled'}`
    });
  };

  const handleScanSettingChange = (key: string, value: boolean | string) => {
    setScanSettings(prev => ({
      ...prev,
      [key]: value
    }));
    toast({
      title: "Scan Settings Updated",
      description: `${key} updated successfully`
    });
  };

  const exportData = () => {
    const history = localStorage.getItem('skinAnalysisHistory');
    if (history) {
      const blob = new Blob([history], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'skin_analysis_data.json';
      a.click();
      URL.revokeObjectURL(url);
      toast({
        title: "Data Exported",
        description: "Your analysis data has been downloaded"
      });
    } else {
      toast({
        title: "No Data Found",
        description: "No analysis history to export",
        variant: "destructive"
      });
    }
  };

  const clearData = () => {
    if (confirm("Are you sure you want to delete all analysis data? This action cannot be undone.")) {
      localStorage.removeItem('skinAnalysisHistory');
      toast({
        title: "Data Cleared",
        description: "All analysis history has been deleted",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Badge variant="secondary" className="mb-4">
            <SettingsIcon className="w-4 h-4 mr-2" />
            Settings
          </Badge>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            App Settings
          </h1>
          <p className="text-xl text-muted-foreground">
            Customize your experience and manage your preferences
          </p>
        </div>

        <div className="space-y-8">
          {/* Notifications */}
          <Card className="bg-gradient-card border-border/50 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-primary" />
                <span>Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="analysis-notifications">Analysis Results</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when your analysis is complete
                  </p>
                </div>
                <Switch 
                  id="analysis-notifications"
                  checked={notifications.analysis}
                  onCheckedChange={(value) => handleNotificationChange('analysis', value)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="reminder-notifications">Scan Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Regular reminders to track your skin health
                  </p>
                </div>
                <Switch 
                  id="reminder-notifications"
                  checked={notifications.reminders}
                  onCheckedChange={(value) => handleNotificationChange('reminders', value)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="update-notifications">App Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Stay informed about new features and improvements
                  </p>
                </div>
                <Switch 
                  id="update-notifications"
                  checked={notifications.updates}
                  onCheckedChange={(value) => handleNotificationChange('updates', value)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="weekly-notifications">Weekly Summary</Label>
                  <p className="text-sm text-muted-foreground">
                    Weekly progress reports and insights
                  </p>
                </div>
                <Switch 
                  id="weekly-notifications"
                  checked={notifications.weekly}
                  onCheckedChange={(value) => handleNotificationChange('weekly', value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Scan Settings */}
          <Card className="bg-gradient-card border-border/50 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Camera className="w-5 h-5 text-primary" />
                <span>Scan Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-save">Auto-save Results</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically save analysis results to history
                  </p>
                </div>
                <Switch 
                  id="auto-save"
                  checked={scanSettings.autoSave}
                  onCheckedChange={(value) => handleScanSettingChange('autoSave', value)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="high-quality">High Quality Scanning</Label>
                  <p className="text-sm text-muted-foreground">
                    Use maximum resolution for better accuracy
                  </p>
                </div>
                <Switch 
                  id="high-quality"
                  checked={scanSettings.highQuality}
                  onCheckedChange={(value) => handleScanSettingChange('highQuality', value)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="flash-enabled">Camera Flash</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable flash for better lighting in dark environments
                  </p>
                </div>
                <Switch 
                  id="flash-enabled"
                  checked={scanSettings.flashEnabled}
                  onCheckedChange={(value) => handleScanSettingChange('flashEnabled', value)}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <Label htmlFor="reminder-interval">Reminder Interval (days)</Label>
                <Input 
                  id="reminder-interval"
                  type="number"
                  min="1"
                  max="30"
                  value={scanSettings.reminderInterval}
                  onChange={(e) => handleScanSettingChange('reminderInterval', e.target.value)}
                  className="w-24"
                />
                <p className="text-sm text-muted-foreground">
                  How often you want to be reminded to take skin scans
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card className="bg-gradient-card border-border/50 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-primary" />
                <span>Privacy & Security</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="data-sharing">Data Sharing</Label>
                  <p className="text-sm text-muted-foreground">
                    Share anonymized data to improve AI models
                  </p>
                </div>
                <Switch 
                  id="data-sharing"
                  checked={privacy.dataSharing}
                  onCheckedChange={(value) => handlePrivacyChange('dataSharing', value)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="analytics">Usage Analytics</Label>
                  <p className="text-sm text-muted-foreground">
                    Help us improve the app with usage data
                  </p>
                </div>
                <Switch 
                  id="analytics"
                  checked={privacy.analytics}
                  onCheckedChange={(value) => handlePrivacyChange('analytics', value)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="crash-reports">Crash Reports</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically send crash reports to help fix bugs
                  </p>
                </div>
                <Switch 
                  id="crash-reports"
                  checked={privacy.crashReports}
                  onCheckedChange={(value) => handlePrivacyChange('crashReports', value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card className="bg-gradient-card border-border/50 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Download className="w-5 h-5 text-primary" />
                <span>Data Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-foreground mb-2">Export Your Data</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Download all your analysis history and personal data
                  </p>
                  <Button onClick={exportData} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium text-foreground mb-2 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2 text-destructive" />
                    Danger Zone
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Permanently delete all your analysis data. This action cannot be undone.
                  </p>
                  <Button onClick={clearData} variant="destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* App Information */}
          <Card className="bg-muted/30 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Smartphone className="w-5 h-5 text-primary" />
                <span>App Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Version</p>
                  <p className="font-medium">1.0.0</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Build</p>
                  <p className="font-medium">2024.01.01</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Updated</p>
                  <p className="font-medium">January 2024</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Data Usage</p>
                  <p className="font-medium">~2.5 MB</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}