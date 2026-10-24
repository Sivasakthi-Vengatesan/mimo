import React from 'react';
import { ArrowRight, Bot as BotIcon, CheckSquare, Sparkles, Check, ChevronRight, ShieldCheck } from 'lucide-react';
import type { Bot, Task, ModelHealth } from '../types';
import { Mascot } from '../components/Mascot';
import { DailyTip } from '../components/DailyTip';

interface CosmicLandingProps {
  onEnterWorkspace: (initialTab?: 'chat' | 'bots' | 'tasks', bot?: Bot) => void;
  bots: Bot[];
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  health: ModelHealth;
}

export const CosmicLanding: React.FC<CosmicLandingProps> = ({
  onEnterWorkspace,
  bots,
  tasks,
  onToggleTask,
  health,
}) => {
  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);
  const progressPercent = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-12">
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Headline, Description & CTAs */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-space-ink-raised border border-space-ink-border text-xs text-nebula-aqua">
            <Sparkles className="w-3.5 h-3.5 text-nebula-aqua" />
            <span className="font-medium tracking-wide">Personal On-Device AI Companion</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-starlight leading-[1.15]">
            A quiet, personal AI universe on your laptop.
          </h1>

          <p className="text-base text-starlight-muted font-sans leading-relaxed max-w-xl">
            Meet MIMO. A friendly, local-first companion powered directly by Qwen 3.5. 
            Converse freely, create custom assistants, and organize everyday tasks—all running 100% on your machine.
          </p>

          {/* Actions */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onEnterWorkspace('chat')}
              className="px-6 py-3 rounded-xl bg-signal-lime text-space-ink font-display font-semibold text-sm hover:bg-[#e4ff8a] transition-all duration-200 shadow-glow-lime flex items-center gap-2"
            >
              <span>Open Companion Chat</span>
              <ArrowRight className="w-4 h-4 text-space-ink" />
            </button>

            <button
              onClick={() => onEnterWorkspace('bots')}
              className="px-5 py-3 rounded-xl bg-space-ink-raised hover:bg-space-ink-card border border-space-ink-border hover:border-nebula-aqua/30 text-starlight text-sm font-medium transition-all"
            >
              Explore Mini-Bots
            </button>
          </div>

          {/* Model Status reassurance */}
          <div className="pt-4 flex items-center gap-4 text-xs text-starlight-muted font-mono">
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${health.ollama_connected ? 'bg-signal-lime' : 'bg-coral'}`} />
              <span>Ollama: {health.configured_model}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-starlight-muted">
              <ShieldCheck className="w-3.5 h-3.5 text-nebula-aqua" />
              <span>100% Local Privacy</span>
            </span>
          </div>
        </div>

        {/* Right Column: One Main Mascot */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="cosmic-panel rounded-3xl p-8 w-full max-w-sm flex flex-col items-center text-center relative overflow-hidden">
            <Mascot size="xl" mood="happy" showDialogue={true} />
            <div className="mt-4 pt-4 border-t border-space-ink-border w-full flex items-center justify-between text-xs text-starlight-muted font-mono">
              <span>Interactive Creature</span>
              <span className="text-coral">Click to pet</span>
            </div>
          </div>
        </div>
      </section>

      {/* Useful Summary Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        {/* Task Summary Card */}
        <div className="cosmic-panel rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-nebula-aqua" />
                <h3 className="font-display font-semibold text-sm text-starlight">Everyday Tasks</h3>
              </div>
              <button
                onClick={() => onEnterWorkspace('tasks')}
                className="text-xs text-starlight-muted hover:text-nebula-aqua transition-colors flex items-center gap-0.5"
              >
                <span>View all</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* Progress */}
            <div className="space-y-1 mb-4">
              <div className="flex justify-between text-xs text-starlight-muted">
                <span>Completion</span>
                <span className="font-mono text-starlight">{progressPercent}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-space-ink overflow-hidden">
                <div
                  className="h-full bg-nebula-aqua rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Top pending tasks */}
            <div className="space-y-2">
              {pendingTasks.slice(0, 2).map((t) => (
                <div
                  key={t.id}
                  onClick={() => onToggleTask(t.id)}
                  className="p-2.5 rounded-xl bg-space-ink/60 border border-space-ink-border hover:border-nebula-aqua/30 cursor-pointer flex items-center gap-2.5 text-xs transition-colors"
                >
                  <div className="w-4 h-4 rounded border border-space-ink-border flex items-center justify-center flex-shrink-0">
                    {t.completed && <Check className="w-3 h-3 text-signal-lime" />}
                  </div>
                  <span className="truncate flex-1 text-starlight">{t.title}</span>
                </div>
              ))}
              {pendingTasks.length === 0 && (
                <p className="text-xs text-starlight-muted italic py-1">All tasks completed! Great job.</p>
              )}
            </div>
          </div>

          <button
            onClick={() => onEnterWorkspace('tasks')}
            className="w-full py-2 rounded-lg bg-space-ink-card hover:bg-space-ink-raised border border-space-ink-border text-xs text-starlight font-medium transition-colors"
          >
            Manage Task Queue
          </button>
        </div>

        {/* Featured Mini-Bots Card */}
        <div className="cosmic-panel rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BotIcon className="w-4 h-4 text-nebula-aqua" />
                <h3 className="font-display font-semibold text-sm text-starlight">Mini-Assistants</h3>
              </div>
              <button
                onClick={() => onEnterWorkspace('bots')}
                className="text-xs text-starlight-muted hover:text-nebula-aqua transition-colors flex items-center gap-0.5"
              >
                <span>View all</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <p className="text-xs text-starlight-muted mb-3">
              Specialized local personas with dedicated system instructions.
            </p>

            <div className="space-y-2">
              {bots.slice(1, 4).map((b) => (
                <div
                  key={b.id}
                  onClick={() => onEnterWorkspace('chat', b)}
                  className="p-2.5 rounded-xl bg-space-ink/60 border border-space-ink-border hover:border-nebula-aqua/30 cursor-pointer flex items-center justify-between text-xs group transition-colors"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-2 h-2 rounded-full bg-nebula-aqua" />
                    <span className="font-medium text-starlight group-hover:text-nebula-aqua transition-colors truncate">
                      {b.name}
                    </span>
                  </div>
                  <span className="text-[10px] text-starlight-muted font-mono">{b.category}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onEnterWorkspace('bots')}
            className="w-full py-2 rounded-lg bg-space-ink-card hover:bg-space-ink-raised border border-space-ink-border text-xs text-starlight font-medium transition-colors"
          >
            Create or Forge a Bot
          </button>
        </div>

        {/* Daily Insight Component */}
        <div className="flex flex-col justify-between">
          <DailyTip />
        </div>
      </section>
    </div>
  );
};
