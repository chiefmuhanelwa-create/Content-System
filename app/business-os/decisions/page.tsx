'use client';

import { useState } from 'react';
import { Brain, DollarSign, Clock, TrendingUp } from 'lucide-react';

export default function DecisionFramework() {
  const [activeTab, setActiveTab] = useState<'opportunity' | 'pricing' | 'time'>('opportunity');

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Decision Frameworks</h1>
        <p className="text-gray-600">Data-driven tools for strategic decisions</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab('opportunity')}
          className={`px-4 py-2 font-medium ${activeTab === 'opportunity'
            ? 'border-b-2 border-blue-600 text-blue-600'
            : 'text-gray-600 hover:text-gray-900'
            }`}
        >
          Opportunity Filter
        </button>
        <button
          onClick={() => setActiveTab('pricing')}
          className={`px-4 py-2 font-medium ${activeTab === 'pricing'
            ? 'border-b-2 border-blue-600 text-blue-600'
            : 'text-gray-600 hover:text-gray-900'
            }`}
        >
          Pricing Calculator
        </button>
        <button
          onClick={() => setActiveTab('time')}
          className={`px-4 py-2 font-medium ${activeTab === 'time'
            ? 'border-b-2 border-blue-600 text-blue-600'
            : 'text-gray-600 hover:text-gray-900'
            }`}
        >
          Time Allocation
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'opportunity' && <OpportunityFilter />}
      {activeTab === 'pricing' && <PricingCalculator />}
      {activeTab === 'time' && <TimeAllocation />}
    </div>
  );
}

function OpportunityFilter() {
  const [missionAligned, setMissionAligned] = useState<boolean | null>(null);
  const [timeRequired, setTimeRequired] = useState(0);
  const [expectedReturn, setExpectedReturn] = useState(0);
  const [peaceCheck, setPeaceCheck] = useState<boolean | null>(null);

  const hourlyRate = 5000; // R5,000 per hour
  const roi = timeRequired > 0 ? ((expectedReturn - (timeRequired * hourlyRate)) / (timeRequired * hourlyRate)) * 100 : 0;

  const getDecision = () => {
    if (missionAligned === false || peaceCheck === false) {
      return { decision: 'DECLINE', color: 'red', reasoning: 'Fails mission alignment or peace check' };
    }
    if (roi < 100) {
      return { decision: 'DEFER', color: 'yellow', reasoning: 'ROI below 100% - consider alternatives' };
    }
    if (roi >= 100 && missionAligned && peaceCheck) {
      return { decision: 'PROCEED', color: 'green', reasoning: 'Aligned with mission, profitable, and peaceful' };
    }
    return { decision: 'INCOMPLETE', color: 'gray', reasoning: 'Complete all fields to see decision' };
  };

  const result = getDecision();

  return (
    <div className="bg-white rounded-lg p-6 shadow-md space-y-6">
      <h3 className="text-lg font-semibold">Opportunity Filter</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            1. Is this opportunity aligned with your mission?
          </label>
          <div className="flex gap-4">
            <button
              onClick={() => setMissionAligned(true)}
              className={`px-4 py-2 rounded-lg font-medium ${missionAligned === true
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              Yes
            </button>
            <button
              onClick={() => setMissionAligned(false)}
              className={`px-4 py-2 rounded-lg font-medium ${missionAligned === false
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              No
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            2. How many hours will this require?
          </label>
          <input
            type="number"
            value={timeRequired || ''}
            onChange={(e) => setTimeRequired(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 40"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            3. What is the expected financial return (ZAR)?
          </label>
          <input
            type="number"
            value={expectedReturn || ''}
            onChange={(e) => setExpectedReturn(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 500000"
            min="0"
          />
        </div>

        {timeRequired > 0 && expectedReturn > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Calculated ROI:</p>
            <p className="text-3xl font-bold text-blue-600">{roi.toFixed(1)}%</p>
            <p className="text-xs text-gray-500 mt-2">
              Cost: R{(timeRequired * hourlyRate).toLocaleString()} ({timeRequired} hours × R{hourlyRate.toLocaleString()}/hr)
            </p>
            <p className="text-xs text-gray-500">
              Net Profit: R{(expectedReturn - (timeRequired * hourlyRate)).toLocaleString()}
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">
            4. Do you have peace about this decision?
          </label>
          <div className="flex gap-4">
            <button
              onClick={() => setPeaceCheck(true)}
              className={`px-4 py-2 rounded-lg font-medium ${peaceCheck === true
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              Yes
            </button>
            <button
              onClick={() => setPeaceCheck(false)}
              className={`px-4 py-2 rounded-lg font-medium ${peaceCheck === false
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              No
            </button>
          </div>
        </div>
      </div>

      {/* Decision Result */}
      <div className={`border-2 rounded-lg p-6 ${result.color === 'green'
        ? 'bg-green-50 border-green-300'
        : result.color === 'red'
          ? 'bg-red-50 border-red-300'
          : result.color === 'yellow'
            ? 'bg-yellow-50 border-yellow-300'
            : 'bg-gray-50 border-gray-300'
        }`}>
        <p className="text-sm font-medium text-gray-600 mb-2">DECISION:</p>
        <p className={`text-3xl font-bold mb-2 ${result.color === 'green'
          ? 'text-green-600'
          : result.color === 'red'
            ? 'text-red-600'
            : result.color === 'yellow'
              ? 'text-yellow-600'
              : 'text-gray-600'
          }`}>
          {result.decision}
        </p>
        <p className="text-sm text-gray-700">{result.reasoning}</p>
      </div>
    </div>
  );
}

function PricingCalculator() {
  const [contentHours, setContentHours] = useState(0);
  const [studentValue, setStudentValue] = useState(0);
  const [competitorPrice, setCompetitorPrice] = useState(0);
  const [overhead, setOverhead] = useState(0);

  const hourlyRate = 5000;
  const creationCost = contentHours * hourlyRate;
  const valueBasedPrice = studentValue * 0.1; // 10% of value
  const costPlusPrice = creationCost + overhead;

  const suggestedMin = Math.max(costPlusPrice, competitorPrice * 0.8);
  const suggestedMax = Math.min(valueBasedPrice, competitorPrice * 1.2);

  return (
    <div className="bg-white rounded-lg p-6 shadow-md space-y-6">
      <h3 className="text-lg font-semibold">Pricing Calculator</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Hours to Create Content</label>
          <input
            type="number"
            value={contentHours || ''}
            onChange={(e) => setContentHours(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Value to Student (ZAR)</label>
          <input
            type="number"
            value={studentValue || ''}
            onChange={(e) => setStudentValue(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Competitor Pricing (ZAR)</label>
          <input
            type="number"
            value={competitorPrice || ''}
            onChange={(e) => setCompetitorPrice(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Overhead Costs (ZAR)</label>
          <input
            type="number"
            value={overhead || ''}
            onChange={(e) => setOverhead(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            min="0"
          />
        </div>
      </div>

      {contentHours > 0 && studentValue > 0 && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6">
          <p className="text-sm mb-2">Suggested Price Range:</p>
          <p className="text-4xl font-bold mb-4">
            R{suggestedMin.toLocaleString()} - R{suggestedMax.toLocaleString()}
          </p>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="opacity-75">Creation Cost</p>
              <p className="font-semibold">R{creationCost.toLocaleString()}</p>
            </div>
            <div>
              <p className="opacity-75">Value-Based</p>
              <p className="font-semibold">R{valueBasedPrice.toLocaleString()}</p>
            </div>
            <div>
              <p className="opacity-75">Cost-Plus</p>
              <p className="font-semibold">R{costPlusPrice.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TimeAllocation() {
  const [creating, setCreating] = useState(0);
  const [selling, setSelling] = useState(0);
  const [serving, setServing] = useState(0);

  const total = creating + selling + serving;
  const creatingPercent = total > 0 ? (creating / total) * 100 : 0;
  const sellingPercent = total > 0 ? (selling / total) * 100 : 0;
  const servingPercent = total > 0 ? (serving / total) * 100 : 0;

  const isBalanced = creatingPercent >= 35 && creatingPercent <= 45 &&
    sellingPercent >= 25 && sellingPercent <= 35 &&
    servingPercent >= 25 && servingPercent <= 35;

  return (
    <div className="bg-white rounded-lg p-6 shadow-md space-y-6">
      <h3 className="text-lg font-semibold">Weekly Time Allocation</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Creating (Target: 40%)
          </label>
          <input
            type="number"
            value={creating || ''}
            onChange={(e) => setCreating(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Hours per week"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Selling (Target: 30%)
          </label>
          <input
            type="number"
            value={selling || ''}
            onChange={(e) => setSelling(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Hours per week"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Serving (Target: 30%)
          </label>
          <input
            type="number"
            value={serving || ''}
            onChange={(e) => setServing(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Hours per week"
            min="0"
          />
        </div>
      </div>

      {total > 0 && (
        <div>
          <div className={`border-2 rounded-lg p-4 mb-4 ${isBalanced
            ? 'bg-green-50 border-green-300'
            : 'bg-orange-50 border-orange-300'
            }`}>
            <p className="font-semibold mb-2">
              {isBalanced ? '✓ Balanced' : '⚠ Imbalanced'}
            </p>
            <p className="text-sm text-gray-600">
              {isBalanced
                ? 'Your time allocation is healthy!'
                : 'Adjust your time to match the target percentages.'}
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Creating</span>
                <span>{creatingPercent.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-6">
                <div
                  className="bg-blue-500 h-6 rounded-full"
                  style={{ width: `${creatingPercent}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Selling</span>
                <span>{sellingPercent.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-6">
                <div
                  className="bg-green-500 h-6 rounded-full"
                  style={{ width: `${sellingPercent}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Serving</span>
                <span>{servingPercent.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-6">
                <div
                  className="bg-purple-500 h-6 rounded-full"
                  style={{ width: `${servingPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
