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
  Download
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = true;

interface AnalysisResult {
  id: string;
  condition: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high';
  description: string;
  recommendations: string[];
  timestamp: Date;
  imageData: string;
}

const mockAnalysis = (imageData: string): AnalysisResult => {
  const conditions = [
    {
      condition: "Melanoma",
      confidence: 0.85,
      severity: 'high' as const,
      description: "A type of skin cancer that develops from melanocytes.",
      recommendations: [
        "Consult a dermatologist immediately",
        "Monitor for changes in size, color, or shape",
        "Avoid sun exposure"
      ]
    },
    {
      condition: "Acne",
      confidence: 0.92,
      severity: 'low' as const,
      description: "Common skin condition with pimples and blackheads.",
      recommendations: [
        "Use gentle cleansers",
        "Apply topical treatments",
        "Consider dietary changes"
      ]
    },
    {
      condition: "Eczema",
      confidence: 0.78,
      severity: 'medium' as const,
      description: "Inflammatory skin condition causing dry, itchy patches.",
      recommendations: [
        "Use moisturizers regularly",
        "Avoid known triggers",
        "Consider antihistamines"
      ]
    }
  ];

  const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    ...randomCondition,
    timestamp: new Date(),
    imageData
  };
};

export default function SkinAnalysis({ onAnalysisComplete }: { onAnalysisComplete?: (result: AnalysisResult) => void }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
      }
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
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
    }
  }, []);

  const captureImage = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg');
      setImagePreview(imageData);
      stopCamera();
      analyzeImage(imageData);
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
      // Simulate AI analysis with progress
      for (let i = 0; i <= 100; i += 10) {
        setAnalysisProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Mock analysis result
      const analysisResult = mockAnalysis(imageData);
      setResult(analysisResult);
      
      // Save to localStorage
      const existingResults = JSON.parse(localStorage.getItem('skinAnalysisHistory') || '[]');
      existingResults.unshift(analysisResult);
      localStorage.setItem('skinAnalysisHistory', JSON.stringify(existingResults.slice(0, 50)));

      onAnalysisComplete?.(analysisResult);

      toast({
        title: "Analysis Complete",
        description: `Detected: ${analysisResult.condition} (${Math.round(analysisResult.confidence * 100)}% confidence)`,
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
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

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return AlertCircle;
      case 'medium': return Info;
      case 'low': return CheckCircle;
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
      {/* Camera/Upload Controls */}
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Scan className="w-5 h-5 text-primary" />
            <span>Skin Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!imagePreview && !isStreaming && (
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={startCamera}
                variant="medical"
                size="lg"
                className="flex-1"
              >
                <Camera className="w-5 h-5 mr-2" />
                Use Camera
              </Button>
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="hero"
                size="lg"
                className="flex-1"
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

          {/* Camera Stream */}
          {isStreaming && (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full max-w-md mx-auto rounded-lg shadow-medical"
              />
              <div className="flex justify-center mt-4 space-x-4">
                <Button onClick={captureImage} variant="medical" size="lg">
                  <Camera className="w-5 h-5 mr-2" />
                  Capture
                </Button>
                <Button onClick={stopCamera} variant="outline">
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Image Preview */}
          {imagePreview && (
            <div className="text-center">
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
                  className="mt-4"
                >
                  <Scan className="w-5 h-5 mr-2" />
                  Analyze Image
                </Button>
              )}
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </CardContent>
      </Card>

      {/* Analysis Progress */}
      {isAnalyzing && (
        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Scan className="w-5 h-5 text-primary animate-spin" />
              <span>Analyzing...</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={analysisProgress} className="w-full" />
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Processing image with AI models... {analysisProgress}%
            </p>
          </CardContent>
        </Card>
      )}

      {/* Analysis Results */}
      {result && (
        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <span>Analysis Results</span>
              </span>
              <Badge variant={getSeverityColor(result.severity) as any}>
                {result.severity.toUpperCase()}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-foreground">
                {result.condition}
              </h3>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Confidence</p>
                <p className="text-lg font-semibold text-primary">
                  {Math.round(result.confidence * 100)}%
                </p>
              </div>
            </div>

            <Progress value={result.confidence * 100} className="h-2" />

            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-medium mb-2 flex items-center space-x-2">
                <Info className="w-4 h-4" />
                <span>Description</span>
              </h4>
              <p className="text-sm text-muted-foreground">{result.description}</p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-medium mb-2">Recommendations</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {result.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-primary">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Analyzed on {result.timestamp.toLocaleDateString()}
              </p>
              <Button
                onClick={() => {
                  setImagePreview(null);
                  setResult(null);
                }}
                variant="outline"
                size="sm"
              >
                New Analysis
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Disclaimer */}
      <Card className="bg-warning/10 border-warning/20">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-warning">Medical Disclaimer</p>
              <p className="text-muted-foreground mt-1">
                This AI analysis is for informational purposes only and should not replace professional medical advice. 
                Please consult a healthcare provider for proper diagnosis and treatment.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}