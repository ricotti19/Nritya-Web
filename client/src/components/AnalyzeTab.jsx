import React from 'react';
const humanizeFeedback = (text) => {
  if (!text) return '';
  return text.replace('Adjust your', "Pro-tip: Let's refine your");
};

const getFeedbackStyle = (text) => {
  const lowText = text.toLowerCase();
  if (lowText.includes('excellent') || lowText.includes('perfect') || lowText.includes('good')) {
    return { border: 'border-emerald-500/30', bg: 'bg-emerald-950/20', icon: '✨', text: 'text-emerald-400' };
  }
  if (lowText.includes('cave') || lowText.includes('wrong') || lowText.includes('incorrect')) {
    return { border: 'border-rose-500/30', bg: 'bg-rose-950/20', icon: '⚠️', text: 'text-rose-400' };
  }
  return { border: 'border-amber-500/20', bg: 'bg-amber-950/10', icon: '💡', text: 'text-amber-400' };
};

const getGrade = (s) => {
  if (s === null) return 'Awaiting Performance';
  if (s >= 95) return 'Guru or Student? Flawless Form';
  if (s >= 85) return 'Distinction! Now Minor Refinements';
  if (s >= 70) return 'First Class! Room for Refinement';
  if (s >= 50) return 'Solid effort! Keep Practicing';
  return 'Not quite! Keep Practicing';
};

function AnalyzeTab({
  file,
  imageUrl,
  currentViewingSession,
  moveName,
  loading,
  feedback,
  score,
  onFileChange,
  onClearImage,
  onUpload,
}) {
  const displayImage = currentViewingSession?.imageUrl || imageUrl || null;

  return (
    <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* UPLOAD STANCE */}
      <div className="lg:col-span-5 bg-amber-600/[0.06] border border-amber-400/10 p-6 rounded-[2rem] shadow-2xl backdrop-blur-xl">
        <h2 className="text-2xl font-black mb-6 text-rose-1000 uppercase tracking-widest flex items-center gap-3">
          <span className="text-rose-1000 font-bold">01</span>{' '}
          {currentViewingSession ? 'Performance Frame' : 'Upload Stance'}
        </h2>

        <div className="relative border-2 border-dashed border-slate-800 hover:border-rose-600/40 transition-all rounded-[1.5rem] p-4 text-center bg-black/40 group overflow-hidden min-h-[220px] flex items-center justify-center">
          {!file && !imageUrl && !currentViewingSession ? (
            <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer py-8">
              <input type="file" accept="image/*" onChange={onFileChange} className="hidden" />
              <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center mb-3 group-hover:bg-rose-600/20 transition-colors">
                <span className="text-2xl text-slate-400 group-hover:text-rose-600">🪔</span>
              </div>
              <p className="text-slate-200 font-bold group-hover:text-rose-400 transition-colors text-sm">
                Drop Posture Photo (Front, Araimandi)
              </p>
              <p className="text-slate-500 text-xs uppercase tracking-widest mt-1">PNG, JPG up to 10MB</p>
            </label>
          ) : (
            <div className="w-full p-2">
              {displayImage ? (
                <img
                  src={displayImage}
                  alt="Performance Stance View"
                  className="w-full h-auto max-h-[280px] object-contain rounded-[1rem] shadow-2xl border border-white/10"
                />
              ) : (
                <div className="w-full h-[200px] bg-slate-900 rounded-[1rem] flex items-center justify-center border border-white/5">
                  <span className="text-slate-500 text-xs uppercase font-mono tracking-widest">
                    Historical Entry Frame
                  </span>
                </div>
              )}

              <p className="text-sm text-rose-600 font-semibold uppercase mt-3 tracking-wider truncate">
                Target: {file ? file.name : `${moveName} Captured Stance`}
              </p>

              {!currentViewingSession && (
                <button
                  onClick={onClearImage}
                  className="mt-3 px-4 py-1.5 bg-slate-800/80 hover:bg-slate-700 rounded-lg text-lg uppercase tracking-wider font-bold transition-colors"
                >
                  Clear Image
                </button>
              )}
            </div>
          )}
        </div>

        {!currentViewingSession && (
          <button
            onClick={onUpload}
            disabled={loading || !file}
            className={`w-full mt-6 bg-rose-600 hover:bg-rose-500 disabled:bg-yellow-600 text-white font-black py-4 rounded-[1.5rem] transition-all shadow-xl shadow-rose-950/20 active:scale-[0.99] uppercase tracking-[0.15em] text-sm ${
              loading || !file ? 'opacity-60 disabled:text-rose-900 disabled:cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Analyzing Alignment...' : 'Begin Posture Analysis'}
          </button>
        )}
      </div>

      {/* METRICS & GURU FEEDBACK */}
      <div className="lg:col-span-7 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-amber-600/[0.04] border border-amber-400/10 p-6 rounded-[1.5rem] backdrop-blur-xl group transition-all">
            <p className="text-rose-600 text-2xl font-black uppercase tracking-[0.2em]">Alignment Accuracy</p>
            <p className="text-5xl md:text-6xl font-black mt-2 text-rose-800 tracking-tighter transition-transform group-hover:scale-[1.02]">
              {score !== null ? `${score}%` : '--'}
            </p>
          </div>
          <div className="bg-amber-600/[0.04] border border-amber-400/10 p-6 rounded-[1.5rem] backdrop-blur-xl flex flex-col justify-center">
            <p className="text-rose-600 text-2xl font-black uppercase tracking-[0.2em]">Guru Ranking</p>
            <p className="text-xl md:text-xl font-black mt-3 text-slate-200 tracking-tight">{getGrade(score)}</p>
          </div>
        </div>

        <div className="bg-amber-600/[0.06] border border-amber-400/10 p-6 md:p-8 rounded-[2rem] backdrop-blur-xl min-h-[300px] shadow-2xl">
          <h2 className="text-2xl font-black mb-6 text-rose-600 uppercase tracking-widest flex items-center gap-3">
            <span className="text-rose-700 font-bold">02</span> Guru's Observations
          </h2>

          <div className="space-y-3">
            {feedback.length > 0 ? (
              feedback.map((note, i) => {
                const style = getFeedbackStyle(note);
                return (
                  <div
                    key={i}
                    className={`flex gap-4 p-4 ${style.bg} border ${style.border} rounded-xl transition-all hover:scale-[1.01]`}
                  >
                    <span className="text-lg mt-0.5">{style.icon}</span>
                    <div className="flex-1">
                      <p className="text-slate-200 text-sm leading-relaxed font-medium">
                        {humanizeFeedback(note)}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-12 w-full">
                {loading ? (
                  <>
                    <div className="w-10 h-10 border-2 border-rose-500/20 rounded-full border-t-rose-500 animate-spin mb-4" />
                    <p className="text-rose-700 text-lg font-black tracking-[0.2em] uppercase animate-pulse">
                      Running Computer Vision Model...
                    </p>
                  </>
                ) : (
                  <>
                    <span className="text-sm text-rose-600 mb-2">📷</span>
                    <p className="text-rose-1000 text-[14px] font-black tracking-[0.2em] uppercase text-center">
                      Awaiting Performance Frame
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default AnalyzeTab;
