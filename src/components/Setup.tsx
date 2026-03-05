import { useState } from 'react';
import type { AppState } from '../types';
import { todayStr } from '../store';

interface Props {
  onSave: (state: AppState) => void;
}

export default function Setup({ onSave }: Props) {
  const [name, setName] = useState('');
  const [date, setDate] = useState(todayStr());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ surgeryDate: date, patientName: name || '엄마', records: {} });
  };

  return (
    <div className="min-h-screen bg-indigo-950 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">💜</div>
          <h1 className="text-2xl font-bold text-white mb-2">산후 회복 일지</h1>
          <p className="text-indigo-300 text-sm">매일의 회복을 기록해요</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-indigo-900 rounded-2xl p-6 space-y-5">
          <div>
            <label className="block text-indigo-200 text-sm mb-2">이름 (선택)</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="지윤님"
              className="w-full bg-indigo-800 text-white rounded-xl px-4 py-3 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="block text-indigo-200 text-sm mb-2">수술일 (제왕절개 날짜)</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full bg-indigo-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white font-bold rounded-xl py-3 transition-colors"
          >
            시작하기 🌸
          </button>
        </form>

        <p className="text-center text-indigo-500 text-xs mt-4">
          모든 기록은 이 기기에만 저장돼요
        </p>
      </div>
    </div>
  );
}
