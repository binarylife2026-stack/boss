
import React from 'react';
import { CategoryData, PredictionItem } from '../types';

interface PredictionTableProps {
  categories: CategoryData[];
}

const ProbabilityBadge: React.FC<{ probability: number }> = ({ probability }) => {
  const isHigh = probability >= 70;
  
  const getColorClass = (prob: number) => {
    if (prob >= 80) return 'bg-emerald-500 text-white border-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.4)]';
    if (prob >= 70) return 'bg-emerald-600/30 text-emerald-400 border-emerald-500/50';
    if (prob >= 50) return 'bg-sky-500/20 text-sky-400 border-sky-500/50';
    return 'bg-slate-700/50 text-slate-400 border-slate-600';
  };

  return (
    <div className={`px-3 py-1.5 rounded-xl border text-[11px] font-extrabold tracking-tighter sm:text-xs transition-all duration-300 ${getColorClass(probability)}`}>
      {probability}%
    </div>
  );
};

const MarketRow: React.FC<{ item: PredictionItem }> = ({ item }) => {
  const isHigh = item.probability >= 70;
  
  return (
    <div className={`flex flex-col p-4 sm:p-5 transition-all duration-500 group ${
      isHigh 
        ? 'bg-gradient-to-r from-emerald-500/10 to-transparent border-2 border-emerald-500/50 rounded-[1.25rem] my-3 shadow-[0_8px_30px_rgb(16,185,129,0.1)] ring-1 ring-emerald-500/10' 
        : 'border-b border-slate-700/30 last:border-0 hover:bg-slate-800/40 rounded-xl'
    }`}>
      <div className="flex justify-between items-center mb-3">
        <span className={`text-sm sm:text-base font-bold tracking-tight ${isHigh ? 'text-emerald-300' : 'text-slate-100'}`}>
          {item.marketName}
          {isHigh && (
            <span className="ml-3 text-[9px] sm:text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full uppercase font-black tracking-widest align-middle animate-pulse">
              HOT PICK
            </span>
          )}
        </span>
        <ProbabilityBadge probability={item.probability} />
      </div>
      
      <div className="w-full bg-slate-800/80 h-2 rounded-full mb-3.5 overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(0,0,0,0.6)] ${
            item.probability >= 70 ? 'bg-gradient-to-r from-emerald-600 to-emerald-400' : 'bg-gradient-to-r from-sky-600 to-sky-400'
          }`}
          style={{ width: `${item.probability}%` }}
        />
      </div>
      
      <p className={`text-xs sm:text-sm leading-relaxed bengali font-medium ${isHigh ? 'text-emerald-100/90' : 'text-slate-400'}`}>
        {item.explanation}
      </p>
    </div>
  );
};

const PredictionTable: React.FC<PredictionTableProps> = ({ categories }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-2 gap-6 lg:gap-8">
      {categories.map((category, idx) => (
        <div key={idx} className="bg-slate-900/60 rounded-[2.5rem] border border-slate-700/50 overflow-hidden backdrop-blur-xl flex flex-col h-full shadow-2xl transition-transform hover:scale-[1.01] duration-300">
          <div className="bg-gradient-to-b from-slate-800/80 to-transparent px-6 sm:px-8 py-5 border-b border-slate-700/40 flex items-center justify-between">
            <h3 className="text-[11px] sm:text-xs font-black text-sky-400 uppercase tracking-[0.25em]">
              {category.categoryName}
            </h3>
            <span className="text-[10px] bg-sky-500/10 text-sky-400 px-3 py-1 rounded-full font-bold border border-sky-500/20">
              {category.items.length} Markets
            </span>
          </div>
          <div className="p-4 sm:p-6 space-y-2">
            {category.items.map((item, itemIdx) => (
              <MarketRow key={itemIdx} item={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PredictionTable;
