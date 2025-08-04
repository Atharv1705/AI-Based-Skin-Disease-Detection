import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Camera, 
  Upload, 
  Scan, 
  CheckCircle, 
  AlertCircle,
  Info,
  Download,
  Sparkles,
  Brain,
  Shield,
  Zap
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AnalysisResult {
  id: string;
  analysis: {
    condition: string;
    confidence: number;
    severity: 'low' | 'medium' | 'high';
    description: string;
    differential_diagnoses: string[];
    recommendations: string[];
    urgency: 'routine' | 'urgent' | 'immediate';
    disclaimer: string;
  };
  confidence_level: 'low' | 'medium' | 'high';
  medical_disclaimer: string;
  timestamp: string;
}

export default function ModernSkinAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [patientAge, setPatientAge] = useState<string>("");
  const [patientSex, setPatientSex] = useState<string>("");
  const [medicalHistory, setMedicalHistory] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      setStreamError(null);
      const constraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 1920, max: 1920 },
          height: { ideal: 1080, max: 1080 },
          aspectRatio: { ideal: 16/9 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
        };
        setIsStreaming(true);
        
        toast({
          title: "Camera Ready",
          description: "Position the skin area in the frame and capture when ready",
        });
      }
    } catch (error: any) {
      console.error('Camera access error:', error);
      setStreamError(error.message);
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
      setStreamError(null);
    }
  }, []);

  const captureImage = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.9);
        setImagePreview(imageData);
        stopCamera();
        
        toast({
          title: "Image Captured",
          description: "Ready for AI analysis",
        });
      }
    }
  }, [stopCamera]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File Too Large",
          description: "Please select an image under 10MB",
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setImagePreview(imageData);
        
        toast({
          title: "Image Uploaded",
          description: "Ready for AI analysis",
        });
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const analyzeImage = useCallback(async (imageData: string) => {
    if (!imageData) return;

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setResult(null);

    try {
      // Animate progress
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 15;
        });
      }, 500);

      const { data, error } = await supabase.functions.invoke('ai-disease-detection', {
        body: {
          imageData,
          patientAge: patientAge || undefined,
          patientSex: patientSex || undefined,
          medicalHistory: medicalHistory || undefined
        }
      });

      clearInterval(progressInterval);
      setAnalysisProgress(100);

      if (error) throw error;

      const analysisResult: AnalysisResult = data;
      setResult(analysisResult);
      
      // Save to localStorage with enhanced data
      const existingResults = JSON.parse(localStorage.getItem('skinAnalysisHistory') || '[]');
      const historyEntry = {
        ...analysisResult,
        imageData: imageData,
        patientInfo: {
          age: patientAge,
          sex: patientSex,
          medicalHistory: medicalHistory
        }
      };
      existingResults.unshift(historyEntry);
      localStorage.setItem('skinAnalysisHistory', JSON.stringify(existingResults.slice(0, 50)));

      toast({
        title: "Analysis Complete",
        description: `Detected: ${analysisResult.analysis.condition} (${Math.round(analysisResult.analysis.confidence * 100)}% confidence)`,
      });

    } catch (error: any) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [patientAge, patientSex, medicalHistory]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'secondary';
    }
  };

  const getConfidenceColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-success';
      case 'medium': return 'text-warning';
      case 'low': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <Card className="bg-gradient-hero border-border/50 shadow-medical overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5"></div>
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">AI-Powered Skin Analysis</CardTitle>
                <p className="text-sm text-muted-foreground">Advanced dermatological assessment</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              <Sparkles className="w-3 h-3 mr-1" />
              GPT-4 Vision
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Patient Information */}
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-primary" />
            <span>Patient Information (Optional)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              placeholder="Enter age"
              value={patientAge}
              onChange={(e) => setPatientAge(e.target.value)}
              min="0"
              max="120"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sex">Sex</Label>
            <Select value={patientSex} onValueChange={setPatientSex}>
              <SelectTrigger>
                <SelectValue placeholder="Select sex" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="history">Medical History</Label>
            <Input
              id="history"
              placeholder="Any relevant conditions"
              value={medicalHistory}
              onChange={(e) => setMedicalHistory(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Image Capture/Upload */}
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Scan className="w-5 h-5 text-primary" />
            <span>Image Capture</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!imagePreview && !isStreaming && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                onClick={startCamera}
                variant="default"
                size="lg"
                className="h-16 bg-gradient-primary hover:opacity-90 text-primary-foreground"
              >
                <Camera className="w-6 h-6 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Use Camera</div>
                  <div className="text-sm opacity-90">Live capture</div>
                </div>
              </Button>
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                size="lg"
                className="h-16 border-2 border-dashed hover:border-primary/50"
              >
                <Upload className="w-6 h-6 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Upload Image</div>
                  <div className="text-sm text-muted-foreground">Select from device</div>
                </div>
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
              <div className="relative rounded-lg overflow-hidden bg-muted">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-auto max-h-96 object-cover"
                />
                <div className="absolute inset-0 border-2 border-primary/30 rounded-lg pointer-events-none">
                  <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-primary"></div>
                  <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-primary"></div>
                  <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-primary"></div>
                  <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-primary"></div>
                </div>
              </div>
              
              <div className="flex justify-center mt-4 space-x-4">
                <Button 
                  onClick={captureImage} 
                  size="lg"
                  className="bg-gradient-primary hover:opacity-90"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Capture Image
                </Button>
                <Button onClick={stopCamera} variant="outline">
                  Cancel
                </Button>
              </div>
              
              {streamError && (
                <p className="text-sm text-destructive mt-2 text-center">{streamError}</p>
              )}
            </div>
          )}

          {/* Image Preview */}
          {imagePreview && (
            <div className="text-center space-y-4">
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Skin image for analysis"
                  className="max-w-full max-h-96 rounded-lg shadow-medical border border-border/50"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                    Ready for Analysis
                  </Badge>
                </div>
              </div>
              
              {!isAnalyzing && !result && (
                <Button
                  onClick={() => analyzeImage(imagePreview)}
                  size="lg"
                  className="bg-gradient-primary hover:opacity-90 animate-pulse-glow"
                >
                  <Brain className="w-5 h-5 mr-2" />
                  Analyze with AI
                </Button>
              )}
              
              <Button
                onClick={() => {
                  setImagePreview(null);
                  setResult(null);
                }}
                variant="outline"
                size="sm"
              >
                Change Image
              </Button>
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
              <Brain className="w-5 h-5 text-primary animate-pulse" />
              <span>AI Analysis in Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={analysisProgress} className="w-full h-3" />
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Processing image with advanced AI models... {Math.round(analysisProgress)}%
              </p>
              <div className="flex justify-center space-x-4 text-xs text-muted-foreground">
                <span className={analysisProgress > 20 ? "text-success" : ""}>Image Processing</span>
                <span className={analysisProgress > 50 ? "text-success" : ""}>Feature Extraction</span>
                <span className={analysisProgress > 80 ? "text-success" : ""}>Medical Analysis</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Analysis Results */}
      {result && (
        <div className="space-y-6">
          <Card className="bg-gradient-card border-border/50 shadow-card overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span>Analysis Results</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant={getSeverityColor(result.analysis.severity) as any}>
                    {result.analysis.severity.toUpperCase()} SEVERITY
                  </Badge>
                  <Badge variant="secondary" className={getConfidenceColor(result.confidence_level)}>
                    {result.confidence_level.toUpperCase()} CONFIDENCE
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Main Diagnosis */}
              <div className="bg-muted/30 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-foreground">
                    {result.analysis.condition.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </h3>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Confidence Score</p>
                    <p className="text-2xl font-bold text-primary">
                      {Math.round(result.analysis.confidence * 100)}%
                    </p>
                  </div>
                </div>
                <Progress value={result.analysis.confidence * 100} className="h-3 mb-4" />
                <p className="text-muted-foreground leading-relaxed">{result.analysis.description}</p>
              </div>

              {/* Differential Diagnoses */}
              {result.analysis.differential_diagnoses?.length > 0 && (
                <div className="bg-muted/20 rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center space-x-2">
                    <Info className="w-4 h-4" />
                    <span>Alternative Considerations</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.analysis.differential_diagnoses.map((diagnosis, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {diagnosis.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              <div className="bg-muted/20 rounded-lg p-4">
                <h4 className="font-semibold mb-3">Medical Recommendations</h4>
                <ul className="space-y-2">
                  {result.analysis.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <span className="text-primary font-semibold">{index + 1}.</span>
                      <span className="leading-relaxed">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Urgency Alert */}
              {(result.analysis.urgency === 'urgent' || result.analysis.urgency === 'immediate') && (
                <div className="bg-destructive/10 border-destructive/20 border rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-destructive mb-2">
                        {result.analysis.urgency === 'immediate' ? 'IMMEDIATE ATTENTION REQUIRED' : 'URGENT MEDICAL ATTENTION'}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Please consult with a qualified dermatologist or healthcare provider as soon as possible.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Analysis Metadata */}
              <div className="flex justify-between items-center pt-4 border-t border-border text-xs text-muted-foreground">
                <div>
                  <p>Analysis ID: {result.id}</p>
                  <p>Analyzed: {new Date(result.timestamp).toLocaleString()}</p>
                </div>
                <Button
                  onClick={() => {
                    setImagePreview(null);
                    setResult(null);
                    setPatientAge("");
                    setPatientSex("");
                    setMedicalHistory("");
                  }}
                  variant="outline"
                  size="sm"
                >
                  New Analysis
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Medical Disclaimer */}
          <Card className="bg-warning/5 border-warning/20">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-semibold text-warning mb-2">Important Medical Disclaimer</p>
                  <p className="text-muted-foreground leading-relaxed">
                    {result.medical_disclaimer}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}