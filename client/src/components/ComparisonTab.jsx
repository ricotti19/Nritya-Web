import React from 'react';
import { useState, useEffect } from 'react';

// Good / optimal images
import goodAramandi1 from '../assets/exOfGoodAramandiForPg.png';
import goodAramandi2 from '../assets/exOfGoodAramandiForPg2.png';
import goodAramandi3 from '../assets/exOfGoodAramandiForPg3.png';
import goodAramandi4 from '../assets/exOfGoodAramandiForPg4.png';
import goodAramandi5 from '../assets/exOfGoodAramandiForPg5.png';

// Bad images
import badAramandi1 from '../assets/exOfBadAramandiForPg.png';
import badAramandi2 from '../assets/exOfBadAramandiForPg2.png';
import badAramandi3 from '../assets/exOfBadAramandiForPg3.png';
import badAramandi4 from '../assets/exOfBadAramandiForPg4.png';
import badAramandi5 from '../assets/exOfBadAramandiForPg5.png';

const goodImages = [goodAramandi1, goodAramandi2, goodAramandi3, goodAramandi4, goodAramandi5];
const badImages = [badAramandi1, badAramandi2, badAramandi3, badAramandi4, badAramandi5];

function ComparisonTab() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % goodImages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-950/40 border border-white/5 p-8 md:p-10 rounded-[2rem] backdrop-blur-3xl shadow-2xl transition-all w-full">
      <h2 className="text-4xl font-black mb-4 text-rose-600 uppercase tracking-widest">
        Aramandi (half squat): safe vs incorrect
      </h2>
      <p className="text-slate-300 text-xl leading-relaxed mb-8">
        Study the structural geometric contrasts between an optimally aligned Aramandi and a pathologically
        collapsed one. Understanding these visual cues is key to internalizing injury-free, sustainable dance
        techniques. Changes often look subtle but have huge implications for joint health; even distinguishing
        proper vs improper form requires practice and patience.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* GOOD */}
        <div className="bg-emerald-950/10 border border-emerald-500/20 p-6 rounded-3xl flex flex-col items-center">
          <div className="w-full text-left mb-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-emerald-500 rounded-full" />
              <h3 className="font-black text-emerald-400 uppercase tracking-wider text-2xl">AIM FOR:</h3>
            </div>
          </div>

          <div className="w-full bg-black/40 border border-emerald-500/10 rounded-2xl overflow-hidden min-h-[280px] p-4">
            <img
              src={goodImages[currentImageIndex]}
              alt={`Correct Form Frame ${currentImageIndex + 1}`}
              className="w-full h-[400px] object-contain rounded-lg"
            />
          </div>

          <footer className="mt-6 w-full border-t border-emerald-500/10 pt-4">
            <p className="text-slate-300 text-lg leading-relaxed">
              Thighs remain anchored toward the lower landscape, resulting in an open diamond (not oval) shape
              between the legs. The knees track cleanly outward right over the second or third toes, dispersing
              core kinetic loads equally across the skeletal framework. Spine is straight, the heels are planted
              on the ground, and the pelvis is as neutral as possible for balance and structural integrity.
              Everybody's ideal Aramandi will look a little different based on their unique body structure, but
              the key is following those core guidelines.
            </p>
          </footer>
        </div>

        {/* BAD */}
        <div className="bg-rose-950/10 border border-rose-500/20 p-6 rounded-3xl flex flex-col items-center">
          <div className="w-full text-left mb-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-rose-500 rounded-full" />
              <h3 className="font-black text-rose-400 uppercase tracking-wider text-2xl">AVOID:</h3>
            </div>
          </div>

          <div className="w-full bg-black/40 border border-rose-500/10 rounded-2xl overflow-hidden min-h-[280px] p-4">
            <img
              src={badImages[currentImageIndex]}
              alt={`Incorrect Form Frame ${currentImageIndex + 1}`}
              className="w-full h-[400px] object-contain rounded-lg"
            />
          </div>

          <footer className="mt-6 w-full border-t border-rose-500/10 pt-4">
            <p className="text-slate-300 text-lg leading-relaxed">
              Notice the internal knee collapse, tracking forward away from the toes' profile. (Ideally the
              knees are in line with the second or third toes) The pelvis is overarched, worsening the internal
              alignment and concentrating sheer joint force on the knee meniscus. Another mistake is slightly
              lifted heels for fake depth, which ideally comes from the glutes and hip rotators instead of the
              calves. The shoulders/spine are not kept back, and the overall shape of the stance is more oval
              than diamond. A major, though not sole, contributor to knee caving is keeping the heels too close
              together (too far apart is not ideal either on a side note).
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default ComparisonTab;
