import type { AppState } from '../types';
import { MILESTONES, MOOD_LABELS } from '../types';
import { getDayNumber, formatDate } from '../store';

interface Props {
  state: AppState;
  onClose: () => void;
}

export default function ShareModal({ state, onClose }: Props) {
  const dates = Object.keys(state.records).sort();

  const generateReport = () => {
    const lines: string[] = [];
    lines.push(`📋 ${state.patientName} 산후 회복 경과 보고`);
    lines.push(`수술일: ${formatDate(state.surgeryDate)}`);
    lines.push('');

    // Milestones achieved
    const allMilestones: { id: string; date: string }[] = [];
    Object.entries(state.records).forEach(([date, r]) => {
      r.milestones.forEach(m => allMilestones.push({ id: m, date }));
    });

    if (allMilestones.length > 0) {
      lines.push('🏆 달성 마일스톤:');
      allMilestones.forEach(({ id, date }) => {
        const m = MILESTONES.find(x => x.id === id);
        if (m) lines.push(`  ${m.emoji} ${m.label} — ${formatDate(date)}`);
      });
      lines.push('');
    }

    // Daily pain summary
    lines.push('📊 날짜별 통증 경과:');
    dates.forEach(date => {
      const r = state.records[date];
      const d = getDayNumber(state.surgeryDate, date);
      const dl = d === 0 ? 'D-day' : d > 0 ? `D+${d}` : `D${d}`;
      const mood = r.mood > 0 ? ` / ${MOOD_LABELS[r.mood]}` : '';
      lines.push(
        `  ${dl} (${formatDate(date)}): 복부${r.pain.abdomen} 허리${r.pain.back} 다리${r.pain.legs} 전체${r.pain.overall}${mood}`
      );
      if (r.note) lines.push(`    📝 ${r.note}`);
    });

    return lines.join('\n');
  };

  const report = generateReport();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(report).then(() => {
      alert('클립보드에 복사되었어요!');
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-end justify-center z-50" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-indigo-900 rounded-t-2xl p-5 max-h-[80vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold">📋 의료진 공유용 요약</h2>
          <button onClick={onClose} className="text-indigo-400">✕</button>
        </div>
        <textarea
          readOnly
          value={report}
          rows={10}
          className="w-full bg-indigo-800 text-indigo-100 rounded-xl p-4 text-xs font-mono resize-none focus:outline-none flex-1 overflow-y-auto"
        />
        <button
          onClick={copyToClipboard}
          className="w-full mt-4 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl py-3"
        >
          📋 복사하기
        </button>
      </div>
    </div>
  );
}
