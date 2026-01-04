'use client';

import { useBusinessOS, Risk } from '@/lib/store';
import { useState, useEffect } from 'react';
import { Plus, Shield, AlertTriangle, Calendar } from 'lucide-react';

const IMPACT_LEVELS: Risk['impact'][] = ['Low', 'Medium', 'High', 'Critical'];
const LIKELIHOOD_LEVELS: Risk['likelihood'][] = ['Low', 'Medium', 'High'];

// Pre-populated risks from blueprint
const defaultRisks: Omit<Risk, 'id'>[] = [
  {
    risk_name: 'Slow sales / low conversion',
    category: 'Financial',
    likelihood: 'Medium',
    impact: 'High',
    mitigation_plan: 'Launch Bronze early, iterate based on feedback. Build email list. Create micro-products for quick wins.',
    status: 'Monitoring',
  },
  {
    risk_name: 'Burnout / health breakdown',
    category: 'Health',
    likelihood: 'Medium',
    impact: 'Critical',
    mitigation_plan: 'Sabbath rest non-negotiable. Batch content creation. Delegate admin tasks. Track energy levels.',
    status: 'Monitoring',
  },
  {
    risk_name: 'Platform dependency (account loss)',
    category: 'Platform',
    likelihood: 'Low',
    impact: 'Critical',
    mitigation_plan: 'Own email list. Build on ConvertKit/Teachable. Multi-platform presence. Weekly backups.',
    status: 'Mitigated',
  },
  {
    risk_name: 'Copycats / IP theft',
    category: 'Reputation',
    likelihood: 'Medium',
    impact: 'Medium',
    mitigation_plan: 'Document everything. Trademark NOCHILL. Move fast. Build community moat.',
    status: 'Monitoring',
  },
  {
    risk_name: 'SARS / tax compliance issues',
    category: 'Legal',
    likelihood: 'Low',
    impact: 'High',
    mitigation_plan: 'Hire accountant. Keep meticulous records. File quarterly. Set aside 30% for tax.',
    status: 'Mitigated',
  },
  {
    risk_name: 'Economic downturn in South Africa',
    category: 'Market',
    likelihood: 'High',
    impact: 'High',
    mitigation_plan: 'Diversify revenue streams. Build USD income. Focus on transformation products. Payment plans.',
    status: 'Monitoring',
  },
  {
    risk_name: 'Student failures / bad testimonials',
    category: 'Reputation',
    likelihood: 'Medium',
    impact: 'High',
    mitigation_plan: 'Qualify students. Onboarding process. Weekly check-ins. Success tracking. Refund policy.',
    status: 'Monitoring',
  },
];

export default function RiskMitigation() {
  const { risks, addRisk, setRisks } = useBusinessOS();
  const [showAddModal, setShowAddModal] = useState(false);

  // Initialize with default risks
  useEffect(() => {
    if (risks.length === 0) {
      const risksWithIds = defaultRisks.map((risk, idx) => ({
        ...risk,
        id: idx + 1,
      }));
      setRisks(risksWithIds);
    }
  }, []);

  // Get risk color based on impact and likelihood
  const getRiskColor = (impact: Risk['impact'], likelihood: Risk['likelihood']) => {
    if (impact === 'Critical' && likelihood === 'High') return 'bg-red-600';
    if (impact === 'Critical' || (impact === 'High' && likelihood === 'High')) return 'bg-red-500';
    if (impact === 'High' || (impact === 'Medium' && likelihood === 'High')) return 'bg-orange-500';
    if (impact === 'Medium' || likelihood === 'Medium') return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getRiskScore = (impact: Risk['impact'], likelihood: Risk['likelihood']) => {
    const impactScore = { Low: 1, Medium: 2, High: 3, Critical: 4 }[impact];
    const likelihoodScore = { Low: 1, Medium: 2, High: 3 }[likelihood];
    return impactScore * likelihoodScore;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold mb-2">Risk Mitigation Tracker</h1>
          <p className="text-gray-600">Identify, assess, and mitigate business risks</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Add Risk
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {['Monitoring', 'Active', 'Mitigated', 'Occurred'].map(status => {
          const count = risks.filter(r => r.status === status).length;

          return (
            <div key={status} className="bg-white rounded-lg p-6 shadow-md">
              <p className="text-sm text-gray-600 mb-2">{status}</p>
              <p className="text-3xl font-bold">{count}</p>
            </div>
          );
        })}
      </div>

      {/* Risk Matrix */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-semibold mb-6">Risk Matrix</h3>
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            {/* Matrix Header */}
            <div className="flex mb-2">
              <div className="w-32"></div>
              <div className="flex-1 grid grid-cols-3 gap-2">
                <div className="text-center text-sm font-medium text-gray-600">Low</div>
                <div className="text-center text-sm font-medium text-gray-600">Medium</div>
                <div className="text-center text-sm font-medium text-gray-600">High</div>
              </div>
            </div>

            {/* Matrix Body */}
            <div className="space-y-2">
              {[...IMPACT_LEVELS].reverse().map(impact => (
                <div key={impact} className="flex gap-2">
                  <div className="w-32 flex items-center justify-end pr-4 text-sm font-medium text-gray-600">
                    {impact}
                  </div>
                  <div className="flex-1 grid grid-cols-3 gap-2">
                    {LIKELIHOOD_LEVELS.map(likelihood => {
                      const cellRisks = risks.filter(
                        r => r.impact === impact && r.likelihood === likelihood
                      );
                      const bgColor = getRiskColor(impact, likelihood);

                      return (
                        <div
                          key={likelihood}
                          className={`${bgColor} bg-opacity-10 border-2 ${bgColor.replace('bg-', 'border-')} rounded-lg p-3 min-h-[100px]`}
                        >
                          <div className="space-y-1">
                            {cellRisks.map((risk, idx) => (
                              <div
                                key={idx}
                                className="text-xs bg-white rounded px-2 py-1 shadow-sm cursor-pointer hover:shadow-md"
                                title={risk.risk_name}
                              >
                                <p className="font-medium truncate">{risk.risk_name}</p>
                                <p className="text-gray-500 truncate">{risk.category}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Y-axis label */}
            <div className="flex mt-4">
              <div className="w-32"></div>
              <div className="flex-1 text-center">
                <p className="text-sm font-medium text-gray-600">LIKELIHOOD →</p>
              </div>
            </div>
            <div className="absolute left-8 top-1/2 -translate-y-1/2 -rotate-90">
              <p className="text-sm font-medium text-gray-600 whitespace-nowrap">← IMPACT</p>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Cards */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-semibold mb-4">All Risks</h3>
        <div className="space-y-4">
          {risks
            .sort((a, b) => getRiskScore(b.impact, b.likelihood) - getRiskScore(a.impact, a.likelihood))
            .map((risk, idx) => (
              <div
                key={idx}
                className="border-l-4 pl-4 py-3 rounded-r-lg bg-gray-50"
                style={{
                  borderColor: getRiskColor(risk.impact, risk.likelihood).replace('bg-', ''),
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{risk.risk_name}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm bg-gray-200 text-gray-700 px-2 py-1 rounded">
                        {risk.category}
                      </span>
                      <span className="text-sm text-gray-600">
                        Impact: <span className="font-medium">{risk.impact}</span>
                      </span>
                      <span className="text-sm text-gray-600">
                        Likelihood: <span className="font-medium">{risk.likelihood}</span>
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${risk.status === 'Mitigated'
                      ? 'bg-green-100 text-green-700'
                      : risk.status === 'Active'
                        ? 'bg-red-100 text-red-700'
                        : risk.status === 'Occurred'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                  >
                    {risk.status}
                  </span>
                </div>

                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 mb-1">Mitigation Plan:</p>
                  <p className="text-sm text-gray-600">{risk.mitigation_plan}</p>
                </div>

                {risk.last_reviewed && (
                  <div className="mt-2 text-xs text-gray-500">
                    Last reviewed: {new Date(risk.last_reviewed).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Add Risk Modal */}
      {showAddModal && (
        <AddRiskModal
          onClose={() => setShowAddModal(false)}
          onAdd={(risk) => {
            addRisk({ ...risk, id: Date.now() });
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}

function AddRiskModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (risk: Risk) => void;
}) {
  const [formData, setFormData] = useState<Risk>({
    risk_name: '',
    category: 'Financial',
    likelihood: 'Medium',
    impact: 'Medium',
    status: 'Monitoring',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-bold mb-6">Add New Risk</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Risk Name</label>
            <input
              type="text"
              value={formData.risk_name}
              onChange={(e) => setFormData({ ...formData, risk_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as Risk['category'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="Financial">Financial</option>
              <option value="Operational">Operational</option>
              <option value="Market">Market</option>
              <option value="Platform">Platform</option>
              <option value="Legal">Legal</option>
              <option value="Health">Health</option>
              <option value="Reputation">Reputation</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Likelihood</label>
            <select
              value={formData.likelihood}
              onChange={(e) => setFormData({ ...formData, likelihood: e.target.value as Risk['likelihood'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {LIKELIHOOD_LEVELS.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Impact</label>
            <select
              value={formData.impact}
              onChange={(e) => setFormData({ ...formData, impact: e.target.value as Risk['impact'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {IMPACT_LEVELS.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Mitigation Plan</label>
            <textarea
              value={formData.mitigation_plan}
              onChange={(e) => setFormData({ ...formData, mitigation_plan: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Risk['status'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="Monitoring">Monitoring</option>
              <option value="Active">Active</option>
              <option value="Mitigated">Mitigated</option>
              <option value="Occurred">Occurred</option>
            </select>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium"
            >
              Add Risk
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
