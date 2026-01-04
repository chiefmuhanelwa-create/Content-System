'use client';

import { useBusinessOS, Student } from '@/lib/store';
import { useState } from 'react';
import { Plus, Users, TrendingUp, Search } from 'lucide-react';

const STAGES: Student['stage'][] = ['Lead', 'Subscriber', 'Customer', 'Graduate', 'Affiliate', 'Champion'];

export default function StudentPipeline() {
  const { students, addStudent } = useBusinessOS();
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Funnel stats
  const funnelStats = STAGES.map(stage => ({
    stage,
    count: students.filter(s => s.stage === stage).length,
  }));

  // Calculate conversion rates
  const getConversionRate = (fromStage: string, toStage: string) => {
    const fromCount = students.filter(s => s.stage === fromStage).length;
    const toCount = students.filter(s => s.stage === toStage).length;
    return fromCount > 0 ? ((toCount / fromCount) * 100).toFixed(1) : '0.0';
  };

  // Calculate total LTV
  const totalLTV = students.reduce((sum, s) => sum + s.revenue_contributed, 0);
  const avgLTV = students.length > 0 ? totalLTV / students.length : 0;

  // Filtered students
  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold mb-2">Student Pipeline</h1>
          <p className="text-gray-600">Track your students from lead to champion</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Add Student
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-md">
          <p className="text-sm text-gray-600 mb-2">Total Students</p>
          <p className="text-3xl font-bold">{students.length}</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-md">
          <p className="text-sm text-gray-600 mb-2">Total Revenue</p>
          <p className="text-3xl font-bold text-green-600">R{totalLTV.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-md">
          <p className="text-sm text-gray-600 mb-2">Average LTV</p>
          <p className="text-3xl font-bold text-blue-600">R{avgLTV.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>
      </div>

      {/* Funnel Visualization */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-semibold mb-6">Student Funnel</h3>
        <div className="space-y-2">
          {funnelStats.map((stat, idx) => {
            const maxCount = Math.max(...funnelStats.map(s => s.count), 1);
            const widthPercent = (stat.count / maxCount) * 100;

            return (
              <div key={stat.stage}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{stat.stage}</span>
                  <span className="text-sm text-gray-600">{stat.count} students</span>
                </div>
                <div className="relative">
                  <div className="w-full bg-gray-200 rounded-full h-8">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-8 rounded-full flex items-center justify-end pr-3 text-white text-sm font-medium transition-all"
                      style={{ width: `${widthPercent}%`, minWidth: stat.count > 0 ? '60px' : '0' }}
                    >
                      {stat.count > 0 && `${stat.count}`}
                    </div>
                  </div>
                </div>
                {idx < funnelStats.length - 1 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Conversion to {funnelStats[idx + 1].stage}: {getConversionRate(stat.stage, funnelStats[idx + 1].stage)}%
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">All Students</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search students..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr className="text-left text-sm text-gray-600">
                <th className="pb-3">Name</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Stage</th>
                <th className="pb-3">Product</th>
                <th className="pb-3 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, idx) => (
                <tr key={idx} className="border-b last:border-0">
                  <td className="py-3">{student.name}</td>
                  <td className="py-3 text-sm text-gray-600">{student.email}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${student.stage === 'Champion'
                      ? 'bg-purple-100 text-purple-700'
                      : student.stage === 'Graduate'
                        ? 'bg-green-100 text-green-700'
                        : student.stage === 'Customer'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                      {student.stage}
                    </span>
                  </td>
                  <td className="py-3 text-sm">{student.product_purchased || '-'}</td>
                  <td className="py-3 text-right font-semibold">
                    R{student.revenue_contributed.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredStudents.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              {searchTerm ? 'No students found.' : 'No students yet. Click "Add Student" to get started.'}
            </p>
          )}
        </div>
      </div>

      {showAddModal && (
        <AddStudentModal
          onClose={() => setShowAddModal(false)}
          onAdd={(student) => {
            addStudent({ ...student, id: Date.now() });
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}

function AddStudentModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (student: Student) => void;
}) {
  const [formData, setFormData] = useState<Student>({
    name: '',
    email: '',
    stage: 'Lead',
    revenue_contributed: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <h3 className="text-2xl font-bold mb-6">Add Student</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Stage</label>
            <select
              value={formData.stage}
              onChange={(e) => setFormData({ ...formData, stage: e.target.value as Student['stage'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {STAGES.map(stage => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Product Purchased</label>
            <input
              type="text"
              value={formData.product_purchased || ''}
              onChange={(e) => setFormData({ ...formData, product_purchased: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Revenue Contributed (ZAR)</label>
            <input
              type="number"
              step="0.01"
              value={formData.revenue_contributed || ''}
              onChange={(e) => setFormData({ ...formData, revenue_contributed: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium"
            >
              Add Student
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
