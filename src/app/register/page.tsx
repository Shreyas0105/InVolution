"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { UserPlus, ArrowLeft } from "lucide-react";

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState<"startup" | "investor" | null>(null);

    const handleRegister = async (role: "startup" | "investor") => {
        setIsLoading(role);
        // Set role cookie so NextAuth picks it up during the OAuth callback
        document.cookie = `involution_role=${role}; path=/; max-age=3600`;
        // After OAuth, middleware will detect isNewUser=true and redirect to /kyc automatically
        const dashboardRoute = role === "investor" ? "/investors/dashboard" : "/startups/dashboard";
        await signIn("google", { callbackUrl: dashboardRoute });
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-pink-600/20 blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px]" />

            <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-500">
                <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>

                <div className="glass-panel p-8 md:p-10 rounded-3xl shadow-2xl border border-white/10 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-indigo-500" />

                    <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <UserPlus className="w-8 h-8 text-pink-400" />
                    </div>

                    <h1 className="text-3xl font-outfit font-bold text-white mb-2">Join InVolution</h1>
                    <p className="text-slate-400 text-sm mb-8 px-4">
                        Sign up with Google to create your account. KYC verification will follow after sign-up.
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <button
                            onClick={() => handleRegister("startup")}
                            disabled={isLoading !== null}
                            className="flex flex-col items-center gap-2 p-5 rounded-2xl border border-slate-700 bg-slate-900/50 hover:border-pink-500 hover:bg-pink-900/20 transition-all group disabled:opacity-50 disabled:pointer-events-none"
                        >
                            {isLoading === "startup" ? (
                                <div className="w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
                            ) : null}
                            <h3 className="text-base font-bold text-white group-hover:text-pink-400">I am a Founder</h3>
                            <p className="text-xs text-slate-400">Raise verified capital for your startup.</p>
                        </button>

                        <button
                            onClick={() => handleRegister("investor")}
                            disabled={isLoading !== null}
                            className="flex flex-col items-center gap-2 p-5 rounded-2xl border border-slate-700 bg-slate-900/50 hover:border-indigo-500 hover:bg-indigo-900/20 transition-all group disabled:opacity-50 disabled:pointer-events-none"
                        >
                            {isLoading === "investor" ? (
                                <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                            ) : null}
                            <h3 className="text-base font-bold text-white group-hover:text-indigo-400">I am an Investor</h3>
                            <p className="text-xs text-slate-400">Discover and fund top-tier unicorns.</p>
                        </button>
                    </div>

                    <p className="text-xs text-slate-500 mb-4">
                        Both options use <span className="text-white font-medium">Continue with Google</span> to securely create your account.
                    </p>

                    <p className="text-center text-sm text-slate-500">
                        Already have an account?{" "}
                        <Link href="/login" className="text-pink-400 hover:text-pink-300 font-medium">Log In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

