import React from 'react';
import { useState } from 'react';

const RISKS = [
  {
    id: 'knee',
    icon: '🦴',
    title: 'Knee Meniscus Tear & Lateral Shearing',
    body: (
      <>
        When descending into the deep <span className="text-rose-600 font-semibold">Araimandi</span> stance,
        dropping your knees inward instead of outward creates an aggressive rotational shear force across the
        knee joints. This structural failure places high pressure on the medial meniscus and collateral
        ligaments, increasing susceptibility to microscopic fraying or severe structural tearing over time.
      </>
    ),
  },
  {
    id: 'lumbar',
    icon: '⚡',
    title: 'Lumbar Back Pain & Pelvic Malalignment',
    body: (
      <>
        Executing a posture with a "stuck out" pelvis forces an exaggerated hyper-lordosis baseline in the
        lumbar spine. This locks out your core, compressing the lower spinal discs abnormally. Without a flat,
        neutral pelvic tuck, the kinetic vibration of repetitive heavy heel-strikes drops directly into your
        lower back vertebrae instead of dispersing naturally up through the muscle core.
      </>
    ),
  },
  {
    id: 'ankle',
    icon: '🦶',
    title: 'Ankle Pronation & Achilles Tendonitis',
    body: (
      <>
        Allowing body weight to collapse onto the inner arches of the feet tilts the ankles inward. This
        unstable base skews the pull direction of the Achilles tendon during complex rhythmic stamps,
        triggering micro-tears, chronic tendonitis, and planar stability loss throughout the entire structural
        foot foundation.
      </>
    ),
  },
];

function RisksTab() {
  const [open, setOpen] = useState({});
  const toggle = (id) => setOpen((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="bg-rose-950/20 border border-rose-500/20 p-8 md:p-10 rounded-[2rem] backdrop-blur-3xl shadow-2xl transition-all w-full ml-auto">
      <h2 className="text-4xl font-black mb-4 text-rose-600 uppercase tracking-widest">
        Biomechanical Pathologies of Poor Form
      </h2>
      <p className="text-slate-300 text-xl leading-relaxed mb-6">
        Structural lines are not just aesthetic parameters—they are structural safety constraints. Repetitive
        strain on unaligned kinetic chains introduces clear orthopedic risks.
      </p>

      <div className="space-y-6">
        {RISKS.map(({ id, icon, title, body }) => (
          <div
            key={id}
            className="bg-black/40 border border-white/5 p-6 rounded-2xl flex gap-4 items-start cursor-pointer select-none"
            onClick={() => toggle(id)}
          >
            <span className="text-3xl bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">{icon}</span>
            <div>
              <h3 className="font-bold text-rose-600 uppercase tracking-wide text-2xl">{title}</h3>
              {open[id] && <p className="text-slate-300 text-lg mt-2 leading-relaxed">{body}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RisksTab;
