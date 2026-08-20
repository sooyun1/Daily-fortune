import React, { useState } from 'react';
import { Sparkles, Send, X, Bot, User, RefreshCw, MessageSquare } from 'lucide-react';
import { FortuneResult, UserProfile } from '../types';

interface AIConsultModalProps {
  fortune: FortuneResult;
  userProfile: UserProfile;
  initialQuestion?: string;
  onClose: () => void;
}

export const AIConsultModal: React.FC<AIConsultModalProps> = ({
  fortune,
  userProfile,
  initialQuestion = '',
  onClose
}) => {
  const [question, setQuestion] = useState(initialQuestion);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const presetQuestions = [
    '💼 오늘 중요한 발표나 면접이 있는데 어떨까요?',
    '💖 좋아하는 사람에게 먼저 연락해볼까요?',
    '💰 오늘 큰 지출이나 쇼핑을 해도 괜찮을까요?',
    '🧘‍♀️ 오늘 하루를 가장 지혜롭게 보내는 팁을 알려주세요.'
  ];

  const handleAsk = async (queryText?: string) => {
    const textToAsk = queryText || question;
    if (!textToAsk.trim()) return;

    try {
      setLoading(true);
      setErrorMsg(null);

      const res = await fetch('/api/fortune/ai-consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname: userProfile.nickname,
          birthDate: `${userProfile.birthYear}-${userProfile.birthMonth}-${userProfile.birthDay}`,
          gender: userProfile.gender,
          overallScore: fortune.overallScore,
          scores: {
            love: fortune.categories.love.score,
            money: fortune.categories.money.score,
            work: fortune.categories.work.score,
            health: fortune.categories.health.score
          },
          fortuneSummary: fortune.statusDescription,
          userQuestion: textToAsk
        })
      });

      const data = await res.json();
      if (data.success) {
        setResponse(data.consultation);
      } else {
        setResponse(data.fallbackMessage || '오늘 하루는 차분하고 긍정적인 마음으로 임하시면 좋은 결실을 맺을 것입니다.');
      }
    } catch (e) {
      console.error('AI consult fetch failed:', e);
      setResponse(`${userProfile.nickname}님의 오늘 운세(${fortune.overallScore}점)에 따르면, 스스로의 직관을 믿고 차분하게 한 걸음씩 나아가시면 좋은 기회가 열릴 것입니다.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-white/80 relative flex flex-col my-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#474553]/70 hover:text-[#1c1a29] p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#5947c5] to-[#B8B5FF] flex items-center justify-center text-white shadow-md shadow-[#5947c5]/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#1c1a29] font-display">
              AI 심층 운세 카운슬러
            </h3>
            <p className="text-xs text-[#474553]">
              {userProfile.nickname}님의 오늘 기운({fortune.overallScore}점)을 바탕으로 맞춤 조언을 드립니다.
            </p>
          </div>
        </div>

        {/* Scrollable conversation / consultation area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4">
          {/* Quick preset chips */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-[#5947c5] block">
              자주 묻는 질문을 바로 눌러보세요:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {presetQuestions.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuestion(preset);
                    handleAsk(preset);
                  }}
                  className="text-xs text-left bg-[#F7F5FF] hover:bg-[#ece5fb] text-[#1c1a29] hover:text-[#5947c5] border border-[#B8B5FF]/30 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* AI Response Card */}
          {loading && (
            <div className="bg-[#f7f5ff] p-5 rounded-2xl border border-[#B8B5FF]/40 flex items-center gap-3 animate-pulse">
              <RefreshCw className="w-5 h-5 text-[#5947c5] animate-spin" />
              <div className="text-xs sm:text-sm text-[#5947c5] font-medium">
                별들의 기운과 오늘의 운세 흐름을 정밀하게 분석 중입니다...
              </div>
            </div>
          )}

          {response && !loading && (
            <div className="bg-gradient-to-br from-[#f8f5ff] to-[#f0ebff] p-5 rounded-2xl border border-[#B8B5FF]/50 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#5947c5]">
                <Bot className="w-4 h-4" />
                <span>AI 맞춤 심층 풀이</span>
              </div>
              <p className="text-sm text-[#1c1a29] leading-relaxed whitespace-pre-line font-medium">
                {response}
              </p>
            </div>
          )}
        </div>

        {/* Input bar */}
        <div className="pt-2 border-t border-gray-100">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAsk();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="궁금한 상황이나 고민을 입력하세요..."
              className="flex-1 bg-[#F7F5FF] border border-[#B8B5FF] rounded-full px-4 py-3 text-sm text-[#1c1a29] placeholder:text-[#787585]/60 focus:outline-none focus:ring-2 focus:ring-[#5947c5]/30 focus:border-[#5947c5]"
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="w-11 h-11 rounded-full bg-[#5947c5] text-white flex items-center justify-center hover:bg-[#4736b0] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0 cursor-pointer shadow-md shadow-[#5947c5]/25"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
