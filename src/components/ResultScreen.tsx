import React, { useState, useEffect } from 'react';
import {
  Heart,
  DollarSign,
  Briefcase,
  ShieldCheck,
  Star,
  Sparkles,
  Share2,
  ChevronDown,
  ChevronUp,
  MessageCircleQuestion,
  RefreshCw,
  Lightbulb,
  Award
} from 'lucide-react';
import { FortuneResult, UserProfile, FortuneCategoryDetail } from '../types';
import confetti from 'canvas-confetti';

interface ResultScreenProps {
  fortune: FortuneResult;
  userProfile: UserProfile;
  onOpenShare: () => void;
  onOpenAIConsult: (presetQuestion?: string) => void;
  onRecompute: () => void;
  onBackToInput: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  fortune,
  userProfile,
  onOpenShare,
  onOpenAIConsult,
  onRecompute,
  onBackToInput
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [expandedCategory, setExpandedCategory] = useState<'love' | 'money' | 'work' | 'health' | null>(null);

  // Animated Count-up effect
  useEffect(() => {
    let start = 0;
    const target = fortune.overallScore;
    const duration = 1200;
    const steps = 40;
    const stepTime = duration / steps;
    const increment = target / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setAnimatedScore(target);
        clearInterval(timer);
        if (target >= 80) {
          try {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.6 },
              colors: ['#5947c5', '#B8B5FF', '#FFD369', '#a3defe']
            });
          } catch {
            // benign
          }
        }
      } else {
        setAnimatedScore(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [fortune.overallScore]);

  const toggleCategory = (cat: 'love' | 'money' | 'work' | 'health') => {
    setExpandedCategory(prev => (prev === cat ? null : cat));
  };

  const renderStars = (starsCount: number) => {
    return (
      <div className="flex text-[#FFD369] gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={`w-4 h-4 ${
              s <= starsCount
                ? 'fill-[#FFD369] text-[#FFD369]'
                : 'text-[#FFD369]/35 fill-transparent'
            }`}
          />
        ))}
      </div>
    );
  };

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'love':
        return <Heart className="w-6 h-6 text-[#5947c5] fill-[#5947c5]/20" />;
      case 'money':
        return <DollarSign className="w-6 h-6 text-[#5947c5]" />;
      case 'work':
        return <Briefcase className="w-6 h-6 text-[#5947c5]" />;
      case 'health':
        return <ShieldCheck className="w-6 h-6 text-[#5947c5]" />;
      default:
        return <Sparkles className="w-6 h-6 text-[#5947c5]" />;
    }
  };

  const categories = [
    fortune.categories.love,
    fortune.categories.money,
    fortune.categories.work,
    fortune.categories.health
  ];

  return (
    <main className="flex-grow relative z-10 max-w-[900px] w-full mx-auto px-4 py-8 md:py-12 flex flex-col gap-10">
      {/* Top Banner with Nickname & Date */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white/50 border border-white/60 rounded-2xl px-5 py-3 backdrop-blur-md gap-2 text-xs sm:text-sm text-[#474553]">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#5947c5] bg-[#5947c5]/10 px-2.5 py-0.5 rounded-full">
            {userProfile.nickname}님
          </span>
          <span>오늘의 운세</span>
        </div>
        <div className="flex items-center gap-3">
          <span>{fortune.dateFormatted}</span>
          <button
            onClick={onBackToInput}
            className="text-xs text-[#5947c5] hover:underline font-medium focus:outline-none"
          >
            정보 수정
          </button>
        </div>
      </div>

      {/* Overall Score Section */}
      <section className="text-center flex flex-col items-center">
        <div className="inline-block relative">
          {/* Sparkles Decoration */}
          <Sparkles className="w-6 h-6 text-[#FFD369] absolute -top-4 -left-6 fill-[#FFD369] animate-pulse" />
          <Star className="w-5 h-5 text-[#FFD369] absolute -bottom-1 -right-5 fill-[#FFD369] animate-pulse delay-300" />

          <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold fortune-gradient-text font-display tracking-tight">
            <span>{animatedScore}</span>
            <span className="text-3xl sm:text-4xl md:text-5xl ml-1 font-semibold">%</span>
          </h1>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-[#1c1a29] mt-3 font-display">
          {fortune.statusTitle}
        </h2>
        <p className="text-base sm:text-lg text-[#474553] mt-2 max-w-lg mx-auto leading-relaxed">
          {fortune.statusDescription}
        </p>
      </section>

      {/* 4 Fortune Category Cards */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-lg font-bold text-[#1c1a29] flex items-center gap-2">
            <Award className="w-5 h-5 text-[#5947c5]" />
            분야별 상세 운세
          </h3>
          <span className="text-xs text-[#474553]/70">카드를 눌러 상세 조언과 팁을 확인하세요</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((cat) => {
            const isExpanded = expandedCategory === cat.id;
            return (
              <div
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className={`glass-card rounded-2xl p-5 sm:p-6 cursor-pointer transition-all duration-300 ${
                  isExpanded
                    ? 'ring-2 ring-[#5947c5]/40 bg-white/90 shadow-[0px_20px_40px_rgba(120,104,230,0.14)]'
                    : 'hover:-translate-y-1 hover:bg-white/80'
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-[#f1ebff] flex items-center justify-center mb-3">
                    {getCategoryIcon(cat.id)}
                  </div>
                  <h4 className="text-lg font-bold text-[#1c1a29] font-display">
                    {cat.nameEn} ({cat.name})
                  </h4>

                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-base font-bold text-[#5947c5]">{cat.score}</span>
                    {renderStars(cat.stars)}
                  </div>

                  <p className="text-sm text-[#474553] mt-2.5 line-clamp-2">
                    {cat.summary}
                  </p>

                  <div className="mt-3 text-xs text-[#5947c5] font-semibold flex items-center gap-1">
                    <span>{isExpanded ? '간략히 접기' : '상세 풀이 & 행동 팁 보기'}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </div>
                </div>

                {/* Expanded Detail Panel */}
                {isExpanded && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="mt-4 pt-4 border-t border-[#B8B5FF]/30 text-left text-sm space-y-3 animate-fade-in"
                  >
                    <div>
                      <h5 className="font-bold text-[#1c1a29] text-xs uppercase tracking-wider text-[#5947c5] mb-1">
                        상세 흐름
                      </h5>
                      <p className="text-[#474553] leading-relaxed">{cat.detail}</p>
                    </div>

                    <div className="bg-[#f7f1ff] p-3 rounded-xl border border-[#B8B5FF]/40 flex items-start gap-2.5">
                      <Lightbulb className="w-4 h-4 text-[#FFD369] fill-[#FFD369] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-xs text-[#5947c5] block">오늘의 Tip</span>
                        <p className="text-xs text-[#1c1a29] font-medium leading-relaxed">
                          {cat.tip}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Lucky Points Section */}
      <section className="space-y-4">
        <h3 className="text-lg sm:text-xl font-bold text-[#1c1a29] text-center flex items-center justify-center gap-2 font-display">
          <Sparkles className="w-5 h-5 text-[#FFD369] fill-[#FFD369]" />
          오늘의 Lucky Point
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
          {/* Number */}
          <div className="glass-card rounded-xl p-4 flex flex-col items-center justify-center text-center">
            <span className="text-xs font-semibold text-[#474553] uppercase tracking-wider mb-1">
              Number
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-[#5947c5] font-display">
              {fortune.lucky.number}
            </span>
          </div>

          {/* Color */}
          <div className="glass-card rounded-xl p-4 flex flex-col items-center justify-center text-center">
            <span className="text-xs font-semibold text-[#474553] uppercase tracking-wider mb-1">
              Color
            </span>
            <div className="flex items-center gap-2 mt-1">
              <div
                className="w-5 h-5 rounded-full border border-white shadow-xs"
                style={{ backgroundColor: fortune.lucky.colorHex }}
                title={fortune.lucky.colorName}
              />
              <span className="text-xs sm:text-sm font-medium text-[#1c1a29]">
                {fortune.lucky.colorName}
              </span>
            </div>
          </div>

          {/* Item */}
          <div className="glass-card rounded-xl p-4 flex flex-col items-center justify-center text-center">
            <span className="text-xs font-semibold text-[#474553] uppercase tracking-wider mb-1">
              Item
            </span>
            <span className="text-sm sm:text-base font-semibold text-[#1c1a29] truncate max-w-full">
              {fortune.lucky.item}
            </span>
          </div>

          {/* Time */}
          <div className="glass-card rounded-xl p-4 flex flex-col items-center justify-center text-center">
            <span className="text-xs font-semibold text-[#474553] uppercase tracking-wider mb-1">
              Time
            </span>
            <span className="text-sm sm:text-base font-semibold text-[#1c1a29]">
              {fortune.lucky.time}
            </span>
          </div>
        </div>
      </section>

      {/* Daily Message Quote Section */}
      <section>
        <div className="glass-card rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="absolute -top-5 -left-3 text-[#5947c5] opacity-10 pointer-events-none text-8xl font-serif">
            “
          </div>
          <p className="text-base sm:text-xl font-bold text-[#5947c5] relative z-10 font-display leading-relaxed">
            "{fortune.dailyQuote}"
          </p>
        </div>
      </section>

      {/* AI Fortune Consultation Box (Phase 4 PRD) */}
      <section className="bg-gradient-to-r from-[#ece5fb] via-[#f7f1ff] to-[#e6dff5] border border-[#B8B5FF]/50 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3 text-left">
          <div className="w-10 h-10 rounded-full bg-[#5947c5] text-white flex items-center justify-center shrink-0">
            <MessageCircleQuestion className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-[#1c1a29] text-sm sm:text-base">
              오늘 특별한 고민이나 질문이 있으신가요?
            </h4>
            <p className="text-xs sm:text-sm text-[#474553] mt-0.5">
              면접, 시험, 고백, 중요한 결정을 AI 운세 카운슬러에게 물어보세요.
            </p>
          </div>
        </div>
        <button
          onClick={() => onOpenAIConsult()}
          className="bg-white hover:bg-[#5947c5] text-[#5947c5] hover:text-white border border-[#5947c5]/30 font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-full transition-all duration-200 shadow-xs shrink-0 cursor-pointer"
        >
          AI 질문하기 ✨
        </button>
      </section>

      {/* Action Buttons */}
      <section className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2 pb-6">
        <button
          onClick={onOpenShare}
          className="w-full sm:w-auto glow-button text-white font-semibold text-sm sm:text-base py-3.5 px-8 rounded-full flex items-center justify-center gap-2 cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
          <span>결과 공유하기</span>
        </button>

        <button
          onClick={onRecompute}
          className="w-full sm:w-auto bg-white/80 hover:bg-white text-[#5947c5] border border-[#B8B5FF] font-semibold text-sm sm:text-base py-3.5 px-6 rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>운세 새로고침</span>
        </button>
      </section>

      {/* Midnight message */}
      <p className="text-center text-xs text-[#474553]/70">
        내일 다시 만나요 🌙 내일의 운세는 자정에 새로 업데이트됩니다.
      </p>
    </main>
  );
};
