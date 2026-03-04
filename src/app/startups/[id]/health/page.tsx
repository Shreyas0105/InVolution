"use client";

import React from "react";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
    Activity, AlertTriangle, CheckCircle, XCircle, ArrowLeft,
    TrendingUp, Flame, Clock, BarChart2, Info
} from "lucide-react";

const PILLAR_ICONS: Record<string, React.ReactElement> = {
    burn: <Flame className="w-5 h-5" />,
    runway: <Clock className="w-5 h-5" />,
    revenue: <TrendingUp className="w-5 h-5" />,
    churn: <Activity className="w-5 h-5" />,
    margin: <BarChart2 className="w-5 h-5" />,
    growth: <TrendingUp className="w-5 h-5" />,
};

const PILLAR_COLORS: Record<string, string> = {
    burn: "indigo", runway: "emerald", revenue: "blue",
    churn: "pink", margin: "amber", growth: "cyan"
};

const GAUGE_COLORS: Record<string, string> = {
    emerald: "#10b981", blue: "#3b82f6", yellow: "#eab308",
    orange: "#f97316", red: "#ef4444"
};

const ALERT_STYLES: Record<string, { bg: string; border: string; icon: React.ReactElement; text: string }> = {
    critical: { bg: "bg-red-950/40", border: "border-red-500/30", icon: <XCircle className="w-4 h-4 text-red-400 shrink-0" />, text: "text-red-400" },
    warning: { bg: "bg-amber-100", border: "border-amber-300", icon: <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />, text: "text-amber-700" },
    info: { bg: "bg-blue-950/40", border: "border-blue-500/30", icon: <Info className="w-4 h-4 text-blue-400 shrink-0" />, text: "text-blue-400" },
};

export default function HealthMonitorPage() {
    const params = useParams();
    const id = params?.id as string;

    const [report, setReport] = useState<any>(null);
    const [startup, setStartup] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) return;
        fetch(`/api/startups/${id}/health`)
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
                <Activity className="w-14 h-14 text-emerald-600 animate-pulse mx-auto mb-4" />
                <p className="text-slate-900 font-bold">Health Monitor Computing Vitals...</p>
            </div>
        </div>
    );
    if (error) return (
        <div className="min-h-screen flex items-center justify-center text-red-400 font-bold">
            <XCircle className="w-6 h-6 mr-2" />{error}
        </div>
    );

    const gaugeColor = GAUGE_COLORS[report.healthColor] ?? "#6366f1";
    const sweepAngle = (report.overallHealth / 100) * 180;

    // Convert semi-circular gauge
    const radius = 80;
    const circumference = Math.PI * radius;
    const dashOffset = circumference - (circumference * report.overallHealth) / 100;

    return (
        <div className="container mx-auto px-6 py-12 max-w-5xl min-h-screen">
            {/* Header */}
            <div className="mb-10">
                <Link href={`/startups/${id}`} className="flex items-center gap-2 text-slate-400 hover:text-emerald-600 text-sm mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Profile
                </Link>
                <div className="flex items-center gap-3 mb-2">
                    <Activity className="w-6 h-6 text-emerald-600" />
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-900/30 px-3 py-1 rounded-full border border-emerald-500/20">
                        Startup Health Monitor
                    </span>
                </div>
                <h1 className="text-3xl font-bold text-slate-900">{startup?.name}</h1>
                <p className="text-slate-500 mt-1">{startup?.sector}</p>
            </div>

            {/* Overall Health Gauge */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl bg-white p-8 rounded-2xl mb-8 flex flex-col md:flex-row items-center gap-10 border border-slate-200">
                <div className="relative shrink-0" style={{ width: 200, height: 110 }}>
                    <svg width="200" height="110" viewBox="0 0 200 110">
                        {/* Track */}
                        <path d="M 10 100 A 90 90 0 0 1 190 100" fill="none" stroke="#27272a" strokeWidth="14" strokeLinecap="round" />
                        {/* Arc */}
                        <path d="M 10 100 A 90 90 0 0 1 190 100" fill="none" stroke={gaugeColor}
                            strokeWidth="14" strokeLinecap="round"
                            strokeDasharray={`${(sweepAngle / 180) * 283} 283`}
                            style={{ transition: 'stroke-dasharray 1s ease' }}
                        />
                        <text x="100" y="95" textAnchor="middle" fontSize="32" fontWeight="bold" fill="#f8fafc">{report.overallHealth}</text>
                        <text x="100" y="108" textAnchor="middle" fontSize="10" fill="#a1a1aa">/ 100</text>
                    </svg>
                </div>
                <div className="flex-grow text-center md:text-left">
                    <p className="text-4xl font-bold" style={{ color: gaugeColor }}>{report.healthLabel}</p>
                    <p className="text-slate-500 mt-2 max-w-md">Real-time health analysis across 6 operational dimensions. Updated each time the startup submits a financial report.</p>
                    <div className="mt-4 flex flex-wrap gap-3">
                        {report.alerts?.length === 0 && (
                            <span className="flex items-center gap-1 text-sm text-emerald-600 bg-emerald-900/30 px-3 py-1 rounded-full border border-emerald-500/20 font-medium">
                                <CheckCircle className="w-4 h-4" /> All vitals clear
                            </span>
                        )}
                        {report.alerts?.slice(0, 2).map((a: any, i: number) => {
                            const s = ALERT_STYLES[a.level];
                            return (
                                <span key={i} className={`flex items-center gap-1 text-xs px-3 py-1 rounded-full border ${s.bg} ${s.border} ${s.text} font-medium`}>
                                    {s.icon} {a.level}
                                </span>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Alerts */}
            {report.alerts?.length > 0 && (
                <div className="mb-8 space-y-3">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-700" /> Live Alerts
                    </h2>
                    {report.alerts.map((a: any, i: number) => {
                        const s = ALERT_STYLES[a.level] ?? ALERT_STYLES.info;
                        return (
                            <div key={i} className={`flex items-start gap-3 p-4 rounded-xl border ${s.bg} ${s.border}`}>
                                {s.icon}
                                <p className={`text-sm ${s.text} font-medium`}>{a.message}</p>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Pillar Scores Grid */}
            <div className="mb-8">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-indigo-400" /> Health Pillars
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {report.pillars?.map((p: any) => {
                        const color = PILLAR_COLORS[p.id] ?? "indigo";
                        const barColorClass =
                            p.score >= 80 ? "bg-emerald-500" :
                                p.score >= 60 ? "bg-blue-500" :
                                    p.score >= 40 ? "bg-amber-500" : "bg-red-500";
                        return (
                            <div key={p.id} className="bg-white border border-slate-200 shadow-sm rounded-2xl bg-white p-5 rounded-2xl border border-slate-200">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center bg-${color}-900/30 text-${color}-400 border border-${color}-500/20`}>
                                        {PILLAR_ICONS[p.id] ?? <Activity className="w-4 h-4" />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">{p.label}</p>
                                        <p className="text-xs text-slate-400">{p.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex-grow h-2 bg-slate-200 rounded-full overflow-hidden">
                                        <div className={`h-full ${barColorClass} rounded-full transition-all duration-700`} style={{ width: `${p.score}%` }} />
                                    </div>
                                    <span className="text-sm font-mono font-bold text-slate-600 shrink-0">{p.score}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Revenue Trend */}
            {report.revenueTrend?.length > 0 && (
                <div className="bg-white border border-slate-200 shadow-sm rounded-2xl bg-white p-6 rounded-2xl mb-8 border border-slate-200">
                    <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-600" /> 6-Month Revenue vs Expense Trend
                    </h2>
                    <div className="flex items-end gap-2 h-32">
                        {report.revenueTrend.map((rev: number, i: number) => {
                            const exp = report.expenseTrend?.[i] ?? 0;
                            const maxVal = Math.max(...report.revenueTrend, ...report.expenseTrend, 1);
                            const revH = Math.round((rev / maxVal) * 100);
                            const expH = Math.round((exp / maxVal) * 100);
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                    <div className="w-full flex items-end gap-1 h-24">
                                        <div title={`Revenue: ₹${rev.toLocaleString()}`} className="flex-1 bg-emerald-500/70 rounded-t hover:bg-emerald-400 transition-colors cursor-pointer" style={{ height: `${revH}%` }} />
                                        <div title={`Expenses: ₹${exp.toLocaleString()}`} className="flex-1 bg-red-500/50 rounded-t hover:bg-red-400 transition-colors cursor-pointer" style={{ height: `${expH}%` }} />
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-medium">M{i + 1}</p>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex gap-4 mt-3 text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-emerald-500/70 rounded" /> Revenue</span>
                        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500/50 rounded" /> Expenses</span>
                    </div>
                </div>
            )}

            <div className="text-center text-xs text-slate-400 font-bold mt-8">
                Powered by InVolution AI Health Engine · {new Date(report.generatedAt).toLocaleString()}
            </div>
        </div>
    );
}
