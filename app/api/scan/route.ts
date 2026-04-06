import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { image } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Extract attendance from this Chemistry register.
      1. Count the total number of class columns (marked by initials at the top/bottom).
      2. For each student row, extract: Roll Number (e.g. 061), Full Name, and total marks (x, 1, +).
      Return ONLY a JSON object:
      {
        "totalClasses": 14,
        "students": [
          { "rollNo": "061", "name": "DEVI JENA", "attended": 11 }
        ]
      }
    `;

    // Extract the base64 data from the URI
    const base64Data = image.split(",")[1];

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg",
        },
      },
    ]);

    // Clean potential markdown blocks
    const responseText = result.response.text();
    const cleanedJson = responseText.replace(/```json|```/g, "").trim();
    
    return NextResponse.json(JSON.parse(cleanedJson));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to process image" }, { status: 500 });
  }
}