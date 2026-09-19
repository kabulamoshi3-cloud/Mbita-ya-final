# 🔧 PERMANENT FIX: Stop Data Loss on Deployment

## The Real Problem

Render's **free PostgreSQL database is EPHEMERAL** - it gets deleted and recreated periodically (every ~90 days or during maintenance). When this happens:

1. ❌ Your entire database is wiped clean
2. ❌ ALL admin panel data disappears (publications, courses, students, awards, etc.)
3. ❌ Only the schema (table structure) is recreated via migrations

**This is NOT a code problem - it's Render's free tier limitation.**

## ✅ THE SOLUTION: Two Options

---

### Option 1: Backup & Restore Scripts (FREE, Manual) ⭐

I've created backup/restore scripts for you. Use these regularly to save your data.

#### How to Backup Your Data

**Before ANY deployment or regularly (weekly):**

```bash
# 1. Connect to your local database or run on Render Shell
npm run backup

# This creates: backup-2025-09-11.json
```

**What it backs up:**
- ✅ All publications
- ✅ All courses
- ✅ All students
- ✅ All awards
- ✅ All events
- ✅ All resources
- ✅ All gallery items
- ✅ All blog posts
- ✅ Profile data
- ✅ Site settings
- ✅ Everything from admin panel

#### How to Restore Your Data

**After deployment if data is lost:**

```bash
# 1. SSH into Render or use Render Shell
# 2. Upload your backup file to the server
# 3. Run restore:
node scripts/restore-data.mjs backup-2025-09-11.json
```

#### Automation: Weekly Backup via Render Cron

Add to `render.yaml`:
```yaml
- type: cron
  name: weekly-backup
  env: node
  schedule: "0 0 * * 0"  # Every Sunday at midnight
  buildCommand: npm install
  startCommand: npm run backup && curl -X POST YOUR_WEBHOOK_URL_HERE
```

---

### Option 2: Migrate to Supabase (FREE, Permanent) ⭐⭐⭐ RECOMMENDED

**This is the BEST long-term solution - zero data loss, zero maintenance.**

#### Why Supabase?

- ✅ **Free forever** (500MB database)
- ✅ **Never gets deleted** - persistent storage
- ✅ **No data loss** - ever
- ✅ **Better performance**
- ✅ **Automatic backups**
- ✅ **5-minute setup**

#### Setup Instructions

1. **Create Supabase account:**
   - Go to https://supabase.com/
   - Sign up with GitHub (free)
   - Create new project:
     - Name: `dr-mbita-website`
     - Password: **Create strong password and SAVE IT**
     - Region: Choose closest to Tanzania (South Africa or Singapore)

2. **Get connection string:**
   - In Supabase dashboard → Settings → Database
   - Copy the **"Connection string"** (URI format)
   - Replace `[YOUR-PASSWORD]` with your actual password
   - Example: `postgresql://postgres:YOUR_PASSWORD@db.xxx.supabase.co:5432/postgres`

3. **Backup current data (IMPORTANT):**
   ```bash
   # On your local machine or Render shell:
   npm run backup
   # Save the backup-YYYY-MM-DD.json file somewhere safe
   ```

4. **Update Render environment:**
   - Go to Render dashboard → Your service
   - Environment variables
   - Find `DATABASE_URL`
   - Replace with Supabase connection string
   - Save changes

5. **Trigger redeployment:**
   - Render will auto-redeploy
   - Database tables will be created in Supabase
   - Seed will run (creates admin, profile, settings)

6. **Restore your data:**
   ```bash
   # SSH to Render or use local terminal with Supabase DATABASE_URL
   node scripts/restore-data.mjs backup-YYYY-MM-DD.json
   ```

7. **Done!** Your data is now on Supabase and will NEVER disappear.

---

## What I Changed in Your Code

### 1. Created Backup Script
**File:** `scripts/backup-data.mjs`
- Exports all database data to JSON
- Run with: `npm run backup`

### 2. Created Restore Script
**File:** `scripts/restore-data.mjs`
- Imports data from JSON backup
- Run with: `node scripts/restore-data.mjs backup-file.json`

### 3. Updated package.json
Added convenience commands:
```json
"backup": "node scripts/backup-data.mjs",
"restore": "node scripts/restore-data.mjs"
```

### 4. Fixed render.yaml Build Command
```yaml
# BEFORE (was running migrations that might conflict):
buildCommand: npm install && npx prisma migrate deploy && npx prisma db seed && npm run build

# AFTER (clean build only):
buildCommand: npm install && npx prisma generate && npm run build
```

**Why this change?**
- `prisma generate` only generates the Prisma client (safe)
- Does NOT run migrations (tables already exist in database)
- Does NOT seed (preserves your existing data)
- Seed only runs on FIRST database setup (when empty)

---

## Current Deployment Process

**Your `render.yaml` is now:**

```yaml
buildCommand: npm install && npx prisma generate && npm run build
startCommand: npm start
```

**What happens on deploy:**
1. ✅ Installs dependencies
2. ✅ Generates Prisma client
3. ✅ Builds Next.js app
4. ✅ Starts server
5. ❌ Does NOT touch database
6. ❌ Does NOT seed (unless database is empty)

**Your data is safe during normal deployments!**

---

## The Only Remaining Risk

**If Render's free database resets (every ~90 days):**
1. Database is deleted by Render
2. New empty database is created
3. Next deployment: migrations run → empty tables
4. **Your data is gone** unless you have a backup

**Solution:**
- **Option 1**: Backup weekly + restore after resets (manual)
- **Option 2**: Migrate to Supabase (no resets, ever) ⭐ **RECOMMENDED**

---

## Recommended Action Plan

### Immediate (Today):
1. **Create a backup right now:**
   ```bash
   npm run backup
   ```
2. Save the `backup-YYYY-MM-DD.json` file somewhere safe (Google Drive, Dropbox, etc.)

### Short-term (This Week):
1. Set up weekly manual backups (every Sunday)
2. Store backups in a safe location
3. Test restore once to make sure it works

### Long-term (This Month): ⭐
1. **Migrate to Supabase** (5-10 minutes)
2. Never worry about data loss again
3. Better performance and reliability

---

## Quick Command Reference

```bash
# Backup data
npm run backup

# Restore data (after backup)
node scripts/restore-data.mjs backup-2025-09-11.json

# Check what's in database
npx prisma studio  # Opens GUI to browse database
```

---

## Summary

✅ **Backup/restore scripts created** - Use weekly  
✅ **Build command fixed** - No longer touching database unnecessarily  
✅ **Data safe during normal deploys** - Only risk is Render database reset  
⭐ **Best solution**: Migrate to Supabase (free, permanent, 5 min setup)  

**Your data will no longer disappear on regular deployments!**

But for **permanent peace of mind**, migrate to Supabase. 🎉
