import React from 'react';
import { Sparkles, Moon, History, User } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  currentScreen: 'hero' | 'input' | 'result';
  hasSavedProfile: boolean;
  userProfile: UserProfile | null;
  onNavigateHome: () => void;
  onNavigateMyFortune: () => void;
  onOpenHistory: () => void;
  onOpenAIConsult: () => void;
  onStartFortune: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  hasSavedProfile,
  userProfile,
  onNavigateHome,
  onNavigateMyFortune,
  onOpenHistory,
  onOpenAIConsult,
  onStartFortune
}) => {
  return (
    <header className="bg-[#fdf8ff]/75 dark:bg-[#1c1a29]/75 backdrop-blur-xl border-b border-white/40 sticky top-0 z-50 transition-all duration-300 shadow-[0_4px_20px_rgba(120,104,230,0.04)]">
      <div className="flex justify-between items-center w-full px-5 max-w-[1200px] mx-auto h-20">
        {/* Brand */}
        <button
          onClick={onNavigateHome}
          className="font-bold text-2xl text-[#5947c5] flex items-center gap-2.5 hover:opacity-85 transition-all duration-200 group focus:outline-none"
        >
          <div className="w-9 h-9 rounded-full bg-[#5947c5]/10 flex items-center justify-center border border-[#5947c5]/20 group-hover:scale-105 transition-transform">
            <Moon className="w-5 h-5 text-[#5947c5] fill-[#5947c5]/20" />
          </div>
          <span className="tracking-tight font-display text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#5947c5] to-[#7868E6] bg-clip-text text-transparent">
            Daily Fortune
          </span>
        </button>

        {/* Navigation Links */}
        <nav className="flex items-center gap-6 sm:gap-8">
          <button
            onClick={onNavigateMyFortune}
            className={`font-medium text-sm sm:text-base transition-all duration-200 relative py-1 focus:outline-none flex items-center gap-1.5 ${
              currentScreen === 'result'
                ? 'text-[#5947c5] font-semibold'
                : 'text-[#474553] hover:text-[#5947c5]'
            }`}
          >
            <User className="w-4 h-4" />
            <span>My Fortune</span>
            {currentScreen === 'result' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#5947c5] rounded-full" />
            )}
          </button>

          <button
            onClick={onOpenHistory}
            className="text-[#474553] hover:text-[#5947c5] font-medium text-sm sm:text-base transition-colors py-1 focus:outline-none flex items-center gap-1.5"
          >
            <History className="w-4 h-4" />
            <span>History</span>
          </button>
        </nav>

        {/* Trailing Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAIConsult}
            title="AI 운세 상담 / 깊은 조언"
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#5947c5] hover:bg-[#5947c5]/10 active:scale-95 transition-all duration-200 focus:outline-none"
          >
            <Sparkles className="w-5 h-5 text-[#5947c5]" />
          </button>

          <button
            onClick={onStartFortune}
            className="bg-gradient-to-r from-[#5947c5] to-[#59579a] text-white text-sm sm:text-base font-medium px-5 py-2.5 rounded-full hover:shadow-[0_4px_16px_rgba(89,71,197,0.35)] active:scale-95 transition-all duration-200 flex items-center gap-1.5"
          >
            {hasSavedProfile ? '오늘 운세 보기' : 'Get Started'}
          </button>
        </div>
      </div>
    </header>
  );
};
