import { NextRequest, NextResponse } from "next/server";
import { ai } from "@/src/lib/gemini";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { prompt, model } = await req.json();
    const response = await ai.models.generateContent({
      model: model || "gemini-3.5-flash",
      contents: prompt,
    });
    return NextResponse.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
