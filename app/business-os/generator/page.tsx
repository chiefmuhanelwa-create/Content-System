'use client';

import { useState } from 'react';
import { Sparkles, Zap, Target, RefreshCw, Copy, CheckCircle, Film, AlertCircle } from 'lucide-react';
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

    // Advanced matching algorithm
    const scoredHooks = allHooks.map((hook) => {
      let score = hook.match_score;

      // Keyword matching (enhanced)
      if (input.problem) {
        const problemWords = input.problem.toLowerCase().split(' ');
        const objectionWords = hook.objection.toLowerCase();
        const matches = problemWords.filter(word =>
          word.length > 3 && objectionWords.includes(word)
        );
        score += matches.length * 5;

        // Bonus for exact phrase matches
        if (objectionWords.includes(input.problem.toLowerCase())) {
          score += 15;
        }
      }

      // SEEDS stage matching (enhanced)
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

      // Platform optimization
      if (input.platform === 'LinkedIn Post' && hook.type.includes('Framework')) score += 8;
      if ((input.platform === 'TikTok' || input.platform === 'Instagram Reel') && hook.type.includes('Shock')) score += 8;

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

  // Enhanced Script Generation with 6-Part Architecture
  const generateScript = (hook: SelectedHook) => {
    setIsGenerating(true);
    setSelectedHook(hook);

    setTimeout(() => {
      // STEP 1: Select appropriate story (enhanced matching)
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

      // STEP 2: Select framework based on SEEDS stage
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

      // STEP 3: Select signature phrase
      const signaturePhrase = SIGNATURE_PHRASES[Math.floor(Math.random() * SIGNATURE_PHRASES.length)];

      // STEP 4: Select CTA based on SEEDS stage
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

      // STEP 5: Build 6-Part Script Structure with timestamps
      const sections: ScriptSection[] = [];

      // PART 1: HOOK (0:00-0:03)
      const hookSection = hook.hook;
      sections.push({
        timestamp: '0:00-0:03',
        part: '1. HOOK',
        content: hookSection,
        psychological_principle: 'Pattern Interrupt + Curiosity Gap'
      });

      // PART 2: TRANSITION (0:03-0:05) - Jesus Method: Bridge from Familiar to Revolutionary
      const transitionSection = TRANSITION_BRIDGES[Math.floor(Math.random() * TRANSITION_BRIDGES.length)];
      sections.push({
        timestamp: '0:03-0:05',
        part: '2. TRANSITION',
        content: transitionSection,
        psychological_principle: 'Bridge + Acknowledgment'
      });

      // PART 3: PROBLEM AGITATION (0:05-0:15) - Mirror Neurons + Triple Pattern + Sensory Immersion
      const problemAgitations = {
        'income': `${SENSORY_TEMPLATES.checking_bank.sight} ${SENSORY_TEMPLATES.checking_bank.sound}\n${SENSORY_TEMPLATES.checking_bank.emotion}\n\n${TRIPLE_PATTERNS.problem_stack[0]}\n\nYou're charging peanuts for brand deals when you should be making real money. And you're exhausted.`,
        'platform': "You've built everything on Instagram. 100K followers. Years of work. But you don't own any of it.\n\nOne policy change. One algorithm shift. One suspension—and it's all gone.\n\nYou're building on rented land. And the landlord can evict you tomorrow.",
        'starting': "You see other creators succeeding and think:\n'I'm too late.'\n'I don't have the equipment.'\n'I don't have the audience.'\n\nSo you stay stuck. Scrolling. Wishing instead of building.",
        'investment': "Everyone says you need the expensive camera. The ring light. The studio.\n\nSo you wait. Save up. Tell yourself:\n'When I have R50K for equipment, THEN I'll start.'\n\nMeanwhile, opportunities pass you by.",
        'time': `${SENSORY_TEMPLATES.checking_bank.internal}\n\n2 AM. Eyes burning from screen glare. Seventh edit of the same 60-second video.\n\n${TRIPLE_PATTERNS.problem_stack[2]}\n\nYou're working creator hours but making minimum wage.`,
        'monetization': `${TRIPLE_PATTERNS.problem_stack[1]}\n\nBrands ghosting you. No clear path from views to Rands.\n\nYou're an influencer, not a business owner.`
      };

      let problemSection = problemAgitations['income']; // default
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

      // PART 4: STORY (0:15-0:40)
      const storySection = selectedStory.script;
      sections.push({
        timestamp: '0:15-0:40',
        part: '4. STORY',
        content: storySection,
        psychological_principle: `Transformation Arc (${selectedStory.emotional_arc})`
      });

      // PART 5: FRAMEWORK/SOLUTION (0:40-0:50) - Reciprocity + Portable Proverb (African Wisdom)
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

      // PART 6: CTA (0:50-0:58) - Invitation (Not Manipulation) + Ubuntu + Open Ending
      const openEndingQuestion = OPEN_ENDINGS[Math.floor(Math.random() * OPEN_ENDINGS.length)];
      const ubuntuPhrase = UBUNTU_PHRASES[Math.floor(Math.random() * UBUNTU_PHRASES.length)];

      const enhancedCTA = `${openEndingQuestion}\n\n${ctaContent}\n\n${ubuntuPhrase.call} ${ubuntuPhrase.response}`;

      sections.push({
        timestamp: '0:50-0:58',
        part: '6. CTA',
        content: enhancedCTA,
        psychological_principle: 'Invitation + Ubuntu + Participation'
      });

      // PART 7: CLOSER (0:58-1:00)
      const closerSection = `${signaturePhrase}\n\nFor children's children. 🇿🇦`;
      sections.push({
        timestamp: '0:58-1:00',
        part: '7. CLOSER',
        content: closerSection,
        psychological_principle: 'Identity Seal + Brand Recognition'
      });

      // Build full script
      const fullScript = sections.map(s => s.content).join('\n\n');

      // STEP 6: Production Notes
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

      // STEP 7: Enhanced SEEDS Scoring
      const seedsScore = calculateAdvancedSEEDSScore(sections, input.seedsStage, frameworkName);

      // STEP 8: Alternative hooks
      const alternativeHooks = topHooks
        .filter(h => h.hook !== hook.hook)
        .map(h => h.hook);

      // STEP 9: Performance Prediction
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

  // Enhanced SEEDS Scoring
  const calculateAdvancedSEEDSScore = (sections: ScriptSection[], stage: SEEDSStage, framework: string) => {
    const criteria = SEEDS_CRITERIA[stage];
    const breakdown: Record<string, number> = {};
    const suggestions: string[] = [];

    // Hook strength scoring
    const hookContent = sections[0].content;
    let hookScore = 70;
    if (/R\d{1,3}[,\d]*/.test(hookContent)) hookScore += 15; // Contains specific Rand amount
    if (hookContent.split(' ').length <= 15) hookScore += 10; // Concise
    if (/\d+/.test(hookContent)) hookScore += 5; // Contains numbers
    breakdown['hook_strength'] = Math.min(hookScore, 100);
    if (hookScore < 80) suggestions.push('Hook could be more specific with concrete numbers');

    // Story quality scoring
    const storyContent = sections.find(s => s.part === '4. STORY')?.content || '';
    let storyScore = 75;
    if (storyContent.length > 200) storyScore += 10; // Detailed enough
    if (storyContent.includes('I')) storyScore += 10; // First-person
    if (/20\d{2}/.test(storyContent)) storyScore += 5; // Specific date/year
    breakdown['story_quality'] = Math.min(storyScore, 100);
    if (storyScore < 80) suggestions.push('Story could benefit from more sensory details and specific dates');

    // Framework clarity scoring
    let frameworkScore = framework ? 85 : 60;
    if (framework === 'PAIDS' || framework === '4E' || framework === 'MS×TS×SS') frameworkScore = 95;
    breakdown['framework_clarity'] = frameworkScore;
    if (frameworkScore < 80) suggestions.push('Consider integrating a clear framework (PAIDS, 4E, or MS×TS×SS)');

    // CTA clarity scoring
    const ctaContent = sections.find(s => s.part === '6. CTA')?.content || '';
    let ctaScore = 70;
    if (ctaContent.includes('Link in bio') || ctaContent.includes('bio')) ctaScore += 15;
    if (ctaContent.includes('Follow') || ctaContent.includes('Join')) ctaScore += 10;
    if (/\d+[,\d]*/.test(ctaContent)) ctaScore += 5; // Social proof numbers
    breakdown['cta_clarity'] = Math.min(ctaScore, 100);
    if (ctaScore < 80) suggestions.push('CTA could be more specific with clear action and social proof');

    // Vulnerability/authenticity scoring
    let vulnerabilityScore = 80;
    if (storyContent.toLowerCase().includes('broke') || storyContent.toLowerCase().includes('struggle')) vulnerabilityScore += 10;
    if (storyContent.toLowerCase().includes('i thought') || storyContent.toLowerCase().includes('i felt')) vulnerabilityScore += 10;
    breakdown['authenticity'] = Math.min(vulnerabilityScore, 100);

    // Calculate weighted overall score
    const weights = criteria.scoring;
    let overall = 0;
    let totalWeight = 0;

    Object.keys(weights).forEach(criterion => {
      const weight = weights[criterion as keyof typeof weights];
      const score = breakdown[criterion] || breakdown['authenticity'] || 75;
      overall += score * (weight / 100);
      totalWeight += weight;
    });

    return {
      overall: Math.round(overall),
      breakdown,
      suggestions: suggestions.length > 0 ? suggestions : ['Script is well-optimized! Consider testing alternative hooks.']
    };
  };

  // Repurposing Engine (unchanged from previous version)
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
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles size={32} />
          <h1 className="text-4xl font-bold">AI Content Creation Weapon</h1>
        </div>
        <p className="text-lg opacity-90">6-Part Script Architecture + Psychological Triggers = 2000x Productivity</p>
        <p className="text-sm opacity-75 mt-2">Hook → Transition → Problem → Story → Framework → CTA → Closer</p>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h2 className="text-2xl font-bold mb-6">Step 1: Define Your Content Goal</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">What problem are you solving?</label>
            <textarea
              value={input.problem}
              onChange={(e) => setInput({ ...input, problem: e.target.value })}
              placeholder="E.g., Creators struggling to monetize their following..."
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
            <label className="block text-sm font-medium mb-2">SEEDS Stage (Conversion Funnel)</label>
            <select
              value={input.seedsStage}
              onChange={(e) => setInput({ ...input, seedsStage: e.target.value as SEEDSStage })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="Signal">Signal (Get Attention)</option>
              <option value="Engagement">Engagement (Build Trust)</option>
              <option value="Education">Education (Provide Value)</option>
              <option value="Decision">Decision (Invite Purchase)</option>
              <option value="Success">Success (Celebrate Wins)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Content Goal</label>
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
          Find Top 3 Hooks (7 Hook Types)
        </button>
      </div>

      {/* Top 3 Hooks */}
      {topHooks.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-2xl font-bold mb-6">Step 2: Select Your Hook (Ranked by AI)</h2>
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
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{hook.type}</span>
                </div>
                <p className="text-lg font-medium mb-2">{hook.hook}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-600">🎯 Destroys objection: <span className="font-medium">{hook.objection}</span></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generating State */}
      {isGenerating && (
        <div className="bg-white rounded-lg p-12 shadow-md text-center">
          <RefreshCw className="animate-spin mx-auto mb-4 text-purple-600" size={48} />
          <p className="text-xl font-medium">Generating your script with 6-part architecture...</p>
          <p className="text-gray-600 mt-2">Applying psychological principles, selecting story, weaving framework...</p>
        </div>
      )}

      {/* Generated Script */}
      {generatedScript && !isGenerating && (
        <>
          {/* Script with Timestamps */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Step 3: Your AI-Generated Script</h2>
                <p className="text-sm text-gray-600 mt-1">6-Part Architecture with Timestamps & Psychological Principles</p>
              </div>
              <button
                onClick={() => copyToClipboard(generatedScript.fullScript, 'script')}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                {copied === 'script' ? <CheckCircle size={20} /> : <Copy size={20} />}
                {copied === 'script' ? 'Copied!' : 'Copy Full Script'}
              </button>
            </div>

            {/* Sectioned Script Display */}
            <div className="space-y-4">
              {generatedScript.sections.map((section, idx) => (
                <div key={idx} className="border-l-4 border-purple-500 pl-4 py-2 bg-gray-50 rounded-r">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-xs font-mono text-purple-600 font-bold">{section.timestamp}</span>
                      <span className="ml-3 font-semibold text-gray-800">{section.part}</span>
                    </div>
                    <span className="text-xs text-gray-500 italic">{section.psychological_principle}</span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{section.content}</p>
                </div>
              ))}
            </div>

            {/* Script Metadata */}
            <div className="grid grid-cols-3 gap-4 mt-6 text-sm">
              <div className="bg-blue-50 p-3 rounded">
                <span className="text-gray-600 block mb-1">Story Used:</span>
                <p className="font-medium text-blue-700">{generatedScript.story}</p>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <span className="text-gray-600 block mb-1">Framework:</span>
                <p className="font-medium text-green-700">{generatedScript.framework}</p>
              </div>
              <div className="bg-purple-50 p-3 rounded">
                <span className="text-gray-600 block mb-1">SEEDS Stage:</span>
                <p className="font-medium text-purple-700">{input.seedsStage}</p>
              </div>
            </div>
          </div>

          {/* Production Notes */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Film size={24} className="text-purple-600" />
                Production Notes
              </h2>
              <button
                onClick={() => setShowProductionNotes(!showProductionNotes)}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                {showProductionNotes ? 'Hide' : 'Show'} Notes
              </button>
            </div>

            {showProductionNotes && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2 text-gray-700">B-Roll Suggestions:</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {generatedScript.productionNotes.broll_suggestions.map((suggestion, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-purple-600 mt-1">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 text-gray-700">Text Overlays:</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {generatedScript.productionNotes.text_overlays.map((overlay, idx) => (
                      <li key={idx} className="bg-gray-100 p-2 rounded font-mono text-xs">
                        {overlay}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 text-gray-700">Music Mood:</h3>
                  <p className="text-sm text-gray-600 bg-purple-50 p-3 rounded">
                    {generatedScript.productionNotes.music_mood}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 text-gray-700">Visual Style:</h3>
                  <p className="text-sm text-gray-600 bg-purple-50 p-3 rounded">
                    {generatedScript.productionNotes.visual_style}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Performance Prediction */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Target size={20} className="text-blue-600" />
              Performance Prediction (AI Estimate)
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Est. View Rate</p>
                <p className="text-lg font-bold text-blue-600">{generatedScript.performancePrediction.estimated_view_rate}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Est. Engagement</p>
                <p className="text-lg font-bold text-green-600">{generatedScript.performancePrediction.estimated_engagement}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Conversion Likelihood</p>
                <p className="text-lg font-bold text-purple-600">{generatedScript.performancePrediction.conversion_likelihood}</p>
              </div>
            </div>
          </div>

          {/* SEEDS Score */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-2xl font-bold mb-6">SEEDS Optimization Score</h2>

            <div className="flex items-center gap-4 mb-6">
              <div className="text-center">
                <div className={`text-6xl font-bold ${
                  generatedScript.seedsScore.overall >= 85 ? 'text-green-600' :
                  generatedScript.seedsScore.overall >= 75 ? 'text-yellow-600' :
                  generatedScript.seedsScore.overall >= 65 ? 'text-orange-600' :
                  'text-red-600'
                }`}>
                  {generatedScript.seedsScore.overall}
                </div>
                <p className="text-sm text-gray-600 mt-1">Overall Score</p>
                <p className="text-xs text-gray-500">
                  {generatedScript.seedsScore.overall >= 85 ? 'Excellent' :
                   generatedScript.seedsScore.overall >= 75 ? 'Good' :
                   generatedScript.seedsScore.overall >= 65 ? 'Fair' : 'Needs Work'}
                </p>
              </div>

              <div className="flex-1">
                <div className="space-y-2">
                  {Object.entries(generatedScript.seedsScore.breakdown).map(([criterion, score]) => (
                    <div key={criterion}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize font-medium">{criterion.replace(/_/g, ' ')}</span>
                        <span className="font-semibold">{score}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            score >= 85 ? 'bg-green-500' :
                            score >= 75 ? 'bg-yellow-500' :
                            score >= 65 ? 'bg-orange-500' :
                            'bg-red-500'
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
                <h3 className="font-semibold mb-2 text-yellow-900 flex items-center gap-2">
                  <AlertCircle size={18} />
                  Optimization Suggestions:
                </h3>
                <ul className="space-y-1 text-sm text-yellow-800">
                  {generatedScript.seedsScore.suggestions.map((suggestion, idx) => (
                    <li key={idx}>• {suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Alternative Hooks */}
          {generatedScript.alternativeHooks.length > 0 && (
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold mb-4">Alternative Hook Options (A/B Test These):</h3>
              <div className="space-y-2">
                {generatedScript.alternativeHooks.map((altHook, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded border border-gray-200">
                    <span className="text-sm font-bold text-gray-400">#{idx + 2}</span>
                    <p className="text-sm text-gray-700">{altHook}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

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
            <p className="text-lg opacity-90 mb-2">
              6-part script architecture applied. Psychological principles integrated. Ready to film.
            </p>
            <p className="text-sm opacity-75">What would've taken 4+ hours is done in 30 seconds.</p>
            <p className="mt-4 font-bold text-xl">You understand? Because you understand.</p>
          </div>
        </>
      )}

      {/* Footer */}
      <div className="text-center text-gray-600 py-6 border-t border-gray-200">
        <p className="font-medium text-lg">For children's children 🇿🇦</p>
        <p className="text-sm text-gray-500 mt-1">Ubuntu: I am because we are</p>
      </div>
    </div>
  );
}
