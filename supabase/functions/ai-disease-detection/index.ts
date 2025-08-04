import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Medical knowledge database for skin conditions
const MEDICAL_KNOWLEDGE = {
  "acne": {
    description: "Common inflammatory skin condition characterized by comedones, papules, pustules, and sometimes nodules.",
    severity: "low",
    recommendations: [
      "Use gentle, non-comedogenic cleansers twice daily",
      "Apply topical retinoids or salicylic acid",
      "Avoid picking or squeezing lesions",
      "Consider seeing a dermatologist for persistent cases"
    ],
    urgency: "routine"
  },
  "melanoma": {
    description: "Serious form of skin cancer that develops from melanocytes. Requires immediate medical attention.",
    severity: "high",
    recommendations: [
      "URGENT: See a dermatologist immediately",
      "Avoid sun exposure and use high SPF sunscreen",
      "Monitor for changes in size, color, or shape",
      "Consider biopsy as recommended by physician"
    ],
    urgency: "immediate"
  },
  "eczema": {
    description: "Chronic inflammatory skin condition causing dry, itchy, and inflamed patches.",
    severity: "medium",
    recommendations: [
      "Use fragrance-free moisturizers regularly",
      "Avoid known triggers (stress, allergens)",
      "Apply topical corticosteroids as directed",
      "Consider antihistamines for itching"
    ],
    urgency: "routine"
  },
  "psoriasis": {
    description: "Autoimmune condition causing thick, scaly patches of skin.",
    severity: "medium",
    recommendations: [
      "Use moisturizers and topical treatments",
      "Avoid triggers like stress and infections",
      "Consider phototherapy or systemic treatments",
      "Consult dermatologist for treatment plan"
    ],
    urgency: "routine"
  },
  "dermatitis": {
    description: "General term for skin inflammation that can be caused by allergens or irritants.",
    severity: "low",
    recommendations: [
      "Identify and avoid triggers",
      "Use mild, fragrance-free products",
      "Apply topical corticosteroids if needed",
      "Keep skin moisturized"
    ],
    urgency: "routine"
  },
  "rosacea": {
    description: "Chronic inflammatory condition affecting facial skin, causing redness and visible blood vessels.",
    severity: "medium",
    recommendations: [
      "Avoid known triggers (spicy foods, alcohol, sun)",
      "Use gentle skincare products",
      "Apply broad-spectrum sunscreen daily",
      "Consider topical or oral treatments"
    ],
    urgency: "routine"
  },
  "basal_cell_carcinoma": {
    description: "Most common type of skin cancer, typically slow-growing and locally invasive.",
    severity: "high",
    recommendations: [
      "See dermatologist for evaluation and biopsy",
      "Avoid sun exposure and use SPF 30+ sunscreen",
      "Monitor for changes in appearance",
      "Consider surgical removal as recommended"
    ],
    urgency: "urgent"
  },
  "squamous_cell_carcinoma": {
    description: "Second most common skin cancer, can metastasize if left untreated.",
    severity: "high",
    recommendations: [
      "URGENT: See dermatologist immediately",
      "Avoid sun exposure and use high SPF protection",
      "Monitor for rapid changes",
      "May require surgical intervention"
    ],
    urgency: "urgent"
  },
  "seborrheic_keratosis": {
    description: "Common benign skin growth that appears as waxy, scaly patches.",
    severity: "low",
    recommendations: [
      "Generally no treatment needed",
      "Monitor for changes in appearance",
      "Consider removal for cosmetic reasons",
      "Consult dermatologist if appearance changes"
    ],
    urgency: "routine"
  },
  "contact_dermatitis": {
    description: "Skin reaction caused by contact with allergens or irritants.",
    severity: "low",
    recommendations: [
      "Identify and avoid the triggering substance",
      "Use cool compresses for relief",
      "Apply topical corticosteroids",
      "Keep the area clean and dry"
    ],
    urgency: "routine"
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageData, patientAge, patientSex, medicalHistory } = await req.json();

    if (!openAIApiKey) {
      return new Response(JSON.stringify({ 
        error: 'OpenAI API key not configured',
        details: 'Please configure the OPENAI_API_KEY in your edge function secrets.'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Enhanced prompt for medical analysis
    const medicalPrompt = `You are an expert dermatologist AI assistant. Analyze this skin image and provide a detailed medical assessment.

Patient Information:
- Age: ${patientAge || 'Not provided'}
- Sex: ${patientSex || 'Not provided'}
- Medical History: ${medicalHistory || 'Not provided'}

Please analyze the image and respond with ONLY a JSON object in this exact format:
{
  "condition": "most_likely_condition_name",
  "confidence": 0.85,
  "severity": "low|medium|high",
  "description": "detailed medical description",
  "differential_diagnoses": ["alternative_condition1", "alternative_condition2"],
  "recommendations": ["recommendation1", "recommendation2"],
  "urgency": "routine|urgent|immediate",
  "disclaimer": "This is an AI analysis and should not replace professional medical consultation."
}

Focus on common skin conditions like: acne, eczema, psoriasis, dermatitis, rosacea, melanoma, basal cell carcinoma, squamous cell carcinoma, seborrheic keratosis, contact dermatitis.

Consider factors like:
- Color variations and patterns
- Texture and surface characteristics
- Size and distribution
- Symmetry and border irregularities
- Patient demographics and history

Provide confidence as a decimal between 0.0 and 1.0.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: medicalPrompt
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Please analyze this skin condition image and provide your medical assessment.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageData,
                  detail: 'high'
                }
              }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.1, // Low temperature for consistent medical analysis
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      return new Response(JSON.stringify({ 
        error: 'AI analysis failed',
        details: `OpenAI API returned ${response.status}: ${errorData}`
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    let aiAnalysis;
    
    try {
      const content = data.choices[0].message.content;
      // Extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiAnalysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      // Fallback analysis
      aiAnalysis = {
        condition: "skin_condition",
        confidence: 0.7,
        severity: "medium",
        description: "Unable to parse detailed analysis. General skin condition detected.",
        differential_diagnoses: ["eczema", "dermatitis"],
        recommendations: ["Consult a dermatologist for proper diagnosis"],
        urgency: "routine",
        disclaimer: "This is an AI analysis and should not replace professional medical consultation."
      };
    }

    // Enhance with medical knowledge if available
    const conditionKey = aiAnalysis.condition.toLowerCase().replace(/[^a-z]/g, '_');
    const medicalInfo = MEDICAL_KNOWLEDGE[conditionKey];
    
    if (medicalInfo) {
      aiAnalysis.description = medicalInfo.description;
      aiAnalysis.recommendations = medicalInfo.recommendations;
      aiAnalysis.severity = medicalInfo.severity;
      aiAnalysis.urgency = medicalInfo.urgency;
    }

    // Add safety measures
    if (aiAnalysis.severity === 'high' || aiAnalysis.urgency === 'immediate' || aiAnalysis.urgency === 'urgent') {
      aiAnalysis.recommendations.unshift("⚠️ IMPORTANT: Seek immediate medical attention from a qualified dermatologist or physician");
    }

    // Generate unique analysis ID
    const analysisId = crypto.randomUUID();
    
    const result = {
      id: analysisId,
      timestamp: new Date().toISOString(),
      analysis: aiAnalysis,
      confidence_level: aiAnalysis.confidence > 0.8 ? 'high' : aiAnalysis.confidence > 0.6 ? 'medium' : 'low',
      medical_disclaimer: "This AI analysis is for informational purposes only and should not replace professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for medical concerns."
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-disease-detection function:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});