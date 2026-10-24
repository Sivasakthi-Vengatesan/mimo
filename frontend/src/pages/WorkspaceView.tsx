import React from 'react';
import { MessageSquare, Bot as BotIcon, CheckSquare } from 'lucide-react';
import type { Bot, Task, MascotMood, UserSettings, ModelHealth } from '../types';
import { ChatPanel } from '../components/ChatPanel';
import { BotGallery } from '../components/BotGallery';
import { TaskPanel } from '../components/TaskPanel';

interface WorkspaceViewProps {
  activeTab: 'chat' | 'bots' | 'tasks' | 'settings';
  onTabChange: (tab: 'chat' | 'bots' | 'tasks') => void;
  activeBot: Bot;
  allBots: Bot[];
  onSelectBot: (bot: Bot) => void;
  onOpenCreateBotModal: () => void;
  onEditBot: (bot: Bot) => void;
  onDeleteBot: (botId: string) => void;
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  mascotMood: MascotMood;
  onSetMascotMood: (mood: MascotMood) => void;
  settings: UserSettings;
  health: ModelHealth;
  onRefreshHealth: () => void;
}

export const WorkspaceView: React.FC<WorkspaceViewProps> = ({
  activeTab,
  onTabChange,
  activeBot,
  allBots,
  onSelectBot,
  onOpenCreateBotModal,
  onEditBot,
  onDeleteBot,
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onEditTask,
  onSetMascotMood,
  health,
}) => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in">
      {/* Workspace Subnav Pills */}
      <div className="flex items-center justify-between border-b border-space-ink-border pb-3">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-space-ink-raised border border-space-ink-border">
          <button
            onClick={() => onTabChange('chat')}
            className={`px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition-all ${
              activeTab === 'chat'
                ? 'bg-space-ink text-starlight font-semibold shadow-sm border border-nebula-aqua/30'
                : 'text-starlight-muted hover:text-starlight'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-nebula-aqua" />
            <span>Companion Chat</span>
            <span className="text-[10px] font-mono text-starlight-muted">({activeBot.name})</span>
          </button>

          <button
            onClick={() => onTabChange('bots')}
            className={`px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition-all ${
              activeTab === 'bots'
                ? 'bg-space-ink text-starlight font-semibold shadow-sm border border-nebula-aqua/30'
                : 'text-starlight-muted hover:text-starlight'
            }`}
          >
            <BotIcon className="w-3.5 h-3.5 text-nebula-aqua" />
            <span>My Bots</span>
            <span className="text-[10px] font-mono text-starlight-muted">({allBots.length})</span>
          </button>

          <button
            onClick={() => onTabChange('tasks')}
            className={`px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition-all ${
              activeTab === 'tasks'
                ? 'bg-space-ink text-starlight font-semibold shadow-sm border border-nebula-aqua/30'
                : 'text-starlight-muted hover:text-starlight'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5 text-nebula-aqua" />
            <span>Task Hub</span>
            <span className="text-[10px] font-mono text-starlight-muted">({tasks.length})</span>
          </button>
        </div>

        {/* Status Chip */}
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-starlight-muted">
          <span className="w-1.5 h-1.5 rounded-full bg-signal-lime" />
          <span>Local Engine Active</span>
        </div>
      </div>

      {/* Dynamic Tab Content */}
      <div className="w-full pt-2">
        {activeTab === 'chat' && (
          <ChatPanel
            activeBot={activeBot}
            allBots={allBots}
            onSelectBot={onSelectBot}
            onSetMascotMood={onSetMascotMood}
            health={health}
          />
        )}

        {activeTab === 'bots' && (
          <BotGallery
            bots={allBots}
            activeBot={activeBot}
            onSelectBot={(bot) => {
              onSelectBot(bot);
              onTabChange('chat');
            }}
            onOpenCreateModal={onOpenCreateBotModal}
            onEditBot={onEditBot}
            onDeleteBot={onDeleteBot}
          />
        )}

        {activeTab === 'tasks' && (
          <TaskPanel
            tasks={tasks}
            onAddTask={onAddTask}
            onToggleTask={onToggleTask}
            onDeleteTask={onDeleteTask}
            onEditTask={onEditTask}
            onSetMascotMood={onSetMascotMood}
          />
        )}
      </div>
    </div>
  );
};
