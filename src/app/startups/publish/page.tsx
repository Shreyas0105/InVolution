"use client";

import { useState, useEffect } from "react";
import { Briefcase, TrendingUp, Presentation, AlertCircle, Save, Bot, Loader2, Building2, BarChart3, Settings2, ShieldCheck, ShieldAlert, LineChart } from "lucide-react";

export default function PublishStartupPage() {
    const [formData, setFormData] = useState({
        name: "",
        sector: "FinTech",
        businessModel: "B2B SaaS",
        description: "",
        equityForSale: "",
        fundingRequired: "",
        mrr: "",
        netProfitMargin: "",
        cac: "",
        ltv: "",
        projectedROI: "",
        videos: [""],

        // 1. Basic Company Information
        basicInfo: { founderNames: "", incorporationYear: new Date().getFullYear(), companyType: "Private Ltd", location: "", teamSize: 1 },
        // 2. Business Model Details
        businessInfo: { revenueModel: "Subscription", targetMarket: "", uvp: "", competitors: "" },
        // 3. Financial Parameters
        financialsMonthly: { revenue: "", expenses: "", cogs: "", netProfit: 0, grossMargin: 0, netMargin: 0, burnRate: 0, runway: 0 },
        financialsYearly: { annualRevenue: "", annualExpenses: "", ebitda: "", assets: "", liabilities: "", cashInBank: "", debt: "" },
        investmentDetails: { previousFunding: false, previousInvestors: "" },
        // 4. Growth Metrics
        growthMetrics: { mau: "", churnRate: "", conversionRate: "", ordersPerMonth: "", repeatCustomers: "", appDownloads: "" },
        // 5. Operational Metrics
        operationalMetrics: { skus: "", productionCapacity: "", inventoryStatus: "", supplyChain: "", deliveryTime: "", vendorCount: "" },
        // 6. Credibility & Trust Inputs
        credibility: { gstRegistered: false, panVerified: false, aadhaarVerified: false, bankVerified: false, incubatorBacked: false, gstSummaryUrl: "", bankStatementUrl: "", caCertificateUrl: "" },
        // 7. Risk Disclosure Section
        riskDisclosure: { legalCases: false, outstandingLoans: false, criminalRecord: false, revenueFluctuationExplanation: "" },

        // Optional AI Ready Fields (Internal)
        aiReady: { last6MonthsRev: [0, 0, 0, 0, 0, 0], last6MonthsExp: [0, 0, 0, 0, 0, 0], growthRate: 0 }
    });

    const addVideoField = () => {
        setFormData({ ...formData, videos: [...formData.videos, ""] });
    };

    const updateVideoField = (index: number, value: string) => {
        const newVideos = [...formData.videos];
        newVideos[index] = value;
        setFormData({ ...formData, videos: newVideos });
    };

    // Auto-calculations effect (Very Important Feature)
    useEffect(() => {
        const rev = Number(formData.financialsMonthly.revenue) || 0;
        const exp = Number(formData.financialsMonthly.expenses) || 0;
        const cogs = Number(formData.financialsMonthly.cogs) || 0;
        const cash = Number(formData.financialsYearly.cashInBank) || 0;

        const netProfit = rev - exp;
        const grossMargin = rev > 0 ? ((rev - cogs) / rev) * 100 : 0;
        const netMargin = rev > 0 ? (netProfit / rev) * 100 : 0;
        const burnRate = Math.max(0, exp - rev);
        const runway = burnRate > 0 ? (cash / burnRate) : (cash > 0 ? 999 : 0);

        setFormData(prev => ({
            ...prev,
            financialsMonthly: {
                ...prev.financialsMonthly,
                netProfit,
                grossMargin: Number(grossMargin.toFixed(2)),
                netMargin: Number(netMargin.toFixed(2)),
                burnRate,
                runway: Number(runway.toFixed(1))
            }
        }));
    }, [formData.financialsMonthly.revenue, formData.financialsMonthly.expenses, formData.financialsMonthly.cogs, formData.financialsYearly.cashInBank]);

    const handleNestedChange = (section: string, field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                // @ts-ignore
                ...prev[section],
                [field]: value
            }
        }));
    };

    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isAuditing, setIsAuditing] = useState(false);
    const [auditResult, setAuditResult] = useState<{ errors: string[], warnings: string[] } | null>(null);

    const runAIAudit = () => {
        const errors: string[] = [];
        const warnings: string[] = [];

        const rev = Number(formData.financialsMonthly.revenue);
        const margin = formData.financialsMonthly.netMargin;
        const fundingAsk = Number(formData.fundingRequired);
        const cac = Number(formData.cac);
        const ltv = Number(formData.ltv);
        const runway = formData.financialsMonthly.runway;

        if (margin > 80 || margin < -200) {
            errors.push(`Unrealistic Net Margin (${margin}%). Verify your revenue and expenses.`);
        }

        if (cac > 0 && ltv > 0 && cac >= ltv) {
            errors.push(`Unit Economics inversion detected. Customer Acquisition Cost (₹${cac}) cannot exceed Lifetime Value (₹${ltv}).`);
        }

        if (rev < 1000 && fundingAsk > 10000000) {
            warnings.push("High Valuation Risk: Asking for >₹1Cr funding on less than ₹1k MRR may trigger auto-rejection by the AI Matchmaking system.");
        }

        if (runway > 0 && runway < 3 && fundingAsk === 0) {
            warnings.push("Low Runway Warning: You have less than 3 months runway, consider requesting funding immediately.");
        }

        const ytRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const vimeoRegExp = /(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:[a-zA-Z0-9_\-]+)?/i;

        formData.videos.forEach((vid, idx) => {
            if (vid.trim() !== "") {
                const isYt = vid.match(ytRegExp) && vid.match(ytRegExp)![2].length === 11;
                const isVimeo = vid.match(vimeoRegExp);
                if (!isYt && !isVimeo) {
                    errors.push(`Video link #${idx + 1} is not a valid embeddable public YouTube or Vimeo URL.`);
                }
            }
        });

        return { errors, warnings };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setAuditResult(null);
        setIsAuditing(true);

        await new Promise(r => setTimeout(r, 1500));
        const audit = runAIAudit();
        setIsAuditing(false);

        if (audit.errors.length > 0) {
            setAuditResult(audit);
            return;
        }

        if (audit.warnings.length > 0 && !auditResult?.warnings) {
            setAuditResult(audit);
            return;
        }

        setSaving(true);
        try {
            const res = await fetch('/api/startups/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    // Compatibility overrides map complex auto-calc fields to the original required base fields safely
                    mrr: formData.financialsMonthly.revenue || formData.mrr || 0,
                    netProfitMargin: formData.financialsMonthly.netMargin || formData.netProfitMargin || 0
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to publish startup');
            }
            setSuccess(true);
        } catch (err: any) {
            console.error("Publish error:", err);
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="container mx-auto px-6 py-12 max-w-5xl min-h-screen">
            <div className="mb-10 animate-fade-in-up">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-semibold mb-6 border border-indigo-500/20">
                    <ShieldCheck className="w-4 h-4" /> Professional Startup Data Standard
                </div>
                <h1 className="text-4xl font-outfit font-bold text-white mb-2">Publish Your Startup</h1>
                <p className="text-slate-400 font-inter">Complete the 7-section verification standard. Our AI relies on accurate financial disclosures to match you with top-tier partners.</p>
            </div>

            <div className="glass-panel rounded-3xl p-8 lg:p-10 relative overflow-hidden">
                {success ? (
                    <div className="py-20 text-center animate-in zoom-in duration-500">
                        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-8 mx-auto">
                            <Save className="w-12 h-12 text-green-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-white font-outfit mb-4">Profile Verified & Published!</h2>
                        <p className="text-slate-400 max-w-md mx-auto text-lg">Your startup is now live in the investor search engine. We will notify you when an AI match occurs.</p>
                        <button onClick={() => setSuccess(false)} className="mt-10 px-10 py-4 bg-white text-slate-950 font-bold rounded-full hover:bg-slate-200 transition-colors shadow-xl shadow-white/10">
                            Back to Dashboard
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-12 relative z-10 text-slate-200">

                        {/* Audit Modal */}
                        {auditResult && (
                            <div className="bg-[#18191d] border-2 border-indigo-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-top-4">
                                <div className="absolute top-0 right-0 p-4 opacity-5">
                                    <Bot className="w-32 h-32" />
                                </div>
                                <h3 className="text-xl font-bold flex items-center gap-2 mb-4 text-indigo-400">
                                    <Bot className="w-5 h-5" /> InVolution AI Audit Results
                                </h3>

                                {auditResult.errors.length > 0 && (
                                    <div className="mb-4">
                                        <p className="text-red-400 font-bold mb-2 flex items-center gap-1"><AlertCircle className="w-4 h-4" /> Critical Flags (Must resolve before publish):</p>
                                        <ul className="list-disc pl-5 space-y-2 text-sm text-slate-300">
                                            {auditResult.errors.map((err, i) => <li key={i}>{err}</li>)}
                                        </ul>
                                    </div>
                                )}

                                {auditResult.warnings.length > 0 && (
                                    <div>
                                        <p className="text-amber-400 font-bold mb-2 flex items-center gap-1"><AlertCircle className="w-4 h-4" /> Optimization Warnings:</p>
                                        <ul className="list-disc pl-5 space-y-2 text-sm text-slate-300">
                                            {auditResult.warnings.map((warn, i) => <li key={i}>{warn}</li>)}
                                        </ul>
                                        {auditResult.errors.length === 0 && (
                                            <p className="text-sm font-medium text-slate-400 mt-6 pt-4 border-t border-slate-700/50">Click "Publish" again to acknowledge these warnings and bypass the AI lock.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {error && !auditResult && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                <p className="text-red-300 text-sm">{error}</p>
                            </div>
                        )}

                        {/* SECTION 1: BASIC COMPANY INFORMATION */}
                        <div className="space-y-6 bg-slate-900/40 p-6 sm:p-8 rounded-2xl border border-white/5">
                            <h3 className="text-xl font-bold flex items-center gap-3 text-white border-b border-white/10 pb-4">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 text-sm">1</span>
                                Basic Company Information
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2 col-span-2">
                                    <label className="text-sm font-medium text-slate-300">Startup Name</label>
                                    <input type="text" required className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500" placeholder="e.g. InVolution Core" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Founder Name(s)</label>
                                    <input type="text" required className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500" placeholder="Jane Doe, John Smith" value={formData.basicInfo.founderNames} onChange={(e) => handleNestedChange('basicInfo', 'founderNames', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Sector / Industry</label>
                                    <select className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500" value={formData.sector} onChange={(e) => setFormData({ ...formData, sector: e.target.value })}>
                                        <option value="FinTech">FinTech</option>
                                        <option value="HealthTech">HealthTech</option>
                                        <option value="EdTech">EdTech</option>
                                        <option value="SaaS">SaaS</option>
                                        <option value="Cleantech">CleanTech</option>
                                        <option value="DeepTech">DeepTech</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Company Type</label>
                                    <select className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500" value={formData.basicInfo.companyType} onChange={(e) => handleNestedChange('basicInfo', 'companyType', e.target.value)}>
                                        <option value="Private Ltd">Private Ltd</option>
                                        <option value="LLP">LLP</option>
                                        <option value="Sole Proprietorship">Sole Proprietorship</option>
                                        <option value="Inc">Inc / Corp</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Year of Incorporation</label>
                                    <input type="number" required className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500" value={formData.basicInfo.incorporationYear} onChange={(e) => handleNestedChange('basicInfo', 'incorporationYear', Number(e.target.value))} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Registered Location</label>
                                    <input type="text" className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500" placeholder="Bangalore, India" value={formData.basicInfo.location} onChange={(e) => handleNestedChange('basicInfo', 'location', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Team Size</label>
                                    <input type="number" className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500" value={formData.basicInfo.teamSize} onChange={(e) => handleNestedChange('basicInfo', 'teamSize', Number(e.target.value))} />
                                </div>
                            </div>
                        </div>

                        {/* SECTION 2: BUSINESS MODEL DETAILS */}
                        <div className="space-y-6 bg-slate-900/40 p-6 sm:p-8 rounded-2xl border border-white/5">
                            <h3 className="text-xl font-bold flex items-center gap-3 text-white border-b border-white/10 pb-4">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 text-sm">2</span>
                                Business Model Details
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Business Model Type</label>
                                    <select className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500" value={formData.businessModel} onChange={(e) => setFormData({ ...formData, businessModel: e.target.value })}>
                                        <option value="B2B">B2B</option>
                                        <option value="B2C">B2C</option>
                                        <option value="D2C">D2C</option>
                                        <option value="SaaS">SaaS</option>
                                        <option value="Marketplace">Marketplace</option>
                                        <option value="Subscription">Subscription</option>
                                        <option value="Commission-based">Commission-based</option>
                                        <option value="Hybrid">Hybrid</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Revenue Model</label>
                                    <select className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500" value={formData.businessInfo.revenueModel} onChange={(e) => handleNestedChange('businessInfo', 'revenueModel', e.target.value)}>
                                        <option value="One-time sales">One-time sales</option>
                                        <option value="Subscription">Subscription</option>
                                        <option value="Licensing">Licensing</option>
                                        <option value="Ads">Ads</option>
                                        <option value="Commission">Commission</option>
                                        <option value="Freemium">Freemium</option>
                                    </select>
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <label className="text-sm font-medium text-slate-300">Target Market</label>
                                    <input type="text" className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Mid-market healthcare providers in APAC" value={formData.businessInfo.targetMarket} onChange={(e) => handleNestedChange('businessInfo', 'targetMarket', e.target.value)} />
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <label className="text-sm font-medium text-slate-300">Unique Value Proposition (UVP)</label>
                                    <textarea rows={2} className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500" placeholder="What sets you completely apart..." value={formData.businessInfo.uvp} onChange={(e) => handleNestedChange('businessInfo', 'uvp', e.target.value)} />
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <label className="text-sm font-medium text-slate-300">Pitch Description (System Overview)</label>
                                    <textarea rows={3} required className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500" placeholder="Provide a high-level summary of operations..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        {/* SECTION 3: FINANCIAL PARAMETERS */}
                        <div className="space-y-6 bg-slate-900/40 p-6 sm:p-8 rounded-2xl border border-amber-500/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[100px] rounded-full pointer-events-none"></div>

                            <h3 className="text-xl font-bold flex items-center justify-between text-amber-400 border-b border-white/10 pb-4">
                                <span className="flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 text-sm">3</span>
                                    Financial Parameters (AI Monitored)
                                </span>
                            </h3>

                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Monthly Financial Entry (₹)</h4>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-slate-300">Total Revenue / MRR</label>
                                        <input type="number" required className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500 font-mono text-amber-100" placeholder="0" value={formData.financialsMonthly.revenue} onChange={(e) => handleNestedChange('financialsMonthly', 'revenue', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-slate-300">COGS (Cost of Goods)</label>
                                        <input type="number" required className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500 font-mono" placeholder="0" value={formData.financialsMonthly.cogs} onChange={(e) => handleNestedChange('financialsMonthly', 'cogs', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-slate-300">Total Expenses (Excl. COGS)</label>
                                        <input type="number" required className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500 font-mono" placeholder="0" value={formData.financialsMonthly.expenses} onChange={(e) => handleNestedChange('financialsMonthly', 'expenses', e.target.value)} />
                                    </div>
                                </div>

                                {/* Auto Calculated Display Bar */}
                                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl grid grid-cols-2 md:grid-cols-5 gap-4">
                                    <div>
                                        <p className="text-[10px] text-amber-200/60 uppercase font-bold tracking-wider mb-1">Net Profit</p>
                                        <p className={`font-mono text-sm font-bold ${formData.financialsMonthly.netProfit >= 0 ? "text-green-400" : "text-red-400"}`}>₹{formData.financialsMonthly.netProfit.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-amber-200/60 uppercase font-bold tracking-wider mb-1">Gross Margin</p>
                                        <p className="font-mono text-sm font-bold text-white">{formData.financialsMonthly.grossMargin}%</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-amber-200/60 uppercase font-bold tracking-wider mb-1">Net Margin</p>
                                        <p className={`font-mono text-sm font-bold ${formData.financialsMonthly.netMargin >= 0 ? "text-green-400" : "text-red-400"}`}>{formData.financialsMonthly.netMargin}%</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-amber-200/60 uppercase font-bold tracking-wider mb-1">Monthly Burn</p>
                                        <p className="font-mono text-sm font-bold text-white">₹{formData.financialsMonthly.burnRate.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-amber-200/60 uppercase font-bold tracking-wider mb-1">Runway</p>
                                        <p className="font-mono text-sm font-bold text-white">{formData.financialsMonthly.runway === 999 ? "∞" : formData.financialsMonthly.runway} mo.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-6 mt-6 border-t border-slate-800">
                                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Yearly Posture & Runway</h4>
                                <div className="grid md:grid-cols-4 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-slate-300">Annual Revenue</label>
                                        <input type="number" className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500 font-mono" value={formData.financialsYearly.annualRevenue} onChange={(e) => handleNestedChange('financialsYearly', 'annualRevenue', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-slate-300">EBITDA</label>
                                        <input type="number" className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500 font-mono" value={formData.financialsYearly.ebitda} onChange={(e) => handleNestedChange('financialsYearly', 'ebitda', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-slate-300">Cash in Bank</label>
                                        <input type="number" className="w-full bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500 font-mono text-emerald-300" placeholder="Feeds runway calc" value={formData.financialsYearly.cashInBank} onChange={(e) => handleNestedChange('financialsYearly', 'cashInBank', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-slate-300">Total Debt</label>
                                        <input type="number" className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500 font-mono" value={formData.financialsYearly.debt} onChange={(e) => handleNestedChange('financialsYearly', 'debt', e.target.value)} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-6 mt-6 border-t border-slate-800">
                                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Deal Fundamentals</h4>
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-slate-300">Funding Required (₹)</label>
                                        <input type="number" required className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 font-mono text-xl text-amber-400" placeholder="10000000" value={formData.fundingRequired} onChange={(e) => setFormData({ ...formData, fundingRequired: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-slate-300">Equity Offered (%)</label>
                                        <input type="number" required className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 font-mono text-xl" placeholder="10" value={formData.equityForSale} onChange={(e) => setFormData({ ...formData, equityForSale: e.target.value })} />
                                    </div>
                                    <div className="p-3 bg-black/50 border border-amber-500/20 rounded-xl flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-slate-400">Implied Valuation</p>
                                            <p className="text-xl font-bold font-mono text-white">
                                                {Number(formData.equityForSale) > 0 && Number(formData.fundingRequired) > 0
                                                    ? `₹${(Number(formData.fundingRequired) / (Number(formData.equityForSale) / 100)).toLocaleString()}`
                                                    : "₹0"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SECTION 4: GROWTH METRICS */}
                        <div className="space-y-6 bg-slate-900/40 p-6 sm:p-8 rounded-2xl border border-white/5">
                            <h3 className="text-xl font-bold flex items-center gap-3 text-white border-b border-white/10 pb-4">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-500/20 text-pink-400 text-sm">4</span>
                                Growth Metrics
                            </h3>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">MAU (Monthly Active Users)</label>
                                    <input type="number" className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-pink-500" value={formData.growthMetrics.mau} onChange={(e) => handleNestedChange('growthMetrics', 'mau', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">CAC (₹)</label>
                                    <input type="number" className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-pink-500" value={formData.cac} onChange={(e) => setFormData({ ...formData, cac: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">LTV (₹)</label>
                                    <input type="number" className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-pink-500" value={formData.ltv} onChange={(e) => setFormData({ ...formData, ltv: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Churn Rate (%)</label>
                                    <input type="number" className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-pink-500" value={formData.growthMetrics.churnRate} onChange={(e) => handleNestedChange('growthMetrics', 'churnRate', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Repeat Customers (%)</label>
                                    <input type="number" className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-pink-500" value={formData.growthMetrics.repeatCustomers} onChange={(e) => handleNestedChange('growthMetrics', 'repeatCustomers', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Projected ROI (%)</label>
                                    <input type="number" className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-pink-500" value={formData.projectedROI} onChange={(e) => setFormData({ ...formData, projectedROI: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        {/* SECTION 5: OPERATIONAL METRICS */}
                        <div className="space-y-6 bg-slate-900/40 p-6 sm:p-8 rounded-2xl border border-white/5">
                            <h3 className="text-xl font-bold flex items-center gap-3 text-white border-b border-white/10 pb-4">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-500/20 text-teal-400 text-sm">5</span>
                                Operational Metrics
                            </h3>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Number of SKUs (if applicable)</label>
                                    <input type="number" className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-teal-500" value={formData.operationalMetrics.skus} onChange={(e) => handleNestedChange('operationalMetrics', 'skus', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Avg Delivery / Fulfillment Time</label>
                                    <input type="text" className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-teal-500" placeholder="e.g. 2 Days" value={formData.operationalMetrics.deliveryTime} onChange={(e) => handleNestedChange('operationalMetrics', 'deliveryTime', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Supply Chain Partners (Count)</label>
                                    <input type="text" className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-teal-500" value={formData.operationalMetrics.supplyChain} onChange={(e) => handleNestedChange('operationalMetrics', 'supplyChain', e.target.value)} />
                                </div>
                            </div>
                        </div>

                        {/* SECTION 6: CREDIBILITY & TRUST */}
                        <div className="space-y-6 bg-blue-950/20 p-6 sm:p-8 rounded-2xl border border-blue-500/20">
                            <h3 className="text-xl font-bold flex items-center gap-3 text-white border-b border-blue-500/20 pb-4">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 text-sm">6</span>
                                Credibility & Trust Inputs
                            </h3>
                            <p className="text-sm text-slate-400">Marking these fields as true simulates having provided verified documentation in the Data Room.</p>

                            <div className="grid md:grid-cols-3 gap-4">
                                <label className="flex items-center gap-3 p-4 bg-black/30 border border-slate-800 rounded-xl cursor-pointer hover:bg-black/50">
                                    <input type="checkbox" className="w-5 h-5 accent-blue-500" checked={formData.credibility.gstRegistered} onChange={(e) => handleNestedChange('credibility', 'gstRegistered', e.target.checked)} />
                                    <span className="text-sm font-medium">GST Registered</span>
                                </label>
                                <label className="flex items-center gap-3 p-4 bg-black/30 border border-slate-800 rounded-xl cursor-pointer hover:bg-black/50">
                                    <input type="checkbox" className="w-5 h-5 accent-blue-500" checked={formData.credibility.panVerified} onChange={(e) => handleNestedChange('credibility', 'panVerified', e.target.checked)} />
                                    <span className="text-sm font-medium">Company PAN Verified</span>
                                </label>
                                <label className="flex items-center gap-3 p-4 bg-black/30 border border-slate-800 rounded-xl cursor-pointer hover:bg-black/50">
                                    <input type="checkbox" className="w-5 h-5 accent-blue-500" checked={formData.credibility.bankVerified} onChange={(e) => handleNestedChange('credibility', 'bankVerified', e.target.checked)} />
                                    <span className="text-sm font-medium">Bank Account Verified</span>
                                </label>
                                <label className="flex items-center gap-3 p-4 bg-black/30 border border-slate-800 rounded-xl cursor-pointer hover:bg-black/50">
                                    <input type="checkbox" className="w-5 h-5 accent-blue-500" checked={formData.credibility.incubatorBacked} onChange={(e) => handleNestedChange('credibility', 'incubatorBacked', e.target.checked)} />
                                    <span className="text-sm font-medium">Incubator / VC Backed</span>
                                </label>
                            </div>
                        </div>

                        {/* SECTION 7: RISK DISCLOSURE */}
                        <div className="space-y-6 bg-red-950/20 p-6 sm:p-8 rounded-2xl border border-red-500/20">
                            <h3 className="text-xl font-bold flex items-center gap-3 text-white border-b border-red-500/20 pb-4">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500/20 text-red-400 text-sm">7</span>
                                Risk Disclosure Section
                            </h3>

                            <div className="grid md:grid-cols-2 gap-4">
                                <label className="flex flex-col gap-2 p-4 bg-black/30 border border-slate-800 rounded-xl cursor-pointer hover:bg-black/50">
                                    <div className="flex items-center gap-3">
                                        <input type="checkbox" className="w-5 h-5 accent-red-500" checked={formData.riskDisclosure.legalCases} onChange={(e) => handleNestedChange('riskDisclosure', 'legalCases', e.target.checked)} />
                                        <span className="text-sm font-bold text-red-400">Any Pending Legal Cases?</span>
                                    </div>
                                    <p className="text-xs text-slate-500 pl-8">Check if there are active litigations against the entity or founders.</p>
                                </label>
                                <label className="flex flex-col gap-2 p-4 bg-black/30 border border-slate-800 rounded-xl cursor-pointer hover:bg-black/50">
                                    <div className="flex items-center gap-3">
                                        <input type="checkbox" className="w-5 h-5 accent-red-500" checked={formData.riskDisclosure.criminalRecord} onChange={(e) => handleNestedChange('riskDisclosure', 'criminalRecord', e.target.checked)} />
                                        <span className="text-sm font-bold text-red-400">Any Founder Criminal Record?</span>
                                    </div>
                                </label>
                                <div className="space-y-2 col-span-2 mt-2">
                                    <label className="text-sm font-medium text-slate-300">Revenue Fluctuation Explanation (If any extreme drops occurred)</label>
                                    <textarea rows={2} className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500" placeholder="Optional disclosure..." value={formData.riskDisclosure.revenueFluctuationExplanation} onChange={(e) => handleNestedChange('riskDisclosure', 'revenueFluctuationExplanation', e.target.value)} />
                                </div>
                            </div>
                        </div>

                        {/* PITCH MEDIA GALLERY */}
                        <div className="space-y-6 bg-slate-900/40 p-6 sm:p-8 rounded-2xl border border-white/5">
                            <h3 className="text-xl font-bold flex items-center gap-2 text-purple-400 border-b border-white/10 pb-4">
                                <Presentation className="w-5 h-5" /> Pitch Media Gallery
                            </h3>

                            <div className="space-y-4">
                                <label className="text-sm font-medium block text-slate-300">Unlisted Pitch Video Links (YouTube/Vimeo)</label>
                                {formData.videos.map((vid: string, index: number) => (
                                    <div key={index} className="flex gap-3">
                                        <input type="url"
                                            className="w-full bg-black/60 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500"
                                            placeholder="https://youtube.com/watch?v=..."
                                            value={vid} onChange={(e) => updateVideoField(index, e.target.value)}
                                        />
                                        {formData.videos.length > 1 && (
                                            <button type="button" onClick={() => {
                                                const newVids = formData.videos.filter((_: string, i: number) => i !== index);
                                                setFormData({ ...formData, videos: newVids });
                                            }}
                                                className="px-4 py-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20"
                                            >Remove</button>
                                        )}
                                    </div>
                                ))}

                                <button type="button" onClick={addVideoField} className="text-sm text-purple-400 font-bold hover:text-purple-300 transition-colors">
                                    + Add another video
                                </button>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 sticky bottom-6 bg-slate-950/80 backdrop-blur-xl p-6 rounded-2xl border-t border-slate-800 shadow-2xl z-50">
                            <div className="text-sm text-slate-400 flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-green-400" /> All data is encrypted and NDA-protected.
                            </div>
                            <button
                                type="submit"
                                disabled={saving || isAuditing}
                                className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {isAuditing ? <><Loader2 className="w-5 h-5 animate-spin" /> System Validating...</> : saving ? "Encrypting & Publishing..." : "Publish Verified Profile"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
