import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight, AlertCircle } from 'lucide-react';
import type { TaskBreakdownStep, TaskPriority } from '../types';
import { breakdownGoalWithAI } from '../lib/api';

interface TaskBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTasks: (steps: { title: string; description: string; priority: TaskPriority }[]) => void;
}

export const TaskBreakdownModal: React.FC<TaskBreakdownModalProps> = ({
  isOpen,
  onClose,
  onAddTasks,
}) => {
  const [goal, setGoal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<(TaskBreakdownStep & { selected: boolean })[]>([]);

  const handleDeconstruct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim() || isLoading) return;

    setIsLoading(true);
    setErrorMsg(null);
    setSuggestions([]);

    try {
      const steps = await breakdownGoalWithAI(goal.trim());
      setSuggestions(steps.map((s) => ({ ...s, selected: true })));
    } catch (err: any) {
      console.error('Task breakdown error:', err);
      setErrorMsg(err.message || 'Failed to decompose goal. Please verify local model status.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelect = (index: number) => {
    setSuggestions((prev) =>
      prev.map((item, i) => (i === index ? { ...item, selected: !item.selected } : item))
    );
  };

  const handleConfirmAdd = () => {
    const selectedSteps = suggestions
      .filter((s) => s.selected)
      .map((s) => ({
        title: s.title,
        description: s.description,
        priority: s.priority,
      }));

    if (selectedSteps.length > 0) {
      onAddTasks(selectedSteps);
      onClose();
      setGoal('');
      setSuggestions([]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-ink/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg cosmic-panel rounded-3xl p-6 sm:p-7 border border-space-ink-border shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-lg bg-space-ink border border-space-ink-border flex items-center justify-center text-starlight-muted hover:text-starlight transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="mb-5">
          <div className="flex items-center gap-2 text-nebula-aqua text-xs font-mono mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Goal Deconstruction</span>
          </div>
          <h2 className="font-display font-bold text-xl text-starlight">
            Break It Down
          </h2>
          <p className="text-xs text-starlight-muted mt-0.5">
            Enter a large goal. Local Qwen will synthesize actionable milestone steps.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleDeconstruct} className="space-y-3 mb-5">
          <div className="flex gap-2">
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. Prepare for Java exam, Build my portfolio website..."
              disabled={isLoading}
              className="flex-1 bg-space-ink rounded-xl px-3.5 py-2.5 text-sm text-starlight placeholder-starlight-muted border border-space-ink-border focus:outline-none focus:border-nebula-aqua"
            />
            <button
              type="submit"
              disabled={!goal.trim() || isLoading}
              className={`px-4 py-2.5 rounded-xl font-display font-semibold text-xs flex items-center gap-1.5 transition-all ${
                goal.trim() && !isLoading
                  ? 'bg-signal-lime text-space-ink hover:bg-[#e4ff8a] shadow-sm'
                  : 'bg-space-ink-card text-starlight-muted cursor-not-allowed opacity-50'
              }`}
            >
              <span>{isLoading ? 'Deconstructing...' : 'Deconstruct'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* Loading State */}
        {isLoading && (
          <div className="p-6 text-center space-y-2.5 rounded-2xl bg-space-ink/70 border border-nebula-aqua/20">
            <div className="w-8 h-8 rounded-full border-2 border-nebula-aqua border-t-transparent animate-spin mx-auto" />
            <p className="font-display font-medium text-sm text-starlight">
              Analyzing Goal Milestones...
            </p>
            <p className="text-xs text-starlight-muted font-mono">
              Qwen 3.5 is structuring actionable steps.
            </p>
          </div>
        )}

        {/* Error State */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-coral/15 border border-coral/30 text-coral text-xs flex items-start gap-2.5 mb-4">
            <AlertCircle className="w-4 h-4 text-coral flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold mb-0.5">Could not break down goal</strong>
              <span>{errorMsg}</span>
            </div>
          </div>
        )}

        {/* Suggestions List */}
        {suggestions.length > 0 && (
          <div className="space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between text-xs font-mono text-starlight-muted">
              <span>Select steps to import:</span>
              <span>{suggestions.filter((s) => s.selected).length} of {suggestions.length} selected</span>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {suggestions.map((step, idx) => (
                <div
                  key={idx}
                  onClick={() => toggleSelect(idx)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                    step.selected
                      ? 'bg-space-ink-raised border-nebula-aqua/40 text-starlight'
                      : 'bg-space-ink/40 border-space-ink-border opacity-50 text-starlight-muted'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center transition-colors flex-shrink-0 mt-0.5 ${
                      step.selected ? 'bg-signal-lime text-space-ink' : 'border border-space-ink-border'
                    }`}
                  >
                    {step.selected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-semibold text-starlight leading-snug">
                        {step.title}
                      </h4>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-space-ink border border-space-ink-border text-nebula-aqua">
                        {step.priority}
                      </span>
                    </div>
                    {step.description && (
                      <p className="text-[11px] text-starlight-muted mt-0.5 leading-relaxed">
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Confirm Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-space-ink-border">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-mono text-starlight-muted hover:text-starlight"
              >
                Dismiss
              </button>
              <button
                type="button"
                onClick={handleConfirmAdd}
                disabled={suggestions.filter((s) => s.selected).length === 0}
                className="px-5 py-2.5 rounded-xl bg-signal-lime text-space-ink font-display font-semibold text-xs hover:bg-[#e4ff8a] transition-all disabled:opacity-40"
              >
                Add {suggestions.filter((s) => s.selected).length} Tasks
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
