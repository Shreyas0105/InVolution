"use client";

import React from "react";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
    ShieldCheck, Star, ArrowLeft, CheckCircle2, XCircle,
    BadgeCheck, Award, AlertOctagon
} from "lucide-react";

const TIER_META: Record<string, { icon: React.ReactElement; color: string; bg: string; border: string }> = {
    Platinum: {
        icon: <Award className="w-8 h-8" />,
        color: "text-cyan-400",
        bg: "bg-cyan-950/40",
        border: "border-cyan-500/30",
    },
    Gold: {
        icon: <Star className="w-8 h-8" />,
        color: "text-amber-700",
        bg: "bg-amber-100",
        border: "border-amber-300",
    },
    Silver: {
        icon: <ShieldCheck className="w-8 h-8" />,
        color: "text-slate-500",
        bg: "bg-white",
        border: "border-slate-300/50",
    },
    Bronze: {
        icon: <AlertOctagon className="w-8 h-8" />,
        color: "text-orange-400",
        bg: "bg-orange-950/40",
        border: "border-orange-500/30",
    },
};

const COLOR_STROKE: Record<string, string> = {
    emerald: "#10b981", blue: "#3b82f6", yellow: "#eab308",
    orange: "#f97316", red: "#ef4444"
};

export default function TrustScorePage() {
    const params = useParams();
    const id = params?.id as string;

    const [report, setReport] = useState<any>(null);
    const [startup, setStartup] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) return;
        fetch(`/api/startups/${id}/trust`)
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
                <ShieldCheck className="w-14 h-14 text-blue-400 animate-pulse mx-auto mb-4" />
                <p className="text-slate-900 font-bold">Computing Trust & Reputation Score...</p>
            </div>
        </div>
    );
    if (error) return (
        <div className="min-h-screen flex items-center justify-center text-red-400 font-bold">
            <XCircle className="w-6 h-6 mr-2" />{error}
        </div>
    );

    const tier = report.tier ?? "Bronze";
    const tierMeta = TIER_META[tier] ?? TIER_META.Bronze;
    const stroke = COLOR_STROKE[report.trustColor] ?? "#6366f1";

    return (
        <div className="container mx-auto px-6 py-12 max-w-4xl min-h-screen">
            {/* Header */}
            <div className="mb-10">
                <Link href={`/startups/${id}`} className="flex items-center gap-2 text-slate-400 hover:text-emerald-600 text-sm mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Profile
                </Link>
                <div className="flex items-center gap-3 mb-2">
                    <ShieldCheck className="w-6 h-6 text-blue-400" />
                    <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-900/30 px-3 py-1 rounded-full border border-blue-500/20">
                        Trust & Reputation Score
                    </span>
                </div>
                <h1 className="text-3xl font-bold text-slate-900">{startup?.name}</h1>
                <p className="text-slate-500 mt-1">{startup?.sector}</p>
            </div>

            {/* Hero Score + Tier */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl bg-white p-8 rounded-2xl mb-8 flex flex-col md:flex-row items-center gap-10 border border-slate-200">
                {/* Circular Score */}
                <div className="relative w-44 h-44 shrink-0">
                    <svg className="w-full h-full -rotate-90">
                        <circle cx="88" cy="88" r="78" strokeWidth="10" fill="transparent" stroke="#27272a" />
                        <circle cx="88" cy="88" r="78" strokeWidth="10" fill="transparent"
                            strokeDasharray="490"
                            strokeDashoffset={490 - (490 * report.totalTrust) / 100}
                            stroke={stroke}
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-5xl font-bold text-slate-900">{report.totalTrust}</span>
                        <span className="text-sm font-bold text-slate-400">/ 100</span>
                    </div>
                </div>

                {/* Info */}
                <div className="text-center md:text-left">
                    <p className="text-4xl font-bold mb-2" style={{ color: stroke }}>{report.trustLabel}</p>
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border mb-4 ${tierMeta.bg} ${tierMeta.border} ${tierMeta.color} shadow-lg shadow-black/20`}>
                        {tierMeta.icon}
                        <span className="font-bold text-lg">{tier} Tier</span>
                    </div>
                    <p className="text-slate-500 text-sm max-w-sm">
                        <span className="font-bold text-slate-600">{report.verifiedCount}</span> of <span className="font-bold text-slate-600">{report.totalFactors}</span> trust factors verified.
                        Based on identity credentials, financial transparency, external backing, and disclosure integrity.
                    </p>
                </div>
            </div>

            {/* Factor Breakdown */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <BadgeCheck className="w-5 h-5 text-blue-400" /> Trust Factor Breakdown
                </h2>
                {report.factors?.map((f: any) => {
                    const pct = f.max > 0 ? (f.earned / f.max) * 100 : 0;
                    const barColor = pct >= 80 ? "bg-emerald-500" : pct >= 50 ? "bg-blue-500" : pct >= 25 ? "bg-amber-500" : "bg-red-500";
                    return (
                        <div key={f.label} className="bg-white border border-slate-200 shadow-sm rounded-2xl bg-white p-5 rounded-2xl border border-slate-200">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    {f.verified
                                        ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                                        : <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                                    }
                                    <span className="font-bold text-slate-800">{f.label}</span>
                                </div>
                                <span className="text-sm font-mono font-bold text-slate-500">{f.earned} / {f.max} pts</span>
                            </div>
                            <div className="h-2 bg-slate-200 rounded-full overflow-hidden mb-2">
                                <div className={`h-full ${barColor} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                            </div>
                            <p className="text-xs text-slate-400 font-medium">{f.detail}</p>
                        </div>
                    );
                })}
            </div>

            <div className="mt-10 text-center text-xs text-slate-400 font-bold">
                InVolution Trust Engine · {new Date(report.generatedAt).toLocaleString()} · Trust scores are computed from KYC & self-disclosed startup data.
            </div>
        </div>
    );
}
