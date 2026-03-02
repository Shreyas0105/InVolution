import Link from 'next/link';
import { ShieldAlert, FileWarning, Scale } from 'lucide-react';

export default function RulesFAQPage() {
    return (
        <div className="container mx-auto px-6 py-24 min-h-screen">
            <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
                <h1 className="text-4xl md:text-5xl font-outfit font-bold text-white mb-6">Platform Rules & Liability</h1>
                <p className="text-xl text-slate-400 font-inter leading-relaxed">
                    To maintain a secure and legally compliant ecosystem, all users must adhere to the following strict guidelines when interacting, negotiating, and executing investment agreements.
                </p>
            </div>

            {/* 3-Column Layout Inspired by User Image */}
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">

                {/* Column 1: On-Platform Only */}
                <div className="p-8 rounded-2xl bg-black/40 border border-white/10 text-center flex flex-col items-center group hover:border-indigo-500/30 transition-colors h-full justify-center">
                    <div className="w-16 h-16 rounded-full bg-pink-500/10 text-pink-400 flex items-center justify-center mb-6 group-hover:bg-pink-500/20 transition-colors">
                        <FileWarning className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">On-Platform Agreements</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                        All Non-Disclosure Agreements (NDAs) and Investment Contracts must be drafted and executed exclusively through the secure InVolution Deal Room.
                    </p>
                </div>

                {/* Column 2: Central Highlighted Box (The "Red" Box Equivalent) */}
                <div className="p-10 rounded-2xl bg-indigo-600 border border-indigo-500 text-center flex flex-col items-center transform scale-105 shadow-2xl shadow-indigo-500/20 relative z-10 h-full justify-center">
                    <div className="w-20 h-20 rounded-full bg-white/10 text-white flex items-center justify-center mb-6">
                        <ShieldAlert className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">Zero Liability Policy</h3>
                    <p className="text-indigo-100 text-sm leading-relaxed mb-8">
                        InVolution holds absolutely <strong>zero liability</strong> for any negotiations, fund transfers, or agreements conducted outside of the platform. If you bypass our Deal Room, you forfeit all platform protections and dispute resolution protocols.
                    </p>
                    <Link href="/messages" className="px-8 py-3 bg-white text-indigo-600 font-bold rounded-sm hover:bg-slate-100 transition-colors shadow-lg uppercase tracking-wider text-sm">
                        Go to Deal Room
                    </Link>
                </div>

                {/* Column 3: Legal Compliance */}
                <div className="p-8 rounded-2xl bg-black/40 border border-white/10 text-center flex flex-col items-center group hover:border-indigo-500/30 transition-colors h-full justify-center">
                    <div className="w-16 h-16 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 transition-colors">
                        <Scale className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">Legal Compliance</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                        By using InVolution, you agree to our rigorous KYC/AML checks. Any attempt to supply fraudulent identities or bypass legal restrictions will result in immediate termination.
                    </p>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="max-w-4xl mx-auto mt-24 space-y-8 animate-fade-in-up delay-200">
                <h2 className="text-3xl font-outfit font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>

                <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors">
                    <h4 className="text-lg font-bold text-indigo-400 mb-2">Can we wire funds directly without the Deal Room?</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">Yes, the actual wire transfer occurs externally between your designated banks. However, the legally binding contract outlining that transfer MUST be signed via the InVolution Deal Room to activate our dispute resolution protections and formalize the investment record.</p>
                </div>

                <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors">
                    <h4 className="text-lg font-bold text-pink-400 mb-2">What happens if we sign a contract on paper off-platform?</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">InVolution is completely indemnified and not responsible for any fraud, misrepresentation, or capital loss resulting from off-platform agreements. You will be entirely on your own without our legal audit trail.</p>
                </div>

                <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors">
                    <h4 className="text-lg font-bold text-slate-200 mb-2">Why are my unexecuted messages masked?</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">To protect the privacy of our users and enforce our On-Platform Agreement rules, Personally Identifiable Information (PII) such as phone numbers and email addresses are automatically masked in the Deal Room until an official Smart Contract is mutually executed.</p>
                </div>
            </div>
        </div>
    );
}
