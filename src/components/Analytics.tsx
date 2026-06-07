import React from 'react';
import type { UserStats } from '../types';
import { wordDatabase } from '../wordData';
import { Trophy, Flame, CheckCircle, BarChart3, PieChart, Star } from 'lucide-react';
import { playSfx } from '../audioHelper';

interface AnalyticsProps {
  stats: UserStats;
  onBack: () => void;
}

export const Analytics: React.FC<AnalyticsProps> = ({ stats, onBack }) => {
  // Count words by theme in database
  const themeTotalCount: Record<string, number> = {};
  wordDatabase.forEach((w) => {
    themeTotalCount[w.theme] = (themeTotalCount[w.theme] || 0) + 1;
  });

  // Count mastered words by theme
  const themeMasteredCount: Record<string, number> = {};
  stats.masteredWords.forEach((wordId) => {
    const word = wordDatabase.find((w) => w.id === wordId);
    if (word) {
      themeMasteredCount[word.theme] = (themeMasteredCount[word.theme] || 0) + 1;
    }
  });

  const themes = Object.keys(themeTotalCount);
  const totalWords = wordDatabase.length;
  const masteredCount = stats.masteredWords.length;
  const completionPercentage = Math.round((masteredCount / totalWords) * 100) || 0;

  const correctRate = stats.totalAnswered > 0 
    ? Math.round((stats.correctAnswers / stats.totalAnswered) * 100) 
    : 0;

  // Render a beautiful SVG Donut Chart for overall mastery
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 animate-pop-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-slate-700 flex items-center gap-2">
          <BarChart3 className="text-pink-400 w-8 h-8" />
          學習進度分析
        </h2>
        <button 
          onClick={() => { playSfx('click'); onBack(); }}
          className="btn-bubble btn-gray"
        >
          返回大廳
        </button>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="game-card flex items-center gap-4 border-pink-200">
          <div className="p-4 bg-pink-100 rounded-2xl text-pink-500">
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-slate-400 font-semibold">已掌握單字</p>
            <p className="text-3xl font-bold text-slate-700">
              {masteredCount} <span className="text-sm font-normal text-slate-400">/ {totalWords} 字</span>
            </p>
          </div>
        </div>

        <div className="game-card flex items-center gap-4 border-amber-200">
          <div className="p-4 bg-amber-100 rounded-2xl text-amber-500">
            <Flame className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-slate-400 font-semibold">學習小幫手</p>
            <p className="text-3xl font-bold text-slate-700">
              {stats.streak} <span className="text-sm font-normal text-slate-400">天連續登入</span>
            </p>
          </div>
        </div>

        <div className="game-card flex items-center gap-4 border-emerald-200">
          <div className="p-4 bg-emerald-100 rounded-2xl text-emerald-500">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-slate-400 font-semibold">答題正確率</p>
            <p className="text-3xl font-bold text-slate-700">
              {correctRate}<span className="text-sm font-normal text-slate-400">%</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Analysis Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Overall Completion Gauge */}
        <div className="game-card lg:col-span-2 flex flex-col items-center justify-center text-center border-blue-200">
          <h3 className="text-xl font-bold text-slate-600 mb-6 flex items-center gap-2">
            <PieChart className="text-blue-400" />
            總完成進度
          </h3>
          <div className="relative w-44 h-44 mb-4">
            <svg className="w-full h-full transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="88"
                cy="88"
                r={radius}
                className="stroke-blue-50"
                strokeWidth="12"
                fill="transparent"
              />
              {/* Foreground circle with animation */}
              <circle
                cx="88"
                cy="88"
                r={radius}
                className="stroke-blue-300 transition-all duration-1000 ease-out"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold text-blue-500">{completionPercentage}%</span>
              <span className="text-xs text-slate-400">總體記憶進度</span>
            </div>
          </div>
          <p className="text-sm text-slate-400 mt-2 font-medium">
            加油！當所有單字都被答對2次以上後即算掌握！
          </p>
        </div>

        {/* Theme breakdown bars */}
        <div className="game-card lg:col-span-3 border-emerald-100">
          <h3 className="text-xl font-bold text-slate-600 mb-6 flex items-center gap-2">
            <Star className="text-emerald-400 fill-emerald-100" />
            主題單字掌握度
          </h3>
          <div className="flex flex-col gap-4">
            {themes.map((theme) => {
              const mastered = themeMasteredCount[theme] || 0;
              const total = themeTotalCount[theme];
              const pct = Math.round((mastered / total) * 100) || 0;

              return (
                <div key={theme} className="flex flex-col">
                  <div className="flex justify-between items-center mb-1 text-sm">
                    <span className="font-semibold text-slate-600">{theme}</span>
                    <span className="text-slate-400 text-xs font-bold">
                      {mastered} / {total} 字 ({pct}%)
                    </span>
                  </div>
                  {/* Progress Bar Container */}
                  <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden border-2 border-slate-50">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-emerald-200 to-emerald-400 transition-all duration-1000"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
