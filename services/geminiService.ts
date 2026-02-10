
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const summarizeProposal = async (title: string, description: string): Promise<string> => {
  if (!process.env.API_KEY) return description.substring(0, 100) + '...';
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Resume de forma muy breve (una frase) esta propuesta ciudadana para Badajoz Respira:\n\nTítulo: ${title}\nDescripción: ${description}`,
      config: {
        maxOutputTokens: 100,
        temperature: 0.7,
      }
    });
    return response.text || description.substring(0, 100);
  } catch (error) {
    console.error("Gemini summarizing error:", error);
    return description.substring(0, 100);
  }
};

export const checkHealthyEnvironment = async (query: string): Promise<string> => {
  if (!process.env.API_KEY) return "El asistente no está disponible actualmente.";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Eres un asistente experto en salud urbana del proyecto "Badajoz Respira". Responde a esta duda de un ciudadano de forma amable y técnica:\n\n${query}`,
      config: {
        maxOutputTokens: 300,
      }
    });
    return response.text || "No pude procesar tu consulta.";
  } catch (error) {
    console.error("Gemini assistant error:", error);
    return "Lo siento, hubo un error al conectar con el asistente.";
  }
};
