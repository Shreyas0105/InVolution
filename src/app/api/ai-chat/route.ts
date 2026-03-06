import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import dbConnect from "@/lib/mongodb";
import Startup from "@/models/Startup";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
    try {
        await dbConnect();

        const { startupId, question, history } = await req.json();

        if (!startupId || !question) {
            return NextResponse.json({ success: false, error: 'startupId and question are required' }, { status: 400 });
        }

        const startup = await Startup.findById(startupId);

        if (!startup) {
            return NextResponse.json({ success: false, error: 'Startup not found' }, { status: 404 });
        }

        const prompt = `
            You are the "InVolution AI Analyst", an expert investment analyst AI assistant for an investor platform.
            
            Here is the core data and your previous analysis of a startup:
            ---
            Startup Name: ${startup.name}
            Sector: ${startup.sector}
            Stage: ${startup.stage}
            Requested Funding: $${startup.requested}
            Equity Offered: ${startup.equity}%
            Current Monthly Revenue: $${startup.revenue}
            Current Monthly Burn: $${startup.burn}
            
            Previous AI Analysis:
            ${startup.analysis || "No preliminary analysis was available."}
            ---

            An investor is asking you a question about this startup.
            Answer clearly, professionally, and accurately based ONLY on the provided startup information. If the information is not available, state that you do not have sufficient data.
            
            Investor Question:
            ${question}
        `;

        // If history is provided, we could use a chat session, but for simplicity and statelessness
        // we can just append the recent context or rely strictly on the prompt.
        // To keep it simple, we pass it as a single content request right now.

        let contents: any[] = [];

        // Map history to gemini format if needed, but simple prompt is usually enough for a one-off Q&A.
        // We will just use the direct prompt for the immediate question to keep things focused.
        contents.push({ role: 'user', parts: [{ text: prompt }] });

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt, // Keep it simple and prompt-based for now.
            config: {
                temperature: 0.3, // Analytical mode
            }
        });

        return NextResponse.json({
            success: true,
            answer: response.text
        });
    } catch (error: any) {
        console.error("AI Chat Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
