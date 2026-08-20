import React, { useRef, useState } from 'react';
import { X, Download, Link2, Check, Moon, Sparkles, Star } from 'lucide-react';
import { FortuneResult, UserProfile } from '../types';
import { toPng } from 'html-to-image';

interface ShareModalProps {
  fortune: FortuneResult;
  userProfile: UserProfile;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  fortune,
  userProfile,
  onClose
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    try {
      setDownloading(true);
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#F7F5FF'
      });
      const link = document.createElement('a');
      link.download = `daily-fortune-${userProfile.nickname || 'today'}-${fortune.dateStr}.png`;
      link.href = dataUrl;
      link.click();
      showToast('운세 카드가 이미지로 저장되었습니다!');
    } catch (err) {
      console.error('Image download error:', err);
      showToast('이미지 저장 중 오류가 발생했습니다.');
    } finally {
      setDownloading(false);
    }
  };

  const handleShareLink = async () => {
    const shareText = `[Daily Fortune] ${userProfile.nickname}님의 오늘 운세 점수는 ${fortune.overallScore}점 (${fortune.statusTitle})입니다!\n"${fortune.dailyQuote}"`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Daily Fortune - 오늘의 운세',
          text: shareText,
          url: shareUrl
        });
        showToast('운세가 성공적으로 공유되었습니다!');
        return;
      } catch (e: any) {
        if (e.name !== 'AbortError') {
          // Fall back to copy
        }
      }
    }

    // Fallback to clipboard
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopied(true);
      showToast('링크와 운세 요약이 클립보드에 복사되었습니다!');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      showToast('복사에 실패했습니다.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1c1a29]/60 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-[420px] flex flex-col items-center gap-5 my-auto animate-fade-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 sm:-right-8 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors focus:outline-none"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Title */}
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold font-display tracking-tight text-white drop-shadow-sm">
            Share Your Fortune
          </h2>
          <p className="text-xs sm:text-sm text-white/80 mt-1">Spread the cosmic energy</p>
        </div>

        {/* 9:16 Share Card Preview */}
        <div
          ref={cardRef}
          className="w-full bg-[#fdf8ff] border border-white/80 rounded-3xl p-6 sm:p-7 relative overflow-hidden shadow-2xl flex flex-col text-center"
        >
          {/* Sparkles decorations */}
          <div className="absolute top-4 right-4 text-[#FFD369] opacity-70">
            <Sparkles className="w-5 h-5 fill-[#FFD369]" />
          </div>
          <div className="absolute bottom-4 left-4 text-[#FFD369] opacity-70">
            <Star className="w-4 h-4 fill-[#FFD369]" />
          </div>

          {/* Background aura inside card */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-[#B8B5FF]/30 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-36 h-36 bg-[#5947c5]/15 rounded-full blur-2xl pointer-events-none" />

          {/* Logo & Brand */}
          <div className="flex flex-col items-center justify-center mb-5 relative z-10">
            <div className="w-12 h-12 rounded-full bg-[#5947c5]/10 flex items-center justify-center mb-1.5 border border-[#5947c5]/20">
              <Moon className="w-6 h-6 text-[#5947c5] fill-[#5947c5]/20" />
            </div>
            <span className="text-base font-bold text-[#5947c5] font-display">Daily Fortune</span>
            <span className="text-[11px] text-[#474553]/70">{fortune.dateFormatted}</span>
          </div>

          {/* Energy Score */}
          <div className="mb-6 relative z-10">
            <div className="text-xs font-bold text-[#59579a] uppercase tracking-widest mb-0.5">
              TODAY'S ENERGY
            </div>
            <div className="text-6xl font-extrabold fortune-gradient-text font-display">
              {fortune.overallScore}
            </div>
            <div className="text-sm font-semibold text-[#1c1a29] mt-1">
              {userProfile.nickname}님의 {fortune.statusTitle}
            </div>
          </div>

          {/* 4 Category scores grid */}
          <div className="grid grid-cols-2 gap-2.5 mb-5 relative z-10">
            <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-white/80 flex flex-col items-center">
              <span className="text-xs font-medium text-[#474553]">Love (연애)</span>
              <span className="text-xl font-bold text-[#5947c5] mt-0.5">
                {fortune.categories.love.score}
              </span>
            </div>
            <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-white/80 flex flex-col items-center">
              <span className="text-xs font-medium text-[#474553]">Money (금전)</span>
              <span className="text-xl font-bold text-[#5947c5] mt-0.5">
                {fortune.categories.money.score}
              </span>
            </div>
            <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-white/80 flex flex-col items-center">
              <span className="text-xs font-medium text-[#474553]">Work (학업·직장)</span>
              <span className="text-xl font-bold text-[#5947c5] mt-0.5">
                {fortune.categories.work.score}
              </span>
            </div>
            <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-white/80 flex flex-col items-center">
              <span className="text-xs font-medium text-[#474553]">Health (건강)</span>
              <span className="text-xl font-bold text-[#5947c5] mt-0.5">
                {fortune.categories.health.score}
              </span>
            </div>
          </div>

          {/* Lucky Element pill */}
          <div className="flex justify-center items-center gap-2 mb-4 relative z-10">
            <div className="px-3.5 py-1 rounded-full bg-[#ece5fb] border border-[#B8B5FF]/50 text-xs font-medium text-[#5947c5]">
              Lucky # <span className="font-bold text-[#5947c5]">{fortune.lucky.number}</span> •{' '}
              {fortune.lucky.colorName} • {fortune.lucky.item}
            </div>
          </div>

          {/* Daily Quote */}
          <div className="mt-auto pt-2 relative z-10">
            <p className="text-xs italic text-[#474553] px-2 font-medium leading-relaxed">
              "{fortune.dailyQuote}"
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5">
          <button
            onClick={handleDownloadImage}
            disabled={downloading}
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#5947c5] to-[#59579a] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-[0_8px_16px_rgba(89,71,197,0.3)] hover:opacity-95 active:scale-95 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? '이미지 생성 중...' : '이미지 저장'}</span>
          </button>

          <button
            onClick={handleShareLink}
            className="w-full py-3.5 rounded-full bg-white text-[#5947c5] border border-[#5947c5]/30 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-white/90 active:scale-95 transition-all cursor-pointer shadow-xs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Link2 className="w-4 h-4" />}
            <span>{copied ? '복사 완료!' : '링크 공유'}</span>
          </button>
        </div>

        {/* Toast Feedback */}
        {toastMsg && (
          <div className="bg-[#1c1a29] text-white text-xs px-4 py-2 rounded-full shadow-lg border border-white/20 animate-fade-in">
            {toastMsg}
          </div>
        )}
      </div>
    </div>
  );
};
