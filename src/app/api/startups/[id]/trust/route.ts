import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Startup from '@/models/Startup';

function computeTrustScore(startup: any) {
    const s = startup;
    const factors: { label: string; earned: number; max: number; verified: boolean; detail: string }[] = [];

    // Identity Verification (30 pts)
    let identityScore = 0;
    if (s.credibility?.panVerified) { identityScore += 10; }
    if (s.credibility?.aadhaarVerified) { identityScore += 10; }
    if (s.credibility?.gstRegistered) { identityScore += 10; }
    factors.push({ label: 'Identity & Tax Verification', earned: identityScore, max: 30, verified: identityScore >= 20, detail: 'PAN, Aadhaar & GST Registered' });

    // Financial Transparency (25 pts)
    let finTransScore = 0;
    if (s.credibility?.bankVerified) finTransScore += 10;
    if (s.credibility?.bankStatementUrl) finTransScore += 5;
    if (s.credibility?.caCertificateUrl) finTransScore += 5;
    if (s.credibility?.gstSummaryUrl) finTransScore += 5;
    factors.push({ label: 'Financial Transparency', earned: finTransScore, max: 25, verified: finTransScore >= 15, detail: 'Bank verification & document submission' });

    // External Backing (20 pts)
    let backingScore = 0;
    if (s.credibility?.incubatorBacked) backingScore += 15;
    if (s.investmentDetails?.previousFunding) backingScore += 5;
    factors.push({ label: 'External Backing & Funding', earned: backingScore, max: 20, verified: backingScore >= 10, detail: 'Incubator, VC or angel backing' });

    // Risk Disclosure (15 pts)
    let disclosureScore = 15;
    if (s.riskDisclosure?.legalCases) disclosureScore -= 8;
    if (s.riskDisclosure?.criminalRecord) disclosureScore -= 10;
    if (s.riskDisclosure?.outstandingLoans) disclosureScore -= 4;
    disclosureScore = Math.max(0, disclosureScore);
    factors.push({ label: 'Risk Disclosure Integrity', earned: disclosureScore, max: 15, verified: disclosureScore >= 12, detail: 'Legal, criminal & loan disclosures' });

    // Profile Completeness (10 pts)
    let completeness = 0;
    if (s.basicInfo?.founderNames) completeness += 2;
    if (s.basicInfo?.location) completeness += 1;
    if (s.businessInfo?.uvp) completeness += 2;
    if (s.businessInfo?.competitors) completeness += 1;
    if (s.financialsMonthly?.netProfit !== undefined) completeness += 2;
    if (s.growthMetrics?.mau > 0) completeness += 2;
    factors.push({ label: 'Profile Completeness', earned: Math.min(completeness, 10), max: 10, verified: completeness >= 8, detail: 'Business info, financials and team data filled' });

    const totalTrust = Math.min(100, factors.reduce((acc, f) => acc + f.earned, 0));

    const trustLabel =
        totalTrust >= 80 ? 'Highly Trusted' :
            totalTrust >= 65 ? 'Trusted' :
                totalTrust >= 50 ? 'Partially Verified' :
                    totalTrust >= 35 ? 'Limited Trust' : 'Unverified';

    const trustColor =
        totalTrust >= 80 ? 'emerald' :
            totalTrust >= 65 ? 'blue' :
                totalTrust >= 50 ? 'yellow' :
                    totalTrust >= 35 ? 'orange' : 'red';

    const tier =
        totalTrust >= 80 ? 'Platinum' :
            totalTrust >= 65 ? 'Gold' :
                totalTrust >= 50 ? 'Silver' : 'Bronze';

    return {
        totalTrust,
        trustLabel,
        trustColor,
        tier,
        factors,
        verifiedCount: factors.filter(f => f.verified).length,
        totalFactors: factors.length,
        generatedAt: new Date().toISOString(),
    };
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const startup = await Startup.findById(id).lean();
        if (!startup) return NextResponse.json({ success: false, error: 'Startup not found' }, { status: 404 });
        const report = computeTrustScore(startup);
        return NextResponse.json({ success: true, startup: { name: (startup as any).name, sector: (startup as any).sector }, report });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
