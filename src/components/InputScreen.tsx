import React, { useState } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, Clock } from 'lucide-react';
import { UserProfile, Gender } from '../types';

interface InputScreenProps {
  initialProfile?: UserProfile | null;
  onSubmit: (profile: UserProfile) => void;
  onBack: () => void;
}

export const InputScreen: React.FC<InputScreenProps> = ({
  initialProfile,
  onSubmit,
  onBack
}) => {
  const currentYear = new Date().getFullYear();

  const [nickname, setNickname] = useState(initialProfile?.nickname || '');
  const [birthYear, setBirthYear] = useState(initialProfile?.birthYear || '2000');
  const [birthMonth, setBirthMonth] = useState(initialProfile?.birthMonth || '5');
  const [birthDay, setBirthDay] = useState(initialProfile?.birthDay || '21');
  const [gender, setGender] = useState<Gender>(initialProfile?.gender || 'female');
  const [birthTime, setBirthTime] = useState(initialProfile?.birthTime || '10:30');
  const [unknownTime, setUnknownTime] = useState(initialProfile?.unknownTime || false);
  const [errorMsg, setErrorMsg] = useState('');

  // Generate Year options from currentYear down to 1940
  const yearOptions: number[] = [];
  for (let y = currentYear; y >= 1940; y--) {
    yearOptions.push(y);
  }

  // Month options 1~12
  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);

  // Day options based on month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };
  const daysInSelectedMonth = getDaysInMonth(
    parseInt(birthYear || '2000', 10),
    parseInt(birthMonth || '1', 10)
  );
  const dayOptions = Array.from({ length: daysInSelectedMonth }, (_, i) => i + 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!birthYear || !birthMonth || !birthDay) {
      setErrorMsg('생년월일을 모두 선택해주세요.');
      return;
    }

    setErrorMsg('');
    onSubmit({
      nickname: nickname.trim() || '여행자',
      birthYear,
      birthMonth,
      birthDay,
      birthTime: unknownTime ? undefined : birthTime,
      unknownTime,
      gender
    });
  };

  return (
    <main className="flex-grow flex items-center justify-center px-4 py-8 md:py-14 relative z-10 w-full">
      <div className="glass-card rounded-2xl w-full max-w-[500px] p-6 sm:p-10 relative overflow-hidden shadow-[0px_20px_40px_rgba(120,104,230,0.12)]">
        {/* Back Button & Decorative Sparkle */}
        <button
          onClick={onBack}
          className="absolute top-5 left-5 text-[#474553]/70 hover:text-[#5947c5] transition-colors p-1.5 rounded-full hover:bg-white/50 focus:outline-none"
          title="처음으로 돌아가기"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="absolute top-5 right-5 text-[#FFD369] opacity-70 pointer-events-none">
          <Sparkles className="w-6 h-6" />
        </div>

        {/* Title */}
        <div className="text-center mt-2 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1c1a29] mb-2 font-display">
            오늘의 운세를 알려드릴게요
          </h1>
          <p className="text-sm sm:text-base text-[#474553]">
            정확한 운세 풀이를 위해 정보를 입력해주세요.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nickname */}
          <div>
            <label htmlFor="nickname" className="block text-sm font-semibold text-[#1c1a29] mb-2">
              닉네임 (선택)
            </label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="이름 또는 닉네임을 입력하세요 (예: 소현)"
              maxLength={20}
              className="w-full bg-white/80 border border-[#B8B5FF] rounded-xl px-4 py-3 text-[#1c1a29] placeholder:text-[#787585]/60 focus:outline-none focus:ring-2 focus:ring-[#5947c5]/30 focus:border-[#5947c5] transition-all"
            />
          </div>

          {/* Birth Date */}
          <div>
            <label className="block text-sm font-semibold text-[#1c1a29] mb-2">
              생년월일 <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {/* Year */}
              <div className="relative">
                <select
                  value={birthYear}
                  onChange={(e) => setBirthYear(e.target.value)}
                  className="w-full bg-white/80 border border-[#B8B5FF] rounded-xl px-3 py-3 text-sm text-[#1c1a29] appearance-none focus:outline-none focus:ring-2 focus:ring-[#5947c5]/30 focus:border-[#5947c5] transition-all cursor-pointer"
                >
                  <option value="">년도</option>
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}년
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#787585]">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>

              {/* Month */}
              <div className="relative">
                <select
                  value={birthMonth}
                  onChange={(e) => setBirthMonth(e.target.value)}
                  className="w-full bg-white/80 border border-[#B8B5FF] rounded-xl px-3 py-3 text-sm text-[#1c1a29] appearance-none focus:outline-none focus:ring-2 focus:ring-[#5947c5]/30 focus:border-[#5947c5] transition-all cursor-pointer"
                >
                  <option value="">월</option>
                  {monthOptions.map((month) => (
                    <option key={month} value={month}>
                      {month}월
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#787585]">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>

              {/* Day */}
              <div className="relative">
                <select
                  value={birthDay}
                  onChange={(e) => setBirthDay(e.target.value)}
                  className="w-full bg-white/80 border border-[#B8B5FF] rounded-xl px-3 py-3 text-sm text-[#1c1a29] appearance-none focus:outline-none focus:ring-2 focus:ring-[#5947c5]/30 focus:border-[#5947c5] transition-all cursor-pointer"
                >
                  <option value="">일</option>
                  {dayOptions.map((day) => (
                    <option key={day} value={day}>
                      {day}일
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#787585]">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-semibold text-[#1c1a29] mb-2">성별</label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`py-3 px-2 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none cursor-pointer border ${
                  gender === 'female'
                    ? 'bg-[#5947c5] text-white border-[#5947c5] shadow-md shadow-[#5947c5]/25'
                    : 'bg-white/80 text-[#474553] border-[#B8B5FF] hover:bg-[#B8B5FF]/20'
                }`}
              >
                여성
              </button>
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`py-3 px-2 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none cursor-pointer border ${
                  gender === 'male'
                    ? 'bg-[#5947c5] text-white border-[#5947c5] shadow-md shadow-[#5947c5]/25'
                    : 'bg-white/80 text-[#474553] border-[#B8B5FF] hover:bg-[#B8B5FF]/20'
                }`}
              >
                남성
              </button>
              <button
                type="button"
                onClick={() => setGender('skip')}
                className={`py-3 px-2 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none cursor-pointer border ${
                  gender === 'skip'
                    ? 'bg-[#5947c5] text-white border-[#5947c5] shadow-md shadow-[#5947c5]/25'
                    : 'bg-white/80 text-[#474553] border-[#B8B5FF] hover:bg-[#B8B5FF]/20'
                }`}
              >
                건너뛰기
              </button>
            </div>
          </div>

          {/* Birth Time */}
          <div>
            <label htmlFor="birth_time" className="block text-sm font-semibold text-[#1c1a29] mb-2">
              태어난 시간 (선택)
            </label>
            <div className="relative mb-2.5">
              <input
                id="birth_time"
                type="time"
                value={unknownTime ? '' : birthTime}
                disabled={unknownTime}
                onChange={(e) => setBirthTime(e.target.value)}
                className={`w-full bg-white/80 border border-[#B8B5FF] rounded-xl px-4 py-3 text-sm text-[#1c1a29] focus:outline-none focus:ring-2 focus:ring-[#5947c5]/30 focus:border-[#5947c5] transition-all ${
                  unknownTime ? 'opacity-45 bg-[#e6dff5]/50 cursor-not-allowed' : ''
                }`}
              />
              <Clock className="w-4 h-4 text-[#787585] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none group w-fit">
              <input
                type="checkbox"
                checked={unknownTime}
                onChange={(e) => setUnknownTime(e.target.checked)}
                className="w-4 h-4 rounded text-[#5947c5] focus:ring-[#5947c5] border-[#B8B5FF] cursor-pointer"
              />
              <span className="text-xs sm:text-sm text-[#474553] group-hover:text-[#1c1a29] transition-colors">
                태어난 시간을 몰라요
              </span>
            </label>
          </div>

          {/* Validation Error */}
          {errorMsg && (
            <p className="text-sm text-rose-500 font-medium text-center bg-rose-50 p-2.5 rounded-lg border border-rose-200">
              {errorMsg}
            </p>
          )}

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full glow-button text-white text-base sm:text-lg font-semibold py-4 rounded-full flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>오늘의 운세 보기</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};
