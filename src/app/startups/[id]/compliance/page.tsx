"use client";

import React from "react";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
    Scale, CheckCircle2, XCircle, MinusCircle, AlertTriangle,
    ArrowLeft, ShieldAlert, Tag, Info
} from "lucide-react";

type StatusType = "compliant" | "non-compliant" | "partial" | "not-applicable";

const STATUS_META: Record<StatusType, { label: string; icon: React.ReactElement; pillClass: string; rowClass: string }> = {
    "compliant": {
        label: "Compliant",
        icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
        pillClass: "bg-emerald-500/20 border-emerald-500/30 text-emerald-400",
        rowClass: "border-slate-800 hover:border-emerald-500/20",
    },
    "non-compliant": {
        label: "Non-Compliant",
        icon: <XCircle className="w-4 h-4 text-red-400" />,
        pillClass: "bg-red-500/20 border-red-500/30 text-red-400",
        rowClass: "border-red-900/40 bg-red-950/10 hover:border-red-500/30",
    },
    "partial": {
        label: "Partial",
        icon: <MinusCircle className="w-4 h-4 text-yellow-400" />,
        pillClass: "bg-yellow-500/20 border-yellow-500/30 text-yellow-400",
        rowClass: "border-yellow-900/30 hover:border-yellow-500/20",
    },
    "not-applicable": {
        label: "N/A",
        icon: <MinusCircle className="w-4 h-4 text-slate-500" />,
        pillClass: "bg-slate-700/20 border-slate-600/30 text-slate-500",
        rowClass: "border-slate-800 opacity-60",
    },
};

const PRIORITY_META: Record<string, { label: string; color: string }> = {
    critical: { label: "Critical", color: "text-red-400" },
    high: { label: "High", color: "text-orange-400" },
    medium: { label: "Medium", color: "text-yellow-400" },
    low: { label: "Low", color: "text-slate-400" },
};

export default function CompliancePage() {
    const params = useParams();
    const id = params?.id as string;

    const [report, setReport] = useState<any>(null);
    const [startup, setStartup] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeCategory, setActiveCategory] = useState<string>("All");

    useEffect(() => {
        if (!id) return;
        fetch(`/api/startups/${id}/compliance`)
            .then(r => r.json())
            .then(data => {
                if (data.success) { setReport(data.report); setStartup(data.startup); }
                else setError(data.error || "Failed to load");
            })
            .catch(() => setError("Network error"))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <Scale className="w-14 h-14 text-purple-400 animate-pulse mx-auto mb-4" />
                <p className="text-slate-300 font-semibold">Legal Compliance Agent Running...</p>
                <p className="text-slate-500 text-sm mt-1">Scanning regulatory requirements</p>
            </div>
        </div>
    );
    if (error) return (
        <div className="min-h-screen flex items-center justify-center text-red-400">
            <XCircle className="w-6 h-6 mr-2" />{error}
        </div>
    );

    const scoreColor =
        report.complianceScore >= 90 ? "#10b981" :
            report.complianceScore >= 70 ? "#3b82f6" :
                report.complianceScore >= 50 ? "#eab308" : "#ef4444";

    const filteredItems = activeCategory === "All"
        ? report.items
        : report.items.filter((item: any) => item.category === activeCategory);

    const allCategories = ["All", ...(report.categories ?? [])];

    return (
        <div className="container mx-auto px-6 py-12 max-w-5xl min-h-screen">
            {/* Header */}
            <div className="mb-10">
                <Link href={`/startups/${id}`} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Profile
                </Link>
                <div className="flex items-center gap-3 mb-2">
                    <Scale className="w-6 h-6 text-purple-400" />
                    <span className="text-xs font-bold uppercase tracking-widest text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                        Legal Compliance Agent
                    </span>
                </div>
                <h1 className="text-3xl font-bold text-white">{startup?.name}</h1>
                <p className="text-slate-400 mt-1">{startup?.sector}</p>
            </div>

            {/* Score Card */}
            <div className="glass-panel p-8 rounded-2xl mb-8 flex flex-col md:flex-row items-center gap-10">
                <div className="relative w-44 h-44 shrink-0">
                    <svg className="w-full h-full -rotate-90">
                        <circle cx="88" cy="88" r="78" strokeWidth="10" fill="transparent" stroke="#1e293b" />
                        <circle cx="88" cy="88" r="78" strokeWidth="10" fill="transparent"
                            strokeDasharray="490"
                            strokeDashoffset={490 - (490 * report.complianceScore) / 100}
                            stroke={scoreColor}
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-5xl font-bold text-white">{report.complianceScore}</span>
                        <span className="text-sm text-slate-400">/ 100</span>
                    </div>
                </div>

                <div className="flex-grow text-center md:text-left">
                    <p className="text-3xl font-bold mb-2" style={{ color: scoreColor }}>{report.complianceLabel}</p>
                    <div className="flex flex-wrap gap-4 mb-4 text-sm justify-center md:justify-start">
                        <span className="flex items-center gap-1 text-emerald-400">
                            <CheckCircle2 className="w-4 h-4" /> {report.compliantCount} Compliant
                        </span>
                        {report.criticalIssuesCount > 0 && (
                            <span className="flex items-center gap-1 text-red-400">
                                <XCircle className="w-4 h-4" /> {report.criticalIssuesCount} Critical
                            </span>
                        )}
                        {report.highIssuesCount > 0 && (
                            <span className="flex items-center gap-1 text-orange-400">
                                <AlertTriangle className="w-4 h-4" /> {report.highIssuesCount} High Priority
                            </span>
                        )}
                    </div>
                    <div className={`p-4 rounded-xl border text-sm flex items-start gap-2 ${report.criticalIssuesCount > 0
                        ? "bg-red-950/30 border-red-500/30 text-red-300"
                        : report.highIssuesCount > 0
                            ? "bg-yellow-950/30 border-yellow-500/30 text-yellow-300"
                            : "bg-emerald-950/30 border-emerald-500/30 text-emerald-300"
                        }`}>
                        <Info className="w-4 h-4 shrink-0 mt-0.5" />
                        {report.investorNote}
                    </div>
                </div>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
                {allCategories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${activeCategory === cat
                            ? "bg-purple-600 border-purple-500 text-white"
                            : "border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Checklist */}
            <div className="space-y-3">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-purple-400" /> Compliance Checklist
                </h2>
                {filteredItems?.map((item: any) => {
                    const meta = STATUS_META[item.status as StatusType] ?? STATUS_META["not-applicable"];
                    const pMeta = PRIORITY_META[item.priority] ?? PRIORITY_META.low;
                    return (
                        <div key={item.id} className={`glass-panel p-5 rounded-xl border transition-all ${meta.rowClass}`}>
                            <div className="flex items-start gap-3">
                                <div className="shrink-0 mt-0.5">{meta.icon}</div>
                                <div className="flex-grow">
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                        <p className="font-semibold text-white">{item.requirement}</p>
                                        <span className={`text-[10px] font-bold uppercase border px-2 py-0.5 rounded ${meta.pillClass}`}>
                                            {meta.label}
                                        </span>
                                        <span className={`text-[10px] font-medium flex items-center gap-0.5 ${pMeta.color}`}>
                                            <Tag className="w-3 h-3" /> {pMeta.label}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500">{item.category}</p>
                                    <p className="text-sm text-slate-400 mt-1">{item.detail}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-10 text-center text-xs text-slate-600">
                InVolution Legal Compliance Agent · {new Date(report.generatedAt).toLocaleString()} · Based on Indian startup regulations (GST, PMLA, SEBI ICDR, RBI KYC)
            </div>
        </div>
    );
}
