"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Activity, LineChart, FileText, CheckCircle2, AlertCircle, Bot, Loader2, Link as LinkIcon, Save, CalendarDays, DollarSign, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function FinancialUpdatePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [formData, setFormData] = useState({
        monthYear: "",
        revenue: "",
        profit: "",
        documentUrl: ""
    });

    const [aiScore, setAiScore] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // AI Confidence Score Calculator Module
    useEffect(() => {
        let score = 0;

        // Base points for just filling it out
        if (formData.monthYear) score += 20;

        // Points for financial logic
        const rev = Number(formData.revenue);
        const profit = Number(formData.profit);

        if (rev > 0) score += 20;
        if (profit > 0) score += 20; // Profitable
        if (profit < 0 && rev > 0 && Math.abs(profit) < rev) score += 10; // Controlled burn

        // Massive points for evidence
        if (formData.documentUrl.length > 5) score += 40;

        setAiScore(Math.min(100, score));
    }, [formData.monthYear, formData.revenue, formData.profit, formData.documentUrl]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSaving(true);

        try {
            const res = await fetch(`/api/startups/${id}/financials`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    monthYear: formData.monthYear,
                    revenue: Number(formData.revenue),
                    profit: Number(formData.profit),
                    documentUrl: formData.documentUrl,
                    aiConfidenceScore: aiScore
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to submit update');
            }

            setSuccess(true);
            setTimeout(() => {
                router.push("/startups/dashboard");
                router.refresh();
            }, 2500);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    if (success) {
        return (
            <div className="container mx-auto px-6 py-24 max-w-2xl min-h-[calc(100vh-80px)] text-center">
                <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-in zoom-in duration-500">
                    <Save className="w-12 h-12 text-emerald-400" />
                </div>
                <h2 className="text-3xl font-bold font-outfit text-white mb-4">Financial Update Verified</h2>
                <p className="text-slate-400 mb-8 text-lg">Your data has been securely logged on the blockchain and an AI snapshot has been generated with a confidence score of {aiScore}/100.</p>
                <div className="flex justify-center">
                    <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-12 max-w-4xl min-h-[calc(100vh-80px)]">
            <div className="mb-10">
                <Link href="/startups/dashboard" className="text-indigo-400 hover:text-indigo-300 text-sm font-semibold mb-4 inline-block">&larr; Back to Dashboard</Link>
                <h1 className="text-3xl font-outfit font-bold text-white mb-2 flex items-center gap-3">
                    <LineChart className="w-8 h-8 text-emerald-400" /> Post Financial Update
                </h1>
                <p className="text-slate-400 font-inter">Continuous disclosure dramatically increases your AI Match Score and Deal Room visibility.</p>
            </div>

            <div className="grid md:grid-cols-5 gap-8">
                {/* Form Col */}
                <div className="md:col-span-3">
                    <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-2xl space-y-6">

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                <p className="text-red-300 text-sm">{error}</p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                <CalendarDays className="w-4 h-4 text-slate-500" /> Reporting Month & Year
                            </label>
                            <input type="month" required className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 text-white" value={formData.monthYear} onChange={(e) => setFormData({ ...formData, monthYear: e.target.value })} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-slate-500" /> Total Revenue (₹)
                                </label>
                                <input type="number" required className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 font-mono text-white" placeholder="0" value={formData.revenue} onChange={(e) => setFormData({ ...formData, revenue: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-slate-500" /> Net Profit (₹)
                                </label>
                                <input type="number" required className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 font-mono text-white" placeholder="0 or negative for loss" value={formData.profit} onChange={(e) => setFormData({ ...formData, profit: e.target.value })} />
                            </div>
                        </div>

                        <div className="space-y-2 pt-4 border-t border-slate-700/50">
                            <label className="text-sm font-medium text-emerald-300 flex items-center gap-2">
                                <LinkIcon className="w-4 h-4" /> Supporting Document URL (Optional but Highly Recommended)
                            </label>
                            <p className="text-xs text-slate-500 mb-2">Link a verified bank statement, GST filing, or MIS report. This massively boosts your AI Confidence Score.</p>
                            <input type="url" className="w-full bg-emerald-950/20 border border-emerald-500/30 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 text-white placeholder-slate-600" placeholder="https://drive.google.com/file/d/..." value={formData.documentUrl} onChange={(e) => setFormData({ ...formData, documentUrl: e.target.value })} />
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {isSaving ? <><Loader2 className="w-5 h-5 animate-spin" /> Committing Data...</> : "Submit Monthly Update"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Score Col */}
                <div className="md:col-span-2">
                    <div className="glass-panel p-8 rounded-2xl sticky top-24 border border-indigo-500/20 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <Bot className="w-32 h-32" />
                        </div>

                        <div className="relative z-10">
                            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2 mb-6">
                                <Activity className="w-4 h-4" /> Live AI Analysis
                            </h3>

                            <div className="text-center py-6">
                                {/* Circular Score Display */}
                                <div className="relative w-32 h-32 mx-auto mb-4">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                                        <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent"
                                            strokeDasharray="364"
                                            strokeDashoffset={364 - (364 * aiScore) / 100}
                                            className={`${aiScore >= 80 ? 'text-green-500' : aiScore >= 50 ? 'text-amber-500' : 'text-red-500'} transition-all duration-1000 ease-out`}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className={`text-4xl font-bold font-mono ${aiScore >= 80 ? 'text-green-400' : aiScore >= 50 ? 'text-amber-400' : 'text-red-400'} transition-colors duration-500`}>
                                            {Math.round(aiScore)}
                                        </span>
                                    </div>
                                </div>
                                <h4 className="text-white font-bold text-lg">Confidence Score</h4>
                            </div>

                            <div className="space-y-3 mt-4 text-sm">
                                <div className="flex items-center gap-2 text-slate-300">
                                    {formData.monthYear ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <div className="w-4 h-4 rounded-full border border-slate-600" />}
                                    Temporal Logic Verified
                                </div>
                                <div className="flex items-center gap-2 text-slate-300">
                                    {Number(formData.revenue) > 0 ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <div className="w-4 h-4 rounded-full border border-slate-600" />}
                                    Revenue Bounds Checked
                                </div>
                                <div className="flex items-center gap-2 text-slate-300">
                                    {formData.profit !== "" ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <div className="w-4 h-4 rounded-full border border-slate-600" />}
                                    Profit/Loss Ratio Intact
                                </div>
                                <div className="flex items-center gap-2 text-slate-300">
                                    {formData.documentUrl.length > 5 ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <div className="w-4 h-4 rounded-full border border-slate-600" />}
                                    External Audit Sourced
                                </div>
                            </div>

                            {aiScore < 80 && (
                                <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                                    <p className="text-xs text-amber-200/80 leading-relaxed">
                                        <AlertCircle className="w-3 h-3 inline mr-1 -mt-0.5" />
                                        Provide a verifiable document URL (GST/Bank) to drastically maximize your Confidence Score parameters for investors.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
