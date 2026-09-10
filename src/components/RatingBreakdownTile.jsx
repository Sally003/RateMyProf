import React from 'react';
import ThreeDTile from './3DTile';
import { Award, BookOpen, MessageSquare, HeartHandshake, Flame, ThumbsUp } from 'lucide-react';

export default function RatingBreakdownTile({ stats }) {
  const categories = [
    { key: 'teachingRating', label: 'Teaching Quality', score: stats.teachingRating || 0, icon: BookOpen, color: 'bg-indigo-600' },
    { key: 'markingRating', label: 'Marking Fairness', score: stats.markingRating || 0, icon: Award, color: 'bg-indigo-500' },
    { key: 'communicationRating', label: 'Communication', score: stats.communicationRating || 0, icon: MessageSquare, color: 'bg-indigo-500' },
    { key: 'approachabilityRating', label: 'Approachability', score: stats.approachabilityRating || 0, icon: HeartHandshake, color: 'bg-indigo-600' },
  ];

  return (
    <ThreeDTile variant="glass" hover={false} className="w-full">
      <div className="flex flex-col md:flex-row items-center justify-between border-b border-slate-200/80 pb-6 mb-6 gap-4">
        {/* Overall Rating Big Badge */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-900 to-indigo-700 text-amber-400 flex flex-col items-center justify-center shadow-lg shadow-indigo-900/30 border border-indigo-500/30">
            <span className="font-display text-3xl font-extrabold tracking-tight">{stats.overallRating ? stats.overallRating.toFixed(1) : 'N/A'}</span>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-300">out of 5</span>
          </div>
          <div>
            <h3 className="font-display text-xl font-bold text-slate-900">Overall Teaching Rating</h3>
            <p className="text-sm text-slate-500 font-medium">Based on {stats.reviewCount || 0} verified student review{stats.reviewCount === 1 ? '' : 's'}</p>
          </div>
        </div>

        {/* Quick Highlights: Would Take Again & Difficulty */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex-1 md:flex-none tile-gold p-3 px-4 rounded-xl flex items-center gap-3">
            <div className="p-2 bg-amber-500 text-white rounded-lg shadow-sm">
              <ThumbsUp className="w-4 h-4" />
            </div>
            <div>
              <div className="font-display font-bold text-amber-950 text-base">{stats.wouldTakeAgainPercent}%</div>
              <div className="text-[11px] text-amber-800 font-medium">Would Take Again</div>
            </div>
          </div>

          <div className="flex-1 md:flex-none bg-slate-100 p-3 px-4 rounded-xl border border-slate-200/80 flex items-center gap-3">
            <div className="p-2 bg-slate-700 text-amber-400 rounded-lg shadow-sm">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <div className="font-display font-bold text-slate-900 text-base">{stats.difficultyRating ? stats.difficultyRating.toFixed(1) : 'N/A'}<span className="text-xs font-normal text-slate-500"> / 5</span></div>
              <div className="text-[11px] text-slate-600 font-medium">Course Difficulty</div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Progress Bars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const percentage = (cat.score / 5) * 100;
          return (
            <div key={cat.key} className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/60">
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <Icon className="w-4 h-4 text-indigo-600" />
                  {cat.label}
                </span>
                <span className="font-display text-sm font-bold text-indigo-950">
                  {cat.score ? cat.score.toFixed(1) : '0.0'}<span className="text-xs text-slate-400 font-normal"> / 5.0</span>
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-700 to-indigo-500 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </ThreeDTile>
  );
}
