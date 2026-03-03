import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Startup from '@/models/Startup';

function computeComplianceReport(startup: any) {
    const s = startup;

    interface ComplianceItem {
        id: string;
        category: string;
        requirement: string;
        status: 'compliant' | 'non-compliant' | 'partial' | 'not-applicable';
        detail: string;
        priority: 'critical' | 'high' | 'medium' | 'low';
    }

    const items: ComplianceItem[] = [
        // Tax & Registration
        {
            id: 'gst',
            category: 'Tax Compliance',
            requirement: 'GST Registration',
            status: s.credibility?.gstRegistered ? 'compliant' : 'non-compliant',
            detail: s.credibility?.gstRegistered
                ? 'Business is GST registered and compliant.'
                : 'GST registration required for businesses with turnover > ₹40L.',
            priority: 'critical',
        },
        {
            id: 'pan',
            category: 'Tax Compliance',
            requirement: 'PAN Verification',
            status: s.credibility?.panVerified ? 'compliant' : 'non-compliant',
            detail: s.credibility?.panVerified
                ? 'Permanent Account Number verified.'
                : 'PAN must be verified for tax filing and investment compliance.',
            priority: 'critical',
        },
        {
            id: 'aadhaar',
            category: 'KYC Compliance',
            requirement: 'Aadhaar Verification',
            status: s.credibility?.aadhaarVerified ? 'compliant' : 'non-compliant',
            detail: s.credibility?.aadhaarVerified
                ? 'Founder Aadhaar verified via KYC process.'
                : 'Aadhaar verification required under PMLA and RBI KYC norms.',
            priority: 'high',
        },
        {
            id: 'bank',
            category: 'Financial Compliance',
            requirement: 'Bank Account Verification',
            status: s.credibility?.bankVerified ? 'compliant' : 'non-compliant',
            detail: s.credibility?.bankVerified
                ? 'Business bank account is verified.'
                : 'Verified business bank account required for investment disbursement.',
            priority: 'high',
        },
        // Legal Disclosures
        {
            id: 'legal_cases',
            category: 'Legal Disclosure',
            requirement: 'No Pending Litigation',
            status: s.riskDisclosure?.legalCases ? 'non-compliant' : 'compliant',
            detail: s.riskDisclosure?.legalCases
                ? 'Active legal cases disclosed. Investor must review before commitment.'
                : 'No pending legal disputes disclosed.',
            priority: 'critical',
        },
        {
            id: 'criminal',
            category: 'Legal Disclosure',
            requirement: 'No Criminal Record',
            status: s.riskDisclosure?.criminalRecord ? 'non-compliant' : 'compliant',
            detail: s.riskDisclosure?.criminalRecord
                ? 'Criminal record disclosed. Requires mandatory investor review under SEBI ICDR norms.'
                : 'No criminal record disclosed by founders.',
            priority: 'critical',
        },
        // Financial Transparency
        {
            id: 'bank_stmt',
            category: 'Financial Transparency',
            requirement: 'Bank Statement Submission',
            status: s.credibility?.bankStatementUrl ? 'compliant' : 'partial',
            detail: s.credibility?.bankStatementUrl
                ? 'Bank statement uploaded and on file.'
                : 'Bank statement not submitted. Required for investor due diligence.',
            priority: 'medium',
        },
        {
            id: 'ca_cert',
            category: 'Financial Transparency',
            requirement: 'CA Certified Financials',
            status: s.credibility?.caCertificateUrl ? 'compliant' : 'partial',
            detail: s.credibility?.caCertificateUrl
                ? 'CA certificate on file.'
                : 'CA-certified financials not uploaded. Strongly recommended for Series A+.',
            priority: 'medium',
        },
        // Business Registration
        {
            id: 'company_type',
            category: 'Corporate Governance',
            requirement: 'Entity Registration',
            status: s.basicInfo?.companyType && s.basicInfo.companyType !== '' ? 'compliant' : 'partial',
            detail: s.basicInfo?.companyType
                ? `Registered as ${s.basicInfo.companyType}.`
                : 'Company type not specified.',
            priority: 'medium',
        },
        // Disclosure Completeness
        {
            id: 'risk_disc',
            category: 'Risk Disclosure',
            requirement: 'Revenue Fluctuation Explanation',
            status: s.riskDisclosure?.revenueFluctuationExplanation ? 'compliant' : 'partial',
            detail: s.riskDisclosure?.revenueFluctuationExplanation
                ? 'Revenue fluctuation adequately explained.'
                : 'No explanation provided for revenue fluctuations.',
            priority: 'low',
        },
    ];

    const compliantCount = items.filter(i => i.status === 'compliant').length;
    const criticalIssues = items.filter(i => i.status === 'non-compliant' && i.priority === 'critical');
    const highIssues = items.filter(i => i.status === 'non-compliant' && i.priority === 'high');

    const complianceScore = Math.round((compliantCount / items.length) * 100);

    const complianceLabel =
        complianceScore >= 90 ? 'Fully Compliant' :
            complianceScore >= 70 ? 'Mostly Compliant' :
                complianceScore >= 50 ? 'Partial Compliance' : 'Non-Compliant';

    const complianceColor =
        complianceScore >= 90 ? 'emerald' :
            complianceScore >= 70 ? 'blue' :
                complianceScore >= 50 ? 'yellow' : 'red';

    const categories = [...new Set(items.map(i => i.category))];

    return {
        complianceScore,
        complianceLabel,
        complianceColor,
        compliantCount,
        totalItems: items.length,
        criticalIssuesCount: criticalIssues.length,
        highIssuesCount: highIssues.length,
        items,
        categories,
        investorNote: criticalIssues.length > 0
            ? `⚠️ ${criticalIssues.length} critical compliance issue(s) require resolution before investment can proceed.`
            : highIssues.length > 0
                ? `${highIssues.length} high-priority compliance item(s) should be resolved soon.`
                : 'Startup meets minimum compliance requirements for investment.',
        generatedAt: new Date().toISOString(),
    };
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const startup = await Startup.findById(id).lean();
        if (!startup) return NextResponse.json({ success: false, error: 'Startup not found' }, { status: 404 });
        const report = computeComplianceReport(startup);
        return NextResponse.json({ success: true, startup: { name: (startup as any).name, sector: (startup as any).sector }, report });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
