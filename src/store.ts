import type { AppState, DailyRecord, PainMap } from './types';

const STORAGE_KEY = 'recovery-journal-v1';

const defaultPain = (): PainMap => ({ abdomen: 0, back: 0, legs: 0, overall: 0 });

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { surgeryDate: '', patientName: '', records: {} };
}

export function saveState(state: AppState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getOrCreateRecord(state: AppState, date: string): DailyRecord {
  if (state.records[date]) return state.records[date];
  return {
    date,
    pain: defaultPain(),
    milestones: [],
    medications: [],
    meals: [],
    waterMl: 0,
    note: '',
    mood: 0,
  };
}

export function getDayNumber(surgeryDate: string, date: string): number {
  if (!surgeryDate) return 0;
  const d1 = new Date(surgeryDate);
  const d2 = new Date(date);
  return Math.floor((d2.getTime() - d1.getTime()) / 86400000);
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}
