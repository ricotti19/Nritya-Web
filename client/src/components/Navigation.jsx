import React from 'react';
const NAV_ITEMS = [
  { id: 'analyze', icon: '💃', label: 'AI Practice Core' },
  { id: 'alignment-risks', icon: '⚠️', label: 'Risk Assessment' },
  { id: 'form-comparison', icon: '📊', label: 'Form Comparison' },
  { id: 'history', icon: '⏳', label: 'Practice History' },
  { id: 'what-is-bn', icon: '📖', label: 'What is BN?' },
  { id: 'why-learn-bn', icon: '✨', label: 'Why Learn?' },
];

function Navigation({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }) {
  return (
    <aside
      className={`relative z-20 flex-shrink-0 flex flex-col gap-3 bg-slate-950/40 border-r border-white/5 p-6 backdrop-blur-2xl transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-full md:w-20 items-center px-3 md:p-4' : 'w-full md:w-64 lg:w-72 md:p-8'
      }`}
    >
      <div className={`w-full flex items-center mb-6 ${isCollapsed ? 'justify-center' : 'justify-between px-3'}`}>
        {!isCollapsed && (
          <p className="text-rose-600/60 text-xl font-black uppercase tracking-[0.2em]">Navigation</p>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:bg-rose-600/20 hover:border-rose-500/40 flex items-center justify-center transition-all text-xs font-bold text-slate-400 hover:text-rose-300 shadow-md"
          title={isCollapsed ? 'Expand Navigation' : 'Collapse Navigation'}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      {NAV_ITEMS.map(({ id, icon, label }) => (
        <button
          key={id}
          onClick={() => setActiveTab(id)}
          className={`text-base font-bold uppercase tracking-wider transition-all border flex items-center gap-3 ${
            isCollapsed ? 'justify-center w-12 h-12 rounded-xl p-0' : 'w-full text-left px-5 py-4 rounded-xl'
          } ${
            activeTab === id
              ? 'bg-rose-600/20 border-rose-500 text-rose-600 shadow-lg'
              : 'bg-transparent border-white/5 text-slate-400 hover:border-white/10 hover:text-slate-200'
          }`}
        >
          <span className="text-xl">{icon}</span>
          {!isCollapsed && <span>{label}</span>}
        </button>
      ))}
    </aside>
  );
}

export default Navigation;
