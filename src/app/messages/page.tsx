"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Send, FileSignature, CheckCircle2, ShieldCheck, User, FileText, ChevronRight, Video, Calendar, Clock, AlertTriangle, PlayCircle, CheckSquare, Search, Lock } from "lucide-react";

const maskPII = (text: string, isSigned: boolean) => {
    if (isSigned) return text;
    // Mask emails and standard global local phone numbers
    let masked = text.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL HIDDEN PRIOR TO NDA]');
    masked = masked.replace(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g, '[PHONE HIDDEN PRIOR TO NDA]');
    return masked;
};

export default function DealWorkspacePage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Authenticating Secure Workspace...</div>}>
            <DealWorkspace />
        </Suspense>
    );
}

function DealWorkspace() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const startupName = searchParams.get('name') || "HealthSync Inc.";

    const [activeTab, setActiveTab] = useState<"chat" | "trust" | "diligence" | "agreement">("chat");
    const [currentPhase, setCurrentPhase] = useState<number>(3); // Set to 3 to demonstrate meeting creation. 1 = Identity, 2 = Pitch, 3 = Meets, 4 = DD, 5 = Agree

    const [messages, setMessages] = useState<any[]>([]);
    const [inputMessage, setInputMessage] = useState("");

    const [meetings, setMeetings] = useState<any[]>([]);
    const [meetingDate, setMeetingDate] = useState("");
    const [meetingTime, setMeetingTime] = useState("");
    const [meetingType, setMeetingType] = useState("Intro Meeting");

    // Dual-Party Agreement State Machine
    const [negotiationPhase, setNegotiationPhase] = useState<"startup_drafting" | "investor_review" | "executed">("startup_drafting");
    const [termAmount, setTermAmount] = useState("₹ 50,00,000");
    const [termEquity, setTermEquity] = useState("10.0%");
    const [companyAddress, setCompanyAddress] = useState("123 Tech Lane, BLR");
    const [paymentMethod, setPaymentMethod] = useState("wire transfer");
    const [investmentPeriod, setInvestmentPeriod] = useState("5");
    const [executives, setExecutives] = useState("Arjun CEO, Maya CTO, Raj CFO");
    const [board, setBoard] = useState("Amit Investor, Sarah Board, David Admin");

    const [investorAddress, setInvestorAddress] = useState("");
    const [startupSignature, setStartupSignature] = useState("");
    const [investorSignature, setInvestorSignature] = useState("");

    const agreementSigned = negotiationPhase === "executed";

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        setMessages([...messages, { id: Date.now(), sender: "me", text: inputMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        setInputMessage("");
    };

    const scheduleMeeting = (e: React.FormEvent) => {
        e.preventDefault();
        if (!meetingDate || !meetingTime) return;

        const newMeeting = {
            id: Date.now(),
            title: meetingType,
            date: meetingDate,
            time: meetingTime,
            link: `https://meet.google.com/new?hs=122&authuser=0`, // Forces new meet generation
            status: "Scheduled"
        };

        setMeetings([...meetings, newMeeting]);
        setMeetingDate("");
        setMeetingTime("");
    };

    const phases = [
        { num: 1, title: "Identity & Verification", desc: "Profile & KYC Verified", icon: ShieldCheck },
        { num: 2, title: "Pitch & Initial Interest", desc: "Startup Discovery", icon: Search },
        { num: 3, title: "Secure Meetings", desc: "Trust Building", icon: Video },
        { num: 4, title: "Due Diligence", desc: "Financial Audit & AI", icon: CheckSquare },
        { num: 5, title: "Agreement & Funding", desc: "Term Sheet Executed", icon: FileSignature },
    ];

    return (
        <div className="container mx-auto px-6 py-8 max-w-7xl min-h-[calc(100vh-80px)] flex flex-col">
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-outfit font-bold text-white mb-2 flex items-center gap-3">
                        <Lock className="w-6 h-6 text-emerald-400" /> Secure Deal Workspace
                        <span className="text-sm px-3 py-1 bg-white/10 rounded-full font-medium text-slate-300 ml-2 border border-white/5">with {startupName}</span>
                    </h1>
                    <p className="text-slate-400 font-inter">End-to-end encrypted negotiation and 5-phase investment lifecycle tracking.</p>
                </div>

                {currentPhase < 5 && (
                    <button
                        onClick={() => setCurrentPhase(Math.min(5, currentPhase + 1))}
                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors shadow-lg shadow-indigo-500/25 flex items-center gap-2"
                    >
                        Advance to Phase {currentPhase + 1} <ChevronRight className="w-4 h-4" />
                    </button>
                )}
            </div>

            <div className="flex flex-col lg:flex-row gap-6 flex-grow h-full max-h-[75vh]">

                {/* Visual Tracker Sidebar */}
                <div className="lg:w-1/4 glass-panel rounded-2xl p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar border border-white/10 shadow-xl">
                    <h3 className="text-lg font-bold text-white border-b border-white/10 pb-4">Deal Lifecycle</h3>

                    <div className="flex flex-col gap-4 relative mt-2">
                        {/* Connecting Line */}
                        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-slate-800 z-0"></div>

                        {phases.map((phase) => {
                            const isPast = phase.num < currentPhase;
                            const isCurrent = phase.num === currentPhase;
                            const isLocked = phase.num > currentPhase;

                            const Icon = phase.icon;

                            return (
                                <div key={phase.num} className={`relative z-10 flex gap-4 ${isLocked ? 'opacity-40 grayscale' : ''}`}>
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 relative overflow-hidden transition-all duration-300 ${isPast ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : isCurrent ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)] border-2 border-indigo-400' : 'bg-slate-800 text-slate-500 border border-slate-700'}`}>
                                        {isPast ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-5 h-5" />}
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <p className="text-[10px] font-bold tracking-wider uppercase text-slate-500 mb-0.5">Phase {phase.num}</p>
                                        <h4 className={`text-sm font-bold ${isCurrent ? 'text-indigo-300' : 'text-slate-200'}`}>{phase.title}</h4>
                                        <p className="text-xs text-slate-400">{phase.desc}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:w-3/4 flex flex-col gap-6">

                    {/* Navigation Tabs */}
                    <div className="glass-panel p-2 rounded-xl flex gap-2 border border-white/10 w-fit shrink-0 overflow-x-auto">
                        <button onClick={() => setActiveTab("chat")} className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === "chat" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"}`}>
                            Message Room
                        </button>
                        <button onClick={() => setActiveTab("trust")} className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === "trust" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"} ${currentPhase < 3 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            Trust Building <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-[10px] text-indigo-300">Phase 3</span>
                        </button>
                        <button onClick={() => setActiveTab("diligence")} className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === "diligence" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"} ${currentPhase < 4 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            Due Diligence <span className="px-2 py-0.5 rounded bg-amber-500/20 text-[10px] text-amber-300">Phase 4</span>
                        </button>
                        <button onClick={() => setActiveTab("agreement")} className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === "agreement" ? "bg-pink-500/20 text-pink-300 border border-pink-500/30" : "text-slate-400 hover:text-white"} ${currentPhase < 5 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            Smart Agreement <span className="px-2 py-0.5 rounded bg-pink-500/20 text-[10px] text-pink-300 truncate">Phase 5</span>
                        </button>
                    </div>

                    {/* Tab Views */}
                    <div className="glass-panel rounded-2xl flex-grow overflow-hidden relative border border-white/10 shadow-2xl flex flex-col">

                        {/* === CHAT TAB === */}
                        {activeTab === "chat" && (
                            <>
                                <div className="px-6 py-4 border-b border-white/10 bg-black/40 flex items-center gap-3 z-10 shrink-0">
                                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                                        <User className="text-indigo-400 w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold font-outfit">{startupName}</h3>
                                        <p className="text-xs text-green-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Encrypted P2P Connection</p>
                                    </div>
                                </div>
                                <div className="flex-grow p-6 overflow-y-auto space-y-6 scroll-smooth custom-scrollbar">
                                    <div className="bg-orange-500/10 border border-orange-500/20 text-orange-400/80 p-3 rounded-lg text-xs text-center mx-auto max-w-md">
                                        Notice: PII (Phones, Emails) are masked within this room to enforce platform NDAs until Phase 5 (Agreement Execution).
                                    </div>
                                    {messages.map((msg) => (
                                        <div key={msg.id} className={`flex w-full ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                                            <div className={`max-w-[75%] rounded-2xl px-5 py-3 ${msg.sender === "me" ? "bg-indigo-600 text-white rounded-tr-sm" : "bg-slate-800 text-slate-200 rounded-tl-sm border border-slate-700"}`}>
                                                <p className="text-sm md:text-base">{maskPII(msg.text, agreementSigned)}</p>
                                                <p className={`text-[10px] mt-1 text-right ${msg.sender === "me" ? "text-indigo-200" : "text-slate-400"}`}>{msg.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <form onSubmit={sendMessage} className="p-4 bg-black/40 border-t border-white/10 flex gap-4 shrink-0">
                                    <input
                                        type="text"
                                        placeholder="Type your secure message..."
                                        className="flex-grow bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                        value={inputMessage}
                                        onChange={(e) => setInputMessage(e.target.value)}
                                    />
                                    <button type="submit" disabled={!inputMessage.trim()} className="w-12 h-12 flex-shrink-0 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 disabled:cursor-not-allowed rounded-lg flex items-center justify-center text-white transition-colors">
                                        <Send className="w-5 h-5 ml-1" />
                                    </button>
                                </form>
                            </>
                        )}


                        {/* === TRUST BUILDING TAB === */}
                        {activeTab === "trust" && currentPhase >= 3 && (
                            <div className="p-8 h-full overflow-y-auto custom-scrollbar flex flex-col md:flex-row gap-8">
                                <div className="md:w-1/2 space-y-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-2"><Video className="text-indigo-400" /> Trust Building Meetings</h2>
                                        <p className="text-slate-400 text-sm leading-relaxed">
                                            Establish mutual alignment through short, structured Google Meet sessions.
                                            To prevent fatigue and focus on high-value interactions, these meetings are strictly constrained to <strong>10 minutes</strong>.
                                        </p>
                                    </div>

                                    <form onSubmit={scheduleMeeting} className="bg-slate-900/50 border border-white/10 p-6 rounded-2xl space-y-4">
                                        <h3 className="text-white font-semibold">Propose a 10-Min Session</h3>
                                        <div className="space-y-2">
                                            <label className="text-xs text-slate-400 uppercase tracking-wider">Session Type</label>
                                            <select className="w-full bg-black/50 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                                value={meetingType} onChange={(e) => setMeetingType(e.target.value)}>
                                                <option>Intro Meeting</option>
                                                <option>Deep-Dive Discussion</option>
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs text-slate-400 uppercase tracking-wider">Select Date</label>
                                                <input type="date" className="w-full bg-black/50 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none [color-scheme:dark]"
                                                    value={meetingDate} onChange={(e) => setMeetingDate(e.target.value)} required />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs text-slate-400 uppercase tracking-wider">Select Time</label>
                                                <input type="time" className="w-full bg-black/50 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none [color-scheme:dark]"
                                                    value={meetingTime} onChange={(e) => setMeetingTime(e.target.value)} required />
                                            </div>
                                        </div>
                                        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3 flex gap-3 mt-2">
                                            <Clock className="min-w-5 w-5 h-5 text-indigo-400 shrink-0" />
                                            <p className="text-xs text-indigo-300 leading-tight">By scheduling this, a dedicated Google Meet link will be generated. Both parties must honor the 10-minute hard stop to maintain platform trust scores.</p>
                                        </div>
                                        <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors mt-2">
                                            Schedule & Generate Meet Link
                                        </button>
                                    </form>
                                </div>

                                <div className="md:w-1/2 space-y-4">
                                    <h3 className="text-white font-semibold border-b border-white/10 pb-4">Scheduled Sessions</h3>
                                    {meetings.length === 0 ? (
                                        <div className="py-12 text-center opacity-50 border border-dashed border-white/20 rounded-2xl">
                                            <Calendar className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                                            <p className="text-sm text-slate-400">No trust sessions verified yet.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {meetings.map((m) => (
                                                <div key={m.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-indigo-500/50 transition-colors">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                                                            <h4 className="text-white font-bold text-sm">{m.title}</h4>
                                                            <span className="px-2 py-0.5 bg-white/5 rounded text-[10px] text-slate-400">10 Min Stop</span>
                                                        </div>
                                                        <p className="text-xs text-slate-400 flex items-center gap-1"><Calendar className="w-3 h-3" /> {m.date} at {m.time}</p>
                                                    </div>
                                                    <a href={m.link} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-slate-900 border border-slate-700 hover:bg-slate-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 whitespace-nowrap transition-colors">
                                                        <PlayCircle className="w-4 h-4 text-emerald-400" /> Join Meet
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        {activeTab === "trust" && currentPhase < 3 && (
                            <div className="flex-grow flex items-center justify-center p-8 text-center bg-[url('https://www.transparenttextures.com/patterns/diagonal-striped-brick.png')]">
                                <div className="bg-black/80 p-8 rounded-2xl backdrop-blur-sm border border-white/10 max-w-sm">
                                    <Lock className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                                    <h3 className="text-lg font-bold text-white mb-2">Phase 3 Lock</h3>
                                    <p className="text-sm text-slate-400">Advance the deal lifecycle to Phase 3 to unlock Trust Building meetings.</p>
                                </div>
                            </div>
                        )}

                        {/* === DUE DILIGENCE TAB === */}
                        {activeTab === "diligence" && currentPhase >= 4 && (
                            <div className="p-8 h-full overflow-y-auto custom-scrollbar">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-6"><CheckSquare className="text-amber-400" /> Due Diligence Portal</h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-slate-900/50 border border-white/10 p-6 rounded-2xl">
                                        <h3 className="text-white font-semibold mb-4 border-b border-white/10 pb-2">Financial Audit Check</h3>
                                        <div className="space-y-3">
                                            <label className="flex items-center gap-3 p-3 bg-black/40 rounded-lg cursor-pointer hover:bg-black/60 transition-colors border border-transparent hover:border-white/5">
                                                <input type="checkbox" className="w-4 h-4 rounded border-slate-700 text-indigo-600 focus:ring-indigo-600 focus:ring-offset-slate-900 bg-slate-800" />
                                                <span className="text-sm text-slate-200">Revenue Statements Authenticated</span>
                                            </label>
                                            <label className="flex items-center gap-3 p-3 bg-black/40 rounded-lg cursor-pointer hover:bg-black/60 transition-colors border border-transparent hover:border-white/5">
                                                <input type="checkbox" className="w-4 h-4 rounded border-slate-700 text-indigo-600 focus:ring-indigo-600 focus:ring-offset-slate-900 bg-slate-800" />
                                                <span className="text-sm text-slate-200">Burn Rate Anomalies Cleared</span>
                                            </label>
                                            <label className="flex items-center gap-3 p-3 bg-black/40 rounded-lg cursor-pointer hover:bg-black/60 transition-colors border border-transparent hover:border-white/5">
                                                <input type="checkbox" className="w-4 h-4 rounded border-slate-700 text-indigo-600 focus:ring-indigo-600 focus:ring-offset-slate-900 bg-slate-800" />
                                                <span className="text-sm text-slate-200">Cap Table Verified</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="bg-slate-900/50 border border-amber-500/20 p-6 rounded-2xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-bl-full -mr-8 -mt-8"></div>
                                        <h3 className="text-white font-semibold mb-4 border-b border-amber-500/20 pb-2">AI Credibility Report</h3>
                                        <div className="flex items-center justify-center p-6">
                                            <div className="text-center">
                                                <span className="text-[3rem] font-bold text-amber-400 font-mono leading-none">A+</span>
                                                <p className="text-sm text-slate-300 mt-2 font-medium">InVolution Risk AI passed</p>
                                                <p className="text-xs text-slate-500 mt-1">Cross-referenced with 50+ data registries.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === "diligence" && currentPhase < 4 && (
                            <div className="flex-grow flex items-center justify-center p-8 text-center bg-[url('https://www.transparenttextures.com/patterns/diagonal-striped-brick.png')]">
                                <div className="bg-black/80 p-8 rounded-2xl backdrop-blur-sm border border-white/10 max-w-sm">
                                    <Lock className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                                    <h3 className="text-lg font-bold text-white mb-2">Phase 4 Lock</h3>
                                    <p className="text-sm text-slate-400">Advance the deal lifecycle to Phase 4 to unlock Due Diligence checklists.</p>
                                </div>
                            </div>
                        )}

                        {/* === AGREEMENT TAB === */}
                        {activeTab === "agreement" && currentPhase >= 5 && (
                            <div className="p-8 h-full overflow-y-auto custom-scrollbar flex flex-col md:flex-row gap-8 bg-[#151322]">
                                <div className="md:w-1/2 space-y-4">
                                    <div className="flex items-center gap-2 text-pink-400 mb-2">
                                        <ShieldCheck className="w-6 h-6" />
                                        <h2 className="text-xl font-bold">Smart Agreement</h2>
                                    </div>
                                    <p className="text-xs text-slate-400 mb-6 border-b border-white/10 pb-4">Entering the final stage. The terms established here will be deployed to a legally binding digital contract.</p>

                                    {/* Dynamic Terms Form vs Read-Only View */}
                                    <div className="space-y-4">
                                        {negotiationPhase === "startup_drafting" ? (
                                            <>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Invest Amount</label>
                                                        <input type="text" value={termAmount} onChange={(e) => setTermAmount(e.target.value)}
                                                            className="w-full bg-black/40 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-pink-500 outline-none" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Equity Exch.</label>
                                                        <input type="text" value={termEquity} onChange={(e) => setTermEquity(e.target.value)}
                                                            className="w-full bg-black/40 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-pink-500 outline-none" />
                                                    </div>
                                                </div>

                                                <div className="space-y-1">
                                                    <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Payment Method</label>
                                                    <input type="text" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}
                                                        className="w-full bg-black/40 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-pink-500 outline-none" />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Company Address</label>
                                                    <input type="text" value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)}
                                                        className="w-full bg-black/40 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-pink-500 outline-none" />
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="p-4 bg-black/30 rounded-xl border border-slate-800">
                                                    <p className="text-xs text-slate-500 mb-1 tracking-wider uppercase">Final Terms</p>
                                                    <p className="text-pink-400 font-bold">{termAmount} for {termEquity}</p>
                                                    <p className="text-slate-400 text-xs mt-1">Via {paymentMethod}, locked for {investmentPeriod} years.</p>
                                                </div>
                                                {negotiationPhase === "investor_review" && (
                                                    <div className="space-y-2 mt-4">
                                                        <label className="text-xs text-slate-500 tracking-wider uppercase">Your Investor Address</label>
                                                        <input type="text" value={investorAddress} onChange={(e) => setInvestorAddress(e.target.value)}
                                                            className="w-full bg-black/40 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-pink-500 outline-none" placeholder="Enter your registered address..." />
                                                    </div>
                                                )}
                                                {negotiationPhase === "executed" && (
                                                    <div className="p-4 bg-black/30 rounded-xl border border-slate-800">
                                                        <p className="text-xs text-slate-500 mb-1 tracking-wider uppercase">Investor Details</p>
                                                        <p className="text-slate-300 text-sm">{investorAddress}</p>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="md:w-1/2 border-l border-white/5 pl-0 md:pl-8 flex flex-col justify-center">
                                    {negotiationPhase === "executed" ? (
                                        <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-2xl text-center">
                                            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                                            <h3 className="text-emerald-400 font-bold text-xl mb-2">Deal Executed Successfully</h3>
                                            <p className="text-sm text-emerald-500/70 mb-8 border-b border-emerald-500/10 pb-6">Countersigned by both parties. The investment round is finalized.</p>
                                            <button
                                                onClick={() => router.push(`/messages/agreement?startup=${encodeURIComponent(startupName)}&amount=${encodeURIComponent(termAmount)}&equity=${encodeURIComponent(termEquity)}&signature=${encodeURIComponent(investorSignature)}&startupSig=${encodeURIComponent(startupSignature)}&cAddress=${encodeURIComponent(companyAddress)}&iAddress=${encodeURIComponent(investorAddress)}&payment=${encodeURIComponent(paymentMethod)}&period=${encodeURIComponent(investmentPeriod)}&execs=${encodeURIComponent(executives)}&board=${encodeURIComponent(board)}`)}
                                                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-600/20"
                                            >
                                                <FileText className="w-5 h-5" /> View Official Term Sheet
                                            </button>
                                        </div>
                                    ) : negotiationPhase === "startup_drafting" ? (
                                        <div className="space-y-4">
                                            <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl mb-6">
                                                <p className="text-sm text-indigo-300 font-medium">Step 1/2: Startup proposes final binding terms.</p>
                                            </div>
                                            <label className="text-xs tracking-wider uppercase font-medium text-slate-400">Startup Founder Signature</label>
                                            <input type="text" placeholder="Type full legal name..."
                                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-serif italic"
                                                value={startupSignature} onChange={(e) => setStartupSignature(e.target.value)} />
                                            <button
                                                onClick={() => startupSignature.length > 3 && setNegotiationPhase("investor_review")}
                                                disabled={startupSignature.length <= 3}
                                                className="w-full py-4 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl disabled:opacity-50 transition-all shadow-lg shadow-indigo-500/20"
                                            >
                                                Sign & Lock Terms
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="bg-pink-500/10 border border-pink-500/20 p-4 rounded-xl mb-6">
                                                <p className="text-sm text-pink-300 font-medium whitespace-break-spaces">
                                                    Step 2/2: Investor Review. The Startup has locked the terms and provided a digital signature.
                                                </p>
                                            </div>
                                            <label className="text-xs tracking-wider uppercase font-medium text-slate-400">Investor Counter-Signature</label>
                                            <input type="text" placeholder="Type full legal name..."
                                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 font-serif italic"
                                                value={investorSignature} onChange={(e) => setInvestorSignature(e.target.value)} />
                                            <button
                                                onClick={() => investorSignature.length > 3 && setNegotiationPhase("executed")}
                                                disabled={investorSignature.length <= 3}
                                                className="w-full py-4 mt-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-xl disabled:opacity-50 transition-all shadow-lg shadow-pink-500/20"
                                            >
                                                Counter-Sign & Execute Deal
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        {activeTab === "agreement" && currentPhase < 5 && (
                            <div className="flex-grow flex items-center justify-center p-8 text-center bg-[url('https://www.transparenttextures.com/patterns/diagonal-striped-brick.png')]">
                                <div className="bg-black/80 p-8 rounded-2xl backdrop-blur-sm border border-white/10 max-w-sm">
                                    <Lock className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                                    <h3 className="text-lg font-bold text-white mb-2">Phase 5 Lock</h3>
                                    <p className="text-sm text-slate-400">Advance the deal lifecycle to Phase 5 to unlock the final Smart Agreement signing forms.</p>
                                </div>
                            </div>
                        )}

                    </div>
                </div>

            </div>
        </div>
    );
}
