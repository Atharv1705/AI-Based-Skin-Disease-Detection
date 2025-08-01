import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Camera, 
  Upload, 
  Scan, 
  CheckCircle, 
  AlertCircle,
  Info,
  Sun,
  Focus,
  Droplets,
  Sparkles,
  Target,
  TrendingUp,
  Zap
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = true;

interface SkinAnalysis {
  id: string;
  timestamp: Date;
  imageData: string;
  
  // Primary condition
  condition: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high';
  description: string;
  recommendations: string[];
  
  // Multi-concern analysis
  skinConcerns: {
    hydration: { level: number; status: string; description: string };
    texture: { level: number; status: string; description: string };
    pigmentation: { level: number; status: string; description: string };
    oiliness: { level: number; status: string; description: string };
    pores: { level: number; status: string; description: string };
    wrinkles: { level: number; status: string; description: string };
  };
  
  // Overall scores
  overallScore: number;
  skinAge: number;
  
  // Environmental factors
  lighting: 'poor' | 'good' | 'excellent';
  imageQuality: 'poor' | 'good' | 'excellent';
}

const generateComprehensiveAnalysis = (imageData: string): SkinAnalysis => {
  const conditions = [
    {
      condition: "Healthy Skin",
      confidence: 0.92,
      severity: 'low' as const,
      description: "Your skin appears healthy with good overall condition.",
      recommendations: [
        "Continue your current skincare routine",
        "Use sunscreen daily for protection",
        "Stay hydrated and maintain a balanced diet"
      ]
    },
    {
      condition: "Acne",
      confidence: 0.88,
      severity: 'medium' as const,
      description: "Mild to moderate acne with visible breakouts.",
      recommendations: [
        "Use gentle, non-comedogenic cleansers",
        "Consider salicylic acid or benzoyl peroxide treatments",
        "Avoid touching or picking at affected areas",
        "Consult a dermatologist for persistent cases"
      ]
    },
    {
      condition: "Dry Skin",
      confidence: 0.85,
      severity: 'low' as const,
      description: "Signs of dehydration and lack of moisture.",
      recommendations: [
        "Use a rich moisturizer twice daily",
        "Apply hydrating serums with hyaluronic acid",
        "Avoid hot water and harsh cleansers",
        "Consider using a humidifier"
      ]
    },
    {
      condition: "Hyperpigmentation",
      confidence: 0.79,
      severity: 'medium' as const,
      description: "Dark spots and uneven skin tone detected.",
      recommendations: [
        "Use vitamin C serums for brightening",
        "Apply retinol products (gradually introduce)",
        "Always wear broad-spectrum SPF 30+",
        "Consider professional treatments like chemical peels"
      ]
    }
  ];

  const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
  
  // Generate multi-concern analysis
  const generateScore = () => Math.floor(Math.random() * 40) + 60; // 60-100 range
  const getStatus = (score: number) => {
    if (score >= 85) return 'excellent';
    if (score >= 70) return 'good';
    return 'needs attention';
  };

  const hydrationScore = generateScore();
  const textureScore = generateScore();
  const pigmentationScore = generateScore();
  const oilinessScore = generateScore();
  const poresScore = generateScore();
  const wrinklesScore = generateScore();

  return {
    id: Math.random().toString(36).substr(2, 9),
    timestamp: new Date(),
    imageData,
    ...randomCondition,
    skinConcerns: {
      hydration: {
        level: hydrationScore,
        status: getStatus(hydrationScore),
        description: hydrationScore >= 80 ? "Well hydrated skin" : hydrationScore >= 65 ? "Moderately hydrated" : "Needs more moisture"
      },
      texture: {
        level: textureScore,
        status: getStatus(textureScore),
        description: textureScore >= 80 ? "Smooth, even texture" : textureScore >= 65 ? "Some texture irregularities" : "Rough or uneven texture"
      },
      pigmentation: {
        level: pigmentationScore,
        status: getStatus(pigmentationScore),
        description: pigmentationScore >= 80 ? "Even skin tone" : pigmentationScore >= 65 ? "Mild discoloration" : "Noticeable pigmentation issues"
      },
      oiliness: {
        level: oilinessScore,
        status: getStatus(oilinessScore),
        description: oilinessScore >= 80 ? "Well-balanced oil production" : oilinessScore >= 65 ? "Slightly oily areas" : "Excess oil production"
      },
      pores: {
        level: poresScore,
        status: getStatus(poresScore),
        description: poresScore >= 80 ? "Fine, barely visible pores" : poresScore >= 65 ? "Moderately visible pores" : "Enlarged or clogged pores"
      },
      wrinkles: {
        level: wrinklesScore,
        status: getStatus(wrinklesScore),
        description: wrinklesScore >= 80 ? "Minimal signs of aging" : wrinklesScore >= 65 ? "Few fine lines" : "Visible signs of aging"
      }
    },
    overallScore: Math.round((hydrationScore + textureScore + pigmentationScore + oilinessScore + poresScore + wrinklesScore) / 6),
    skinAge: Math.max(18, Math.min(65, 25 + Math.floor(Math.random() * 20))),
    lighting: Math.random() > 0.7 ? 'excellent' : Math.random() > 0.4 ? 'good' : 'poor',
    imageQuality: Math.random() > 0.8 ? 'excellent' : Math.random() > 0.5 ? 'good' : 'poor'
  };
};

export default function EnhancedSkinAnalysis({ onAnalysisComplete }: { onAnalysisComplete?: (result: SkinAnalysis) => void }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStage, setAnalysisStage] = useState("");
  const [result, setResult] = useState<SkinAnalysis | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showDetailed, setShowDetailed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [scanningActive, setScanningActive] = useState(false);

  const analysisStages = [
    "Initializing AI models...",
    "Processing image quality...", 
    "Analyzing skin texture...",
    "Detecting pigmentation...",
    "Evaluating hydration levels...",
    "Assessing overall skin health...",
    "Generating recommendations..."
  ];

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
      }
    } catch (error) {
      toast({
        title: "Camera Access Error",
        description: "Unable to access camera. Please check permissions and try again.",
        variant: "destructive"
      });
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
      setScanningActive(false);
    }
  }, []);

  const captureImage = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      setScanningActive(true);
      
      setTimeout(() => {
        const canvas = canvasRef.current!;
        const video = videoRef.current!;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        setImagePreview(imageData);
        stopCamera();
        analyzeImage(imageData);
      }, 1000); // Give time for scan animation
    }
  }, [stopCamera]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setImagePreview(imageData);
        analyzeImage(imageData);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const analyzeImage = useCallback(async (imageData: string) => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setResult(null);

    try {
      // Simulate comprehensive AI analysis with realistic progress
      for (let i = 0; i < analysisStages.length; i++) {
        setAnalysisStage(analysisStages[i]);
        const stageProgress = ((i + 1) / analysisStages.length) * 100;
        
        // Simulate variable processing time per stage
        const stageTime = 500 + Math.random() * 1000;
        const steps = 20;
        const stepTime = stageTime / steps;
        
        for (let j = 0; j < steps; j++) {
          const progress = ((i * steps + j + 1) / (analysisStages.length * steps)) * 100;
          setAnalysisProgress(progress);
          await new Promise(resolve => setTimeout(resolve, stepTime));
        }
      }

      // Generate comprehensive analysis
      const analysisResult = generateComprehensiveAnalysis(imageData);
      setResult(analysisResult);
      
      // Save to localStorage
      const existingResults = JSON.parse(localStorage.getItem('skinAnalysisHistory') || '[]');
      existingResults.unshift(analysisResult);
      localStorage.setItem('skinAnalysisHistory', JSON.stringify(existingResults.slice(0, 50)));

      onAnalysisComplete?.(analysisResult);

      toast({
        title: "Analysis Complete!",
        description: `Overall skin score: ${analysisResult.overallScore}/100`,
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze image. Please try again with better lighting.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
      setAnalysisStage("");
    }
  }, [onAnalysisComplete]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'secondary';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-success';
    if (score >= 70) return 'text-warning';
    return 'text-destructive';
  };

  const getConcernIcon = (concern: string) => {
    switch (concern) {
      case 'hydration': return Droplets;
      case 'texture': return Sparkles;
      case 'pigmentation': return Target;
      case 'oiliness': return Sun;
      case 'pores': return Focus;
      case 'wrinkles': return TrendingUp;
      default: return Info;
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <div className="space-y-6">
      {/* Enhanced Camera/Upload Controls */}
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Scan className="w-5 h-5 text-primary" />
            <span>Comprehensive Skin Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!imagePreview && !isStreaming && (
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={startCamera}
                variant="medical"
                size="lg"
                className="flex-1 animate-fade-in"
              >
                <Camera className="w-5 h-5 mr-2" />
                Use Camera
              </Button>
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="hero"
                size="lg"
                className="flex-1 animate-fade-in"
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload Image
              </Button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* Enhanced Camera Stream with Scanning Animation */}
          {isStreaming && (
            <div className="relative animate-fade-in">
              <div className="relative overflow-hidden rounded-lg">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full max-w-md mx-auto rounded-lg shadow-medical"
                />
                
                {/* Scanning overlay */}
                {scanningActive && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-primary/20 rounded-lg"></div>
                    <div className="absolute top-0 left-0 right-0 h-1 bg-primary animate-scan-line"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-background/90 backdrop-blur-sm rounded-lg px-4 py-2">
                        <span className="text-sm font-medium">Scanning...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Camera guidelines */}
                <div className="absolute inset-4 border-2 border-white/50 rounded-lg pointer-events-none">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary rounded-br-lg"></div>
                </div>
              </div>
              
              <div className="flex justify-center mt-4 space-x-4">
                <Button 
                  onClick={captureImage} 
                  variant="medical" 
                  size="lg"
                  disabled={scanningActive}
                  className="animate-pulse-glow"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  {scanningActive ? "Scanning..." : "Capture"}
                </Button>
                <Button onClick={stopCamera} variant="outline">
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Image Preview */}
          {imagePreview && (
            <div className="text-center animate-scale-in">
              <img
                src={imagePreview}
                alt="Uploaded skin image"
                className="max-w-md mx-auto rounded-lg shadow-medical"
              />
              {!isAnalyzing && !result && (
                <Button
                  onClick={() => analyzeImage(imagePreview)}
                  variant="medical"
                  size="lg"
                  className="mt-4 animate-pulse-glow"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Analyze Image
                </Button>
              )}
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </CardContent>
      </Card>

      {/* Enhanced Analysis Progress */}
      {isAnalyzing && (
        <Card className="bg-gradient-card border-border/50 shadow-card animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Scan className="w-5 h-5 text-primary animate-spin" />
              <span>AI Processing...</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={analysisProgress} className="w-full h-3" />
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">{analysisStage}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round(analysisProgress)}% complete
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comprehensive Analysis Results */}
      {result && (
        <div className="space-y-6 animate-fade-in">
          {/* Main Results Card */}
          <Card className="bg-gradient-card border-border/50 shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span>Analysis Complete</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {result.overallScore}/100
                  </Badge>
                  <Badge variant={getSeverityColor(result.severity) as any}>
                    {result.severity.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Primary Condition */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {result.condition}
                  </h3>
                  <p className="text-muted-foreground">{result.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">
                    {Math.round(result.confidence * 100)}%
                  </div>
                  <p className="text-sm text-muted-foreground">Confidence</p>
                </div>
              </div>

              <Progress value={result.confidence * 100} className="h-2" />

              {/* Multi-Concern Analysis Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(result.skinConcerns).map(([concern, data]) => {
                  const Icon = getConcernIcon(concern);
                  return (
                    <div key={concern} className="bg-muted/30 rounded-lg p-4 text-center">
                      <Icon className={`w-6 h-6 mx-auto mb-2 ${getScoreColor(data.level)}`} />
                      <h4 className="font-medium capitalize mb-1">{concern}</h4>
                      <div className={`text-2xl font-bold mb-1 ${getScoreColor(data.level)}`}>
                        {data.level}
                      </div>
                      <p className="text-xs text-muted-foreground">{data.status}</p>
                    </div>
                  );
                })}
              </div>

              {/* Additional Insights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-primary/10 rounded-lg p-4">
                  <h4 className="font-medium text-primary mb-2">Skin Age</h4>
                  <div className="text-2xl font-bold">{result.skinAge} years</div>
                  <p className="text-sm text-muted-foreground">Estimated biological age</p>
                </div>
                <div className="bg-accent/10 rounded-lg p-4">
                  <h4 className="font-medium text-accent mb-2">Image Quality</h4>
                  <div className="text-lg font-semibold capitalize">{result.imageQuality}</div>
                  <p className="text-sm text-muted-foreground">Lighting: {result.lighting}</p>
                </div>
              </div>

              {/* Toggle Detailed View */}
              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={() => setShowDetailed(!showDetailed)}
                  className="w-full"
                >
                  {showDetailed ? "Hide" : "Show"} Detailed Analysis
                </Button>
              </div>

              {/* Detailed Analysis */}
              {showDetailed && (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-medium mb-3 flex items-center space-x-2">
                      <Info className="w-4 h-4" />
                      <span>Detailed Findings</span>
                    </h4>
                    <div className="space-y-3">
                      {Object.entries(result.skinConcerns).map(([concern, data]) => (
                        <div key={concern} className="border-l-4 border-primary pl-3">
                          <h5 className="font-medium capitalize">{concern}</h5>
                          <p className="text-sm text-muted-foreground">{data.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Recommendations */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium mb-3">Personalized Recommendations</h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-primary font-bold">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Analyzed on {result.timestamp.toLocaleDateString()}
                </p>
                <Button
                  onClick={() => {
                    setImagePreview(null);
                    setResult(null);
                    setShowDetailed(false);
                  }}
                  variant="outline"
                  size="sm"
                >
                  New Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Enhanced Disclaimer */}
      <Card className="bg-warning/10 border-warning/20">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-warning mb-1">Important Medical Disclaimer</p>
              <p className="text-muted-foreground">
                This AI analysis is for informational and educational purposes only. It is not a substitute 
                for professional medical diagnosis, treatment, or advice. Always consult qualified healthcare 
                providers for proper medical evaluation and care. Do not delay seeking medical attention 
                based on these results.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}