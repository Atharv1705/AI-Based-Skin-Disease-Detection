import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Database, 
  TrendingUp, 
  Code, 
  FileText,
  Download,
  Upload,
  Settings,
  Zap,
  AlertCircle,
  ExternalLink
} from "lucide-react";

export default function MLTrainingGuide() {
  const trainingSteps = [
    {
      step: 1,
      title: "Data Collection",
      description: "Gather high-quality, labeled dermatological images",
      icon: Database,
      details: [
        "Collect diverse skin condition images",
        "Ensure proper lighting and resolution",
        "Include various skin types and ethnicities",
        "Obtain proper medical annotations"
      ]
    },
    {
      step: 2,
      title: "Data Preprocessing",
      description: "Clean and prepare your dataset for training",
      icon: Settings,
      details: [
        "Resize images to consistent dimensions",
        "Apply data augmentation techniques",
        "Split into training/validation/test sets",
        "Balance classes to avoid bias"
      ]
    },
    {
      step: 3,
      title: "Model Architecture",
      description: "Choose and configure your AI model",
      icon: Brain,
      details: [
        "Use convolutional neural networks (CNNs)",
        "Consider transfer learning from pre-trained models",
        "Implement attention mechanisms",
        "Add regularization to prevent overfitting"
      ]
    },
    {
      step: 4,
      title: "Training Process",
      description: "Train your model with medical data",
      icon: TrendingUp,
      details: [
        "Use appropriate loss functions",
        "Monitor validation metrics",
        "Implement early stopping",
        "Save model checkpoints"
      ]
    },
    {
      step: 5,
      title: "Model Validation",
      description: "Test and validate model performance",
      icon: FileText,
      details: [
        "Calculate accuracy, precision, recall",
        "Test on diverse patient populations",
        "Validate against clinical standards",
        "Perform cross-validation"
      ]
    },
    {
      step: 6,
      title: "Deployment",
      description: "Deploy your trained model to production",
      icon: Zap,
      details: [
        "Optimize model for inference speed",
        "Implement model versioning",
        "Set up monitoring and logging",
        "Ensure HIPAA compliance"
      ]
    }
  ];

  const technicalRequirements = [
    {
      title: "Hardware Requirements",
      items: [
        "GPU with 8GB+ VRAM (RTX 3080/4080 or better)",
        "32GB+ system RAM",
        "Fast SSD storage (1TB+ recommended)",
        "High-speed internet for data transfer"
      ]
    },
    {
      title: "Software Stack",
      items: [
        "Python 3.8+",
        "TensorFlow/PyTorch",
        "OpenCV for image processing",
        "NumPy, Pandas for data handling"
      ]
    },
    {
      title: "Medical Standards",
      items: [
        "DICOM compliance for medical imaging",
        "HL7 FHIR for health data exchange",
        "FDA guidelines for medical AI",
        "Clinical validation protocols"
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <Card className="bg-gradient-hero border-border/50 shadow-medical overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5"></div>
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">ML Model Training Guide</CardTitle>
                <p className="text-muted-foreground">Learn how to train your own AI model for skin disease detection</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-warning/10 text-warning">
              <Code className="w-3 h-3 mr-1" />
              Advanced Topic
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Training Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {trainingSteps.map((step, index) => {
          const Icon = step.icon;
          return (
            <Card key={index} className="bg-gradient-card border-border/50 shadow-card">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-primary font-bold">{step.step}</span>
                  </div>
                  <Icon className="w-6 h-6 text-primary" />
                  <div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {step.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                      <span className="text-sm text-muted-foreground">{detail}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Technical Requirements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {technicalRequirements.map((req, index) => (
          <Card key={index} className="bg-gradient-card border-border/50 shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">{req.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {req.items.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2"></div>
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dataset Resources */}
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-primary" />
            <span>Available Medical Datasets</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center">
                <FileText className="w-4 h-4 mr-2 text-primary" />
                ISIC Archive
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                International Skin Imaging Collaboration - largest public collection of dermoscopic images
              </p>
              <Button variant="outline" size="sm" className="w-full">
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit ISIC
              </Button>
            </div>

            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center">
                <Database className="w-4 h-4 mr-2 text-primary" />
                HAM10000
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Large collection of multi-source dermatoscopic images of common pigmented skin lesions
              </p>
              <Button variant="outline" size="sm" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download Dataset
              </Button>
            </div>

            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center">
                <Brain className="w-4 h-4 mr-2 text-primary" />
                DermNet NZ
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Comprehensive database of dermatology images with clinical annotations
              </p>
              <Button variant="outline" size="sm" className="w-full">
                <ExternalLink className="w-4 h-4 mr-2" />
                Access DermNet
              </Button>
            </div>

            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center">
                <Upload className="w-4 h-4 mr-2 text-primary" />
                Custom Dataset
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Create your own dataset with proper medical supervision and annotations
              </p>
              <Button variant="outline" size="sm" className="w-full">
                <Settings className="w-4 h-4 mr-2" />
                Setup Guide
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Implementation Example */}
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Code className="w-5 h-5 text-primary" />
            <span>Quick Start Code Example</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
            <pre className="text-foreground">
{`# Install required packages
pip install tensorflow opencv-python pandas numpy

# Basic model training structure
import tensorflow as tf
from tensorflow.keras import layers, models

# Load and preprocess data
def load_skin_dataset(data_path):
    # Load your dermatological images
    # Apply data augmentation
    # Split into train/validation sets
    pass

# Create CNN model for skin condition classification
model = models.Sequential([
    layers.Conv2D(32, (3, 3), activation='relu', input_shape=(224, 224, 3)),
    layers.MaxPooling2D((2, 2)),
    layers.Conv2D(64, (3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),
    layers.Conv2D(128, (3, 3), activation='relu'),
    layers.Flatten(),
    layers.Dense(128, activation='relu'),
    layers.Dropout(0.5),
    layers.Dense(num_classes, activation='softmax')
])

# Compile and train
model.compile(optimizer='adam',
              loss='categorical_crossentropy',
              metrics=['accuracy'])

# Train the model
history = model.fit(train_data, 
                   validation_data=val_data,
                   epochs=50,
                   callbacks=[early_stopping, model_checkpoint])

# Save trained model
model.save('skin_condition_classifier.h5')`}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Legal and Ethical Considerations */}
      <Card className="bg-destructive/5 border-destructive/20">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
            <div>
              <h4 className="font-medium text-destructive mb-2">Important Legal & Ethical Considerations</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Obtain proper IRB approval for medical research</li>
                <li>• Ensure patient consent for data usage</li>
                <li>• Follow HIPAA compliance for patient data</li>
                <li>• Validate with medical professionals before deployment</li>
                <li>• Consider FDA regulations for medical AI devices</li>
                <li>• Implement bias testing across different demographics</li>
                <li>• Provide clear disclaimers about AI limitations</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}