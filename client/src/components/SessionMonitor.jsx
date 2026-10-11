import React from 'react';
function SessionMonitor({
  sessionId,
  moveName,
  difficulty,
  setDifficulty,
  currentViewingSession,
  score,
  sessionSaved,
  onSave,
  onReturn,
}) {
  return (
    <section className="mb-8 p-4 bg-slate-900/60 border border-white/10 rounded-2xl backdrop-blur-md flex flex-wrap gap-6 items-center justify-between shadow-xl">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="text-xs font-bold uppercase tracking-widest text-rose-400">
          Session ID:{' '}
          <span className="text-rose-1000 font-mono text-sm ml-1 select-all">{sessionId || 'Loading...'}</span>
        </div>
        <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />
        <div className="text-xs font-bold uppercase tracking-widest text-rose-400">
          Focus Posture: <span className="text-slate-200 text-sm ml-1">{moveName}</span>
        </div>
        <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />
        <div className="text-xs font-bold uppercase tracking-widest text-rose-400">
          Difficulty:
          <select
            value={difficulty}
            disabled={!!currentViewingSession}
            onChange={(e) => setDifficulty(e.target.value)}
            className="ml-2 bg-slate-800 text-rose-200 border border-white/10 rounded-md px-2 py-0.5 text-xs font-medium focus:outline-none focus:border-rose-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      {score !== null && !currentViewingSession && (
        <button
          onClick={onSave}
          className="px-4 py-2 rounded-xl font-bold uppercase text-xs tracking-wider transition-all shadow-md bg-rose-600 hover:bg-rose-500 text-white border border-transparent active:scale-95"
        >
          {sessionSaved ? '✓ Logged (Save Again)' : 'Save Practice Data'}
        </button>
      )}

      {currentViewingSession && (
        <button
          onClick={onReturn}
          className="px-4 py-2 rounded-xl font-bold uppercase text-xs tracking-wider transition-all shadow-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 active:scale-95"
        >
          Return to Upload Page
        </button>
      )}
    </section>
  );
}

export default SessionMonitor;
