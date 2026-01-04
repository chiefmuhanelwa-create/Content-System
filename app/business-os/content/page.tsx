'use client';

import { useBusinessOS, ContentItem } from '@/lib/store';
import { useState } from 'react';
import { Plus, Instagram, Youtube, Mail, Calendar as CalendarIcon } from 'lucide-react';

const FOUR_E_COLORS = {
  Entertain: 'bg-blue-500',
  Educate: 'bg-green-500',
  Encourage: 'bg-yellow-500',
  Earn: 'bg-red-500',
};

export default function ContentCalendar() {
  const { contentItems, addContent } = useBusinessOS();
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Get 4E balance
  const balance = {
    Entertain: contentItems.filter(c => c.four_e_category === 'Entertain').length,
    Educate: contentItems.filter(c => c.four_e_category === 'Educate').length,
    Encourage: contentItems.filter(c => c.four_e_category === 'Encourage').length,
    Earn: contentItems.filter(c => c.four_e_category === 'Earn').length,
  };

  const total = Object.values(balance).reduce((sum, val) => sum + val, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold mb-2">Content Calendar</h1>
          <p className="text-gray-600">4E Framework: Entertain, Educate, Encourage, Earn</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Add Content
        </button>
      </div>

      {/* 4E Balance */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-semibold mb-4">4E Balance (Last 30 Days)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {Object.entries(balance).map(([category, count]) => {
            const percentage = total > 0 ? (count / total) * 100 : 0;
            const target = category === 'Educate' ? 35 : category === 'Entertain' ? 30 : category === 'Encourage' ? 20 : 15;

            return (
              <div key={category} className="text-center">
                <div className={`${FOUR_E_COLORS[category as keyof typeof FOUR_E_COLORS]} text-white rounded-lg p-4 mb-2`}>
                  <p className="text-xs font-medium">{category}</p>
                  <p className="text-3xl font-bold">{count}</p>
                  <p className="text-xs">{percentage.toFixed(1)}%</p>
                </div>
                <p className="text-xs text-gray-500">Target: {target}%</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Content List */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-semibold mb-4">Upcoming & Recent Content</h3>
        <div className="space-y-3">
          {contentItems
            .sort((a, b) => (b.publish_date || '').localeCompare(a.publish_date || ''))
            .slice(0, 20)
            .map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className={`${FOUR_E_COLORS[item.four_e_category]} w-3 h-12 rounded`} />
                <div className="flex-1">
                  <p className="font-medium">{item.title}</p>
                  <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                    <span>{item.platform}</span>
                    <span>•</span>
                    <span>{item.content_type}</span>
                    <span>•</span>
                    <span>{item.four_e_category}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.status === 'Published'
                    ? 'bg-green-100 text-green-700'
                    : item.status === 'Scheduled'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-200 text-gray-700'
                    }`}>
                    {item.status}
                  </span>
                  {item.publish_date && (
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(item.publish_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          {contentItems.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              No content planned yet. Click "Add Content" to get started.
            </p>
          )}
        </div>
      </div>

      {/* Add Content Modal */}
      {showAddModal && (
        <AddContentModal
          onClose={() => setShowAddModal(false)}
          onAdd={(item) => {
            addContent({ ...item, id: Date.now() });
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}

function AddContentModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (item: ContentItem) => void;
}) {
  const [formData, setFormData] = useState<ContentItem>({
    platform: 'Instagram',
    content_type: 'Reel',
    four_e_category: 'Educate',
    title: '',
    status: 'Idea',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <h3 className="text-2xl font-bold mb-6">Add Content Item</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Platform</label>
            <select
              value={formData.platform}
              onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="Instagram">Instagram</option>
              <option value="TikTok">TikTok</option>
              <option value="YouTube">YouTube</option>
              <option value="Email">Email</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Twitter">Twitter</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Content Type</label>
            <select
              value={formData.content_type}
              onChange={(e) => setFormData({ ...formData, content_type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="Reel">Reel</option>
              <option value="Carousel">Carousel</option>
              <option value="Video">Video</option>
              <option value="Story">Story</option>
              <option value="Email">Email</option>
              <option value="Post">Post</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">4E Category</label>
            <select
              value={formData.four_e_category}
              onChange={(e) => setFormData({ ...formData, four_e_category: e.target.value as ContentItem['four_e_category'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="Entertain">Entertain</option>
              <option value="Educate">Educate</option>
              <option value="Encourage">Encourage</option>
              <option value="Earn">Earn</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as ContentItem['status'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="Idea">Idea</option>
              <option value="Scripted">Scripted</option>
              <option value="Filmed">Filmed</option>
              <option value="Edited">Edited</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Published">Published</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Publish Date</label>
            <input
              type="datetime-local"
              value={formData.publish_date || ''}
              onChange={(e) => setFormData({ ...formData, publish_date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium"
            >
              Add Content
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
