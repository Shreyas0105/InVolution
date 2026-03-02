import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function InvestorsPage() {
    return (
        <div className="container mx-auto px-6 py-24 min-h-screen flex flex-col items-center justify-center text-center">
            <div className="animate-fade-in-up max-w-2xl">
                <h1 className="text-4xl md:text-6xl font-outfit font-bold text-white mb-6">For Investors</h1>
                <p className="text-xl text-slate-400 font-inter leading-relaxed mb-10">
                    Stop sifting through unverified pitch decks. Utilize our AI-powered matchmaking engine to discover hyper-targeted, verified startup opportunities that match your portfolio risk and scope.
                </p>
                <Link href="/investors/search" className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full transition-all shadow-lg shadow-indigo-500/25">
                    Go to AI Search <ArrowRight className="w-5 h-5" />
                </Link>
            </div>
        </div>
    );
}
