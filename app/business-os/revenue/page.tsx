'use client';

import { useBusinessOS, RevenueEntry } from '@/lib/store';
import { useState } from 'react';
import { DollarSign, TrendingUp, Plus, Upload, AlertCircle, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const STREAM_COLORS = {
  Products: '#3B82F6',
  Ads: '#10B981',
  Information: '#8B5CF6',
  Deals: '#F59E0B',
  Services: '#EC4899',
};

export default function RevenueDashboard() {
  const { revenueEntries, addRevenue, getTotalRevenue } = useBusinessOS();
  const [showAddModal, setShowAddModal] = useState(false);
  const [dateRange, setDateRange] = useState<'month' | 'quarter' | 'year'>('month');

  // Get filtered entries based on date range
  const getFilteredEntries = () => {
    const now = new Date();
    const startDate = new Date();

    if (dateRange === 'month') {
      startDate.setMonth(now.getMonth(), 1);
    } else if (dateRange === 'quarter') {
      const quarter = Math.floor(now.getMonth() / 3);
      startDate.setMonth(quarter * 3, 1);
    } else {
      startDate.setMonth(0, 1);
    }

    return revenueEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= startDate && entryDate <= now;
    });
  };

  const filteredEntries = getFilteredEntries();
  const totalRevenue = filteredEntries.reduce((sum, e) => sum + e.amount, 0);

  // PAIDS breakdown
  const paidsBreakdown = [
    {
      stream: 'Products',
      amount: filteredEntries.filter(e => e.stream === 'Products').reduce((sum, e) => sum + e.amount, 0),
      color: STREAM_COLORS.Products,
    },
    {
      stream: 'Ads',
      amount: filteredEntries.filter(e => e.stream === 'Ads').reduce((sum, e) => sum + e.amount, 0),
      color: STREAM_COLORS.Ads,
    },
    {
      stream: 'Information',
      amount: filteredEntries.filter(e => e.stream === 'Information').reduce((sum, e) => sum + e.amount, 0),
      color: STREAM_COLORS.Information,
    },
    {
      stream: 'Deals',
      amount: filteredEntries.filter(e => e.stream === 'Deals').reduce((sum, e) => sum + e.amount, 0),
      color: STREAM_COLORS.Deals,
    },
    {
      stream: 'Services',
      amount: filteredEntries.filter(e => e.stream === 'Services').reduce((sum, e) => sum + e.amount, 0),
      color: STREAM_COLORS.Services,
    },
  ];

  // Calculate monthly trend (last 6 months)
  const getMonthlyTrend = () => {
    const months = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = month.toLocaleString('default', { month: 'short' });

      const monthData: any = { month: monthName };

      ['Products', 'Ads', 'Information', 'Deals', 'Services'].forEach(stream => {
        monthData[stream] = revenueEntries
          .filter(e => {
            const entryDate = new Date(e.date);
            return (
              e.stream === stream &&
              entryDate.getMonth() === month.getMonth() &&
              entryDate.getFullYear() === month.getFullYear()
            );
          })
          .reduce((sum, e) => sum + e.amount, 0);
      });

      months.push(monthData);
    }

    return months;
  };

  const monthlyTrend = getMonthlyTrend();

  // Tithing calculator
  const titheAmount = totalRevenue * 0.1;

  // Target
  const monthlyTarget = 170000;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold mb-2">Revenue Dashboard</h1>
          <p className="text-gray-600">PAIDS Framework Revenue Tracking</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Add Revenue
        </button>
      </div>

      {/* Date Range Selector */}
      <div className="flex gap-2">
        {['month', 'quarter', 'year'].map((range) => (
          <button
            key={range}
            onClick={() => setDateRange(range as any)}
            className={`px-4 py-2 rounded-lg font-medium ${dateRange === range
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            This {range.charAt(0).toUpperCase() + range.slice(1)}
          </button>
        ))}
      </div>

      {/* Total Revenue Card */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 mb-2">Total Revenue</p>
            <p className="text-5xl font-bold">R{totalRevenue.toLocaleString()}</p>
            {dateRange === 'month' && (
              <p className="text-green-100 mt-4">
                Target: R{monthlyTarget.toLocaleString()} ({((totalRevenue / monthlyTarget) * 100).toFixed(1)}%)
              </p>
            )}
          </div>
          <DollarSign size={64} className="text-green-200 opacity-50" />
        </div>
        {dateRange === 'month' && (
          <div className="mt-4 bg-white bg-opacity-20 rounded-full h-3">
            <div
              className="bg-white h-3 rounded-full transition-all"
              style={{ width: `${Math.min((totalRevenue / monthlyTarget) * 100, 100)}%` }}
            />
          </div>
        )}
      </div>

      {/* PAIDS Breakdown */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-semibold mb-6">PAIDS Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {paidsBreakdown.map((stream) => {
            const percentage = totalRevenue > 0 ? (stream.amount / totalRevenue) * 100 : 0;
            const isOverweighted = percentage > 50;

            return (
              <div key={stream.stream} className="relative">
                <div
                  className="rounded-lg p-6 text-white"
                  style={{ backgroundColor: stream.color }}
                >
                  <p className="text-sm font-medium mb-2">{stream.stream}</p>
                  <p className="text-3xl font-bold mb-1">
                    R{stream.amount.toLocaleString()}
                  </p>
                  <p className="text-sm opacity-90">{percentage.toFixed(1)}% of total</p>
                </div>
                {isOverweighted && (
                  <div className="mt-2 flex items-center gap-1 text-sm text-orange-600">
                    <AlertCircle size={16} />
                    <span>Too concentrated - diversify!</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly Trend Chart */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-semibold mb-6">6-Month Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Products" stackId="a" fill={STREAM_COLORS.Products} />
            <Bar dataKey="Ads" stackId="a" fill={STREAM_COLORS.Ads} />
            <Bar dataKey="Information" stackId="a" fill={STREAM_COLORS.Information} />
            <Bar dataKey="Deals" stackId="a" fill={STREAM_COLORS.Deals} />
            <Bar dataKey="Services" stackId="a" fill={STREAM_COLORS.Services} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tithing Calculator */}
      <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <span>💜</span>
          Tithing Calculator
        </h3>
        <p className="text-gray-600 mb-4">10% of gross revenue for Kingdom work</p>
        <div className="bg-white rounded-lg p-4 inline-block">
          <p className="text-sm text-gray-600 mb-1">Amount to tithe:</p>
          <p className="text-4xl font-bold text-purple-600">
            R{titheAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </div>
        <p className="text-sm text-gray-500 mt-4 italic">
          "Faith first, strategy second" - The 6th Law
        </p>
      </div>

      {/* Recent Entries */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-semibold mb-4">Recent Revenue Entries</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr className="text-left text-sm text-gray-600">
                <th className="pb-3">Date</th>
                <th className="pb-3">Stream</th>
                <th className="pb-3">Description</th>
                <th className="pb-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 10)
                .map((entry, idx) => (
                  <tr key={idx} className="border-b last:border-0">
                    <td className="py-3 text-sm">
                      {new Date(entry.date).toLocaleDateString()}
                    </td>
                    <td className="py-3">
                      <span
                        className="inline-block px-2 py-1 text-xs font-medium text-white rounded"
                        style={{ backgroundColor: STREAM_COLORS[entry.stream] }}
                      >
                        {entry.stream}
                      </span>
                    </td>
                    <td className="py-3 text-sm">{entry.description}</td>
                    <td className="py-3 text-right font-semibold">
                      R{entry.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {filteredEntries.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              No revenue entries yet. Click "Add Revenue" to get started.
            </p>
          )}
        </div>
      </div>

      {/* Add Revenue Modal */}
      {showAddModal && (
        <AddRevenueModal
          onClose={() => setShowAddModal(false)}
          onAdd={(entry) => {
            addRevenue(entry);
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}

function AddRevenueModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (entry: RevenueEntry) => void;
}) {
  const [formData, setFormData] = useState<RevenueEntry>({
    date: new Date().toISOString().split('T')[0],
    stream: 'Products',
    amount: 0,
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <h3 className="text-2xl font-bold mb-6">Add Revenue Entry</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Revenue Stream</label>
            <select
              value={formData.stream}
              onChange={(e) => setFormData({ ...formData, stream: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="Products">Products</option>
              <option value="Ads">Ads/Affiliates</option>
              <option value="Information">Information</option>
              <option value="Deals">Deals</option>
              <option value="Services">Services</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Amount (ZAR)</label>
            <input
              type="number"
              step="0.01"
              value={formData.amount || ''}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Bronze course sale to John Doe"
              required
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium"
            >
              Add Entry
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
