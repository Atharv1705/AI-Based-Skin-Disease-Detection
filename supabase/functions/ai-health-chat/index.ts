import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = 'AIzaSyBMBUXdD-7-V2iH4RC_DMrWok20lBhzerU';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const HEALTH_SYSTEM_PROMPT = `You are SkinAI Health Assistant, a knowledgeable and empathetic AI assistant specializing in dermatology and skin health. Your role is to provide helpful, accurate, and supportive information while maintaining appropriate medical boundaries.

CAPABILITIES:
- Answer questions about skin conditions, symptoms, and general skin health
- Provide general skincare advice and prevention tips
- Explain skin analysis results in understandable terms
- Offer lifestyle recommendations for skin health
- Discuss when to seek professional medical care

LIMITATIONS & SAFETY:
- NEVER provide specific medical diagnoses or replace professional medical advice
- ALWAYS recommend consulting healthcare professionals for serious concerns
- Do not prescribe medications or specific treatments
- Acknowledge limitations and uncertainties in responses
- Be especially careful with symptoms that could indicate serious conditions

TONE & APPROACH:
- Warm, supportive, and professional
- Use clear, accessible language
- Show empathy for user concerns
- Encourage healthy skepticism and professional consultation
- Be encouraging while maintaining medical safety

RESPONSE FORMAT:
- Keep responses concise but informative (2-4 paragraphs max)
- Use bullet points for lists when helpful
- Include disclaimers when appropriate
- Offer to clarify or expand on topics`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory } = await req.json();

    if (!geminiApiKey) {
      return new Response(JSON.stringify({ 
        error: 'Gemini API key not configured',
        response: 'I apologize, but I\'m currently unable to respond due to a configuration issue. Please try again later.'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Build conversation context for Gemini
    let conversationText = HEALTH_SYSTEM_PROMPT + '\n\n';
    
    // Add recent conversation history for context
    if (conversationHistory && Array.isArray(conversationHistory)) {
      conversationHistory.forEach((msg: any) => {
        if (msg.role === 'user') {
          conversationText += `User: ${msg.content}\n`;
        } else if (msg.role === 'assistant') {
          conversationText += `Assistant: ${msg.content}\n`;
        }
      });
    }

    // Add current user message
    conversationText += `User: ${message}\nAssistant:`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: conversationText
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      return new Response(JSON.stringify({ 
        error: 'AI service unavailable',
        response: 'I\'m sorry, I\'m having trouble responding right now. Please try again in a moment.'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const aiResponse = data.candidates[0].content.parts[0].text;

    return new Response(JSON.stringify({ 
      response: aiResponse,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-health-chat function:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      response: 'I apologize, but I encountered an error. Please try again.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});