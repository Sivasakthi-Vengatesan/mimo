import React from 'react';
import { User, Sparkles } from 'lucide-react';
import type { ChatMessage as ChatMessageType, Bot } from '../types';

interface ChatMessageProps {
  message: ChatMessageType;
  bot: Bot;
}

export const ChatMessageItem: React.FC<ChatMessageProps> = ({ message, bot }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full gap-3 ${isUser ? 'justify-end' : 'justify-start'} group animate-in fade-in`}>
      {/* Assistant Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-space-ink-card border border-nebula-aqua/30 flex-shrink-0 flex items-center justify-center text-nebula-aqua mt-0.5 shadow-sm">
          <Sparkles className="w-4 h-4" />
        </div>
      )}

      {/* Message Bubble */}
      <div
        className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 text-sm leading-relaxed ${
          isUser
            ? 'bg-space-ink-raised text-starlight border border-space-ink-border rounded-tr-none'
            : 'cosmic-card text-starlight rounded-tl-none border border-nebula-aqua/15'
        }`}
      >
        {/* Header line */}
        <div className="flex items-center justify-between gap-4 mb-1.5 text-xs font-mono text-starlight-muted">
          <span className="font-semibold text-starlight">
            {isUser ? 'You' : bot.name}
          </span>
          <div className="flex items-center gap-2">
            {!isUser && message.model && (
              <span className="px-1.5 py-0.5 rounded bg-space-ink/70 border border-space-ink-border text-[10px] text-nebula-aqua font-mono">
                {message.model}
              </span>
            )}
            <span className="text-[11px]">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        {/* Content body */}
        <div className="whitespace-pre-wrap break-words font-sans text-[13.5px] leading-relaxed text-starlight/95">
          {message.content}
        </div>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="w-8 h-8 rounded-xl bg-space-ink-raised border border-space-ink-border flex-shrink-0 flex items-center justify-center text-starlight-muted mt-0.5">
          <User className="w-4 h-4 text-starlight" />
        </div>
      )}
    </div>
  );
};
