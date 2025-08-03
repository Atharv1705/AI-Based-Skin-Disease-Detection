import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { 
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Users,
  Heart,
  Shield
} from "lucide-react";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate form submission
    toast({
      title: "Message Sent!",
      description: "Thank you for your message. We'll get back to you within 24 hours."
    });
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            <MessageCircle className="w-4 h-4 mr-2" />
            Contact Us
          </Badge>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Have questions about our AI skin analysis? Need technical support? 
            We're here to help you on your skin health journey.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-gradient-card border-border/50 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Phone className="w-5 h-5 text-primary" />
                  <span>Phone Support</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground font-medium">+1 (555) 123-4567</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Monday - Friday: 9:00 AM - 6:00 PM EST
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="w-5 h-5 text-primary" />
                  <span>Email Support</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground font-medium">support@skinai.com</p>
                <p className="text-sm text-muted-foreground mt-1">
                  We typically respond within 24 hours
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>Office Location</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground font-medium">123 Medical Plaza</p>
                <p className="text-foreground">Suite 450</p>
                <p className="text-foreground">New York, NY 10001</p>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-primary">
                  <Clock className="w-5 h-5" />
                  <span>Response Times</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Technical Issues:</span>
                  <span className="text-sm font-medium">2-4 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">General Inquiries:</span>
                  <span className="text-sm font-medium">24 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Medical Questions:</span>
                  <span className="text-sm font-medium">48 hours</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-card border-border/50 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Send className="w-5 h-5 text-primary" />
                  <span>Send us a Message</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="What can we help you with?"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Please describe your question or concern in detail..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card className="mt-8 bg-muted/30 border-border/50">
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-foreground mb-2">
                    How accurate is the AI skin analysis?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Our AI model has been trained on thousands of dermatological images and 
                    provides preliminary analysis. However, it should not replace professional 
                    medical consultation.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">
                    Is my data secure and private?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Yes, we use industry-standard encryption and never share your personal 
                    health information. All analysis is performed with medical-grade privacy protection.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">
                    Can I delete my analysis history?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Absolutely. You can delete your analysis history at any time from the 
                    Settings page. This action cannot be undone.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Card className="bg-primary/5 border-primary/20 max-w-4xl mx-auto">
            <CardContent className="pt-8 pb-6">
              <div className="flex items-center justify-center space-x-8 mb-6">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">Expert Support Team</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">Patient-Centered Care</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">HIPAA Compliant</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Still have questions?
              </h3>
              <p className="text-muted-foreground mb-4">
                Our medical support team is here to help you understand your skin health journey.
              </p>
              <Button variant="outline">
                <Phone className="w-4 h-4 mr-2" />
                Schedule a Call
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}