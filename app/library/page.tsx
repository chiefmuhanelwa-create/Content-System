'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ContentItem {
  id: number;
  content_intent: string;
  content_type: string;
  content_pillar: string;
  status: string;
  total_score?: number;
  decision?: string;
  created_at: string;
  content_text?: string;
}

export default function LibraryPage() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState({
    intent: 'all',
    status: 'all',
    pillar: 'all',
  });

  useEffect(() => {
    fetchContent();
  }, [filter]);

  const fetchContent = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filter.intent !== 'all') queryParams.append('intent', filter.intent);
      if (filter.status !== 'all') queryParams.append('status', filter.status);
      if (filter.pillar !== 'all') queryParams.append('pillar', filter.pillar);

      const response = await fetch(`/api/content/library?${queryParams}`);
      if (response.ok) {
        const data = await response.json();
        setContent(data.content || []);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      pending: 'bg-gray-100 text-gray-800',
      generated: 'bg-blue-100 text-blue-800',
      vetted: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      published: 'bg-purple-100 text-purple-800',
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const getDecisionBadge = (decision: string) => {
    const badges: Record<string, string> = {
      APPROVED: 'bg-green-100 text-green-800',
      CONDITIONAL: 'bg-yellow-100 text-yellow-800',
      REJECTED: 'bg-red-100 text-red-800',
    };
    return badges[decision] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Content Library</h1>
              <p className="text-sm text-gray-600 italic">All your content in one place</p>
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
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Intent Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Intent (4E)
              </label>
              <select
                value={filter.intent}
                onChange={(e) => setFilter({ ...filter, intent: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Intents</option>
                <option value="Entertain">Entertain</option>
                <option value="Educate">Educate</option>
                <option value="Encourage">Encourage</option>
                <option value="Earn">Earn</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filter.status}
                onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="generated">Generated</option>
                <option value="vetted">Vetted</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="published">Published</option>
              </select>
            </div>

            {/* Pillar Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Pillar
              </label>
              <select
                value={filter.pillar}
                onChange={(e) => setFilter({ ...filter, pillar: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Pillars</option>
                <option value="Creator Business">Creator Business</option>
                <option value="Personal Story">Personal Story</option>
                <option value="African Excellence">African Excellence</option>
                <option value="Faith & Business">Faith & Business</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-gray-600">Loading content...</p>
          </div>
        ) : content.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No content yet</h3>
            <p className="text-gray-600 mb-6">Start creating content to see it here</p>
            <Link
              href="/create"
              className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
            >
              Create Your First Piece
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                        item.status
                      )}`}
                    >
                      {item.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(item.created_at).toLocaleDateString()}
                  </div>
                </div>

                {/* Content Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <span className="font-semibold text-gray-700 w-20">Intent:</span>
                    <span className="text-gray-900">{item.content_intent}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="font-semibold text-gray-700 w-20">Type:</span>
                    <span className="text-gray-900">{item.content_type}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="font-semibold text-gray-700 w-20">Pillar:</span>
                    <span className="text-gray-900">{item.content_pillar}</span>
                  </div>
                </div>

                {/* Score & Decision */}
                {item.total_score !== undefined && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-700">Score:</span>
                      <span className="text-lg font-bold text-gray-900">
                        {item.total_score}/205
                      </span>
                    </div>
                    {item.decision && (
                      <div className="mt-2">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getDecisionBadge(
                            item.decision
                          )}`}
                        >
                          {item.decision}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Preview */}
                {item.content_text && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 line-clamp-3">{item.content_text}</p>
                  </div>
                )}

                {/* Action Button */}
                <Link
                  href={`/content/${item.id}`}
                  className="block w-full text-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
