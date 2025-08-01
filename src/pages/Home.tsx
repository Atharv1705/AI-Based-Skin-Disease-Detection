import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  Scan,
  Shield,
  Clock,
  Users,
  Award,
  ChevronRight,
  Stethoscope,
  Brain,
  Zap
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description: "Advanced machine learning models trained on thousands of dermatological images",
    color: "bg-primary/10 text-primary"
  },
  {
    icon: Camera,
    title: "Real-time Detection",
    description: "Instant analysis using your device's camera or uploaded images",
    color: "bg-accent/10 text-accent"
  },
  {
    icon: Shield,
    title: "Medical Grade Security",
    description: "Your health data is protected with enterprise-level encryption",
    color: "bg-success/10 text-success"
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Get skin analysis anytime, anywhere, without waiting for appointments",
    color: "bg-secondary/10 text-secondary"
  },
  {
    icon: Zap,
    title: "Instant Results",
    description: "Receive detailed analysis and recommendations in seconds",
    color: "bg-warning/10 text-warning"
  },
  {
    icon: Users,
    title: "Trusted by Professionals",
    description: "Used by dermatologists and healthcare providers worldwide",
    color: "bg-destructive/10 text-destructive"
  }
];

const stats = [
  { number: "500K+", label: "Analyses Completed" },
  { number: "98.5%", label: "Accuracy Rate" },
  { number: "200+", label: "Skin Conditions" },
  { number: "50+", label: "Countries" }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 lg:py-32">
        <div className="absolute inset-0 bg-background/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-glow">
                <Stethoscope className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Advanced AI Skin
              <br />
              <span className="bg-white/20 px-4 py-2 rounded-lg backdrop-blur-md">
                Disease Detection
              </span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Get instant, accurate skin condition analysis using cutting-edge artificial intelligence. 
              Detect potential issues early and take control of your skin health.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/detection">
                <Button variant="hero" size="xl" className="group">
                  <Camera className="w-6 h-6 mr-2 group-hover:rotate-12 transition-transform" />
                  Start Analysis
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="xl" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Advanced Technology
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Why Choose SkinAI?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform combines the latest in AI technology with medical expertise 
              to provide you with accurate and reliable skin health analysis.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="bg-gradient-card border-border/50 shadow-card hover:shadow-medical transition-all duration-300 group">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Simple Process
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Get professional-grade skin analysis in just three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Capture or Upload",
                description: "Take a photo with your camera or upload an existing image of the affected skin area",
                icon: Camera
              },
              {
                step: "02",
                title: "AI Analysis",
                description: "Our advanced AI models analyze the image to detect potential skin conditions",
                icon: Scan
              },
              {
                step: "03",
                title: "Get Results",
                description: "Receive detailed analysis with confidence scores and professional recommendations",
                icon: Award
              }
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="text-center relative">
                  {index < 2 && (
                    <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary to-transparent transform translate-x-1/2 z-0"></div>
                  )}
                  <div className="relative z-10 bg-card rounded-2xl p-8 shadow-card border border-border/50">
                    <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow">
                      <Icon className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <div className="text-sm font-semibold text-primary mb-2">STEP {step.step}</div>
                    <h3 className="text-xl font-bold text-foreground mb-4">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Check Your Skin Health?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust SkinAI for their skin health monitoring. 
            Start your free analysis today.
          </p>
          <Link to="/detection">
            <Button variant="hero" size="xl" className="group">
              <Scan className="w-6 h-6 mr-2 group-hover:scale-110 transition-transform" />
              Start Free Analysis
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}