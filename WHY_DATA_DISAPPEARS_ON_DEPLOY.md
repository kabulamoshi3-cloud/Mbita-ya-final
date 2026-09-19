# Why Your Data Disappears After Deployment - EXPLAINED

## The Problem

When you add/edit information in the admin panel and then deploy to Render, your changes **disappear** and are replaced with old/default data.

## Root Cause

Your issue has **TWO possible causes**:

### Cause 1: Render Free Tier Database Limitations ⚠️

**Render Free PostgreSQL databases are EPHEMERAL** - they get **deleted and recreated** periodically (every 90 days or when service is stopped).

- When the database is recreated, ALL your data is lost
- The seed script runs and creates default/initial data
- This is why you see old information after deployment

### Cause 2: Running Seed Scripts Manually

If you or someone runs these commands on Render:
```bash
npx prisma db seed
npx prisma migrate reset
npx prisma db push --force-reset
```

These commands will **overwrite** your database with seed data.

## How Seed Scripts Work (Currently)

Looking at your `prisma/seed.mjs`:

```javascript
// Profile — only create if doesn't exist, never overwrite
const existingProfile = await prisma.profile.findFirst({ where: { id: 1 } });
if (!existingProfile) {
    await prisma.profile.create({ ... });
    console.log('✓ Profile created');
} else {
    console.log('✓ Profile already exists — skipping');
}
```

**This is GOOD** - the seed script only creates data if it doesn't exist. It won't overwrite your changes.

## The Real Problem: Render Free Database

Render's free PostgreSQL database is **NOT persistent**:

1. ❌ Data is lost when database is recreated
2. ❌ Database can be recreated automatically by Render
3. ❌ No automatic backups on free tier
4. ❌ No persistence guarantee

## SOLUTIONS

### Solution 1: Upgrade to Paid Database (RECOMMENDED) 💰

**Render Paid PostgreSQL ($7/month):**
- ✅ Persistent database (data never deleted)
- ✅ Automatic daily backups
- ✅ Better performance
- ✅ Your changes are SAFE

**How to upgrade:**
1. Go to https://dashboard.render.com
2. Find your database "mbita-emmanuel-db"
3. Click "Upgrade" or create a new paid database
4. Update DATABASE_URL in your web service

### Solution 2: Use External Database (FREE alternatives)

**A. Supabase (Free tier):**
- Free PostgreSQL database
- 500MB storage (plenty for your site)
- Persistent (data doesn't disappear)
- Better than Render free tier

**How to use Supabase:**
1. Sign up at https://supabase.com
2. Create a new project
3. Get connection string (Settings → Database)
4. Update DATABASE_URL in Render environment variables

**B. Neon Database (Free tier):**
- Free PostgreSQL database
- 512MB storage
- Persistent database
- Good for small projects

**How to use Neon:**
1. Sign up at https://neon.tech
2. Create a new project
3. Get connection string
4. Update DATABASE_URL in Render

### Solution 3: Keep Render Free BUT Use Backups 📦

If you want to keep using Render free database, you need to **backup and restore** your data regularly.

**I'll create backup/restore scripts for you:**

1. **Manual backup** (save to file):
   ```bash
   npm run backup
   ```

2. **Restore backup** (after database recreated):
   ```bash
   npm run restore
   ```

3. **Automated backup** (before each deployment):
   - Backup runs automatically
   - Saves to GitHub or external storage
   - Restore after database recreated

## Recommended Solution for You

Based on your needs, I recommend **Solution 2A: Supabase** because:

✅ **FREE** (no monthly cost)
✅ **Persistent** (data never disappears)
✅ **Easy to setup** (5 minutes)
✅ **Better than Render free tier**
✅ **500MB storage** (enough for years)
✅ **Automatic backups**

## What Happens Now

### Current Workflow (BROKEN):
1. You add data in admin panel → Saved to Render free database
2. Render recreates database → **DATA LOST** ❌
3. Seed script runs → Old data appears
4. Your changes are GONE

### With Supabase (FIXED):
1. You add data in admin panel → Saved to Supabase
2. Deploy to Render → Database stays on Supabase
3. Data is **PERSISTENT** ✅
4. Your changes are SAFE

## Next Steps

**Tell me which solution you want:**

1. **Pay $7/month for Render database** - I'll guide you to upgrade
2. **Use Supabase FREE database** - I'll help you set it up (RECOMMENDED)
3. **Use Neon FREE database** - I'll help you set it up
4. **Keep Render free + backup scripts** - I'll create the scripts

Choose and I'll implement it for you! 🚀

## Technical Details

### Why Seed Script Isn't the Problem

Your seed script is correctly written:
- ✅ Checks if data exists before creating
- ✅ Won't overwrite existing data
- ✅ Only creates defaults for missing records

### The Real Issue

Render free database behavior:
```
Time 0:   Create database → Seed runs → Profile created
Day 10:   You edit profile in admin → Data saved
Day 30:   Render recreates database → DATA LOST
Day 30:   Seed runs → OLD profile created again
```

### How Build Process Works

```bash
# On Render deployment:
npm install           # Install packages
npm run build         # Build Next.js (doesn't touch database)
prisma generate       # Generate Prisma client (doesn't touch database)
npm start             # Start server

# Database is separate - no automatic seed on build
# BUT if database was recreated, it's empty
# Then seed runs manually or on first request
```

## Testing If This Is Your Problem

1. Check Render logs for:
   ```
   ✓ Profile created
   ```
   If you see this AFTER you already added data, it means database was recreated.

2. Check database creation date:
   - Go to Render dashboard
   - Click on your database
   - Check "Created at" date
   - If it's recent but you deployed weeks ago, database was recreated

## Conclusion

**The problem is NOT your code**. It's the database being ephemeral on Render's free tier.

**Solution:** Use a persistent free database (Supabase or Neon) or upgrade to Render paid database.

Let me know which solution you want and I'll implement it! 💪
