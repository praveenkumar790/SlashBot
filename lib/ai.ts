import { GoogleGenAI } from '@google/genai';

// Initialize the Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function summarizeReport(inputText: string): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    console.warn('Google Gemini API Key is missing. Skipping AI summarization.');
    return '';
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Please summarize the following user report in 1-2 short sentences. Keep it concise, actionable, and strip away any filler words:\n\n"${inputText}"`,
            },
          ],
        },
      ],
    });

    return response.text || '';
  } catch (error) {
    console.error('Failed to generate AI summary:', error);
    return '';
  }
}
