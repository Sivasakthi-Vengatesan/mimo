import React, { useState } from 'react';
import { Plus, Sparkles, Filter } from 'lucide-react';
import type { Bot, BotCategory } from '../types';
import { BotCard } from './BotCard';

interface BotGalleryProps {
  bots: Bot[];
  activeBot: Bot;
  onSelectBot: (bot: Bot) => void;
  onOpenCreateModal: () => void;
  onEditBot: (bot: Bot) => void;
  onDeleteBot: (botId: string) => void;
}

export const BotGallery: React.FC<BotGalleryProps> = ({
  bots,
  activeBot,
  onSelectBot,
  onOpenCreateModal,
  onEditBot,
  onDeleteBot,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredBots = bots.filter((b) => {
    if (selectedCategory === 'all') return true;
    return b.category === selectedCategory;
  });

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-300">
      {/* Header Row matching Orbis Section 3 */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-white/10">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-neon block mb-1">
            ✦ Specialized AI Personas
          </span>
          <h2 className="font-grotesk text-3xl sm:text-5xl uppercase tracking-wider text-cream leading-none">
            COLLECTION OF
          </h2>
          <div className="ml-8 sm:ml-16 flex items-baseline gap-2">
            <span className="font-condiment text-neon text-3xl sm:text-5xl -rotate-1 lowercase">
              space
            </span>
            <span className="font-grotesk text-3xl sm:text-5xl uppercase tracking-wider text-cream">
              ASSISTANTS
            </span>
          </div>
        </div>

        {/* Right: "CREATE BOT" button with neon underline bar */}
        <div className="flex flex-col items-start md:items-end">
          <button
            onClick={onOpenCreateModal}
            className="group flex flex-col items-start md:items-end cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="font-grotesk text-2xl sm:text-3xl uppercase tracking-wider text-cream group-hover:text-neon transition-colors">
                CREATE
              </span>
              <div className="flex flex-col items-start leading-none">
                <span className="font-grotesk text-sm sm:text-base uppercase tracking-wider text-cream group-hover:text-neon transition-colors">
                  NEW
                </span>
                <span className="font-grotesk text-sm sm:text-base uppercase tracking-wider text-cream group-hover:text-neon transition-colors">
                  ASSISTANT
                </span>
              </div>
            </div>
            {/* Neon Green Bar */}
            <div className="w-full h-2 bg-neon rounded-full mt-1.5 shadow-[0_0_12px_rgba(111,255,0,0.6)] group-hover:h-2.5 transition-all" />
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {['all', 'study', 'productivity', 'coding', 'custom'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full font-mono text-xs uppercase tracking-wider transition-all duration-200 ${selectedCategory === cat
              ? 'bg-neon text-cosmic-bg font-bold shadow-md shadow-neon/30 scale-105'
              : 'liquid-glass text-cream/80 hover:text-neon hover:border-neon/30'
              }`}
          >
            {cat} {cat === 'all' && `(${bots.length})`}
          </button>
        ))}
      </div>

      {/* Grid of Bot Cards (3 col desktop, 2 col tablet, 1 col mobile, gap 24px) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBots.map((bot) => (
          <BotCard
            key={bot.id}
            bot={bot}
            isActive={bot.id === activeBot.id}
            onSelect={onSelectBot}
            onEdit={onEditBot}
            onDelete={onDeleteBot}
          />
        ))}
      </div>
    </div>
  );
};
