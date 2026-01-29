
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { Message, Step } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async chat(messages: Message[], currentStep: Step): Promise<string> {
    const formattedHistory = messages.slice(0, -1).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const currentMessage = messages[messages.length - 1].text;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [...formattedHistory, { role: 'user', parts: [{ text: currentMessage }] }],
        config: {
          systemInstruction: `${SYSTEM_INSTRUCTION}\n\nCURRENT ACTIVE STEP: ${currentStep}`,
          temperature: 0.7,
        },
      });

      return response.text || "I'm having trouble processing that. Let's try to focus back on the first principles.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "I encountered a constraint (error). Let's recalibrate.";
    }
  }

  async summarizeState(messages: Message[]): Promise<any> {
    // Helper to extract facts/assumptions/requirements if needed
    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        { role: 'user', parts: [{ text: `Based on this conversation, extract the following as a JSON object: 
          { "problem": string, "facts": string[], "assumptions": string[], "requirements": string[] }
          
          Conversation:
          ${messages.map(m => `${m.role}: ${m.text}`).join('\n')}` }]
      ],
      config: {
        responseMimeType: "application/json"
      }
    });
    
    try {
      return JSON.parse(response.text);
    } catch {
      return null;
    }
  }
}

export const geminiService = new GeminiService();
