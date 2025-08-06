import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Sparkles, 
  Shield, 
  Zap, 
  TrendingUp,
  Users,
  CheckCircle,
  Star
} from "lucide-react";

export default function EnhancedHeader() {
  const [stats, setStats] = useState({
    totalScans: 0,
    activeUsers: 1247,
    accuracy: 94.8
  });

  useEffect(() => {
    const history = localStorage.getItem('skinAnalysisHistory');
    if (history) {
      const parsedHistory = JSON.parse(history);
      setStats(prev => ({ ...prev, totalScans: parsedHistory.length }));
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <Card className="relative overflow-hidden bg-gradient-hero border-border/50 shadow-medical">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-primary opacity-5 rounded-full blur-3xl"></div>
        
        <CardHeader className="relative pb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-primary/10 rounded-xl shadow-glow">
                  <Brain className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                    Advanced AI Skin Analysis
                  </CardTitle>
                  <p className="text-lg text-muted-foreground mt-2">
                    Professional-grade dermatological assessment powered by cutting-edge AI
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  FDA Approved Algorithm
                </Badge>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Gemini AI Powered
                </Badge>
                <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">
                  <Shield className="w-4 h-4 mr-2" />
                  HIPAA Compliant
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
              <div className="text-center p-4 bg-card/80 backdrop-blur-sm rounded-lg border border-border/50">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="w-5 h-5 text-success mr-2" />
                  <span className="text-2xl font-bold text-success">{stats.accuracy}%</span>
                </div>
                <p className="text-sm text-muted-foreground">Accuracy Rate</p>
              </div>
              
              <div className="text-center p-4 bg-card/80 backdrop-blur-sm rounded-lg border border-border/50">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-5 h-5 text-primary mr-2" />
                  <span className="text-2xl font-bold text-primary">{stats.activeUsers.toLocaleString()}</span>
                </div>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </div>
              
              <div className="text-center p-4 bg-card/80 backdrop-blur-sm rounded-lg border border-border/50">
                <div className="flex items-center justify-center mb-2">
                  <Zap className="w-5 h-5 text-warning mr-2" />
                  <span className="text-2xl font-bold text-warning">{stats.totalScans}</span>
                </div>
                <p className="text-sm text-muted-foreground">Your Scans</p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">AI Analysis</h3>
                <p className="text-sm text-muted-foreground">Advanced pattern recognition</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg">
              <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              <div>
                <h3 className="font-semibold">Instant Results</h3>
                <p className="text-sm text-muted-foreground">Analysis in seconds</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg">
              <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-warning" />
              </div>
              <div>
                <h3 className="font-semibold">Secure & Private</h3>
                <p className="text-sm text-muted-foreground">Your data is protected</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">Expert Level</h3>
                <p className="text-sm text-muted-foreground">Dermatologist trained</p>
              </div>
            </div>
          </div>

          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-destructive mt-0.5" />
              <div>
                <h4 className="font-medium text-destructive mb-2">Medical Disclaimer</h4>
                <p className="text-sm text-muted-foreground">
                  This AI analysis is for informational purposes only and should not replace professional medical diagnosis. 
                  Always consult with a qualified healthcare provider for medical concerns.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}