import React from 'react';
function HistoryTab({ sessionHistory, onSelectSession, onDeleteSession, onClearHistory }) {
  return (
    <main className="bg-slate-950/60 border border-white/5 p-10 md:p-12 rounded-[2rem] backdrop-blur-xl shadow-2xl w-full max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-white/10 gap-4">
        <div>
          <h2 className="text-3xl font-black text-rose-600 uppercase tracking-wider">
            Historical Practice Tracking Logs
          </h2>
          <p className="text-sm text-rose-600 mt-1">
          </p>
        </div>
        {sessionHistory.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-xs uppercase tracking-widest bg-rose-950/60 hover:bg-rose-600 border border-rose-500/20 hover:border-rose-500 text-rose-300 hover:text-white px-5 py-2.5 rounded-xl transition-all font-bold shadow-md active:scale-95"
          >
            Purge Complete Log History
          </button>
        )}
      </div>

      {sessionHistory.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-black/20 rounded-2xl border border-dashed border-white/5">
          <span className="text-8xl opacity-40 mb-4">⏳</span>
          <p className="text-base text-rose-100 font-semibold">
            No data yet!
          </p>
          <p className="text-lg text-rose-100 mt-1 max-w-xs">
            Run a posture analysis and click "Save Practice Data" to fill up this tracker space.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto max-h-[600px] pr-2 scrollbar-thin">
          {sessionHistory.map((sess, idx) => (
            <div
              key={sess._id || idx}
              onClick={() => onSelectSession(sess)}
              className="p-5 bg-white/[0.02] hover:bg-rose-600/10 border border-white/5 hover:border-rose-500/30 rounded-2xl cursor-pointer transition-all flex justify-between items-center group active:scale-[0.99] shadow-lg"
            >
              <div className="truncate pr-4">
                <span className="text-[10px] bg-rose-600/20 text-rose-400 font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                  Session {idx + 1}
                </span>
                <h4 className="text-lg font-bold text-rose-600 mt-2 group-hover:text-rose-400 transition-colors truncate">
                  {sess.moveName || 'Aramandi'}
                </h4>
                <p className="text-xs text-rose-600 mt-0.5 font-medium">
                  Difficulty: <span className="text-rose-600">{sess.difficulty || 'Intermediate'}</span>
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-2xl font-black text-rose-500 font-mono bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-500/10 shadow-inner">
                  {sess.accuracyHistory && sess.accuracyHistory.length > 0
                    ? sess.accuracyHistory[sess.accuracyHistory.length - 1]
                    : 0}
                  %
                </div>
                <span className="text-[10px] text-rose-400 font-bold tracking-wider uppercase block mt-2 hover:underline">
                  View Details →
                </span>
                <button
                  onClick={(e) => onDeleteSession(sess._id, e)}
                  className="mt-2 text-[10px] text-rose-700 hover:text-rose-400 uppercase tracking-wider font-bold transition-colors"
                >
                  🗑Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default HistoryTab;
