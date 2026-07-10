import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dancerImg from './assets/dancer.png';
import mudraImg from './assets/mudra.png';
import bhavaImg from './assets/expression.png';  
import formImg from './assets/form.png';
import aramandiImg from './assets/aramandi.png';
import bgHistoryPageImg from './assets/bghist.png';

// good/optimal Images
import goodAramandi1 from './assets/exOfGoodAramandiForPg.png';
import goodAramandi2 from './assets/exOfGoodAramandiForPg2.png';
import goodAramandi3 from './assets/exOfGoodAramandiForPg3.png';
import goodAramandi4 from './assets/exOfGoodAramandiForPg4.png';
import goodAramandi5 from './assets/exOfGoodAramandiForPg5.png';

// Bad Aramandis
import badAramandi1 from './assets/exOfBadAramandiForPg.png';
import badAramandi2 from './assets/exOfBadAramandiForPg2.png';  
import badAramandi3 from './assets/exOfBadAramandiForPg3.png';  
import badAramandi4 from './assets/exOfBadAramandiForPg4.png';  
import badAramandi5 from './assets/exOfBadAramandiForPg5.png';

function App() {
  // Helper to generate a unique string sequence
  const generateNewSessionId = () => {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
  };

  const [sessionId, setSessionId] = useState('');
  const [difficulty, setDifficulty] = useState('Intermediate'); 
  const [moveName, setMoveName] = useState('Aramandi'); 
  const [currentViewingSession, setCurrentViewingSession] = useState(null);

  // auto-generate unique session string when the dancer opens the app
  useEffect(() => {
    setSessionId(generateNewSessionId());
  }, []);

  // Tab Controller updated with dedicated 'history' view option
  const [activeTab, setActiveTab] = useState('analyze');
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sessionSaved, setSessionSaved] = useState(false);

  const [sessionHistory, setSessionHistory] = useState([]);

  // Collapsible States for Biomechanical Risks
  const [risk1Open, setRisk1Open] = useState(false);
  const [risk2Open, setRisk2Open] = useState(false);
  const [risk3Open, setRisk3Open] = useState(false);

  // Image Slider State for Form Comparison Loop
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const goodImages = [goodAramandi1, goodAramandi2, goodAramandi3, goodAramandi4, goodAramandi5];
  const badImages = [badAramandi1, badAramandi2, badAramandi3, badAramandi4, badAramandi5];

  // Fetch saved history logs from the server instance database
  const fetchSessionHistory = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/sessions");
      if (Array.isArray(res.data)) {
        setSessionHistory(res.data);
      }
    } catch (err) {
      console.error("Error fetching stored sessions context:", err);
    }
  };

  const getDisplayImage = () => {
    if (activeTab !== 'analyze') 
      return null;
    if (currentViewingSession?.imageUrl) 
      return currentViewingSession.imageUrl;
    if (imageUrl) return imageUrl;
      return null;
  };

  // Run on initial components mount lifecycle stage
  useEffect(() => {
    fetchSessionHistory();
  }, []);

  // Interval runner to flip through comparison images automatically
  useEffect(() => {
    if (activeTab !== 'form-comparison') return; 

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % goodImages.length);
    }, 2000); 
    
    return () => clearInterval(interval);
  }, [activeTab, goodImages.length]);

  const humanizeFeedback = (text) => {
    if (!text) return "";
    return text.replace("Adjust your", "Pro-tip: Let's refine your");
  };
 
  const backgroundImages = {
    'analyze': dancerImg,
    'alignment-risks': formImg,
    'form-comparison': aramandiImg,
    'history': mudraImg,
    'what-is-bn': bhavaImg,
    'why-learn-bn': bgHistoryPageImg
  };

  const backgroundPositions = {
    'analyze': 'center 20%',
    'alignment-risks': 'center 20%',
    'form-comparison': 'center 20%',
    'history': 'center',
    'what-is-bn': 'right 35%',  
    'why-learn-bn': 'center'
  };

  const getFeedbackStyle = (text) => {
    const lowText = text.toLowerCase();
    if (lowText.includes("excellent") || lowText.includes("perfect") || lowText.includes("good")) {
      return { border: "border-emerald-500/30", bg: "bg-emerald-950/20", icon: "✨", text: "text-emerald-400" };
    }
    if (lowText.includes("cave") || lowText.includes("wrong") || lowText.includes("incorrect")) {
      return { border: "border-rose-500/30", bg: "bg-rose-950/20", icon: "⚠️", text: "text-rose-400" };
    }
    return { border: "border-amber-500/20", bg: "bg-amber-950/10", icon: "💡", text: "text-amber-400" };
  };

  const getGrade = (s) => {
    if (s === null) return "Awaiting Performance";
    if (s >= 95) return "Guru or Student? Flawless Form";
    if (s >= 85) return "Distinction! Now Minor Refinements";
    if (s >= 70) return "First Class! Room for Refinement";
    if (s >= 50) return "Solid effort! Keep Practicing";
    return "Not quite! Keep Practicing";
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const newUrl = URL.createObjectURL(selectedFile);

    setFile(selectedFile);
    setImageUrl(newUrl);

    setCurrentViewingSession(null);
    setFeedback([]);
    setScore(null);
    setSessionSaved(false);

    e.target.value = null;
  };

  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, []);

  const handleUpload = async () => {
    if (!file) {
        alert("Please select your posture image first!");
        return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("sessionId", sessionId);
    formData.append("moveName", moveName);
    formData.append("difficulty", difficulty);

    try {
        const res = await axios.post("http://localhost:3001/analyze", formData);
        const data = res.data.feedback;
        setFeedback(Array.isArray(data) ? data : [data]);
        setScore(res.data.score);
        setSessionSaved(false); 
    } catch (err) {
        console.error(err);
        setFeedback(["The AI Guru is resting. Check your Flask/Node server!"]);
    } finally {
        setLoading(false);
    }
  };

  const handleSaveSession = async () => {
    if (score === null) {
      alert("No data found to save. Run an analysis first!");
      return;
    }

    try {
      const payload = {
        sessionId,
        moveName,
        difficulty,
        score,
        feedback: Array.isArray(feedback) ? feedback : [feedback],
        imageUrl: imageUrl || null,
      }

      const res = await axios.post("http://localhost:3001/api/sessions/save", payload);
      
      if (res.status === 200 || res.status === 201) {
        setSessionSaved(true);
        await fetchSessionHistory(); 
        alert("Practice session saved successfully to history logs!");
      }
    } 
    catch (err) {
      console.error("Database Save Failure:", err);
      alert(`Could not save record to database: ${err.response?.data?.error || err.message}`);
      setSessionSaved(false); 
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm("Are you sure you want to clear your entire practice history records?")) 
      return;
    try {
      await axios.delete("http://localhost:3001/api/sessions/clear");
      setSessionHistory([]);
      setCurrentViewingSession(null);
      setSessionId(generateNewSessionId());
    } 
    catch (err) {
      console.error("Error purging server session history storage logs:", err);
      alert("Could not clear database logs. Check backend server endpoints configuration.");
    }
  };

  const handleDeleteSession = async (sessionDbId, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this session entry?")) return;
    try {
      await axios.delete(`http://localhost:3001/api/sessions/${sessionDbId}`);
      setSessionHistory(prev => prev.filter(s => s._id !== sessionDbId));
      if (currentViewingSession?._id === sessionDbId) {
        setCurrentViewingSession(null);
        setScore(null); setFeedback([]);
      }
    } catch (err) {
      alert("Could not delete session: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="relative min-h-screen w-full text-slate-100 font-sans flex flex-col md:flex-row overflow-x-hidden bg-[#020617]">
      
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {Object.keys(backgroundImages).map((tabKey) => (
          <div
            key={tabKey}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(24, 4, 10, 0.45), rgba(24, 4, 10, 0.8)), url(${backgroundImages[tabKey]})`,
              backgroundSize: 'cover',
              backgroundPosition: backgroundPositions[tabKey],
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'fixed',
              opacity: activeTab === tabKey ? 1 : 0,
            }}
          />
        ))}
        <div className="absolute top-[0%] left-[-5%] w-[1000px] h-[1000px] bg-rose-600/5 rounded-full blur-[150px] z-10" />
        <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-[#020617] to-transparent z-10" />
      </div>

      <aside
        className={`relative z-20 flex-shrink-0 flex flex-col gap-3 bg-slate-950/40 border-r border-white/5 p-6 backdrop-blur-2xl transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-full md:w-20 items-center px-3 md:p-4' : 'w-full md:w-64 lg:w-72 md:p-8'
        }`}
      >
        <div className={`w-full flex items-center mb-6 ${isCollapsed ? 'justify-center' : 'justify-between px-3'}`}>
          {!isCollapsed && (
            <p className="text-rose-600/60 text-1.5xl font-black uppercase tracking-[0.2em]">Navigation</p>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:bg-rose-600/20 hover:border-rose-500/40 flex items-center justify-center transition-all text-xs font-bold text-slate-400 hover:text-rose-300 shadow-md"
            title={isCollapsed ? "Expand Navigation" : "Collapse Navigation"}
          >
            {isCollapsed ? "→" : "←"}
          </button>
        </div>
        
        <button
          onClick={() => setActiveTab('analyze')}
          className={`text-xs font-bold uppercase tracking-wider transition-all border flex items-center gap-3 ${
            isCollapsed ? 'justify-center w-12 h-12 rounded-xl p-0' : 'w-full text-left px-5 py-4 rounded-xl'
          } ${
            activeTab === 'analyze'
              ? 'bg-rose-600/20 border-rose-500 text-rose-600 shadow-lg'
              : 'bg-transparent border-white/5 text-slate-400 hover:border-white/10 hover:text-slate-200'
          }`}
        >
          <span className="text-sm">💃</span>
          {!isCollapsed && <span>AI Practice Core</span>}
        </button>

        <button
          onClick={() => setActiveTab('alignment-risks')}
          className={`text-xs font-bold uppercase tracking-wider transition-all border flex items-center gap-3 ${
            isCollapsed ? 'justify-center w-12 h-12 rounded-xl p-0' : 'w-full text-left px-5 py-4 rounded-xl'
          } ${
            activeTab === 'alignment-risks'
              ? 'bg-rose-600/20 border-rose-500 text-rose-600 shadow-lg'
              : 'bg-transparent border-white/5 text-slate-400 hover:border-white/10 hover:text-slate-200'
          }`}
        >
          <span className="text-sm text-rose-600">⚠️</span>
          {!isCollapsed && <span>Risk Assessment</span>}
        </button>

        <button
          onClick={() => setActiveTab('form-comparison')}
          className={`text-xs font-bold uppercase tracking-wider transition-all border flex items-center gap-3 ${
            isCollapsed ? 'justify-center w-12 h-12 rounded-xl p-0' : 'w-full text-left px-5 py-4 rounded-xl'
          } ${
            activeTab === 'form-comparison'
              ? 'bg-rose-600/20 border-rose-500 text-rose-600 shadow-lg'
              : 'bg-transparent border-white/5 text-slate-400 hover:border-white/10 hover:text-slate-200'
          }`}
        >
          <span className="text-sm">📊</span>
          {!isCollapsed && <span>Form Comparison</span>}
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`text-xs font-bold uppercase tracking-wider transition-all border flex items-center gap-3 ${
            isCollapsed ? 'justify-center w-12 h-12 rounded-xl p-0' : 'w-full text-left px-5 py-4 rounded-xl'
          } ${
            activeTab === 'history'
              ? 'bg-rose-600/20 border-rose-500 text-rose-600 shadow-lg'
              : 'bg-transparent border-white/5 text-slate-400 hover:border-white/10 hover:text-slate-200'
          }`}
        >
          <span className="text-sm">⏳</span>
          {!isCollapsed && <span>Practice History</span>}
        </button>
        
        <button
          onClick={() => setActiveTab('what-is-bn')}
          className={`text-xs font-bold uppercase tracking-wider transition-all border flex items-center gap-3 ${
            isCollapsed ? 'justify-center w-12 h-12 rounded-xl p-0' : 'w-full text-left px-5 py-4 rounded-xl'
          } ${
            activeTab === 'what-is-bn'
              ? 'bg-rose-600/20 border-rose-500 text-rose-600 shadow-lg'
              : 'bg-transparent border-white/5 text-slate-400 hover:border-white/10 hover:text-slate-200'
          }`}
        >
          <span className="text-sm">📖</span>
          {!isCollapsed && <span>What is BN?</span>}
        </button>
        
        <button
          onClick={() => setActiveTab('why-learn-bn')}
          className={`text-xs font-bold uppercase tracking-wider transition-all border flex items-center gap-3 ${
            isCollapsed ? 'justify-center w-12 h-12 rounded-xl p-0' : 'w-full text-left px-5 py-4 rounded-xl'
          } ${
            activeTab === 'why-learn-bn'
              ? 'bg-rose-600/20 border-rose-500 text-rose-300 shadow-lg'
              : 'bg-transparent border-white/5 text-slate-400 hover:border-white/10 hover:text-slate-200'
          }`}
        >
          <span className="text-sm">✨</span>
          {!isCollapsed && <span>Why Learn?</span>}
        </button>
      </aside>
      
      <div className="relative z-20 flex-1 max-w-7xl w-full mx-auto p-8 md:p-14 flex flex-col min-h-screen">
        
        {/*** HEADER***/}
        <header className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-white/5 pb-6">
          <div>
            <h1 className="text-5xl md:text-8xl font-normal tracking-wide leading-none" style={{ fontFamily: "'Lobster', cursive" }}>
              Nritya<span className="text-rose-700">Web</span>
            </h1>
            <p className="text-rose-1000 uppercase text-lg mt-3 font-bold tracking-[0.2em] sm:text-lg">
              Digital Bharatanatyam Mentor
            </p>
          </div>

          {activeTab === 'analyze' && (
            <div className="flex items-center gap-3 bg-rose-600/5 px-5 py-2 rounded-full border border-rose-600/20 shadow-[inset_0_1px_3px_rgba(255,255,255,0.05)] backdrop-blur-md">
              <span className="w-2 h-2 bg-rose-600 rounded-full animate-pulse shadow-[0_0_10px_rgba(225,29,72,0.8)]" />
              <span className="text-rose-400 text-lg font-black uppercase tracking-[0.2em]">
                {currentViewingSession ? "Viewing Log Details" : "AI Core: Active"}
              </span>
            </div>
          )}
        </header>

        {/* ACTIVE SESSION MONITORING BADGE */}
        {activeTab === 'analyze' && (
          <section className="mb-8 p-4 bg-slate-900/60 border border-white/10 rounded-2xl backdrop-blur-md flex flex-wrap gap-6 items-center justify-between shadow-xl">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Session ID: <span className="text-rose-1000 font-mono text-sm ml-1 select-all">{sessionId || "Loading..."}</span>
              </div>
              <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Focus Posture: <span className="text-slate-200 text-sm ml-1">{moveName}</span>
              </div>
              <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Difficulty: 
                <select 
                  value={difficulty} 
                  disabled={!!currentViewingSession}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="ml-2 bg-slate-800 text-slate-200 border border-white/10 rounded-md px-2 py-0.5 text-xs font-medium focus:outline-none focus:border-rose-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>
            
            {score !== null && !currentViewingSession && (
              <button
                onClick={handleSaveSession}
                className="px-4 py-2 rounded-xl font-bold uppercase text-xs tracking-wider transition-all shadow-md bg-rose-600 hover:bg-rose-500 text-white border border-transparent active:scale-95"
              >
                {sessionSaved ? "✓ Logged (Save Again)" : "Save Practice Data"}
              </button>
            )}

            {currentViewingSession && (
              <button
                onClick={() => {
                  console.log("FULL SESSION OBJECT:");
                  console.log(JSON.stringify(currentViewingSession, null, 2));
                  setCurrentViewingSession(null);
                  setSessionId(generateNewSessionId());
                  setFile(null);
                  setImageUrl(null);
                  setFeedback([]);
                  setScore(null);
                  setSessionSaved(false);
                }}
                className="px-4 py-2 rounded-xl font-bold uppercase text-xs tracking-wider transition-all shadow-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 active:scale-95"
              >
                Return to Upload Page
              </button>
            )}
          </section>
        )}

        {/* COMPONENT CONDITIONAL RENDERING PANEL */}
        <div className="flex-1">
          
          {/* AI PRACTICE CORE */}
          {activeTab === 'analyze' && (
            <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* UPLOAD STANCE */}
              <div className="lg:col-span-5 bg-amber-600/[0.06] border border-amber-400/10 p-6 rounded-[2rem] shadow-2xl backdrop-blur-xl">
                <h2 className="text-2xl font-black mb-6 text-rose-1000 uppercase tracking-widest flex items-center gap-3">
                  <span className="text-rose-1000 font-bold">01</span> {currentViewingSession ? "Performance Frame" : "Upload Stance"}
                </h2>

                <div className="relative border-2 border-dashed border-slate-800 hover:border-rose-600/40 transition-all rounded-[1.5rem] p-4 text-center bg-black/40 group overflow-hidden min-h-[220px] flex items-center justify-center">
                    {!file && !imageUrl && !currentViewingSession ? (
                    <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer py-8">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center mb-3 group-hover:bg-rose-600/20 transition-colors">
                        <span className="text-2xl text-slate-400 group-hover:text-rose-600">🪔</span>
                      </div>
                      <p className="text-slate-200 font-bold group-hover:text-rose-400 transition-colors text-sm">
                        Drop Posture Photo (Front, Araimandi)
                      </p>
                      <p className="text-slate-500 text-xs uppercase tracking-widest mt-1">
                        PNG, JPG up to 10MB
                      </p>
                    </label>
                  ) : (
                    <div className="w-full p-2">
                      {getDisplayImage() ? (
                          <img
                          src={getDisplayImage()}
                          alt="Performance Stance View"
                          className="w-full h-auto max-h-[280px] object-contain rounded-[1rem] shadow-2xl border border-white/10"
                        />
                      ) : (
                        <div className="w-full h-[200px] bg-slate-900 rounded-[1rem] flex items-center justify-center border border-white/5">
                          <span className="text-slate-500 text-xs uppercase font-mono tracking-widest">Historical Entry Frame</span>
                        </div>
                      )}
                      
                      <p className="text-sm text-rose-600 font-semibold uppercase mt-3 tracking-wider truncate">
                        Target: {file ? file.name : `${moveName} Captured Stance`}
                      </p>
                      
                      {!currentViewingSession && (
                        <button
                          onClick={() => {
                            if (imageUrl && !currentViewingSession) {
                              URL.revokeObjectURL(imageUrl);
                            }
                            setFile(null);
                            setImageUrl(null);
                            setFeedback([]);
                            setScore(null);
                            setSessionSaved(false);
                            setSessionId(generateNewSessionId());
                          }}
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
                    onClick={handleUpload}
                    disabled={loading || !file}
                    className={`w-full mt-6 bg-rose-600 hover:bg-rose-500 disabled:bg-yellow-600 text-white font-black py-4 rounded-[1.5rem] transition-all shadow-xl shadow-rose-950/20 active:scale-[0.99] uppercase tracking-[0.15em] text-sm ${
                      (loading || !file) ? 'opacity-60 disabled:text-rose-900 disabled:cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? "Analyzing Alignment..." : "Begin Posture Analysis"}
                  </button>
                )}
              </div>

              {/*METRICS & GURU FEEDBACK NOTES */}
              <div className="lg:col-span-7 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-amber-600/[0.04] border border-amber-400/10 p-6 rounded-[1.5rem] backdrop-blur-xl group transition-all">
                    <p className="text-rose-600 text-xl font-black uppercase tracking-[0.2em]">Alignment Accuracy</p>
                    <p className="text-5xl md:text-6xl font-black mt-2 text-rose-800 tracking-tighter transition-transform group-hover:scale-[1.02]">
                      {score !== null ? `${score}%` : "--"}
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
                            <p className="text-rose-700 text-lg font-black tracking-[0.2em] uppercase animate-pulse">Running Computer Vision Model...</p>
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
          )}

          {/* DEDICATED HISTORY PAGE */}
          {activeTab === 'history' && (
            <main className="bg-slate-950/60 border border-white/5 p-8 rounded-[2rem] backdrop-blur-xl shadow-2xl w-full max-w-4xl mx-auto">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-white/10 gap-4">
                <div>
                  <h2 className="text-3xl font-black text-rose-600 uppercase tracking-wider">Historical Practice Tracking Logs</h2>
                  <p className="text-sm text-rose-600 mt-1">Review saved performances loaded dynamically from MongoDB collection storage.</p>
                </div>
                {sessionHistory.length > 0 && (
                  <button 
                    onClick={handleClearHistory}
                    className="text-xs uppercase tracking-widest bg-rose-950/60 hover:bg-rose-600 border border-rose-500/20 hover:border-rose-500 text-rose-300 hover:text-white px-5 py-2.5 rounded-xl transition-all font-bold shadow-md active:scale-95"
                  >
                    Purge Complete Log History
                  </button>
                )}
              </div>

              {sessionHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center bg-black/20 rounded-2xl border border-dashed border-white/5">
                  <span className="text-4xl opacity-40 mb-4">⏳</span>
                  <p className="text-base text-rose-100 font-semibold">No performance data records found inside the database setup.</p>
                  <p className="text-xs text-rose-100 mt-1 max-w-xs">Run a posture analysis and click "Save Practice Data" to fill up this tracker space.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto max-h-[600px] pr-2 scrollbar-thin">                 
                  {sessionHistory.map((sess, idx) => (
                    <div 
                      key={sess._id || idx}
                      onClick={() => {
                        // 1. Load active data payload metrics cleanly
                        const finalScore = sess.score !== undefined ? sess.score : (sess.accuracyHistory && sess.accuracyHistory.length ? sess.accuracyHistory[sess.accuracyHistory.length - 1] : 0);
                        setScore(finalScore);

                        // 2. Safely parse structured array blocks
                        const finalFeedback = sess.feedback ? (Array.isArray(sess.feedback) ? sess.feedback : [sess.feedback]) : (sess.feedbackLogs ? (Array.isArray(sess.feedbackLogs) ? sess.feedbackLogs : [sess.feedbackLogs]) : []);
                        setFeedback(finalFeedback);

                        // 3. Keep administrative contextual variables synchronized
                        setMoveName(sess.moveName || 'Aramandi');
                        setDifficulty(sess.difficulty || 'Intermediate');
                        setSessionId(sess.sessionId || 'Unknown');

                        // 4. Update state to lock display view details block safely
                        setCurrentViewingSession(sess);
                        setSessionSaved(true);
                        
                        // Route view cleanly
                        setActiveTab('analyze'); 
                      }}
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
                          {sess.accuracyHistory && sess.accuracyHistory.length > 0 ? sess.accuracyHistory[sess.accuracyHistory.length - 1] : 0 }%
                        </div>
                        <span className="text-[10px] text-rose-400 font-bold tracking-wider uppercase block mt-2 hover:underline">
                          View Details →
                        </span>
                        <button
                          onClick={(e) => handleDeleteSession(sess._id, e)}
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
          )}
          {/* *RISK ASSESSMENT SECTION * */}
          {activeTab === 'alignment-risks' && (
            <div className="bg-rose-950/20 border border-rose-500/20 p-8 md:p-10 rounded-[2rem] backdrop-blur-3xl shadow-2xl transition-all w-full ml-auto">
              <h2 className="text-3xl font-black mb-4 text-rose-600 uppercase tracking-widest">
                Biomechanical Pathologies of Poor Form
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed mb-6">
                Structural lines are not just aesthetic parameters—they are structural safety constraints. Repetitive strain on unaligned kinetic chains introduces clear orthopedic risks.
              </p>
             
              <div className="space-y-6">
                <div    
                  className="bg-black/40 border border-white/5 p-6 rounded-2xl flex gap-4 items-start cursor-pointer select-none"
                  onClick={() => setRisk1Open(!risk1Open)}
                >
                  <span className="text-3xl bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">🦴</span>
                  <div>
                    <h3 className="font-bold text-rose-600 uppercase tracking-wide text-lg">Knee Meniscus Tear & Lateral Shearing</h3>
                    {risk1Open && (
                      <p className="text-slate-400 text-sm mt-1 leading-relaxed">
                        When descending into the deep <span className="text-rose-600 font-semibold">Araimandi</span> stance, dropping your knees inward instead of outward creates an aggressive rotational shear force across the knee joints. This structural failure places high pressure on the medial meniscus and collateral ligaments, increasing susceptibility to microscopic fraying or severe structural tearing over time.
                      </p>
                    )}
                  </div>
                </div>

                <div
                  className="bg-black/40 border border-white/5 p-6 rounded-2xl flex gap-4 items-start cursor-pointer select-none"
                  onClick={() => setRisk2Open(!risk2Open)}
                >
                  <span className="text-3xl bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">⚡</span>
                  <div>
                    <h3 className="font-bold text-rose-600 uppercase tracking-wide text-lg">Lumbar Back Pain & Pelvic Malalignment</h3>
                    {risk2Open && (
                      <p className="text-slate-400 text-sm mt-1 leading-relaxed">
                        Executing a posture with a "stuck out" pelvis forces an exaggerated hyper-lordosis baseline in the lumbar spine. This locks out your core, compressing the lower spinal discs abnormally. Without a flat, neutral pelvic tuck, the kinetic vibration of repetitive heavy heel-strikes drops directly into your lower back vertebrae instead of dispersing naturally up through the muscle core.
                      </p>
                    )}
                  </div>
                </div>

                <div
                  className="bg-black/40 border border-white/5 p-6 rounded-2xl flex gap-4 items-start cursor-pointer select-none"
                  onClick={() => setRisk3Open(!risk3Open)}
                >
                  <span className="text-3xl bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">🦶</span>
                  <div>
                    <h3 className="font-bold text-rose-600 uppercase tracking-wide text-lg">Ankle Pronation & Achilles Tendonitis</h3>
                    {risk3Open && (
                      <p className="text-slate-400 text-sm mt-1 leading-relaxed">
                        Allowing body weight to collapse onto the inner arches of the feet tilts the ankles inward. This unstable base skews the pull direction of the Achilles tendon during complex rhythmic stamps, triggering micro-tears, chronic tendonitis, and planar stability loss throughout the entire structural foot foundation.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* FORM COMPARISON VIEW WITH FLIPPING IMAGES */}
          {activeTab === 'form-comparison' && (
            <div className="bg-slate-950/40 border border-white/5 p-8 md:p-10 rounded-[2rem] backdrop-blur-3xl shadow-2xl transition-all w-full">
              <h2 className="text-3xl font-black mb-4 text-rose-600 uppercase tracking-widest">
                Aramandi (half squat): safe vs incorrect
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed mb-8">
                Study the structural geometric contrasts between an optimally aligned Aramandi and a pathologically collapsed one. Understanding these visual cues is key to internalizing injury-free, sustainable dance techniques. Changes often look subtle but have huge implications for joint health; even distinguishing proper vs improper form requires practice and patience.
              </p>




              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
               
                {/* DYNAMIC GOOD PROFILE MODEL CARD */}
                <div className="bg-emerald-950/10 border border-emerald-500/20 p-6 rounded-3xl flex flex-col items-center">
                  <div className="w-full text-left mb-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                      <h3 className="font-black text-emerald-400 uppercase tracking-wider text-xl">AIM FOR:</h3>
                    </div>
                  </div>
                 
                  {/* IMAGE CONTAINER WRAPPER */}
                  <div className="w-full bg-black/40 border border-emerald-500/10 rounded-2xl overflow-hidden min-h-[280px] p-4">
                    <img
                      src={goodImages[currentImageIndex]}
                      alt={`Correct Form Frame ${currentImageIndex + 1}`}
                      className="w-full h-[400px] object-contain rounded-lg"        
                    />
                  </div>




                  {/* DESCRIPTION FOOTER AREA */}
                  <footer className="mt-6 w-full border-t border-emerald-500/10 pt-4">
                    <p className="text-slate-300 text-sm leading-relaxed">
                        Thighs remain anchored toward the lower landscape, resulting in an open diamond (not oval) shape between the legs. The knees track cleanly outward right over the second or third toes, dispersing core kinetic loads equally across the skeletal framework. Spine is straight, the heels are planted on the ground, and the pelvis is as neutral as possible for balance and structural integrity. Everybody's ideal Aramandi will look a little different based on their unique body structure, but the key is following those core guidelnes.
                    </p>
                  </footer>
                </div>




                {/* DYNAMIC BAD PROFILE MODEL CARD */}
                <div className="bg-rose-950/10 border border-rose-500/20 p-6 rounded-3xl flex flex-col items-center">
                  <div className="w-full text-left mb-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-rose-500 rounded-full" />
                      <h3 className="font-black text-rose-400 uppercase tracking-wider text-xl">AVOID:</h3>
                    </div>
                  </div>




                  {/* IMAGE CONTAINER WRAPPER */}
                  <div className="w-full bg-black/40 border border-rose-500/10 rounded-2xl overflow-hidden min-h-[280px] p-4">
                    <img
                      src={badImages[currentImageIndex]}
                      alt={`Incorrect Form Frame ${currentImageIndex + 1}`}
                      className="w-full h-[400px] object-contain rounded-lg"
                    />
                  </div>




                  {/* DESCRIPTION FOOTER AREA */}
                  <footer className="mt-6 w-full border-t border-rose-500/10 pt-4">
                    <p className="text-slate-300 text-sm leading-relaxed">
                        Notice the internal knee collapse, tracking forward away from the toes' profile. (Ideally the knees are in line with the second or third toes) The pelvis is overarched, worsening the internal alignment and concentrating sheer joint force on the knee meniscus. Another mistake is slightly lifted heels for fake depth, which ideally comes from the glutes and hip rotators instead of the calves. The shoulders/spine are not kept back, and the overall shape of the stance is more oval than diamond. A major, though not sole, contributor to knee caving is keeping the heels too close together (too far apart is not ideal either on a side note).
                    </p>
                  </footer>
                </div>
              </div>
            </div>
          )}

          {/* Info: WHAT IS BHARATANATYAM */}
          {activeTab === 'what-is-bn' && (
            <div className="mt-10 bg-amber-900/[0.06] border border-amber-400/10 p-15 md:p-10 rounded-[2rem] backdrop-blur-2xl shadow-2xl transition-all max-w-4xl">
              <h2 className="text-3xl font-black mb-6 text-rose-700 uppercase tracking-widest">
                The Geometry of Devotion
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed mb-6">
                Bharatanatyam is an Indian classical dance form structured explicitly around clean geometric architecture, spatial lines, alignment, and emotional expression.
                It is one of the most respected, codified, rigorous, and widely practiced art forms in the world, especially in the South Asian region/diaspora, with a history spanning over 2000 years.
                The dance is deeply intertwined with Hindu religious themes and spiritual ideas, often depicting stories from Hindu mythology and scriptures.
                The name "Bharatanatyam" is derived from the Sanskrit words "Bha" (expression), "Ra" (music), "Ta" (rhythm), and "Natyam" (dance), reflecting the art form's holistic integration of these elements.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-black/30 p-5 rounded-xl border border-white/5">
                  <span className="text-2xl">🎭</span>
                  <h3 className="font-bold text-rose-600 mt-2 uppercase tracking-wider text-lg">Bhava (Expression)</h3>
                  <p className="text-rose-1000 text-sm mt-1">Conveying stories and complex emotional narratives using refined facial focus.</p>
                </div>
                <div className="bg-black/30 p-5 rounded-xl border border-white/5">
                  <span className="text-2xl">🎵</span>
                  <h3 className="font-bold text-rose-600 mt-2 uppercase tracking-wider text-lg">Raga (Melody)</h3>
                  <p className="text-rose-1000 text-sm mt-1">The tonal framework of classical compositions guiding musical interaction.</p>
                </div>
                <div className="bg-black/30 p-5 rounded-xl border border-white/5">
                  <span className="text-2xl">🥁</span>
                  <h3 className="font-bold text-rose-600 mt-2 uppercase tracking-wider text-lg">Tala (Rhythm)</h3>
                  <p className="text-rose-1000 text-sm mt-1">Mathematical structural rhythm interpreted by dynamic, rapid footwork strikes and various precise, synchronized mudras (hand gestures).</p>
                </div>
              </div>
            </div>
          )}
          {/* Info2: WHY LEARN BHARATANATYAM */}
          {activeTab === 'why-learn-bn' && (
            <div className="bg-amber-600/[0.06] border border-amber-400/10 p-8 md:p-10 rounded-[2rem] backdrop-blur-3xl shadow-2xl transition-all max-w-4xl">
              <h2 className="text-3xl font-black mb-6 text-rose-600 uppercase tracking-widest">
                Why Train Your Stance?
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed mb-6">
                Training your physical posture builds a deep foundational layer of mindfulness that cleanly mirrors spatial engineering layouts.
              </p>
              <ul className="space-y-4 text-slate-300 text-md">
                <li className="flex items-start gap-3">
                  <span className="text-rose-600 mt-1">⚡</span>
                  <div>
                    <strong>Biomechanical Precision:</strong> The core Aramandi stance strengthens overall stability, posture balance, and physical structural vectors.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-600 mt-1">🧠</span>
                  <div>
                    <strong>Spatial Awareness:</strong> Coordinating precise hand mudras alongside physical alignments refines tracking, coordination, and motor control.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-600 mt-1">✨</span>
                  <div>
                    <strong>Preserving Heritage via AI:</strong> Merging ancient choreography rules with edge computer vision models ensures art validation scales correctly.
                  </div>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default App;