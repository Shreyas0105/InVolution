"use client";

import { useState } from "react";
import { Briefcase, TrendingUp, Presentation, AlertCircle, Save, Bot, Loader2 } from "lucide-react";

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
    });

    const addVideoField = () => {
        setFormData({ ...formData, videos: [...formData.videos, ""] });
    };

    const updateVideoField = (index: number, value: string) => {
        const newVideos = [...formData.videos];
        newVideos[index] = value;
        setFormData({ ...formData, videos: newVideos });
    };

    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const [isAuditing, setIsAuditing] = useState(false);
    const [auditResult, setAuditResult] = useState<{ errors: string[], warnings: string[] } | null>(null);

    const runAIAudit = () => {
        const errors: string[] = [];
        const warnings: string[] = [];

        const mrr = Number(formData.mrr);
        const margin = Number(formData.netProfitMargin);
        const fundingAsk = Number(formData.fundingRequired);
        const cac = Number(formData.cac);
        const ltv = Number(formData.ltv);

        // --- Logic Gates ---
        if (margin > 80 || margin < -200) {
            errors.push(`Unrealistic Net Margin (${margin}%). SAAS bounds typically fall between -200% and +80%. Please correct.`);
        }

        if (cac > 0 && ltv > 0 && cac >= ltv) {
            errors.push(`Unit Economics inversion detected. Customer Acquisition Cost (₹${cac}) cannot exceed Lifetime Value (₹${ltv}).`);
        }

        if (mrr < 1000 && fundingAsk > 10000000) {
            warnings.push("High Valuation Risk: Asking for >₹1Cr funding on less than ₹1k MRR may trigger auto-rejection by the AI Matchmaking system.");
        }

        // --- Media Validation ---
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

        // Simulate AI processing delay
        await new Promise(r => setTimeout(r, 1500));

        const audit = runAIAudit();
        setIsAuditing(false);

        if (audit.errors.length > 0) {
            setAuditResult(audit);
            return; // Halt the publish if Hard Errors are found
        }

        if (audit.warnings.length > 0 && !auditResult?.warnings) {
            // First time seeing warning, halt once to let user read
            setAuditResult(audit);
            return;
        }

        setSaving(true);

        try {
            const res = await fetch('/api/startups/publish', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to publish startup');
            }

            setSuccess(true);
            setFormData({
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
            });
        } catch (err: any) {
            console.error("Publish error:", err);
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="container mx-auto px-6 py-12 max-w-4xl min-h-screen">
            <div className="mb-10 animate-fade-in-up">
                <h1 className="text-4xl font-outfit font-bold text-white mb-2">Publish Your Startup</h1>
                <p className="text-slate-400 font-inter">Share valid financial details, pitch videos, and requirements to attract verified investors.</p>
            </div>

            <div className="glass-panel rounded-2xl p-8 relative overflow-hidden">
                {success ? (
                    <div className="py-16 text-center animate-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                            <Save className="w-10 h-10 text-green-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white font-outfit mb-3">Profile Published!</h2>
                        <p className="text-slate-400 max-w-md mx-auto">Your startup is now live in the investor search engine. We will notify you when an AI match occurs.</p>
                        <button
                            onClick={() => setSuccess(false)}
                            className="mt-8 px-8 py-3 bg-white text-slate-950 font-semibold rounded-full hover:bg-slate-200 transition-colors"
                        >
                            View Dashboard
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-8 relative z-10 text-slate-200">
                        {/* Audit Report Modal / Banner */}
                        {auditResult && (
                            <div className="bg-[#18191d] border border-blue-500/20 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Bot className="w-24 h-24" />
                                </div>
                                <h3 className="text-xl font-bold flex items-center gap-2 mb-4 text-blue-400">
                                    <Bot className="w-5 h-5" /> AI Audit Results
                                </h3>

                                {auditResult.errors.length > 0 && (
                                    <div className="mb-4">
                                        <p className="text-red-400 font-bold mb-2 flex items-center gap-1"><AlertCircle className="w-4 h-4" /> Critical Flags (Must fix prior to publish):</p>
                                        <ul className="list-disc pl-5 space-y-1 text-sm text-slate-300">
                                            {auditResult.errors.map((err: string, i: number) => <li key={i}>{err}</li>)}
                                        </ul>
                                    </div>
                                )}

                                {auditResult.warnings.length > 0 && (
                                    <div>
                                        <p className="text-yellow-400 font-bold mb-2 flex items-center gap-1"><AlertCircle className="w-4 h-4" /> Optimization Warnings:</p>
                                        <ul className="list-disc pl-5 space-y-1 text-sm text-slate-300">
                                            {auditResult.warnings.map((warn: string, i: number) => <li key={i}>{warn}</li>)}
                                        </ul>
                                        {auditResult.errors.length === 0 && (
                                            <p className="text-xs text-slate-500 mt-4">Click "Publish" again to acknowledge these warnings and bypass the lock.</p>
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

                        {/* Business Basics */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold flex items-center gap-2 text-indigo-400 border-b border-white/10 pb-2">
                                <Briefcase className="w-5 h-5" /> Business Overview
                            </h3>

                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Startup Name</label>
                                    <input type="text" required
                                        className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="e.g. Acme Corp"
                                        value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Sector</label>
                                    <select
                                        className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={formData.sector} onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                                    >
                                        <option value="FinTech">FinTech</option>
                                        <option value="HealthTech">HealthTech</option>
                                        <option value="EdTech">EdTech</option>
                                        <option value="SaaS">SaaS</option>
                                        <option value="Cleantech">CleanTech</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Business Model</label>
                                    <select
                                        className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={formData.businessModel} onChange={(e) => setFormData({ ...formData, businessModel: e.target.value })}
                                    >
                                        <option value="B2B SaaS">B2B SaaS</option>
                                        <option value="B2C E-commerce">B2C E-commerce</option>
                                        <option value="D2C">D2C</option>
                                        <option value="B2B Enterprise">B2B Enterprise</option>
                                        <option value="Marketplace">Marketplace</option>
                                        <option value="DeepTech">DeepTech</option>
                                    </select>
                                </div>
                                <div className="space-y-2 md:col-span-3">
                                    <label className="text-sm font-medium">Pitch Description</label>
                                    <textarea required rows={4}
                                        className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Describe your vision, problem, and solution..."
                                        value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Financials */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold flex items-center gap-2 text-pink-400 border-b border-white/10 pb-2">
                                <TrendingUp className="w-5 h-5" /> Detailed Financial Matrix
                            </h3>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-2">Funding Ask (₹) <span title="Total amount seeking"><AlertCircle className="w-4 h-4 text-slate-500" /></span></label>
                                    <input type="number" required min="100000"
                                        className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
                                        placeholder="5000000"
                                        value={formData.fundingRequired} onChange={(e) => setFormData({ ...formData, fundingRequired: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Equity Offered (%)</label>
                                    <input type="number" required min="1" max="100"
                                        className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
                                        placeholder="10"
                                        value={formData.equityForSale} onChange={(e) => setFormData({ ...formData, equityForSale: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Avg. Monthly Rev (MRR in ₹)</label>
                                    <input type="number" required
                                        className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
                                        placeholder="100000"
                                        value={formData.mrr} onChange={(e) => setFormData({ ...formData, mrr: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Net Profit Margin (%)</label>
                                    <input type="number" required
                                        className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
                                        placeholder="15"
                                        value={formData.netProfitMargin} onChange={(e) => setFormData({ ...formData, netProfitMargin: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6 pt-4 border-t border-slate-800">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">Proj. ROI (%)</label>
                                    <input type="number"
                                        className="w-full bg-black/30 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
                                        placeholder="120"
                                        value={formData.projectedROI} onChange={(e) => setFormData({ ...formData, projectedROI: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">Avg. CAC (₹)</label>
                                    <input type="number"
                                        className="w-full bg-black/30 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
                                        placeholder="1500"
                                        value={formData.cac} onChange={(e) => setFormData({ ...formData, cac: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">Est. LTV (₹)</label>
                                    <input type="number"
                                        className="w-full bg-black/30 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
                                        placeholder="15000"
                                        value={formData.ltv} onChange={(e) => setFormData({ ...formData, ltv: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Media */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold flex items-center gap-2 text-purple-400 border-b border-white/10 pb-2">
                                <Presentation className="w-5 h-5" /> Pitch Media Gallery
                            </h3>

                            <div className="space-y-4">
                                <label className="text-sm font-medium block">Unlisted Video Links (YouTube/Vimeo)</label>
                                {formData.videos.map((vid: string, index: number) => (
                                    <div key={index} className="flex gap-3">
                                        <input type="url"
                                            className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder="https://youtube.com/watch?v=..."
                                            value={vid} onChange={(e) => updateVideoField(index, e.target.value)}
                                        />
                                        {formData.videos.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newVids = formData.videos.filter((_: string, i: number) => i !== index);
                                                    setFormData({ ...formData, videos: newVids });
                                                }}
                                                className="px-4 py-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}

                                <button type="button" onClick={addVideoField} className="text-sm text-purple-400 font-bold hover:text-purple-300">
                                    + Add another video
                                </button>

                                <p className="text-xs text-slate-500 mt-2">Investors will see these in your secure deal room viewing gallery.</p>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/10 flex justify-end">
                            <button
                                type="submit"
                                disabled={saving || isAuditing}
                                className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-semibold rounded-full hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isAuditing ? <><Loader2 className="w-4 h-4 animate-spin" /> Running AI Audit...</> : saving ? "Publishing Profile..." : "Publish Startup Profile"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
