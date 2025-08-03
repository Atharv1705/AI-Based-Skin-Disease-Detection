import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen,
  Search,
  Heart,
  Sun,
  Droplets,
  Shield,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Play,
  Clock,
  Users
} from "lucide-react";

const skinConditions = [
  {
    id: "acne",
    name: "Acne",
    category: "Common",
    severity: "Low to High",
    description: "Acne occurs when hair follicles become clogged with oil and dead skin cells.",
    symptoms: ["Whiteheads", "Blackheads", "Papules", "Pustules", "Cysts"],
    causes: ["Hormonal changes", "Genetics", "Certain medications", "Diet factors"],
    treatments: ["Topical retinoids", "Antibiotics", "Hormonal therapy", "Professional treatments"],
    prevention: ["Gentle cleansing", "Non-comedogenic products", "Avoid picking", "Consistent routine"]
  },
  {
    id: "eczema",
    name: "Eczema (Atopic Dermatitis)",
    category: "Chronic",
    severity: "Medium",
    description: "A condition that makes skin red, inflamed, and itchy.",
    symptoms: ["Dry skin", "Itching", "Red patches", "Scaling", "Cracking"],
    causes: ["Genetics", "Environmental triggers", "Immune system", "Stress"],
    treatments: ["Moisturizers", "Topical corticosteroids", "Antihistamines", "Prescription medications"],
    prevention: ["Regular moisturizing", "Identify triggers", "Use gentle products", "Manage stress"]
  },
  {
    id: "psoriasis",
    name: "Psoriasis",
    category: "Autoimmune",
    severity: "Medium to High",
    description: "An autoimmune condition causing rapid skin cell buildup.",
    symptoms: ["Thick, scaly patches", "Redness", "Itching", "Burning sensation"],
    causes: ["Autoimmune response", "Genetics", "Stress", "Infections"],
    treatments: ["Topical treatments", "Light therapy", "Systemic medications", "Biologics"],
    prevention: ["Stress management", "Avoid triggers", "Maintain healthy weight", "Regular care"]
  }
];

const skinCareBasics = [
  {
    title: "Daily Cleansing",
    description: "Use a gentle cleanser twice daily to remove dirt, oil, and makeup without stripping natural oils.",
    icon: Droplets,
    tips: ["Use lukewarm water", "Pat dry with clean towel", "Choose pH-balanced cleansers", "Don't over-cleanse"]
  },
  {
    title: "Sun Protection",
    description: "Apply broad-spectrum SPF 30+ sunscreen daily, even on cloudy days.",
    icon: Sun,
    tips: ["Reapply every 2 hours", "Use enough product", "Don't forget ears and neck", "Seek shade when possible"]
  },
  {
    title: "Moisturizing",
    description: "Keep skin hydrated with appropriate moisturizers for your skin type.",
    icon: Heart,
    tips: ["Apply to damp skin", "Choose non-comedogenic formulas", "Use heavier creams at night", "Don't neglect body skin"]
  },
  {
    title: "Gentle Exfoliation",
    description: "Remove dead skin cells 1-2 times per week to promote cell turnover.",
    icon: Shield,
    tips: ["Start slowly", "Use chemical exfoliants", "Avoid harsh scrubs", "Always follow with moisturizer"]
  }
];

export default function Education() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);

  const filteredConditions = skinConditions.filter(condition =>
    condition.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    condition.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSeverityColor = (severity: string) => {
    if (severity.includes("Low")) return "text-success";
    if (severity.includes("Medium")) return "text-warning";
    if (severity.includes("High")) return "text-destructive";
    return "text-muted-foreground";
  };

  const getSeverityBadge = (severity: string) => {
    if (severity.includes("Low")) return "secondary" as const;
    if (severity.includes("Medium")) return "secondary" as const;
    if (severity.includes("High")) return "destructive" as const;
    return "secondary" as const;
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-4">
            <BookOpen className="w-4 h-4 mr-2" />
            Education
          </Badge>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Skin Health Education
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Learn about common skin conditions, proper care routines, and when to seek professional help
          </p>
        </div>

        <Tabs defaultValue="conditions" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="conditions">Skin Conditions</TabsTrigger>
            <TabsTrigger value="basics">Care Basics</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          {/* Skin Conditions Tab */}
          <TabsContent value="conditions" className="space-y-6">
            {/* Search */}
            <Card className="bg-gradient-card border-border/50 shadow-card">
              <CardContent className="p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search skin conditions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Conditions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredConditions.map((condition) => (
                <Card 
                  key={condition.id}
                  className="bg-gradient-card border-border/50 shadow-card hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedCondition(condition.id)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{condition.name}</CardTitle>
                      <Badge variant={getSeverityBadge(condition.severity)}>
                        {condition.severity}
                      </Badge>
                    </div>
                    <Badge variant="outline" className="w-fit">
                      {condition.category}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {condition.description}
                    </p>
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Common Symptoms:</h4>
                      <div className="flex flex-wrap gap-1">
                        {condition.symptoms.slice(0, 3).map((symptom, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {symptom}
                          </Badge>
                        ))}
                        {condition.symptoms.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{condition.symptoms.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Detailed View Modal */}
            {selectedCondition && (
              <Card className="bg-gradient-card border-border/50 shadow-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl">
                      {skinConditions.find(c => c.id === selectedCondition)?.name}
                    </CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedCondition(null)}
                    >
                      Close
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {(() => {
                    const condition = skinConditions.find(c => c.id === selectedCondition);
                    if (!condition) return null;
                    
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-semibold text-lg mb-2 flex items-center">
                              <AlertTriangle className="w-5 h-5 mr-2 text-warning" />
                              Symptoms
                            </h3>
                            <ul className="space-y-1">
                              {condition.symptoms.map((symptom, index) => (
                                <li key={index} className="flex items-center text-sm">
                                  <CheckCircle2 className="w-4 h-4 mr-2 text-success" />
                                  {symptom}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h3 className="font-semibold text-lg mb-2">Common Causes</h3>
                            <ul className="space-y-1">
                              {condition.causes.map((cause, index) => (
                                <li key={index} className="flex items-center text-sm">
                                  <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                                  {cause}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-semibold text-lg mb-2">Treatment Options</h3>
                            <ul className="space-y-1">
                              {condition.treatments.map((treatment, index) => (
                                <li key={index} className="flex items-center text-sm">
                                  <Heart className="w-4 h-4 mr-2 text-accent" />
                                  {treatment}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h3 className="font-semibold text-lg mb-2">Prevention Tips</h3>
                            <ul className="space-y-1">
                              {condition.prevention.map((tip, index) => (
                                <li key={index} className="flex items-center text-sm">
                                  <Shield className="w-4 h-4 mr-2 text-success" />
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Care Basics Tab */}
          <TabsContent value="basics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {skinCareBasics.map((basic, index) => {
                const Icon = basic.icon;
                return (
                  <Card key={index} className="bg-gradient-card border-border/50 shadow-card">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <span>{basic.title}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">{basic.description}</p>
                      <div>
                        <h4 className="font-medium mb-2">Key Tips:</h4>
                        <ul className="space-y-1">
                          {basic.tips.map((tip, tipIndex) => (
                            <li key={tipIndex} className="flex items-center text-sm">
                              <CheckCircle2 className="w-4 h-4 mr-2 text-success" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Weekly Routine */}
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-primary">Sample Weekly Routine</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                    <div key={day} className="text-center">
                      <h4 className="font-medium mb-2">{day}</h4>
                      <div className="space-y-1 text-xs">
                        <div className="bg-success/10 text-success px-2 py-1 rounded">AM: Cleanse + SPF</div>
                        <div className="bg-accent/10 text-accent px-2 py-1 rounded">PM: Cleanse + Moisturize</div>
                        {(index === 2 || index === 5) && (
                          <div className="bg-warning/10 text-warning px-2 py-1 rounded">Exfoliate</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Video Resources */}
              <Card className="bg-gradient-card border-border/50 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Play className="w-5 h-5 text-primary" />
                    <span>Video Tutorials</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="font-medium">Proper Face Washing Technique</h4>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      5 min
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Watch
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Understanding Your Skin Type</h4>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      8 min
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Watch
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Expert Articles */}
              <Card className="bg-gradient-card border-border/50 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <span>Expert Articles</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="font-medium">The Science of Skin Aging</h4>
                    <p className="text-sm text-muted-foreground">
                      Understanding how skin changes over time and prevention strategies.
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Read Article
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Ingredient Guide</h4>
                    <p className="text-sm text-muted-foreground">
                      What to look for in skincare products and what to avoid.
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Read Article
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Community */}
              <Card className="bg-gradient-card border-border/50 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-primary" />
                    <span>Community</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="font-medium">Join Support Groups</h4>
                    <p className="text-sm text-muted-foreground">
                      Connect with others who share similar skin concerns.
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      <Users className="w-4 h-4 mr-2" />
                      Join Community
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Ask Experts</h4>
                    <p className="text-sm text-muted-foreground">
                      Get answers from dermatology professionals.
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Ask Question
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Important Notice */}
            <Card className="bg-destructive/5 border-destructive/20">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
                  <div>
                    <h4 className="font-medium text-destructive mb-2">Medical Disclaimer</h4>
                    <p className="text-sm text-muted-foreground">
                      This information is for educational purposes only and should not replace professional medical advice. 
                      Always consult with a dermatologist or healthcare provider for proper diagnosis and treatment of skin conditions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}