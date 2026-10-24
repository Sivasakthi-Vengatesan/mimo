import React, { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import type { Bot, BotCategory } from '../types';

interface BotCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveBot: (bot: Bot) => void;
  editingBot?: Bot | null;
}

const ROLE_TEMPLATES: Record<string, { role: string; personality: string; prompt: string }> = {
  study: {
    role: "Academic Revision Specialist",
    personality: "Patient, methodical, encouraging",
    prompt: "You are an academic revision assistant. Break complex topics down using the Feynman Technique, quiz the user on core principles, and organize study sessions into manageable milestones.",
  },
  productivity: {
    role: "Workflow & Habit Strategist",
    personality: "Action-oriented, calm, practical",
    prompt: "You are a daily productivity assistant. Help prioritize tasks by urgency and impact, design realistic time-blocks, and keep the user motivated without burning out.",
  },
  coding: {
    role: "Full-Stack Software Mentor",
    personality: "Analytical, precise, supportive",
    prompt: "You are a software engineering assistant. Explain algorithmic concepts clearly, debug code snippets, recommend best architectural patterns, and provide well-commented examples.",
  },
  custom: {
    role: "Creative Brainstorm Partner",
    personality: "Inventive, playful, thoughtful",
    prompt: "You are a creative brainstorming partner. Explore unorthodox ideas, ask provocative questions, and help synthesize raw thoughts into polished concepts.",
  },
};

export const BotCreatorModal: React.FC<BotCreatorModalProps> = ({
  isOpen,
  onClose,
  onSaveBot,
  editingBot,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [role, setRole] = useState('');
  const [category, setCategory] = useState<BotCategory>('custom');
  const [personality, setPersonality] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (editingBot) {
      setName(editingBot.name);
      setDescription(editingBot.description);
      setRole(editingBot.role);
      setCategory(editingBot.category);
      setPersonality(editingBot.personality);
      setSystemPrompt(editingBot.systemPrompt);
    } else {
      setName('');
      setDescription('');
      setCategory('custom');
      applyTemplate('custom');
    }
    setErrorMsg('');
  }, [editingBot, isOpen]);

  const applyTemplate = (cat: BotCategory) => {
    const template = ROLE_TEMPLATES[cat];
    if (template) {
      setRole(template.role);
      setPersonality(template.personality);
      setSystemPrompt(template.prompt);
    }
  };

  const handleCategoryChange = (cat: BotCategory) => {
    setCategory(cat);
    if (!editingBot) {
      applyTemplate(cat);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter a name for your assistant.');
      return;
    }
    if (!systemPrompt.trim()) {
      setErrorMsg('Please enter system instructions for your assistant.');
      return;
    }

    const botId = editingBot ? editingBot.id : `custom-bot-${Date.now()}`;
    const newBot: Bot = {
      id: botId,
      name: name.trim(),
      description: description.trim() || `Custom ${role} companion for specialized local assistance.`,
      role: role.trim() || 'Custom Assistant',
      personality: personality.trim() || 'Helpful and focused',
      systemPrompt: systemPrompt.trim(),
      avatar: 'astronaut-custom',
      category: category,
      isBuiltin: false,
      score: 'CUSTOM',
    };

    onSaveBot(newBot);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-ink/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg cosmic-panel rounded-3xl p-6 sm:p-7 border border-space-ink-border shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-lg bg-space-ink border border-space-ink-border flex items-center justify-center text-starlight-muted hover:text-starlight transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-5">
          <div className="flex items-center gap-2 text-nebula-aqua text-xs font-mono mb-1">
            <Sparkles className="w-3.5 h-3.5 text-nebula-aqua" />
            <span>Assistant Forge</span>
          </div>
          <h2 className="font-display font-bold text-xl text-starlight">
            {editingBot ? 'Edit Assistant' : 'Create Mini-AI Assistant'}
          </h2>
          <p className="text-xs text-starlight-muted mt-0.5">
            Configure custom system instructions for your local Qwen model.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-coral/15 border border-coral/30 text-coral text-xs">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Selector */}
          <div>
            <label className="block text-xs font-mono text-starlight-muted mb-1.5 uppercase tracking-wider">
              Category Preset
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['study', 'productivity', 'coding', 'custom'] as BotCategory[]).map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
                    category === cat
                      ? 'bg-nebula-aqua text-space-ink font-semibold'
                      : 'bg-space-ink border border-space-ink-border text-starlight-muted hover:text-starlight'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Bot Name */}
          <div>
            <label className="block text-xs font-mono text-starlight-muted mb-1 uppercase tracking-wider">
              Assistant Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Physics Mentor, Deep Work Coach"
              className="w-full bg-space-ink rounded-xl px-3.5 py-2.5 text-sm text-starlight placeholder-starlight-muted border border-space-ink-border focus:outline-none focus:border-nebula-aqua"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-xs font-mono text-starlight-muted mb-1 uppercase tracking-wider">
              Role & Purpose
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Kinematics Specialist"
              className="w-full bg-space-ink rounded-xl px-3.5 py-2.5 text-sm text-starlight placeholder-starlight-muted border border-space-ink-border focus:outline-none focus:border-nebula-aqua"
            />
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-xs font-mono text-starlight-muted mb-1 uppercase tracking-wider">
              Short Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Shown on the assistant card"
              className="w-full bg-space-ink rounded-xl px-3.5 py-2.5 text-sm text-starlight placeholder-starlight-muted border border-space-ink-border focus:outline-none focus:border-nebula-aqua"
            />
          </div>

          {/* System Instructions */}
          <div>
            <label className="block text-xs font-mono text-starlight-muted mb-1 uppercase tracking-wider">
              System Instructions (Server-Side Prompt) *
            </label>
            <textarea
              rows={4}
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="Provide exact instructions on how Qwen should converse as this assistant..."
              className="w-full bg-space-ink rounded-xl p-3 text-xs text-starlight placeholder-starlight-muted border border-space-ink-border focus:outline-none focus:border-nebula-aqua font-mono resize-none leading-relaxed"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-space-ink-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-mono text-starlight-muted hover:text-starlight"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-signal-lime text-space-ink font-display font-semibold text-xs hover:bg-[#e4ff8a] transition-all shadow-sm"
            >
              {editingBot ? 'Save Changes' : 'Create Assistant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
