import React from 'react';
import { Calendar, ArrowRight, Star, Sparkles } from 'lucide-react';
import { getTodayDateString } from '../lib/fortuneEngine';

interface HeroScreenProps {
  onStart: () => void;
  hasSavedProfile: boolean;
  savedNickname?: string;
}

export const HeroScreen: React.FC<HeroScreenProps> = ({
  onStart,
  hasSavedProfile,
  savedNickname
}) => {
  const { formatted } = getTodayDateString();

  return (
    <main className="flex-grow flex flex-col items-center justify-center px-4 py-12 md:py-20 relative z-10 w-full max-w-[1200px] mx-auto">
      <div className="glass-card rounded-2xl p-8 sm:p-12 md:p-16 max-w-3xl w-full text-center flex flex-col items-center gap-6 sm:gap-8 relative overflow-hidden transition-all duration-300">
        {/* Decorative Sparkles & Elements */}
        <div className="absolute top-6 left-6 text-[#FFD369] opacity-60 pointer-events-none animate-pulse">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="absolute bottom-6 right-6 text-[#FFD369] opacity-60 pointer-events-none animate-pulse delay-500">
          <Star className="w-6 h-6 fill-[#FFD369]" />
        </div>

        {/* Date Display Badge */}
        <div className="inline-flex items-center gap-2 bg-[#5947c5]/10 text-[#5947c5] text-xs sm:text-sm font-semibold px-4 py-2 rounded-full border border-[#5947c5]/20 backdrop-blur-md shadow-xs">
          <Calendar className="w-4 h-4 text-[#5947c5]" />
          <span>{formatted}</span>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="space-y-4 max-w-xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1c1a29] leading-tight tracking-tight font-display">
            오하아사
          </h1>
          <p className="text-base sm:text-lg text-[#474553] leading-relaxed font-normal">
            생년월일로 확인하는 나만의 오늘 운세.<br />
            신비로운 기운이 당신을 안내합니다.
          </p>
        </div>

        {/* Action Button */}
        <div className="w-full max-w-sm mx-auto pt-2">
          <button
            onClick={onStart}
            className="w-full glow-button text-white text-base sm:text-lg font-semibold py-4 px-8 rounded-full flex items-center justify-center gap-2.5 group cursor-pointer"
          >
            <span>
              {hasSavedProfile && savedNickname
                ? `${savedNickname}님의 오늘 운세 보기`
                : '오늘의 운세 보기'}
            </span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Midnight hint */}
        <p className="text-xs sm:text-sm text-[#474553]/70">
          매일 자정 새로운 운세가 업데이트됩니다.
        </p>
      </div>
    </main>
  );
};
