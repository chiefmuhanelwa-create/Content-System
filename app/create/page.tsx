'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateContentPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    // Step 1: Strategic Intent
    content_intent: '',
    paids_stream: [] as string[],
    seeds_stage: '',

    // Step 2: Content Details
    content_type: '',
    platform: [] as string[],
    content_pillar: '',

    // Step 3: Strategic Alignment
    laws_upheld: [] as string[],
    story_bank_reference: '',
    pain_point: '',
    desired_outcome: '',

    // Step 4: CTA & Specifications
    cta_next_step: '',
    product_tier: '',
    max_length: '',
    signature_phrase: '',
    framework_reference: '',
    additional_context: '',
  });

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayField = (field: string, value: string) => {
    setFormData((prev) => {
      const currentArray = prev[field as keyof typeof formData] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item) => item !== value)
        : [...currentArray, value];
      return { ...prev, [field]: newArray };
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/content/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to create content request');

      const data = await response.json();
      router.push(`/content/${data.id}/generate`);
    } catch (error) {
      console.error('Error creating content:', error);
      alert('Failed to create content request. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Create Content Request</h1>
          <p className="text-sm text-gray-600 italic">Guided by Constitutional Law</p>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`flex-1 h-2 rounded-full mx-1 ${
                  s <= step ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>Strategic Intent</span>
            <span>Content Details</span>
            <span>Alignment</span>
            <span>CTA & Specs</span>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-8">
          {/* STEP 1: Strategic Intent */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 1: Strategic Intent</h2>

              {/* Content Intent (4E) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Content Intent (4E Engine) *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['Entertain', 'Educate', 'Encourage', 'Earn'].map((intent) => (
                    <button
                      key={intent}
                      type="button"
                      onClick={() => updateField('content_intent', intent)}
                      className={`p-4 rounded-lg border-2 text-left transition-colors ${
                        formData.content_intent === intent
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-semibold text-gray-900">{intent}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        {intent === 'Entertain' && 'Hook attention, build community'}
                        {intent === 'Educate' && 'Teach, demonstrate value'}
                        {intent === 'Encourage' && 'Inspire action, share stories'}
                        {intent === 'Earn' && 'Generate revenue, make offers'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* PAIDS Stream */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  PAIDS Revenue Stream * (Select all that apply)
                </label>
                <div className="space-y-2">
                  {['Products', 'Ads', 'Information', 'Deals', 'Services'].map((stream) => (
                    <label key={stream} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.paids_stream.includes(stream)}
                        onChange={() => toggleArrayField('paids_stream', stream)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="ml-3 font-medium text-gray-900">{stream}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* SEEDS Stage */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  SEEDS Funnel Stage *
                </label>
                <select
                  value={formData.seeds_stage}
                  onChange={(e) => updateField('seeds_stage', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select stage...</option>
                  <option value="Signals">Signals - Attract attention</option>
                  <option value="Engagement">Engagement - Build relationship</option>
                  <option value="Education">Education - Teach solution</option>
                  <option value="Decision">Decision - Present offer</option>
                  <option value="Success">Success - Deliver results</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 2: Content Details */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 2: Content Details</h2>

              {/* Content Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Content Type *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['Short-form', 'Long-form', 'Email', 'Sales Page'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => updateField('content_type', type)}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        formData.content_type === type
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-semibold text-gray-900">{type}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Platform */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Platform * (Select all that apply)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['X (Twitter)', 'LinkedIn', 'Instagram', 'Facebook', 'TikTok', 'YouTube', 'Email', 'Website'].map((plat) => (
                    <label key={plat} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.platform.includes(plat)}
                        onChange={() => toggleArrayField('platform', plat)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-900">{plat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Content Pillar */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Content Pillar *
                </label>
                <select
                  value={formData.content_pillar}
                  onChange={(e) => updateField('content_pillar', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select pillar...</option>
                  <option value="Creator Business">Creator Business</option>
                  <option value="Personal Story">Personal Story</option>
                  <option value="African Excellence">African Excellence</option>
                  <option value="Faith & Business">Faith & Business</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 3: Strategic Alignment */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 3: Strategic Alignment</h2>

              {/* Laws Upheld */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  10 Laws to Emphasize * (Select 2-3)
                </label>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {[
                    'Law 1: Africa First',
                    'Law 2: Own Your Content',
                    'Law 3: Build in Public',
                    'Law 4: Long-term Thinking',
                    'Law 5: Multiple Revenue Streams',
                    'Law 6: Systems Over Hustle',
                    'Law 7: Community First',
                    'Law 8: Faith-Driven',
                    'Law 9: Legacy Focus',
                    'Law 10: Excellence Standard',
                  ].map((law) => (
                    <label key={law} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.laws_upheld.includes(law)}
                        onChange={() => toggleArrayField('laws_upheld', law)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-900">{law}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Story Bank Reference */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Story Bank Reference (Optional)
                </label>
                <input
                  type="text"
                  value={formData.story_bank_reference}
                  onChange={(e) => updateField('story_bank_reference', e.target.value)}
                  placeholder="e.g., 'First R100K month story'"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Pain Point */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Target Pain Point *
                </label>
                <select
                  value={formData.pain_point}
                  onChange={(e) => updateField('pain_point', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select pain point...</option>
                  <option value="Platform Dependency">Platform Dependency</option>
                  <option value="Monetization Confusion">Monetization Confusion</option>
                  <option value="Content Burnout">Content Burnout</option>
                  <option value="No Systems">No Systems</option>
                  <option value="Inconsistent Results">Inconsistent Results</option>
                </select>
              </div>

              {/* Desired Outcome */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Desired Outcome *
                </label>
                <select
                  value={formData.desired_outcome}
                  onChange={(e) => updateField('desired_outcome', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select outcome...</option>
                  <option value="Financial Freedom">Financial Freedom</option>
                  <option value="Time Freedom">Time Freedom</option>
                  <option value="Creative Freedom">Creative Freedom</option>
                  <option value="Influence">Influence</option>
                  <option value="Legacy">Legacy</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 4: CTA & Specifications */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 4: CTA & Specifications</h2>

              {/* CTA Next Step */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Call-to-Action (Next Step) *
                </label>
                <input
                  type="text"
                  value={formData.cta_next_step}
                  onChange={(e) => updateField('cta_next_step', e.target.value)}
                  placeholder="e.g., 'Download free guide', 'Join masterclass', 'Book call'"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Product Tier */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Tier *
                </label>
                <select
                  value={formData.product_tier}
                  onChange={(e) => updateField('product_tier', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select tier...</option>
                  <option value="Free">Free - Lead magnet</option>
                  <option value="Entry">Entry - R99-R499</option>
                  <option value="Core">Core - R500-R2999</option>
                  <option value="Premium">Premium - R3000-R9999</option>
                  <option value="High-Ticket">High-Ticket - R10000+</option>
                </select>
              </div>

              {/* Max Length */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Max Length (Optional)
                </label>
                <input
                  type="number"
                  value={formData.max_length}
                  onChange={(e) => updateField('max_length', e.target.value)}
                  placeholder="e.g., 280 for X, 2000 for LinkedIn"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Signature Phrase */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Signature Phrase (Optional)
                </label>
                <input
                  type="text"
                  value={formData.signature_phrase}
                  onChange={(e) => updateField('signature_phrase', e.target.value)}
                  placeholder="e.g., 'For children's children'"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Framework Reference */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Framework to Use *
                </label>
                <input
                  type="text"
                  value={formData.framework_reference}
                  onChange={(e) => updateField('framework_reference', e.target.value)}
                  placeholder="e.g., 'Hook-Story-Offer', 'PAS (Problem-Agitate-Solution)'"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Additional Context */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Additional Context (Optional)
                </label>
                <textarea
                  value={formData.additional_context}
                  onChange={(e) => updateField('additional_context', e.target.value)}
                  rows={4}
                  placeholder="Any additional instructions, tone preferences, or context..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {step < 4 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
              >
                Next Step
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating...' : 'Create & Generate Content'}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
