'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface ContentData {
  request: any;
  generated: any;
  vetting: any;
}

export default function GeneratePage() {
  const params = useParams();
  const router = useRouter();
  const contentId = params.id;

  const [data, setData] = useState<ContentData | null>(null);
  const [step, setStep] = useState<'loading' | 'generating' | 'vetting' | 'complete'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (contentId) {
      startGeneration();
    }
  }, [contentId]);

  const startGeneration = async () => {
    try {
      // Step 1: Generate content
      setStep('generating');
      const generateResponse = await fetch(`/api/content/${contentId}/generate`, {
        method: 'POST',
      });

      if (!generateResponse.ok) {
        const errorData = await generateResponse.json();
        throw new Error(errorData.message || errorData.error || 'Content generation failed');
      }

      const generateData = await generateResponse.json();
      setData((prev) => ({ ...prev, request: generateData.request, generated: generateData.generated } as ContentData));

      // Step 2: Vet content
      setStep('vetting');
      const vetResponse = await fetch(`/api/content/${contentId}/vet`, {
        method: 'POST',
      });

      if (!vetResponse.ok) {
        const errorData = await vetResponse.json();
        throw new Error(errorData.message || errorData.error || 'Content vetting failed');
      }

      const vetData = await vetResponse.json();
      setData((prev) => ({ ...prev!, vetting: vetData.vetting }));

      // Complete
      setStep('complete');

    } catch (err: any) {
      console.error('Generation error:', err);
      setError(err.message || 'An error occurred');
      setStep('loading');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Content Generation Failed</h2>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <h3 className="font-semibold text-gray-900">Common Solutions:</h3>

            <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
              <h4 className="font-semibold text-yellow-900 mb-2">1. Check Anthropic API Key</h4>
              <p className="text-sm text-yellow-800 mb-2">
                Most likely issue: ANTHROPIC_API_KEY not configured in Vercel
              </p>
              <ul className="text-sm text-yellow-700 list-disc list-inside space-y-1">
                <li>Get key from <a href="https://console.anthropic.com" target="_blank" className="underline">console.anthropic.com</a></li>
                <li>Add to Vercel → Settings → Environment Variables</li>
                <li>Name: <code className="bg-yellow-100 px-1 rounded">ANTHROPIC_API_KEY</code></li>
                <li>Then redeploy your app</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded p-4">
              <h4 className="font-semibold text-blue-900 mb-2">2. Check Database Setup</h4>
              <p className="text-sm text-blue-800 mb-2">
                Make sure you ran the database schema in Neon
              </p>
              <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
                <li>Go to <a href="https://console.neon.tech" target="_blank" className="underline">console.neon.tech</a></li>
                <li>Open SQL Editor</li>
                <li>Run all 294 lines from <code className="bg-blue-100 px-1 rounded">database/schema.sql</code></li>
              </ul>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded p-4">
              <h4 className="font-semibold text-purple-900 mb-2">3. Run System Health Check</h4>
              <p className="text-sm text-purple-800 mb-2">
                Visit this URL to see detailed diagnostics:
              </p>
              <code className="text-sm bg-purple-100 px-2 py-1 rounded block">
                {typeof window !== 'undefined' ? window.location.origin : ''}/api/system/health
              </code>
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              href="/dashboard"
              className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 text-center"
            >
              Back to Dashboard
            </Link>
            <a
              href="/api/system/health"
              target="_blank"
              className="flex-1 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 text-center"
            >
              Check System Health
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Content Generation & Vetting</h1>
          <p className="text-sm text-gray-600 italic">AI-powered by Claude 3.5 Sonnet</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <div className="space-y-6">
            {/* Step 1: Generating */}
            <div className="flex items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  step === 'generating'
                    ? 'bg-blue-600 text-white animate-pulse'
                    : step === 'vetting' || step === 'complete'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step === 'vetting' || step === 'complete' ? '✓' : '1'}
              </div>
              <div className="ml-4 flex-1">
                <div className="text-lg font-semibold text-gray-900">Generating Content</div>
                <div className="text-sm text-gray-600">
                  {step === 'generating' && 'AI is crafting your content...'}
                  {(step === 'vetting' || step === 'complete') && 'Content generated successfully'}
                  {step === 'loading' && 'Waiting...'}
                </div>
              </div>
            </div>

            {/* Step 2: Vetting */}
            <div className="flex items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  step === 'vetting'
                    ? 'bg-blue-600 text-white animate-pulse'
                    : step === 'complete'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step === 'complete' ? '✓' : '2'}
              </div>
              <div className="ml-4 flex-1">
                <div className="text-lg font-semibold text-gray-900">Vetting Against Constitutional Law</div>
                <div className="text-sm text-gray-600">
                  {step === 'vetting' && 'Judging against 7-tier system...'}
                  {step === 'complete' && 'Vetting complete'}
                  {(step === 'loading' || step === 'generating') && 'Waiting...'}
                </div>
              </div>
            </div>

            {/* Step 3: Complete */}
            <div className="flex items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  step === 'complete'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step === 'complete' ? '✓' : '3'}
              </div>
              <div className="ml-4 flex-1">
                <div className="text-lg font-semibold text-gray-900">Results Ready</div>
                <div className="text-sm text-gray-600">
                  {step === 'complete' ? 'View your content and vetting results' : 'Waiting...'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {step === 'complete' && data && (
          <>
            {/* Generated Content */}
            <div className="bg-white rounded-lg shadow p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Generated Content</h2>
              <div className="prose max-w-none">
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <p className="whitespace-pre-wrap text-gray-900">{data.generated.content_text}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-600">
                <span className="font-semibold mr-2">Word Count:</span>
                <span>{data.generated.word_count}</span>
              </div>
            </div>

            {/* Vetting Results */}
            <div className="bg-white rounded-lg shadow p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Vetting Results</h2>

              {/* Decision Banner */}
              <div
                className={`p-6 rounded-lg mb-6 ${
                  data.vetting.decision === 'APPROVED'
                    ? 'bg-green-100 border-2 border-green-500'
                    : data.vetting.decision === 'CONDITIONAL'
                    ? 'bg-yellow-100 border-2 border-yellow-500'
                    : 'bg-red-100 border-2 border-red-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold mb-1">
                      {data.vetting.decision === 'APPROVED' && '✅ APPROVED'}
                      {data.vetting.decision === 'CONDITIONAL' && '⚠️ CONDITIONAL'}
                      {data.vetting.decision === 'REJECTED' && '❌ REJECTED'}
                    </div>
                    <div className="text-sm">
                      {data.vetting.approval_level && `Level: ${data.vetting.approval_level}`}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold">{data.vetting.total_score}</div>
                    <div className="text-sm">out of 205</div>
                  </div>
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">Constitutional Compliance (10 Laws)</span>
                    <span className="font-bold">{data.vetting.constitutional_score}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full"
                      style={{ width: `${(data.vetting.constitutional_score / 100) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">Framework Integration (PAIDS, SEEDS, 4E)</span>
                    <span className="font-bold">{data.vetting.framework_integration_score}/40</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-600 h-3 rounded-full"
                      style={{ width: `${(data.vetting.framework_integration_score / 40) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">Brand Voice</span>
                    <span className="font-bold">{data.vetting.voice_score}/20</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-purple-600 h-3 rounded-full"
                      style={{ width: `${(data.vetting.voice_score / 20) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">Quality Standards</span>
                    <span className="font-bold">{data.vetting.quality_score}/20</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-yellow-600 h-3 rounded-full"
                      style={{ width: `${(data.vetting.quality_score / 20) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">Sales Alignment</span>
                    <span className="font-bold">{data.vetting.sales_score}/15</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-red-600 h-3 rounded-full"
                      style={{ width: `${(data.vetting.sales_score / 15) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Feedback */}
              {data.vetting.strengths && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="font-semibold text-green-900 mb-2">✨ Strengths</div>
                  <p className="text-green-800 text-sm">{data.vetting.strengths}</p>
                </div>
              )}

              {data.vetting.required_changes && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="font-semibold text-yellow-900 mb-2">⚠️ Required Changes</div>
                  <p className="text-yellow-800 text-sm">{data.vetting.required_changes}</p>
                </div>
              )}

              {data.vetting.rejection_reasoning && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="font-semibold text-red-900 mb-2">❌ Rejection Reason</div>
                  <p className="text-red-800 text-sm">{data.vetting.rejection_reasoning}</p>
                </div>
              )}

              {data.vetting.suggestions && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="font-semibold text-blue-900 mb-2">💡 Suggestions</div>
                  <p className="text-blue-800 text-sm">{data.vetting.suggestions}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Link
                href="/create"
                className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 text-center"
              >
                Create Another
              </Link>
              <Link
                href="/library"
                className="flex-1 px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 text-center"
              >
                View Library
              </Link>
            </div>
          </>
        )}

        {/* Loading State */}
        {step !== 'complete' && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4 animate-bounce">🤖</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {step === 'generating' && 'Generating your content...'}
              {step === 'vetting' && 'Vetting against Constitutional Law...'}
              {step === 'loading' && 'Preparing...'}
            </h3>
            <p className="text-gray-600">This may take 30-60 seconds</p>
          </div>
        )}
      </main>
    </div>
  );
}
