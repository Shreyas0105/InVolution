"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
    BrainCircuit, ShieldCheck, AlertTriangle, CheckCircle2, XCircle,
    ArrowLeft, TrendingUp, Users, DollarSign, Activity, FileSearch,
    ChevronDown, ChevronUp
} from "lucide-react";

const COLOR_MAP: Record<string, string> = {
    emerald: "text-emerald-600",
    blue: "text-blue-400",
    yellow: "text-amber-700",
    orange: "text-orange-400",
    red: "text-red-400",
};
const BG_COLOR_MAP: Record<string, string> = {
    emerald: "bg-emerald-900/30 border border-emerald-500/20",
    blue: "bg-blue-900/30 border border-blue-500/20",
    yellow: "bg-amber-100 border border-amber-200",
    orange: "bg-orange-900/30 border border-orange-500/20",
    red: "bg-red-900/30 border border-red-500/20",
};

const SECTION_ICONS: Record<string, React.ReactElement> = {
    financial: <DollarSign className="w-5 h-5" />,
    growth: <TrendingUp className="w-5 h-5" />,
    credibility: <Users className="w-5 h-5" />,
    risk: <ShieldCheck className="w-5 h-5" />,
};

export default function DueDiligencePage() {
    const params = useParams();
    const id = params?.id as string;

    const [report, setReport] = useState<any>(null);
    const [startup, setStartup] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [expandedSection, setExpandedSection] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        fetch(`/api/startups/${id}/due-diligence`)
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    setReport(data.report);
                    setStartup(data.startup);
                } else {
                    setError(data.error || "Failed to load report");
                }
            })
            .catch(() => setError("Network error"))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <BrainCircuit className="w-16 h-16 text-indigo-400 animate-pulse mx-auto mb-4" />
                <p className="text-slate-900 text-lg font-bold">AI Due Diligence Engine Running...</p>
                <p className="text-slate-500 text-sm mt-1">Analysing financials, growth metrics, credibility & risk</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                <p className="text-red-400 font-bold">{error}</p>
                <Link href={`/startups/${id}`} className="mt-4 text-indigo-400 hover:text-indigo-300 flex items-center gap-1 justify-center text-sm transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Profile
                </Link>
            </div>
        </div>
    );

    const verdictColor = COLOR_MAP[report.verdict?.color] ?? "text-slate-900";
    const verdictBg = BG_COLOR_MAP[report.verdict?.color] ?? "bg-slate-50 border-slate-200";

    return (
        <div className="container mx-auto px-6 py-12 max-w-5xl min-h-screen">
            {/* Header */}
            <div className="mb-10">
                <Link href={`/startups/${id}`} className="flex items-center gap-2 text-slate-400 hover:text-emerald-600 text-sm mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Profile
                </Link>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <BrainCircuit className="w-6 h-6 text-indigo-400" />
                            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-900/30 px-3 py-1 rounded-full border border-indigo-500/20">
                                AI Due Diligence Report
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900">{startup?.name}</h1>
                        <p className="text-slate-500 mt-1">{startup?.sector} · {startup?.stage} Stage</p>
                    </div>
                    <div className={`px-6 py-3 rounded-2xl border ${verdictBg} text-center`}>
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">AI Verdict</p>
                        <p className={`text-xl font-bold ${verdictColor}`}>{report.verdict?.label}</p>
                    </div>
                </div>
            </div>

            {/* Overall Score */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl bg-white p-8 rounded-2xl mb-8 flex flex-col md:flex-row items-center gap-8 border border-slate-200">
                <div className="relative w-44 h-44 shrink-0">
                    <svg className="w-full h-full -rotate-90">
                        <circle cx="88" cy="88" r="78" strokeWidth="10" fill="transparent" className="text-zinc-800" stroke="currentColor" />
                        <circle cx="88" cy="88" r="78" strokeWidth="10" fill="transparent"
                            strokeDasharray="490"
                            strokeDashoffset={490 - (490 * report.totalScore) / 100}
                            className="text-indigo-500"
                            stroke="currentColor"
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-5xl font-bold text-slate-900">{report.totalScore}</span>
                        <span className="text-sm text-slate-400 font-bold">/ 100</span>
                    </div>
                </div>
                <div className="flex-grow">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Overall Due Diligence Score</h2>
                    <p className="text-slate-500 mb-4 text-sm">Based on financial health (30%), growth metrics (20%), team & credibility (25%), and risk & legal (25%).</p>
                    <div className="grid grid-cols-2 gap-3">
                        {report.sections?.map((sec: any) => (
                            <div key={sec.id} className="bg-white rounded-xl p-3 border border-slate-200">
                                <p className="text-xs text-slate-500 mb-1">{sec.label}</p>
                                <div className="flex items-center gap-2">
                                    <div className="flex-grow h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(sec.score / sec.maxScore) * 100}%` }} />
                                    </div>
                                    <span className="text-xs font-mono font-bold text-slate-600 shrink-0">{sec.score}/{sec.maxScore}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: "MRR", value: `₹${(report.keyMetrics?.revenue / 100000).toFixed(2)}L` },
                    { label: "Monthly Burn", value: `₹${(report.keyMetrics?.burn / 1000).toFixed(0)}K` },
                    { label: "Runway", value: report.keyMetrics?.runway >= 999 ? "∞" : `${report.keyMetrics?.runway} mo` },
                    { label: "Net Margin", value: `${report.keyMetrics?.netMargin}%` },
                    { label: "MAU", value: report.keyMetrics?.mau > 0 ? report.keyMetrics?.mau.toLocaleString() : "N/A" },
                    { label: "MoM Growth", value: `${report.keyMetrics?.growthRate}%` },
                    { label: "Team Size", value: `${report.keyMetrics?.teamSize} people` },
                    { label: "Equity Ask", value: `${report.keyMetrics?.equity}%` },
                ].map(m => (
                    <div key={m.label} className="bg-white border border-slate-200 shadow-sm rounded-2xl bg-white p-4 rounded-xl border border-slate-200">
                        <p className="text-xs text-slate-400 font-bold mb-1">{m.label}</p>
                        <p className="text-lg font-bold font-mono text-slate-800">{m.value}</p>
                    </div>
                ))}
            </div>

            {/* Section Deep Dives */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <FileSearch className="w-5 h-5 text-indigo-400" /> Detailed Analysis
                </h2>
                {report.sections?.map((sec: any) => {
                    const pct = sec.maxScore > 0 ? (sec.score / sec.maxScore) * 100 : 0;
                    const barColor = pct >= 75 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-500" : "bg-red-500";
                    const isExpanded = expandedSection === sec.id;
                    return (
                        <div key={sec.id} className="bg-white border border-slate-200 shadow-sm rounded-2xl bg-white rounded-2xl overflow-hidden border border-slate-200">
                            <button
                                className="w-full p-6 flex items-center gap-4 text-left hover:bg-slate-200/50 transition-colors"
                                onClick={() => setExpandedSection(isExpanded ? null : sec.id)}
                            >
                                <div className="w-10 h-10 bg-indigo-900/30 rounded-full flex items-center justify-center shrink-0 text-indigo-400 border border-indigo-500/20">
                                    {SECTION_ICONS[sec.id] ?? <Activity className="w-5 h-5" />}
                                </div>
                                <div className="flex-grow">
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="font-bold text-slate-800">{sec.label}</p>
                                        <span className="font-mono font-bold text-sm text-slate-500">{sec.score} / {sec.maxScore} pts</span>
                                    </div>
                                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full ${barColor} transition-all duration-700`} style={{ width: `${pct}%` }} />
                                    </div>
                                </div>
                                {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                            </button>
                            {isExpanded && (
                                <div className="px-6 pb-6 grid md:grid-cols-2 gap-4 border-t border-slate-200">
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-3 flex items-center gap-1 mt-4">
                                            <CheckCircle2 className="w-3 h-3" /> Strengths
                                        </p>
                                        {sec.strengths?.length > 0 ? sec.strengths.map((s: string, i: number) => (
                                            <p key={i} className="text-sm font-medium text-slate-600 flex items-start gap-2 mb-2">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /> {s}
                                            </p>
                                        )) : <p className="text-slate-400 italic text-sm">No strengths identified.</p>}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest text-red-400 mb-3 flex items-center gap-1 mt-4">
                                            <AlertTriangle className="w-3 h-3" /> Flags
                                        </p>
                                        {sec.flags?.length > 0 ? sec.flags.map((f: string, i: number) => (
                                            <p key={i} className="text-sm font-medium text-slate-600 flex items-start gap-2 mb-2">
                                                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" /> {f}
                                            </p>
                                        )) : <p className="text-slate-400 italic text-sm">No flags found. ✓</p>}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="mt-10 text-center text-xs text-slate-400 font-bold">
                Generated by InVolution AI Engine · {new Date(report.generatedAt).toLocaleString()} · Report is advisory only — not financial advice.
            </div>
        </div>
    );
}
