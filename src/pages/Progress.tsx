import ProgressTracking from "@/components/ProgressTracking";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  TrendingUp,
  Camera,
  Target,
  Calendar,
  Activity
} from "lucide-react";

export default function Progress() {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <Badge variant="secondary" className="mb-4">
            <TrendingUp className="w-4 h-4 mr-2" />
            Progress Tracking
          </Badge>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Track Your Skin Journey
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Monitor improvements, compare before and after results, and set goals 
            for your skin health journey.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-card border-border/50 shadow-card hover:shadow-medical transition-all duration-300 group">
            <CardContent className="pt-6 text-center">
              <Camera className="w-12 h-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold mb-2">Take New Analysis</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add a new data point to track your progress
              </p>
              <Link to="/detection">
                <Button variant="medical" size="sm">Start Analysis</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50 shadow-card hover:shadow-medical transition-all duration-300 group">
            <CardContent className="pt-6 text-center">
              <Activity className="w-12 h-12 text-accent mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold mb-2">View History</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Browse all your past skin analyses
              </p>
              <Link to="/history">
                <Button variant="outline" size="sm">View History</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50 shadow-card hover:shadow-medical transition-all duration-300 group">
            <CardContent className="pt-6 text-center">
              <Target className="w-12 h-12 text-secondary mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold mb-2">Set Goals</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Define targets for your skin health
              </p>
              <Button variant="outline" size="sm" disabled>Coming Soon</Button>
            </CardContent>
          </Card>
        </div>

        {/* Progress Tracking Component */}
        <div className="animate-fade-in">
          <ProgressTracking />
        </div>

        {/* Tips for Better Progress Tracking */}
        <Card className="mt-8 bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-primary" />
              <span>Tips for Better Progress Tracking</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Consistency is Key</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Take photos at the same time of day</li>
                  <li>• Use similar lighting conditions</li>
                  <li>• Maintain the same distance and angle</li>
                  <li>• Avoid makeup or skincare products before photos</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Regular Monitoring</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Weekly analysis for active treatment tracking</li>
                  <li>• Monthly checks for general skin health</li>
                  <li>• Document any changes in routine or products</li>
                  <li>• Note environmental factors (season, stress, etc.)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}