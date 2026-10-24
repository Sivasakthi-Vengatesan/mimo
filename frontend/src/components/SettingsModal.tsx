import React, { useState } from 'react';
import { X, Settings as SettingsIcon, RotateCcw, AlertTriangle, ShieldCheck, Check } from 'lucide-react';
import type { UserSettings, ModelHealth } from '../types';
import { resetAllData } from '../lib/storage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
  health: ModelHealth;
  onRefreshHealth: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  health,
}) => {
  const [displayName, setDisplayName] = useState(settings.displayName);
  const [personality, setPersonality] = useState(settings.personality);
  const [mascotColor, setMascotColor] = useState(settings.mascotColor);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      ...settings,
      displayName: displayName.trim() || 'Explorer',
      personality,
      mascotColor,
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 350);
  };

  const handleFactoryReset = () => {
    resetAllData();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-ink/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-md cosmic-panel rounded-3xl p-6 sm:p-7 border border-space-ink-border shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-lg bg-space-ink border border-space-ink-border flex items-center justify-center text-starlight-muted hover:text-starlight transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="mb-5">
          <div className="flex items-center gap-2 text-nebula-aqua text-xs font-mono mb-1">
            <SettingsIcon className="w-3.5 h-3.5" />
            <span>Preferences & System</span>
          </div>
          <h2 className="font-display font-bold text-xl text-starlight">
            Settings
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4">
          {/* Display Name */}
          <div>
            <label className="block text-xs font-mono text-starlight-muted mb-1.5 uppercase tracking-wider">
              Your Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full bg-space-ink rounded-xl px-3.5 py-2.5 text-sm text-starlight border border-space-ink-border focus:outline-none focus:border-nebula-aqua"
            />
          </div>

          {/* Personality Preference */}
          <div>
            <label className="block text-xs font-mono text-starlight-muted mb-1.5 uppercase tracking-wider">
              MIMO Default Personality
            </label>
            <select
              value={personality}
              onChange={(e) => setPersonality(e.target.value)}
              className="w-full bg-space-ink rounded-xl px-3.5 py-2.5 text-sm text-starlight border border-space-ink-border focus:outline-none focus:border-nebula-aqua cursor-pointer"
            >
              <option value="Warm & Playful">Warm & Playful (Default)</option>
              <option value="Direct & Analytical">Direct & Analytical</option>
              <option value="Calm & Supportive">Calm & Supportive</option>
              <option value="Structured & Academic">Structured & Academic</option>
            </select>
          </div>

          {/* Mascot Accent Glow */}
          <div>
            <label className="block text-xs font-mono text-starlight-muted mb-1.5 uppercase tracking-wider">
              Mascot Visor Accent
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'coral', label: 'Coral', color: '#F29191' },
                { id: 'lime', label: 'Lime', color: '#D8FF70' },
                { id: 'pink', label: 'Soft Pink', color: '#F7ADAD' },
                { id: 'aqua', label: 'Aqua', color: '#B1E5E6' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setMascotColor(item.id as any)}
                  className={`p-2 rounded-xl text-center text-xs font-mono transition-all flex flex-col items-center gap-1.5 ${
                    mascotColor === item.id
                      ? 'border border-nebula-aqua bg-space-ink-card shadow-sm'
                      : 'bg-space-ink border border-space-ink-border text-starlight-muted'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-[10px]">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Local AI Details */}
          <div className="p-3.5 rounded-xl bg-space-ink border border-space-ink-border space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between text-starlight-muted">
              <span>Local Model Tag:</span>
              <span className="text-nebula-aqua font-bold">{health.configured_model}</span>
            </div>
            <div className="flex items-center justify-between text-starlight-muted">
              <span>Endpoint:</span>
              <span className="text-starlight">http://localhost:11434</span>
            </div>
            <div className="flex items-center justify-between text-starlight-muted">
              <span>Privacy Mode:</span>
              <span className="text-signal-lime flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> 100% On-Device
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-space-ink-border">
            <button
              type="button"
              onClick={() => setShowConfirmReset(!showConfirmReset)}
              className="text-xs font-mono text-coral hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Data</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl text-xs font-mono text-starlight-muted hover:text-starlight"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-signal-lime text-space-ink font-display font-semibold text-xs hover:bg-[#e4ff8a] transition-all flex items-center gap-1.5 shadow-sm"
              >
                {isSaved ? <Check className="w-3.5 h-3.5" /> : null}
                <span>{isSaved ? 'Saved!' : 'Save'}</span>
              </button>
            </div>
          </div>
        </form>

        {/* Reset Confirmation */}
        {showConfirmReset && (
          <div className="mt-4 p-4 rounded-xl bg-coral/10 border border-coral/30 space-y-2.5 animate-in fade-in">
            <div className="flex items-start gap-2 text-coral text-xs">
              <AlertTriangle className="w-4 h-4 text-coral flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold mb-0.5">Clear all local application data?</strong>
                <p className="leading-relaxed text-starlight-muted">
                  This will remove your stored tasks, custom bot definitions, and conversation histories from browser storage.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowConfirmReset(false)}
                className="px-3 py-1 rounded-lg text-xs font-mono text-starlight-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleFactoryReset}
                className="px-3.5 py-1 rounded-lg bg-coral text-space-ink text-xs font-mono font-semibold"
              >
                Confirm Erase
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
