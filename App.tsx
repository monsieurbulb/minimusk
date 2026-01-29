
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import { Step, ProjectState } from './types';

const INITIAL_STATE: ProjectState = {
  currentStep: Step.GROUNDING,
  problem: '',
  facts: [],
  assumptions: [],
  requirements: [],
  deletedItems: [],
  simplification: '',
  testIdeas: [],
  reflection: ''
};

const App: React.FC = () => {
  const [projectState, setProjectState] = useState<ProjectState>(INITIAL_STATE);

  const handleStateUpdate = (updates: Partial<ProjectState>) => {
    setProjectState(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="flex h-screen bg-black text-zinc-100 overflow-hidden">
      {/* App Sidebar */}
      <Sidebar projectState={projectState} />

      {/* Main Experience */}
      <main className="flex-1 flex flex-col h-full relative">
        <ChatInterface 
          projectState={projectState} 
          onStateUpdate={handleStateUpdate} 
        />
        
        {/* Mobile progress bar */}
        <div className="md:hidden absolute top-0 left-0 right-0 h-1 bg-zinc-800">
          <div 
            className="h-full bg-orange-600 transition-all duration-500" 
            style={{ width: `${((projectState.currentStep + 1) / 8) * 100}%` }}
          />
        </div>
      </main>

      {/* Right Detail Pane (Only show when we have content) */}
      <div className="w-80 border-l border-zinc-800 bg-zinc-950 p-6 hidden xl:block overflow-y-auto">
        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">Workspace Insights</h3>
        
        <div className="space-y-6">
          <section>
            <h4 className="text-[10px] text-zinc-500 uppercase font-bold mb-2">The One-Sentence Goal</h4>
            {projectState.problem ? (
              <p className="text-sm text-white font-medium p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
                {projectState.problem}
              </p>
            ) : (
              <p className="text-xs text-zinc-600 italic">Not yet defined.</p>
            )}
          </section>

          <section>
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-[10px] text-zinc-500 uppercase font-bold">Assumptions Flagged</h4>
              <span className="text-[10px] bg-red-900/30 text-red-400 px-1.5 rounded">Toxic</span>
            </div>
            <div className="space-y-2">
              {projectState.assumptions.length > 0 ? (
                projectState.assumptions.map((a, i) => (
                  <div key={i} className="text-xs p-2 bg-zinc-900 border-l-2 border-red-900/50 rounded-r text-zinc-400">
                    {a}
                  </div>
                ))
              ) : (
                <p className="text-xs text-zinc-700 italic">Clean sheet so far.</p>
              )}
            </div>
          </section>

          <section>
            <h4 className="text-[10px] text-zinc-500 uppercase font-bold mb-2">Verified Requirements</h4>
            <div className="space-y-2">
              {projectState.requirements.length > 0 ? (
                projectState.requirements.map((r, i) => (
                  <div key={i} className="text-xs p-2 bg-zinc-900 border-l-2 border-emerald-900/50 rounded-r text-zinc-300">
                    {r}
                  </div>
                ))
              ) : (
                <p className="text-xs text-zinc-700 italic">Validating constraints...</p>
              )}
            </div>
          </section>

          <section className="pt-4 border-t border-zinc-800">
            <div className="bg-orange-950/20 border border-orange-900/30 p-4 rounded-xl">
              <p className="text-[10px] text-orange-500 font-bold uppercase mb-1">Musk Tip</p>
              <p className="text-xs text-orange-200/80 leading-relaxed italic">
                "If you're not adding things back in 10% of the time, you're not deleting enough."
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default App;
