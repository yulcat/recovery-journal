import { useState } from 'react';
import { loadState, saveState } from './store';
import type { AppState } from './types';
import Setup from './components/Setup';
import TodayView from './components/TodayView';
import Timeline from './components/Timeline';
import ShareModal from './components/ShareModal';

type View = 'today' | 'timeline';

export default function App() {
  const [state, setState] = useState<AppState>(loadState);
  const [view, setView] = useState<View>('today');
  const [showShare, setShowShare] = useState(false);

  const handleSetup = (s: AppState) => {
    setState(s);
    saveState(s);
  };

  const handleChange = (s: AppState) => {
    setState(s);
  };

  if (!state.surgeryDate) {
    return <Setup onSave={handleSetup} />;
  }

  return (
    <div className="max-w-md mx-auto relative">
      {view === 'today' ? (
        <TodayView
          state={state}
          onChange={handleChange}
          onViewTimeline={() => setView('timeline')}
        />
      ) : (
        <Timeline
          state={state}
          onBack={() => setView('today')}
          onShare={() => setShowShare(true)}
        />
      )}
      {showShare && (
        <ShareModal state={state} onClose={() => setShowShare(false)} />
      )}
    </div>
  );
}
