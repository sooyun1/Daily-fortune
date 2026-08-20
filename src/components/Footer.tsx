import React, { useState } from 'react';
import { Sparkles, Shield, FileText, Mail, Trash2 } from 'lucide-react';

interface FooterProps {
  onClearData?: () => void;
  hasSavedProfile?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ onClearData, hasSavedProfile }) => {
  const [modalContent, setModalContent] = useState<{ title: string; text: string } | null>(null);

  const showPrivacy = () => {
    setModalContent({
      title: '개인정보 처리방침 (Privacy Policy)',
      text: `Daily Fortune(오늘의 운세)는 사용자의 개인정보 보호를 최우선으로 생각합니다.

1. 수집 항목: 생년월일, 닉네임(선택), 태어난 시간(선택), 성별(선택)
2. 수집 목적: 오직 당일 운세 점수 및 해석 계산을 위한 일회성 Seed 생성용
3. 저장 방식: 서버로 개인정보를 전송하거나 영구 보관하지 않으며, 사용자의 브라우저 LocalStorage에만 저장됩니다.
4. 파기: 하단의 '내 정보 삭제' 버튼을 누르면 브라우저에 저장된 모든 정보가 즉시 영구 삭제됩니다.
5. 본 서비스는 오락과 일상적인 재미를 위한 라이프스타일 콘텐츠입니다.`
    });
  };

  const showTerms = () => {
    setModalContent({
      title: '이용약관 (Terms of Service)',
      text: `1. 본 서비스에서 제공하는 운세 결과 및 점수는 통계적 알고리즘과 창의적 텍스트 풀이에 기반한 참고용 오락 콘텐츠입니다.
2. 실제 미래의 결정이나 중요한 법적, 재정적, 의학적 판단의 근거로 사용될 수 없습니다.
3. 서비스는 무료로 제공되며, 사용자는 언제든지 자유롭게 서비스를 이용하고 공유할 수 있습니다.`
    });
  };

  const showContact = () => {
    setModalContent({
      title: '문의하기 (Contact Us)',
      text: `Daily Fortune 서비스 개선 의견이나 문의사항이 있으시면 언제든지 연락해 주세요.

- 이메일: support@dailyfortune.app
- 운영시간: 평일 10:00 ~ 18:00 (KST)
- 사용자 여러분의 피드백을 통해 매일 더 따뜻하고 의미 있는 운세를 만듭니다.`
    });
  };

  return (
    <>
      <footer className="bg-transparent py-10 mt-16 border-t border-[#1c1a29]/5 relative z-10 w-full">
        <div className="flex flex-col md:flex-row justify-between items-center w-full px-5 max-w-[1200px] mx-auto gap-5">
          {/* Brand / Copyright */}
          <div className="flex flex-col items-center md:items-start gap-1 text-center md:text-left">
            <div className="font-display text-lg font-bold text-[#1c1a29] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#5947c5]" />
              <span>Daily Fortune</span>
            </div>
            <p className="text-xs sm:text-sm text-[#474553]/80">
              © 2024-2026 Daily Fortune. For entertainment purposes only.
            </p>
          </div>

          {/* Links & Clear Data */}
          <nav className="flex flex-wrap justify-center items-center gap-5 sm:gap-6 text-sm text-[#474553]/85">
            <button
              onClick={showPrivacy}
              className="hover:text-[#5947c5] transition-colors focus:outline-none flex items-center gap-1"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Privacy Policy</span>
            </button>
            <button
              onClick={showTerms}
              className="hover:text-[#5947c5] transition-colors focus:outline-none flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Terms of Service</span>
            </button>
            <button
              onClick={showContact}
              className="hover:text-[#5947c5] transition-colors focus:outline-none flex items-center gap-1"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact Us</span>
            </button>

            {hasSavedProfile && onClearData && (
              <button
                onClick={onClearData}
                title="브라우저에 저장된 내 생년월일 및 기록 삭제"
                className="text-xs text-rose-500/80 hover:text-rose-600 transition-colors focus:outline-none flex items-center gap-1 border border-rose-200 bg-rose-50/50 px-2.5 py-1 rounded-full"
              >
                <Trash2 className="w-3 h-3" />
                <span>내 정보 삭제</span>
              </button>
            )}
          </nav>
        </div>
      </footer>

      {/* Info Modal */}
      {modalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-white/80 relative">
            <h3 className="text-lg sm:text-xl font-bold text-[#1c1a29] mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#5947c5]" />
              {modalContent.title}
            </h3>
            <div className="text-sm text-[#474553] whitespace-pre-line leading-relaxed max-h-[60vh] overflow-y-auto mb-6 bg-[#F7F5FF]/70 p-4 rounded-xl border border-[#B8B5FF]/20">
              {modalContent.text}
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setModalContent(null)}
                className="bg-[#5947c5] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-[#432eae] transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
