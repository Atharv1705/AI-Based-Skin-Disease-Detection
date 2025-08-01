import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  Download,
  Trash2,
  Camera,
  Calendar,
  Activity,
  Target,
  TrendingUp
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface UserProfile {
  name: string;
  email: string;
  age: string;
  skinType: string;
  medicalHistory: string;
  notifications: boolean;
  dataSharing: boolean;
}

interface UserStats {
  totalAnalyses: number;
  lastAnalysis: Date | null;
  mostCommonCondition: string;
  accuracyFeedback: number;
}

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    age: "",
    skinType: "",
    medicalHistory: "",
    notifications: true,
    dataSharing: false
  });

  const [stats, setStats] = useState<UserStats>({
    totalAnalyses: 0,
    lastAnalysis: null,
    mostCommonCondition: "None",
    accuracyFeedback: 0
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Load profile from localStorage
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }

    // Calculate stats from analysis history
    const analysisHistory = JSON.parse(localStorage.getItem('skinAnalysisHistory') || '[]');
    const conditionCounts: { [key: string]: number } = {};
    
    analysisHistory.forEach((analysis: any) => {
      conditionCounts[analysis.condition] = (conditionCounts[analysis.condition] || 0) + 1;
    });

    const mostCommon = Object.keys(conditionCounts).reduce((a, b) => 
      conditionCounts[a] > conditionCounts[b] ? a : b, "None"
    );

    setStats({
      totalAnalyses: analysisHistory.length,
      lastAnalysis: analysisHistory.length > 0 ? new Date(analysisHistory[0].timestamp) : null,
      mostCommonCondition: analysisHistory.length > 0 ? mostCommon : "None",
      accuracyFeedback: 4.2 // Mock feedback score
    });
  }, []);

  const saveProfile = () => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully.",
    });
  };

  const exportData = () => {
    const analysisHistory = localStorage.getItem('skinAnalysisHistory') || '[]';
    const userData = {
      profile,
      analysisHistory: JSON.parse(analysisHistory)
    };
    
    const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'skinai-data.json';
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Data Exported",
      description: "Your data has been downloaded successfully.",
    });
  };

  const clearAllData = () => {
    localStorage.removeItem('userProfile');
    localStorage.removeItem('skinAnalysisHistory');
    setProfile({
      name: "",
      email: "",
      age: "",
      skinType: "",
      medicalHistory: "",
      notifications: true,
      dataSharing: false
    });
    setStats({
      totalAnalyses: 0,
      lastAnalysis: null,
      mostCommonCondition: "None",
      accuracyFeedback: 0
    });
    toast({
      title: "Data Cleared",
      description: "All your data has been deleted.",
      variant: "destructive"
    });
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-4">
            <User className="w-4 h-4 mr-2" />
            User Profile
          </Badge>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Your Profile
          </h1>
          <p className="text-xl text-muted-foreground">
            Manage your account settings and view your analysis statistics
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-card border-border/50 shadow-card">
            <CardContent className="pt-6 text-center">
              <Activity className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{stats.totalAnalyses}</div>
              <div className="text-sm text-muted-foreground">Total Analyses</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card border-border/50 shadow-card">
            <CardContent className="pt-6 text-center">
              <Calendar className="w-8 h-8 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">
                {stats.lastAnalysis ? stats.lastAnalysis.toLocaleDateString() : "Never"}
              </div>
              <div className="text-sm text-muted-foreground">Last Analysis</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card border-border/50 shadow-card">
            <CardContent className="pt-6 text-center">
              <Target className="w-8 h-8 text-secondary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground truncate">{stats.mostCommonCondition}</div>
              <div className="text-sm text-muted-foreground">Most Common</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card border-border/50 shadow-card">
            <CardContent className="pt-6 text-center">
              <TrendingUp className="w-8 h-8 text-success mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{stats.accuracyFeedback}/5</div>
              <div className="text-sm text-muted-foreground">Accuracy Rating</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Information */}
          <Card className="bg-gradient-card border-border/50 shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-primary" />
                  <span>Profile Information</span>
                </CardTitle>
                <Button
                  variant={isEditing ? "medical" : "outline"}
                  size="sm"
                  onClick={() => isEditing ? saveProfile() : setIsEditing(true)}
                >
                  {isEditing ? "Save" : "Edit"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  disabled={!isEditing}
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  disabled={!isEditing}
                  placeholder="Enter your email"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  value={profile.age}
                  onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                  disabled={!isEditing}
                  placeholder="Enter your age"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="skinType">Skin Type</Label>
                <Input
                  id="skinType"
                  value={profile.skinType}
                  onChange={(e) => setProfile({ ...profile, skinType: e.target.value })}
                  disabled={!isEditing}
                  placeholder="e.g., Oily, Dry, Combination, Sensitive"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="medicalHistory">Medical History</Label>
                <Textarea
                  id="medicalHistory"
                  value={profile.medicalHistory}
                  onChange={(e) => setProfile({ ...profile, medicalHistory: e.target.value })}
                  disabled={!isEditing}
                  placeholder="Any relevant skin conditions or allergies"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <div className="space-y-6">
            <Card className="bg-gradient-card border-border/50 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-primary" />
                  <span>Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Bell className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Notifications</div>
                      <div className="text-sm text-muted-foreground">
                        Receive analysis reminders and health tips
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={profile.notifications}
                    onCheckedChange={(checked) => 
                      setProfile({ ...profile, notifications: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Research Participation</div>
                      <div className="text-sm text-muted-foreground">
                        Help improve AI models (anonymous data only)
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={profile.dataSharing}
                    onCheckedChange={(checked) => 
                      setProfile({ ...profile, dataSharing: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span>Data Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={exportData}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Your Data
                </Button>
                
                <Button
                  onClick={clearAllData}
                  variant="destructive"
                  className="w-full justify-start"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All Data
                </Button>
                
                <div className="text-xs text-muted-foreground mt-4 p-3 bg-muted/50 rounded-lg">
                  <Shield className="w-4 h-4 inline mr-1" />
                  Your data is stored locally on your device and is never shared without your explicit consent.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Medical Disclaimer */}
        <Card className="mt-8 bg-warning/10 border-warning/20">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-warning mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-warning mb-1">Privacy Notice</p>
                <p className="text-muted-foreground">
                  All your personal information and analysis history is stored locally on your device. 
                  SkinAI does not collect, store, or transmit your personal health data to external servers. 
                  You have full control over your data and can export or delete it at any time.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}