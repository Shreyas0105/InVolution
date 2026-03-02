"use client";

import Link from "next/link";
import { FileText, MessageSquare, TrendingUp, Download, Eye, Clock } from "lucide-react";

// Mock Data for Investor Dashboard
const AGREEMENTS = [
    { id: "AGR-9281", startup: "HealthSync Inc.", date: "Feb 21, 2026", amount: "₹ 50,00,000", equity: "10.0%", status: "Executed" },
    { id: "AGR-8342", startup: "EcoGrid", date: "Jan 15, 2026", amount: "₹ 1,00,00,000", equity: "8.5%", status: "Executed" },
];

const ACTIVE_CHATS = [
    { id: 1, startup: "PayFlow", lastMessage: "Let's align on the valuation for the seed round...", time: "2 hours ago", unread: 2 },
    { id: 2, startup: "EduVerse", lastMessage: "We have updated the pitch deck with Q4 metrics.", time: "1 day ago", unread: 0 },
];

export default function InvestorDashboard() {
    return (
        <div className="container mx-auto px-6 py-12 max-w-7xl min-h-[calc(100vh-80px)]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-outfit font-bold text-white mb-2">My Portfolio & Dashboard</h1>
                    <p className="text-slate-400 font-inter">Manage your investments, active negotiations, and legal documents.</p>
                </div>
                <Link href="/investors/search" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors">
                    Discover Startups
                </Link>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">

                {/* Left Column: Signed Agreements (History) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-panel p-6 rounded-2xl">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
                            <FileText className="w-5 h-5 text-indigo-400" /> Executed Agreements
                        </h2>

                        <div className="space-y-4">
                            {AGREEMENTS.map((agr) => (
                                <div key={agr.id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-indigo-500/30 transition-colors">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="font-bold text-white font-outfit text-lg">{agr.startup}</h3>
                                            <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] font-bold uppercase rounded-full tracking-wider">
                                                {agr.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-400 flex items-center gap-4">
                                            <span>Ref: {agr.id}</span>
                                            <span>Date: {agr.date}</span>
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-6 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t border-slate-800 md:border-none justify-between md:justify-end">
                                        <div className="text-right">
                                            <p className="text-xs text-slate-500 mb-0.5">Investment</p>
                                            <p className="font-mono text-white font-semibold">{agr.amount}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-slate-500 mb-0.5">Equity</p>
                                            <p className="font-mono text-white font-semibold">{agr.equity}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/messages/agreement?startup=${encodeURIComponent(agr.startup)}&amount=${encodeURIComponent(agr.amount)}&equity=${encodeURIComponent(agr.equity)}&signature=John+Doe`}
                                                className="p-2 bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white rounded-lg transition-colors group"
                                                title="View Document"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                            {/* In a real app, this would trigger a PDF blob download. Here it takes them to the printable view where they can 'Save as PDF' */}
                                            <Link
                                                href={`/messages/agreement?startup=${encodeURIComponent(agr.startup)}&amount=${encodeURIComponent(agr.amount)}&equity=${encodeURIComponent(agr.equity)}&signature=John+Doe`}
                                                className="p-2 bg-slate-800 hover:bg-pink-600 text-slate-300 hover:text-white rounded-lg transition-colors"
                                                title="Download PDF"
                                            >
                                                <Download className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Active Portfolio Stats */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
                            <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Total Deployed Capital</p>
                                <p className="text-2xl font-bold font-mono text-white">₹ 1.5Cr</p>
                            </div>
                        </div>
                        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
                            <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center">
                                <ShieldCheck className="w-6 h-6 text-pink-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Active Startups</p>
                                <p className="text-2xl font-bold font-mono text-white">2 Companies</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Active Deal Rooms */}
                <div className="lg:col-span-1">
                    <div className="glass-panel p-6 rounded-2xl h-full">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
                            <MessageSquare className="w-5 h-5 text-pink-400" /> Active Negotiations
                        </h2>

                        <div className="space-y-4">
                            {ACTIVE_CHATS.map((chat) => (
                                <Link href="/messages" key={chat.id} className="block bg-slate-900/50 hover:bg-slate-800 border border-slate-800 hover:border-slate-600 rounded-xl p-4 transition-all group">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-white group-hover:text-pink-400 transition-colors">{chat.startup}</h3>
                                        <span className="text-xs text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {chat.time}</span>
                                    </div>
                                    <p className="text-sm text-slate-400 line-clamp-2 mb-3">{chat.lastMessage}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-medium text-indigo-400">Continue Deal Room &rarr;</span>
                                        {chat.unread > 0 && (
                                            <span className="w-5 h-5 bg-pink-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                                                {chat.unread}
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            ))}

                            {ACTIVE_CHATS.length === 0 && (
                                <div className="text-center py-8 opacity-50">
                                    <MessageSquare className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                                    <p className="text-slate-400 text-sm">No active negotiations.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
// Local import for ShieldCheck to fix undefined error
import { ShieldCheck } from "lucide-react";
