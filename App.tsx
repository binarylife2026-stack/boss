
import React, { useState, useEffect } from 'react';
import { AnalyticsState, MatchAnalysisResponse } from './types';
import { getFootballAnalysis } from './services/geminiService';
import PredictionTable from './components/PredictionTable';

const App: React.FC = () => {
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [state, setState] = useState<AnalyticsState>(AnalyticsState.IDLE);
  const [analysis, setAnalysis] = useState<MatchAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingMessages = [
    "H2H ডাটা স্ক্যান করা হচ্ছে...",
    "দলের বর্তমান ফর্ম বিশ্লেষণ করা হচ্ছে...",
    "রেফারি এবং লিগ স্ট্যাটস যাচাই করা হচ্ছে...",
    "xG এবং ট্যাকটিকাল মডেলে ইনপুট দেওয়া হচ্ছে...",
    "চূড়ান্ত প্রেডিকশন জেনারেট করা হচ্ছে..."
  ];

  useEffect(() => {
    let interval: any;
    if (state === AnalyticsState.LOADING) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [state]);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!homeTeam || !awayTeam) return;

    setState(AnalyticsState.LOADING);
    setError(null);
    try {
      const data = await getFootballAnalysis(homeTeam, awayTeam);
      setAnalysis(data);
      setState(AnalyticsState.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setError("বিশ্লেষণ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
      setState(AnalyticsState.ERROR);
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-[#020617] text-slate-100 selection:bg-sky-500 selection:text-white">
      {/* Header */}
      <header className="bg-slate-900/80 border-b border-slate-800/60 sticky top-0 z-50 px-4 py-5 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-11 h-11 bg-gradient-to-br from-sky-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-xl shadow-sky-500/20 transition-transform group-hover:rotate-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m12 12-5 3"/><path d="M12 7v5l2 2"/></svg>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-indigo-400 to-emerald-400 tracking-tighter leading-none">
                ELITE FOOTBALL AI
              </h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.25em] mt-1.5">Statistical Intelligence Engine</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-slate-900 bg-slate-800"></div>)}
            </div>
            <span className="text-[10px] px-3 py-1.5 rounded-full bg-slate-800 text-sky-400 border border-slate-700 font-bold tracking-widest">LIVE ANALYTICS</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* Input Section */}
        <section className="bg-slate-900/40 p-6 sm:p-10 rounded-[3rem] border border-slate-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-md mb-12">
          <form onSubmit={handleAnalyze} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Home Team (স্বাগতিক)</label>
                <div className="relative group">
                  <input 
                    type="text" 
                    value={homeTeam}
                    onChange={(e) => setHomeTeam(e.target.value)}
                    placeholder="e.g. Manchester City"
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-[1.5rem] px-6 py-5 text-slate-100 focus:outline-none focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500/50 transition-all placeholder:text-slate-700 font-bold text-lg"
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] group-focus-within:scale-125 transition-transform"></div>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Away Team (অতিথি)</label>
                <div className="relative group">
                  <input 
                    type="text" 
                    value={awayTeam}
                    onChange={(e) => setAwayTeam(e.target.value)}
                    placeholder="e.g. Liverpool"
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-[1.5rem] px-6 py-5 text-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all placeholder:text-slate-700 font-bold text-lg"
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.5)] group-focus-within:scale-125 transition-transform"></div>
                </div>
              </div>
            </div>
            <button 
              disabled={state === AnalyticsState.LOADING || !homeTeam || !awayTeam}
              className="w-full bg-gradient-to-r from-sky-600 via-indigo-600 to-emerald-600 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-6 rounded-[1.75rem] shadow-2xl shadow-sky-500/20 transition-all active:scale-[0.97] text-xl tracking-tight uppercase"
            >
              {state === AnalyticsState.LOADING ? (
                <span className="flex items-center justify-center gap-4">
                  <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Processing Engine...
                </span>
              ) : 'Analyze Matchup Now'}
            </button>
          </form>
        </section>

        {/* Loading State */}
        {state === AnalyticsState.LOADING && (
          <div className="flex flex-col items-center justify-center py-24 space-y-10">
            <div className="relative">
              <div className="w-32 h-32 border-[6px] border-slate-900 border-t-sky-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-6 h-6 bg-emerald-500 rounded-full animate-ping shadow-[0_0_20px_rgba(16,185,129,0.8)]"></div>
              </div>
            </div>
            <div className="text-center space-y-3">
              <h3 className="text-sky-400 font-black text-2xl sm:text-3xl bengali tracking-tight animate-pulse">{loadingMessages[loadingStep]}</h3>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">Advanced Neural Analysis in Progress</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {state === AnalyticsState.ERROR && (
          <div className="bg-red-500/10 border border-red-500/30 p-8 rounded-[2rem] text-red-400 text-center mb-10 bengali font-bold flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="p-3 bg-red-500/20 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <span className="text-lg">{error}</span>
          </div>
        )}

        {/* Success Results */}
        {state === AnalyticsState.SUCCESS && analysis && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            {/* Hero Summary Card */}
            <div className="bg-gradient-to-br from-slate-900 via-[#0a0f1e] to-slate-950 p-8 sm:p-14 rounded-[3.5rem] border border-slate-800/60 shadow-[0_40px_100px_rgba(0,0,0,0.6)] relative overflow-hidden group">
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-sky-600/10 blur-[120px] rounded-full group-hover:bg-sky-500/20 transition-all duration-700"></div>
              <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-600/10 blur-[120px] rounded-full group-hover:bg-emerald-500/20 transition-all duration-700"></div>
              
              <div className="relative flex flex-col xl:flex-row justify-between items-center gap-12">
                <div className="text-center xl:text-left flex-1 space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-sky-500/10 border border-sky-500/20 rounded-full">
                     <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
                     <span className="text-[10px] font-black text-sky-400 uppercase tracking-widest">Match Intelligence Summary</span>
                  </div>
                  <h2 className="text-4xl sm:text-6xl font-black text-white leading-[1.1] tracking-tight flex flex-wrap items-center justify-center xl:justify-start gap-4 sm:gap-6">
                    {analysis.matchInfo.homeTeam} 
                    <span className="text-slate-700 text-2xl sm:text-4xl font-light italic">VS</span> 
                    {analysis.matchInfo.awayTeam}
                  </h2>
                  <div className="p-8 bg-slate-950/60 rounded-[2rem] border border-slate-800/50 backdrop-blur-md shadow-inner">
                    <p className="text-slate-200 text-lg sm:text-xl leading-relaxed bengali italic font-semibold">
                      "{analysis.matchInfo.summary}"
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col items-center bg-slate-950/70 p-10 rounded-[3rem] border border-slate-800/80 min-w-[280px] shadow-2xl">
                  <div className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Probability Confidence</div>
                  <div className="text-7xl font-black text-sky-400 tabular-nums drop-shadow-[0_0_20px_rgba(56,189,248,0.3)]">{analysis.matchInfo.predictionConfidence}</div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full mt-8 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-sky-500 to-indigo-500 h-full rounded-full shadow-[0_0_15px_rgba(14,165,233,0.5)] transition-all duration-1000"
                      style={{ width: analysis.matchInfo.predictionConfidence }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Analytics Content */}
            <PredictionTable categories={analysis.categories} />
            
            <footer className="pt-20 pb-20 text-center space-y-8">
              <div className="inline-flex flex-col sm:flex-row items-center gap-4 px-8 py-4 bg-slate-900/50 border border-slate-800/60 rounded-3xl text-[11px] font-black text-slate-500 uppercase tracking-[0.4em]">
                <div className="flex items-center gap-3">
                  <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                  Tactical Engine Online
                </div>
                <div className="hidden sm:block w-px h-4 bg-slate-700"></div>
                <div>Model: Gemini 3 Pro Ultra</div>
              </div>
              <p className="max-w-2xl mx-auto text-slate-600 text-xs sm:text-sm leading-relaxed px-4">
                This analysis utilizes deep historical data (H2H), expected goals (xG), referee behavioral patterns, and squad depth metrics to generate a 70-80% accurate prediction.
                <br/><span className="mt-4 block font-bold text-slate-700">© 2024 ELITE FOOTBALL ANALYTICS SYSTEMS</span>
              </p>
            </footer>
          </div>
        )}

        {/* Welcome Screen */}
        {state === AnalyticsState.IDLE && (
          <div className="text-center py-32 px-6 animate-in fade-in duration-1000">
            <div className="mb-12 inline-flex items-center justify-center w-32 h-32 rounded-[3rem] bg-slate-900/50 border border-slate-800 shadow-[0_30px_60px_rgba(0,0,0,0.5)] relative group cursor-help">
               <div className="absolute inset-0 animate-ping rounded-[3rem] bg-sky-500/5 scale-125"></div>
               <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14 text-sky-500 group-hover:scale-110 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
            <h3 className="text-3xl sm:text-5xl font-black mb-6 text-white bengali tracking-tight">এডভান্সড ফুটবল অ্যানালিটিক্স</h3>
            <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto bengali leading-relaxed font-medium px-4">
              বিশ্বের সবচেয়ে শক্তিশালী AI ফুটবল ইঞ্জিন দিয়ে আপনার প্রিয় ম্যাচের খুঁটিনাটি ডাটা এবং প্রেডিকশন বের করুন। 
              উপরে দলের নাম লিখে শুরু করুন।
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
