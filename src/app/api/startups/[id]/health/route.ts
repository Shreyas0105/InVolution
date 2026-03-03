import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Startup from '@/models/Startup';

function computeHealthReport(startup: any) {
    const s = startup;

    const runway = s.financialsMonthly?.runway ?? 0;
    const burn = s.burn ?? 0;
    const revenue = s.revenue ?? 0;
    const netMargin = s.financialsMonthly?.netMargin ?? 0;
    const churn = s.growthMetrics?.churnRate ?? 0;
    const mau = s.growthMetrics?.mau ?? 0;
    const growthRate = s.aiReady?.growthRate ?? 0;

    // Compute individual health pillars (0–100 each)
    const burnHealth = revenue > 0 ? Math.min(100, Math.max(0, 100 - (burn / revenue) * 100)) : 0;

    const runwayHealth =
        runway >= 24 ? 100 :
            runway >= 18 ? 85 :
                runway >= 12 ? 70 :
                    runway >= 6 ? 40 :
                        runway >= 3 ? 15 : 0;

    const revenueHealth =
        revenue >= 1000000 ? 100 :
            revenue >= 500000 ? 80 :
                revenue >= 100000 ? 60 :
                    revenue >= 50000 ? 40 : 20;

    const churnHealth =
        churn === 0 ? 70 :
            churn < 3 ? 95 :
                churn < 5 ? 80 :
                    churn < 10 ? 55 :
                        churn < 15 ? 30 : 10;

    const marginHealth =
        netMargin >= 20 ? 100 :
            netMargin >= 10 ? 85 :
                netMargin >= 0 ? 60 :
                    netMargin >= -10 ? 35 : 10;

    const growthHealth =
        growthRate >= 25 ? 100 :
            growthRate >= 15 ? 85 :
                growthRate >= 5 ? 65 :
                    growthRate >= 0 ? 45 : 20;

    const overallHealth = Math.round(
        burnHealth * 0.2 +
        runwayHealth * 0.25 +
        revenueHealth * 0.2 +
        churnHealth * 0.1 +
        marginHealth * 0.15 +
        growthHealth * 0.1
    );

    // Alerts
    const alerts: { level: 'critical' | 'warning' | 'info'; message: string }[] = [];
    if (runway < 6 && runway > 0) alerts.push({ level: 'critical', message: `Critical: Only ${runway} months of runway remaining.` });
    else if (runway < 12 && runway > 0) alerts.push({ level: 'warning', message: `Runway below 12 months (${runway} mo). Plan next fundraise.` });
    if (burn > revenue * 2 && revenue > 0) alerts.push({ level: 'critical', message: 'Burn rate is more than 2× monthly revenue.' });
    if (churn >= 10) alerts.push({ level: 'critical', message: `Churn rate is dangerously high (${churn}%).` });
    else if (churn >= 5) alerts.push({ level: 'warning', message: `Churn rate (${churn}%) needs attention.` });
    if (netMargin < -20) alerts.push({ level: 'warning', message: `Deep negative net margin (${netMargin}%).` });
    if (growthRate >= 20) alerts.push({ level: 'info', message: `Strong MoM growth at ${growthRate}%. 🚀` });
    if (mau > 10000) alerts.push({ level: 'info', message: `Scale signals: ${mau.toLocaleString()} monthly active users.` });

    // Revenue trend from aiReady
    const revTrend: number[] = s.aiReady?.last6MonthsRev ?? [];
    const expTrend: number[] = s.aiReady?.last6MonthsExp ?? [];

    const healthLabel =
        overallHealth >= 80 ? 'Excellent' :
            overallHealth >= 65 ? 'Good' :
                overallHealth >= 50 ? 'Fair' :
                    overallHealth >= 35 ? 'Poor' : 'Critical';

    const healthColor =
        overallHealth >= 80 ? 'emerald' :
            overallHealth >= 65 ? 'blue' :
                overallHealth >= 50 ? 'yellow' :
                    overallHealth >= 35 ? 'orange' : 'red';

    return {
        overallHealth,
        healthLabel,
        healthColor,
        pillars: [
            { id: 'burn', label: 'Burn Efficiency', score: Math.round(burnHealth), description: `₹${(burn / 1000).toFixed(0)}K monthly burn` },
            { id: 'runway', label: 'Runway Safety', score: Math.round(runwayHealth), description: `${runway === 999 ? '∞' : runway} months remaining` },
            { id: 'revenue', label: 'Revenue Scale', score: Math.round(revenueHealth), description: `₹${(revenue / 100000).toFixed(2)}L MRR` },
            { id: 'churn', label: 'Retention Health', score: Math.round(churnHealth), description: churn > 0 ? `${churn}% churn rate` : 'No churn data' },
            { id: 'margin', label: 'Profitability', score: Math.round(marginHealth), description: `${netMargin}% net margin` },
            { id: 'growth', label: 'Growth Velocity', score: Math.round(growthHealth), description: `${growthRate}% MoM growth` },
        ],
        alerts,
        revenueTrend: revTrend,
        expenseTrend: expTrend,
        generatedAt: new Date().toISOString(),
    };
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const startup = await Startup.findById(id).lean();
        if (!startup) return NextResponse.json({ success: false, error: 'Startup not found' }, { status: 404 });
        const report = computeHealthReport(startup);
        return NextResponse.json({ success: true, startup: { name: (startup as any).name, sector: (startup as any).sector }, report });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
