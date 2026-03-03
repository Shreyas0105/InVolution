"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
    const { data: session, status } = useSession();
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/10 px-6 py-4">
            <div className="container mx-auto flex items-center justify-between">
                <Link href="/" className="font-outfit text-2xl font-bold tracking-tighter flex items-center gap-3 text-white">
                    <Image src="/logo.svg" alt="InVolution Logo" width={40} height={40} className="w-10 h-10 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]" />
                    InVolution
                </Link>
                <div className="hidden md:flex items-center gap-8 text-sm font-medium font-inter text-slate-300">
                    <Link href="/about" className="hover:text-white transition-colors">About</Link>

                    {status === "authenticated" ? (
                        (session?.user as any)?.role === "investor" ? (
                            <Link href="/investors/dashboard" className="hover:text-white transition-colors">Investor Dashboard</Link>
                        ) : (
                            <Link href="/startups/dashboard" className="hover:text-white transition-colors">Startup Dashboard</Link>
                        )
                    ) : (
                        <>
                            <Link href="/startups" className="hover:text-white transition-colors">Startups</Link>
                            <Link href="/investors" className="hover:text-white transition-colors">Investors</Link>
                        </>
                    )}

                    <Link href="/rules" className="hover:text-white transition-colors">Rules & FAQ</Link>
                </div>
                <div className="flex items-center gap-4">
                    {status === "authenticated" ? (
                        <>
                            <Link
                                href={(session?.user as any)?.role === "investor" ? "/investors/dashboard" : "/startups/dashboard"}
                                className="text-sm font-medium hover:text-indigo-400 transition-colors"
                            >
                                {(session?.user as any)?.role === "investor" ? "Investor Dashboard" : "Startup Dashboard"}
                            </Link>
                            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                                <img src={session.user?.image || ""} alt="Avatar" className="w-8 h-8 rounded-full border border-white/20" />
                                <button onClick={() => signOut()} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                                    Sign Out
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="text-sm font-medium hover:text-white transition-colors">
                                Login
                            </Link>
                            <Link href="/login" className="text-sm font-medium bg-white text-slate-950 px-4 py-2 rounded-full hover:bg-slate-200 transition-colors">
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
