
import React, { useState, useRef, useEffect } from 'react';
import { Message, Step, ProjectState } from '../types';
import { geminiService } from '../services/geminiService';
import { MISSION_BRIEFING } from '../constants';

interface ChatInterfaceProps {
  projectState: ProjectState;
  onStateUpdate: (updates: Partial<ProjectState>) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ projectState, onStateUpdate }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "What are you working on or thinking about right now?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', text: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await geminiService.chat(newMessages, projectState.currentStep);
      setMessages([...newMessages, { role: 'model', text: responseText }]);

      // Periodically update the summary state in the background
      const summary = await geminiService.summarizeState([...newMessages, { role: 'model', text: responseText }]);
      if (summary) {
        onStateUpdate({
          problem: summary.problem || projectState.problem,
          facts: summary.facts || projectState.facts,
          assumptions: summary.assumptions || projectState.assumptions,
          requirements: summary.requirements || projectState.requirements
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const advanceStep = () => {
    if (projectState.currentStep < Step.REFLECTION) {
      onStateUpdate({ currentStep: projectState.currentStep + 1 });
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-zinc-900 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur flex justify-between items-center">
        <div>
          <h2 className="text-sm font-semibold text-zinc-200">Session</h2>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Active reasoning</p>
        </div>
        <button 
          onClick={advanceStep}
          className="text-xs px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors border border-zinc-700"
        >
          Next Step →
        </button>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-8"
      >
        {/* Intro Context Card */}
        {messages.length === 1 && (
          <div className="max-w-3xl mx-auto space-y-6 mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-2xl p-8 backdrop-blur-sm">
              <h1 className="text-2xl font-bold text-white mb-4 tracking-tight">The minimusk Mission</h1>
              <div className="grid md:grid-cols-3 gap-6 text-sm">
                <div className="space-y-2">
                  <h3 className="text-orange-500 font-bold uppercase text-[10px] tracking-widest">The What</h3>
                  <p className="text-zinc-400 leading-relaxed">{MISSION_BRIEFING.what}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-orange-500 font-bold uppercase text-[10px] tracking-widest">The Why</h3>
                  <p className="text-zinc-400 leading-relaxed">{MISSION_BRIEFING.why}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-orange-500 font-bold uppercase text-[10px] tracking-widest">The How</h3>
                  <p className="text-zinc-400 leading-relaxed">{MISSION_BRIEFING.how}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div 
            key={i} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-4 ${
              msg.role === 'user' 
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/20' 
                : 'bg-zinc-800 text-zinc-200'
            }`}>
              <div className="whitespace-pre-wrap leading-relaxed text-sm">
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-zinc-800 text-zinc-500 rounded-2xl p-4 flex gap-1">
              <span className="animate-bounce">.</span>
              <span className="animate-bounce delay-100">.</span>
              <span className="animate-bounce delay-200">.</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 bg-zinc-900 border-t border-zinc-800">
        <div className="relative max-w-4xl mx-auto">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type your thoughts..."
            className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl py-3 pl-4 pr-16 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 resize-none h-14 md:h-20"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-3 bottom-3 p-2 bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50 disabled:hover:bg-zinc-700 rounded-lg transition-all text-zinc-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </div>
        <p className="text-center text-[10px] text-zinc-600 mt-2 uppercase tracking-tighter">
          Shift + Enter for new line • First principles focus
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
