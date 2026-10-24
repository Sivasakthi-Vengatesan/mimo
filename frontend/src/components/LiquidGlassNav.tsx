import React, { useState } from 'react';
import { Settings as SettingsIcon, Menu, X, ArrowLeft, MessageSquare, Bot as BotIcon, CheckSquare } from 'lucide-react';
import type { ModelHealth } from '../types';

interface LiquidGlassNavProps {
  currentView: 'landing' | 'workspace';
  activeTab: 'chat' | 'bots' | 'tasks' | 'settings';
  onNavigate: (view: 'landing' | 'workspace', tab?: 'chat' | 'bots' | 'tasks' | 'settings') => void;
  onOpenSettings: () => void;
  health: ModelHealth;
}

export const LiquidGlassNav: React.FC<LiquidGlassNavProps> = ({
  currentView,
  activeTab,
  onNavigate,
  onOpenSettings,
  health,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isModelReady = health.ollama_connected && health.model_available;

  const handleNavClick = (view: 'landing' | 'workspace', tab?: 'chat' | 'bots' | 'tasks' | 'settings') => {
    onNavigate(view, tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#010828]/90 border-b border-white/10 backdrop-blur-md">
      <div className="max-w-[1831px] mx-auto px-6 sm:px-10 lg:px-16 h-18 flex items-center justify-between">
        {/* Brand Mark & Back to Landing Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleNavClick('landing')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full liquid-glass text-xs font-grotesk uppercase tracking-wider text-cream hover:text-neon transition-colors"
            title="Return to Landing Page"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Landing Page</span>
          </button>

          <button
            onClick={() => handleNavClick('landing')}
            className="flex items-center gap-2 group text-left focus:outline-none"
          >
            <span className="font-grotesk text-xl text-cream tracking-wider group-hover:text-neon transition-colors uppercase">
              MIMO.AI
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-neon">
              LOCAL
            </span>
          </button>
        </div>

        {/* Center Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-2 p-1.5 rounded-[20px] liquid-glass">
          <button
            onClick={() => handleNavClick('workspace', 'chat')}
            className={`px-4 py-2 rounded-[14px] text-xs font-grotesk uppercase tracking-wider transition-all flex items-center gap-2 ${
              currentView === 'workspace' && activeTab === 'chat'
                ? 'bg-white/15 text-neon font-bold shadow-sm'
                : 'text-cream/80 hover:text-cream hover:bg-white/5'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-neon" />
            <span>Companion Chat</span>
          </button>

          <button
            onClick={() => handleNavClick('workspace', 'bots')}
            className={`px-4 py-2 rounded-[14px] text-xs font-grotesk uppercase tracking-wider transition-all flex items-center gap-2 ${
              currentView === 'workspace' && activeTab === 'bots'
                ? 'bg-white/15 text-neon font-bold shadow-sm'
                : 'text-cream/80 hover:text-cream hover:bg-white/5'
            }`}
          >
            <BotIcon className="w-3.5 h-3.5 text-neon" />
            <span>Mini-Bots</span>
          </button>

          <button
            onClick={() => handleNavClick('workspace', 'tasks')}
            className={`px-4 py-2 rounded-[14px] text-xs font-grotesk uppercase tracking-wider transition-all flex items-center gap-2 ${
              currentView === 'workspace' && activeTab === 'tasks'
                ? 'bg-white/15 text-neon font-bold shadow-sm'
                : 'text-cream/80 hover:text-cream hover:bg-white/5'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5 text-neon" />
            <span>Task Hub</span>
          </button>
        </nav>

        {/* Right Controls: Model Status + Settings */}
        <div className="flex items-center gap-3">
          {/* Live Model Status Indicator */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full liquid-glass hover:bg-white/10 transition-all text-xs"
            title="Model connectivity and settings"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isModelReady
                  ? 'bg-neon shadow-[0_0_8px_#6FFF00]'
                  : 'bg-red-400'
              }`}
            />
            <span className="font-mono text-[11px] text-cream hidden sm:inline">
              {isModelReady ? health.configured_model : 'Offline'}
            </span>
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="w-10 h-10 rounded-full liquid-glass flex items-center justify-center text-cream hover:text-neon hover:bg-white/10 transition-colors"
            title="Settings & Preferences"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 rounded-full liquid-glass flex items-center justify-center text-cream"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden px-6 pt-3 pb-5 space-y-2 bg-[#010828] border-b border-white/10">
          <button
            onClick={() => handleNavClick('landing')}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-cream hover:text-neon font-grotesk uppercase"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Landing</span>
          </button>
          <button
            onClick={() => handleNavClick('workspace', 'chat')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-grotesk uppercase ${
              currentView === 'workspace' && activeTab === 'chat' ? 'bg-white/10 text-neon font-semibold' : 'text-cream'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Companion Chat</span>
          </button>
          <button
            onClick={() => handleNavClick('workspace', 'bots')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-grotesk uppercase ${
              currentView === 'workspace' && activeTab === 'bots' ? 'bg-white/10 text-neon font-semibold' : 'text-cream'
            }`}
          >
            <BotIcon className="w-4 h-4" />
            <span>Mini-Bots</span>
          </button>
          <button
            onClick={() => handleNavClick('workspace', 'tasks')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-grotesk uppercase ${
              currentView === 'workspace' && activeTab === 'tasks' ? 'bg-white/10 text-neon font-semibold' : 'text-cream'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Task Hub</span>
          </button>
        </div>
      )}
    </header>
  );
};
