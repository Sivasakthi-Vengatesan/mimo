import React, { useState } from 'react';
import { Lightbulb, RotateCcw, X } from 'lucide-react';
import { DAILY_TIPS } from '../lib/defaults';

interface DailyTipProps {
  onDismiss?: () => void;
}

export const DailyTip: React.FC<DailyTipProps> = ({ onDismiss }) => {
  const [tipIndex, setTipIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);

  const currentTip = DAILY_TIPS[tipIndex % DAILY_TIPS.length];

  const handleNext = () => {
    setTipIndex((prev) => (prev + 1) % DAILY_TIPS.length);
  };

  if (isDismissed) return null;

  const categoryColor: Record<string, string> = {
    Study: 'text-nebula-aqua border-nebula-aqua/30 bg-nebula-aqua/10',
    Productivity: 'text-ice-mint border-ice-mint/30 bg-ice-mint/10',
    Coding: 'text-soft-pink border-soft-pink/30 bg-soft-pink/10',
    Personal: 'text-coral border-coral/30 bg-coral/10',
    Motivation: 'text-signal-lime border-signal-lime/30 bg-signal-lime/10',
  };

  return (
    <div className="cosmic-panel rounded-2xl p-5 flex flex-col justify-between space-y-3 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-nebula-aqua/10 border border-nebula-aqua/30 flex items-center justify-center text-nebula-aqua">
            <Lightbulb className="w-3.5 h-3.5" />
          </div>
          <span className="font-display font-semibold text-xs text-starlight">
            Daily Insight
          </span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${
              categoryColor[currentTip.category] || categoryColor.Productivity
            }`}
          >
            {currentTip.category}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleNext}
            title="Next insight"
            className="w-7 h-7 rounded-lg bg-space-ink border border-space-ink-border flex items-center justify-center text-starlight-muted hover:text-starlight hover:border-nebula-aqua/30 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
          <button
            onClick={() => {
              setIsDismissed(true);
              if (onDismiss) onDismiss();
            }}
            title="Dismiss insight"
            className="w-7 h-7 rounded-lg bg-space-ink border border-space-ink-border flex items-center justify-center text-starlight-muted hover:text-starlight hover:border-space-ink-border transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="space-y-1">
        <h4 className="text-xs font-semibold text-starlight">
          {currentTip.title}
        </h4>
        <p className="text-xs text-starlight-muted leading-relaxed font-sans">
          {currentTip.tip}
        </p>
      </div>

      <div className="pt-2 border-t border-space-ink-border text-[11px] font-mono text-starlight-muted flex items-center justify-between">
        <span>Rotates on demand</span>
        <button
          onClick={handleNext}
          className="text-nebula-aqua hover:underline"
        >
          Cycle next tip →
        </button>
      </div>
    </div>
  );
};
