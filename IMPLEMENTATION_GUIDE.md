# NOCHILL Content Governance System
## Implementation Guide for Remaining Components

This guide provides complete implementation instructions for all remaining API endpoints and frontend pages based on the technical specification provided.

---

## 🔧 Remaining API Endpoints

### 1. Dashboard API (`/app/api/dashboard/route.ts`)

**Purpose:** Fetch user dashboard statistics

**Implementation:**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { verifyTokenFromRequest } from '@/lib/auth';

const sql = neon(process.env.DATABASE_URL!);

export async function GET(request: NextRequest) {
  try {
    const userId = await verifyTokenFromRequest(request);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Get current week stats
    const currentWeekStats = await sql`
      SELECT * FROM mastery_tracking
      WHERE user_id = ${userId}
      ORDER BY week_number DESC
      LIMIT 1
    `;

    // Get 4E balance (last 30 days)
    const fourEBalance = await sql`
      SELECT
        SUM(CASE WHEN cr.content_intent = 'Entertain' THEN 1 ELSE 0 END) as entertain_count,
        SUM(CASE WHEN cr.content_intent = 'Educate' THEN 1 ELSE 0 END) as educate_count,
        SUM(CASE WHEN cr.content_intent = 'Encourage' THEN 1 ELSE 0 END) as encourage_count,
        SUM(CASE WHEN cr.content_intent = 'Earn' THEN 1 ELSE 0 END) as earn_count,
        COUNT(*) as total_count
      FROM content_requests cr
      WHERE cr.user_id = ${userId}
        AND cr.status = 'approved'
        AND cr.created_at >= NOW() - INTERVAL '30 days'
    `;

    const total = fourEBalance[0].total_count || 1;
    const fourE = {
      entertain: Math.round((fourEBalance[0].entertain_count / total) * 100),
      educate: Math.round((fourEBalance[0].educate_count / total) * 100),
      encourage: Math.round((fourEBalance[0].encourage_count / total) * 100),
      earn: Math.round((fourEBalance[0].earn_count / total) * 100),
      isBalanced: true,
    };

    fourE.isBalanced = (
      fourE.entertain >= 28 && fourE.entertain <= 32 &&
      fourE.educate >= 33 && fourE.educate <= 37 &&
      fourE.encourage >= 18 && fourE.encourage <= 22 &&
      fourE.earn >= 13 && fourE.earn <= 17
    );

    // Get recent content
    const recentContent = await sql`
      SELECT
        cr.id,
        gc.content_text,
        cr.content_pillar,
        cr.platform,
        vr.decision,
        vr.approval_level,
        vr.total_score,
        pc.published_at,
        cr.created_at
      FROM content_requests cr
      LEFT JOIN generated_content gc ON gc.content_request_id = cr.id
      LEFT JOIN vetting_results vr ON vr.generated_content_id = gc.id
      LEFT JOIN published_content pc ON pc.generated_content_id = gc.id
      WHERE cr.user_id = ${userId}
      ORDER BY cr.created_at DESC
      LIMIT 5
    `;

    return NextResponse.json({
      weekNumber: currentWeekStats[0]?.week_number || 1,
      firstPassApprovalRate: currentWeekStats[0]?.first_pass_approval_rate || 0,
      totalRequests: currentWeekStats[0]?.total_requests || 0,
      approvedCount: currentWeekStats[0]?.approved_count || 0,
      rejectedCount: currentWeekStats[0]?.rejected_count || 0,
      conditionalCount: currentWeekStats[0]?.conditional_count || 0,
      avgScore: currentWeekStats[0]?.avg_total_score || 0,
      fourEBalance: fourE,
      recentContent: recentContent,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
```

---

### 2. Content Creation API (`/app/api/content/create/route.ts`)

**Purpose:** Save content request form data

**Implementation:**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { verifyTokenFromRequest } from '@/lib/auth';

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: NextRequest) {
  try {
    const userId = await verifyTokenFromRequest(request);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.json();

    // Validate checklist
    const checklist = formData.checklist;
    const allChecked = Object.values(checklist).every(val => val === true);
    if (!allChecked) {
      return NextResponse.json(
        { message: 'All checklist items must be checked' },
        { status: 400 }
      );
    }

    // Insert content request
    const result = await sql`
      INSERT INTO content_requests (
        user_id, content_intent, paids_stream, seeds_stage,
        content_type, platform, content_pillar, laws_upheld,
        story_bank_reference, pain_point, desired_outcome,
        cta_next_step, product_tier, max_length,
        signature_phrase, framework_reference, additional_context, status
      ) VALUES (
        ${userId}, ${formData.contentIntent}, ${formData.paidsStream},
        ${formData.seedsStage}, ${formData.contentType}, ${formData.platform},
        ${formData.contentPillar}, ${formData.lawsUpheld},
        ${formData.storyBankReference || null}, ${formData.painPoint},
        ${formData.desiredOutcome}, ${formData.ctaNextStep},
        ${formData.productTier}, ${formData.maxLength || 200},
        ${formData.signaturePhrase || null}, ${formData.frameworkReference},
        ${formData.additionalContext || null}, 'pending'
      )
      RETURNING id
    `;

    return NextResponse.json({
      success: true,
      contentRequestId: result[0].id,
    });
  } catch (error) {
    console.error('Content creation error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
```

---

### 3. Content Generation API (`/app/api/content/[id]/generate/route.ts`)

**Purpose:** Generate content using Anthropic AI

**Key Implementation Points:**
- Load content request from database
- Build user input prompt with all form data
- Call Anthropic API with FOUNDATION_PROMPT + GENERATION_ENGINE_PROMPT
- Parse structured response (hook, opening, middle, closing, cta)
- Save to generated_content table
- Return generated content

**Anthropic API Call:**
```typescript
import Anthropic from '@anthropic-ai/sdk';
import { FOUNDATION_PROMPT, GENERATION_ENGINE_PROMPT } from '@/lib/prompts';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const message = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 4096,
  temperature: 0.7,
  system: FOUNDATION_PROMPT + '\n\n' + GENERATION_ENGINE_PROMPT,
  messages: [
    {
      role: 'user',
      content: userInputPrompt,
    },
  ],
});

const generatedText = message.content
  .filter((block) => block.type === 'text')
  .map((block) => block.text)
  .join('\n');
```

---

### 4. Content Vetting API (`/app/api/content/[id]/vet/route.ts`)

**Purpose:** Vet generated content using Anthropic AI

**Key Implementation Points:**
- Load generated content from database
- Build vetting prompt with content + context
- Call Anthropic API with FOUNDATION_PROMPT + VETTING_JUDGE_PROMPT
- Parse vetting response (instant fail, scores for 7 tiers, decision, feedback)
- Save to vetting_results table
- Update mastery_tracking (increment counts, recalculate approval rate)
- Return complete vetting result

**Parsing Vetting Response:**
```typescript
function parseVettingResponse(text: string): any {
  // Extract law scores
  for (let i = 1; i <= 10; i++) {
    const regex = new RegExp(`Law ${i}:.*?(\\d+)/10`, 'i');
    const match = text.match(regex);
    if (match) result[`law${i}`] = parseInt(match[1]);
  }

  // Calculate constitutional score
  result.constitutionalScore =
    result.law1 + result.law2 + ... + result.law10;

  // Extract other tier scores (PAIDS, SEEDS, 4E, Voice, Story, Quality, Sales)
  // Determine decision based on total score
  // Parse feedback sections

  return result;
}
```

---

### 5. Content Library API (`/app/api/content/library/route.ts`)

**Purpose:** Fetch and filter content library

**Implementation:**
```typescript
export async function GET(request: NextRequest) {
  const userId = await verifyTokenFromRequest(request);
  const { searchParams } = new URL(request.url);

  const status = searchParams.get('status') || 'all';
  const fourE = searchParams.get('fourE') || 'all';
  const pillar = searchParams.get('pillar') || 'all';
  const dateRange = searchParams.get('dateRange') || '30';
  const search = searchParams.get('search') || '';

  // Build WHERE clause dynamically
  let whereConditions = [`cr.user_id = ${userId}`];

  if (status !== 'all') whereConditions.push(`cr.status = '${status}'`);
  if (fourE !== 'all') whereConditions.push(`cr.content_intent = '${fourE}'`);
  // ... etc

  const content = await sql`
    SELECT cr.*, gc.*, vr.*, pc.*
    FROM content_requests cr
    LEFT JOIN generated_content gc ON gc.content_request_id = cr.id
    LEFT JOIN vetting_results vr ON vr.generated_content_id = gc.id
    LEFT JOIN published_content pc ON pc.generated_content_id = gc.id
    WHERE ${sql.unsafe(whereConditions.join(' AND '))}
    ORDER BY cr.created_at DESC
    LIMIT 50
  `;

  return NextResponse.json({ content });
}
```

---

### 6. Mastery Overview API (`/app/api/mastery/overview/route.ts`)

**Purpose:** Fetch mastery tracking data and trends

**Key Calculations:**
- Get all weekly stats for user
- Calculate improvement trends (last 4 weeks comparison)
- Query common violations from rejected/conditional content
- Determine mastery stage based on week number + approval rate

---

## 🎨 Remaining Frontend Pages

### 1. Dashboard Page (`/app/dashboard/page.tsx`)

**Components to Display:**
- Header with logout button
- Weekly mastery progress card (approval rate, week number)
- Stats grid (total, approved, rejected, avg score)
- Quick action buttons (Create New, View Library)
- 4E balance chart with progress bars
- Recent content cards with status badges

**Data Fetching:**
```typescript
useEffect(() => {
  const fetchData = async () => {
    const response = await api.get('/api/dashboard');
    setStats(response.data);
  };
  fetchData();
}, []);
```

---

### 2. Content Creation Form (`/app/create/page.tsx`)

**4-Step Form Implementation:**

**Step 1: Content Details**
- Content Intent (4 buttons: Entertain, Educate, Encourage, Earn)
- PAIDS Stream (checkboxes: 5 options)
- SEEDS Stage (dropdown)
- Content Type (4 buttons)
- Platform (checkboxes: 7 options)
- Content Pillar (dropdown)

**Step 2: Strategic Alignment**
- Laws Upheld (checkboxes: 10 laws, max 3)
- Story Bank Reference (dropdown, optional)
- Pain Point (5 radio buttons)
- Desired Outcome (5 radio buttons)

**Step 3: CTA & Specifications**
- CTA Next Step (5 radio buttons)
- Product Tier (dropdown)
- Max Length (number input)
- Signature Phrase (dropdown, optional)
- Framework Reference (dropdown)
- Additional Context (textarea)

**Step 4: Pre-Submission Checklist**
- 6 mandatory checkboxes
- All must be checked to proceed

**Validation:**
```typescript
const validateStep = (step: number): boolean => {
  if (step === 1) {
    return !!(formData.contentIntent && formData.paidsStream.length > 0 && ...);
  }
  // ... validate other steps
};
```

---

### 3. Generation/Vetting Display (`/app/content/[id]/generate/page.tsx`)

**3 Stages:**

**Stage 1: Generation Progress**
- Show 6 stages with status icons (pending, processing, complete)
- Animate through stages
- Call `/api/content/[id]/generate`

**Stage 2: Vetting Progress**
- Show 7 tiers with status icons
- Animate through tiers
- Call `/api/content/[id]/vet`

**Stage 3: Results Display**
- Overall score card (color-coded by decision)
- Content preview (structured sections)
- Vetting scores breakdown (7 tiers)
- Constitutional Law compliance (10 laws)
- Judge's feedback (strengths, changes, reasoning, suggestions)
- Action buttons (Copy, Publish, Edit, Start Over)

---

### 4. Content Library Page (`/app/library/page.tsx`)

**Features:**
- Filter panel (status, 4E, pillar, date range, search)
- Content cards with:
  - Preview (first 150 chars)
  - Metadata tags (intent, pillar, word count, platforms)
  - Score badge
  - Status badge (color-coded)
  - Performance stats (if published)
  - Action buttons (View, Copy, Duplicate, Edit)

**Filtering:**
```typescript
useEffect(() => {
  const fetchContent = async () => {
    const response = await api.get('/api/content/library', { params: filters });
    setContent(response.data.content);
  };
  fetchContent();
}, [filters]);
```

---

### 5. Mastery Dashboard (`/app/mastery/page.tsx`)

**Components:**
- Current week performance card
- First-pass approval rate progress bar
- Stats grid (total, approved, rejected, avg score)
- Weekly progress chart (all weeks stacked)
- Improvement trends (last 4 weeks comparison)
- Common violations list with suggestions
- Mastery stage indicator

---

## 🔄 Utility Functions to Add

### 1. `/lib/validation.ts`
```typescript
export const validateContentRequest = (formData: any): string | null => {
  // Validate each step
  if (!formData.contentIntent) return 'Content Intent is required';
  // ... etc
  return null;
};
```

### 2. `/lib/sanitize.ts`
```typescript
export function sanitizeString(input: string): string {
  return input.replace(/<[^>]*>/g, '').replace(/[;'"\\]/g, '').trim();
}
```

### 3. `/lib/cache.ts`
```typescript
class SimpleCache {
  set<T>(key: string, data: T, ttl: number) { /*...*/ }
  get<T>(key: string): T | null { /*...*/ }
}
export const cache = new SimpleCache();
```

---

## 🚀 Deployment Checklist

### Before Deployment:
1. [ ] All API endpoints implemented and tested
2. [ ] All frontend pages implemented and tested
3. [ ] Database schema executed in Neon
4. [ ] First user created in database
5. [ ] Environment variables set in Vercel
6. [ ] Error handling tested
7. [ ] Authentication flow tested
8. [ ] Complete content flow tested (create → generate → vet → library)

### Vercel Configuration:
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "devCommand": "npm run dev"
}
```

### Environment Variables in Vercel:
```
DATABASE_URL
JWT_SECRET
ANTHROPIC_API_KEY
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

---

## 📝 Testing Workflow

### 1. Authentication
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@nochill.co.za","password":"nochill2024"}'
```

### 2. Dashboard
```bash
curl http://localhost:3000/api/dashboard \
  -H "Authorization: Bearer <token>"
```

### 3. Create Content
```bash
curl -X POST http://localhost:3000/api/content/create \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d @test-content-request.json
```

### 4. Generate Content
```bash
curl -X POST http://localhost:3000/api/content/1/generate \
  -H "Authorization: Bearer <token>"
```

### 5. Vet Content
```bash
curl -X POST http://localhost:3000/api/content/1/vet \
  -H "Authorization: Bearer <token>"
```

---

## 🎯 Success Criteria

**System is complete when:**
- ✅ User can log in successfully
- ✅ Dashboard displays accurate stats
- ✅ 4-step content form validates correctly
- ✅ Content generation works (Anthropic AI responds)
- ✅ Content vetting works (scoring and feedback accurate)
- ✅ Content appears in library with correct filters
- ✅ Mastery tracking updates after each vetting
- ✅ 4E balance calculates correctly
- ✅ All pages are responsive (mobile, tablet, desktop)
- ✅ Error handling graceful
- ✅ Authentication secure (JWT validation)

---

**For children's children** 🌍
