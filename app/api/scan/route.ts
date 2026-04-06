import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { image } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an SCS College Assistant. Analyze this attendance register image.
      1. Extract College Name, Subject, and Month.
      2. Identify the 'Total Classes' by counting valid signature columns.
      3. For each student, extract: Roll Number, Name, and total marks (count 'x', '1', or initials as 1).
      Return ONLY valid JSON:
      {
        "college": "S.C.S. (A) College",
        "totalClasses": 14,
        "students": [
          { "rollNo": "061", "name": "DEVI JENA", "attended": 11 }
        ]
      }
    `;

    const base64Data = image.split(",")[1];
    const result = await model.generateContent([
      prompt,
      { inlineData: { data: base64Data, mimeType: "image/jpeg" } },
    ]);

    const responseText = result.response.text();
    const cleanedJson = responseText.replace(/```json|```/g, "").trim();
    
    return NextResponse.json(JSON.parse(cleanedJson));
  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: "Scan failed" }, { status: 500 });
  }
}