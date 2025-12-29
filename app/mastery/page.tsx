'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface MasteryData {
  weekly_stats: {
    week_number: number;
    total_requests: number;
    approved_count: number;
    rejected_count: number;
    conditional_count: number;
    first_pass_approval_rate: number;
    avg_total_score: number;
    week_start_date: string;
    week_end_date: string;
  }[];
  overall: {
    total_pieces: number;
    overall_approval_rate: number;
    avg_score: number;
    trend: string;
  };
  violations: {
    law: string;
    count: number;
    avg_score: number;
  }[];
}

export default function MasteryPage() {
  const [data, setData] = useState<MasteryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMasteryData();
  }, []);

  const fetchMasteryData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/mastery/overview');
      if (response.ok) {
        const masteryData = await response.json();
        setData(masteryData);
      }
    } catch (error) {
      console.error('Error fetching mastery data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-gray-600 text-lg">Loading mastery data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mastery Dashboard</h1>
              <p className="text-sm text-gray-600 italic">Track your content excellence journey</p>
            </div>
            <Link
              href="/dashboard"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!data || data.weekly_stats.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Start Your Mastery Journey</h3>
            <p className="text-gray-600 mb-6">
              Create and vet content to see your mastery metrics
            </p>
            <Link
              href="/create"
              className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
            >
              Create Content
            </Link>
          </div>
        ) : (
          <>
            {/* Overall Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm font-medium text-gray-600 mb-1">Total Pieces</div>
                <div className="text-3xl font-bold text-gray-900">{data.overall.total_pieces}</div>
                <div className="text-xs text-gray-500 mt-1">All time</div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm font-medium text-gray-600 mb-1">Approval Rate</div>
                <div className="text-3xl font-bold text-green-600">
                  {data.overall.overall_approval_rate.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500 mt-1">First pass</div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm font-medium text-gray-600 mb-1">Avg Score</div>
                <div className="text-3xl font-bold text-purple-600">
                  {data.overall.avg_score.toFixed(0)}
                </div>
                <div className="text-xs text-gray-500 mt-1">Out of 205</div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm font-medium text-gray-600 mb-1">Trend</div>
                <div className="text-3xl font-bold text-blue-600">
                  {data.overall.trend === 'improving' && '📈'}
                  {data.overall.trend === 'declining' && '📉'}
                  {data.overall.trend === 'stable' && '➡️'}
                </div>
                <div className="text-xs text-gray-500 mt-1 capitalize">{data.overall.trend}</div>
              </div>
            </div>

            {/* Weekly Progress */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Weekly Progress</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Week
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Period
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Approved
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Conditional
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rejected
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Approval %
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Avg Score
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.weekly_stats.map((week) => (
                      <tr key={week.week_number} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Week {week.week_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(week.week_start_date).toLocaleDateString()} -{' '}
                          {new Date(week.week_end_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {week.total_requests}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                          {week.approved_count}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600 font-semibold">
                          {week.conditional_count}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">
                          {week.rejected_count}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-semibold text-gray-900 mr-2">
                              {week.first_pass_approval_rate.toFixed(1)}%
                            </div>
                            <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                              <div
                                className={`h-2 rounded-full ${
                                  week.first_pass_approval_rate >= 80
                                    ? 'bg-green-500'
                                    : week.first_pass_approval_rate >= 50
                                    ? 'bg-yellow-500'
                                    : 'bg-red-500'
                                }`}
                                style={{ width: `${week.first_pass_approval_rate}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {week.avg_total_score.toFixed(0)}/205
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Constitutional Law Violations */}
            {data.violations && data.violations.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Areas for Improvement</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Laws that need more attention (sorted by lowest average scores)
                </p>
                <div className="space-y-4">
                  {data.violations.map((violation) => (
                    <div
                      key={violation.law}
                      className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{violation.law}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          {violation.count} violation{violation.count > 1 ? 's' : ''}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-red-600">
                          {violation.avg_score.toFixed(1)}/10
                        </div>
                        <div className="text-xs text-gray-600">Avg score</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Target Banner */}
            <div className="mt-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-2">Target: 80% First-Pass Approval Rate</h3>
              <p className="text-lg opacity-90">
                Master the Constitutional Law. Build systems. Create legacy content.
              </p>
              <p className="text-sm opacity-75 mt-4 italic">For children's children 🌍</p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
