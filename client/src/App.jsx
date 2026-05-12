import React, { useState } from 'react';
import axios from 'axios';
import dancerImg from './assets/dancer.png';

function App() {
  const [file, setFile] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);

  const humanizeFeedback = (text) => {
    if (!text) return "";
    if (text.includes("Mudra")) return "Your hand gestures (Mudras) are almost there! Try to hold the fingers a bit more firmly.";
    if (text.includes("posture")) return "Keep that spine tall! A strong posture is the foundation of a great performance.";
    if (text.includes("balance")) return "Focus your gaze (Drishti) on one point to help with your balance.";
    return text.replace("Adjust your", "Pro-tip: Let's refine your");
  };

  const getGrade = (s) => {
    if (s === null) return "Awaiting Performance";
    if (s >= 85) return "Distinction";
    if (s >= 70) return "First Class";
    if (s >= 50) return "Merit";
    return "Keep Practicing";
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select your performance video first!");
    setLoading(true);
    const formData = new FormData();
    formData.append('video', file);
    try {
      const res = await axios.post('http://localhost:5000/analyze', formData);
      const data = res.data.feedback;
      setFeedback(Array.isArray(data) ? data : [data]);
      setScore(res.data.score);
    } catch (err) {
      setFeedback(["The AI Guru is resting. Check your server!"]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-full bg-[#020617] text-slate-100 font-sans overflow-hidden">
      
      {/* 1. ATMOSPHERIC LAYER */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-rose-600/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-[#020617] to-transparent z-10" />
      </div>

      {/* 2. THE DANCER */}
      <div className="absolute inset-0 z-0 flex justify-end items-end pointer-events-none overflow-hidden">
        <img
          src={dancerImg}
          alt="Dancer"
          className="h-[105%] w-auto object-contain object-right-bottom opacity-80 brightness-75 contrast-[1.15] saturate-[1.4] drop-shadow-[0_0_50px_rgba(225,29,72,0.2)]"
        />
      </div>

      {/* 3. THE UI CONTENT LAYER */}
      <div className="relative z-20 max-w-7xl mx-auto h-full flex flex-col p-8 md:p-14">
        
        {/* HEADER SECTION */}
        <header className="mb-12 flex justify-between items-end border-b border-white/5 pb-8">
          <div>
            <h1 className="text-7xl font-normal tracking-wide leading-none" style={{ fontFamily: "'Lobster', cursive" }}>
              Nritya<span className="text-rose-600">Web</span>
            </h1>
            <p className="text-white mt-4 font-bold tracking-[0.2em] uppercase text-[22px] opacity-100">
              Digital Bharatanatyam Mentor
            </p>
          </div>

          <div className="flex items-center gap-3 bg-rose-600/5 px-6 py-2.5 rounded-full border border-rose-600/20 shadow-inner backdrop-blur-md">
            <span className="w-2 h-2 bg-rose-600 rounded-full animate-pulse shadow-[0_0_10px_rgba(225,29,72,0.8)]" />
            <span className="text-rose-600 text-[10px] font-black uppercase tracking-[0.2em]">AI Core: Active</span>
          </div>
        </header>

        {/* MAIN CONTENT GRID */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-10 flex-1 overflow-y-auto pb-10 pr-2 overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          
      {/* LEFT COLUMN: UPLOAD */}
    <div className="lg:col-span-5 flex flex-col gap-6">
      <div className="bg-slate-900/40 border border-white/10 p-10 rounded-[3rem] shadow-2xl backdrop-blur-xl">
        <h2 className="text-sm font-black mb-8 text-slate-500 uppercase tracking-widest flex items-center gap-3">
          <span className="text-rose-600 text-lg">01</span> Upload Session
        </h2>
    
    <div className="relative border-2 border-dashed border-slate-800 hover:border-rose-600/50 transition-all rounded-[2.5rem] p-4 text-center bg-black/40 group overflow-hidden min-h-[200px] flex items-center justify-center">
      <input 
        type="file" 
        accept="video/*"
        onChange={(e) => setFile(e.target.files[0])} 
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
      />
      
      <div className="space-y-2 w-full">
        {file ? (
          <div className="relative z-10 p-2">
            <video 
              src={URL.createObjectURL(file)} 
              className="w-full rounded-[1.5rem] shadow-2xl border border-rose-600/20"
              controls
            />
            <p className="text-[10px] text-rose-600 font-bold uppercase mt-3 tracking-widest">
              Ready for Analysis: {file.name}
            </p>
          </div>
        ) : (
          <>
            <p className="text-slate-200 font-bold group-hover:text-rose-600 transition-colors">
              Drop Performance Video
            </p>
            <p className="text-slate-600 text-[10px] uppercase tracking-widest">MP4, MOV up to 100MB</p>
          </>
        )}
          </div>
        </div>

        <button 
          onClick={handleUpload} 
          disabled={loading} 
          className="w-full mt-8 bg-rose-600 hover:bg-rose-500 text-white font-black py-6 rounded-[2rem] transition-all shadow-xl shadow-rose-900/40 active:scale-[0.98] uppercase tracking-[0.2em] text-xs"
        >
        {loading ? "Analyzing Form..." : "Begin Analysis"}
        </button>
      </div>
    </div>

          {/* RIGHT COLUMN: RESULTS */}
          <div className="lg:col-span-7 space-y-8">
            <div className="grid grid-cols-2 gap-8">
              <div className="bg-slate-900/40 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl group hover:border-rose-600/30 transition-all">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Form Accuracy</p>
                <p className="text-7xl font-black mt-3 text-rose-600 group-hover:scale-105 transition-transform origin-left tracking-tighter">
                  {score !== null ? `${score}%` : "--"}
                </p>
              </div>
              <div className="bg-slate-900/40 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl flex flex-col justify-center">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Guru Ranking</p>
                <p className="text-2xl font-black mt-5 text-slate-100 tracking-tight">{getGrade(score)}</p>
              </div>
            </div>

            <div className="bg-slate-900/40 border border-white/10 p-10 rounded-[3.5rem] backdrop-blur-xl min-h-[350px] shadow-2xl">
              <h2 className="text-sm font-black mb-8 text-slate-500 uppercase tracking-widest flex items-center gap-3">
                <span className="text-rose-600 text-lg">02</span> Guru's Observations
              </h2>
              <div className="space-y-5">
                {feedback.length > 0 ? (
                  feedback.map((note, i) => (
                    <div key={i} className="flex gap-6 p-7 bg-white/[0.02] rounded-[2rem] border border-white/5 hover:bg-white/[0.05] transition-all group">
                      <div className="w-1.5 h-1.5 mt-2 bg-rose-600 rounded-full group-hover:scale-150 transition-transform" />
                      <p className="text-slate-300 text-[16px] leading-relaxed italic font-medium">
                        "{humanizeFeedback(note)}"
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="h-48 flex flex-col items-center justify-center opacity-30">
                    <div className="w-10 h-10 border-2 border-rose-500/30 rounded-full border-t-rose-500 animate-spin mb-6" />
                    <p className="text-rose-600 text-[10px] font-black tracking-[0.3em] uppercase">Awaiting Stream</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );  
}

export default App;