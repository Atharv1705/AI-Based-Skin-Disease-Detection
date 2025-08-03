import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Activity,
  Calendar,
  TrendingUp,
  Camera,
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock,
  Users,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";

interface AnalysisHistory {
  id: string;
  condition: string;
  confidence: number;
  severity: string;
  timestamp: string;
  imageData: string;
}

export default function Dashboard() {
  const [recentAnalyses, setRecentAnalyses] = useState<AnalysisHistory[]>([]);
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    improvementTrend: 0,
    averageConfidence: 0,
    lastAnalysis: null as string | null
  });

  useEffect(() => {
    // Load analysis history from localStorage
    const history = localStorage.getItem('skinAnalysisHistory');
    if (history) {
      const parsedHistory = JSON.parse(history);
      setRecentAnalyses(parsedHistory.slice(0, 3)); // Show last 3
      
      // Calculate stats
      const totalAnalyses = parsedHistory.length;
      const avgConfidence = parsedHistory.reduce((sum: number, analysis: AnalysisHistory) => 
        sum + analysis.confidence, 0) / totalAnalyses || 0;
      
      setStats({
        totalAnalyses,
        improvementTrend: Math.floor(Math.random() * 15) + 5, // Mock improvement
        averageConfidence: Math.round(avgConfidence),
        lastAnalysis: parsedHistory[0]?.timestamp || null
      });
    }
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'low': return 'text-success';
      case 'medium': return 'text-warning';
      case 'high': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'low': return 'secondary' as const;
      case 'medium': return 'secondary' as const;
      case 'high': return 'destructive' as const;
      default: return 'secondary' as const;
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Health Dashboard
          </h1>
          <p className="text-xl text-muted-foreground">
            Track your skin health journey and monitor progress over time
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-card border-border/50 shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Scans</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalAnalyses}</p>
                </div>
                <Activity className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50 shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Improvement</p>
                  <p className="text-2xl font-bold text-success">+{stats.improvementTrend}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50 shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Confidence</p>
                  <p className="text-2xl font-bold text-foreground">{stats.averageConfidence}%</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50 shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Last Scan</p>
                  <p className="text-sm font-bold text-foreground">
                    {stats.lastAnalysis ? new Date(stats.lastAnalysis).toLocaleDateString() : 'No scans yet'}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-warning" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Analyses */}
          <Card className="lg:col-span-2 bg-gradient-card border-border/50 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-primary" />
                <span>Recent Analyses</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentAnalyses.length > 0 ? (
                <div className="space-y-4">
                  {recentAnalyses.map((analysis, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <img 
                        src={analysis.imageData} 
                        alt="Analysis" 
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground truncate">{analysis.condition}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(analysis.timestamp).toLocaleDateString()}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Progress value={analysis.confidence} className="w-20 h-2" />
                          <span className="text-xs text-muted-foreground">{analysis.confidence}%</span>
                        </div>
                      </div>
                      <Badge variant={getSeverityBadgeVariant(analysis.severity)}>
                        {analysis.severity}
                      </Badge>
                    </div>
                  ))}
                  <Link to="/history">
                    <Button variant="outline" className="w-full mt-4">
                      View All History
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No analyses yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start by taking your first skin analysis
                  </p>
                  <Link to="/detection">
                    <Button>
                      <Camera className="w-4 h-4 mr-2" />
                      Start Analysis
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card className="bg-gradient-card border-border/50 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-primary" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/detection" className="block">
                  <Button className="w-full justify-start">
                    <Camera className="w-4 h-4 mr-3" />
                    New Skin Scan
                  </Button>
                </Link>
                <Link to="/progress" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="w-4 h-4 mr-3" />
                    View Progress
                  </Button>
                </Link>
                <Link to="/profile" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-3" />
                    Update Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Health Tips */}
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-primary">
                  <AlertCircle className="w-5 h-5" />
                  <span>Daily Tip</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Apply sunscreen daily, even on cloudy days. UV rays can penetrate clouds 
                  and cause skin damage throughout the year.
                </p>
                <Button variant="link" className="p-0 h-auto mt-2 text-primary">
                  Learn more →
                </Button>
              </CardContent>
            </Card>

            {/* Weekly Goal */}
            <Card className="bg-gradient-card border-border/50 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span>Weekly Goal</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Skin scans this week</span>
                    <span className="font-medium">2 / 3</span>
                  </div>
                  <Progress value={67} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Keep up the great work! One more scan to reach your weekly goal.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}