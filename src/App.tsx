import React, { useState, useEffect } from 'react';
import { UserProfile, FortuneResult, HistoryRecord, ScreenState } from './types';
import { generateFortune, getTodayDateString } from './lib/fortuneEngine';
import { CelestialBackground } from './components/CelestialBackground';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HeroScreen } from './components/HeroScreen';
import { InputScreen } from './components/InputScreen';
import { ResultScreen } from './components/ResultScreen';
import { ShareModal } from './components/ShareModal';
import { HistoryModal } from './components/HistoryModal';
import { AIConsultModal } from './components/AIConsultModal';

const USER_PROFILE_KEY = 'fortune_user_profile_v1';
const HISTORY_RECORDS_KEY = 'fortune_history_records_v1';

export default function App() {
  const [screen, setScreen] = useState<ScreenState>('hero');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [fortuneResult, setFortuneResult] = useState<FortuneResult | null>(null);
  const [historyRecords, setHistoryRecords] = useState<HistoryRecord[]>([]);

  // Modals
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isAIConsultOpen, setIsAIConsultOpen] = useState(false);
  const [aiPresetQuestion, setAiPresetQuestion] = useState('');

  // Load profile & history on mount
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem(USER_PROFILE_KEY);
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile) as UserProfile;
        setUserProfile(parsed);
      }

      const savedHistory = localStorage.getItem(HISTORY_RECORDS_KEY);
      if (savedHistory) {
        const parsedHist = JSON.parse(savedHistory) as HistoryRecord[];
        setHistoryRecords(parsedHist);
      }
    } catch (e) {
      console.warn('Failed to load localStorage state:', e);
    }
  }, []);

  // Save history record helper
  const saveToHistory = (res: FortuneResult) => {
    setHistoryRecords((prev) => {
      const filtered = prev.filter((item) => item.date !== res.dateStr);
      const newRecord: HistoryRecord = {
        id: res.id,
        date: res.dateStr,
        dateFormatted: res.dateFormatted,
        score: res.overallScore,
        statusTitle: res.statusTitle,
        quote: res.dailyQuote,
        categories: {
          love: res.categories.love.score,
          money: res.categories.money.score,
          work: res.categories.work.score,
          health: res.categories.health.score
        }
      };
      const updated = [newRecord, ...filtered];
      try {
        localStorage.setItem(HISTORY_RECORDS_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  // Submit profile & generate fortune
  const handleProfileSubmit = (profile: UserProfile, targetDate?: string) => {
    setUserProfile(profile);
    try {
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
    } catch {
      // ignore
    }

    const result = generateFortune(profile, targetDate);
    setFortuneResult(result);
    saveToHistory(result);
    setScreen('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Start Fortune flow
  const handleStartFortune = () => {
    if (userProfile) {
      handleProfileSubmit(userProfile);
    } else {
      setScreen('input');
    }
  };

  // Select a historical date
  const handleSelectHistoryDate = (date: string) => {
    if (userProfile) {
      const pastResult = generateFortune(userProfile, date);
      setFortuneResult(pastResult);
      setScreen('result');
    } else {
      setScreen('input');
    }
  };

  // Clear all data
  const handleClearData = () => {
    if (window.confirm('저장된 생년월일과 모든 운세 기록을 삭제하시겠습니까?')) {
      try {
        localStorage.removeItem(USER_PROFILE_KEY);
        localStorage.removeItem(HISTORY_RECORDS_KEY);
      } catch {
        // ignore
      }
      setUserProfile(null);
      setFortuneResult(null);
      setHistoryRecords([]);
      setScreen('hero');
    }
  };

  // Clear only history
  const handleClearHistory = () => {
    if (window.confirm('모든 운세 히스토리 기록을 삭제하시겠습니까?')) {
      try {
        localStorage.removeItem(HISTORY_RECORDS_KEY);
      } catch {
        // ignore
      }
      setHistoryRecords([]);
    }
  };

  // Open AI modal with question
  const handleOpenAIConsult = (presetQuestion?: string) => {
    setAiPresetQuestion(presetQuestion || '');
    setIsAIConsultOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col relative text-[#1c1a29] selection:bg-[#B8B5FF]/40">
      {/* Background Starry Shader & Aura */}
      <CelestialBackground />

      {/* Navigation Header */}
      <Header
        currentScreen={screen}
        hasSavedProfile={!!userProfile}
        userProfile={userProfile}
        onNavigateHome={() => setScreen('hero')}
        onNavigateMyFortune={() => {
          if (userProfile) {
            handleProfileSubmit(userProfile);
          } else {
            setScreen('input');
          }
        }}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenAIConsult={() => {
          if (userProfile && fortuneResult) {
            handleOpenAIConsult();
          } else if (userProfile) {
            handleProfileSubmit(userProfile);
            handleOpenAIConsult();
          } else {
            setScreen('input');
          }
        }}
        onStartFortune={handleStartFortune}
      />

      {/* Screen Views */}
      <div className="flex-1 flex flex-col">
        {screen === 'hero' && (
          <HeroScreen
            onStart={handleStartFortune}
            hasSavedProfile={!!userProfile}
            savedNickname={userProfile?.nickname}
          />
        )}

        {screen === 'input' && (
          <InputScreen
            initialProfile={userProfile}
            onSubmit={(prof) => handleProfileSubmit(prof)}
            onBack={() => setScreen('hero')}
          />
        )}

        {screen === 'result' && fortuneResult && userProfile && (
          <ResultScreen
            fortune={fortuneResult}
            userProfile={userProfile}
            onOpenShare={() => setIsShareOpen(true)}
            onOpenAIConsult={handleOpenAIConsult}
            onRecompute={() => handleProfileSubmit(userProfile)}
            onBackToInput={() => setScreen('input')}
          />
        )}
      </div>

      {/* Global Footer */}
      <Footer
        hasSavedProfile={!!userProfile}
        onClearData={handleClearData}
      />

      {/* Share Modal (Screen 04) */}
      {isShareOpen && fortuneResult && userProfile && (
        <ShareModal
          fortune={fortuneResult}
          userProfile={userProfile}
          onClose={() => setIsShareOpen(false)}
        />
      )}

      {/* History Modal (Screen 05) */}
      {isHistoryOpen && (
        <HistoryModal
          records={historyRecords}
          onSelectDate={handleSelectHistoryDate}
          onClearHistory={handleClearHistory}
          onClose={() => setIsHistoryOpen(false)}
        />
      )}

      {/* AI Consultation Modal (Phase 4 Gemini) */}
      {isAIConsultOpen && fortuneResult && userProfile && (
        <AIConsultModal
          fortune={fortuneResult}
          userProfile={userProfile}
          initialQuestion={aiPresetQuestion}
          onClose={() => setIsAIConsultOpen(false)}
        />
      )}
    </div>
  );
}
