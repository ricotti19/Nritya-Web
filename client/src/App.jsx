import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);

  // Friendly Guru Translator
  const humanizeFeedback = (text) => {
    if (text.includes("Mudra")) {
      return "Your hand gestures (Mudras) are almost there! Try to hold the fingers a bit more firmly for a sharper look.";
    }
    if (text.includes("posture")) {
      return "Keep that spine tall! A strong posture is the foundation of a great performance.";
    }
    return text.replace("Adjust your", "Pro-tip: Let's refine your");
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
      setFeedback(["The AI Guru is resting. Please check if your Python server is running!"]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans p-4 md:p-12 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px]" />

      <div className="relative max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-12 border-b border-slate-800 pb-8 flex justify-between items-end">
          <div>
            <h1 className="text-6xl font-black tracking-tighter bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent">
              NRITYA<span className="text-blue-500">WEB</span>
            </h1>
            <p className="text-slate-400 mt-2 font-medium">Digital Bharatanatyam Mentor</p>
          </div>
          <div className="bg-blue-500/10 text-blue-400 px-4 py-1 rounded-full text-xs font-bold border border-blue-500/20 tracking-widest uppercase">
            AI Core: Online
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Action Card */}
          <div className="lg:col-span-5 bg-slate-900/40 border border-slate-800 p-8 rounded-[2rem] backdrop-blur-xl shadow-2xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="text-blue-500 text-2xl">●</span> Upload Performance
            </h2>
            
            <div className="group relative border-2 border-dashed border-slate-700 rounded-2xl p-12 text-center hover:border-blue-500/50 transition-all">
              <input 
                type="file" 
                onChange={(e) => setFile(e.target.files[0])}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="space-y-2">
                <p className="text-slate-300 font-semibold">{file ? file.name : "Drop video here"}</p>
                <p className="text-slate-500 text-xs">MP4 or MOV preferred</p>
              </div>
            </div>

            <button 
              onClick={handleUpload}
              disabled={loading}
              className="w-full mt-8 bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-900/40 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Neural Analysis in Progress..." : "START ANALYSIS"}
            </button>
          </div>

          {/* Results Side */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2rem] backdrop-blur-xl flex justify-between items-center">
              <div>
                <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Accuracy Score</p>
                <p className={`text-6xl font-black mt-2 ${score >= 70 ? 'text-emerald-400' : 'text-blue-400'}`}>
                  {score !== null ? `${score}%` : "--"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2">Grade</p>
                <span className="bg-slate-950 px-6 py-2 rounded-xl border border-slate-800 font-bold">
                  {score >= 80 ? "Distinction" : score >= 60 ? "Merit" : "Practice"}
                </span>
              </div>
            </div>

            <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2rem] backdrop-blur-xl min-h-[300px]">
              <h2 className="text-xl font-bold mb-6">Guru's Observations</h2>
              <div className="space-y-4">
                {feedback.length > 0 ? feedback.map((note, i) => (
                  <div key={i} className="flex gap-4 p-5 bg-slate-950/50 rounded-2xl border border-slate-800/50 group hover:border-blue-500/30 transition-all">
                    <div className="w-1.5 h-10 bg-blue-600 rounded-full group-hover:shadow-[0_0_15px_rgba(37,99,235,0.6)]" />
                    <div>
                      <p className="text-slate-200 text-sm leading-relaxed font-medium italic">
                        "{humanizeFeedback(note)}"
                      </p>
                    </div>
                  </div>
                )) : (
                  <div className="flex items-center justify-center h-48 text-slate-600 italic text-sm">
                    Awaiting performance data to begin guidance...
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