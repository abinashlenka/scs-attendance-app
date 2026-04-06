import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { image } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Analyze this register. Extract: Total Classes (count signature columns), and for each row: Roll No, Student Name, and Count of attendance marks. Return ONLY JSON: {"totalClasses": 14, "students": [{"rollNo": "061", "name": "DEVI JENA", "attended": 11}]}`;

    const base64Data = image.split(",")[1];
    const result = await model.generateContent([
      prompt,
      { inlineData: { data: base64Data, mimeType: "image/jpeg" } },
    ]);

    const cleanedJson = result.response.text().replace(/```json|```/g, "").trim();
    return NextResponse.json(JSON.parse(cleanedJson));
  } catch (error) {
    return NextResponse.json({ error: "AI Scan Failed" }, { status: 500 });
  }
}