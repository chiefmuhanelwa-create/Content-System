'use client';

import { useBusinessOS, Product } from '@/lib/store';
import { useState, useEffect } from 'react';
import { Plus, DollarSign, TrendingUp, Calendar } from 'lucide-react';

const STATUSES: Product['status'][] = ['Idea', 'Planning', 'Production', 'Launched', 'Evergreen'];

const STATUS_COLORS = {
  Idea: 'bg-gray-200 text-gray-700',
  Planning: 'bg-blue-200 text-blue-700',
  Production: 'bg-yellow-200 text-yellow-700',
  Launched: 'bg-green-200 text-green-700',
  Evergreen: 'bg-purple-200 text-purple-700',
};

export default function ProductRoadmap() {
  const { products, addProduct, setProducts } = useBusinessOS();
  const [showAddModal, setShowAddModal] = useState(false);

  // Pre-populate with default products
  useEffect(() => {
    if (products.length === 0) {
      const defaultProducts: Product[] = [
        {
          id: 1,
          name: 'Contentpreneur Starter System',
          type: 'Course',
          price: 997,
          description: 'Bronze tier - Foundation course for new contentpreneurs',
          status: 'Idea',
          revenue_generated: 0,
          units_sold: 0,
        },
        {
          id: 2,
          name: 'Fruitful Creator System',
          type: 'Course',
          price: 4997,
          description: 'Silver tier - Advanced systems for scaling',
          status: 'Idea',
          revenue_generated: 0,
          units_sold: 0,
        },
        {
          id: 3,
          name: 'Empire Builder Mastermind',
          type: 'Coaching',
          price: 14997,
          description: 'Gold tier - High-touch mastermind program',
          status: 'Idea',
          revenue_generated: 0,
          units_sold: 0,
        },
        {
          id: 4,
          name: 'The Table Membership',
          type: 'Membership',
          price: 497,
          description: 'Monthly community membership',
          status: 'Idea',
          revenue_generated: 0,
          units_sold: 0,
        },
        {
          id: 5,
          name: 'Niche Clarity Workbook',
          type: 'Micro-Product',
          price: 149,
          description: 'Lead magnet - Find your profitable niche',
          status: 'Idea',
          revenue_generated: 0,
          units_sold: 0,
        },
      ];
      setProducts(defaultProducts);
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold mb-2">Product Roadmap</h1>
          <p className="text-gray-600">Manage your product portfolio from idea to evergreen</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {/* Revenue Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-md">
          <p className="text-sm text-gray-600 mb-2">Total Product Revenue</p>
          <p className="text-3xl font-bold text-green-600">
            R{products.reduce((sum, p) => sum + p.revenue_generated, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-md">
          <p className="text-sm text-gray-600 mb-2">Products Launched</p>
          <p className="text-3xl font-bold text-blue-600">
            {products.filter(p => p.status === 'Launched' || p.status === 'Evergreen').length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-md">
          <p className="text-sm text-gray-600 mb-2">In Development</p>
          <p className="text-3xl font-bold text-yellow-600">
            {products.filter(p => p.status === 'Production').length}
          </p>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="bg-white rounded-lg p-6 shadow-md overflow-x-auto">
        <div className="flex gap-4 min-w-max pb-4">
          {STATUSES.map(status => {
            const statusProducts = products.filter(p => p.status === status);

            return (
              <div key={status} className="w-80 flex-shrink-0">
                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-700">{status}</h3>
                    <span className="bg-gray-300 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                      {statusProducts.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {statusProducts.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Timeline View */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-semibold mb-4">Product Timeline</h3>
        <div className="space-y-3">
          {products
            .filter(p => p.launch_date)
            .sort((a, b) => (a.launch_date || '').localeCompare(b.launch_date || ''))
            .map(product => (
              <div key={product.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <Calendar className="text-gray-400" size={20} />
                <div className="flex-1">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-600">
                    Launch: {product.launch_date && new Date(product.launch_date).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[product.status]}`}>
                  {product.status}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onAdd={(product) => {
            addProduct({ ...product, id: Date.now() });
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <h4 className="font-semibold mb-2">{product.name}</h4>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Price:</span>
          <span className="font-semibold">R{product.price.toLocaleString()}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Type:</span>
          <span className="text-gray-700">{product.type}</span>
        </div>

        {product.revenue_generated > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Revenue:</span>
            <span className="font-semibold text-green-600">
              R{product.revenue_generated.toLocaleString()}
            </span>
          </div>
        )}

        {product.units_sold > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Units Sold:</span>
            <span className="font-semibold">{product.units_sold}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function AddProductModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (product: Product) => void;
}) {
  const [formData, setFormData] = useState<Product>({
    name: '',
    type: 'Course',
    price: 0,
    description: '',
    status: 'Idea',
    revenue_generated: 0,
    units_sold: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-bold mb-6">Add New Product</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Product Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as Product['type'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="Course">Course</option>
              <option value="Book">Book</option>
              <option value="Micro-Product">Micro-Product</option>
              <option value="Membership">Membership</option>
              <option value="Coaching">Coaching</option>
              <option value="Workshop">Workshop</option>
              <option value="Template">Template</option>
              <option value="Community">Community</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Price (ZAR)</label>
            <input
              type="number"
              step="0.01"
              value={formData.price || ''}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Product['status'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {STATUSES.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Launch Date (optional)</label>
            <input
              type="date"
              value={formData.launch_date || ''}
              onChange={(e) => setFormData({ ...formData, launch_date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium"
            >
              Add Product
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
