import React, { useState } from 'react';
import { Check, Trash2, Edit2, Calendar } from 'lucide-react';
import type { Task, TaskPriority } from '../types';

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onDelete,
  onEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editPriority, setEditPriority] = useState<TaskPriority>(task.priority);

  const priorityStyles: Record<TaskPriority, { badge: string; text: string }> = {
    high: { badge: 'bg-coral/15 text-coral border-coral/30', text: 'High' },
    medium: { badge: 'bg-soft-pink/15 text-soft-pink border-soft-pink/30', text: 'Medium' },
    low: { badge: 'bg-nebula-aqua/15 text-nebula-aqua border-nebula-aqua/30', text: 'Low' },
  };

  const handleSaveEdit = () => {
    if (editTitle.trim()) {
      onEdit({
        ...task,
        title: editTitle.trim(),
        priority: editPriority,
      });
      setIsEditing(false);
    }
  };

  return (
    <div
      className={`rounded-xl p-3.5 border transition-all flex items-start justify-between gap-3 group ${
        task.completed
          ? 'bg-space-ink/40 border-space-ink-border opacity-60'
          : 'bg-space-ink-card border-space-ink-border hover:border-nebula-aqua/30'
      }`}
    >
      <div className="flex items-start gap-3 flex-1 min-w-0">
        {/* Compact Checkbox */}
        <button
          onClick={() => onToggle(task.id)}
          className={`w-5 h-5 rounded-md flex items-center justify-center transition-all flex-shrink-0 mt-0.5 ${
            task.completed
              ? 'bg-signal-lime text-space-ink shadow-sm'
              : 'border border-space-ink-border hover:border-nebula-aqua text-transparent'
          }`}
          title={task.completed ? "Mark as active" : "Mark as completed"}
        >
          <Check className="w-3.5 h-3.5 stroke-[3]" />
        </button>

        {/* Task Details */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full bg-space-ink rounded-lg px-2.5 py-1 text-xs text-starlight border border-nebula-aqua/40 focus:outline-none"
                autoFocus
              />
              <div className="flex items-center gap-2">
                <select
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value as TaskPriority)}
                  aria-label="Select priority level"
                  className="text-xs font-mono rounded px-2 py-1 bg-space-ink text-starlight border border-space-ink-border"
                >
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
                <button
                  onClick={handleSaveEdit}
                  className="px-2.5 py-1 rounded bg-signal-lime text-space-ink text-xs font-mono font-semibold"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-2 py-1 text-xs text-starlight-muted hover:text-starlight"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <p
                className={`text-xs sm:text-sm font-medium leading-snug transition-all ${
                  task.completed ? 'line-through text-starlight-muted' : 'text-starlight'
                }`}
              >
                {task.title}
              </p>
              {task.description && (
                <p className="text-xs text-starlight-muted mt-0.5 line-clamp-1 leading-relaxed">
                  {task.description}
                </p>
              )}
            </>
          )}

          {/* Meta Info */}
          <div className="flex items-center gap-2 mt-1.5">
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${
                priorityStyles[task.priority].badge
              }`}
            >
              {priorityStyles[task.priority].text}
            </span>

            {task.dueDate && (
              <span className="flex items-center gap-1 text-[11px] font-mono text-starlight-muted">
                <Calendar className="w-3 h-3 text-nebula-aqua/70" />
                <span>{task.dueDate}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="w-7 h-7 rounded-lg bg-space-ink border border-space-ink-border flex items-center justify-center text-starlight-muted hover:text-starlight hover:border-nebula-aqua/40 transition-colors"
            title="Edit task"
          >
            <Edit2 className="w-3 h-3" />
          </button>
        )}
        <button
          onClick={() => onDelete(task.id)}
          className="w-7 h-7 rounded-lg bg-space-ink border border-space-ink-border flex items-center justify-center text-starlight-muted hover:text-coral hover:border-coral/40 transition-colors"
          title="Delete task"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
