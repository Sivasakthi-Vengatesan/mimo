import React, { useState, useEffect } from 'react';
import { OrbisLanding } from './pages/OrbisLanding';
import { WorkspaceView } from './pages/WorkspaceView';
import { LiquidGlassNav } from './components/LiquidGlassNav';
import { BotCreatorModal } from './components/BotCreatorModal';
import { SettingsModal } from './components/SettingsModal';
import type { Bot, Task, MascotMood, UserSettings, ModelHealth } from './types';
import { getAllBots, saveCustomBot, deleteCustomBot, loadTasks, saveTasks, loadUserSettings, saveUserSettings } from './lib/storage';
import { checkBackendHealth } from './lib/api';

export function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'workspace'>('landing');
  const [activeTab, setActiveTab] = useState<'chat' | 'bots' | 'tasks' | 'settings'>('chat');
  const [mascotMood, setMascotMood] = useState<MascotMood>('idle');

  // Bots state
  const [bots, setBots] = useState<Bot[]>([]);
  const [activeBot, setActiveBot] = useState<Bot | null>(null);
  const [isBotCreatorOpen, setIsBotCreatorOpen] = useState(false);
  const [editingBot, setEditingBot] = useState<Bot | null>(null);

  // Tasks state
  const [tasks, setTasks] = useState<Task[]>([]);

  // Settings state
  const [settings, setSettings] = useState<UserSettings>(loadUserSettings());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Health state
  const [health, setHealth] = useState<ModelHealth>({
    status: 'checking',
    ollama_connected: false,
    configured_model: 'qwen3.5:2b',
    model_available: false,
    available_models: [],
    error: null,
  });

  // Initial load
  useEffect(() => {
    const loadedBots = getAllBots();
    setBots(loadedBots);
    if (loadedBots.length > 0) {
      setActiveBot(loadedBots[0]);
    }

    const loadedTasks = loadTasks();
    setTasks(loadedTasks);

    const loadedSettings = loadUserSettings();
    setSettings(loadedSettings);

    refreshHealth();

    // Check health every 30 seconds
    const interval = setInterval(refreshHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const refreshHealth = async () => {
    const status = await checkBackendHealth();
    setHealth(status);
  };

  // Bot operations
  const handleSaveBot = (newBot: Bot) => {
    saveCustomBot(newBot);
    const updated = getAllBots();
    setBots(updated);
    setActiveBot(newBot);
  };

  const handleDeleteBot = (botId: string) => {
    if (window.confirm("Are you sure you want to delete this custom assistant?")) {
      deleteCustomBot(botId);
      const updated = getAllBots();
      setBots(updated);
      if (activeBot?.id === botId) {
        setActiveBot(updated[0]);
      }
    }
  };

  // Task operations
  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newTask, ...tasks];
    setTasks(updated);
    saveTasks(updated);
  };

  const handleToggleTask = (taskId: string) => {
    const updated = tasks.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    setTasks(updated);
    saveTasks(updated);
  };

  const handleDeleteTask = (taskId: string) => {
    const updated = tasks.filter((t) => t.id !== taskId);
    setTasks(updated);
    saveTasks(updated);
  };

  const handleEditTask = (editedTask: Task) => {
    const updated = tasks.map((t) => (t.id === editedTask.id ? editedTask : t));
    setTasks(updated);
    saveTasks(updated);
  };

  // Settings update
  const handleUpdateSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    saveUserSettings(newSettings);
  };

  // Navigation helper
  const handleNavigate = (view: 'landing' | 'workspace', tab?: 'chat' | 'bots' | 'tasks' | 'settings') => {
    setCurrentView(view);
    if (tab) setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEnterFromLanding = (initialTab: 'chat' | 'bots' | 'tasks' = 'chat', bot?: Bot) => {
    setCurrentView('workspace');
    setActiveTab(initialTab);
    if (bot) setActiveBot(bot);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#010828] text-cream font-mono relative selection:bg-neon selection:text-[#010828]">
      {currentView === 'landing' ? (
        <>
          {/* Exact Orbis-style 4-section Landing Page adapted for MIMO */}
          <OrbisLanding
            onOpenWorkspace={(tab) => handleEnterFromLanding(tab || 'chat')}
            onOpenChatWithBot={(botId) => {
              const matched = bots.find(b => b.id === botId || b.name.toLowerCase().includes(botId.toLowerCase())) || bots[0];
              handleEnterFromLanding('chat', matched);
            }}
            onOpenCreateBotModal={() => {
              setEditingBot(null);
              setIsBotCreatorOpen(true);
            }}
          />
        </>
      ) : (
        <div className="min-h-screen flex flex-col bg-[#010828]">
          {/* Workspace Nav Bar */}
          <LiquidGlassNav
            currentView={currentView}
            activeTab={activeTab}
            onNavigate={handleNavigate}
            onOpenSettings={() => setIsSettingsOpen(true)}
            health={health}
          />

          {/* Main Workspace Area */}
          <main className="relative z-10 w-full flex-1">
            {activeBot && (
              <WorkspaceView
                activeTab={activeTab}
                onTabChange={(tab) => setActiveTab(tab)}
                activeBot={activeBot}
                allBots={bots}
                onSelectBot={(b) => setActiveBot(b)}
                onOpenCreateBotModal={() => {
                  setEditingBot(null);
                  setIsBotCreatorOpen(true);
                }}
                onEditBot={(b) => {
                  setEditingBot(b);
                  setIsBotCreatorOpen(true);
                }}
                onDeleteBot={handleDeleteBot}
                tasks={tasks}
                onAddTask={handleAddTask}
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
                onEditTask={handleEditTask}
                mascotMood={mascotMood}
                onSetMascotMood={setMascotMood}
                settings={settings}
                health={health}
                onRefreshHealth={refreshHealth}
              />
            )}
          </main>
        </div>
      )}

      {/* Bot Creator Modal */}
      <BotCreatorModal
        isOpen={isBotCreatorOpen}
        onClose={() => {
          setIsBotCreatorOpen(false);
          setEditingBot(null);
        }}
        onSaveBot={handleSaveBot}
        editingBot={editingBot}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        health={health}
        onRefreshHealth={refreshHealth}
      />
    </div>
  );
}

export default App;
