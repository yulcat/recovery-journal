import { useState } from 'react';
import type { AppState, DailyRecord, MilestoneId } from '../types';
import { MILESTONES, MOOD_LABELS, MOOD_COLORS } from '../types';
import { getOrCreateRecord, getDayNumber, todayStr, formatDate, saveState } from '../store';
import PainSlider from './PainSlider';

interface Props {
  state: AppState;
  onChange: (state: AppState) => void;
  onViewTimeline: () => void;
}

export default function TodayView({ state, onChange, onViewTimeline }: Props) {
  const today = todayStr();
  const record = getOrCreateRecord(state, today);
  const dayNum = getDayNumber(state.surgeryDate, today);
  const [medName, setMedName] = useState('');
  const [medTime, setMedTime] = useState('');
  const [mealTime, setMealTime] = useState('');
  const [mealAmount, setMealAmount] = useState<'small'|'medium'|'large'>('medium');
  const [mealNote, setMealNote] = useState('');
  const [waterInput, setWaterInput] = useState('');

  const update = (partial: Partial<DailyRecord>) => {
    const updated: AppState = {
      ...state,
      records: {
        ...state.records,
        [today]: { ...record, ...partial },
      },
    };
    onChange(updated);
    saveState(updated);
  };

  const toggleMilestone = (id: MilestoneId) => {
    const milestones = record.milestones.includes(id)
      ? record.milestones.filter(m => m !== id)
      : [...record.milestones, id];
    update({ milestones });
  };

  const addMedication = () => {
    if (!medName || !medTime) return;
    const medications = [...record.medications, { name: medName, time: medTime }]
      .sort((a, b) => a.time.localeCompare(b.time));
    update({ medications });
    setMedName('');
  };

  const removeMedication = (idx: number) => {
    const medications = record.medications.filter((_, i) => i !== idx);
    update({ medications });
  };

  const addMeal = () => {
    if (!mealTime) return;
    const meals = [...record.meals, { time: mealTime, amount: mealAmount, note: mealNote }]
      .sort((a, b) => a.time.localeCompare(b.time));
    update({ meals });
    setMealNote('');
  };

  const addWater = () => {
    const ml = parseInt(waterInput);
    if (!ml || ml <= 0) return;
    update({ waterMl: record.waterMl + ml });
    setWaterInput('');
  };

  const dayLabel = dayNum === 0 ? '수술 당일' : dayNum > 0 ? `D+${dayNum}` : `D${dayNum}`;

  return (
    <div className="min-h-screen bg-indigo-950 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-violet-900 to-indigo-900 px-6 pt-10 pb-6">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-bold text-white">💜 {state.patientName}의 회복 일지</h1>
          <button onClick={onViewTimeline} className="text-indigo-300 text-sm">
            📋 기록
          </button>
        </div>
        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-bold text-violet-300">{dayLabel}</span>
          <span className="text-indigo-300">{formatDate(today)}</span>
        </div>
        {dayNum >= 0 && (
          <div className="mt-2 bg-indigo-800/50 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-violet-400 rounded-full transition-all"
              style={{ width: `${Math.min(100, (dayNum / 14) * 100)}%` }}
            />
          </div>
        )}
        {dayNum >= 0 && (
          <p className="text-indigo-400 text-xs mt-1">
            {dayNum < 14 ? `일반적으로 ${14 - dayNum}일 후면 일상으로 돌아갈 수 있어요` : '수고 많으셨어요! 🌸'}
          </p>
        )}
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Mood */}
        <section className="bg-indigo-900 rounded-2xl p-4">
          <h2 className="text-indigo-200 font-bold mb-3">😊 오늘 기분은?</h2>
          <div className="flex gap-2">
            {[1,2,3,4,5].map(n => (
              <button
                key={n}
                onClick={() => update({ mood: n })}
                className={`flex-1 py-2 rounded-xl text-lg transition-all ${
                  record.mood === n
                    ? 'bg-violet-600 scale-110 shadow-lg'
                    : 'bg-indigo-800 hover:bg-indigo-700'
                }`}
              >
                {MOOD_LABELS[n].split(' ')[0]}
              </button>
            ))}
          </div>
          {record.mood > 0 && (
            <p className={`text-center mt-2 text-sm font-bold ${MOOD_COLORS[record.mood]}`}>
              {MOOD_LABELS[record.mood]}
            </p>
          )}
        </section>

        {/* Pain Map */}
        <section className="bg-indigo-900 rounded-2xl p-4">
          <h2 className="text-indigo-200 font-bold mb-3">🩺 통증 지도</h2>
          <PainSlider label="복부/절개 부위" emoji="🔵" value={record.pain.abdomen}
            onChange={v => update({ pain: { ...record.pain, abdomen: v } })} />
          <PainSlider label="허리/등" emoji="🟢" value={record.pain.back}
            onChange={v => update({ pain: { ...record.pain, back: v } })} />
          <PainSlider label="다리/다리 저림" emoji="🟡" value={record.pain.legs}
            onChange={v => update({ pain: { ...record.pain, legs: v } })} />
          <PainSlider label="전체 통증" emoji="🔴" value={record.pain.overall}
            onChange={v => update({ pain: { ...record.pain, overall: v } })} />
        </section>

        {/* Milestones */}
        <section className="bg-indigo-900 rounded-2xl p-4">
          <h2 className="text-indigo-200 font-bold mb-3">🏆 오늘의 성취</h2>
          <div className="grid grid-cols-2 gap-2">
            {MILESTONES.map(m => {
              const done = record.milestones.includes(m.id);
              // Check if done in any previous day
              const prevDone = !done && Object.entries(state.records).some(
                ([d, r]) => d !== today && r.milestones.includes(m.id)
              );
              return (
                <button
                  key={m.id}
                  onClick={() => !prevDone && toggleMilestone(m.id)}
                  className={`flex items-center gap-2 p-3 rounded-xl text-left text-sm transition-all ${
                    done
                      ? 'bg-violet-700 text-white shadow-lg'
                      : prevDone
                        ? 'bg-indigo-800/50 text-indigo-500 cursor-default'
                        : 'bg-indigo-800 text-indigo-300 hover:bg-indigo-700'
                  }`}
                >
                  <span className="text-lg">{m.emoji}</span>
                  <span>{m.label}</span>
                  {prevDone && <span className="ml-auto text-xs">✓이전</span>}
                </button>
              );
            })}
          </div>
        </section>

        {/* Medications */}
        <section className="bg-indigo-900 rounded-2xl p-4">
          <h2 className="text-indigo-200 font-bold mb-3">💊 복약 기록</h2>
          {record.medications.map((med, i) => (
            <div key={i} className="flex items-center justify-between bg-indigo-800 rounded-xl px-4 py-2 mb-2">
              <span className="text-indigo-100 text-sm">{med.time} — {med.name}</span>
              <button onClick={() => removeMedication(i)} className="text-indigo-400 hover:text-red-400 ml-2">✕</button>
            </div>
          ))}
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={medName}
              onChange={e => setMedName(e.target.value)}
              placeholder="약 이름"
              className="flex-1 bg-indigo-800 text-white rounded-xl px-3 py-2 text-sm placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <input
              type="time"
              value={medTime}
              onChange={e => setMedTime(e.target.value)}
              className="w-24 bg-indigo-800 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <button
              onClick={addMedication}
              className="bg-violet-600 hover:bg-violet-500 text-white rounded-xl px-3 py-2 text-sm font-bold"
            >
              +
            </button>
          </div>
        </section>

        {/* Meals */}
        <section className="bg-indigo-900 rounded-2xl p-4">
          <h2 className="text-indigo-200 font-bold mb-3">🍽️ 식사 기록</h2>
          {record.meals.map((meal, i) => (
            <div key={i} className="flex items-center bg-indigo-800 rounded-xl px-4 py-2 mb-2 text-sm">
              <span className="text-indigo-300 mr-2">{meal.time}</span>
              <span className="text-indigo-100">
                {meal.amount === 'small' ? '조금' : meal.amount === 'medium' ? '보통' : '잘 먹음'}
                {meal.note && ` — ${meal.note}`}
              </span>
            </div>
          ))}
          <div className="flex gap-2 mt-2 flex-wrap">
            <input
              type="time"
              value={mealTime}
              onChange={e => setMealTime(e.target.value)}
              className="w-24 bg-indigo-800 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <div className="flex gap-1">
              {(['small','medium','large'] as const).map(a => (
                <button
                  key={a}
                  onClick={() => setMealAmount(a)}
                  className={`px-3 py-2 rounded-xl text-sm transition-all ${
                    mealAmount === a ? 'bg-violet-600 text-white' : 'bg-indigo-800 text-indigo-300'
                  }`}
                >
                  {a === 'small' ? '조금' : a === 'medium' ? '보통' : '잘 먹음'}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={mealNote}
              onChange={e => setMealNote(e.target.value)}
              placeholder="메뉴 (선택)"
              className="flex-1 bg-indigo-800 text-white rounded-xl px-3 py-2 text-sm placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <button
              onClick={addMeal}
              className="bg-violet-600 hover:bg-violet-500 text-white rounded-xl px-4 py-2 text-sm font-bold"
            >
              추가
            </button>
          </div>
        </section>

        {/* Water */}
        <section className="bg-indigo-900 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-indigo-200 font-bold">💧 수분 섭취</h2>
            <span className="text-violet-300 font-bold text-lg">{record.waterMl}ml</span>
          </div>
          <div className="h-3 bg-indigo-800 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-blue-400 rounded-full transition-all"
              style={{ width: `${Math.min(100, (record.waterMl / 1500) * 100)}%` }}
            />
          </div>
          <p className="text-indigo-500 text-xs mb-3">목표: 1,500ml (산후 회복 권장)</p>
          <div className="flex gap-2">
            {[150, 200, 250, 350].map(ml => (
              <button
                key={ml}
                onClick={() => update({ waterMl: record.waterMl + ml })}
                className="flex-1 bg-indigo-800 hover:bg-indigo-700 text-indigo-200 rounded-xl py-2 text-sm transition-all"
              >
                +{ml}
              </button>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <input
              type="number"
              value={waterInput}
              onChange={e => setWaterInput(e.target.value)}
              placeholder="직접 입력 (ml)"
              className="flex-1 bg-indigo-800 text-white rounded-xl px-3 py-2 text-sm placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <button
              onClick={addWater}
              className="bg-violet-600 hover:bg-violet-500 text-white rounded-xl px-4 py-2 text-sm font-bold"
            >
              +
            </button>
          </div>
        </section>

        {/* Daily Note */}
        <section className="bg-indigo-900 rounded-2xl p-4">
          <h2 className="text-indigo-200 font-bold mb-3">💌 오늘 한 줄</h2>
          <textarea
            value={record.note}
            onChange={e => update({ note: e.target.value })}
            placeholder="오늘 어땠나요? 뭐든 적어보세요..."
            rows={3}
            className="w-full bg-indigo-800 text-white rounded-xl px-4 py-3 text-sm placeholder-indigo-400 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </section>
      </div>
    </div>
  );
}
