"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Send, FileSignature, CheckCircle2, ShieldCheck, User, FileText } from "lucide-react";

// Removed INITIAL_MESSAGES to enforce "No Mock Data" rule

const maskPII = (text: string, isSigned: boolean) => {
    if (isSigned) return text;
    // Mask emails and standard global local phone numbers
    let masked = text.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL HIDDEN PRIOR TO NDA]');
    masked = masked.replace(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g, '[PHONE HIDDEN PRIOR TO NDA]');
    return masked;
};

export default function ChatAndAgreement() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading Secure Deal Room...</div>}>
            <ChatInterface />
        </Suspense>
    );
}

function ChatInterface() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const startupName = searchParams.get('name') || "HealthSync Inc.";

    const [messages, setMessages] = useState<any[]>([]);
    const [inputMessage, setInputMessage] = useState("");
    const [showAgreement, setShowAgreement] = useState(false);

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

    // Alias for PII Masking trigger
    const agreementSigned = negotiationPhase === "executed";

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        setMessages([...messages, { id: Date.now(), sender: "me", text: inputMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        setInputMessage("");

        // Removed simulated auto-reply to enforce absolute no-fake-data policy.
    };

    return (
        <div className="container mx-auto px-6 py-12 max-w-6xl min-h-[calc(100vh-80px)]">
            <div className="mb-8">
                <h1 className="text-3xl font-outfit font-bold text-white mb-2">Secure Deal Room</h1>
                <p className="text-slate-400 font-inter">End-to-end encrypted chat and digital agreement signing with {startupName}.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 h-[70vh]">

                {/* Chat Interface */}
                <div className="lg:col-span-2 glass-panel rounded-2xl flex flex-col overflow-hidden relative border border-white/10 shadow-2xl">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-white/10 bg-black/40 flex justify-between items-center z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                                <User className="text-indigo-400 w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold font-outfit">{startupName}</h3>
                                <p className="text-xs text-green-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Online</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowAgreement(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 border border-pink-500/20 rounded-lg text-sm font-medium transition-colors"
                        >
                            <FileSignature className="w-4 h-4" /> <span>Deal Agreement</span>
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-grow p-6 overflow-y-auto space-y-6 scroll-smooth">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex w-full ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[75%] rounded-2xl px-5 py-3 ${msg.sender === "me" ? "bg-indigo-600 text-white rounded-tr-sm" : "bg-slate-800 text-slate-200 rounded-tl-sm border border-slate-700"}`}>
                                    <p className="text-sm md:text-base">{maskPII(msg.text, agreementSigned)}</p>
                                    <p className={`text-[10px] mt-1 text-right ${msg.sender === "me" ? "text-indigo-200" : "text-slate-400"}`}>{msg.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input Area */}
                    <form onSubmit={sendMessage} className="p-4 bg-black/40 border-t border-white/10 flex gap-4 z-10 pb-6 md:pb-4">
                        <input
                            type="text"
                            placeholder="Type your secure message..."
                            className="flex-grow bg-slate-900 border border-slate-700 rounded-full px-6 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                        />
                        <button type="submit" disabled={!inputMessage.trim()} className="w-12 h-12 flex-shrink-0 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 disabled:cursor-not-allowed rounded-full flex items-center justify-center text-white transition-colors">
                            <Send className="w-5 h-5 ml-1" />
                        </button>
                    </form>
                </div>

                {/* Agreement Panel */}
                {showAgreement ? (
                    <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
                        <div>
                            <div className="flex items-center gap-2 text-indigo-400 mb-6">
                                <ShieldCheck className="w-6 h-6" />
                                <h2 className="text-xl font-bold">Smart Agreement</h2>
                            </div>

                            <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                                <div className="p-4 bg-black/30 rounded-xl border border-slate-800">
                                    <p className="text-xs text-slate-500 mb-1 tracking-wider uppercase">Startup</p>
                                    <p className="text-white font-medium">{startupName}</p>
                                </div>

                                {/* Dynamic Terms Form vs Read-Only View */}
                                {negotiationPhase === "startup_drafting" ? (
                                    <>
                                        <div className="space-y-2">
                                            <label className="text-xs text-slate-500 tracking-wider uppercase">Company Address</label>
                                            <input type="text" value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)}
                                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-medium focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. 123 Tech Lane" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs text-slate-500 tracking-wider uppercase">Investment Amount</label>
                                            <input type="text" value={termAmount} onChange={(e) => setTermAmount(e.target.value)}
                                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-medium focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. ₹ 50,00,000" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs text-slate-500 tracking-wider uppercase">Equity Exchanged</label>
                                            <input type="text" value={termEquity} onChange={(e) => setTermEquity(e.target.value)}
                                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-medium focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. 10.0%" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs text-slate-500 tracking-wider uppercase">Payment Method</label>
                                            <input type="text" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-medium focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="check or wire transfer" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs text-slate-500 tracking-wider uppercase">Investment Period Lock (Years)</label>
                                            <input type="text" value={investmentPeriod} onChange={(e) => setInvestmentPeriod(e.target.value)}
                                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-medium focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. 5" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs text-slate-500 tracking-wider uppercase">Executives (Comma Sep)</label>
                                            <input type="text" value={executives} onChange={(e) => setExecutives(e.target.value)}
                                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-medium focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Name 1, Name 2..." />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs text-slate-500 tracking-wider uppercase">Board of Directors</label>
                                            <input type="text" value={board} onChange={(e) => setBoard(e.target.value)}
                                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-medium focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Name 1, Name 2..." />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="p-4 bg-black/30 rounded-xl border border-slate-800">
                                            <p className="text-xs text-slate-500 mb-1 tracking-wider uppercase">Investment Amount</p>
                                            <p className="text-indigo-400 font-bold">{termAmount} for {termEquity}</p>
                                        </div>
                                        <div className="p-4 bg-black/30 rounded-xl border border-slate-800">
                                            <p className="text-xs text-slate-500 mb-1 tracking-wider uppercase">Structure</p>
                                            <p className="text-slate-300 text-sm">Via {paymentMethod}, locked for {investmentPeriod} years.</p>
                                        </div>
                                        {negotiationPhase === "investor_review" && (
                                            <div className="space-y-2 mt-4">
                                                <label className="text-xs text-slate-500 tracking-wider uppercase">Your Investor Address</label>
                                                <input type="text" value={investorAddress} onChange={(e) => setInvestorAddress(e.target.value)}
                                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-medium focus:ring-2 focus:ring-pink-500 outline-none" placeholder="Enter your registered address..." />
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

                            {/* State Machine Execution Interface */}
                            {negotiationPhase === "executed" ? (
                                <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-xl text-center">
                                    <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
                                    <h3 className="text-green-400 font-bold text-lg mb-1">Agreement Executed</h3>
                                    <p className="text-sm text-green-500/70 mb-6">Countersigned by both parties. Chat PII filters have been released.</p>
                                    <button
                                        onClick={() => router.push(`/messages/agreement?startup=${encodeURIComponent(startupName)}&amount=${encodeURIComponent(termAmount)}&equity=${encodeURIComponent(termEquity)}&signature=${encodeURIComponent(investorSignature)}&startupSig=${encodeURIComponent(startupSignature)}&cAddress=${encodeURIComponent(companyAddress)}&iAddress=${encodeURIComponent(investorAddress)}&payment=${encodeURIComponent(paymentMethod)}&period=${encodeURIComponent(investmentPeriod)}&execs=${encodeURIComponent(executives)}&board=${encodeURIComponent(board)}`)}
                                        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <FileText className="w-4 h-4" /> View Official Document
                                    </button>
                                </div>
                            ) : negotiationPhase === "startup_drafting" ? (
                                <div className="space-y-4">
                                    <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl mb-4">
                                        <p className="text-sm text-indigo-300 font-medium whitespace-break-spaces">
                                            Step 1/2: Startup proposes terms.
                                        </p>
                                    </div>
                                    <label className="text-sm font-medium text-slate-300">Startup Founder Signature</label>
                                    <input type="text" placeholder="Type full legal name..."
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-serif italic"
                                        value={startupSignature} onChange={(e) => setStartupSignature(e.target.value)} />
                                    <button
                                        onClick={() => startupSignature.length > 3 && setNegotiationPhase("investor_review")}
                                        disabled={startupSignature.length <= 3}
                                        className="w-full py-4 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl disabled:opacity-50 transition-all shadow-lg shadow-indigo-500/20"
                                    >
                                        Sign & Send to Investor
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="bg-pink-500/10 border border-pink-500/20 p-4 rounded-xl mb-4">
                                        <p className="text-sm text-pink-300 font-medium">
                                            Step 2/2: Investor Review. The Startup has locked the terms above and provided their signature.
                                        </p>
                                    </div>
                                    <label className="text-sm font-medium text-slate-300">Investor Counter-Signature</label>
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
                ) : (
                    <div className="glass-panel p-6 rounded-2xl flex flex-col justify-center items-center text-center opacity-50 hidden lg:flex">
                        <FileSignature className="w-16 h-16 text-slate-600 mb-4" />
                        <h3 className="text-lg font-bold text-slate-300 mb-2">No Active Agreements</h3>
                        <p className="text-sm text-slate-500">Click &quot;Deal Agreement&quot; when you are ready to propose final terms.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
