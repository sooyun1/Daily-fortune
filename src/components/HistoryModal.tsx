import React from 'react';
import { X, Calendar, TrendingUp, Trash2, Award, Star } from 'lucide-react';
import { HistoryRecord } from '../types';

interface HistoryModalProps {
  records: HistoryRecord[];
  onSelectDate: (date: string) => void;
  onClearHistory: () => void;
  onClose: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  records,
  onSelectDate,
  onClearHistory,
  onClose
}) => {
  const sorted = [...records].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-white/80 relative flex flex-col max-h-[85vh] my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#474553]/70 hover:text-[#1c1a29] p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-10 h-10 rounded-full bg-[#5947c5]/10 flex items-center justify-center text-[#5947c5]">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#1c1a29] font-display">
              운세 기록 및 흐름 (History)
            </h3>
            <p className="text-xs text-[#474553]">
              최근 확인한 일일 운세 점수와 변화 추이입니다.
            </p>
          </div>
        </div>

        {/* Content */}
        {sorted.length === 0 ? (
          <div className="text-center py-12 text-[#474553] flex flex-col items-center gap-3">
            <Calendar className="w-12 h-12 text-[#B8B5FF]/50" />
            <p className="text-sm font-medium">아직 저장된 운세 기록이 없습니다.</p>
            <p className="text-xs text-[#787585]">
              오늘의 운세를 확인하면 자동으로 안전하게 기록됩니다.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-5 overflow-y-auto pr-1">
            {/* Score Trend Bar Chart */}
            <div className="bg-[#F7F5FF] p-4 rounded-2xl border border-[#B8B5FF]/30">
              <span className="text-xs font-bold text-[#5947c5] uppercase tracking-wider block mb-3">
                최근 점수 추이
              </span>
              <div className="flex items-end justify-between gap-2 h-28 pt-2 px-2">
                {sorted.slice(0, 7).reverse().map((rec) => {
                  const heightPercent = Math.max(15, rec.score);
                  return (
                    <div key={rec.id} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <span className="text-[11px] font-bold text-[#5947c5]">
                        {rec.score}
                      </span>
                      <div
                        className="w-full max-w-[28px] bg-gradient-to-t from-[#5947c5] to-[#B8B5FF] rounded-t-md transition-all duration-500"
                        style={{ height: `${heightPercent}%` }}
                      />
                      <span className="text-[10px] text-[#474553] truncate max-w-full font-medium">
                        {rec.date.slice(5)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* List of past days */}
            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {sorted.map((rec) => (
                <div
                  key={rec.id}
                  onClick={() => {
                    onSelectDate(rec.date);
                    onClose();
                  }}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 hover:border-[#5947c5]/30 bg-white hover:bg-[#f7f5ff] transition-all cursor-pointer group shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#f1ebff] flex items-center justify-center font-bold text-sm text-[#5947c5] group-hover:scale-105 transition-transform">
                      {rec.score}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#1c1a29]">
                        {rec.dateFormatted || rec.date}
                      </div>
                      <div className="text-xs text-[#5947c5] font-medium">
                        {rec.statusTitle}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#787585] group-hover:text-[#5947c5]">
                    <span>다시 보기</span>
                    <span>→</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-5 mt-4 border-t border-gray-100">
          {sorted.length > 0 ? (
            <button
              onClick={onClearHistory}
              className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 font-medium focus:outline-none"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>기록 전체 비우기</span>
            </button>
          ) : <div />}

          <button
            onClick={onClose}
            className="bg-[#5947c5] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#432eae] transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
