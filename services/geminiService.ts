
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export interface TriageResult {
  severity: 'Low' | 'Medium' | 'High';
  summary: string;
  instructions: string[];
  dos: string[];
  donts: string[];
  recommendedSpecialist: string;
  isHospitalVisitRequired: boolean;
}

export interface GroundingLink {
  title: string;
  uri: string;
}

export interface HospitalSearchResponse {
  text: string;
  links: GroundingLink[];
}

export const analyzeInjury = async (description: string): Promise<TriageResult> => {
  try {
    // Using gemini-3-pro-preview for complex reasoning and medical triage accuracy
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Analyze this emergency injury description and provide a professional triage response: "${description}"`,
      config: {
        systemInstruction: `You are a professional emergency medical triage assistant. 
        Analyze descriptions of external injuries carefully. 
        1. Categorize severity: Low (minor cuts, bruises), Medium (deep cuts, possible fracture, 2nd degree burns), High (heavy bleeding, head trauma, unconsciousness, 3rd degree burns).
        2. Provide clear, numbered first aid steps.
        3. Provide essential Do's and Don'ts.
        4. Recommend a specialist type if needed.
        5. Flag if a hospital visit is mandatory.
        Always be concise and safety-first. Return results in strict JSON format.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            severity: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
            summary: { type: Type.STRING },
            instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
            dos: { type: Type.ARRAY, items: { type: Type.STRING } },
            donts: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendedSpecialist: { type: Type.STRING },
            isHospitalVisitRequired: { type: Type.BOOLEAN }
          },
          required: ['severity', 'summary', 'instructions', 'dos', 'donts', 'recommendedSpecialist', 'isHospitalVisitRequired']
        },
        thinkingConfig: { thinkingBudget: 4000 }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return {
      severity: 'Medium',
      summary: "We're unable to analyze the severity right now. Please seek immediate medical attention if the situation is urgent.",
      instructions: ["Keep the wound clean", "Apply pressure if bleeding", "Call emergency services if pain persists"],
      dos: ["Keep the person warm", "Stay calm"],
      donts: ["Do not move the person if neck injury is suspected", "Do not apply ice directly to skin"],
      recommendedSpecialist: "Emergency Physician",
      isHospitalVisitRequired: true
    };
  }
};

export const findNearbyHospitals = async (lat: number, lng: number): Promise<HospitalSearchResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "List the nearest 5 emergency hospitals with their ratings and contact info. Be brief.",
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lng
            }
          }
        }
      },
    });

    const links: GroundingLink[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.maps) {
          links.push({
            title: chunk.maps.title || 'View on Maps',
            uri: chunk.maps.uri
          });
        }
      });
    }

    return {
      text: response.text || "Searching for hospitals...",
      links: links
    };
  } catch (error) {
    console.error("Hospital search failed:", error);
    return {
      text: "Failed to fetch nearby hospitals. Please check your connection and try again.",
      links: []
    };
  }
};
