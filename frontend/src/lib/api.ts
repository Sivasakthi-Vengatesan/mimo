import { ModelHealth, ChatMessage, TaskBreakdownStep } from '../types';

const API_BASE = '/api';

export async function checkBackendHealth(): Promise<ModelHealth> {
  try {
    const res = await fetch(`${API_BASE}/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) {
      return {
        status: 'degraded',
        ollama_connected: false,
        configured_model: 'unknown',
        model_available: false,
        available_models: [],
        error: `Backend responded with HTTP ${res.status}`,
      };
    }
    const data = await res.json();
    return data;
  } catch (err: any) {
    return {
      status: 'offline',
      ollama_connected: false,
      configured_model: 'unknown',
      model_available: false,
      available_models: [],
      error: 'Backend is offline or unreachable on http://127.0.0.1:8000',
    };
  }
}

export async function sendChatMessage(
  message: string,
  botId: string = 'mimo',
  customPrompt?: string,
  history: ChatMessage[] = []
): Promise<{ reply: string; botId: string; model: string }> {
  const boundedHistory = history.slice(-8).map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      bot_id: botId,
      custom_prompt: customPrompt || null,
      conversation_history: boundedHistory,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Chat request failed with status ${res.status}`);
  }

  return await res.json();
}

export async function breakdownGoalWithAI(goal: string): Promise<TaskBreakdownStep[]> {
  const res = await fetch(`${API_BASE}/tasks/breakdown`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ goal }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Task breakdown failed with status ${res.status}`);
  }

  const data = await res.json();
  return data.steps || [];
}
