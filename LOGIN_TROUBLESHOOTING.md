# 🔧 NOCHILL Login Troubleshooting Guide

## Problem: Can't Login

Based on your error, here are the most common issues and solutions:

---

## 🚨 **Issue #1: No Environment Variables (MOST LIKELY)**

### **Check:**
```bash
ls -la .env.local
```

If you see: **"No such file or directory"** → This is your problem!

### **Solution:**

**Step 1: Create `.env.local` file**
```bash
# In your Content-System directory
touch .env.local
```

**Step 2: Add your Neon database connection string**

Open `.env.local` and add:
```env
DATABASE_URL=postgresql://username:password@ep-xyz-123.us-east-2.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=your-super-secret-key-here
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**How to get DATABASE_URL:**
1. Go to [console.neon.tech](https://console.neon.tech)
2. Click on your "nochill-content-system" project
3. Click "Connection Details" or "Dashboard"
4. Copy the **Connection String**
5. Paste it as `DATABASE_URL` in `.env.local`

**How to generate JWT_SECRET:**
```bash
# Option 1: Using openssl
openssl rand -base64 64

# Option 2: Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

---

## 🚨 **Issue #2: Users Table Doesn't Exist**

### **Check:**
Did you see this error in Neon?
```
Table "users" does not exist
```

### **Solution:**

You need to **execute the complete database schema** first.

**Step 1: Open Neon SQL Editor**
1. Go to [console.neon.tech](https://console.neon.tech)
2. Click on your project
3. Click **"SQL Editor"** in the left sidebar

**Step 2: Copy the complete schema**
```bash
# On your local machine
cat database/schema.sql
```

Or open `database/schema.sql` in your code editor and **copy ALL 350+ lines**.

**Step 3: Execute in Neon**
1. Paste the entire schema into the SQL Editor
2. Click **"Run"**
3. Wait for completion (you should see multiple "CREATE TABLE" and "CREATE INDEX" messages)

**Step 4: Verify tables exist**
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

You should see **8 tables**:
- constitutional_law
- content_requests
- four_e_balance
- generated_content
- mastery_tracking
- published_content
- **users** ← This one is critical!
- vetting_results

---

## 🚨 **Issue #3: Demo User Doesn't Exist**

### **Check:**
Did you create the demo user?

### **Solution:**

**Step 1: Generate password hash**
```bash
# Run this in your Content-System directory
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('nochill2024', 10).then(hash => console.log('Hash:', hash));"
```

**Copy the hash** (looks like: `$2b$10$abc123...`)

**Step 2: Create user in Neon SQL Editor**
```sql
INSERT INTO users (email, password_hash, full_name)
VALUES (
  'demo@nochill.co.za',
  '$2b$10$YOUR_ACTUAL_HASH_HERE',  -- REPLACE THIS!
  'Ndivhuwo Muhanelwa'
);
```

**Step 3: Verify user exists**
```sql
SELECT id, email, full_name, created_at FROM users;
```

You should see:
```
id | email                | full_name
1  | demo@nochill.co.za   | Ndivhuwo Muhanelwa
```

---

## 🚨 **Issue #4: Wrong Password Hash**

### **Check:**
Login returns "Invalid credentials" but you're sure the user exists?

### **Solution:**

The password hash might not match. Regenerate and update:

```bash
# Generate new hash
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('nochill2024', 10).then(hash => console.log('Hash:', hash));"
```

**Update user in Neon:**
```sql
UPDATE users
SET password_hash = '$2b$10$YOUR_NEW_HASH_HERE'
WHERE email = 'demo@nochill.co.za';
```

---

## 🛠️ **Automated Diagnostic Tool**

I've created a diagnostic script to check everything automatically:

```bash
# Make sure dev server is NOT running (Ctrl+C if it is)
# Then run:
node debug-login.js
```

This will check:
- ✅ Password hashing works
- ✅ Database connection works
- ✅ Users table exists
- ✅ Demo user exists
- ✅ Password hash matches
- ✅ JWT token generation works
- ✅ Login API works

**Read the output** - it will tell you exactly what's wrong!

---

## 📋 **Complete Checklist**

Work through this step by step:

### **Local Development**
- [ ] `.env.local` file exists in Content-System directory
- [ ] `DATABASE_URL` is set in `.env.local`
- [ ] `JWT_SECRET` is set in `.env.local`
- [ ] Database connection string is correct (from Neon)

### **Neon Database**
- [ ] Neon project exists (nochill-content-system)
- [ ] Complete `schema.sql` has been executed
- [ ] 8 tables exist (check with SQL query above)
- [ ] `users` table exists
- [ ] Demo user exists (check with SELECT query)
- [ ] Password hash is correct

### **Testing**
- [ ] Dev server starts without errors (`npm run dev`)
- [ ] Can visit http://localhost:3000
- [ ] Can visit http://localhost:3000/login
- [ ] Run `node debug-login.js` - all tests pass
- [ ] Login works in browser

---

## 🧪 **Step-by-Step Test Procedure**

### **Test 1: Environment Variables**
```bash
cat .env.local
```
Should show your DATABASE_URL and other vars.

### **Test 2: Database Connection**
```bash
node -e "const { neon } = require('@neondatabase/serverless'); const sql = neon(process.env.DATABASE_URL); sql\`SELECT NOW()\`.then(r => console.log('✅ DB Connected:', r[0]));"
```

### **Test 3: Users Table**
```bash
node -e "const { neon } = require('@neondatabase/serverless'); const sql = neon(process.env.DATABASE_URL); sql\`SELECT COUNT(*) as count FROM users\`.then(r => console.log('✅ Users count:', r[0].count));"
```

### **Test 4: Start Dev Server**
```bash
npm run dev
```
Wait until you see: `✓ Ready in X ms`

### **Test 5: Test Login API (in another terminal)**
```bash
curl http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@nochill.co.za","password":"nochill2024"}'
```

**Success response:**
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "email": "demo@nochill.co.za",
    "fullName": "Ndivhuwo Muhanelwa"
  }
}
```

**Error responses:**
- `"Email and password are required"` → Check request body
- `"Invalid credentials"` → Password hash doesn't match
- `"Internal server error"` → Check dev server logs

### **Test 6: Test in Browser**
1. Visit: http://localhost:3000/login
2. Enter:
   - Email: `demo@nochill.co.za`
   - Password: `nochill2024`
3. Click "Login"
4. Should redirect to `/dashboard` (will show 404 for now)

---

## 🚀 **Vercel Deployment Issues**

If login works locally but NOT on Vercel:

### **Check Environment Variables in Vercel**
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click your project
3. Go to **Settings → Environment Variables**
4. Verify these are set:
   - `DATABASE_URL` ✅
   - `JWT_SECRET` ✅
   - `ANTHROPIC_API_KEY` ✅
   - `NODE_ENV` = production ✅
   - `NEXT_PUBLIC_APP_URL` = your Vercel URL ✅

### **Redeploy After Adding Variables**
1. Go to **Deployments** tab
2. Click "..." menu on latest deployment
3. Click **"Redeploy"**
4. Wait for completion

---

## 💡 **Quick Fixes**

### **"Cannot read property 'length' of undefined"**
→ `.env.local` doesn't exist. Create it.

### **"Error: No database connection string"**
→ `DATABASE_URL` not set in `.env.local`

### **"Invalid credentials" (sure password is correct)**
→ Password hash doesn't match. Regenerate and update user.

### **"users table does not exist"**
→ Run complete `database/schema.sql` in Neon

### **"Cannot connect to database"**
→ Check `DATABASE_URL` is correct (copy from Neon Dashboard)

### **Login works locally but not on Vercel**
→ Add environment variables in Vercel dashboard, then redeploy

---

## 📞 **Getting More Help**

If you're still stuck:

1. **Run the diagnostic tool:**
   ```bash
   node debug-login.js
   ```

2. **Share the output** - it will show exactly what's wrong

3. **Check logs:**
   - Local: Look at terminal where `npm run dev` is running
   - Vercel: Go to your deployment → "Functions" → Click on `/api/auth/login`

---

## ✅ **Success!**

When everything works, you should see:

**Browser:**
- Login page loads ✅
- Enter credentials and click Login ✅
- Redirects to /dashboard ✅ (even if 404, login worked!)

**API Test:**
```bash
curl http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@nochill.co.za","password":"nochill2024"}'
```

**Returns:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "demo@nochill.co.za",
    "fullName": "Ndivhuwo Muhanelwa",
    "createdAt": "2024-12-29T..."
  }
}
```

**That's it!** 🎉

---

**For children's children** 🌍
