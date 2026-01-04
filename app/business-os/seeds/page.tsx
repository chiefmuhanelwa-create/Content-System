'use client';

import { useBusinessOS, Student } from '@/lib/store';
import { useState } from 'react';
import { Plus, TrendingUp, Users, Search, Sparkles, Heart, BookOpen, Target, Trophy, AlertCircle } from 'lucide-react';

const SEEDS_STAGES: Student['stage'][] = ['Signal', 'Engagement', 'Education', 'Decision', 'Success'];

const SEEDS_DESCRIPTIONS = {
  Signal: {
    icon: Sparkles,
    color: 'bg-purple-500',
    lightColor: 'bg-purple-50',
    borderColor: 'border-purple-300',
    textColor: 'text-purple-700',
    kingdomPrinciple: 'Serve First - Capture Attention Through Value',
    contentGoal: 'Hook that makes them STOP scrolling',
    businessGoal: 'Turn viewer into follower',
    replaces: 'Lead Generation (LAPS)',
    tactics: ['Authentic hooks', 'Truth-based curiosity', 'Value preview', 'Pattern interrupt'],
  },
  Engagement: {
    icon: Heart,
    color: 'bg-pink-500',
    lightColor: 'bg-pink-50',
    borderColor: 'border-pink-300',
    textColor: 'text-pink-700',
    kingdomPrinciple: 'Ubuntu - I Am Because We Are',
    contentGoal: 'Story that creates connection',
    businessGoal: 'Turn follower into engaged community member',
    replaces: 'Appointment (LAPS)',
    tactics: ['Transformation stories', 'Vulnerability', 'Relatable struggles', 'Authenticity'],
  },
  Education: {
    icon: BookOpen,
    color: 'bg-blue-500',
    lightColor: 'bg-blue-50',
    borderColor: 'border-blue-300',
    textColor: 'text-blue-700',
    kingdomPrinciple: 'Stewardship - Give Your Best Knowledge Freely',
    contentGoal: 'Framework that transforms thinking',
    businessGoal: 'Turn engaged follower into qualified lead',
    replaces: 'Presentation (LAPS)',
    tactics: ['Teach best frameworks', 'Give away the gold', 'Build authority', 'Trust abundance'],
  },
  Decision: {
    icon: Target,
    color: 'bg-orange-500',
    lightColor: 'bg-orange-50',
    borderColor: 'border-orange-300',
    textColor: 'text-orange-700',
    kingdomPrinciple: 'Free Will - Invite, Don\'t Manipulate',
    contentGoal: 'CTA that feels natural and compelling',
    businessGoal: 'Turn lead into paying customer',
    replaces: 'Sales Close (LAPS)',
    tactics: ['Clear invitation', 'Honest urgency', 'Risk reversal', 'Respect choice'],
  },
  Success: {
    icon: Trophy,
    color: 'bg-green-500',
    lightColor: 'bg-green-50',
    borderColor: 'border-green-300',
    textColor: 'text-green-700',
    kingdomPrinciple: 'Legacy Loop - Success Breeds Success',
    contentGoal: 'Testimonial that inspires others',
    businessGoal: 'Turn customer into graduate advocate',
    replaces: 'Post-Sale Abandonment (LAPS)',
    tactics: ['Serve until success', 'Celebrate wins publicly', 'Create advocates', 'Build legacy'],
  },
};

export default function SEEDSFunnel() {
  const { students, addStudent } = useBusinessOS();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStage, setSelectedStage] = useState<Student['stage'] | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showComparison, setShowComparison] = useState(false);

  // Calculate funnel stats
  const funnelStats = SEEDS_STAGES.map(stage => ({
    stage,
    count: students.filter(s => s.stage === stage).length,
    ...SEEDS_DESCRIPTIONS[stage],
  }));

  // Calculate conversion rates
  const getConversionRate = (fromStage: Student['stage'], toStage: Student['stage']) => {
    const fromIndex = SEEDS_STAGES.indexOf(fromStage);
    const toIndex = SEEDS_STAGES.indexOf(toStage);

    if (toIndex !== fromIndex + 1) return null; // Only calculate for adjacent stages

    const fromCount = students.filter(s => s.stage === fromStage).length;
    const toCount = students.filter(s => s.stage === toStage).length;
    const totalPast = students.filter(s => {
      const stageIndex = SEEDS_STAGES.indexOf(s.stage);
      return stageIndex >= toIndex;
    }).length;

    return fromCount > 0 ? ((totalPast / (fromCount + totalPast)) * 100).toFixed(1) : '0.0';
  };

  // Filtered students
  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.seeds_source && s.seeds_source.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const displayStudents = selectedStage
    ? filteredStudents.filter(s => s.stage === selectedStage)
    : filteredStudents;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 rounded-lg p-8 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-2">🌱 SEEDS Funnel Tracker</h1>
            <p className="text-purple-100 mb-4">
              Kingdom-Based Customer Conversion System
            </p>
            <p className="text-sm text-white/80 italic">
              "We don't just close sales. We plant SEEDS that grow into trees that bear fruit for generations."
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium backdrop-blur-sm"
            >
              {showComparison ? 'Hide' : 'Show'} LAPS vs SEEDS
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 font-medium"
            >
              <Plus size={20} />
              Add Contact
            </button>
          </div>
        </div>
      </div>

      {/* LAPS vs SEEDS Comparison */}
      {showComparison && (
        <div className="bg-white rounded-lg p-6 shadow-lg border-2 border-purple-200">
          <h3 className="text-2xl font-bold mb-6 text-center">
            LAPS (Worldly) vs SEEDS (Kingdom)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LAPS - The Old Way */}
            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="text-red-600" size={24} />
                <h4 className="text-xl font-bold text-red-600">LAPS (What We REJECT)</h4>
              </div>

              <div className="space-y-4">
                <div className="border-l-4 border-red-500 pl-4">
                  <p className="font-semibold text-red-700">L - Lead Generation</p>
                  <p className="text-sm text-red-600">❌ Clickbait, manipulation, fear-mongering</p>
                </div>

                <div className="border-l-4 border-red-500 pl-4">
                  <p className="font-semibold text-red-700">A - Appointment</p>
                  <p className="text-sm text-red-600">❌ Pressure tactics, fake scarcity</p>
                </div>

                <div className="border-l-4 border-red-500 pl-4">
                  <p className="font-semibold text-red-700">P - Presentation</p>
                  <p className="text-sm text-red-600">❌ Hold back best info, gatekeep knowledge</p>
                </div>

                <div className="border-l-4 border-red-500 pl-4">
                  <p className="font-semibold text-red-700">S - Sales</p>
                  <p className="text-sm text-red-600">❌ Hard close, guilt, manipulation</p>
                </div>
              </div>

              <div className="mt-6 bg-red-100 rounded-lg p-4">
                <p className="font-semibold text-red-700 mb-2">Result:</p>
                <p className="text-sm text-red-600">Transactional. Extractive. No legacy. Worldly.</p>
              </div>
            </div>

            {/* SEEDS - The Kingdom Way */}
            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="text-green-600" size={24} />
                <h4 className="text-xl font-bold text-green-600">SEEDS (What We BUILD)</h4>
              </div>

              <div className="space-y-4">
                <div className="border-l-4 border-purple-500 pl-4">
                  <p className="font-semibold text-purple-700">S - Signal</p>
                  <p className="text-sm text-purple-600">✅ Serve first, authentic value</p>
                </div>

                <div className="border-l-4 border-pink-500 pl-4">
                  <p className="font-semibold text-pink-700">E - Engagement</p>
                  <p className="text-sm text-pink-600">✅ Ubuntu, genuine connection</p>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="font-semibold text-blue-700">E - Education</p>
                  <p className="text-sm text-blue-600">✅ Give best knowledge freely</p>
                </div>

                <div className="border-l-4 border-orange-500 pl-4">
                  <p className="font-semibold text-orange-700">D - Decision</p>
                  <p className="text-sm text-orange-600">✅ Invite, don't manipulate</p>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-semibold text-green-700">S - Success</p>
                  <p className="text-sm text-green-600">✅ Serve until success, create legacy</p>
                </div>
              </div>

              <div className="mt-6 bg-green-100 rounded-lg p-4">
                <p className="font-semibold text-green-700 mb-2">Result:</p>
                <p className="text-sm text-green-600">Transformational. Generational. Kingdom. Legacy.</p>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-gradient-to-r from-purple-100 to-green-100 rounded-lg p-6">
            <p className="text-center font-semibold text-lg mb-2">
              LAPS is Transactional. SEEDS is Transformational.
            </p>
            <p className="text-center text-sm text-gray-700">
              They Extract. You Transform. They Close. You Cultivate. They Manipulate. You Invite.
            </p>
          </div>
        </div>
      )}

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-md">
          <p className="text-sm text-gray-600 mb-2">Total Contacts</p>
          <p className="text-3xl font-bold">{students.length}</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-md">
          <p className="text-sm text-gray-600 mb-2">In Success Stage</p>
          <p className="text-3xl font-bold text-green-600">
            {students.filter(s => s.stage === 'Success').length}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {students.length > 0
              ? ((students.filter(s => s.stage === 'Success').length / students.length) * 100).toFixed(1)
              : 0}% conversion rate
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-md">
          <p className="text-sm text-gray-600 mb-2">Total Revenue</p>
          <p className="text-3xl font-bold text-purple-600">
            R{students.reduce((sum, s) => sum + s.revenue_contributed, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* SEEDS Funnel Visualization */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-semibold mb-6">SEEDS Funnel Flow</h3>
        <div className="space-y-2">
          {funnelStats.map((stat, idx) => {
            const Icon = stat.icon;
            const maxCount = Math.max(...funnelStats.map(s => s.count), 1);
            const widthPercent = (stat.count / maxCount) * 100;
            const nextStage = idx < funnelStats.length - 1 ? funnelStats[idx + 1] : null;
            const conversionRate = nextStage
              ? getConversionRate(stat.stage, nextStage.stage)
              : null;

            return (
              <div key={stat.stage}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Icon className={stat.textColor} size={20} />
                    <span className="font-medium">{stat.stage}</span>
                  </div>
                  <button
                    onClick={() => setSelectedStage(selectedStage === stat.stage ? null : stat.stage)}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    {stat.count} contacts
                  </button>
                </div>

                <div className="relative">
                  <div className={`w-full ${stat.lightColor} rounded-full h-10 border-2 ${stat.borderColor}`}>
                    <div
                      className={`${stat.color} h-full rounded-full flex items-center justify-end pr-3 text-white text-sm font-medium transition-all`}
                      style={{ width: `${widthPercent}%`, minWidth: stat.count > 0 ? '60px' : '0' }}
                    >
                      {stat.count > 0 && `${stat.count}`}
                    </div>
                  </div>
                </div>

                <div className="mt-1 text-xs text-gray-600">
                  <span className="font-medium">{stat.kingdomPrinciple}</span>
                  <span className="mx-2">•</span>
                  <span>{stat.contentGoal}</span>
                </div>

                {conversionRate && (
                  <div className="flex items-center justify-center my-2">
                    <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      ↓ {conversionRate}% conversion to {nextStage?.stage}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SEEDS Framework Guide */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-semibold mb-6">SEEDS Framework Guide</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(SEEDS_DESCRIPTIONS).map(([stage, desc]) => {
            const Icon = desc.icon;

            return (
              <div key={stage} className={`${desc.lightColor} border-2 ${desc.borderColor} rounded-lg p-4`}>
                <div className="flex items-center gap-2 mb-3">
                  <Icon className={desc.textColor} size={24} />
                  <h4 className={`font-bold ${desc.textColor}`}>{stage}</h4>
                </div>

                <div className="space-y-2 text-sm">
                  <div>
                    <p className="font-semibold text-gray-700">Kingdom Principle:</p>
                    <p className="text-gray-600 italic">{desc.kingdomPrinciple}</p>
                  </div>

                  <div>
                    <p className="font-semibold text-gray-700">Content Goal:</p>
                    <p className="text-gray-600">{desc.contentGoal}</p>
                  </div>

                  <div>
                    <p className="font-semibold text-gray-700">Business Goal:</p>
                    <p className="text-gray-600">{desc.businessGoal}</p>
                  </div>

                  <div>
                    <p className="font-semibold text-gray-700">Replaces:</p>
                    <p className="text-red-600 line-through">{desc.replaces}</p>
                  </div>

                  <div>
                    <p className="font-semibold text-gray-700">Tactics:</p>
                    <ul className="list-disc list-inside text-gray-600">
                      {desc.tactics.slice(0, 2).map((tactic, idx) => (
                        <li key={idx}>{tactic}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contacts Table */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {selectedStage ? `${selectedStage} Stage Contacts` : 'All Contacts'}
          </h3>
          <div className="flex items-center gap-3">
            {selectedStage && (
              <button
                onClick={() => setSelectedStage(null)}
                className="text-sm text-blue-600 hover:underline"
              >
                View All
              </button>
            )}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search contacts..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr className="text-left text-sm text-gray-600">
                <th className="pb-3">Name</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">SEEDS Stage</th>
                <th className="pb-3">Source</th>
                <th className="pb-3">Product</th>
                <th className="pb-3 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {displayStudents.map((student, idx) => {
                const stageDesc = SEEDS_DESCRIPTIONS[student.stage];

                return (
                  <tr key={idx} className="border-b last:border-0">
                    <td className="py-3">{student.name}</td>
                    <td className="py-3 text-sm text-gray-600">{student.email}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${stageDesc.lightColor} ${stageDesc.textColor} border ${stageDesc.borderColor}`}>
                        {student.stage}
                      </span>
                    </td>
                    <td className="py-3 text-sm text-gray-600">{student.seeds_source || '-'}</td>
                    <td className="py-3 text-sm">{student.product_purchased || '-'}</td>
                    <td className="py-3 text-right font-semibold">
                      R{student.revenue_contributed.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {displayStudents.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              {searchTerm ? 'No contacts found.' : 'No contacts yet. Click "Add Contact" to plant your first SEED! 🌱'}
            </p>
          )}
        </div>
      </div>

      {/* Add Contact Modal */}
      {showAddModal && (
        <AddContactModal
          onClose={() => setShowAddModal(false)}
          onAdd={(contact) => {
            addStudent({
              ...contact,
              id: Date.now(),
              stage_history: [{ stage: contact.stage, date: new Date().toISOString() }],
            });
            setShowAddModal(false);
          }}
        />
      )}

      {/* Kingdom Footer */}
      <div className="bg-gradient-to-r from-purple-50 to-green-50 border-2 border-purple-200 rounded-lg p-6 text-center">
        <p className="font-semibold text-lg mb-2">
          🌱 The SEEDS Promise
        </p>
        <p className="text-gray-700 mb-2">
          "We don't just close sales. We plant SEEDS that grow into trees that bear fruit for generations."
        </p>
        <p className="text-sm text-gray-600 italic">
          LAPS extracts value. SEEDS creates legacy. • LAPS is worldly. SEEDS is Kingdom.
        </p>
      </div>
    </div>
  );
}

function AddContactModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (contact: Student) => void;
}) {
  const [formData, setFormData] = useState<Student>({
    name: '',
    email: '',
    stage: 'Signal',
    revenue_contributed: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <h3 className="text-2xl font-bold mb-6">🌱 Add Contact to SEEDS Funnel</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">SEEDS Stage</label>
            <select
              value={formData.stage}
              onChange={(e) => setFormData({ ...formData, stage: e.target.value as Student['stage'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              {SEEDS_STAGES.map(stage => (
                <option key={stage} value={stage}>
                  {stage} - {SEEDS_DESCRIPTIONS[stage].kingdomPrinciple}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {SEEDS_DESCRIPTIONS[formData.stage].contentGoal}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Source (Which content brought them in?)</label>
            <input
              type="text"
              value={formData.seeds_source || ''}
              onChange={(e) => setFormData({ ...formData, seeds_source: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="e.g., R23K affiliate story Reel"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Notes</label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              rows={3}
              placeholder="Track their journey, questions, interests..."
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 font-medium"
            >
              Plant SEED 🌱
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
