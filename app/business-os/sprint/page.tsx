'use client';

import { useBusinessOS, SprintTask } from '@/lib/store';
import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Plus, Calendar } from 'lucide-react';

// Pre-populated tasks for 12 weeks
const defaultTasks: Omit<SprintTask, 'id'>[] = [
  // WEEK 1
  { week: 1, task_name: 'Open Notion workspace', completed: false, is_custom: false },
  { week: 1, task_name: 'Purchase/renew domain', completed: false, is_custom: false },
  { week: 1, task_name: 'Set up ConvertKit email list', completed: false, is_custom: false },
  { week: 1, task_name: 'Create PAIDS Assessment', completed: false, is_custom: false },
  { week: 1, task_name: 'Set up Teachable account', completed: false, is_custom: false },
  { week: 1, task_name: 'Community setup (Telegram/Discord)', completed: false, is_custom: false },
  { week: 1, task_name: 'Financial systems setup', completed: false, is_custom: false },

  // WEEK 2
  { week: 2, task_name: 'Record 5 pillar videos (Creator Business)', completed: false, is_custom: false },
  { week: 2, task_name: 'Create lead magnet: PAIDS Audit', completed: false, is_custom: false },
  { week: 2, task_name: 'Design email welcome sequence (5 emails)', completed: false, is_custom: false },
  { week: 2, task_name: 'Set up payment processor', completed: false, is_custom: false },

  // WEEK 3
  { week: 3, task_name: 'Launch free micro-product: Niche Clarity Workbook', completed: false, is_custom: false },
  { week: 3, task_name: 'Create Instagram content calendar (30 days)', completed: false, is_custom: false },
  { week: 3, task_name: 'Batch 10 Reels for Week 4-5', completed: false, is_custom: false },
  { week: 3, task_name: 'Set up analytics tracking', completed: false, is_custom: false },

  // WEEK 4
  { week: 4, task_name: 'Bronze Product: Contentpreneur Starter System outline', completed: false, is_custom: false },
  { week: 4, task_name: 'Create sales page for Bronze', completed: false, is_custom: false },
  { week: 4, task_name: 'Film first 3 modules of Bronze course', completed: false, is_custom: false },
  { week: 4, task_name: 'Weekly review: PAIDS breakdown', completed: false, is_custom: false },

  // WEEK 5
  { week: 5, task_name: 'Launch Bronze Product (R997)', completed: false, is_custom: false },
  { week: 5, task_name: 'Create promotional campaign (email + social)', completed: false, is_custom: false },
  { week: 5, task_name: 'Host first Q&A for Bronze students', completed: false, is_custom: false },
  { week: 5, task_name: 'Set up student testimonial collection', completed: false, is_custom: false },

  // WEEK 6
  { week: 6, task_name: 'Silver Product: Fruitful Creator System outline', completed: false, is_custom: false },
  { week: 6, task_name: 'Create affiliate program structure', completed: false, is_custom: false },
  { week: 6, task_name: 'Batch 20 content pieces for repurposing', completed: false, is_custom: false },
  { week: 6, task_name: 'Weekly sprint review', completed: false, is_custom: false },

  // WEEK 7
  { week: 7, task_name: 'Film Silver Product modules (10 modules)', completed: false, is_custom: false },
  { week: 7, task_name: 'Create bonus resources for Silver', completed: false, is_custom: false },
  { week: 7, task_name: 'Design community engagement plan', completed: false, is_custom: false },

  // WEEK 8
  { week: 8, task_name: 'Launch Silver Product (R4,997)', completed: false, is_custom: false },
  { week: 8, task_name: 'Create payment plan options', completed: false, is_custom: false },
  { week: 8, task_name: 'Host webinar for Silver promotion', completed: false, is_custom: false },
  { week: 8, task_name: 'Monthly review: Revenue vs Target', completed: false, is_custom: false },

  // WEEK 9
  { week: 9, task_name: 'Gold Product: Empire Builder Mastermind planning', completed: false, is_custom: false },
  { week: 9, task_name: 'Create application process for Gold', completed: false, is_custom: false },
  { week: 9, task_name: 'Design mastermind curriculum', completed: false, is_custom: false },
  { week: 9, task_name: 'Set up group coaching infrastructure', completed: false, is_custom: false },

  // WEEK 10
  { week: 10, task_name: 'Launch The Table Membership (R497/month)', completed: false, is_custom: false },
  { week: 10, task_name: 'Create monthly membership content calendar', completed: false, is_custom: false },
  { week: 10, task_name: 'Host first Table community call', completed: false, is_custom: false },
  { week: 10, task_name: 'Implement recurring revenue tracking', completed: false, is_custom: false },

  // WEEK 11
  { week: 11, task_name: 'Launch Gold Product (R14,997)', completed: false, is_custom: false },
  { week: 11, task_name: 'Onboard first Gold students', completed: false, is_custom: false },
  { week: 11, task_name: 'Create case study content from students', completed: false, is_custom: false },
  { week: 11, task_name: 'Review all product performance metrics', completed: false, is_custom: false },

  // WEEK 12
  { week: 12, task_name: '90-day sprint retrospective', completed: false, is_custom: false },
  { week: 12, task_name: 'Calculate total revenue across PAIDS', completed: false, is_custom: false },
  { week: 12, task_name: 'Student success documentation', completed: false, is_custom: false },
  { week: 12, task_name: 'Plan next 90-day sprint', completed: false, is_custom: false },
  { week: 12, task_name: 'Tithe calculation and payment', completed: false, is_custom: false },
];

export default function SprintTracker() {
  const { tasks, addTask, toggleTask, setTasks } = useBusinessOS();
  const [expandedWeeks, setExpandedWeeks] = useState<number[]>([1, 2, 3]);
  const [showAddTask, setShowAddTask] = useState<number | null>(null);
  const [newTaskName, setNewTaskName] = useState('');

  // Initialize default tasks if empty
  useEffect(() => {
    if (tasks.length === 0) {
      // Add default tasks with IDs
      const tasksWithIds = defaultTasks.map((task, idx) => ({
        ...task,
        id: idx + 1,
      }));
      setTasks(tasksWithIds);
    }
  }, []);

  const toggleWeek = (week: number) => {
    setExpandedWeeks(prev =>
      prev.includes(week) ? prev.filter(w => w !== week) : [...prev, week]
    );
  };

  const handleAddTask = (week: number) => {
    if (newTaskName.trim()) {
      addTask({
        week,
        task_name: newTaskName,
        completed: false,
        is_custom: true,
        id: Date.now(),
      });
      setNewTaskName('');
      setShowAddTask(null);
    }
  };

  const getWeekStats = (week: number) => {
    const weekTasks = tasks.filter(t => t.week === week);
    const completed = weekTasks.filter(t => t.completed).length;
    return { total: weekTasks.length, completed };
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">90-Day Sprint Tracker</h1>
        <p className="text-gray-600">
          12 weeks to transform your contentpreneur business
        </p>
      </div>

      {/* Overall Progress */}
      <div className="bg-white rounded-lg p-6 shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-4">Overall Sprint Progress</h3>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all"
                style={{
                  width: `${tasks.length > 0
                    ? (tasks.filter(t => t.completed).length / tasks.length) * 100
                    : 0
                    }%`,
                }}
              />
            </div>
          </div>
          <span className="text-sm font-medium">
            {tasks.filter(t => t.completed).length} / {tasks.length} tasks
          </span>
        </div>
      </div>

      {/* Week Accordions */}
      <div className="space-y-4">
        {Array.from({ length: 12 }, (_, i) => i + 1).map(week => {
          const weekTasks = tasks.filter(t => t.week === week);
          const stats = getWeekStats(week);
          const isExpanded = expandedWeeks.includes(week);
          const progress = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

          return (
            <div key={week} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Week Header */}
              <button
                onClick={() => toggleWeek(week)}
                className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  {isExpanded ? (
                    <ChevronDown className="text-gray-500" />
                  ) : (
                    <ChevronRight className="text-gray-500" />
                  )}
                  <div className="text-left flex-1">
                    <h3 className="text-lg font-semibold">Week {week}</h3>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex-1 max-w-md bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">
                        {stats.completed} / {stats.total}
                      </span>
                    </div>
                  </div>
                </div>
              </button>

              {/* Week Tasks */}
              {isExpanded && (
                <div className="p-6 pt-0 border-t">
                  <ul className="space-y-3">
                    {weekTasks.map(task => (
                      <li
                        key={task.id}
                        className="flex items-start gap-3 p-3 rounded hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => task.id && toggleTask(task.id)}
                          className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <span
                            className={`${task.completed
                              ? 'line-through text-gray-400'
                              : 'text-gray-900'
                              }`}
                          >
                            {task.task_name}
                          </span>
                          {task.due_date && (
                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                              <Calendar size={12} />
                              {new Date(task.due_date).toLocaleDateString()}
                            </div>
                          )}
                          {task.notes && (
                            <p className="text-sm text-gray-500 mt-1">{task.notes}</p>
                          )}
                        </div>
                        {task.is_custom && (
                          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                            Custom
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>

                  {/* Add Task Button */}
                  {showAddTask === week ? (
                    <div className="mt-4 flex gap-2">
                      <input
                        type="text"
                        value={newTaskName}
                        onChange={(e) => setNewTaskName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddTask(week)}
                        placeholder="Enter task name..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        autoFocus
                      />
                      <button
                        onClick={() => handleAddTask(week)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => {
                          setShowAddTask(null);
                          setNewTaskName('');
                        }}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowAddTask(week)}
                      className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      <Plus size={16} />
                      Add Custom Task
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Signature */}
      <div className="text-center py-8">
        <p className="text-gray-600 italic">For children's children</p>
      </div>
    </div>
  );
}
