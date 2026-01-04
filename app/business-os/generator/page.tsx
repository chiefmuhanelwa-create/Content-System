'use client';

import { useState } from 'react';
import { Sparkles, Zap, Target, RefreshCw, Copy, CheckCircle, Film, AlertCircle, TrendingUp, Award, Heart } from 'lucide-react';
import {
  HOOK_LIBRARY,
  STORY_BANK,
  SEEDS_CRITERIA,
  FRAMEWORKS,
  SIGNATURE_PHRASES,
  CTA_LIBRARY,
  PORTABLE_PROVERBS,
  UBUNTU_PHRASES,
  KINGDOM_PARADOXES,
  SENSORY_TEMPLATES,
  TRANSITION_BRIDGES,
  OPEN_ENDINGS,
  TRIPLE_PATTERNS,
  NESTED_STORY_ELEMENTS,
} from '@/lib/content-data';

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

interface ScriptSection {
  timestamp: string;
  part: string;
  content: string;
  psychological_principle: string;
}

interface ProductionNotes {
  broll_suggestions: string[];
  music_mood: string;
  text_overlays: string[];
  visual_style: string;
}

interface GeneratedScript {
  hook: string;
  story: string;
  framework: string;
  cta: string;
  fullScript: string;
  sections: ScriptSection[];
  productionNotes: ProductionNotes;
  seedsScore: {
    overall: number;
    breakdown: Record<string, number>;
    suggestions: string[];
  };
  alternativeHooks: string[];
  performancePrediction: {
    estimated_view_rate: string;
    estimated_engagement: string;
    conversion_likelihood: string;
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
  const [showProductionNotes, setShowProductionNotes] = useState(false);

  // Enhanced Hook Selector with 7 hook types
  const findTopHooks = () => {
    const allHooks = [
      ...HOOK_LIBRARY.results,
      ...HOOK_LIBRARY.shocking,
      ...HOOK_LIBRARY.vulnerability,
      ...HOOK_LIBRARY.framework,
      ...HOOK_LIBRARY.contrarian,
      ...HOOK_LIBRARY.curiosity,
    ];

    const scoredHooks = allHooks.map((hook) => {
      let score = hook.match_score;

      if (input.problem) {
        const problemWords = input.problem.toLowerCase().split(' ');
        const objectionWords = hook.objection.toLowerCase();
        const matches = problemWords.filter(word =>
          word.length > 3 && objectionWords.includes(word)
        );
        score += matches.length * 5;

        if (objectionWords.includes(input.problem.toLowerCase())) {
          score += 15;
        }
      }

      if (input.seedsStage === 'Signal') {
        if (hook.type.includes('Results') || hook.type.includes('Specific Number')) score += 15;
        if (hook.type.includes('Shock')) score += 12;
      } else if (input.seedsStage === 'Engagement') {
        if (hook.type.includes('Vulnerability') || hook.type.includes('Humble')) score += 15;
        if (hook.type.includes('Transformation')) score += 10;
      } else if (input.seedsStage === 'Education') {
        if (hook.type.includes('Framework')) score += 15;
        if (hook.type.includes('System')) score += 12;
      } else if (input.seedsStage === 'Decision') {
        if (hook.type.includes('Comparison') || hook.type.includes('Truth-bomb')) score += 15;
        if (hook.type.includes('Pivotal')) score += 10;
      }

      if (input.platform === 'LinkedIn Post' && hook.type.includes('Framework')) score += 8;
      if ((input.platform === 'TikTok' || input.platform === 'Instagram Reel') && hook.type.includes('Shock')) score += 8;

      return { ...hook, match_score: Math.min(score, 100) };
    });

    const top3 = scoredHooks
      .sort((a, b) => b.match_score - a.match_score)
      .slice(0, 3);

    setTopHooks(top3);
    setSelectedHook(null);
    setGeneratedScript(null);
    setRepurposedContent({});
  };

  const generateScript = (hook: SelectedHook) => {
    setIsGenerating(true);
    setSelectedHook(hook);

    setTimeout(() => {
      let selectedStoryKey: keyof typeof STORY_BANK = "R23K-affiliate";

      const objectionLower = hook.objection.toLowerCase();
      if (objectionLower.includes('platform') || objectionLower.includes('dependency')) {
        selectedStoryKey = "platform-loss";
      } else if (objectionLower.includes('equipment') || objectionLower.includes('investment') || objectionLower.includes('cost')) {
        selectedStoryKey = "r6k-decision";
      } else if (objectionLower.includes('starting') || objectionLower.includes('nothing') || objectionLower.includes('scratch')) {
        selectedStoryKey = "bathroom-floor";
      } else if (objectionLower.includes('low') || objectionLower.includes('rate') || objectionLower.includes('exploitation')) {
        selectedStoryKey = "r350-exploitation";
      } else if (objectionLower.includes('time') || objectionLower.includes('quality')) {
        selectedStoryKey = "4-hours-60-seconds";
      } else if (objectionLower.includes('income') || objectionLower.includes('potential') || objectionLower.includes('monetiz')) {
        selectedStoryKey = "R23K-affiliate";
      }

      const selectedStory = STORY_BANK[selectedStoryKey];

      let frameworkName = '';
      let frameworkContent = '';

      if (input.seedsStage === 'Education' || input.seedsStage === 'Decision') {
        const frameworks = ['PAIDS', '4E', 'MSTSSS'];
        const selectedFrameworkKey = frameworks[Math.floor(Math.random() * frameworks.length)];

        if (selectedFrameworkKey === 'PAIDS') {
          frameworkName = 'PAIDS';
          frameworkContent = FRAMEWORKS.PAIDS.integration_templates[Math.floor(Math.random() * FRAMEWORKS.PAIDS.integration_templates.length)];
        } else if (selectedFrameworkKey === '4E') {
          frameworkName = '4E';
          frameworkContent = FRAMEWORKS["4E"].integration_templates[0];
        } else {
          frameworkName = 'MS×TS×SS';
          frameworkContent = FRAMEWORKS.MSTSSS.integration_templates[0];
        }
      }

      const signaturePhrase = SIGNATURE_PHRASES[Math.floor(Math.random() * SIGNATURE_PHRASES.length)];

      let ctaContent = '';
      if (input.seedsStage === 'Signal') {
        ctaContent = CTA_LIBRARY.follow[Math.floor(Math.random() * CTA_LIBRARY.follow.length)].cta;
      } else if (input.seedsStage === 'Engagement') {
        ctaContent = CTA_LIBRARY.follow[0].cta;
      } else if (input.seedsStage === 'Education') {
        ctaContent = CTA_LIBRARY.email[Math.floor(Math.random() * CTA_LIBRARY.email.length)].cta;
      } else if (input.seedsStage === 'Decision') {
        ctaContent = CTA_LIBRARY.lead_magnet[Math.floor(Math.random() * CTA_LIBRARY.lead_magnet.length)].cta;
      } else {
        ctaContent = "Share this with a creator who needs to hear it. Tag them below.";
      }

      const sections: ScriptSection[] = [];

      const hookSection = hook.hook;
      sections.push({
        timestamp: '0:00-0:03',
        part: '1. HOOK',
        content: hookSection,
        psychological_principle: 'Pattern Interrupt + Curiosity Gap'
      });

      const transitionSection = TRANSITION_BRIDGES[Math.floor(Math.random() * TRANSITION_BRIDGES.length)];
      sections.push({
        timestamp: '0:03-0:05',
        part: '2. TRANSITION',
        content: transitionSection,
        psychological_principle: 'Bridge + Acknowledgment'
      });

      const problemAgitations = {
        'income': `${SENSORY_TEMPLATES.checking_bank.sight} ${SENSORY_TEMPLATES.checking_bank.sound}\n${SENSORY_TEMPLATES.checking_bank.emotion}\n\n${TRIPLE_PATTERNS.problem_stack[0]}\n\nYou're charging peanuts for brand deals when you should be making real money. And you're exhausted.`,
        'platform': "You've built everything on Instagram. 100K followers. Years of work. But you don't own any of it.\n\nOne policy change. One algorithm shift. One suspension—and it's all gone.\n\nYou're building on rented land. And the landlord can evict you tomorrow.",
        'starting': "You see other creators succeeding and think:\n'I'm too late.'\n'I don't have the equipment.'\n'I don't have the audience.'\n\nSo you stay stuck. Scrolling. Wishing instead of building.",
        'investment': "Everyone says you need the expensive camera. The ring light. The studio.\n\nSo you wait. Save up. Tell yourself:\n'When I have R50K for equipment, THEN I'll start.'\n\nMeanwhile, opportunities pass you by.",
        'time': `${SENSORY_TEMPLATES.checking_bank.internal}\n\n2 AM. Eyes burning from screen glare. Seventh edit of the same 60-second video.\n\n${TRIPLE_PATTERNS.problem_stack[2]}\n\nYou're working creator hours but making minimum wage.`,
        'monetization': `${TRIPLE_PATTERNS.problem_stack[1]}\n\nBrands ghosting you. No clear path from views to Rands.\n\nYou're an influencer, not a business owner.`
      };

      let problemSection = problemAgitations['income'];
      Object.keys(problemAgitations).forEach(key => {
        if (objectionLower.includes(key)) {
          problemSection = problemAgitations[key as keyof typeof problemAgitations];
        }
      });

      sections.push({
        timestamp: '0:05-0:15',
        part: '3. PROBLEM AGITATION',
        content: problemSection,
        psychological_principle: 'Mirror Neurons + Emotional Amplification'
      });

      const storySection = selectedStory.script;
      sections.push({
        timestamp: '0:15-0:40',
        part: '4. STORY',
        content: storySection,
        psychological_principle: `Transformation Arc (${selectedStory.emotional_arc})`
      });

      const portableProverb = PORTABLE_PROVERBS[selectedStoryKey as keyof typeof PORTABLE_PROVERBS];

      let frameworkSection = '';
      if (frameworkContent) {
        frameworkSection = `${frameworkContent}\n\nThat's the system. Not luck. Not chance. A framework you can follow.\n\n${portableProverb}`;
      } else {
        frameworkSection = `The lesson? Your starting point doesn't determine your ending. Your system does.\n\nBuild infrastructure, not just content.\n\n${portableProverb}`;
      }

      sections.push({
        timestamp: '0:40-0:50',
        part: '5. FRAMEWORK/SOLUTION',
        content: frameworkSection,
        psychological_principle: 'Reciprocity + Pattern Recognition'
      });

      const openEndingQuestion = OPEN_ENDINGS[Math.floor(Math.random() * OPEN_ENDINGS.length)];
      const ubuntuPhrase = UBUNTU_PHRASES[Math.floor(Math.random() * UBUNTU_PHRASES.length)];

      const enhancedCTA = `${openEndingQuestion}\n\n${ctaContent}\n\n${ubuntuPhrase.call} ${ubuntuPhrase.response}`;

      sections.push({
        timestamp: '0:50-0:58',
        part: '6. CTA',
        content: enhancedCTA,
        psychological_principle: 'Invitation + Ubuntu + Participation'
      });

      const closerSection = `${signaturePhrase}\n\nFor children's children. 🇿🇦`;
      sections.push({
        timestamp: '0:58-1:00',
        part: '7. CLOSER',
        content: closerSection,
        psychological_principle: 'Identity Seal + Brand Recognition'
      });

      const fullScript = sections.map(s => s.content).join('\n\n');

      const productionNotes: ProductionNotes = {
        broll_suggestions: [
          "Opening: Close-up of phone showing notifications/numbers",
          "Problem section: Show creator editing late at night, tired",
          "Story section: Visual recreation of key moment (bathroom floor, phone purchase, etc.)",
          "Framework section: Animated text showing framework breakdown",
          "CTA section: Show link in bio click animation"
        ],
        music_mood: input.seedsStage === 'Engagement' ? 'Emotional, inspiring' : input.seedsStage === 'Education' ? 'Upbeat, confident' : 'Energetic, attention-grabbing',
        text_overlays: [
          hookSection,
          `"${selectedStory.title}"`,
          frameworkName ? `The ${frameworkName} System` : 'The Framework',
          signaturePhrase
        ],
        visual_style: input.platform === 'LinkedIn Post' ? 'Professional, clean graphics' : 'Dynamic cuts, bold text, fast-paced'
      };

      const seedsScore = calculateAdvancedSEEDSScore(sections, input.seedsStage, frameworkName);

      const alternativeHooks = topHooks
        .filter(h => h.hook !== hook.hook)
        .map(h => h.hook);

      const performancePrediction = {
        estimated_view_rate: seedsScore.overall >= 85 ? '15-25% of followers' : seedsScore.overall >= 75 ? '10-15% of followers' : '5-10% of followers',
        estimated_engagement: seedsScore.overall >= 85 ? '8-12%' : seedsScore.overall >= 75 ? '5-8%' : '3-5%',
        conversion_likelihood: input.seedsStage === 'Decision' || input.seedsStage === 'Education' ? 'High (2-5%)' : input.seedsStage === 'Engagement' ? 'Medium (1-2%)' : 'Low (0.5-1%)'
      };

      const generated: GeneratedScript = {
        hook: hookSection,
        story: selectedStory.title,
        framework: frameworkName || 'Story-driven',
        cta: ctaContent,
        fullScript,
        sections,
        productionNotes,
        seedsScore,
        alternativeHooks,
        performancePrediction,
      };

      setGeneratedScript(generated);
      generateRepurposedContent(generated);
      setIsGenerating(false);
    }, 1500);
  };

  const calculateAdvancedSEEDSScore = (sections: ScriptSection[], stage: SEEDSStage, framework: string) => {
    const criteria = SEEDS_CRITERIA[stage];
    const breakdown: Record<string, number> = {};
    const suggestions: string[] = [];

    const hookContent = sections[0].content;
    let hookScore = 70;
    if (/R\d{1,3}[,\d]*/.test(hookContent)) hookScore += 15;
    if (hookContent.split(' ').length <= 15) hookScore += 10;
    if (/\d+/.test(hookContent)) hookScore += 5;
    breakdown['hook_strength'] = Math.min(hookScore, 100);
    if (hookScore < 80) suggestions.push('Hook could be more specific with concrete numbers');

    const storyContent = sections.find(s => s.part === '4. STORY')?.content || '';
    let storyScore = 75;
    if (storyContent.length > 200) storyScore += 10;
    if (storyContent.includes('I')) storyScore += 10;
    if (/20\d{2}/.test(storyContent)) storyScore += 5;
    breakdown['story_quality'] = Math.min(storyScore, 100);
    if (storyScore < 80) suggestions.push('Story could benefit from more sensory details and specific dates');

    let frameworkScore = framework ? 85 : 60;
    if (framework === 'PAIDS' || framework === '4E' || framework === 'MS×TS×SS') frameworkScore = 95;
    breakdown['framework_clarity'] = frameworkScore;
    if (frameworkScore < 80) suggestions.push('Consider integrating a clear framework (PAIDS, 4E, or MS×TS×SS)');

    const ctaContent = sections.find(s => s.part === '6. CTA')?.content || '';
    let ctaScore = 70;
    if (ctaContent.includes('Link in bio') || ctaContent.includes('bio')) ctaScore += 15;
    if (ctaContent.includes('Follow') || ctaContent.includes('Join')) ctaScore += 10;
    if (/\d+[,\d]*/.test(ctaContent)) ctaScore += 5;
    breakdown['cta_clarity'] = Math.min(ctaScore, 100);
    if (ctaScore < 80) suggestions.push('CTA could be more specific with clear action and social proof');

    let vulnerabilityScore = 80;
    if (storyContent.toLowerCase().includes('broke') || storyContent.toLowerCase().includes('struggle')) vulnerabilityScore += 10;
    if (storyContent.toLowerCase().includes('i thought') || storyContent.toLowerCase().includes('i felt')) vulnerabilityScore += 10;
    breakdown['authenticity'] = Math.min(vulnerabilityScore, 100);

    const weights = criteria.scoring;
    let overall = 0;

    Object.keys(weights).forEach(criterion => {
      const weight = weights[criterion as keyof typeof weights];
      const score = breakdown[criterion] || breakdown['authenticity'] || 75;
      overall += score * (weight / 100);
    });

    return {
      overall: Math.round(overall),
      breakdown,
      suggestions: suggestions.length > 0 ? suggestions : ['Script is well-optimized! Consider testing alternative hooks.']
    };
  };

  const generateRepurposedContent = (script: GeneratedScript) => {
    const baseScript = script.fullScript;

    const repurposed: Record<string, string> = {
      'Instagram Reel': formatForInstagram(baseScript, script.hook),
      'TikTok': formatForTikTok(baseScript, script.hook),
      'YouTube Short': formatForYouTubeShort(baseScript, script.hook),
      'LinkedIn Post': formatForLinkedIn(baseScript, script.hook),
      'Twitter Thread': formatForTwitterThread(baseScript),
    };

    setRepurposedContent(repurposed);
  };

  const formatForInstagram = (script: string, hook: string) => {
    return `📱 INSTAGRAM REEL SCRIPT:\n\n${script}\n\n---\nCAPTION:\n${hook}\n\n${script.split('\n').slice(-3).join('\n')}\n\n#contentpreneur #creatoreconomy #southafrica #contentcreator #entrepreneurship`;
  };

  const formatForTikTok = (script: string, hook: string) => {
    return `🎵 TIKTOK SCRIPT:\n\n${script}\n\n---\nON-SCREEN TEXT:\n• ${hook}\n• "You understand? Because you understand."\n• "For children's children 🇿🇦"\n\n#contentcreator #businesstiktok #entrepreneurship #creatoreconomy`;
  };

  const formatForYouTubeShort = (script: string, hook: string) => {
    return `▶️ YOUTUBE SHORT SCRIPT:\n\n${script}\n\n---\nTITLE:\n${hook}\n\nDESCRIPTION:\nFull breakdown in comments 👇\n\n${script.split('\n')[0]}\n\n#shorts #contentcreator #entrepreneurship`;
  };

  const formatForLinkedIn = (script: string, hook: string) => {
    const lines = script.split('\n\n').filter(Boolean);
    return `💼 LINKEDIN POST:\n\n${hook}\n\n${lines.slice(1, 4).join('\n\n')}\n\n---\n\n${lines[lines.length - 1]}\n\n#ContentMarketing #CreatorEconomy #Entrepreneurship #ContentStrategy`;
  };

  const formatForTwitterThread = (script: string) => {
    const sections = script.split('\n\n').filter(Boolean);
    let thread = '🧵 TWITTER THREAD:\n\n';
    sections.forEach((section, idx) => {
      if (section.length > 0 && section.length < 280) {
        thread += `${idx + 1}/ ${section}\n\n`;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Hero Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 rounded-3xl p-12 shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Sparkles className="text-white" size={40} />
              </div>
              <div>
                <h1 className="text-5xl font-bold text-white mb-2">AI Content Creation Weapon</h1>
                <p className="text-purple-100 text-xl">Turn 22 hours into 30 minutes • 2000x productivity multiplier</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mt-6">
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                ✨ Jesus Parables
              </span>
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                🌍 Ubuntu Wisdom
              </span>
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                🧠 Neuroscience
              </span>
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                🎯 6-Part Architecture
              </span>
            </div>
          </div>
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-white px-8 py-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Step 1: Define Your Content Goal</h2>
            <p className="text-gray-600 mt-1">Tell us what problem you're solving and we'll generate the perfect script</p>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-3">What problem are you solving?</label>
                <textarea
                  value={input.problem}
                  onChange={(e) => setInput({ ...input, problem: e.target.value })}
                  placeholder="E.g., Creators struggling to monetize their following..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Duration (seconds)</label>
                <input
                  type="number"
                  value={input.duration}
                  onChange={(e) => setInput({ ...input, duration: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900"
                  min={15}
                  max={90}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Platform</label>
                <select
                  value={input.platform}
                  onChange={(e) => setInput({ ...input, platform: e.target.value as Platform })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 bg-white"
                >
                  <option>Instagram Reel</option>
                  <option>TikTok</option>
                  <option>YouTube Short</option>
                  <option>LinkedIn Post</option>
                  <option>Twitter Thread</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">SEEDS Stage</label>
                <select
                  value={input.seedsStage}
                  onChange={(e) => setInput({ ...input, seedsStage: e.target.value as SEEDSStage })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 bg-white"
                >
                  <option value="Signal">Signal (Get Attention)</option>
                  <option value="Engagement">Engagement (Build Trust)</option>
                  <option value="Education">Education (Provide Value)</option>
                  <option value="Decision">Decision (Invite Purchase)</option>
                  <option value="Success">Success (Celebrate Wins)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Content Goal</label>
                <input
                  type="text"
                  value={input.goal}
                  onChange={(e) => setInput({ ...input, goal: e.target.value })}
                  placeholder="E.g., Get 100 new email subscribers"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

            <button
              onClick={findTopHooks}
              disabled={!input.problem}
              className="mt-8 w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl hover:from-purple-700 hover:to-indigo-700 font-semibold text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
            >
              <Zap size={24} />
              Find Top 3 Hooks (AI-Powered)
            </button>
          </div>
        </div>

        {/* Top 3 Hooks */}
        {topHooks.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-white px-8 py-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Step 2: Select Your Hook</h2>
              <p className="text-gray-600 mt-1">AI-ranked hooks based on your problem and SEEDS stage</p>
            </div>

            <div className="p-8 space-y-4">
              {topHooks.map((hook, idx) => (
                <div
                  key={idx}
                  className={`group cursor-pointer transition-all duration-300 ${
                    selectedHook?.hook === hook.hook
                      ? 'bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-500 shadow-lg scale-[1.02]'
                      : 'bg-white border-2 border-gray-200 hover:border-purple-300 hover:shadow-lg hover:scale-[1.01]'
                  } rounded-xl p-6`}
                  onClick={() => generateScript(hook)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`text-3xl font-bold ${selectedHook?.hook === hook.hook ? 'text-purple-600' : 'text-gray-400 group-hover:text-purple-500'}`}>
                        #{idx + 1}
                      </div>
                      <div className="px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                        {hook.match_score}% Match
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                      {hook.type}
                    </span>
                  </div>
                  <p className="text-lg font-medium text-gray-900 mb-3 leading-relaxed">{hook.hook}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Target size={16} className="text-purple-500" />
                    <span className="font-medium">Destroys objection:</span>
                    <span>{hook.objection}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Generating State */}
        {isGenerating && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-16 text-center">
            <RefreshCw className="animate-spin mx-auto mb-6 text-purple-600" size={64} />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Generating Your Perfect Script...</h3>
            <p className="text-gray-600 text-lg">Applying eternal storytelling principles • Weaving frameworks • Optimizing for SEEDS...</p>
            <div className="mt-8 flex justify-center gap-4">
              <div className="px-4 py-2 bg-purple-50 rounded-lg text-purple-700 text-sm font-medium">Jesus Parables ✓</div>
              <div className="px-4 py-2 bg-indigo-50 rounded-lg text-indigo-700 text-sm font-medium">Ubuntu Wisdom ✓</div>
              <div className="px-4 py-2 bg-pink-50 rounded-lg text-pink-700 text-sm font-medium">Neuroscience ✓</div>
            </div>
          </div>
        )}

        {/* Generated Script */}
        {generatedScript && !isGenerating && (
          <>
            {/* Script Output */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-8 py-6 border-b border-green-200 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Step 3: Your AI-Generated Script</h2>
                  <p className="text-gray-600 mt-1">Complete 6-part architecture with psychological triggers</p>
                </div>
                <button
                  onClick={() => copyToClipboard(generatedScript.fullScript, 'script')}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  {copied === 'script' ? <CheckCircle size={20} /> : <Copy size={20} />}
                  {copied === 'script' ? 'Copied!' : 'Copy Script'}
                </button>
              </div>

              <div className="p-8 space-y-6">
                {generatedScript.sections.map((section, idx) => (
                  <div key={idx} className="bg-gradient-to-r from-gray-50 to-white border-l-4 border-purple-500 rounded-r-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-mono font-bold">
                          {section.timestamp}
                        </span>
                        <span className="font-bold text-gray-900 text-lg">{section.part}</span>
                      </div>
                      <span className="text-xs text-gray-500 italic bg-gray-100 px-3 py-1 rounded-full">
                        {section.psychological_principle}
                      </span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{section.content}</p>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-8 py-6 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <span className="text-gray-600 text-sm font-medium block mb-2">Story Used:</span>
                    <p className="font-bold text-blue-700 text-lg">{generatedScript.story}</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <span className="text-gray-600 text-sm font-medium block mb-2">Framework:</span>
                    <p className="font-bold text-green-700 text-lg">{generatedScript.framework}</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <span className="text-gray-600 text-sm font-medium block mb-2">SEEDS Stage:</span>
                    <p className="font-bold text-purple-700 text-lg">{input.seedsStage}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Production Notes */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-8 py-6 border-b border-orange-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Film size={28} className="text-orange-600" />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Production Notes</h2>
                    <p className="text-gray-600 text-sm">Complete filming guide for your script</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowProductionNotes(!showProductionNotes)}
                  className="px-6 py-2 bg-white border-2 border-orange-200 text-orange-700 rounded-lg hover:bg-orange-50 font-semibold transition-all"
                >
                  {showProductionNotes ? 'Hide' : 'Show'} Notes
                </button>
              </div>

              {showProductionNotes && (
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl border border-purple-100">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Film size={20} className="text-purple-600" />
                      B-Roll Suggestions:
                    </h3>
                    <ul className="space-y-3">
                      {generatedScript.productionNotes.broll_suggestions.map((suggestion, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                          <span className="text-purple-600 font-bold mt-1">•</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Sparkles size={20} className="text-blue-600" />
                      Text Overlays:
                    </h3>
                    <ul className="space-y-3">
                      {generatedScript.productionNotes.text_overlays.map((overlay, idx) => (
                        <li key={idx} className="bg-white p-3 rounded-lg shadow-sm border border-blue-100 font-mono text-xs text-gray-700">
                          {overlay}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl border border-green-100">
                    <h3 className="font-bold text-gray-900 mb-4">Music Mood:</h3>
                    <p className="text-gray-700 bg-white p-4 rounded-lg shadow-sm border border-green-100">
                      {generatedScript.productionNotes.music_mood}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-pink-50 to-white p-6 rounded-xl border border-pink-100">
                    <h3 className="font-bold text-gray-900 mb-4">Visual Style:</h3>
                    <p className="text-gray-700 bg-white p-4 rounded-lg shadow-sm border border-pink-100">
                      {generatedScript.productionNotes.visual_style}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Performance Prediction */}
            <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl p-8 shadow-2xl">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <TrendingUp size={28} />
                  AI Performance Prediction
                </h3>
                <div className="grid grid-cols-3 gap-6">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center">
                    <p className="text-white/80 text-sm mb-2 font-medium">Est. View Rate</p>
                    <p className="text-3xl font-bold text-white">{generatedScript.performancePrediction.estimated_view_rate}</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center">
                    <p className="text-white/80 text-sm mb-2 font-medium">Est. Engagement</p>
                    <p className="text-3xl font-bold text-white">{generatedScript.performancePrediction.estimated_engagement}</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center">
                    <p className="text-white/80 text-sm mb-2 font-medium">Conversion Likelihood</p>
                    <p className="text-3xl font-bold text-white">{generatedScript.performancePrediction.conversion_likelihood}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* SEEDS Score */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-8 py-6 border-b border-purple-200">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <Award size={28} className="text-purple-600" />
                  SEEDS Optimization Score
                </h2>
              </div>

              <div className="p-8">
                <div className="flex items-start gap-8 mb-8">
                  <div className="text-center">
                    <div className={`text-7xl font-black mb-3 ${
                      generatedScript.seedsScore.overall >= 85 ? 'bg-gradient-to-br from-green-500 to-emerald-600' :
                      generatedScript.seedsScore.overall >= 75 ? 'bg-gradient-to-br from-yellow-500 to-orange-500' :
                      generatedScript.seedsScore.overall >= 65 ? 'bg-gradient-to-br from-orange-500 to-red-500' :
                      'bg-gradient-to-br from-red-500 to-rose-600'
                    } bg-clip-text text-transparent`}>
                      {generatedScript.seedsScore.overall}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-gray-600">Overall Score</p>
                      <p className={`text-xs font-bold px-3 py-1 rounded-full inline-block ${
                        generatedScript.seedsScore.overall >= 85 ? 'bg-green-100 text-green-700' :
                        generatedScript.seedsScore.overall >= 75 ? 'bg-yellow-100 text-yellow-700' :
                        generatedScript.seedsScore.overall >= 65 ? 'bg-orange-100 text-orange-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {generatedScript.seedsScore.overall >= 85 ? 'Excellent' :
                         generatedScript.seedsScore.overall >= 75 ? 'Good' :
                         generatedScript.seedsScore.overall >= 65 ? 'Fair' : 'Needs Work'}
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    {Object.entries(generatedScript.seedsScore.breakdown).map(([criterion, score]) => (
                      <div key={criterion}>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="capitalize font-semibold text-gray-700">{criterion.replace(/_/g, ' ')}</span>
                          <span className="font-bold text-gray-900">{score}/100</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div
                            className={`h-3 rounded-full transition-all duration-500 ${
                              score >= 85 ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                              score >= 75 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                              score >= 65 ? 'bg-gradient-to-r from-orange-500 to-red-500' :
                              'bg-gradient-to-r from-red-500 to-rose-600'
                            }`}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {generatedScript.seedsScore.suggestions.length > 0 && (
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-6">
                    <h3 className="font-bold text-yellow-900 mb-4 flex items-center gap-2">
                      <AlertCircle size={20} />
                      Optimization Suggestions:
                    </h3>
                    <ul className="space-y-2">
                      {generatedScript.seedsScore.suggestions.map((suggestion, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-yellow-800">
                          <span className="text-yellow-600 font-bold">•</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Alternative Hooks */}
            {generatedScript.alternativeHooks.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-8 py-6 border-b border-indigo-200">
                  <h3 className="text-xl font-bold text-gray-900">Alternative Hook Options (A/B Test)</h3>
                  <p className="text-gray-600 text-sm mt-1">Try these variations to optimize performance</p>
                </div>
                <div className="p-8 space-y-4">
                  {generatedScript.alternativeHooks.map((altHook, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all">
                      <span className="text-2xl font-bold text-gray-400">#{idx + 2}</span>
                      <p className="text-gray-700 flex-1">{altHook}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Repurposed Content */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 px-8 py-6 border-b border-teal-200">
                <h2 className="text-2xl font-bold text-gray-900">Step 4: Repurposed for 5+ Platforms</h2>
                <p className="text-gray-600 mt-1">One-click copy for instant cross-platform posting</p>
              </div>

              <div className="p-8 space-y-6">
                {Object.entries(repurposedContent).map(([platform, content]) => (
                  <div key={platform} className="bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-teal-300 transition-all">
                    <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
                      <h3 className="font-bold text-gray-900 text-lg">{platform}</h3>
                      <button
                        onClick={() => copyToClipboard(content, platform)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:from-teal-700 hover:to-cyan-700 font-semibold shadow-lg hover:shadow-xl transition-all text-sm"
                      >
                        {copied === platform ? <CheckCircle size={16} /> : <Copy size={16} />}
                        {copied === platform ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <div className="p-6">
                      <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 leading-relaxed max-h-80 overflow-y-auto">
                        {content}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Success Message */}
            <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-2xl p-12 text-white text-center shadow-2xl">
              <CheckCircle className="mx-auto mb-6" size={72} />
              <h3 className="text-4xl font-bold mb-4">Content Created Successfully! 🎉</h3>
              <p className="text-xl mb-3 text-green-50">
                6-part architecture applied • Psychological principles integrated • Ready to film
              </p>
              <p className="text-lg text-green-100 mb-6">
                What would've taken 4+ hours is done in 30 seconds
              </p>
              <div className="inline-block bg-white/20 backdrop-blur-sm px-8 py-4 rounded-xl">
                <p className="text-2xl font-bold">You understand? Because you understand.</p>
              </div>
            </div>
          </>
        )}

        {/* Footer */}
        <div className="text-center py-12">
          <div className="inline-block bg-white rounded-2xl shadow-lg px-8 py-6 border border-gray-200">
            <Heart className="inline-block text-red-500 mb-2" size={32} />
            <p className="font-bold text-gray-900 text-xl mb-1">For children's children 🇿🇦</p>
            <p className="text-gray-600 text-sm">Ubuntu: I am because we are</p>
          </div>
        </div>
      </div>
    </div>
  );
}
