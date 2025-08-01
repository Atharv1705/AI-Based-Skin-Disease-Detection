import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  History as HistoryIcon, 
  Search, 
  Calendar, 
  Filter,
  Trash2,
  Eye,
  Download,
  AlertCircle,
  CheckCircle,
  Info,
  X
} from "lucide-react";
import { format } from "date-fns";

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

export default function History() {
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisResult[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [selectedResult, setSelectedResult] = useState<AnalysisResult | null>(null);

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

  const filteredResults = analysisHistory.filter(result => {
    const matchesSearch = result.condition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === "all" || result.severity === filterSeverity;
    return matchesSearch && matchesSeverity;
  });

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

  const deleteResult = (id: string) => {
    const updated = analysisHistory.filter(result => result.id !== id);
    setAnalysisHistory(updated);
    localStorage.setItem('skinAnalysisHistory', JSON.stringify(updated));
  };

  const clearAllHistory = () => {
    setAnalysisHistory([]);
    localStorage.removeItem('skinAnalysisHistory');
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-4">
            <HistoryIcon className="w-4 h-4 mr-2" />
            Analysis History
          </Badge>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Your Analysis History
          </h1>
          <p className="text-xl text-muted-foreground">
            Review your past skin condition analyses and track changes over time
          </p>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8 bg-gradient-card border-border/50 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-primary" />
              <span>Filter & Search</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search by condition..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                {['all', 'low', 'medium', 'high'].map((severity) => (
                  <Button
                    key={severity}
                    variant={filterSeverity === severity ? "medical" : "outline"}
                    size="sm"
                    onClick={() => setFilterSeverity(severity)}
                  >
                    {severity === 'all' ? 'All' : severity.charAt(0).toUpperCase() + severity.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
            {analysisHistory.length > 0 && (
              <div className="flex justify-end mt-4">
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={clearAllHistory}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All History
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Grid */}
        {filteredResults.length === 0 ? (
          <Card className="bg-muted/30 border-border/50">
            <CardContent className="text-center py-12">
              <HistoryIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Analysis History</h3>
              <p className="text-muted-foreground">
                {analysisHistory.length === 0 
                  ? "You haven't performed any skin analyses yet. Start your first analysis to see results here."
                  : "No results match your current search criteria."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResults.map((result) => {
              const SeverityIcon = getSeverityIcon(result.severity);
              return (
                <Card key={result.id} className="bg-gradient-card border-border/50 shadow-card hover:shadow-medical transition-all duration-300 group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge variant={getSeverityColor(result.severity) as any}>
                        <SeverityIcon className="w-3 h-3 mr-1" />
                        {result.severity.toUpperCase()}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setSelectedResult(result)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => deleteResult(result.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <img
                      src={result.imageData}
                      alt="Analysis"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{result.condition}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Confidence: {Math.round(result.confidence * 100)}%
                      </p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3 mr-1" />
                        {format(result.timestamp, 'MMM dd, yyyy')}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Detailed View Modal */}
        {selectedResult && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-auto bg-gradient-card border-border shadow-medical">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <HistoryIcon className="w-5 h-5 text-primary" />
                    <span>Analysis Details</span>
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedResult(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <img
                  src={selectedResult.imageData}
                  alt="Analysis"
                  className="w-full max-w-md mx-auto rounded-lg shadow-medical"
                />
                
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold">{selectedResult.condition}</h3>
                  <Badge variant={getSeverityColor(selectedResult.severity) as any}>
                    {selectedResult.severity.toUpperCase()}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Confidence</p>
                    <p className="text-xl font-semibold text-primary">
                      {Math.round(selectedResult.confidence * 100)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Analyzed</p>
                    <p className="text-lg font-medium">
                      {format(selectedResult.timestamp, 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{selectedResult.description}</p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Recommendations</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {selectedResult.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-primary">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}