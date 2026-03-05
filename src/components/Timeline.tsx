import type { AppState } from '../types';
import { MILESTONES, MOOD_LABELS, MOOD_COLORS } from '../types';
import { getDayNumber, formatDate } from '../store';

interface Props {
  state: AppState;
  onBack: () => void;
  onShare: () => void;
}

const PAIN_EMOJI = ['🟢', '🟡', '🟠', '🔴', '🔴', '❗'];

export default function Timeline({ state, onBack, onShare }: Props) {
  const dates = Object.keys(state.records).sort().reverse();

  // All milestones achieved
  const allMilestones = new Set<string>();
  Object.values(state.records).forEach(r => r.milestones.forEach(m => allMilestones.add(m)));

  return (
    <div className="min-h-screen bg-indigo-950 pb-24">
      <div className="bg-gradient-to-br from-violet-900 to-indigo-900 px-6 pt-10 pb-6">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="text-indigo-300">← 오늘</button>
          <h1 className="text-white font-bold">📋 회복 기록</h1>
          <button onClick={onShare} className="text-violet-300 text-sm">공유</button>
        </div>
      </div>

      {/* Milestones Summary */}
      <div className="px-4 py-4">
        <div className="bg-indigo-900 rounded-2xl p-4 mb-4">
          <h2 className="text-indigo-200 font-bold mb-3">🏆 달성한 마일스톤</h2>
          <div className="grid grid-cols-3 gap-2">
            {MILESTONES.map(m => {
              const done = allMilestones.has(m.id);
              const date = Object.entries(state.records).find(([, r]) => r.milestones.includes(m.id))?.[0];
              return (
                <div
                  key={m.id}
                  className={`text-center p-2 rounded-xl ${done ? 'bg-violet-800' : 'bg-indigo-800/50 opacity-50'}`}
                >
                  <div className="text-2xl">{m.emoji}</div>
                  <div className="text-xs text-indigo-200 mt-1">{m.label}</div>
                  {done && date && (
                    <div className="text-xs text-violet-300 mt-0.5">{formatDate(date)}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Daily cards */}
        {dates.length === 0 ? (
          <div className="text-center text-indigo-500 py-12">
            <div className="text-4xl mb-3">📖</div>
            <p>아직 기록이 없어요</p>
            <p className="text-sm mt-1">오늘 페이지에서 기록을 시작해보세요</p>
          </div>
        ) : (
          <div className="space-y-3">
            {dates.map(date => {
              const r = state.records[date];
              const dayNum = getDayNumber(state.surgeryDate, date);
              const dayLabel = dayNum === 0 ? 'D-day' : dayNum > 0 ? `D+${dayNum}` : `D${dayNum}`;
              return (
                <div key={date} className="bg-indigo-900 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-violet-300 font-bold mr-2">{dayLabel}</span>
                      <span className="text-indigo-300 text-sm">{formatDate(date)}</span>
                    </div>
                    {r.mood > 0 && (
                      <span className={`text-sm font-bold ${MOOD_COLORS[r.mood]}`}>
                        {MOOD_LABELS[r.mood]}
                      </span>
                    )}
                  </div>

                  {/* Pain */}
                  <div className="flex gap-3 text-sm mb-2">
                    <span>복부{PAIN_EMOJI[r.pain.abdomen]}{r.pain.abdomen}</span>
                    <span>허리{PAIN_EMOJI[r.pain.back]}{r.pain.back}</span>
                    <span>다리{PAIN_EMOJI[r.pain.legs]}{r.pain.legs}</span>
                    <span className="text-indigo-400">전체:{r.pain.overall}</span>
                  </div>

                  {/* Milestones */}
                  {r.milestones.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {r.milestones.map(id => {
                        const m = MILESTONES.find(x => x.id === id);
                        return m ? (
                          <span key={id} className="bg-violet-800 text-violet-100 text-xs px-2 py-1 rounded-full">
                            {m.emoji} {m.label}
                          </span>
                        ) : null;
                      })}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex gap-4 text-xs text-indigo-400">
                    {r.medications.length > 0 && <span>💊 복약 {r.medications.length}회</span>}
                    {r.meals.length > 0 && <span>🍽️ 식사 {r.meals.length}회</span>}
                    {r.waterMl > 0 && <span>💧 {r.waterMl}ml</span>}
                  </div>

                  {/* Note */}
                  {r.note && (
                    <p className="text-indigo-300 text-sm mt-2 italic">"{r.note}"</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
