import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Navigation from './components/Navigation';
import SessionMonitor from './components/SessionMonitor';
import AnalyzeTab from './components/AnalyzeTab';
import HistoryTab from './components/HistoryTab';
import RisksTab from './components/RisksTab';
import ComparisonTab from './components/ComparisonTab';
import { WhatIsBN, WhyLearnBN } from './components/InfoTabs';

import dancerImg from './assets/dancer.png';
import mudraImg from './assets/mudra.png';
import bhavaImg from './assets/expression.png';
import formImg from './assets/form.png';
import aramandiImg from './assets/aramandi.png';
import bgHistoryPageImg from './assets/bghist.png';

const API = 'http://localhost:3001';

const backgroundImages = {
  'analyze': dancerImg,
  'alignment-risks': formImg,
  'form-comparison': aramandiImg,
  'history': mudraImg,
  'what-is-bn': bhavaImg,
  'why-learn-bn': bgHistoryPageImg,
};

const backgroundPositions = {
  'analyze': 'center 20%',
  'alignment-risks': 'center 20%',
  'form-comparison': 'center 20%',
  'history': 'center',
  'what-is-bn': 'right 35%',
  'why-learn-bn': 'center',
};

const generateNewSessionId = () =>
  'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);

function App() {

  const [sessionId, setSessionId] = useState('');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [moveName, setMoveName] = useState('Aramandi');
  const [currentViewingSession, setCurrentViewingSession] = useState(null);

  const [activeTab, setActiveTab] = useState('analyze');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sessionSaved, setSessionSaved] = useState(false);

  const [sessionHistory, setSessionHistory] = useState([]);

  const fetchSessionHistory = async () => {
    try {
      const res = await axios.get(`${API}/api/sessions`);
      if (Array.isArray(res.data)) setSessionHistory(res.data);
    } catch (err) {
      console.error('Error fetching stored sessions context:', err);
    }
  };

  useEffect(() => {
    setSessionId(generateNewSessionId());
    fetchSessionHistory();
  }, []);

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, []);

  const resetAnalysis = () => {
    setFile(null);
    setImageUrl(null);
    setFeedback([]);
    setScore(null);
    setSessionSaved(false);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setImageUrl(URL.createObjectURL(selectedFile));
    setCurrentViewingSession(null);
    setFeedback([]);
    setScore(null);
    setSessionSaved(false);

    e.target.value = null;
  };

  const handleClearImage = () => {
    if (imageUrl && !currentViewingSession) URL.revokeObjectURL(imageUrl);
    resetAnalysis();
    setSessionId(generateNewSessionId());
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select your posture image first!');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('sessionId', sessionId);
    formData.append('moveName', moveName);
    formData.append('difficulty', difficulty);

    try {
      const res = await axios.post(`${API}/analyze`, formData);
      const data = res.data.feedback;
      setFeedback(Array.isArray(data) ? data : [data]);
      setScore(res.data.score);
      setSessionSaved(false);
    } catch (err) {
      console.error(err);
      setFeedback(['The AI Guru is resting. Check your Flask/Node server!']);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSession = async () => {
    if (score === null) {
      alert('No data found to save. Run an analysis first!');
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
      };

      const res = await axios.post(`${API}/api/sessions/save`, payload);

      if (res.status === 200 || res.status === 201) {
        setSessionSaved(true);
        await fetchSessionHistory();
        alert('Practice session saved successfully to history logs!');
      }
    } catch (err) {
      console.error('Database Save Failure:', err);
      alert(`Could not save record to database: ${err.response?.data?.error || err.message}`);
      setSessionSaved(false);
    }
  };

  const handleReturnToUpload = () => {
    console.log('FULL SESSION OBJECT:');
    console.log(JSON.stringify(currentViewingSession, null, 2));
    setCurrentViewingSession(null);
    setSessionId(generateNewSessionId());
    resetAnalysis();
  };

  const handleSelectSession = (sess) => {
    const finalScore =
      sess.score !== undefined
        ? sess.score
        : sess.accuracyHistory && sess.accuracyHistory.length
        ? sess.accuracyHistory[sess.accuracyHistory.length - 1]
        : 0;
    setScore(finalScore);

    const raw = sess.feedback ?? sess.feedbackLogs;
    setFeedback(raw ? (Array.isArray(raw) ? raw : [raw]) : []);

    setMoveName(sess.moveName || 'Aramandi');
    setDifficulty(sess.difficulty || 'Intermediate');
    setSessionId(sess.sessionId || 'Unknown');

    setCurrentViewingSession(sess);
    setSessionSaved(true);
    setActiveTab('analyze');
  };

  const handleClearHistory = async () => {
    if (!window.confirm('Are you sure you want to clear your entire practice history records?')) return;
    try {
      await axios.delete(`${API}/api/sessions/clear`);
      setSessionHistory([]);
      setCurrentViewingSession(null);
      setSessionId(generateNewSessionId());
    } catch (err) {
      console.error('Error purging server session history storage logs:', err);
      alert('Could not clear database logs. Check backend server endpoints configuration.');
    }
  };

  const handleDeleteSession = async (sessionDbId, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this session entry?')) return;
    try {
      await axios.delete(`${API}/api/sessions/${sessionDbId}`);
      setSessionHistory((prev) => prev.filter((s) => s._id !== sessionDbId));
      if (currentViewingSession?._id === sessionDbId) {
        setCurrentViewingSession(null);
        setScore(null);
        setFeedback([]);
      }
    } catch (err) {
      alert('Could not delete session: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="relative min-h-screen w-full text-slate-100 font-sans flex flex-col md:flex-row overflow-x-hidden bg-[#020617]">
      {/* BACKGROUND LAYERS */}
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

      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      <div className="relative z-20 flex-1 max-w-7xl w-full mx-auto p-8 md:p-14 flex flex-col min-h-screen">
        {/* HEADER */}
        <header className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-white/5 pb-6">
          <div>
            <h1
              className="text-5xl md:text-8xl font-normal tracking-wide leading-none"
              style={{ fontFamily: 'Lobster, cursive' }}
            >
              Nritya<span className="text-rose-700">Web</span>
            </h1>
            <p className="text-rose-1000 uppercase text-2xl mt-3 font-bold tracking-[0.2em] sm:text-2xl">
              Digital Bharatanatyam Mentor
            </p>
          </div>

          {activeTab === 'analyze' && (
            <div className="flex items-center gap-3 bg-rose-600/5 px-5 py-2 rounded-full border border-rose-600/20 shadow-[inset_0_1px_3px_rgba(255,255,255,0.05)] backdrop-blur-md">
              <span className="w-2 h-2 bg-rose-600 rounded-full animate-pulse shadow-[0_0_10px_rgba(225,29,72,0.8)]" />
              <span className="text-rose-400 text-lg font-black uppercase tracking-[0.2em]">
                {currentViewingSession ? 'Viewing Log Details' : 'AI Core: Active'}
              </span>
            </div>
          )}
        </header>

        {activeTab === 'analyze' && (
          <SessionMonitor
            sessionId={sessionId}
            moveName={moveName}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            currentViewingSession={currentViewingSession}
            score={score}
            sessionSaved={sessionSaved}
            onSave={handleSaveSession}
            onReturn={handleReturnToUpload}
          />
        )}

        {/* ACTIVE TAB */}
        <div className="flex-1">
          {activeTab === 'analyze' && (
            <AnalyzeTab
              file={file}
              imageUrl={imageUrl}
              currentViewingSession={currentViewingSession}
              moveName={moveName}
              loading={loading}
              feedback={feedback}
              score={score}
              onFileChange={handleFileChange}
              onClearImage={handleClearImage}
              onUpload={handleUpload}
            />
          )}

          {activeTab === 'history' && (
            <HistoryTab
              sessionHistory={sessionHistory}
              onSelectSession={handleSelectSession}
              onDeleteSession={handleDeleteSession}
              onClearHistory={handleClearHistory}
            />
          )}

          {activeTab === 'alignment-risks' && <RisksTab />}
          {activeTab === 'form-comparison' && <ComparisonTab />}
          {activeTab === 'what-is-bn' && <WhatIsBN />}
          {activeTab === 'why-learn-bn' && <WhyLearnBN />}
        </div>
      </div>
    </div>
  );
}

export default App;
