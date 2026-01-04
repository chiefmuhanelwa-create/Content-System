'use client';

import { useState } from 'react';
import { Sparkles, Zap, Target, RefreshCw, Copy, CheckCircle } from 'lucide-react';
import { HOOK_LIBRARY, STORY_BANK, SEEDS_CRITERIA, FRAMEWORKS, SIGNATURE_PHRASES, CTA_LIBRARY } from '@/lib/content-data';

type SEEDSStage = 'Signal' | 'Engagement' | 'Education' | 'Decision' | 'Success';
type Platform = 'Instagram Reel' | 'TikTok' | 'YouTube Short' | 'LinkedIn Post' | 'Twitter Thread';

interface GeneratorInput {
  problem: string;
  duration: number;
  platform: Platform;
  seedsStage: SEEDSStage;
  goal: string;
}

interface SelectedHook {
  hook: string;
  match_score: number;
  objection: string;
  type: string;
}

interface GeneratedScript {
  hook: string;
  story: string;
  framework: string;
  cta: string;
  fullScript: string;
  seedsScore: {
    overall: number;
    breakdown: Record<string, number>;
    suggestions: string[];
  };
}

export default function ContentGenerator() {
  const [input, setInput] = useState<GeneratorInput>({
    problem: '',
    duration: 30,
    platform: 'Instagram Reel',
    seedsStage: 'Signal',
    goal: '',
  });

  const [topHooks, setTopHooks] = useState<SelectedHook[]>([]);
  const [selectedHook, setSelectedHook] = useState<SelectedHook | null>(null);
  const [generatedScript, setGeneratedScript] = useState<GeneratedScript | null>(null);
  const [repurposedContent, setRepurposedContent] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Feature 1: Intelligent Hook Selector
  const findTopHooks = () => {
    const allHooks = [
      ...HOOK_LIBRARY.results,
      ...HOOK_LIBRARY.shocking,
      ...HOOK_LIBRARY.vulnerability,
      ...HOOK_LIBRARY.framework,
      ...HOOK_LIBRARY.contrarian,
      ...HOOK_LIBRARY.curiosity,
    ];

    // Simple matching algorithm based on problem keywords and SEEDS stage
    const scoredHooks = allHooks.map((hook) => {
      let score = hook.match_score;

      // Boost score if problem keywords match objection
      if (input.problem) {
        const problemWords = input.problem.toLowerCase().split(' ');
        const objectionWords = hook.objection.toLowerCase();
        const matches = problemWords.filter(word =>
          word.length > 3 && objectionWords.includes(word)
        );
        score += matches.length * 5;
      }

      // Adjust for SEEDS stage
      if (input.seedsStage === 'Signal' && (hook.type.includes('Results') || hook.type.includes('Shock'))) {
        score += 10;
      } else if (input.seedsStage === 'Engagement' && hook.type.includes('Vulnerability')) {
        score += 10;
      } else if (input.seedsStage === 'Education' && hook.type.includes('Framework')) {
        score += 10;
      }

      return { ...hook, match_score: Math.min(score, 100) };
    });

    // Sort and get top 3
    const top3 = scoredHooks
      .sort((a, b) => b.match_score - a.match_score)
      .slice(0, 3);

    setTopHooks(top3);
    setSelectedHook(null);
    setGeneratedScript(null);
    setRepurposedContent({});
  };

  // Feature 2: AI-Powered Script Generation Engine
  const generateScript = (hook: SelectedHook) => {
    setIsGenerating(true);
    setSelectedHook(hook);

    // Simulate AI processing delay
    setTimeout(() => {
      // Select appropriate story based on hook objection
      let selectedStory = STORY_BANK["R23K-affiliate"];
      if (hook.objection.toLowerCase().includes('platform')) {
        selectedStory = STORY_BANK["platform-loss"];
      } else if (hook.objection.toLowerCase().includes('equipment') || hook.objection.toLowerCase().includes('investment')) {
        selectedStory = STORY_BANK["r6k-decision"];
      } else if (hook.objection.toLowerCase().includes('starting') || hook.objection.toLowerCase().includes('nothing')) {
        selectedStory = STORY_BANK["bathroom-floor"];
      } else if (hook.objection.toLowerCase().includes('low rates') || hook.objection.toLowerCase().includes('exploitation')) {
        selectedStory = STORY_BANK["r350-exploitation"];
      }

      // Select framework based on SEEDS stage
      let framework = '';
      if (input.seedsStage === 'Education') {
        framework = FRAMEWORKS.PAIDS.integration_templates[0];
      } else if (input.seedsStage === 'Decision') {
        framework = FRAMEWORKS["4E"].integration_templates[0];
      }

      // Select signature phrase
      const signaturePhrase = SIGNATURE_PHRASES[Math.floor(Math.random() * SIGNATURE_PHRASES.length)];

      // Select CTA based on SEEDS stage
      let cta = '';
      if (input.seedsStage === 'Signal' || input.seedsStage === 'Engagement') {
        cta = CTA_LIBRARY.follow[0].cta;
      } else if (input.seedsStage === 'Education') {
        cta = CTA_LIBRARY.email[0].cta;
      } else if (input.seedsStage === 'Decision') {
        cta = CTA_LIBRARY.lead_magnet[0].cta;
      }

      // Build full script
      const scriptParts = [
        `${hook.hook}\n`,
        `${selectedStory.script}\n`,
        framework ? `\n${framework}\n` : '',
        `\n${signaturePhrase}`,
        cta ? `\n\n${cta}` : '',
      ];

      const fullScript = scriptParts.filter(Boolean).join('');

      // Feature 3: SEEDS Optimization Analyzer
      const seedsScore = calculateSEEDSScore(fullScript, input.seedsStage);

      const generated: GeneratedScript = {
        hook: hook.hook,
        story: selectedStory.title,
        framework: framework || 'None',
        cta,
        fullScript,
        seedsScore,
      };

      setGeneratedScript(generated);

      // Feature 4: Smart Repurposing Engine
      generateRepurposedContent(generated);

      setIsGenerating(false);
    }, 1500);
  };

  // Feature 3: SEEDS Optimization Analyzer
  const calculateSEEDSScore = (script: string, stage: SEEDSStage) => {
    const criteria = SEEDS_CRITERIA[stage];
    const breakdown: Record<string, number> = {};
    const suggestions: string[] = [];

    // Simple scoring based on content characteristics
    Object.entries(criteria.scoring).forEach(([criterion, weight]) => {
      let score = 70; // Base score

      if (criterion === 'hook_strength') {
        score = script.length > 50 && script.includes('R') ? 85 : 70;
        if (score < 80) suggestions.push('Consider adding specific monetary results to strengthen hook');
      } else if (criterion === 'story_quality') {
        score = script.split('\n').length > 3 ? 90 : 65;
        if (score < 80) suggestions.push('Story could benefit from more emotional detail');
      } else if (criterion === 'framework_clarity') {
        score = script.includes('PAIDS') || script.includes('4E') ? 95 : 60;
        if (score < 80) suggestions.push('Consider integrating a clear framework (PAIDS, 4E, or MS×TS×SS)');
      } else if (criterion === 'cta_clarity') {
        score = script.includes('Link in bio') || script.includes('Follow') ? 88 : 55;
        if (score < 80) suggestions.push('Add a clear, specific call-to-action');
      }

      breakdown[criterion] = score;
    });

    // Calculate weighted overall score
    const overall = Object.entries(breakdown).reduce((sum, [criterion, score]) => {
      const weight = criteria.scoring[criterion as keyof typeof criteria.scoring] || 0;
      return sum + (score * weight / 100);
    }, 0);

    return { overall: Math.round(overall), breakdown, suggestions };
  };

  // Feature 4: Smart Repurposing Engine
  const generateRepurposedContent = (script: GeneratedScript) => {
    const baseScript = script.fullScript;

    const repurposed: Record<string, string> = {
      'Instagram Reel': formatForInstagram(baseScript),
      'TikTok': formatForTikTok(baseScript),
      'YouTube Short': formatForYouTubeShort(baseScript),
      'LinkedIn Post': formatForLinkedIn(baseScript),
      'Twitter Thread': formatForTwitterThread(baseScript),
    };

    setRepurposedContent(repurposed);
  };

  const formatForInstagram = (script: string) => {
    return `📱 INSTAGRAM REEL SCRIPT:\n\n${script}\n\n---\nCAPTION:\n${script.split('\n')[0]}\n\n${script.split('\n').slice(-2).join('\n')}\n\n#contentpreneur #creatoreconomy #southafrica`;
  };

  const formatForTikTok = (script: string) => {
    return `🎵 TIKTOK SCRIPT:\n\n${script}\n\n---\nON-SCREEN TEXT:\n• ${script.split('\n')[0]}\n• "You understand? Because you understand."\n\n#contentcreator #businesstiktok #entrepreneurship`;
  };

  const formatForYouTubeShort = (script: string) => {
    return `▶️ YOUTUBE SHORT SCRIPT:\n\n${script}\n\n---\nTITLE:\n${script.split('\n')[0]}\n\nDESCRIPTION:\nFull breakdown in comments 👇\n\n#shorts #contentcreator #entrepreneurship`;
  };

  const formatForLinkedIn = (script: string) => {
    const lines = script.split('\n').filter(Boolean);
    return `💼 LINKEDIN POST:\n\n${lines[0]}\n\n${lines.slice(1, -1).join('\n\n')}\n\n---\n\n${lines[lines.length - 1]}\n\n#ContentMarketing #CreatorEconomy #Entrepreneurship`;
  };

  const formatForTwitterThread = (script: string) => {
    const lines = script.split('\n').filter(Boolean);
    let thread = '🧵 TWITTER THREAD:\n\n';
    lines.forEach((line, idx) => {
      if (line.length > 0) {
        thread += `${idx + 1}/ ${line}\n\n`;
      }
    });
    return thread;
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles size={32} />
          <h1 className="text-4xl font-bold">Content Creation Weapon</h1>
        </div>
        <p className="text-lg opacity-90">Turn 22 hours of content work into 30 minutes. 2000x productivity multiplier.</p>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h2 className="text-2xl font-bold mb-6">Step 1: Input Your Content Goal</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">What problem are you solving?</label>
            <textarea
              value={input.problem}
              onChange={(e) => setInput({ ...input, problem: e.target.value })}
              placeholder="E.g., Students struggling to monetize their following..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Duration (seconds)</label>
            <input
              type="number"
              value={input.duration}
              onChange={(e) => setInput({ ...input, duration: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              min={15}
              max={90}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Platform</label>
            <select
              value={input.platform}
              onChange={(e) => setInput({ ...input, platform: e.target.value as Platform })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option>Instagram Reel</option>
              <option>TikTok</option>
              <option>YouTube Short</option>
              <option>LinkedIn Post</option>
              <option>Twitter Thread</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">SEEDS Stage</label>
            <select
              value={input.seedsStage}
              onChange={(e) => setInput({ ...input, seedsStage: e.target.value as SEEDSStage })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option>Signal</option>
              <option>Engagement</option>
              <option>Education</option>
              <option>Decision</option>
              <option>Success</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Goal</label>
            <input
              type="text"
              value={input.goal}
              onChange={(e) => setInput({ ...input, goal: e.target.value })}
              placeholder="E.g., Get 100 new email subscribers"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <button
          onClick={findTopHooks}
          disabled={!input.problem}
          className="mt-6 w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 font-medium flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <Zap size={20} />
          Find Top Hooks
        </button>
      </div>

      {/* Top 3 Hooks */}
      {topHooks.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-2xl font-bold mb-6">Step 2: Select Your Hook</h2>
          <div className="space-y-4">
            {topHooks.map((hook, idx) => (
              <div
                key={idx}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedHook?.hook === hook.hook
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
                onClick={() => generateScript(hook)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-purple-600">#{idx + 1}</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                      {hook.match_score}% Match
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">{hook.type}</span>
                </div>
                <p className="text-lg font-medium mb-2">{hook.hook}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>🎯 Destroys: {hook.objection}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generated Script */}
      {isGenerating && (
        <div className="bg-white rounded-lg p-12 shadow-md text-center">
          <RefreshCw className="animate-spin mx-auto mb-4 text-purple-600" size={48} />
          <p className="text-xl font-medium">Generating your script...</p>
          <p className="text-gray-600">Matching story, weaving framework, optimizing for SEEDS...</p>
        </div>
      )}

      {generatedScript && !isGenerating && (
        <>
          {/* Script Output */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Step 3: Your Generated Script</h2>
              <button
                onClick={() => copyToClipboard(generatedScript.fullScript, 'script')}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                {copied === 'script' ? <CheckCircle size={20} /> : <Copy size={20} />}
                {copied === 'script' ? 'Copied!' : 'Copy Script'}
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
                {generatedScript.fullScript}
              </pre>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Hook:</span>
                <p className="font-medium truncate">{generatedScript.hook.substring(0, 40)}...</p>
              </div>
              <div>
                <span className="text-gray-600">Story:</span>
                <p className="font-medium">{generatedScript.story}</p>
              </div>
              <div>
                <span className="text-gray-600">Framework:</span>
                <p className="font-medium">{generatedScript.framework.includes('PAIDS') ? 'PAIDS' : generatedScript.framework.includes('4E') ? '4E' : 'None'}</p>
              </div>
            </div>
          </div>

          {/* SEEDS Score */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-2xl font-bold mb-6">SEEDS Optimization Score</h2>

            <div className="flex items-center gap-4 mb-6">
              <div className="text-center">
                <div className={`text-6xl font-bold ${
                  generatedScript.seedsScore.overall >= 80 ? 'text-green-600' :
                  generatedScript.seedsScore.overall >= 70 ? 'text-yellow-600' :
                  'text-orange-600'
                }`}>
                  {generatedScript.seedsScore.overall}
                </div>
                <p className="text-sm text-gray-600">Overall Score</p>
              </div>

              <div className="flex-1">
                <div className="space-y-2">
                  {Object.entries(generatedScript.seedsScore.breakdown).map(([criterion, score]) => (
                    <div key={criterion}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize">{criterion.replace(/_/g, ' ')}</span>
                        <span className="font-medium">{score}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            score >= 80 ? 'bg-green-500' :
                            score >= 70 ? 'bg-yellow-500' :
                            'bg-orange-500'
                          }`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {generatedScript.seedsScore.suggestions.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold mb-2 text-yellow-900">💡 Improvement Suggestions:</h3>
                <ul className="space-y-1 text-sm text-yellow-800">
                  {generatedScript.seedsScore.suggestions.map((suggestion, idx) => (
                    <li key={idx}>• {suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Repurposed Content */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-2xl font-bold mb-6">Step 4: Repurposed for 5+ Platforms</h2>
            <div className="space-y-4">
              {Object.entries(repurposedContent).map(([platform, content]) => (
                <div key={platform} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">{platform}</h3>
                    <button
                      onClick={() => copyToClipboard(content, platform)}
                      className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                      {copied === platform ? <CheckCircle size={16} /> : <Copy size={16} />}
                      {copied === platform ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 bg-gray-50 p-3 rounded max-h-64 overflow-y-auto">
                    {content}
                  </pre>
                </div>
              ))}
            </div>
          </div>

          {/* Success Message */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-6 text-white text-center">
            <CheckCircle className="mx-auto mb-3" size={48} />
            <h3 className="text-2xl font-bold mb-2">Content Created Successfully! 🎉</h3>
            <p className="text-lg opacity-90">
              What would've taken 4+ hours is now done in 30 seconds.
            </p>
            <p className="mt-2 font-medium">You understand? Because you understand.</p>
          </div>
        </>
      )}

      {/* Footer */}
      <div className="text-center text-gray-600 py-6">
        <p className="font-medium">For children's children 🇿🇦</p>
      </div>
    </div>
  );
}
