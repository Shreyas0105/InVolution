import Link from "next/link";
import { UserPlus } from "lucide-react";

export default function RegisterPage() {
    return (
        <div className="container mx-auto px-6 py-24 min-h-[calc(100vh-80px)] flex flex-col items-center justify-center">
            <div className="glass-panel p-10 rounded-3xl w-full max-w-xl animate-fade-in-up">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-pink-400">
                        <UserPlus className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-outfit font-bold text-white">Join InVolution</h1>
                    <p className="text-slate-400 mt-2">Create an account to verify your identity and access the network.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <Link href="/kyc" className="p-6 rounded-2xl border border-slate-700 bg-slate-900/50 hover:border-indigo-500 hover:bg-indigo-900/20 transition-all text-center group">
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400">I am a Founder</h3>
                        <p className="text-xs text-slate-400">Raise verified capital for your startup.</p>
                    </Link>
                    <Link href="/kyc" className="p-6 rounded-2xl border border-slate-700 bg-slate-900/50 hover:border-pink-500 hover:bg-pink-900/20 transition-all text-center group">
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-pink-400">I am an Investor</h3>
                        <p className="text-xs text-slate-400">Discover and fund top-tier unicorns.</p>
                    </Link>
                </div>

                <p className="text-center text-sm text-slate-500 print:hidden">
                    Already verified? <Link href="/login" className="text-pink-400 hover:text-pink-300 font-medium">Log In</Link>
                </p>
            </div>
        </div>
    );
}
