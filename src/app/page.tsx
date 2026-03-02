import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-pink-600/20 blur-[120px]" />

      <main className="container mx-auto px-6 pt-32 pb-24 flex flex-col items-center justify-center min-h-screen text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-8 animate-fade-in-up">
          <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
          <span className="text-sm font-medium tracking-wide">InVolution App 1.0 is Live</span>
        </div>

        <h1 className="max-w-4xl text-5xl md:text-7xl font-bold tracking-tight mb-8 font-outfit">
          Where Visionary <span className="text-gradient">Startups</span> Meet Strategic <span className="text-gradient">Investors</span>
        </h1>

        <p className="max-w-2xl text-lg md:text-xl text-slate-400 mb-12 font-inter leading-relaxed">
          The premium platform for secure, transparent, and AI-driven investment match-making. Built with industry-leading simulated KYC and verifiable financial metrics.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link href="/login" className="px-8 py-4 rounded-full bg-slate-50 text-slate-950 font-semibold hover:bg-slate-200 transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
            Invest Now
          </Link>
          <Link href="/login" className="px-8 py-4 rounded-full border border-slate-700 bg-slate-900/50 font-semibold hover:bg-slate-800 transition-all hover:border-slate-500">
            Publish Startup
          </Link>
        </div>

        {/* Dashboard Preview Mockup */}
        <div className="mt-24 w-full max-w-5xl rounded-2xl glass-panel p-2 shadow-2xl relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/90 rounded-2xl pointer-events-none z-10" />
          <div className="aspect-[16/9] w-full rounded-xl bg-slate-900 overflow-hidden border border-slate-800 relative">
            <img
              src="/images/dashboard-preview.webp"
              alt="InVolution Dashboard Analytics Preview"
              className="w-full h-full object-cover object-top opacity-90 transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
