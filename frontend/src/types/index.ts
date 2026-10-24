export type MascotMood = 'idle' | 'happy' | 'thinking' | 'curious' | 'excited' | 'sleepy';

export type BotCategory = 'study' | 'productivity' | 'coding' | 'custom';

export interface Bot {
  id: string;
  name: string;
  description: string;
  role: string;
  personality: string;
  systemPrompt: string;
  avatar: string;
  category: BotCategory;
  isBuiltin: boolean;
  score?: string;
  videoUrl?: string;
}

export type TaskPriority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  completed: boolean;
  dueDate?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  botId: string;
  model?: string;
}

export interface TaskBreakdownStep {
  title: string;
  description: string;
  priority: TaskPriority;
}

export interface DailyTipItem {
  id: string;
  category: 'Study' | 'Productivity' | 'Coding' | 'Personal' | 'Motivation';
  title: string;
  tip: string;
}

export interface UserSettings {
  displayName: string;
  personality: string;
  mascotColor: 'lime' | 'pink' | 'peach' | 'cyan';
  showTips: boolean;
}

export interface ModelHealth {
  status: 'checking' | 'healthy' | 'offline' | 'degraded' | 'error';
  ollama_connected: boolean;
  configured_model: string;
  model_available: boolean;
  available_models: string[];
  error?: string | null;
}
