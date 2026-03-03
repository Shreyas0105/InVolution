import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import dbConnect from '@/lib/mongodb';
import Startup from '@/models/Startup';

export async function POST(req: Request) {
    try {
        const token = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET || "inVolution_mock_secret_key_12345" });
        if (!token || !token.email) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const body = await req.json();

        // Helper to extract YouTube video ID for embedded playing
        const extractYoutubeId = (url: string) => {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
            const match = url.match(regExp);
            return (match && match[2].length === 11) ? match[2] : null;
        };

        const targetRev = Number(body.mrr);
        const profitMargin = Number(body.netProfitMargin) / 100;
        const targetProfit = targetRev * profitMargin;

        // Generate a 12-month curve leading up to the target metrics
        const generatedMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const generatedRev = [];
        const generatedProfit = [];
        for (let i = 0; i < 12; i++) {
            // Simulate growth curve where month 11 (Dec) is the current target MRR
            const growthFactor = Math.pow(1.05, i - 11);
            generatedRev.push(targetRev * growthFactor);
            generatedProfit.push((targetRev * growthFactor) * profitMargin);
        }

        // Map the incoming form data to our deep Mongoose sub-documents
        const newStartupData = {
            name: body.name,
            ownerEmail: token.email,
            sector: body.sector,
            businessModel: body.businessModel,
            desc: body.description,
            requested: Number(body.fundingRequired),
            equity: Number(body.equityForSale),
            revenue: targetRev, // Baseline current MRR
            burn: targetRev - targetProfit, // Approximate burn based on margin
            risk: "Medium", // Default evaluation for now
            score: 80, // Default AI score for new applicants
            videos: body.videos.filter((v: string) => v.trim() !== "").map((url: string) => {
                const yId = extractYoutubeId(url);
                return {
                    title: "Pitch Video", // Generic title, can be expanded later
                    thumb: yId ? `https://img.youtube.com/vi/${yId}/hqdefault.jpg` : "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800",
                    url: yId ? `https://www.youtube.com/embed/${yId}` : url // Store the embed URL directly
                }
            }),
            financials: {
                months: generatedMonths,
                revenue: generatedRev,
                netProfit: generatedProfit,
                roi: Number(body.projectedROI) || 0,
                cac: Number(body.cac) || 0,
                ltv: Number(body.ltv) || 0
            }
        };

        const newStartup = await Startup.create(newStartupData);

        return NextResponse.json({ success: true, data: newStartup }, { status: 201 });
    } catch (error: any) {
        console.error("Failed to publish startup:", error);
        return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
