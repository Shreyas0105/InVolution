import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function StartupsPage() {
    return (
        <div className="container mx-auto px-6 py-24 min-h-screen flex flex-col items-center justify-center text-center">
            <div className="animate-fade-in-up max-w-2xl">
                <h1 className="text-4xl md:text-6xl font-outfit font-bold text-white mb-6">For Startups</h1>
                <p className="text-xl text-slate-400 font-inter leading-relaxed mb-10">
                    Get in front of verified, active investors. Publish your verified profile, set your terms, and let our AI match you with the capital you need to scale.
                </p>
                <Link href="/startups/publish" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-bold rounded-full hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-all">
                    Publish Profile <ArrowRight className="w-5 h-5" />
                </Link>
            </div>
        </div>
    );
}
