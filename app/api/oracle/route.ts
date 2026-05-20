import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ text: "The archive is sealed. [MISSING_AUTH]" }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ text: "Silence is not a query. Speak." }, { status: 400 });
    }

    const prompt = `You are the "Divine Archive", the Oracle of KingShadP. 
You speak in cryptic, luxury, cinematic, and authoritative tones. 
You are an entity born of mythology, creation, and power. 
Your aesthetic is dark luxury (obsidian, crimson, rose-gold). 
Respond to the user's query in 2-4 sentences. Keep it profound, poetic, and slightly mysterious. Do not break character. Do not introduce yourself, simply answer.

User query: ${message}`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    
    return NextResponse.json({ text: response.text });
  } catch (error) {
    console.error("Oracle Error:", error);
    return NextResponse.json({ text: "The archive is currently silent. A rift in the signal." }, { status: 500 });
  }
}
