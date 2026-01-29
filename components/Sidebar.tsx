
import React from 'react';
import { Step, ProjectState } from '../types';
import { STEP_METADATA } from '../constants';

interface SidebarProps {
  projectState: ProjectState;
}

const Sidebar: React.FC<SidebarProps> = ({ projectState }) => {
  return (
    <div className="w-80 h-full border-r border-zinc-800 bg-zinc-950 p-6 flex flex-col gap-8 hidden md:flex">
      <div>
        <h1 className="text-2xl font-bold tracking-tighter text-white mb-1">minimusk</h1>
        <p className="text-xs text-zinc-500 uppercase tracking-widest font-medium">First-Principles Companion</p>
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Process</h3>
        {STEP_METADATA.map((step) => {
          const isActive = projectState.currentStep === step.id;
          const isCompleted = projectState.currentStep > step.id;

          return (
            <div 
              key={step.id} 
              className={`flex items-start gap-3 p-2 rounded-lg transition-all ${
                isActive ? 'bg-zinc-800 ring-1 ring-zinc-700' : ''
              }`}
            >
              <div className={`mt-1 w-2 h-2 rounded-full ${
                isActive ? 'bg-orange-500 animate-pulse' : 
                isCompleted ? 'bg-emerald-500' : 'bg-zinc-700'
              }`} />
              <div>
                <p className={`text-sm font-medium ${isActive ? 'text-white' : 'text-zinc-500'}`}>
                  {step.label}
                </p>
                {isActive && (
                  <p className="text-[10px] text-zinc-400 mt-0.5 leading-tight">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-auto pt-6 border-t border-zinc-800">
        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Project Essence</h3>
        {projectState.problem ? (
          <div className="space-y-4">
            <div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-tighter mb-1">Problem</p>
              <p className="text-sm text-zinc-300 italic">"{projectState.problem}"</p>
            </div>
            {projectState.facts.length > 0 && (
              <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-tighter mb-1">Physics (Facts)</p>
                <ul className="text-xs text-zinc-400 list-disc list-inside">
                  {projectState.facts.slice(0, 3).map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-zinc-600 italic">Defining the irreducible core...</p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
