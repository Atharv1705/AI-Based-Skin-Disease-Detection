import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY') || 'AIzaSyBMBUXdD-7-V2iH4RC_DMrWok20lBhzerU';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Medical knowledge base for enhanced responses
const MEDICAL_KNOWLEDGE = {
  'acne': {
    commonTreatments: ['Topical retinoids', 'Benzoyl peroxide', 'Salicylic acid', 'Antibiotics'],
    severity: 'mild-severe',
    specialist: 'dermatologist',
    urgency: 'routine'
  },
  'eczema': {
    commonTreatments: ['Moisturizers', 'Topical corticosteroids', 'Antihistamines'],
    severity: 'mild-severe', 
    specialist: 'dermatologist or allergist',
    urgency: 'routine'
  },
  'psoriasis': {
    commonTreatments: ['Topical corticosteroids', 'Vitamin D analogs', 'Immunosuppressants'],
    severity: 'mild-severe',
    specialist: 'dermatologist or rheumatologist', 
    urgency: 'routine'
  },
  'melanoma': {
    commonTreatments: ['Surgical excision', 'Immunotherapy', 'Radiation therapy'],
    severity: 'severe',
    specialist: 'oncological dermatologist',
    urgency: 'urgent'
  },
  'basal_cell_carcinoma': {
    commonTreatments: ['Surgical excision', 'Mohs surgery', 'Topical chemotherapy'],
    severity: 'moderate-severe',
    specialist: 'dermatologist or dermatological surgeon',
    urgency: 'semi-urgent'
  },
  'dermatitis': {
    commonTreatments: ['Avoid irritants', 'Moisturizers', 'Topical corticosteroids'],
    severity: 'mild-moderate',
    specialist: 'dermatologist or allergist',
    urgency: 'routine'
  },
  'rosacea': {
    commonTreatments: ['Topical metronidazole', 'Oral antibiotics', 'Lifestyle modifications'],
    severity: 'mild-moderate', 
    specialist: 'dermatologist',
    urgency: 'routine'
  },
  'fungal_infection': {
    commonTreatments: ['Antifungal creams', 'Oral antifungals', 'Proper hygiene'],
    severity: 'mild-moderate',
    specialist: 'dermatologist or primary care',
    urgency: 'routine'
  },
  'warts': {
    commonTreatments: ['Cryotherapy', 'Topical treatments', 'Laser therapy'],
    severity: 'mild',
    specialist: 'dermatologist or primary care',
    urgency: 'routine'
  },
  'normal_skin': {
    commonTreatments: ['Regular skincare routine', 'Sun protection', 'Moisturizing'],
    severity: 'none',
    specialist: 'none required',
    urgency: 'none'
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageData, patientAge, patientSex, medicalHistory } = await req.json();

    if (!geminiApiKey) {
      return new Response(JSON.stringify({ 
        error: 'Gemini API key not configured',
        details: 'Please configure the GEMINI_API_KEY in your edge function.'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Enhanced prompt for medical analysis
    const medicalPrompt = `You are an expert dermatologist AI assistant. Analyze this skin image and provide a detailed medical assessment.

PATIENT INFORMATION:
- Age: ${patientAge || 'Not specified'}
- Sex: ${patientSex || 'Not specified'}  
- Medical History: ${medicalHistory || 'No significant history provided'}

ANALYSIS REQUIREMENTS:
Please provide your analysis in this EXACT JSON format:

{
  "condition": "primary_diagnosis_name",
  "confidence": 85,
  "severity": "mild|moderate|severe",
  "description": "Detailed description of findings and characteristics observed",
  "differential_diagnoses": ["alternative_diagnosis_1", "alternative_diagnosis_2"],
  "recommendations": [
    "Specific treatment recommendation 1",
    "Specific treatment recommendation 2", 
    "Specific care instruction 3"
  ],
  "urgency": "routine|semi-urgent|urgent",
  "follow_up": "Recommended timeframe for follow-up care",
  "red_flags": ["any concerning features that require immediate attention"]
}

IMPORTANT GUIDELINES:
- Focus on visible characteristics like color, texture, size, distribution
- Consider patient age and sex in your assessment
- Provide realistic confidence levels (60-95%)
- Be specific with recommendations
- Include both immediate care and long-term management
- Flag any concerning features that need urgent attention
- If the image shows normal skin, indicate that clearly

Analyze the image thoroughly and respond with only the JSON object.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              text: medicalPrompt
            },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: imageData.split(',')[1] // Remove data:image/jpeg;base64, prefix
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1000,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      
      // Handle quota exceeded gracefully
      if (errorData.includes('quota') || errorData.includes('rate limit')) {
        return new Response(
          JSON.stringify({ 
            error: 'AI analysis temporarily unavailable due to high demand. Please try again in a few minutes.',
            details: 'Rate limit exceeded',
            isQuotaError: true
          }),
          { 
            status: 429, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      
      return new Response(JSON.stringify({ 
        error: 'AI analysis failed',
        details: errorData
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    let aiAnalysis;
    
    try {
      const rawContent = data.candidates[0].content.parts[0].text;
      console.log('Raw AI response:', rawContent);
      
      // Try to extract JSON from the response
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiAnalysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      return new Response(JSON.stringify({
        error: 'Failed to parse AI analysis',
        details: parseError.message
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Enhance analysis with medical knowledge
    const condition = aiAnalysis.condition?.toLowerCase().replace(/\s+/g, '_');
    const knowledgeBase = MEDICAL_KNOWLEDGE[condition] || {};
    
    // Add safety warnings for high severity or urgent cases
    let safetyWarnings = [];
    if (aiAnalysis.severity === 'severe' || aiAnalysis.urgency === 'urgent') {
      safetyWarnings.push('This analysis suggests a potentially serious condition. Please seek immediate medical attention.');
    }
    if (aiAnalysis.red_flags && aiAnalysis.red_flags.length > 0) {
      safetyWarnings.push('Red flag symptoms detected. Urgent medical evaluation recommended.');
    }

    // Generate unique analysis ID and timestamp
    const analysisId = `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date().toISOString();

    const enhancedAnalysis = {
      ...aiAnalysis,
      analysisId,
      timestamp,
      patientInfo: {
        age: patientAge,
        sex: patientSex,
        medicalHistory
      },
      medicalKnowledge: knowledgeBase,
      safetyWarnings,
      confidence: Math.min(Math.max(aiAnalysis.confidence || 70, 60), 95), // Ensure realistic range
      disclaimer: "This AI analysis is for informational purposes only and should not replace professional medical advice. Always consult with a qualified healthcare provider for proper diagnosis and treatment."
    };

    return new Response(JSON.stringify(enhancedAnalysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Gemini API error:', JSON.stringify(error, null, 2));
    
    // Handle quota exceeded gracefully
    const errorMessage = error.message || 'Failed to analyze image with AI';
    if (errorMessage.includes('quota') || errorMessage.includes('rate limit')) {
      return new Response(
        JSON.stringify({ 
          error: 'AI analysis temporarily unavailable due to high demand. Please try again in a few minutes.',
          details: 'Rate limit exceeded',
          isQuotaError: true
        }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to analyze image with AI',
        details: errorMessage 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});