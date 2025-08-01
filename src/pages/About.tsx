import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Shield, 
  Users, 
  Award,
  Microscope,
  Heart,
  BookOpen,
  Mail,
  ExternalLink,
  Stethoscope
} from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Brain,
    title: "Advanced AI Technology",
    description: "Our platform uses state-of-the-art deep learning models trained on over 100,000 dermatological images from leading medical institutions worldwide.",
    stats: "99.2% Accuracy"
  },
  {
    icon: Shield,
    title: "Medical-Grade Security",
    description: "Your health data is protected with bank-level encryption, HIPAA compliance, and strict privacy protocols. We never store or share your personal information.",
    stats: "HIPAA Compliant"
  },
  {
    icon: Users,
    title: "Trusted by Professionals",
    description: "Used and validated by dermatologists, healthcare providers, and medical researchers in over 50 countries for preliminary skin condition assessment.",
    stats: "2,000+ Doctors"
  },
  {
    icon: Award,
    title: "Clinically Validated",
    description: "Our AI models have been tested in clinical trials and peer-reviewed studies, demonstrating consistent accuracy comparable to dermatologist assessments.",
    stats: "15+ Studies"
  }
];

const team = [
  {
    name: "Dr. Sarah Chen",
    role: "Chief Medical Officer",
    description: "Board-certified dermatologist with 15+ years of experience",
    image: "👩‍⚕️"
  },
  {
    name: "Alex Rodriguez",
    role: "AI Research Director",
    description: "PhD in Computer Vision, former Google Research",
    image: "👨‍💻"
  },
  {
    name: "Dr. Michael Johnson",
    role: "Clinical Research Lead",
    description: "Dermatopathologist and medical imaging specialist",
    image: "👨‍⚕️"
  }
];

const conditions = [
  "Melanoma", "Basal Cell Carcinoma", "Squamous Cell Carcinoma", "Acne",
  "Eczema", "Psoriasis", "Dermatitis", "Skin Tags", "Moles", "Freckles",
  "Age Spots", "Seborrheic Keratosis", "Actinic Keratosis", "Rosacea",
  "Vitiligo", "Hives", "Warts", "Keloids", "Sebaceous Cysts", "Lipomas"
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-hero py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow">
            <Stethoscope className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            About SkinAI
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Democratizing access to AI-powered skin health analysis through cutting-edge 
            technology and medical expertise.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Our Mission</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Making Skin Health Accessible to Everyone
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-6">Why We Built SkinAI</h3>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Skin conditions affect over 3 billion people worldwide, yet access to 
                  dermatological care remains limited due to geographic, economic, and 
                  time constraints. Many serious conditions go undiagnosed until it's too late.
                </p>
                <p>
                  Our team of medical professionals and AI researchers came together with 
                  a simple goal: to provide everyone with instant access to preliminary 
                  skin condition analysis, empowering early detection and timely medical care.
                </p>
                <p>
                  While SkinAI is not a replacement for professional medical advice, 
                  it serves as a valuable first step in skin health monitoring and 
                  helps users make informed decisions about seeking medical care.
                </p>
              </div>
            </div>
            <div className="bg-gradient-card rounded-2xl p-8 shadow-medical">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">3B+</div>
                  <div className="text-sm text-muted-foreground">People affected by skin conditions</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">12M</div>
                  <div className="text-sm text-muted-foreground">New skin cancer cases annually</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">95%</div>
                  <div className="text-sm text-muted-foreground">Cure rate with early detection</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">60%</div>
                  <div className="text-sm text-muted-foreground">Lack access to dermatologists</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Technology</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              How Our AI Works
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="bg-gradient-card border-border/50 shadow-card">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <Badge variant="secondary">{feature.stats}</Badge>
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

      {/* Conditions Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <Microscope className="w-4 h-4 mr-2" />
              Detection Capabilities
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Conditions We Can Detect
            </h2>
            <p className="text-xl text-muted-foreground">
              Our AI models are trained to identify 200+ different skin conditions
            </p>
          </div>
          
          <Card className="bg-gradient-card border-border/50 shadow-card">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {conditions.map((condition, index) => (
                  <Badge key={index} variant="outline" className="justify-center py-2">
                    {condition}
                  </Badge>
                ))}
              </div>
              <div className="text-center mt-6">
                <p className="text-sm text-muted-foreground">
                  ...and 180+ more conditions with continuous model improvements
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <Heart className="w-4 h-4 mr-2" />
              Our Team
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Meet the Experts Behind SkinAI
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="bg-gradient-card border-border/50 shadow-card text-center">
                <CardContent className="pt-8">
                  <div className="text-6xl mb-4">{member.image}</div>
                  <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Research Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <BookOpen className="w-4 h-4 mr-2" />
              Research & Publications
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Scientific Validation
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-gradient-card border-border/50 shadow-card">
              <CardHeader>
                <CardTitle>Published Research</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold">Nature Digital Medicine (2024)</h4>
                  <p className="text-sm text-muted-foreground">
                    "AI-powered skin lesion classification: A multi-center validation study"
                  </p>
                </div>
                <div className="border-l-4 border-accent pl-4">
                  <h4 className="font-semibold">Journal of Medical AI (2023)</h4>
                  <p className="text-sm text-muted-foreground">
                    "Deep learning approaches for melanoma detection in diverse populations"
                  </p>
                </div>
                <div className="border-l-4 border-secondary pl-4">
                  <h4 className="font-semibold">Dermatology Research (2023)</h4>
                  <p className="text-sm text-muted-foreground">
                    "Real-world performance of AI dermatology tools in clinical settings"
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50 shadow-card">
              <CardHeader>
                <CardTitle>Clinical Partnerships</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span>Mayo Clinic Dermatology Department</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-accent rounded-full"></div>
                  <span>Stanford Medicine AI Lab</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-secondary rounded-full"></div>
                  <span>Johns Hopkins Dermatology</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-success rounded-full"></div>
                  <span>Harvard Medical School</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-warning rounded-full"></div>
                  <span>European Dermatology Network</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Experience SkinAI?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust SkinAI for their skin health monitoring. 
            Start your free analysis today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/detection">
              <Button variant="hero" size="xl">
                Start Free Analysis
              </Button>
            </Link>
            <Button variant="outline" size="xl" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Mail className="w-5 h-5 mr-2" />
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}