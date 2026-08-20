export type Gender = 'female' | 'male' | 'skip';

export interface UserProfile {
  nickname: string;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  birthTime?: string;
  unknownTime?: boolean;
  gender: Gender;
}

export interface FortuneCategoryDetail {
  id: 'love' | 'money' | 'work' | 'health';
  name: string;
  nameEn: string;
  score: number;
  stars: number; // 1 to 5
  icon: string;
  summary: string;
  detail: string;
  tip: string;
}

export interface LuckyPoint {
  number: number;
  colorName: string;
  colorHex: string;
  item: string;
  time: string;
  food: string;
}

export interface FortuneResult {
  id: string;
  dateStr: string; // e.g. 2026-08-20
  dateFormatted: string; // e.g. 2026년 8월 20일 목요일
  overallScore: number;
  statusTitle: string;
  statusDescription: string;
  categories: {
    love: FortuneCategoryDetail;
    money: FortuneCategoryDetail;
    work: FortuneCategoryDetail;
    health: FortuneCategoryDetail;
  };
  lucky: LuckyPoint;
  dailyQuote: string;
  createdAt: string;
}

export interface HistoryRecord {
  id: string;
  date: string;
  dateFormatted: string;
  score: number;
  statusTitle: string;
  quote: string;
  categories: {
    love: number;
    money: number;
    work: number;
    health: number;
  };
}

export type ScreenState = 'hero' | 'input' | 'result';
