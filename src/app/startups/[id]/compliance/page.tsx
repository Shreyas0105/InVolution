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
        icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
        pillClass: "bg-emerald-950/40 border-emerald-500/30 text-emerald-600",
        rowClass: "border-slate-200 hover:border-emerald-500/50 bg-white",
    },
    "non-compliant": {
        label: "Non-Compliant",
        icon: <XCircle className="w-4 h-4 text-red-400" />,
        pillClass: "bg-red-950/40 border-red-500/30 text-red-400",
        rowClass: "border-red-500/20 bg-red-950/20 hover:border-red-500/50",
    },
    "partial": {
        label: "Partial",
        icon: <MinusCircle className="w-4 h-4 text-amber-700" />,
        pillClass: "bg-amber-100 border-amber-300 text-amber-700",
        rowClass: "border-amber-200 bg-amber-50 hover:border-amber-400",
    },
    "not-applicable": {
        label: "N/A",
        icon: <MinusCircle className="w-4 h-4 text-slate-400" />,
        pillClass: "bg-slate-200 border-slate-300 text-slate-500",
        rowClass: "border-slate-200 opacity-60 bg-slate-50/30",
    },
};

const PRIORITY_META: Record<string, { label: string; color: string }> = {
    critical: { label: "Critical", color: "text-red-400" },
    high: { label: "High", color: "text-orange-400" },
    medium: { label: "Medium", color: "text-amber-700" },
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
                <p className="text-slate-900 font-bold">Legal Compliance Agent Running...</p>
                <p className="text-slate-500 text-sm mt-1">Scanning regulatory requirements</p>
            </div>
        </div>
    );
    if (error) return (
        <div className="min-h-screen flex items-center justify-center text-red-400 font-bold">
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
                <Link href={`/startups/${id}`} className="flex items-center gap-2 text-slate-400 hover:text-emerald-600 text-sm mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Profile
                </Link>
                <div className="flex items-center gap-3 mb-2">
                    <Scale className="w-6 h-6 text-purple-400" />
                    <span className="text-xs font-bold uppercase tracking-widest text-purple-400 bg-purple-900/30 px-3 py-1 rounded-full border border-purple-500/20">
                        Legal Compliance Agent
                    </span>
                </div>
                <h1 className="text-3xl font-bold text-slate-900">{startup?.name}</h1>
                <p className="text-slate-500 mt-1">{startup?.sector}</p>
            </div>

            {/* Score Card */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl bg-white p-8 rounded-2xl mb-8 flex flex-col md:flex-row items-center gap-10 border border-slate-200">
                <div className="relative w-44 h-44 shrink-0">
                    <svg className="w-full h-full -rotate-90">
                        <circle cx="88" cy="88" r="78" strokeWidth="10" fill="transparent" stroke="#27272a" />
                        <circle cx="88" cy="88" r="78" strokeWidth="10" fill="transparent"
                            strokeDasharray="490"
                            strokeDashoffset={490 - (490 * report.complianceScore) / 100}
                            stroke={scoreColor}
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-5xl font-bold text-slate-900">{report.complianceScore}</span>
                        <span className="text-sm font-bold text-slate-400">/ 100</span>
                    </div>
                </div>

                <div className="flex-grow text-center md:text-left">
                    <p className="text-3xl font-bold mb-2" style={{ color: scoreColor }}>{report.complianceLabel}</p>
                    <div className="flex flex-wrap gap-4 mb-4 text-sm justify-center md:justify-start">
                        <span className="flex items-center gap-1 text-emerald-600 font-medium">
                            <CheckCircle2 className="w-4 h-4" /> {report.compliantCount} Compliant
                        </span>
                        {report.criticalIssuesCount > 0 && (
                            <span className="flex items-center gap-1 text-red-400 font-medium">
                                <XCircle className="w-4 h-4" /> {report.criticalIssuesCount} Critical
                            </span>
                        )}
                        {report.highIssuesCount > 0 && (
                            <span className="flex items-center gap-1 text-orange-400 font-medium">
                                <AlertTriangle className="w-4 h-4" /> {report.highIssuesCount} High Priority
                            </span>
                        )}
                    </div>
                    <div className={`p-4 rounded-xl border text-sm flex items-start gap-2 font-medium ${report.criticalIssuesCount > 0
                        ? "bg-red-950/40 border-red-500/30 text-red-400"
                        : report.highIssuesCount > 0
                            ? "bg-amber-100 border-amber-300 text-amber-700"
                            : "bg-emerald-950/40 border-emerald-500/30 text-emerald-600"
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
                        className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-colors border ${activeCategory === cat
                            ? "bg-purple-600 text-white border-purple-500"
                            : "border-slate-200 text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-200"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Checklist */}
            <div className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-purple-400" /> Compliance Checklist
                </h2>
                {filteredItems?.map((item: any) => {
                    const meta = STATUS_META[item.status as StatusType] ?? STATUS_META["not-applicable"];
                    const pMeta = PRIORITY_META[item.priority] ?? PRIORITY_META.low;
                    return (
                        <div key={item.id} className={`bg-white border border-slate-200 shadow-sm rounded-2xl p-5 rounded-xl border transition-all ${meta.rowClass}`}>
                            <div className="flex items-start gap-3">
                                <div className="shrink-0 mt-0.5">{meta.icon}</div>
                                <div className="flex-grow">
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                        <p className="font-bold text-slate-800">{item.requirement}</p>
                                        <span className={`text-[10px] font-bold uppercase border px-2 py-0.5 rounded ${meta.pillClass}`}>
                                            {meta.label}
                                        </span>
                                        <span className={`text-[10px] font-bold flex items-center gap-0.5 ${pMeta.color}`}>
                                            <Tag className="w-3 h-3" /> {pMeta.label}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400 font-medium">{item.category}</p>
                                    <p className="text-sm text-slate-500 mt-2">{item.detail}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-10 text-center text-xs text-slate-400 font-bold">
                InVolution Legal Compliance Agent · {new Date(report.generatedAt).toLocaleString()} · Based on Indian startup regulations (GST, PMLA, SEBI ICDR, RBI KYC)
            </div>
        </div>
    );
}
