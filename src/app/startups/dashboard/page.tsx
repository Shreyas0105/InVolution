import Link from "next/link";
import { FileText, MessageSquare, TrendingUp, Eye, CheckCircle2, ShieldCheck, Activity, Users, Star, BarChart3, Clock } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import Startup from "@/models/Startup";

// Mock Data for Startup Dashboard
const ACTIVE_DEALS = [
    { id: "DL-9921", investor: "Nexus Capital", phase: 3, lastMessage: "Let's schedule our 10-minute intro call.", time: "2 hours ago", unread: 1 },
    { id: "DL-8834", investor: "Angel Syndicate Alpha", phase: 1, lastMessage: "We are reviewing your pitch deck now.", time: "1 day ago", unread: 0 },
];

const SIGNED_AGREEMENTS = [
    { id: "AGR-7721", investor: "Elevate Ventures", date: "Jan 12, 2026", amount: "₹ 75,00,000", equity: "12.0%", status: "Secured" }
];

export default async function StartupDashboard() {
    const session = await getServerSession(authOptions);
    await dbConnect();

    // Fetch the real Startup database document using the session's email
    let myStartup = null;
    let startupId = "";
    if (session?.user?.email) {
        const doc = await Startup.findOne({ ownerEmail: session.user.email }).lean();
        if (doc) {
            myStartup = doc as any;
            startupId = doc._id.toString();
        }
    }

    return (
        <div className="container mx-auto px-6 py-12 max-w-7xl min-h-[calc(100vh-80px)]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-outfit font-bold text-white mb-2">Founder Command Center</h1>
                    <p className="text-slate-400 font-inter">Monitor your live profile performance and manage active investor negotiations.</p>
                </div>
                <Link href="/startups/publish" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2">
                    <FileText className="w-4 h-4" /> {myStartup ? "Edit Pitch Profile" : "Create Profile"}
                </Link>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">

                {/* Left Column: Live Profile Performance */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Live Stats */}
                    {myStartup ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="glass-panel p-5 rounded-2xl border border-indigo-500/20 shadow-[0_0_15px_rgba(79,70,229,0.1)]">
                                <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center mb-3">
                                    <Eye className="w-5 h-5 text-indigo-400" />
                                </div>
                                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Profile Views</p>
                                <p className="text-2xl font-bold font-mono text-white">1,492</p>
                            </div>
                            <div className="glass-panel p-5 rounded-2xl">
                                <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center mb-3">
                                    <Activity className="w-5 h-5 text-emerald-400" />
                                </div>
                                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Deal Room Saves</p>
                                <p className="text-2xl font-bold font-mono text-white">38</p>
                            </div>
                            <div className="glass-panel p-5 rounded-2xl">
                                <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center mb-3">
                                    <Star className="w-5 h-5 text-amber-400" />
                                </div>
                                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">AI Match Score</p>
                                <p className="text-2xl font-bold font-mono text-white">{myStartup.score}<span className="text-sm text-slate-500">/100</span></p>
                            </div>
                            <div className="glass-panel p-5 rounded-2xl">
                                <div className="w-10 h-10 bg-pink-500/20 rounded-full flex items-center justify-center mb-3">
                                    <Users className="w-5 h-5 text-pink-400" />
                                </div>
                                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Active Deals</p>
                                <p className="text-2xl font-bold font-mono text-white">{ACTIVE_DEALS.length}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="glass-panel p-8 rounded-2xl text-center border-dashed border-2 border-white/20">
                            <ShieldCheck className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">No Profile Found</h3>
                            <p className="text-slate-400 mb-6 max-w-sm mx-auto">You haven't published a startup profile under this email address yet. Investors cannot discover you until you do.</p>
                            <Link href="/startups/publish" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors inline-block">
                                Publish Pitch Profile
                            </Link>
                        </div>
                    )}


                    {/* Active Deals / Inbox */}
                    {myStartup && (
                        <div className="glass-panel p-6 rounded-2xl">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
                                <MessageSquare className="w-5 h-5 text-indigo-400" /> Active Investor Workspaces
                            </h2>

                            <div className="space-y-4">
                                {ACTIVE_DEALS.map((deal) => (
                                    <Link href="/messages" key={deal.id} className="block bg-slate-900/50 hover:bg-slate-800 border border-slate-800 hover:border-slate-600 rounded-xl p-5 transition-all group">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

                                            <div className="flex-grow">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="font-bold text-white text-lg group-hover:text-indigo-400 transition-colors">{deal.investor}</h3>
                                                    {deal.unread > 0 && (
                                                        <span className="px-2 py-0.5 bg-pink-500 rounded-full text-[10px] font-bold text-white">
                                                            {deal.unread} New
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-slate-400 line-clamp-1 flex items-center gap-2">
                                                    <MessageSquare className="w-3 h-3" /> {deal.lastMessage}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-4 w-full md:w-auto mt-2 md:mt-0 pt-3 md:pt-0 border-t border-slate-800 md:border-none">
                                                <div className="text-left md:text-right">
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Current Lifecycle</p>
                                                    <p className="text-sm font-semibold text-indigo-300 bg-indigo-500/10 px-3 py-1 rounded-lg border border-indigo-500/20">Phase {deal.phase}</p>
                                                </div>
                                                <div className="text-right ml-auto md:ml-0">
                                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-end gap-1"><Clock className="w-3 h-3" /> Last Activity</p>
                                                    <p className="text-sm text-slate-300 font-medium">{deal.time}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}

                                {ACTIVE_DEALS.length === 0 && (
                                    <div className="text-center py-12 opacity-50 border border-dashed border-slate-700/50 rounded-xl">
                                        <ShieldCheck className="w-8 h-8 text-slate-500 mx-auto mb-3" />
                                        <p className="text-slate-400 text-sm">No active deals yet. Ensure your pitch profile is complete and fully verified.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Historical / Info */}
                <div className="lg:col-span-1 space-y-6">

                    {/* Public Profile Link block */}
                    {myStartup && (
                        <div className="bg-gradient-to-br from-indigo-900/40 to-pink-900/40 border border-indigo-500/30 p-6 rounded-2xl relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl"></div>
                            <h3 className="text-white font-bold text-lg mb-2">Live on Network</h3>
                            <p className="text-sm text-indigo-200/70 mb-2">Your startup is currently visible in the investor search engine.</p>
                            <p className="text-xs text-white/50 mb-6 font-mono bg-black/30 p-2 rounded">/{myStartup.name}</p>
                            <Link href={`/startups/${startupId}`} className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-colors backdrop-blur-sm flex items-center justify-center gap-2 border border-white/10">
                                <Eye className="w-4 h-4" /> View Public Profile
                            </Link>
                        </div>
                    )}

                    <div className="glass-panel p-6 rounded-2xl h-full">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Secured Funding
                        </h2>

                        <div className="space-y-4">
                            {SIGNED_AGREEMENTS.map((agr) => (
                                <div key={agr.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="font-bold text-white text-sm">{agr.investor}</h3>
                                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase rounded flex items-center gap-1">
                                            <ShieldCheck className="w-3 h-3" /> {agr.status}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <div>
                                            <p className="text-xs text-slate-500 mb-0.5">Raised Capital</p>
                                            <p className="font-mono text-emerald-400 font-bold">{agr.amount}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-slate-500 mb-0.5">Equity Dilution</p>
                                            <p className="font-mono text-slate-300 font-semibold">{agr.equity}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {SIGNED_AGREEMENTS.length === 0 && (
                                <div className="text-center py-8 opacity-50">
                                    <BarChart3 className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                                    <p className="text-slate-400 text-sm">No secured funding agreements on file.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
