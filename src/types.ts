export interface PainMap {
  abdomen: number;  // 복부/절개
  back: number;     // 허리
  legs: number;     // 다리
  overall: number;  // 전체
}

export interface Medication {
  name: string;
  time: string; // HH:MM
}

export interface Meal {
  time: string;
  amount: 'small' | 'medium' | 'large';
  note: string;
}

export const MILESTONES = [
  { id: 'sit-up',      emoji: '🛏️', label: '침대에 혼자 앉기' },
  { id: 'stand',       emoji: '🦯', label: '혼자 서기' },
  { id: 'walk-toilet', emoji: '🚶', label: '화장실 혼자 가기' },
  { id: 'first-feed',  emoji: '🍼', label: '첫 수유 시도' },
  { id: 'breastfeed',  emoji: '🤱', label: '모유수유 성공' },
  { id: 'shower',      emoji: '🚿', label: '샤워 혼자 하기' },
  { id: 'stairs',      emoji: '🪜', label: '계단 오르기' },
  { id: 'discharged',  emoji: '🏠', label: '퇴원!' },
  { id: 'walk-outside',emoji: '🌤️', label: '외부 산책' },
] as const;

export type MilestoneId = typeof MILESTONES[number]['id'];

export interface DailyRecord {
  date: string;           // YYYY-MM-DD
  pain: PainMap;
  milestones: MilestoneId[];
  medications: Medication[];
  meals: Meal[];
  waterMl: number;
  note: string;
  mood: number; // 1-5 (1=힘들다, 5=좋다)
}

export interface AppState {
  surgeryDate: string;    // YYYY-MM-DD
  patientName: string;
  records: Record<string, DailyRecord>;
}

export const MOOD_LABELS = ['', '😰 힘들다', '😔 지침', '😐 무난함', '🙂 괜찮다', '😊 좋다'];
export const MOOD_COLORS = ['', 'text-red-400', 'text-orange-400', 'text-yellow-400', 'text-green-400', 'text-emerald-400'];
