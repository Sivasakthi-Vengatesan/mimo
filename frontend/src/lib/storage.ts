import { Task, Bot, ChatMessage, UserSettings } from '../types';
import { BUILTIN_BOTS, INITIAL_TASKS, DEFAULT_USER_SETTINGS } from './defaults';

const TASKS_KEY = 'mimo_tasks_v1';
const BOTS_KEY = 'mimo_custom_bots_v1';
const CHAT_KEY_PREFIX = 'mimo_chat_v1_';
const SETTINGS_KEY = 'mimo_settings_v1';

// Tasks Storage
export function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(TASKS_KEY);
    if (!raw) {
      saveTasks(INITIAL_TASKS);
      return INITIAL_TASKS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_TASKS;
  } catch (err) {
    console.error('Failed to parse tasks from localStorage:', err);
    return INITIAL_TASKS;
  }
}

export function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.error('Failed to save tasks to localStorage:', err);
  }
}

// Bots Storage (Combines Builtin + Custom)
export function loadCustomBots(): Bot[] {
  try {
    const raw = localStorage.getItem(BOTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to parse custom bots:', err);
    return [];
  }
}

export function getAllBots(): Bot[] {
  const custom = loadCustomBots();
  // Ensure builtin bots are always present, custom bots appended
  return [...BUILTIN_BOTS, ...custom];
}

export function saveCustomBot(bot: Bot): void {
  try {
    const custom = loadCustomBots();
    const existingIndex = custom.findIndex((b) => b.id === bot.id);
    let updated: Bot[];
    if (existingIndex >= 0) {
      updated = [...custom];
      updated[existingIndex] = bot;
    } else {
      updated = [...custom, bot];
    }
    localStorage.setItem(BOTS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save custom bot:', err);
  }
}

export function deleteCustomBot(botId: string): void {
  try {
    const custom = loadCustomBots();
    const filtered = custom.filter((b) => b.id !== botId);
    localStorage.setItem(BOTS_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.error('Failed to delete custom bot:', err);
  }
}

// Chat History Storage
export function loadChatHistory(botId: string): ChatMessage[] {
  try {
    const raw = localStorage.getItem(`${CHAT_KEY_PREFIX}${botId}`);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error(`Failed to load chat history for ${botId}:`, err);
    return [];
  }
}

export function saveChatHistory(botId: string, messages: ChatMessage[]): void {
  try {
    // Keep max 50 recent messages in localStorage
    const bounded = messages.slice(-50);
    localStorage.setItem(`${CHAT_KEY_PREFIX}${botId}`, JSON.stringify(bounded));
  } catch (err) {
    console.error(`Failed to save chat history for ${botId}:`, err);
  }
}

export function clearChatHistory(botId: string): void {
  try {
    localStorage.removeItem(`${CHAT_KEY_PREFIX}${botId}`);
  } catch (err) {
    console.error(`Failed to clear chat for ${botId}:`, err);
  }
}

// User Settings
export function loadUserSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_USER_SETTINGS;
    return { ...DEFAULT_USER_SETTINGS, ...JSON.parse(raw) };
  } catch (err) {
    console.error('Failed to load user settings:', err);
    return DEFAULT_USER_SETTINGS;
  }
}

export function saveUserSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings:', err);
  }
}

// Factory Reset
export function resetAllData(): void {
  try {
    localStorage.removeItem(TASKS_KEY);
    localStorage.removeItem(BOTS_KEY);
    localStorage.removeItem(SETTINGS_KEY);
    // Remove all chat keys
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CHAT_KEY_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch (err) {
    console.error('Failed to reset all data:', err);
  }
}
