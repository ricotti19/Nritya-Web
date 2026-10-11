import React from 'react';
export function WhatIsBN() {
  return (
    <div className="mt-10 bg-amber-900/[0.06] border border-amber-400/10 p-10 md:p-14 rounded-[2rem] backdrop-blur-2xl shadow-2xl transition-all max-w-6xl">
      <h2 className="text-4xl font-black mb-6 text-rose-700 uppercase tracking-widest">
        The Geometry of Devotion
      </h2>
      <p className="text-slate-300 text-2xl leading-relaxed mb-6">
        Bharatanatyam is an Indian classical dance form structured explicitly around clean geometric
        architecture, spatial lines, alignment, and emotional expression. It is one of the most respected,
        codified, rigorous, and widely practiced art forms in the world, especially in the South Asian
        region/diaspora, with a history spanning over 2000 years. The dance is deeply intertwined with Hindu
        religious themes and spiritual ideas, often depicting stories from Hindu mythology and scriptures. The
        name "Bharatanatyam" is derived from the Sanskrit words "Bha" (expression), "Ra" (music), "Ta" (rhythm),
        and "Natyam" (dance), reflecting the art form's holistic integration of these elements.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-black/30 p-5 rounded-xl border border-white/5">
          <span className="text-2xl">🎭</span>
          <h3 className="font-bold text-rose-600 mt-2 uppercase tracking-wider text-2xl">Bhava (Expression)</h3>
          <p className="text-rose-1000 text-lg mt-1">
            Conveying stories and complex emotional narratives using refined facial focus.
          </p>
        </div>
        <div className="bg-black/30 p-5 rounded-xl border border-white/5">
          <span className="text-2xl">🎵</span>
          <h3 className="font-bold text-rose-600 mt-2 uppercase tracking-wider text-2xl">Raga (Melody)</h3>
          <p className="text-rose-1000 text-lg mt-1">
            The tonal framework of classical compositions guiding musical interaction.
          </p>
        </div>
        <div className="bg-black/30 p-5 rounded-xl border border-white/5">
          <span className="text-2xl">🥁</span>
          <h3 className="font-bold text-rose-600 mt-2 uppercase tracking-wider text-2xl">Tala (Rhythm)</h3>
          <p className="text-rose-1000 text-lg mt-1">
            Mathematical structural rhythm interpreted by dynamic, rapid footwork strikes and various precise,
            synchronized mudras (hand gestures).
          </p>
        </div>
      </div>
    </div>
  );
}

export function WhyLearnBN() {
  return (
    <div className="bg-amber-600/[0.06] border border-amber-400/10 p-10 md:p-14 rounded-[2rem] backdrop-blur-3xl shadow-2xl transition-all max-w-5xl">
      <h2 className="text-4xl font-black mb-6 text-rose-600 uppercase tracking-widest">Why Train Your Stance?</h2>
      <p className="text-slate-300 text-2xl leading-relaxed mb-6">
        Training your physical posture builds a deep foundational layer of mindfulness that cleanly mirrors
        spatial engineering layouts.
      </p>
      <ul className="space-y-4 text-slate-300 text-2xl">
        <li className="flex items-start gap-3">
          <span className="text-rose-600 mt-1">⚡</span>
          <div>
            <strong>Biomechanical Precision:</strong> The core Aramandi stance strengthens overall stability,
            posture balance, and physical structural vectors.
          </div>
        </li>
        <li className="flex items-start gap-3">
          <span className="text-rose-600 mt-1">🧠</span>
          <div>
            <strong>Spatial Awareness:</strong> Coordinating precise hand mudras alongside physical alignments
            refines tracking, coordination, and motor control.
          </div>
        </li>
        <li className="flex items-start gap-3">
          <span className="text-rose-600 mt-1">✨</span>
          <div>
            <strong>Preserving Heritage via AI:</strong> Merging ancient choreography rules with edge computer
            vision models ensures art validation scales correctly.
          </div>
        </li>
      </ul>
    </div>
  );
}
