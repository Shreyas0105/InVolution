"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Mail } from "lucide-react";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [role, setRole] = useState("investor");

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        // Save the chosen role in a cookie so NextAuth can pick it up during the OAuth callback
        document.cookie = `involution_role=${role}; path=/; max-age=3600`;
        const dashboardRoute = role === "investor" ? "/investors/dashboard" : "/startups/dashboard";
        await signIn("google", { callbackUrl: dashboardRoute });
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-pink-600/20 blur-[120px]" />

            <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-500">
                <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>

                <div className="glass-panel p-8 md:p-10 rounded-3xl shadow-2xl border border-white/10 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-pink-500"></div>

                    <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <ShieldCheck className="w-8 h-8 text-indigo-400" />
                    </div>

                    <h1 className="text-3xl font-outfit font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-slate-400 text-sm mb-6 px-4">
                        Securely authenticate to access the InVolution Deal Room and personalized matches.
                    </p>

                    <div className="flex bg-slate-900/50 p-1 rounded-xl border border-slate-700 mb-8 mx-auto w-fit">
                        <button
                            onClick={() => setRole("investor")}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${role === "investor" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:text-white"}`}
                        >
                            Investor
                        </button>
                        <button
                            onClick={() => setRole("startup")}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${role === "startup" ? "bg-pink-600 text-white shadow-lg" : "text-slate-400 hover:text-white"}`}
                        >
                            Startup Founder
                        </button>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-white text-slate-900 rounded-xl font-bold transition-all hover:bg-slate-200 hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:pointer-events-none shadow-lg"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#4CAF50" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FFC107" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#F44336" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    Continue with Google
                                </>
                            )}
                        </button>

                        <div className="relative flex justify-center text-sm items-center py-4">
                            <span className="bg-transparent px-2 text-slate-500 relative z-10 w-full flex items-center justify-between">
                                <div className="h-px bg-slate-800 w-[40%]"></div>
                                <span>or</span>
                                <div className="h-px bg-slate-800 w-[40%]"></div>
                            </span>
                        </div>

                        <button disabled className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-slate-900 border border-slate-700 text-slate-400 rounded-xl font-medium cursor-not-allowed opacity-50">
                            <Mail className="w-5 h-5" />
                            Continue with Email
                        </button>
                    </div>

                    <p className="mt-8 text-xs text-slate-500">
                        By signing in, you agree to our <Link href="/rules" className="text-indigo-400 hover:underline">Rules & Liability Policy</Link>.
                    </p>
                </div>
            </div>
        </div>
    );
}
