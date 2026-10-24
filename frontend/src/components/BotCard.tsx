import React from 'react';
import { ChevronRight, Edit3, Trash2, Sparkles, Bot as BotIcon } from 'lucide-react';
import type { Bot } from '../types';

interface BotCardProps {
  bot: Bot;
  isActive: boolean;
  onSelect: (bot: Bot) => void;
  onEdit?: (bot: Bot) => void;
  onDelete?: (botId: string) => void;
}

export const BotCard: React.FC<BotCardProps> = ({
  bot,
  isActive,
  onSelect,
  onEdit,
  onDelete,
}) => {
  return (
    <div
      className={`liquid-glass rounded-[32px] p-[18px] transition-all duration-300 hover:bg-white/10 flex flex-col justify-between group relative ${isActive ? 'ring-2 ring-neon shadow-[0_0_30px_rgba(111,255,0,0.25)]' : 'border border-white/10'
        }`}
    >
      {/* Top Media: Video preview or mascot avatar */}
      <div className="relative w-full pb-[100%] rounded-[24px] overflow-hidden bg-cosmic-surface/60 mb-4">
        {bot.videoUrl ? (
          <video
            src={bot.videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-cosmic-surface-raised via-[#0c1b3d] to-cosmic-bg">
            <div className="w-20 h-20 rounded-full liquid-glass border border-neon/40 flex items-center justify-center text-neon shadow-[0_0_20px_rgba(111,255,0,0.3)] mb-3">
              <BotIcon className="w-10 h-10" />
            </div>
            <span className="font-mono text-xs uppercase tracking-widest text-neon">
              Custom Assistant
            </span>
          </div>
        )}

        {/* Category Pill Tag */}
        <div className="absolute top-3 left-3 z-10">
          <span className="liquid-glass px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider text-cream border border-white/20 backdrop-blur-md">
            {bot.category}
          </span>
        </div>

        {/* Custom Bot Action Buttons */}
        {!bot.isBuiltin && (
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(bot);
                }}
                title="Edit bot instructions"
                className="w-8 h-8 rounded-full liquid-glass flex items-center justify-center text-cream hover:text-neon transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(bot.id);
                }}
                title="Delete custom bot"
                className="w-8 h-8 rounded-full liquid-glass flex items-center justify-center text-cream hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bot Info */}
      <div className="px-1 mb-4 flex-1">
        <h3 className="font-grotesk text-xl uppercase tracking-wider text-cream group-hover:text-neon transition-colors mb-1">
          {bot.name}
        </h3>
        <p className="font-mono text-xs text-cosmic-muted uppercase tracking-wider line-clamp-1 mb-1.5">
          {bot.role}
        </p>
        <p className="text-xs text-cosmic-muted font-sans line-clamp-2 leading-relaxed">
          {bot.description}
        </p>
      </div>

      {/* Orbis Rarity / Chat Action Bar */}
      <div className="liquid-glass rounded-[20px] px-5 py-3.5 flex items-center justify-between border border-white/10 group-hover:border-white/25 transition-colors">
        <div className="flex flex-col">
          <span className="text-[11px] font-mono uppercase text-cream/70 tracking-widest">
            {bot.isBuiltin ? 'CAPABILITY SCORE:' : 'CUSTOM PROTOCOL:'}
          </span>
          <span className="font-grotesk text-base text-cream tracking-wide">
            {bot.score || 'LOCAL BOT'}
          </span>
        </div>

        {/* Circular Purple Gradient CTA Button */}
        <button
          onClick={() => onSelect(bot)}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-[#b724ff] to-[#7c3aed] flex items-center justify-center text-white shadow-lg shadow-purple-500/50 hover:scale-110 active:scale-95 transition-all duration-300 flex-shrink-0"
          title={`Chat with ${bot.name}`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
