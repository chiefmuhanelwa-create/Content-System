'use client';

import { useBusinessOS, FaithEntry } from '@/lib/store';
import { useState } from 'react';
import { Plus, Heart, DollarSign, BookOpen, TrendingUp, Users } from 'lucide-react';

export default function FaithIntegration() {
  const { faithEntries, addFaithEntry, revenueEntries } = useBusinessOS();
  const [activeTab, setActiveTab] = useState<'tithing' | 'prayer' | 'kingdom'>('tithing');
  const [showAddModal, setShowAddModal] = useState(false);

  // Calculate total revenue for tithing
  const totalRevenue = revenueEntries.reduce((sum, e) => sum + e.amount, 0);
  const titheAmount = totalRevenue * 0.1;
  const tithed = faithEntries
    .filter(e => e.entry_type === 'Giving')
    .reduce((sum, e) => sum + (e.amount || 0), 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Faith Integration</h1>
        <p className="text-purple-100">
          "Faith first, strategy second" - Law #6
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab('tithing')}
          className={`px-4 py-2 font-medium ${activeTab === 'tithing'
            ? 'border-b-2 border-purple-600 text-purple-600'
            : 'text-gray-600 hover:text-gray-900'
            }`}
        >
          Tithing Tracker
        </button>
        <button
          onClick={() => setActiveTab('prayer')}
          className={`px-4 py-2 font-medium ${activeTab === 'prayer'
            ? 'border-b-2 border-purple-600 text-purple-600'
            : 'text-gray-600 hover:text-gray-900'
            }`}
        >
          Prayer Journal
        </button>
        <button
          onClick={() => setActiveTab('kingdom')}
          className={`px-4 py-2 font-medium ${activeTab === 'kingdom'
            ? 'border-b-2 border-purple-600 text-purple-600'
            : 'text-gray-600 hover:text-gray-900'
            }`}
        >
          Kingdom KPIs
        </button>
      </div>

      {/* Tithing Tracker */}
      {activeTab === 'tithing' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-semibold mb-6">10% of Gross Revenue</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-purple-600">
                  R{totalRevenue.toLocaleString()}
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Tithe Amount (10%)</p>
                <p className="text-3xl font-bold text-blue-600">
                  R{titheAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Tithed So Far</p>
                <p className="text-3xl font-bold text-green-600">
                  R{tithed.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>{titheAmount > 0 ? ((tithed / titheAmount) * 100).toFixed(1) : 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all"
                  style={{ width: `${Math.min((tithed / titheAmount) * 100, 100)}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 font-medium"
            >
              Record Tithe Payment
            </button>
          </div>

          {/* Giving History */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-semibold mb-4">Giving History</h3>
            <div className="space-y-3">
              {faithEntries
                .filter(e => e.entry_type === 'Giving')
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((entry, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Tithe Payment</p>
                      <p className="text-sm text-gray-600">
                        {new Date(entry.date).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-xl font-bold text-purple-600">
                      R{entry.amount?.toLocaleString()}
                    </p>
                  </div>
                ))}
              {faithEntries.filter(e => e.entry_type === 'Giving').length === 0 && (
                <p className="text-center text-gray-500 py-8">No giving recorded yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Prayer Journal */}
      {activeTab === 'prayer' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Prayer Requests</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <Plus size={20} />
              Add Prayer
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['Praying', 'Answered', 'Redirected'].map(status => {
              const count = faithEntries.filter(
                e => e.entry_type === 'Prayer' && e.prayer_status === status
              ).length;

              return (
                <div key={status} className="bg-white rounded-lg p-4 shadow-md">
                  <p className="text-sm text-gray-600 mb-1">{status}</p>
                  <p className="text-3xl font-bold">{count}</p>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="space-y-4">
              {faithEntries
                .filter(e => e.entry_type === 'Prayer')
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((entry, idx) => (
                  <div key={idx} className="border-l-4 border-purple-500 pl-4 py-2">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-sm text-gray-500">
                        {new Date(entry.date).toLocaleDateString()}
                      </p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${entry.prayer_status === 'Answered'
                        ? 'bg-green-100 text-green-700'
                        : entry.prayer_status === 'Redirected'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-blue-100 text-blue-700'
                        }`}>
                        {entry.prayer_status}
                      </span>
                    </div>
                    <p className="text-gray-900 mb-2">{entry.content}</p>
                    {entry.scripture_reference && (
                      <p className="text-sm text-purple-600 italic">
                        {entry.scripture_reference}
                      </p>
                    )}
                  </div>
                ))}
              {faithEntries.filter(e => e.entry_type === 'Prayer').length === 0 && (
                <p className="text-center text-gray-500 py-8">No prayers recorded yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Kingdom KPIs */}
      {activeTab === 'kingdom' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Beyond-Money Metrics</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <Plus size={20} />
              Add KPI
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Heart className="text-purple-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Lives Transformed</p>
                  <p className="text-3xl font-bold">
                    {faithEntries
                      .filter(e => e.entry_type === 'Kingdom-KPI' && e.kpi_type === 'Lives Transformed')
                      .reduce((sum, e) => sum + (e.kpi_count || 0), 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <BookOpen className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Gospel Conversations</p>
                  <p className="text-3xl font-bold">
                    {faithEntries
                      .filter(e => e.entry_type === 'Kingdom-KPI' && e.kpi_type === 'Gospel Conversations')
                      .reduce((sum, e) => sum + (e.kpi_count || 0), 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Users className="text-green-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Students in Church</p>
                  <p className="text-3xl font-bold">
                    {faithEntries
                      .filter(e => e.entry_type === 'Kingdom-KPI' && e.kpi_type === 'Students in Church')
                      .reduce((sum, e) => sum + (e.kpi_count || 0), 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <TrendingUp className="text-yellow-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Prayer Testimonies</p>
                  <p className="text-3xl font-bold">
                    {faithEntries.filter(e => e.entry_type === 'Testimony').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6">
            <p className="text-lg font-semibold mb-2">Remember:</p>
            <p className="text-gray-700 italic">
              "Success without significance is the ultimate failure. Build for children's children."
            </p>
          </div>
        </div>
      )}

      {/* Add Faith Entry Modal */}
      {showAddModal && (
        <AddFaithModal
          type={activeTab}
          onClose={() => setShowAddModal(false)}
          onAdd={(entry) => {
            addFaithEntry({ ...entry, id: Date.now() });
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}

function AddFaithModal({
  type,
  onClose,
  onAdd,
}: {
  type: 'tithing' | 'prayer' | 'kingdom';
  onClose: () => void;
  onAdd: (entry: FaithEntry) => void;
}) {
  const [formData, setFormData] = useState<FaithEntry>({
    entry_type: type === 'tithing' ? 'Giving' : type === 'prayer' ? 'Prayer' : 'Kingdom-KPI',
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <h3 className="text-2xl font-bold mb-6">
          {type === 'tithing' ? 'Record Tithe' : type === 'prayer' ? 'Add Prayer' : 'Add Kingdom KPI'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {type === 'tithing' && (
            <div>
              <label className="block text-sm font-medium mb-2">Amount (ZAR)</label>
              <input
                type="number"
                step="0.01"
                value={formData.amount || ''}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                required
                min="0"
              />
            </div>
          )}

          {type === 'prayer' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Prayer Request</label>
                <textarea
                  value={formData.content || ''}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Scripture Reference</label>
                <input
                  type="text"
                  value={formData.scripture_reference || ''}
                  onChange={(e) => setFormData({ ...formData, scripture_reference: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., Philippians 4:6"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={formData.prayer_status || 'Praying'}
                  onChange={(e) => setFormData({ ...formData, prayer_status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Praying">Praying</option>
                  <option value="Answered">Answered</option>
                  <option value="Redirected">Redirected</option>
                </select>
              </div>
            </>
          )}

          {type === 'kingdom' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">KPI Type</label>
                <select
                  value={formData.kpi_type || ''}
                  onChange={(e) => setFormData({ ...formData, kpi_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Select type...</option>
                  <option value="Lives Transformed">Lives Transformed</option>
                  <option value="Gospel Conversations">Gospel Conversations</option>
                  <option value="Students in Church">Students in Church</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Count</label>
                <input
                  type="number"
                  value={formData.kpi_count || ''}
                  onChange={(e) => setFormData({ ...formData, kpi_count: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                  min="0"
                />
              </div>
            </>
          )}

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 font-medium"
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
