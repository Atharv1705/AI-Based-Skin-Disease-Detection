import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Calendar, 
  Target,
  Activity,
  ArrowUp,
  ArrowDown,
  Minus,
  Camera,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { format, subDays, differenceInDays } from "date-fns";

interface SkinAnalysis {
  id: string;
  timestamp: Date;
  imageData: string;
  condition: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high';
  overallScore: number;
  skinAge: number;
  skinConcerns: {
    hydration: { level: number; status: string };
    texture: { level: number; status: string };
    pigmentation: { level: number; status: string };
    oiliness: { level: number; status: string };
    pores: { level: number; status: string };
    wrinkles: { level: number; status: string };
  };
}

interface ComparisonData {
  before: SkinAnalysis;
  after: SkinAnalysis;
  daysDifference: number;
  improvements: string[];
  concerns: string[];
  overallProgress: number;
}

export default function ProgressTracking() {
  const [analysisHistory, setAnalysisHistory] = useState<SkinAnalysis[]>([]);
  const [selectedComparison, setSelectedComparison] = useState<ComparisonData | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem('skinAnalysisHistory');
    if (stored) {
      const parsed = JSON.parse(stored).map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      }));
      setAnalysisHistory(parsed);
    }
  }, []);

  const generateComparison = (before: SkinAnalysis, after: SkinAnalysis): ComparisonData => {
    const daysDifference = differenceInDays(after.timestamp, before.timestamp);
    const improvements: string[] = [];
    const concerns: string[] = [];

    // Compare skin concerns
    Object.keys(before.skinConcerns).forEach(concern => {
      const beforeLevel = before.skinConcerns[concern as keyof typeof before.skinConcerns].level;
      const afterLevel = after.skinConcerns[concern as keyof typeof after.skinConcerns].level;
      const difference = afterLevel - beforeLevel;

      if (difference > 5) {
        improvements.push(`${concern.charAt(0).toUpperCase() + concern.slice(1)} improved by ${difference} points`);
      } else if (difference < -5) {
        concerns.push(`${concern.charAt(0).toUpperCase() + concern.slice(1)} decreased by ${Math.abs(difference)} points`);
      }
    });

    // Overall score comparison
    const overallProgress = after.overallScore - before.overallScore;
    if (overallProgress > 0) {
      improvements.push(`Overall skin score improved by ${overallProgress} points`);
    } else if (overallProgress < 0) {
      concerns.push(`Overall skin score decreased by ${Math.abs(overallProgress)} points`);
    }

    // Age comparison
    const ageDifference = after.skinAge - before.skinAge;
    if (ageDifference < 0) {
      improvements.push(`Skin appears ${Math.abs(ageDifference)} years younger`);
    } else if (ageDifference > 1) {
      concerns.push(`Skin aging has progressed by ${ageDifference} years`);
    }

    return {
      before,
      after,
      daysDifference,
      improvements,
      concerns,
      overallProgress
    };
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="w-4 h-4 text-success" />;
    if (change < 0) return <ArrowDown className="w-4 h-4 text-destructive" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-success';
    if (change < 0) return 'text-destructive';
    return 'text-muted-foreground';
  };

  const availableComparisons = analysisHistory.length >= 2 
    ? analysisHistory.slice(1).map((analysis, index) => 
        generateComparison(analysisHistory[index + 1], analysis))
    : [];

  const handleImageNavigation = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    } else if (direction === 'next' && currentImageIndex < analysisHistory.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  if (analysisHistory.length === 0) {
    return (
      <Card className="bg-muted/30 border-border/50">
        <CardContent className="text-center py-12">
          <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Progress Data Yet</h3>
          <p className="text-muted-foreground mb-4">
            Take your first skin analysis to start tracking your progress over time.
          </p>
          <Button variant="medical">
            <Camera className="w-4 h-4 mr-2" />
            Start First Analysis
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (analysisHistory.length === 1) {
    return (
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <CardContent className="text-center py-12">
          <Target className="w-16 h-16 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Ready to Track Progress</h3>
          <p className="text-muted-foreground mb-4">
            You have one analysis. Take another to start comparing your progress!
          </p>
          <div className="bg-primary/10 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-primary mb-2">Your Baseline Analysis</h4>
            <p className="text-sm text-muted-foreground">
              Taken on {format(analysisHistory[0].timestamp, 'MMM dd, yyyy')}
            </p>
            <p className="text-lg font-semibold">Overall Score: {analysisHistory[0].overallScore}/100</p>
          </div>
          <Button variant="medical">
            <Camera className="w-4 h-4 mr-2" />
            Take New Analysis
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span>Progress Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Timeline Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleImageNavigation('prev')}
              disabled={currentImageIndex === 0}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {format(analysisHistory[currentImageIndex].timestamp, 'MMM dd, yyyy')}
              </p>
              <p className="text-xs text-muted-foreground">
                {currentImageIndex + 1} of {analysisHistory.length}
              </p>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleImageNavigation('next')}
              disabled={currentImageIndex === analysisHistory.length - 1}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Current Analysis Display */}
          <div className="text-center">
            <img
              src={analysisHistory[currentImageIndex].imageData}
              alt="Skin analysis"
              className="max-w-sm mx-auto rounded-lg shadow-medical mb-4"
            />
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="bg-primary/10 rounded-lg p-3">
                <div className="text-2xl font-bold text-primary">
                  {analysisHistory[currentImageIndex].overallScore}
                </div>
                <div className="text-sm text-muted-foreground">Overall Score</div>
              </div>
              <div className="bg-accent/10 rounded-lg p-3">
                <div className="text-2xl font-bold text-accent">
                  {analysisHistory[currentImageIndex].skinAge}
                </div>
                <div className="text-sm text-muted-foreground">Skin Age</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Comparisons */}
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-primary" />
            <span>Progress Comparisons</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {availableComparisons.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Need at least 2 analyses to show comparisons
            </p>
          ) : (
            availableComparisons.map((comparison, index) => (
              <Card 
                key={index} 
                className="border border-border/50 cursor-pointer hover:shadow-medical transition-all duration-300"
                onClick={() => setSelectedComparison(comparison)}
              >
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm text-muted-foreground">
                      {format(comparison.before.timestamp, 'MMM dd')} → {format(comparison.after.timestamp, 'MMM dd')}
                    </div>
                    <Badge variant={comparison.overallProgress >= 0 ? "default" : "destructive"}>
                      {comparison.daysDifference} days
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-semibold">
                      Overall Progress
                    </div>
                    <div className={`flex items-center space-x-2 ${getChangeColor(comparison.overallProgress)}`}>
                      {getChangeIcon(comparison.overallProgress)}
                      <span className="font-bold">
                        {comparison.overallProgress > 0 ? '+' : ''}{comparison.overallProgress}
                      </span>
                    </div>
                  </div>
                  
                  <Progress 
                    value={50 + (comparison.overallProgress * 2)} 
                    className="mt-2 h-2" 
                  />
                  
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>{comparison.improvements.length} improvements</span>
                    <span>{comparison.concerns.length} concerns</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>

      {/* Detailed Comparison Modal */}
      {selectedComparison && (
        <Card className="bg-gradient-card border-border/50 shadow-medical">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Detailed Progress Analysis</CardTitle>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setSelectedComparison(null)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Before/After Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <h4 className="font-medium mb-2">Before</h4>
                <img
                  src={selectedComparison.before.imageData}
                  alt="Before analysis"
                  className="w-full max-w-xs mx-auto rounded-lg shadow-card"
                />
                <div className="mt-2 text-sm text-muted-foreground">
                  {format(selectedComparison.before.timestamp, 'MMM dd, yyyy')}
                </div>
                <div className="text-lg font-semibold">
                  Score: {selectedComparison.before.overallScore}/100
                </div>
              </div>
              
              <div className="text-center">
                <h4 className="font-medium mb-2">After</h4>
                <img
                  src={selectedComparison.after.imageData}
                  alt="After analysis"
                  className="w-full max-w-xs mx-auto rounded-lg shadow-card"
                />
                <div className="mt-2 text-sm text-muted-foreground">
                  {format(selectedComparison.after.timestamp, 'MMM dd, yyyy')}
                </div>
                <div className="text-lg font-semibold">
                  Score: {selectedComparison.after.overallScore}/100
                </div>
              </div>
            </div>

            {/* Progress Summary */}
            <div className="bg-muted/30 rounded-lg p-4">
              <h4 className="font-medium mb-3">Progress Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {selectedComparison.daysDifference}
                  </div>
                  <div className="text-sm text-muted-foreground">Days Apart</div>
                </div>
                <div>
                  <div className={`text-2xl font-bold ${getChangeColor(selectedComparison.overallProgress)}`}>
                    {selectedComparison.overallProgress > 0 ? '+' : ''}{selectedComparison.overallProgress}
                  </div>
                  <div className="text-sm text-muted-foreground">Score Change</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-success">
                    {selectedComparison.improvements.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Improvements</div>
                </div>
              </div>
            </div>

            {/* Detailed Changes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {selectedComparison.improvements.length > 0 && (
                <div className="bg-success/10 rounded-lg p-4">
                  <h4 className="font-medium text-success mb-3 flex items-center space-x-2">
                    <ArrowUp className="w-4 h-4" />
                    <span>Improvements</span>
                  </h4>
                  <ul className="space-y-2">
                    {selectedComparison.improvements.map((improvement, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start space-x-2">
                        <span className="text-success">✓</span>
                        <span>{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {selectedComparison.concerns.length > 0 && (
                <div className="bg-destructive/10 rounded-lg p-4">
                  <h4 className="font-medium text-destructive mb-3 flex items-center space-x-2">
                    <ArrowDown className="w-4 h-4" />
                    <span>Areas of Concern</span>
                  </h4>
                  <ul className="space-y-2">
                    {selectedComparison.concerns.map((concern, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start space-x-2">
                        <span className="text-destructive">!</span>
                        <span>{concern}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Skin Concerns Comparison */}
            <div className="bg-muted/30 rounded-lg p-4">
              <h4 className="font-medium mb-3">Detailed Skin Metrics</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.keys(selectedComparison.before.skinConcerns).map(concern => {
                  const beforeLevel = selectedComparison.before.skinConcerns[concern as keyof typeof selectedComparison.before.skinConcerns].level;
                  const afterLevel = selectedComparison.after.skinConcerns[concern as keyof typeof selectedComparison.after.skinConcerns].level;
                  const change = afterLevel - beforeLevel;
                  
                  return (
                    <div key={concern} className="text-center p-3 bg-card rounded-lg">
                      <h5 className="font-medium capitalize mb-2">{concern}</h5>
                      <div className="text-lg font-semibold mb-1">
                        {beforeLevel} → {afterLevel}
                      </div>
                      <div className={`flex items-center justify-center space-x-1 ${getChangeColor(change)}`}>
                        {getChangeIcon(change)}
                        <span className="text-sm font-medium">
                          {change > 0 ? '+' : ''}{change}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Goal Setting */}
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-primary" />
            <span>Set Your Goals</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-primary/10 rounded-lg p-4">
              <h4 className="font-medium text-primary mb-2">Weekly Check-ins</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Track your progress with regular skin analyses
              </p>
              <Button variant="outline" size="sm">Set Reminder</Button>
            </div>
            <div className="bg-accent/10 rounded-lg p-4">
              <h4 className="font-medium text-accent mb-2">Improvement Goals</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Set targets for specific skin concerns
              </p>
              <Button variant="outline" size="sm">Set Goals</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}