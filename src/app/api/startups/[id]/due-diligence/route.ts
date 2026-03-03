import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Startup from '@/models/Startup';

function computeDueDiligenceReport(startup: any) {
    const s = startup;

    // ── Financial Health (30 pts) ──────────────────────────────────────────────
    let financialScore = 0;
    const financialFlags: string[] = [];
    const financialStrengths: string[] = [];

    const runway = s.financialsMonthly?.runway ?? 0;
    const netMargin = s.financialsMonthly?.netMargin ?? 0;
    const grossMargin = s.financialsMonthly?.grossMargin ?? 0;
    const burn = s.burn ?? 0;
    const revenue = s.revenue ?? 0;

    if (revenue > 0) { financialScore += 5; financialStrengths.push('Revenue generating'); }
    if (runway >= 12) { financialScore += 8; financialStrengths.push(`Strong runway (${runway} months)`); }
    else if (runway >= 6) { financialScore += 4; financialFlags.push(`Moderate runway (${runway} months)`); }
    else { financialFlags.push('Critical: runway < 6 months'); }

    if (netMargin >= 10) { financialScore += 7; financialStrengths.push(`Positive net margin (${netMargin}%)`); }
    else if (netMargin >= 0) { financialScore += 3; }
    else { financialFlags.push(`Negative net margin (${netMargin}%)`); }

    if (grossMargin >= 40) { financialScore += 5; financialStrengths.push(`Healthy gross margins (${grossMargin}%)`); }
    else if (grossMargin > 0) { financialScore += 2; }

    const burnRevRatio = revenue > 0 ? burn / revenue : 999;
    if (burnRevRatio < 0.5) { financialScore += 5; financialStrengths.push('Efficient burn-to-revenue ratio'); }
    else if (burnRevRatio > 2) { financialFlags.push('High burn relative to revenue'); }

    // ── Growth Metrics (20 pts) ──────────────────────────────────────────────
    let growthScore = 0;
    const growthFlags: string[] = [];
    const growthStrengths: string[] = [];

    const mau = s.growthMetrics?.mau ?? 0;
    const churn = s.growthMetrics?.churnRate ?? 99;
    const conversion = s.growthMetrics?.conversionRate ?? 0;
    const growthRate = s.aiReady?.growthRate ?? 0;

    if (mau >= 10000) { growthScore += 6; growthStrengths.push(`Large active user base (${mau.toLocaleString()} MAU)`); }
    else if (mau >= 1000) { growthScore += 3; }
    else if (mau > 0) { growthScore += 1; }

    if (churn < 5) { growthScore += 5; growthStrengths.push(`Low churn rate (${churn}%)`); }
    else if (churn < 10) { growthScore += 2; }
    else if (churn < 99) { growthFlags.push(`High churn rate (${churn}%)`); }

    if (conversion >= 3) { growthScore += 4; growthStrengths.push(`Strong conversion rate (${conversion}%)`); }
    else if (conversion > 0) { growthScore += 1; }

    if (growthRate >= 20) { growthScore += 5; growthStrengths.push(`High MoM growth (${growthRate}%)`); }
    else if (growthRate > 0) { growthScore += 2; }

    // ── Team & Credibility (25 pts) ──────────────────────────────────────────────
    let credibilityScore = 0;
    const credFlags: string[] = [];
    const credStrengths: string[] = [];

    if (s.credibility?.gstRegistered) { credibilityScore += 5; credStrengths.push('GST Registered'); }
    else { credFlags.push('Not GST registered'); }
    if (s.credibility?.panVerified) { credibilityScore += 5; credStrengths.push('PAN Verified'); }
    if (s.credibility?.bankVerified) { credibilityScore += 5; credStrengths.push('Bank Account Verified'); }
    else { credFlags.push('Bank not verified'); }
    if (s.credibility?.aadhaarVerified) { credibilityScore += 4; credStrengths.push('Aadhaar Verified'); }
    if (s.credibility?.incubatorBacked) { credibilityScore += 6; credStrengths.push('Incubator / VC Backed'); }

    const teamSize = s.basicInfo?.teamSize ?? 0;
    if (teamSize >= 5) { credibilityScore += 4; credStrengths.push(`Established team (${teamSize} members)`); }
    else if (teamSize > 0) { credibilityScore += 1; }

    // Clamp to 25
    credibilityScore = Math.min(credibilityScore, 25);

    // ── Risk & Legal (25 pts) ──────────────────────────────────────────────
    let riskScore = 25; // start full, deduct for flags
    const riskFlags: string[] = [];
    const riskStrengths: string[] = [];

    if (s.riskDisclosure?.legalCases) { riskScore -= 8; riskFlags.push('Pending legal cases disclosed'); }
    else { riskStrengths.push('No pending legal cases'); }
    if (s.riskDisclosure?.criminalRecord) { riskScore -= 10; riskFlags.push('Criminal record disclosed'); }
    if (s.riskDisclosure?.outstandingLoans) { riskScore -= 5; riskFlags.push('Outstanding loans on record'); }
    else { riskStrengths.push('No outstanding debt risk'); }

    riskScore = Math.max(0, riskScore);

    const totalScore = Math.min(100, financialScore + growthScore + credibilityScore + riskScore);

    const verdict =
        totalScore >= 80 ? { label: 'Strong Buy', color: 'emerald' } :
            totalScore >= 65 ? { label: 'Accumulate', color: 'blue' } :
                totalScore >= 50 ? { label: 'Hold / Monitor', color: 'yellow' } :
                    { label: 'High Risk', color: 'red' };

    return {
        totalScore,
        verdict,
        sections: [
            {
                id: 'financial',
                label: 'Financial Health',
                score: financialScore,
                maxScore: 30,
                strengths: financialStrengths,
                flags: financialFlags,
            },
            {
                id: 'growth',
                label: 'Growth Metrics',
                score: growthScore,
                maxScore: 20,
                strengths: growthStrengths,
                flags: growthFlags,
            },
            {
                id: 'credibility',
                label: 'Team & Credibility',
                score: credibilityScore,
                maxScore: 25,
                strengths: credStrengths,
                flags: credFlags,
            },
            {
                id: 'risk',
                label: 'Risk & Legal',
                score: riskScore,
                maxScore: 25,
                strengths: riskStrengths,
                flags: riskFlags,
            },
        ],
        keyMetrics: {
            revenue: s.revenue ?? 0,
            burn: s.burn ?? 0,
            runway: runway,
            netMargin: netMargin,
            grossMargin: grossMargin,
            mau: mau,
            churnRate: churn < 99 ? churn : null,
            growthRate: growthRate,
            teamSize: teamSize,
            equity: s.equity,
            valuation: s.equity > 0 ? s.requested / (s.equity / 100) : 0,
        },
        generatedAt: new Date().toISOString(),
    };
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const startup = await Startup.findById(id).lean();
        if (!startup) return NextResponse.json({ success: false, error: 'Startup not found' }, { status: 404 });
        const report = computeDueDiligenceReport(startup);
        return NextResponse.json({ success: true, startup: { name: (startup as any).name, sector: (startup as any).sector, stage: (startup as any).stage }, report });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
