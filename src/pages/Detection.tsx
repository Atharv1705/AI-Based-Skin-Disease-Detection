import ModernSkinAnalysis from "@/components/ModernSkinAnalysis";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Scan, 
  Shield, 
  Clock, 
  AlertTriangle,
  CheckCircle2,
  Info
} from "lucide-react";

const tips = [
  {
    icon: CheckCircle2,
    title: "Good Lighting",
    description: "Ensure the area is well-lit with natural light when possible",
    color: "text-success"
  },
  {
    icon: CheckCircle2,
    title: "Clear Focus",
    description: "Keep the camera steady and ensure the image is in focus",
    color: "text-success"
  },
  {
    icon: CheckCircle2,
    title: "Close-up View",
    description: "Capture the affected area clearly, filling most of the frame",
    color: "text-success"
  },
  {
    icon: AlertTriangle,
    title: "Avoid Filters",
    description: "Don't use any photo filters or editing before analysis",
    color: "text-warning"
  }
];

export default function Detection() {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-4">
            <Scan className="w-4 h-4 mr-2" />
            AI Detection
          </Badge>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Skin Disease Detection
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload an image or use your camera to get instant AI-powered analysis 
            of potential skin conditions.
          </p>
        </div>

        {/* Tips Section */}
        <Card className="mb-8 bg-gradient-card border-border/50 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Info className="w-5 h-5 text-primary" />
              <span>Tips for Best Results</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tips.map((tip, index) => {
                const Icon = tip.icon;
                return (
                  <div key={index} className="flex items-start space-x-3">
                    <Icon className={`w-5 h-5 mt-0.5 ${tip.color}`} />
                    <div>
                      <h4 className="font-medium text-foreground">{tip.title}</h4>
                      <p className="text-sm text-muted-foreground">{tip.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <Card className="mb-8 bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-primary mt-0.5" />
              <div className="text-sm">
                <h4 className="font-medium text-primary mb-1">Privacy & Security</h4>
                <p className="text-muted-foreground">
                  Your images are processed locally and securely. We do not store or share 
                  your personal health information. All analysis is performed with 
                  medical-grade privacy protection.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Analysis Component */}
        <ModernSkinAnalysis />

        {/* Additional Information */}
        <Card className="mt-8 bg-muted/30 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-primary" />
              <span>What to Expect</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold">1-2s</span>
                </div>
                <h4 className="font-medium mb-2">Image Processing</h4>
                <p className="text-sm text-muted-foreground">
                  AI analyzes your image using advanced computer vision
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-accent font-bold">5-10s</span>
                </div>
                <h4 className="font-medium mb-2">Condition Detection</h4>
                <p className="text-sm text-muted-foreground">
                  Machine learning models identify potential conditions
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-success font-bold">Instant</span>
                </div>
                <h4 className="font-medium mb-2">Results & Recommendations</h4>
                <p className="text-sm text-muted-foreground">
                  Receive detailed analysis and next steps
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}