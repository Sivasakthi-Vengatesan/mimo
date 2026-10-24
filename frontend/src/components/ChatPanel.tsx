import React, { useState, useEffect, useRef } from 'react';
import { Send, Trash2, RotateCcw, Sparkles, AlertCircle, Bot as BotIcon, ArrowRight, ShieldCheck } from 'lucide-react';
import type { Bot, ChatMessage as ChatMessageType, MascotMood, ModelHealth } from '../types';
import { ChatMessageItem } from './ChatMessage';
import { sendChatMessage } from '../lib/api';
import { loadChatHistory, saveChatHistory, clearChatHistory } from '../lib/storage';

interface ChatPanelProps {
  activeBot: Bot;
  allBots: Bot[];
  onSelectBot: (bot: Bot) => void;
  onSetMascotMood: (mood: MascotMood) => void;
  health: ModelHealth;
}

const STARTER_PROMPTS: Record<string, string[]> = {
  'mimo': [
    "What can you do as my local companion?",
    "Help me brainstorm 3 goals for this week.",
    "Give me a quick 5-minute study breakdown.",
    "Suggest a simple productivity framework."
  ],
  'study-buddy': [
    "Explain the concept of recursion in simple terms.",
    "Build a 3-day revision plan for my exams.",
    "Create 3 practice quiz questions about data structures.",
    "How does the Feynman technique help memorization?"
  ],
  'daily-planner': [
    "Help me organize my tasks for today.",
    "I have 4 assignments due soon. How should I prioritize?",
    "Suggest a balanced daily schedule for deep work.",
    "How do I prevent procrastination on large projects?"
  ],
  'coding-pal': [
    "Explain the difference between synchronous and asynchronous code.",
    "How do I debug a NullPointerException cleanly?",
    "Suggest a clean TypeScript pattern for managing state.",
    "What are React hooks and why do we use them?"
  ]
};

export const ChatPanel: React.FC<ChatPanelProps> = ({
  activeBot,
  allBots,
  onSelectBot,
  onSetMascotMood,
  health,
}) => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastUserMessage, setLastUserMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const saved = loadChatHistory(activeBot.id);
    setMessages(saved);
    setErrorMsg(null);
  }, [activeBot.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const prompt = (textToSend || inputText).trim();
    if (!prompt || isLoading) return;

    setErrorMsg(null);
    setLastUserMessage(prompt);
    setInputText('');

    const userMsg: ChatMessageType = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      role: 'user',
      content: prompt,
      timestamp: new Date().toISOString(),
      botId: activeBot.id,
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    saveChatHistory(activeBot.id, newHistory);

    setIsLoading(true);
    onSetMascotMood('thinking');

    try {
      const response = await sendChatMessage(
        prompt,
        activeBot.id,
        activeBot.systemPrompt,
        newHistory
      );

      const botMsg: ChatMessageType = {
        id: `msg-${Date.now()}-bot`,
        role: 'assistant',
        content: response.reply,
        timestamp: new Date().toISOString(),
        botId: activeBot.id,
        model: response.model,
      };

      const updatedHistory = [...newHistory, botMsg];
      setMessages(updatedHistory);
      saveChatHistory(activeBot.id, updatedHistory);
      onSetMascotMood('happy');
    } catch (err: any) {
      console.error('Chat error:', err);
      setErrorMsg(err.message || 'Failed to generate response. Please verify local Ollama connection.');
      onSetMascotMood('curious');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (lastUserMessage) {
      handleSendMessage(lastUserMessage);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm(`Clear chat history with ${activeBot.name}?`)) {
      clearChatHistory(activeBot.id);
      setMessages([]);
      setErrorMsg(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const currentStarters = STARTER_PROMPTS[activeBot.id] || STARTER_PROMPTS['mimo'];

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col h-[740px] max-h-[82vh] cosmic-panel rounded-3xl overflow-hidden shadow-subtle">
      {/* Chat Header */}
      <div className="px-5 py-3.5 border-b border-space-ink-border bg-space-ink-raised/70 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-space-ink-card border border-nebula-aqua/30 flex items-center justify-center text-nebula-aqua">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-semibold text-sm text-starlight">
                {activeBot.name}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-space-ink border border-space-ink-border text-nebula-aqua">
                {activeBot.category}
              </span>
            </div>
            <p className="text-xs text-starlight-muted line-clamp-1 max-w-[280px] sm:max-w-md">
              {activeBot.role} • {activeBot.personality}
            </p>
          </div>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Bot Switcher Dropdown */}
          <select
            value={activeBot.id}
            onChange={(e) => {
              const selected = allBots.find((b) => b.id === e.target.value);
              if (selected) onSelectBot(selected);
            }}
            aria-label="Switch active AI bot"
            className="text-xs font-mono text-starlight rounded-lg px-2.5 py-1.5 border border-space-ink-border bg-space-ink hover:border-nebula-aqua/30 focus:outline-none cursor-pointer"
          >
            {allBots.map((b) => (
              <option key={b.id} value={b.id} className="bg-space-ink text-starlight">
                {b.name}
              </option>
            ))}
          </select>

          {messages.length > 0 && (
            <button
              onClick={handleClearHistory}
              title="Clear conversation"
              className="w-8 h-8 rounded-lg bg-space-ink border border-space-ink-border flex items-center justify-center text-starlight-muted hover:text-coral transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-6 animate-in fade-in">
            <div className="w-12 h-12 rounded-2xl bg-space-ink-raised border border-nebula-aqua/25 flex items-center justify-center text-nebula-aqua shadow-sm">
              <BotIcon className="w-6 h-6" />
            </div>

            <div className="max-w-md space-y-1.5">
              <h3 className="font-display font-semibold text-lg text-starlight">
                {activeBot.name} is ready
              </h3>
              <p className="text-xs text-starlight-muted">
                {activeBot.description}
              </p>
              <div className="pt-2 inline-flex items-center gap-1.5 text-[11px] font-mono text-starlight-muted">
                <span className="w-1.5 h-1.5 rounded-full bg-signal-lime" />
                <span>Running local <strong className="text-starlight">{health.configured_model}</strong></span>
              </div>
            </div>

            {/* Quick Starter Chips */}
            <div className="w-full max-w-lg space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-starlight-muted block text-center">
                Starter Questions
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                {currentStarters.map((starter, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(starter)}
                    className="p-3 rounded-xl cosmic-card hover:border-nebula-aqua/40 text-xs text-starlight/90 transition-all text-left flex items-start justify-between group"
                  >
                    <span>{starter}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-starlight-muted group-hover:text-nebula-aqua group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-0.5 ml-1.5" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <ChatMessageItem key={msg.id} message={msg} bot={activeBot} />
          ))
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center gap-3 text-xs text-starlight-muted animate-in fade-in">
            <div className="w-8 h-8 rounded-xl bg-space-ink-card border border-nebula-aqua/30 flex items-center justify-center text-nebula-aqua">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="cosmic-card px-4 py-2 rounded-2xl rounded-tl-none border border-nebula-aqua/20 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-signal-lime animate-ping" />
              <span className="font-mono text-xs text-starlight">
                Thinking with {health.configured_model}...
              </span>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-coral/10 border border-coral/30 text-coral text-xs flex items-start justify-between gap-3 animate-in fade-in">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-coral flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold mb-0.5">Inference notice</strong>
                <span>{errorMsg}</span>
              </div>
            </div>
            {lastUserMessage && (
              <button
                onClick={handleRetry}
                className="px-2.5 py-1 rounded bg-coral/20 hover:bg-coral/30 text-starlight font-mono text-[11px] transition-colors flex items-center gap-1 flex-shrink-0"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Retry</span>
              </button>
            )}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-space-ink-border bg-space-ink-raised/50">
        <div className="relative flex items-end gap-2 bg-space-ink border border-space-ink-border focus-within:border-nebula-aqua/50 rounded-2xl p-2 transition-colors">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${activeBot.name}... (Enter to send)`}
            rows={1}
            disabled={isLoading}
            className="flex-1 bg-transparent text-starlight placeholder-starlight-muted text-sm px-3 py-2 resize-none focus:outline-none max-h-32 min-h-[40px] font-sans"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isLoading}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
              inputText.trim() && !isLoading
                ? 'bg-signal-lime text-space-ink hover:bg-[#e4ff8a] shadow-sm'
                : 'bg-space-ink-card text-starlight-muted cursor-not-allowed opacity-50'
            }`}
            title="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-starlight-muted px-1">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-nebula-aqua" />
            <span>On-device Qwen 3.5</span>
          </span>
          <span>Shift + Enter for new line</span>
        </div>
      </div>
    </div>
  );
};
