"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, BrainCircuit, Activity, LineChart, ChevronRight } from "lucide-react";



export default function AISearchEngine() {
    const [filters, setFilters] = useState({
        keyword: "",
        sector: "All",
        maxInvestment: 50000000,
        riskAppetite: "All",
        stage: "All",
        minRevenue: 0
    });

    const [isSearching, setIsSearching] = useState(false);
    const [allStartups, setAllStartups] = useState<any[]>([]);
    const [results, setResults] = useState<any[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);

    // Fetch verified startups from MongoDB
    useEffect(() => {
        const fetchStartups = async () => {
            try {
                const res = await fetch('/api/startups');
                const json = await res.json();
                if (json.success) {
                    setAllStartups(json.data);
                    setResults(json.data); // Initial display shows all
                }
            } catch (err) {
                console.error("Failed to load DB startups", err);
            } finally {
                setIsLoadingData(false);
            }
        };
        fetchStartups();
    }, []);

    const handleSearch = () => {
        setIsSearching(true);
        setTimeout(() => {
            const filtered = allStartups.filter(s => {
                const searchStr = filters.keyword.toLowerCase();
                const keywordMatch = !searchStr ||
                    s.name.toLowerCase().includes(searchStr) ||
                    s.sector.toLowerCase().includes(searchStr) ||
                    (s.desc && s.desc.toLowerCase().includes(searchStr)) ||
                    (s.tags && s.tags.some((t: string) => t.toLowerCase().includes(searchStr)));

                const sectorMatch = filters.sector === "All" || s.sector === filters.sector;
                const budgetMatch = s.requested <= filters.maxInvestment;
                const riskMatch = filters.riskAppetite === "All" || s.risk === filters.riskAppetite;
                const stageMatch = filters.stage === "All" || (s.stage && s.stage === filters.stage) || true; // Currently DB doesn't have stage, failing open. Provide fallback until DB supports stage.
                const revenueMatch = s.revenue >= filters.minRevenue;
                return keywordMatch && sectorMatch && budgetMatch && riskMatch && stageMatch && revenueMatch;
            }).sort((a, b) => b.score - a.score); // AI sorts by highest match score
            setResults(filtered);
            setIsSearching(false);
        }, 1200);
    };

    return (
        <div className="container mx-auto px-6 py-12 max-w-7xl min-h-screen">
            <div className="text-center mb-12 animate-fade-in-up">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/20 to-pink-500/20 text-indigo-300 text-sm font-semibold mb-6 border border-indigo-500/30">
                    <BrainCircuit className="w-4 h-4" /> AI-Powered Matchmaking Active
                </div>
                <h1 className="text-4xl md:text-5xl font-outfit font-bold text-white mb-4">Discover Your Next Unicorn</h1>
                <p className="text-slate-400 font-inter max-w-2xl mx-auto text-lg">
                    Our intelligent algorithm analyzes financials, sectors, and risk bands to find the perfect investment match for your portfolio.
                </p>
            </div>

            <div className="grid lg:grid-cols-4 gap-8">

                {/* Filters Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass-panel p-6 rounded-2xl sticky top-24">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Search className="w-5 h-5" /> Parameters</h2>

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Specific Interests / Keywords</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <input type="text"
                                        placeholder="e.g. AI, B2B, solar..."
                                        className="w-full bg-black/50 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-200 placeholder-slate-600"
                                        value={filters.keyword} onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Industry Sector</label>
                                <select
                                    className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-200"
                                    value={filters.sector} onChange={(e) => setFilters({ ...filters, sector: e.target.value })}
                                >
                                    <option value="All">All Sectors</option>
                                    <option value="FinTech">FinTech</option>
                                    <option value="HealthTech">HealthTech</option>
                                    <option value="CleanTech">CleanTech</option>
                                    <option value="EdTech">EdTech</option>
                                    <option value="SaaS">SaaS</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Max Investment (₹)</label>
                                <input type="number" step="1000000"
                                    className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-200"
                                    value={filters.maxInvestment} onChange={(e) => setFilters({ ...filters, maxInvestment: Number(e.target.value) })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Risk Appetite</label>
                                <select
                                    className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-200"
                                    value={filters.riskAppetite} onChange={(e) => setFilters({ ...filters, riskAppetite: e.target.value })}
                                >
                                    <option value="All">Any Risk Level</option>
                                    <option value="Low">Low Risk</option>
                                    <option value="Medium">Medium Risk</option>
                                    <option value="High">Aggressive / High</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Startup Stage</label>
                                <select
                                    className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-200"
                                    value={filters.stage} onChange={(e) => setFilters({ ...filters, stage: e.target.value })}
                                >
                                    <option value="All">All Stages</option>
                                    <option value="Pre-Seed">Pre-Seed</option>
                                    <option value="Seed">Seed</option>
                                    <option value="Series A">Series A</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Min. Monthly Rev (₹)</label>
                                <input type="number" step="50000"
                                    className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-200"
                                    value={filters.minRevenue} onChange={(e) => setFilters({ ...filters, minRevenue: Number(e.target.value) })}
                                />
                            </div>

                            <button
                                onClick={handleSearch}
                                className="w-full py-3 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
                            >
                                {isSearching ? <BrainCircuit className="w-5 h-5 animate-pulse" /> : <Search className="w-5 h-5" />}
                                {isSearching ? "Analyzing..." : "Run AI Search"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Grid */}
                <div className="lg:col-span-3">
                    <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
                        <h3 className="text-lg font-semibold text-slate-200">
                            {results.length} Matches Found
                        </h3>
                        <span className="text-sm text-slate-500 flex items-center gap-1"><Activity className="w-4 h-4" /> Sorted by AI Score</span>
                    </div>

                    {isLoadingData ? (
                        <div className="py-24 text-center">
                            <Activity className="w-16 h-16 text-indigo-500 animate-spin mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-slate-300">Synchronizing with Live Database...</h3>
                            <p className="text-slate-500">Fetching verified unicorn profiles securely.</p>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {results.map((startup, idx) => (
                                <div key={startup._id || startup.id}
                                    className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6 group hover:border-indigo-500/50 transition-all duration-300 cursor-pointer animate-in fade-in slide-in-from-bottom-4"
                                    style={{ animationDelay: `${idx * 100}ms` }}
                                >
                                    {/* Score Circular badge */}
                                    <div className="relative w-20 h-20 shrink-0">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-800" />
                                            <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray="226" strokeDashoffset={226 - (226 * startup.score) / 100} className="text-indigo-500 transition-all duration-1000" />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-xl font-bold text-white">{startup.score}</span>
                                            <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider">Match</span>
                                        </div>
                                    </div>

                                    <div className="flex-grow space-y-2 text-center md:text-left mt-4 md:mt-0">
                                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                            <h3 className="text-2xl font-bold text-white font-outfit group-hover:text-indigo-400 transition-colors">{startup.name}</h3>
                                            <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-slate-300">{startup.sector}</span>
                                            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-medium">{startup.stage}</span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${startup.risk === 'Low' ? 'bg-green-500/20 text-green-400' : startup.risk === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                                                {startup.risk} Risk
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4 pt-4 text-sm">
                                            <div>
                                                <p className="text-slate-500 mb-1">Asking</p>
                                                <p className="text-slate-200 font-semibold text-base font-mono">₹{(startup.requested / 100000).toFixed(1)}L</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500 mb-1">Equity</p>
                                                <p className="text-slate-200 font-semibold text-base">{startup.equity}%</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500 flex items-center gap-1 mb-1"><LineChart className="w-3 h-3" /> MRR</p>
                                                <p className="text-slate-200 font-semibold text-base font-mono">₹{(startup.revenue / 1000).toFixed(0)}K</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="shrink-0 mt-6 md:mt-0">
                                        <Link href={`/startups/${startup._id}`} className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-800 text-white group-hover:bg-indigo-600 transition-colors">
                                            <ChevronRight className="w-6 h-6" />
                                        </Link>
                                    </div>
                                </div>
                            ))}

                            {results.length === 0 && (
                                <div className="py-24 text-center">
                                    <BrainCircuit className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                                    <h3 className="text-2xl font-bold text-slate-400">No matching startups found.</h3>
                                    <p className="text-slate-500">Try adjusting your AI parameters.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
