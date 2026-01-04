'use client';

import { useBusinessOS } from '@/lib/store';
import { DollarSign, Target, Users, Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function BusinessDashboard() {
  const { revenueEntries, tasks, students, contentItems, getTotalRevenue } = useBusinessOS();

  // Calculate current week number (1-52)
  const getWeekNumber = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now.getTime() - start.getTime();
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    return Math.ceil(diff / oneWeek);
  };

  const weekNumber = getWeekNumber();

  // Calculate monthly revenue
  const getMonthlyRevenue = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return revenueEntries
      .filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
      })
      .reduce((sum, entry) => sum + entry.amount, 0);
  };

  const monthlyRevenue = getMonthlyRevenue();
  const monthlyTarget = 170000; // R170,000 target

  // PAIDS breakdown percentages
  const totalRevenue = getTotalRevenue();
  const paidsBreakdown = [
    { stream: 'Products', amount: getTotalRevenue('Products'), color: 'bg-blue-500' },
    { stream: 'Ads', amount: getTotalRevenue('Ads'), color: 'bg-green-500' },
    { stream: 'Information', amount: getTotalRevenue('Information'), color: 'bg-purple-500' },
    { stream: 'Deals', amount: getTotalRevenue('Deals'), color: 'bg-orange-500' },
    { stream: 'Services', amount: getTotalRevenue('Services'), color: 'bg-pink-500' },
  ];

  // Upcoming tasks (next 3)
  const upcomingTasks = tasks
    .filter(t => !t.completed)
    .sort((a, b) => (a.due_date || '').localeCompare(b.due_date || ''))
    .slice(0, 3);

  // Email list size (subscribers)
  const emailListSize = students.filter(s => s.stage === 'Subscriber' || s.stage === 'Customer').length;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">NOCHILL Business OS</h1>
        <p className="text-blue-100">Week {weekNumber} of 52 • For children's children</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Monthly Revenue"
          value={`R${monthlyRevenue.toLocaleString()}`}
          subtitle={`Target: R${monthlyTarget.toLocaleString()}`}
          icon={<DollarSign className="text-green-500" size={32} />}
          progress={(monthlyRevenue / monthlyTarget) * 100}
        />
        <StatCard
          title="Total Students"
          value={students.length.toString()}
          subtitle={`${emailListSize} subscribers`}
          icon={<Users className="text-blue-500" size={32} />}
        />
        <StatCard
          title="Active Products"
          value={useBusinessOS.getState().products.filter(p => p.status === 'Launched' || p.status === 'Evergreen').length.toString()}
          subtitle="Launched & evergreen"
          icon={<Target className="text-purple-500" size={32} />}
        />
        <StatCard
          title="Content This Month"
          value={contentItems.filter(c => {
            const now = new Date();
            const contentDate = new Date(c.publish_date || '');
            return contentDate.getMonth() === now.getMonth();
          }).length.toString()}
          subtitle="Scheduled & published"
          icon={<Calendar className="text-orange-500" size={32} />}
        />
      </div>

      {/* Monthly Progress Bar */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Monthly Revenue Progress</h3>
          <span className="text-sm text-gray-600">
            {((monthlyRevenue / monthlyTarget) * 100).toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-green-500 to-green-600 h-4 transition-all duration-500"
            style={{ width: `${Math.min((monthlyRevenue / monthlyTarget) * 100, 100)}%` }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          R{(monthlyTarget - monthlyRevenue).toLocaleString()} to go
        </p>
      </div>

      {/* PAIDS Breakdown */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-semibold mb-4">PAIDS Revenue Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {paidsBreakdown.map((stream) => {
            const percentage = totalRevenue > 0 ? (stream.amount / totalRevenue) * 100 : 0;
            const isOverweighted = percentage > 50;

            return (
              <div key={stream.stream} className="text-center">
                <div className={`${stream.color} text-white rounded-lg p-4 mb-2`}>
                  <p className="text-xs font-medium">{stream.stream}</p>
                  <p className="text-2xl font-bold">R{stream.amount.toLocaleString()}</p>
                  <p className="text-xs">{percentage.toFixed(1)}%</p>
                </div>
                {isOverweighted && (
                  <div className="flex items-center justify-center gap-1 text-xs text-orange-600">
                    <AlertCircle size={12} />
                    <span>Diversify</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Tasks */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Upcoming Tasks</h3>
          <Link href="/business-os/sprint" className="text-blue-600 hover:underline text-sm">
            View All →
          </Link>
        </div>
        {upcomingTasks.length > 0 ? (
          <ul className="space-y-2">
            {upcomingTasks.map((task, idx) => (
              <li key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                <input type="checkbox" className="w-4 h-4" />
                <span className="flex-1">{task.task_name}</span>
                {task.due_date && (
                  <span className="text-xs text-gray-500">
                    {new Date(task.due_date).toLocaleDateString()}
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No upcoming tasks. Great job!</p>
        )}
      </div>

      {/* Signature */}
      <div className="text-center py-8">
        <p className="text-gray-600 italic text-lg">
          "You understand? Because you understand."
        </p>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  progress,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  progress?: number;
}) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div>{icon}</div>
      </div>
      {progress !== undefined && (
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}
