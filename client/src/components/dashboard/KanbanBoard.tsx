'use client';

import React, { useState } from 'react';
import { ITask, TaskStatus } from '@/lib/types';
import { StatusPill } from '@/components/ui/StatusPill';
import { CheckCircle2, Clock, AlertCircle, Plus, User, Calendar, ArrowRight } from 'lucide-react';

interface KanbanBoardProps {
  tasks: ITask[];
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  onAddTask: (task: Partial<ITask>) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onUpdateTaskStatus,
  onAddTask,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<any>('general');
  const [newPriority, setNewPriority] = useState<any>('medium');

  const columns: { id: TaskStatus; title: string; icon: React.ReactNode; color: string }[] = [
    {
      id: 'todo',
      title: 'To Do',
      icon: <Clock className="w-3.5 h-3.5 text-slate-500" />,
      color: 'border-slate-300 bg-slate-50/50',
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      icon: <Clock className="w-3.5 h-3.5 text-amber-500" />,
      color: 'border-amber-300 bg-amber-50/30',
    },
    {
      id: 'blocked',
      title: 'Blocked / At Risk',
      icon: <AlertCircle className="w-3.5 h-3.5 text-rose-500" />,
      color: 'border-rose-300 bg-rose-50/30',
    },
    {
      id: 'done',
      title: 'Completed',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />,
      color: 'border-emerald-300 bg-emerald-50/30',
    },
  ];

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddTask({
      title: newTitle.trim(),
      category: newCategory,
      priority: newPriority,
      status: 'todo',
      assignee: 'Self',
      dueDate: new Date().toISOString().split('T')[0],
    });
    setNewTitle('');
    setIsAdding(false);
  };

  const getNextStatus = (current: TaskStatus): TaskStatus => {
    switch (current) {
      case 'todo': return 'in_progress';
      case 'in_progress': return 'done';
      case 'blocked': return 'in_progress';
      case 'done': return 'todo';
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Operational Kanban & Execution Board
          </h3>
          <p className="text-xs text-slate-500">
            {tasks.length} total tasks categorized across departments. Click arrow on cards to advance state.
          </p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-[#E6C66E] hover:border-[#D4AF37] text-[#9E1B32] shadow-2xs hover:bg-[#FDFBF2] transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Task</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleCreateTask} className="p-3 bg-white border border-[#D4AF37] rounded-xl shadow-xs flex flex-wrap gap-2.5 items-center">
          <input
            type="text"
            placeholder="Task title (e.g. 'Confirm floral canopy setup')..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="flex-1 min-w-[200px] text-xs px-3 py-2 border rounded-lg border-slate-200 focus:outline-hidden focus:border-[#9E1B32]"
            autoFocus
          />
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="text-xs px-2.5 py-2 border rounded-lg border-slate-200 text-slate-700"
          >
            <option value="decor">Décor</option>
            <option value="catering">Catering</option>
            <option value="logistics">Logistics</option>
            <option value="photography">Photography</option>
            <option value="entertainment">Entertainment</option>
            <option value="hospitality">Hospitality</option>
            <option value="general">General</option>
          </select>
          <select
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value)}
            className="text-xs px-2.5 py-2 border rounded-lg border-slate-200 text-slate-700"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
          <button
            type="submit"
            className="text-xs px-3 py-2 bg-[#9E1B32] text-white font-semibold rounded-lg hover:opacity-90"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setIsAdding(false)}
            className="text-xs px-3 py-2 text-slate-500 hover:text-slate-700"
          >
            Cancel
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);
          return (
            <div
              key={col.id}
              className={`rounded-xl border p-3 flex flex-col gap-2.5 ${col.color}`}
            >
              <div className="flex items-center justify-between pb-1 border-b border-slate-200/70">
                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-700 uppercase tracking-wide">
                  {col.icon}
                  <span>{col.title}</span>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white text-slate-600 border border-slate-200">
                  {colTasks.length}
                </span>
              </div>

              <div className="space-y-2 min-h-[140px]">
                {colTasks.length === 0 ? (
                  <div className="text-center py-6 text-xs text-slate-400 italic">
                    No tasks in {col.title}
                  </div>
                ) : (
                  colTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-white rounded-lg p-3 border border-[#E6C66E]/40 hover:border-[#D4AF37] shadow-2xs hover:shadow-xs transition-all duration-150 flex flex-col justify-between gap-2"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-md bg-[#FAF8F5] text-slate-600 border border-slate-200">
                            {task.category}
                          </span>
                          <span
                            className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-md ${
                              task.priority === 'urgent'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : task.priority === 'high'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-slate-50 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>
                        <h5 className="text-xs font-semibold text-slate-800 leading-snug">
                          {task.title}
                        </h5>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-400" />
                          <span className="truncate max-w-[85px]">{task.assignee}</span>
                        </div>

                        <button
                          onClick={() => onUpdateTaskStatus(task.id, getNextStatus(task.status))}
                          title={`Advance to ${getNextStatus(task.status).replace('_', ' ')}`}
                          className="flex items-center gap-1 text-[10px] font-bold text-[#9E1B32] hover:text-[#801426] bg-[#FDF2F4] hover:bg-[#FBE4E8] px-2 py-0.5 rounded-md transition-colors"
                        >
                          <span>Move</span>
                          <ArrowRight className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
