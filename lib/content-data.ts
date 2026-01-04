// Hook Library - 100+ Authentic Hooks Organized by Type

export const HOOK_LIBRARY = {
  results: [
    { hook: "I made R23,000 in one day doing the OPPOSITE of what gurus teach.", match_score: 92, objection: "Income potential", type: "Results-driven" },
    { hook: "From bathroom floors to R170,000 months. Here's what changed.", match_score: 88, objection: "Starting from scratch", type: "Transformation" },
    { hook: "R350 for a brand deal? I said no. Now I make R23K per post.", match_score: 85, objection: "Low rates", type: "Comparison" },
    { hook: "Most creators are broke with 100K followers. Here's why.", match_score: 83, objection: "Monetization confusion", type: "Problem-focused" },
    { hook: "One decision. R6,000. Changed everything about my life.", match_score: 87, objection: "Investment fear", type: "Pivotal moment" },
  ],

  shocking: [
    { hook: "780,000 followers. Gone. One notification. Here's what saved me.", match_score: 85, objection: "Platform dependency", type: "Shock-focused" },
    { hook: "I lost my entire business overnight. Here's what I learned.", match_score: 82, objection: "Risk awareness", type: "Survival story" },
    { hook: "The R6K phone everyone called 'irresponsible' built a 3M+ following.", match_score: 84, objection: "Equipment cost", type: "Irony" },
    { hook: "4 hours of editing for 60 seconds of content. Worth it? Watch.", match_score: 79, objection: "Time investment", type: "Contrarian" },
  ],

  vulnerability: [
    { hook: "I was sleeping in bathrooms when this happened...", match_score: 90, objection: "Starting conditions", type: "Vulnerability" },
    { hook: "I was broke when I bought the tool that changed my life.", match_score: 86, objection: "No money for equipment", type: "Humble beginnings" },
    { hook: "Everyone said I was crazy. R6,000 on a phone? But look now.", match_score: 83, objection: "Investment doubt", type: "Against-the-grain" },
  ],

  framework: [
    { hook: "PAIDS: The only income formula you need as a creator.", match_score: 81, objection: "No clear strategy", type: "Framework-focused" },
    { hook: "4E: The content formula that built 3M+ followers.", match_score: 80, objection: "Don't know what to post", type: "System-reveal" },
    { hook: "MS×TS×SS: Why talent alone won't make you rich.", match_score: 78, objection: "Skill vs success gap", type: "Equation-hook" },
  ],

  contrarian: [
    { hook: "Everyone's chasing viral. I'm building systems. Here's why.", match_score: 77, objection: "Chasing trends", type: "Counter-culture" },
    { hook: "Stop creating content. Start building infrastructure.", match_score: 82, objection: "Content burnout", type: "Paradigm shift" },
    { hook: "Followers don't pay bills. This does.", match_score: 84, objection: "Vanity metrics", type: "Truth-bomb" },
  ],

  curiosity: [
    { hook: "The ONE thing successful creators do that broke ones don't.", match_score: 75, objection: "Missing piece", type: "Gap-identification" },
    { hook: "You're doing everything right. Except this one thing.", match_score: 76, objection: "Doing work but no results", type: "Blind spot reveal" },
    { hook: "What they don't tell you about making money as a creator...", match_score: 74, objection: "Industry secrets", type: "Behind-curtain" },
  ],
};

// Story Bank - 10+ Authentic Stories

export const STORY_BANK = {
  "R23K-affiliate": {
    title: "R23,000 in One Day",
    duration: 25,
    emotional_arc: "Surprise → Realization → Hope",
    destroys_objection: "Income potential",
    script: `March 2019. I wake up to notification after notification.
AdMarula affiliate campaign for Mr Price. One link on my story.
By end of day? R23,000.

More than most South African creators make in THREE MONTHS.
From ONE authentic recommendation.

That day everything changed. I stopped chasing brand deals.
Started building multiple income streams instead.`,
  },

  "platform-loss": {
    title: "780K Followers Lost",
    duration: 30,
    emotional_arc: "Shock → Panic → Resilience",
    destroys_objection: "Platform dependency",
    script: `780,000 followers. Built over years.
One morning, one notification: Account suspended.

Everything I'd built. Gone.

But here's what saved me: My email list.
10,000 people I could still reach.
Independent of any platform.

That's when I learned: Own your audience.
Don't rent space on someone else's platform.`,
  },

  "r6k-decision": {
    title: "The R6,000 Decision",
    duration: 28,
    emotional_arc: "Fear → Faith → Vindication",
    destroys_objection: "Equipment cost / Investment fear",
    script: `2014. ATNS trainee. Making minimum wage.
Everyone said buying a R6,000 smartphone was financially irresponsible.

"You can't afford that."
"What about rent?"
"You're being reckless."

But I knew. That phone was my ticket out.

That 'irresponsible' R6K investment?
Built a 3 million+ following.
Changed my entire life.

Sometimes the 'irresponsible' choice is the anointed one.`,
  },

  "bathroom-floor": {
    title: "Sleeping in Bathrooms",
    duration: 32,
    emotional_arc: "Rock-bottom → Determination → Breakthrough",
    destroys_objection: "Starting from nothing",
    script: `2013. Sleeping in airport bathrooms.
R50 to my name. No plan B.

That bathroom floor became my prayer closet.
Made a covenant with God: Get me through this,
I'll build something that lasts for children's children.

Fast forward: 3M+ followers, multiple businesses,
teaching thousands of creators.

Your starting point doesn't determine your ending.
Your covenant does.`,
  },

  "r350-exploitation": {
    title: "From R350 to R23K Deals",
    duration: 20,
    emotional_arc: "Exploitation → Realization → Empowerment",
    destroys_objection: "Low brand deal rates",
    script: `Early days: Brands offering R350 for a post.
500K followers. Professional content. R350.

I said no.

Learned affiliate marketing instead.
Same brands, same products.
But now? R23,000 per campaign.

Your value doesn't change.
Your system does.`,
  },

  "4-hours-60-seconds": {
    title: "4 Hours for 60 Seconds",
    duration: 18,
    emotional_arc: "Exhaustion → Epiphany → Efficiency",
    destroys_objection: "Time vs quality",
    script: `4 hours editing one 60-second video.
People said I was crazy.
"Just post! Quantity over quality!"

But that 60 seconds?
1.2 million views.
48,000 new followers.
R120,000 in product sales.

One quality piece beats 100 rushed posts.
You understand? Because you understand.`,
  },
};

// SEEDS Stage Definitions

export const SEEDS_CRITERIA = {
  Signal: {
    principle: "Serve First - Capture Attention Through Value",
    content_goal: "Hook that makes them STOP scrolling",
    business_goal: "Turn viewer into follower",
    scoring: {
      hook_strength: 40,
      results_driven: 30,
      pattern_interrupt: 30,
    }
  },

  Engagement: {
    principle: "Ubuntu - I Am Because We Are",
    content_goal: "Story that creates connection",
    business_goal: "Turn follower into engaged community member",
    scoring: {
      story_quality: 40,
      vulnerability: 30,
      relatability: 30,
    }
  },

  Education: {
    principle: "Stewardship - Give Your Best Knowledge Freely",
    content_goal: "Framework that transforms thinking",
    business_goal: "Turn engaged follower into qualified lead",
    scoring: {
      framework_clarity: 40,
      actionable_value: 35,
      authority_building: 25,
    }
  },

  Decision: {
    principle: "Free Will - Invite, Don't Manipulate",
    content_goal: "CTA that feels natural and compelling",
    business_goal: "Turn lead into paying customer",
    scoring: {
      cta_clarity: 40,
      social_proof: 30,
      urgency_without_manipulation: 30,
    }
  },

  Success: {
    principle: "Legacy Loop - Success Breeds Success",
    content_goal: "Testimonial that inspires others",
    business_goal: "Turn customer into graduate advocate",
    scoring: {
      transformation_clarity: 40,
      specificity: 35,
      inspire_action: 25,
    }
  },
};

// Framework Templates

export const FRAMEWORKS = {
  PAIDS: {
    name: "PAIDS",
    description: "5 Revenue Streams: Products, Ads, Information, Deals, Services",
    integration_templates: [
      "This is the PAIDS system. Products. Ads. Information. Deals. Services. Five streams working together.",
      "After that day, I reverse-engineered what worked. Successful creators run what I call the PAIDS system.",
      "You can't just rely on brand deals. You need PAIDS: Products, Ads, Information, Deals, Services.",
    ]
  },

  "4E": {
    name: "4E Formula",
    description: "Content Balance: Entertain, Educate, Encourage, Earn",
    integration_templates: [
      "This content? My 'Educate' pillar. 50% Entertain, 20% Educate, 20% Encourage, 10% Earn. That's the 4E Formula.",
      "Balance your content with 4E: Entertain, Educate, Encourage, Earn. That's how you build trust before selling.",
    ]
  },

  MSTSSS: {
    name: "MS×TS×SS",
    description: "Mindset × Toolset × Skillset multiply each other",
    integration_templates: [
      "Having the framework is just Mindset. You need Toolset and Skillset too. MS×TS×SS. They multiply.",
      "Talent alone won't cut it. You need MS×TS×SS: Mindset × Toolset × Skillset working together.",
    ]
  },
};

// Signature Phrases

export const SIGNATURE_PHRASES = [
  "You understand? Because you understand.",
  "Building for children's children.",
  "For children's children 🇿🇦",
  "Ubuntu: I am because we are.",
  "Faith first, strategy second.",
  "Your starting point doesn't determine your ending.",
  "Stop creating for views. Start building for legacy.",
];

// CTA Templates

export const CTA_LIBRARY = {
  lead_magnet: [
    { cta: "Free PAIDS Workbook in bio. 2,497 creators downloaded this week. Your turn.", power_score: 8.5, type: "Social proof + Urgency" },
    { cta: "Link in bio. Shows you how to activate all 5 income streams. Like Thabo did - R0 to R15K/month.", power_score: 8.2, type: "Transformation focus" },
    { cta: "Free guide in bio. Join 100,000+ creators building real businesses.", power_score: 7.8, type: "Community proof" },
  ],

  follow: [
    { cta: "Follow for more stories like this. You understand? Because you understand.", power_score: 7.5, type: "Signature phrase" },
    { cta: "More content dropping Monday. Follow so you don't miss it.", power_score: 7.2, type: "Anticipation" },
  ],

  email: [
    { cta: "Link in bio. Get the full framework in your inbox. No BS, just systems.", power_score: 8.0, type: "Value promise" },
    { cta: "Email list link in bio. Where I share what doesn't fit in 60 seconds.", power_score: 7.7, type: "Exclusivity" },
  ],
};

// Eternal Storytelling Elements - Jesus + Ubuntu + Hero's Journey + Neuroscience

// Portable Proverbs (African Wisdom for Each Story)
export const PORTABLE_PROVERBS = {
  "R23K-affiliate": "Money made while you sleep is better than money you beg for standing.",
  "platform-loss": "Build your house on land you own. Rented land has an eviction date.",
  "r6k-decision": "The expensive decision that scares you today is cheaper than staying broke tomorrow.",
  "bathroom-floor": "Your floor today is your foundation tomorrow. Nothing is wasted.",
  "r350-exploitation": "Your value doesn't change. Your system does.",
  "4-hours-60-seconds": "One quality piece beats 100 rushed posts. Excellence compounds.",
};

// Ubuntu Call & Response Phrases
export const UBUNTU_PHRASES = [
  { call: "Ubuntu:", response: "I am because we are" },
  { call: "When one of us wins,", response: "we all level up" },
  { call: "Your success story", response: "strengthens the next person's faith" },
  { call: "We don't compete,", response: "we complete each other" },
  { call: "Building together,", response: "rising together" },
];

// Kingdom Paradoxes (Opposite of World's Wisdom)
export const KINGDOM_PARADOXES = [
  { worldly: "Hold back your best content to sell courses", kingdom: "Give away your best stuff. Trust in abundance. When they see your framework works, they'll want implementation help." },
  { worldly: "Competition is your enemy", kingdom: "Ubuntu: I am because we are. Your wins validate my teaching. We rise together." },
  { worldly: "Chase every opportunity", kingdom: "Sometimes the money you don't take is the wealth you build. Short-term cash vs long-term asset." },
  { worldly: "Never show weakness", kingdom: "Your mess is your message. The bathroom floor became my testimony." },
  { worldly: "Close hard, manipulate the sale", kingdom: "Invite, don't manipulate. Free will honors God. When you're ready, I'm here." },
];

// Sensory Immersion Templates (Activate Mirror Neurons)
export const SENSORY_TEMPLATES = {
  checking_bank: {
    sight: "ATM screen glowing. Enter PIN. Balance loads.",
    sound: "Beep. Transaction complete. Silence.",
    touch: "Cold metal keypad under fingertips.",
    emotion: "Stomach sinks. Same number as yesterday.",
    internal: "'Not again. Please be different this time.'"
  },
  phone_notifications: {
    sight: "Phone screen lighting up in the dark. 6:47 AM.",
    sound: "Ping. Ping. Ping. Ping. Rapid-fire notifications.",
    touch: "Fumbling for phone on nightstand. Screen warm.",
    emotion: "Heart racing. What's happening?",
    internal: "'Is this real? Am I dreaming?'"
  },
  bathroom_floor: {
    sight: "Building K, third floor. Fluorescent lights buzzing.",
    sound: "Footsteps echoing. Security making rounds. I hold my breath.",
    touch: "Cold tile against my back. Thin blanket barely covering me.",
    smell: "Cleaning chemicals. Industrial soap. Desperation.",
    emotion: "Shame burning in my chest. Fear in my throat.",
    internal: "'What if they find me? What if someone sees?'"
  },
  account_suspended: {
    sight: "Black screen. White text: 'Account Disabled.'",
    sound: "Silence. The loudest silence I've ever heard.",
    touch: "Phone feels heavier. Or maybe my hand is shaking.",
    emotion: "Stomach drops. Ten years—gone.",
    internal: "'This can't be happening. This isn't real.'"
  },
};

// Transition Bridges (Jesus Method - Familiar to Revolutionary)
export const TRANSITION_BRIDGES = [
  "Sounds crazy, right? Let me explain.",
  "Here's what actually happened...",
  "I know what you're thinking. But listen.",
  "This is the part nobody talks about.",
  "Let me tell you about [specific date].",
  "That day taught me something I can't unlearn.",
  "What happened next changed everything.",
];

// Open Ending Questions (Audience Participation)
export const OPEN_ENDINGS = [
  "Which one are you building: systems or stress?",
  "If your account disappeared tomorrow, would your business survive?",
  "Are you creating for views or building for legacy?",
  "Which stage are you at right now?",
  "Do you OWN your audience, or are you renting space?",
  "What's stopping you from starting today?",
  "Which income stream are you missing?",
];

// Character Transformation Arcs (5 Stages)
export const TRANSFORMATION_STAGES = {
  ignorance: "I thought [common belief]. Everyone said so.",
  false_confidence: "[Achievement/followers]. I'm doing everything right. [Result] will come.",
  crisis: "[Reality check]. Something's wrong. This isn't working.",
  realization: "Wait—[paradigm shift]. That's what I was missing.",
  transformation: "I'm not a [old identity]. I'm a [new identity]. I [new behavior].",
};

// Triple Pattern Templates (Power of Three)
export const TRIPLE_PATTERNS = {
  problem_stack: [
    "You're posting daily. Getting views. Making R0.",
    "You have followers. You have engagement. You have no income.",
    "Working creator hours. Making minimum wage. Burning out fast.",
  ],
  solution_stack: [
    "Not one stream. Not two streams. Five streams working together.",
    "Products. Ads. Information. Deals. Services. PAIDS.",
    "Before: Chasing followers. After: Building systems. Result: Freedom.",
  ],
  transformation_stack: [
    "I tried brand deals. Exhausting. R3K per post.",
    "I tried sponsored content. Inconsistent. Unpredictable income.",
    "I discovered PAIDS. Five streams. Changed everything.",
  ],
};

// Nested Story Elements (Story Within Story)
export const NESTED_STORY_ELEMENTS = {
  "R23K-affiliate": {
    flashback: "Six months earlier, begging a brand for R3K. They ghosted me.",
    deeper_past: "Two years before that, bathroom floors. No money. No hope.",
    present_moment: "Now I'm staring at R23K in commissions. One day.",
  },
  "platform-loss": {
    flashback: "Ten years earlier, posting my first photo. 47 likes. Started the journey.",
    deeper_past: "Remember thinking: '100K followers = success.' I was wrong.",
    present_moment: "Account disabled. But 100K emails saved me.",
  },
  "r6k-decision": {
    flashback: "My manager: 'You can't afford that phone. Be responsible.'",
    deeper_past: "Growing up, hearing: 'Don't take risks. Play it safe.'",
    present_moment: "That R6K 'irresponsible' choice built everything.",
  },
};
