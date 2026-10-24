import { Bot, Task, DailyTipItem, UserSettings } from '../types';

export const BUILTIN_BOTS: Bot[] = [
  {
    id: 'mimo',
    name: 'MIMO Prime',
    description: 'Your cosmic all-around local AI companion for everyday conversation and ideas.',
    role: 'Cosmic Companion',
    personality: 'Warm, playful, curious, concise',
    systemPrompt: 'You are MIMO, a warm and playful local AI companion who lives in a cosmic digital universe. Help with everyday planning, studying, brainstorming and practical questions. Be concise, friendly and useful. Ask a clarifying question when necessary. Avoid repetitive greetings and excessive emojis. Never expose internal reasoning. Never claim to have performed an action unless the application actually performed it.',
    avatar: 'astronaut-prime',
    category: 'custom',
    isBuiltin: true,
    score: '9.8/10',
    videoUrl: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_045634_e1c98c76-1265-4f5c-882a-4276f2080894.mp4',
  },
  {
    id: 'study-buddy',
    name: 'Study Buddy',
    description: 'Master complex subjects, break down topics into bite-sized units, and build revision schedules.',
    role: 'Revision & Learning Guide',
    personality: 'Encouraging, patient, structured',
    systemPrompt: 'You are Study Buddy, an encouraging, patient, and structured study companion. You explain complex concepts in clear, simple language, break topics into small digestible sections, create step-by-step revision plans, generate practice questions, and suggest evidence-based study techniques. Keep answers structured.',
    avatar: 'astronaut-violet',
    category: 'study',
    isBuiltin: true,
    score: '8.7/10',
    videoUrl: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_053923_22c0a6a5-313c-474c-85ff-3b50d25e944a.mp4',
  },
  {
    id: 'daily-planner',
    name: 'Daily Planner',
    description: 'Structure your day, prioritize critical tasks, and establish sustainable productive momentum.',
    role: 'Daily Schedule & Workflow Architect',
    personality: 'Practical, calm, supportive',
    systemPrompt: 'You are Daily Planner, a practical, calm, and supportive daily assistant. You help prioritize tasks, break goals into manageable steps, suggest realistic schedules, identify clear next actions, and help the user avoid burnout and overloading their day. Be concise and realistic.',
    avatar: 'astronaut-gold',
    category: 'productivity',
    isBuiltin: true,
    score: '9.0/10',
    videoUrl: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_054411_511c1b7a-fb2f-42ef-bf6c-32c0b1a06e79.mp4',
  },
  {
    id: 'coding-pal',
    name: 'Coding Pal',
    description: 'Debug code snippets, interpret cryptic compiler errors, and brainstorm architectural approaches.',
    role: 'Full-Stack Dev Companion',
    personality: 'Clear, analytical, patient',
    systemPrompt: 'You are Coding Pal, a clear, analytical, and patient programming companion. You explain technical concepts simply, help debug code snippets, interpret error messages, suggest clean implementation approaches, and provide concise, well-formatted code examples.',
    avatar: 'astronaut-cyan',
    category: 'coding',
    isBuiltin: true,
    score: '8.2/10',
    videoUrl: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_055427_ac7035b5-9f3b-4289-86fc-941b2432317d.mp4',
  },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-welcome',
    title: 'Explore MIMO\'s Cosmic Universe & Meet the mascot',
    description: 'Interact with MIMO, pet the astronaut creature, and test the mood reactions.',
    priority: 'high',
    completed: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-breakdown',
    title: 'Test AI Task Breakdown with local Qwen',
    description: 'Click "Break it down" on the task hub and let local AI suggest actionable sub-steps.',
    priority: 'high',
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-custom-bot',
    title: 'Design your first custom mini-AI bot',
    description: 'Use the Bot Creator to configure custom personality and instructions.',
    priority: 'medium',
    completed: false,
    createdAt: new Date().toISOString(),
  },
];

export const DAILY_TIPS: DailyTipItem[] = [
  {
    id: 'tip-1',
    category: 'Study',
    title: 'The Feynman Technique',
    tip: 'Explain complex concepts in simple terms as if teaching a child. This immediately highlights hidden knowledge gaps.',
  },
  {
    id: 'tip-2',
    category: 'Productivity',
    title: 'The 2-Minute Rule',
    tip: 'If an actionable step takes less than two minutes, execute it immediately instead of storing it on your task queue.',
  },
  {
    id: 'tip-3',
    category: 'Coding',
    title: 'Reproduce Before Fixing',
    tip: 'Always write a minimal test that fails on the bug before making code changes. This guarantees the bug will never silently return.',
  },
  {
    id: 'tip-4',
    category: 'Personal',
    title: 'Protected Morning Focus',
    tip: 'Dedicate your first 45 minutes of work to your highest-value creative goal before opening communication feeds.',
  },
  {
    id: 'tip-5',
    category: 'Motivation',
    title: 'Action Precedes Motivation',
    tip: 'You do not need to feel inspired to start. Take one tiny tangible step, and dopamine will fuel your subsequent focus.',
  },
  {
    id: 'tip-6',
    category: 'Productivity',
    title: 'Time-Boxing Batches',
    tip: 'Group similar micro-tasks into a single 25-minute block. Context switching consumes up to 40% of productive mental bandwidth.',
  },
];

export const DEFAULT_USER_SETTINGS: UserSettings = {
  displayName: 'Cosmic Explorer',
  personality: 'Warm & Playful',
  mascotColor: 'lime',
  showTips: true,
};
