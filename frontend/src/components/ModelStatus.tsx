import React, { useState } from 'react';
import { RefreshCw, Cpu, Check, AlertTriangle, ShieldCheck } from 'lucide-react';
import type { ModelHealth } from '../types';

interface ModelStatusProps {
  health: ModelHealth;
  onRefreshHealth: () => void;
}

export const ModelStatus: React.FC<ModelStatusProps> = ({ health, onRefreshHealth }) => {
  const [isChecking, setIsChecking] = useState(false);

  const handleManualCheck = async () => {
    setIsChecking(true);
    await onRefreshHealth();
    setTimeout(() => setIsChecking(false), 500);
  };

  const isHealthy = health.ollama_connected && health.model_available;

  return (
    <div className="cosmic-panel rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-nebula-aqua" />
          <span className="font-display font-semibold text-xs text-starlight">
            Local AI Engine Status
          </span>
        </div>

        <button
          onClick={handleManualCheck}
          disabled={isChecking}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-space-ink border border-space-ink-border text-xs font-mono text-starlight-muted hover:text-starlight hover:border-nebula-aqua/30 transition-colors"
          title="Ping backend & Ollama"
        >
          <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
          <span>{isChecking ? 'Testing...' : 'Check Ping'}</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
        {/* Backend Connectivity */}
        <div className="rounded-xl p-3 bg-space-ink border border-space-ink-border flex items-center justify-between">
          <span className="text-starlight-muted">FastAPI:</span>
          <span className="flex items-center gap-1.5 font-semibold text-starlight">
            <span className="w-1.5 h-1.5 rounded-full bg-signal-lime" />
            <span>Port 8000</span>
          </span>
        </div>

        {/* Ollama Model Connectivity */}
        <div className="rounded-xl p-3 bg-space-ink border border-space-ink-border flex items-center justify-between">
          <span className="text-starlight-muted">Model:</span>
          <span className="flex items-center gap-1.5 font-semibold text-starlight">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isHealthy ? 'bg-signal-lime shadow-[0_0_8px_#D8FF70]' : 'bg-coral'
              }`}
            />
            <span className="truncate max-w-[90px] text-nebula-aqua">{health.configured_model}</span>
          </span>
        </div>
      </div>

      {/* Error state if offline */}
      {!isHealthy && health.error && (
        <div className="p-3 rounded-xl bg-coral/15 border border-coral/30 text-coral text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-coral flex-shrink-0" />
          <span>{health.error}</span>
        </div>
      )}

      {isHealthy && (
        <div className="text-[11px] font-mono text-starlight-muted flex items-center justify-between px-0.5">
          <span className="flex items-center gap-1 text-starlight-muted">
            <ShieldCheck className="w-3.5 h-3.5 text-nebula-aqua" />
            <span>Local privacy guaranteed</span>
          </span>
          <span className="text-signal-lime flex items-center gap-1 font-semibold">
            <Check className="w-3 h-3" /> Ready
          </span>
        </div>
      )}
    </div>
  );
};
