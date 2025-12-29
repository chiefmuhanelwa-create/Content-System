# NOCHILL CONTENT GOVERNANCE SYSTEM

**For children's children**

A comprehensive content governance system built to protect brand integrity, enforce constitutional law, and guide creators through the path of building generational wealth and legacy.

## 🌍 Mission

Leading African creators out of digital slavery into the promised land of ownership, wealth, and legacy. Building Africa's Largest School of Influence through contentpreneurship.

## ⚡ Key Features

- **7-Tier Content Vetting System** - AI-powered Constitutional Law compliance checking
- **Multi-Step Content Creation** - Guided form with strategic alignment
- **Real-Time Generation & Vetting** - Anthropic Claude 3.5 Sonnet integration
- **Mastery Tracking** - Weekly progress monitoring with first-pass approval rates
- **4E Balance Monitoring** - Ensures content distribution (30% Entertain, 35% Educate, 20% Encourage, 15% Earn)
- **Content Library** - Filterable archive of all generated content
- **Framework Integration** - PAIDS, SEEDS, 4E, 10 Laws enforcement

## 🏗️ Architecture

### Technology Stack

**Frontend:**
- Next.js 14 (App Router)
- React 18
- TypeScript
- TailwindCSS 3.x
- Zustand (State Management)
- Axios (HTTP Client)

**Backend:**
- Next.js API Routes (Serverless)
- Anthropic SDK (@anthropic-ai/sdk)
- Neon Serverless PostgreSQL
- JWT Authentication
- bcrypt (Password Hashing)

**Database:**
- PostgreSQL (Neon)
- 8 Tables: users, content_requests, generated_content, vetting_results, published_content, mastery_tracking, constitutional_law, four_e_balance

**AI:**
- Anthropic Claude 3.5 Sonnet
- Custom Constitutional Law Prompts
- Generation Engine Prompt
- 7-Tier Vetting/Judge Prompt

### Database Schema

```
users (1)
  │
  ├─→ content_requests (many)
  │     │
  │     └─→ generated_content (1)
  │           │
  │           └─→ vetting_results (1)
  │                 │
  │                 └─→ published_content (0..1)
  │
  ├─→ mastery_tracking (many, 1 per week)
  │
  └─→ four_e_balance (many, 1 per 30-day period)

constitutional_law (independent)
```

## 📁 Project Structure

```
Content-System/
├── app/
│   ├── api/
│   │   ├── auth/login/          # Authentication endpoint
│   │   ├── dashboard/           # Dashboard data endpoint
│   │   ├── content/
│   │   │   ├── create/          # Create content request
│   │   │   ├── [id]/
│   │   │   │   ├── generate/    # Generate content with AI
│   │   │   │   └── vet/         # Vet content with AI
│   │   │   └── library/         # Get content library
│   │   └── mastery/
│   │       └── overview/        # Mastery tracking data
│   ├── login/                   # Login page
│   ├── dashboard/               # Main dashboard
│   ├── create/                  # Content creation form (4-step)
│   ├── content/[id]/generate/   # Generation/vetting display
│   ├── library/                 # Content library
│   ├── mastery/                 # Mastery dashboard
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Homepage
│   └── globals.css              # Global styles
├── lib/
│   ├── prompts.ts               # AI prompts (Foundation, Generation, Vetting)
│   ├── auth.ts                  # JWT & password utilities
│   ├── store.ts                 # Zustand state management
│   └── api.ts                   # Axios API client
├── database/
│   └── schema.sql               # Complete database schema
├── .env.example                 # Environment variables template
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── tailwind.config.ts           # TailwindCSS config
├── next.config.js               # Next.js config
└── README.md                    # This file
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Neon PostgreSQL account
- Anthropic API account

### 1. Clone Repository

```bash
git clone <repository-url>
cd Content-System
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create `.env.local` file:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
# Neon PostgreSQL
DATABASE_URL=postgresql://user:password@host.neon.tech/nochill

# JWT Secret (generate with: openssl rand -base64 64)
JWT_SECRET=your-super-secret-jwt-key-here

# Anthropic API
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here

# App
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Set Up Database

**Option A: Using Neon Console**
1. Log in to [Neon Console](https://console.neon.tech)
2. Create new project named "nochill-content-system"
3. Open SQL Editor
4. Copy and paste contents of `database/schema.sql`
5. Execute the SQL

**Option B: Using psql CLI**
```bash
psql $DATABASE_URL < database/schema.sql
```

### 5. Create First User

```sql
-- Connect to your Neon database and run:
INSERT INTO users (email, password_hash, full_name)
VALUES (
  'demo@nochill.co.za',
  '$2b$10$YourHashedPasswordHere',  -- Use bcrypt to hash 'nochill2024'
  'Ndivhuwo Muhanelwa'
);
```

To generate password hash:
```bash
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('nochill2024', 10).then(console.log);"
```

### 6. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 7. Login

Use credentials:
- Email: `demo@nochill.co.za`
- Password: `nochill2024`

## 📊 Content Creation Flow

1. **Login** → Authenticate with JWT
2. **Dashboard** → View weekly mastery progress & 4E balance
3. **Create Content** → Fill 4-step form:
   - Step 1: Content Details (Intent, PAIDS, SEEDS, Type, Platform, Pillar)
   - Step 2: Strategic Alignment (Laws, Story, Pain Point, Outcome)
   - Step 3: CTA & Specifications (Next Step, Product Tier, Framework)
   - Step 4: Pre-Submission Checklist (6 mandatory checks)
4. **Generation** → AI generates content (6 stages, 30-60 seconds)
5. **Vetting** → AI vets content (7 tiers, 20-40 seconds)
6. **Results** → View scores, feedback, and decision:
   - **APPROVED (185-205)** → Exemplary or Strong
   - **CONDITIONAL (140-159)** → Needs Work
   - **REJECTED (<140)** → Violations present
7. **Library** → Access all content, copy approved pieces
8. **Mastery** → Track weekly improvement and common violations

## 🧪 Testing

### Test Content Generation

1. Log in to dashboard
2. Click "Create New Video Script"
3. Fill all 4 steps with test data:
   - Intent: Educate
   - PAIDS: Products, Information
   - SEEDS: Education
   - Type: Short-form
   - Platform: Instagram, YouTube
   - Pillar: Creator Business
   - Laws: Law 1, Law 6
   - Pain Point: Platform Dependency
   - Outcome: Financial Freedom
   - CTA: Provide micro magnet
   - Tier: Free
   - Framework: PAIDS
4. Check all 6 checklist boxes
5. Click "Generate Content"
6. Wait for generation & vetting
7. Review results

## 🎯 Constitutional Law Summary

### The 10 Laws of the Contentpreneur

1. **Build for Children's Children** - Generational test
2. **Own, Don't Rent** - Platform independence
3. **Systems Before Tactics** - Repeatable machines
4. **Transformation Over Information** - Sell results
5. **Diversify or Die** - Multiple revenue streams
6. **Faith First, Strategy Second** - God is the architect
7. **Vulnerability Is Strength** - Share failures
8. **Ubuntu > Competition** - "I am because we are"
9. **Excellence Is Non-Negotiable** - Offering to God
10. **The Exodus Never Ends** - Guide others to freedom

### Frameworks

**PAIDS™** - 5 Revenue Streams
- Products, Ads/Affiliates, Information, Deals, Services

**SEEDS™** - Content-to-Sales Funnel
- Signals, Engagement, Education, Decision, Success

**4E™** - Content Balance
- Entertain (30%), Educate (35%), Encourage (20%), Earn (15%)

## 🔒 Security

- JWT tokens with 7-day expiration
- bcrypt password hashing (10 rounds)
- Input sanitization
- Rate limiting (10 requests/minute per IP)
- Environment variable protection
- HTTPS enforced in production

## 📈 Performance

- API response compression
- Database query optimization with indexes
- Connection pooling with Neon Serverless
- Lazy loading for heavy components
- Caching for dashboard data (5 minutes)
- Anthropic API timeout: 60 seconds

## 🚢 Deployment to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit: NOCHILL Content Governance System"
git push origin main
```

### 2. Deploy to Vercel

1. Visit [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import Git Repository
4. Select your repo
5. Configure Project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `.next`

### 3. Add Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

```
DATABASE_URL=postgresql://...
JWT_SECRET=your-production-secret
ANTHROPIC_API_KEY=sk-ant-api03-...
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### 4. Deploy

Click "Deploy" → Vercel builds and deploys automatically

## 📝 Implementation Status

### ✅ Completed
- [x] Project initialization (Next.js 14, TypeScript, TailwindCSS)
- [x] Database schema (8 tables)
- [x] Environment configuration
- [x] AI prompts library (Foundation, Generation, Vetting)
- [x] Authentication utilities (JWT, bcrypt)
- [x] State management (Zustand)
- [x] API client (Axios with interceptors)
- [x] Authentication API endpoint
- [x] Homepage
- [x] Login page

### 🔄 In Progress / To Complete
- [ ] Remaining API endpoints:
  - [ ] Dashboard endpoint
  - [ ] Content creation endpoint
  - [ ] Content generation endpoint (Anthropic integration)
  - [ ] Content vetting endpoint (Anthropic vetting)
  - [ ] Content library endpoint
  - [ ] Mastery tracking endpoint
- [ ] Remaining frontend pages:
  - [ ] Dashboard page
  - [ ] Content creation form (4-step)
  - [ ] Generation/vetting display page
  - [ ] Content library page
  - [ ] Mastery dashboard page

## 🛠️ Development Roadmap

**Phase 1: Core Functionality** (Current)
- Complete all API endpoints
- Build all frontend pages
- Test complete content flow

**Phase 2: Enhancement**
- Add content editing capabilities
- Implement performance tracking
- Add export functionality (PDF, DOCX)
- Build mobile-responsive optimizations

**Phase 3: Advanced Features**
- Multi-user support with roles
- Team collaboration features
- Content scheduling
- Analytics dashboard
- Batch content generation

**Phase 4: Scale**
- Webhook integrations (Zapier, Make)
- API for third-party apps
- White-label versions
- Mobile app (React Native)

## 📖 API Documentation

### Authentication

**POST /api/auth/login**
```json
// Request
{
  "email": "demo@nochill.co.za",
  "password": "nochill2024"
}

// Response
{
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "email": "demo@nochill.co.za",
    "fullName": "Ndivhuwo Muhanelwa"
  }
}
```

### Dashboard

**GET /api/dashboard**
```bash
Authorization: Bearer <token>
```

### Content Creation

**POST /api/content/create**
```json
{
  "contentIntent": "Educate",
  "paidsStream": ["Products", "Information"],
  "seedsStage": "Education",
  // ... (see specification for full schema)
}
```

## 🤝 Contributing

This is a proprietary system for NOCHILL. Contact the founder for collaboration opportunities.

## 📄 License

Copyright © 2024 NOCHILL. All rights reserved.

## 🙏 Acknowledgments

Built on the foundation of:
- The Bathroom Floor Covenant (2013)
- The 10 Laws of the Contentpreneur
- African wisdom: Ubuntu - "I am because we are"
- Faith first, strategy second

---

**"For children's children"**

*Building Africa's Largest School of Influence*
