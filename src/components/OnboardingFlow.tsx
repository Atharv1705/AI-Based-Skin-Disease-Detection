import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Camera, 
  Lightbulb, 
  Sun, 
  CheckCircle2, 
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  X,
  Stethoscope,
  Shield,
  Activity
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  content: React.ReactNode;
  tips?: string[];
}

export default function OnboardingFlow({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [hasConsented, setHasConsented] = useState(false);

  const steps: OnboardingStep[] = [
    {
      id: 1,
      title: "Welcome to SkinAI",
      description: "Your personal AI-powered skin health companion",
      icon: Stethoscope,
      content: (
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto shadow-glow animate-pulse-glow">
            <Stethoscope className="w-10 h-10 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-3">AI-Powered Skin Analysis</h3>
            <p className="text-muted-foreground">
              Get instant analysis of your skin using advanced machine learning models 
              trained on thousands of dermatological images.
            </p>
          </div>
          <div className="bg-primary/10 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-primary">
              <Shield className="w-5 h-5" />
              <span className="font-medium">100% Private & Secure</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              All analysis happens locally on your device. Your images never leave your phone.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Important Medical Disclaimer",
      description: "Please read and understand these important points",
      icon: Shield,
      content: (
        <div className="space-y-4">
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-warning mt-0.5" />
              <div className="text-sm">
                <h4 className="font-medium text-warning mb-2">Medical Disclaimer</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• This app is for informational purposes only</li>
                  <li>• Results are NOT medical diagnoses</li>
                  <li>• Always consult healthcare professionals for medical advice</li>
                  <li>• Do not delay seeking medical care based on app results</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-primary/5 rounded-lg p-4">
            <h4 className="font-medium text-primary mb-2">Privacy & Data</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>✓ Images processed locally on your device</li>
              <li>✓ No data sent to external servers</li>
              <li>✓ You control all your health information</li>
              <li>✓ Data can be exported or deleted anytime</li>
            </ul>
          </div>

          <div className="flex items-center space-x-3 p-4 border border-border rounded-lg">
            <input
              type="checkbox"
              id="consent"
              checked={hasConsented}
              onChange={(e) => setHasConsented(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="consent" className="text-sm font-medium">
              I understand this is not a medical diagnosis tool and agree to the terms
            </label>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Camera Setup Tips",
      description: "Follow these tips for the best scanning results",
      icon: Camera,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3 p-3 bg-success/10 rounded-lg">
              <Sun className="w-5 h-5 text-success mt-0.5" />
              <div>
                <h4 className="font-medium text-success">Good Lighting</h4>
                <p className="text-sm text-muted-foreground">Use natural daylight when possible</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-primary/10 rounded-lg">
              <Camera className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium text-primary">Clear Focus</h4>
                <p className="text-sm text-muted-foreground">Keep camera steady and close</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-accent/10 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-accent mt-0.5" />
              <div>
                <h4 className="font-medium text-accent">Fill the Frame</h4>
                <p className="text-sm text-muted-foreground">Ensure skin area fills most of the image</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-secondary/10 rounded-lg">
              <Lightbulb className="w-5 h-5 text-secondary mt-0.5" />
              <div>
                <h4 className="font-medium text-secondary">No Filters</h4>
                <p className="text-sm text-muted-foreground">Use original, unedited photos</p>
              </div>
            </div>
          </div>
          
          <div className="bg-muted/30 rounded-lg p-4">
            <h4 className="font-medium mb-2">For Best Results:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Clean the camera lens before taking photos</li>
              <li>• Avoid shadows and direct harsh lighting</li>
              <li>• Take photos from different angles if needed</li>
              <li>• Ensure the skin area is clearly visible</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "What We Analyze",
      description: "SkinAI can detect multiple skin concerns",
      icon: Activity,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gradient-card rounded-lg border border-border/50">
              <div className="text-2xl mb-2">🔬</div>
              <h4 className="font-medium mb-1">Skin Conditions</h4>
              <p className="text-xs text-muted-foreground">Acne, eczema, psoriasis, etc.</p>
            </div>
            <div className="text-center p-4 bg-gradient-card rounded-lg border border-border/50">
              <div className="text-2xl mb-2">💧</div>
              <h4 className="font-medium mb-1">Hydration</h4>
              <p className="text-xs text-muted-foreground">Moisture levels & dryness</p>
            </div>
            <div className="text-center p-4 bg-gradient-card rounded-lg border border-border/50">
              <div className="text-2xl mb-2">🌟</div>
              <h4 className="font-medium mb-1">Texture</h4>
              <p className="text-xs text-muted-foreground">Smoothness & roughness</p>
            </div>
            <div className="text-center p-4 bg-gradient-card rounded-lg border border-border/50">
              <div className="text-2xl mb-2">🎯</div>
              <h4 className="font-medium mb-1">Pigmentation</h4>
              <p className="text-xs text-muted-foreground">Dark spots & discoloration</p>
            </div>
          </div>
          
          <div className="bg-primary/5 rounded-lg p-4">
            <h4 className="font-medium text-primary mb-2">Track Your Progress</h4>
            <p className="text-sm text-muted-foreground">
              Take regular photos to monitor improvements over time. Compare before and after 
              results to see how your skin health changes.
            </p>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep === 1 && !hasConsented) {
      toast({
        title: "Consent Required",
        description: "Please read and agree to the terms before continuing.",
        variant: "destructive"
      });
      return;
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      localStorage.setItem('onboardingCompleted', 'true');
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    onComplete();
  };

  const currentStepData = steps[currentStep];
  const StepIcon = currentStepData.icon;

  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl animate-fade-in">
        <Card className="bg-gradient-card border-border/50 shadow-medical">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" size="sm" onClick={handleSkip}>
                Skip
              </Button>
              <div className="flex space-x-1">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentStep ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
              <Button variant="ghost" size="icon" onClick={handleSkip}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
              <StepIcon className="w-8 h-8 text-primary-foreground" />
            </div>
            
            <CardTitle className="text-2xl mb-2">{currentStepData.title}</CardTitle>
            <p className="text-muted-foreground">{currentStepData.description}</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="min-h-[300px]">
              {currentStepData.content}
            </div>
            
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </Button>
              
              <Button
                variant="medical"
                onClick={handleNext}
                disabled={currentStep === 1 && !hasConsented}
                className="flex items-center space-x-2"
              >
                <span>{currentStep === steps.length - 1 ? "Get Started" : "Next"}</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}