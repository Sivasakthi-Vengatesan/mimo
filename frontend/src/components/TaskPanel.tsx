import React, { useState } from 'react';
import { Plus, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Task, TaskPriority, MascotMood } from '../types';
import { TaskItem } from './TaskItem';
import { TaskBreakdownModal } from './TaskBreakdownModal';

interface TaskPanelProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onSetMascotMood: (mood: MascotMood) => void;
}

export const TaskPanel: React.FC<TaskPanelProps> = ({
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onEditTask,
  onSetMascotMood,
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<TaskPriority>('medium');
  const [newDueDate, setNewDueDate] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const handleToggle = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (task && !task.completed) {
      confetti({
        particleCount: 40,
        spread: 55,
        origin: { y: 0.75 },
        colors: ['#D8FF70', '#B1E5E6', '#F29191', '#F5F2ED'],
      });
      onSetMascotMood('excited');
    }
    onToggleTask(id);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask({
      title: newTitle.trim(),
      priority: newPriority,
      completed: false,
      dueDate: newDueDate || undefined,
    });

    setNewTitle('');
    setNewDueDate('');
    setIsAdding(false);
    onSetMascotMood('happy');
  };

  const handleAddBreakdownTasks = (steps: { title: string; description: string; priority: TaskPriority }[]) => {
    steps.forEach((step) => {
      onAddTask({
        title: step.title,
        description: step.description,
        priority: step.priority,
        completed: false,
      });
    });
    onSetMascotMood('excited');
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in">
      {/* Header & Actions */}
      <div className="cosmic-panel rounded-3xl p-6 sm:p-7 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-bold text-2xl text-starlight tracking-tight">
              Task Hub
            </h2>
            <p className="text-xs text-starlight-muted font-sans mt-0.5">
              Everyday action management with automated AI breakdown.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsBreakdownOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-space-ink hover:bg-space-ink-card border border-nebula-aqua/30 text-xs font-mono text-nebula-aqua transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-nebula-aqua" />
              <span>Break It Down</span>
            </button>

            <button
              onClick={() => setIsAdding(!isAdding)}
              className="px-4 py-2 rounded-xl bg-signal-lime text-space-ink font-display font-semibold text-xs hover:bg-[#e4ff8a] transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{isAdding ? 'Close' : 'New Task'}</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs font-mono text-starlight-muted">
            <span>Progress ({completedCount} of {totalCount} completed)</span>
            <span className="text-signal-lime font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-space-ink overflow-hidden border border-space-ink-border">
            <div
              className="h-full rounded-full bg-gradient-to-r from-nebula-aqua to-signal-lime transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Inline Add Task Form */}
      {isAdding && (
        <form
          onSubmit={handleCreateTask}
          className="cosmic-panel rounded-2xl p-4 border border-nebula-aqua/30 space-y-3 animate-in fade-in"
        >
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="What needs to be accomplished?"
              className="flex-1 bg-space-ink rounded-xl px-3.5 py-2 text-xs sm:text-sm text-starlight placeholder-starlight-muted border border-space-ink-border focus:outline-none focus:border-nebula-aqua"
              autoFocus
            />

            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
              aria-label="Select task priority"
              className="bg-space-ink text-xs font-mono rounded-xl px-3 py-2 text-starlight border border-space-ink-border cursor-pointer"
            >
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>

            <input
              type="text"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              placeholder="Due date (e.g. Today 5pm)"
              className="bg-space-ink rounded-xl px-3 py-2 text-xs text-starlight placeholder-starlight-muted border border-space-ink-border focus:outline-none focus:border-nebula-aqua font-mono"
            />

            <button
              type="submit"
              disabled={!newTitle.trim()}
              className="px-4 py-2 rounded-xl bg-signal-lime text-space-ink font-display font-semibold text-xs hover:bg-[#e4ff8a] transition-all disabled:opacity-40"
            >
              Add
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center justify-between pb-1 border-b border-space-ink-border">
        <div className="flex items-center gap-1.5">
          {(['all', 'active', 'completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs uppercase tracking-wider transition-colors ${
                filter === tab
                  ? 'bg-space-ink-raised text-nebula-aqua font-semibold border border-nebula-aqua/30'
                  : 'text-starlight-muted hover:text-starlight hover:bg-space-ink-raised/50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <span className="text-xs font-mono text-starlight-muted">
          {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
        </span>
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {filteredTasks.length === 0 ? (
          <div className="p-10 text-center cosmic-panel rounded-2xl space-y-2">
            <CheckCircle2 className="w-8 h-8 text-starlight-muted/40 mx-auto" />
            <p className="font-display font-medium text-sm text-starlight">
              {filter === 'completed'
                ? 'No completed tasks yet'
                : 'Your task queue is clear'}
            </p>
            <p className="text-xs text-starlight-muted max-w-sm mx-auto">
              Add a new task above or click <strong className="text-nebula-aqua">"Break It Down"</strong> to decompose a goal with Qwen.
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={handleToggle}
              onDelete={onDeleteTask}
              onEdit={onEditTask}
            />
          ))
        )}
      </div>

      {/* AI Task Breakdown Modal */}
      <TaskBreakdownModal
        isOpen={isBreakdownOpen}
        onClose={() => setIsBreakdownOpen(false)}
        onAddTasks={handleAddBreakdownTasks}
      />
    </div>
  );
};
