interface Props {
  label: string;
  emoji: string;
  value: number;
  onChange: (v: number) => void;
}

const PAIN_COLORS = [
  'bg-green-400',
  'bg-lime-400',
  'bg-yellow-400',
  'bg-orange-400',
  'bg-red-400',
  'bg-red-600',
];

const PAIN_LABELS = ['없음', '살짝', '좀 있음', '꽤 아픔', '많이 아픔', '매우 심함'];

export default function PainSlider({ label, emoji, value, onChange }: Props) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-indigo-200 text-sm">{emoji} {label}</span>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${PAIN_COLORS[value]} text-white`}>
          {PAIN_LABELS[value]}
        </span>
      </div>
      <div className="flex gap-2">
        {[0,1,2,3,4,5].map(n => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={`flex-1 h-8 rounded-lg text-xs font-bold transition-all ${
              value === n
                ? `${PAIN_COLORS[n]} text-white scale-110 shadow-lg`
                : 'bg-indigo-800 text-indigo-400 hover:bg-indigo-700'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}
