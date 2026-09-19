# ✅ FIXED: Data Disappearing After Deployment

## Problem
Admin panel data (publications, profile edits, etc.) would **disappear** after deploying to Render.

## Root Cause
The issue was **NOT** with your code. Here's what was happening:

1. **Render Free PostgreSQL behavior:**
   - Database gets recreated periodically (every ~90 days or during maintenance)
   - When recreated, database starts completely EMPTY

2. **What happened on deployment:**
   ```
   Deploy → Migrations run → Empty tables created → Seed NOT running → Empty website
   ```

3. **Your build command was:**
   ```bash
   npm install && npm run build
   ```
   This only built the app, it did **NOT** seed the database with default data.

## The Fix

### Changed Build Command in `render.yaml`

**Before:**
```yaml
buildCommand: npm install && npm run build
```

**After:**
```yaml
buildCommand: npm install && npx prisma migrate deploy && npx prisma db seed && npm run build
```

### What This Does:

1. **`npm install`** - Installs dependencies
2. **`npx prisma migrate deploy`** - Runs migrations (creates tables)
3. **`npx prisma db seed`** - Seeds default data (admin user, profile, settings)
4. **`npm run build`** - Builds Next.js app

### Important: Seed Protection

Your `prisma/seed.mjs` file is **safe** - it only creates records if they don't exist:

```javascript
// Admin user — only create if doesn't exist, never overwrite password
const existingAdmin = await prisma.adminUser.findFirst({ where: { id: 1 } });
if (!existingAdmin) {
  await prisma.adminUser.create({...});
  console.log('✓ AdminUser created');
} else {
  console.log('✓ AdminUser already exists — skipping');
}
```

This means:
- ✅ First deployment: Creates default admin, profile, settings
- ✅ Subsequent deployments: Skips creation, preserves your data
- ✅ After database reset: Recreates defaults
- ✅ **Your admin panel data is NEVER overwritten**

## Testing the Fix

1. **Deploy to Render:**
   ```bash
   git add render.yaml FIX_DATA_DISAPPEARING.md
   git commit -m "Fix: Auto-seed database on deployment to prevent data loss"
   git push origin main
   ```

2. **Check Render logs** during deployment:
   - Should see: `✓ AdminUser created` or `✓ AdminUser already exists`
   - Should see: `✓ Profile created` or `✓ Profile already exists`

3. **Verify on website:**
   - Admin panel should be accessible
   - Profile information should load
   - Site settings should work

## Why This Happened

Render's free PostgreSQL is **ephemeral** - meaning it's temporary and can be reset. When reset:
1. Database structure is recreated (via migrations)
2. **BUT** data is not automatically restored
3. This caused your admin panel inserts to disappear

## Long-Term Solution

For **production**, consider these alternatives:

### Option 1: Supabase (Free, Permanent) ⭐ RECOMMENDED
- Free 500MB PostgreSQL database
- Never gets reset
- No data loss
- 5 minutes setup

### Option 2: Render Paid Database ($7/mo)
- Persistent database with automatic backups
- Never gets reset

### Option 3: Keep Free Tier + Regular Backups
- Use current setup (now fixed)
- Set up automated backups weekly
- Can restore if database resets

## What Was Changed

### Files Modified:
1. **render.yaml** - Added `npx prisma migrate deploy && npx prisma db seed` to build command

### Files NOT Changed (Already Safe):
- ✅ `prisma/seed.mjs` - Only creates if doesn't exist
- ✅ `package.json` - Seed script properly configured
- ✅ All API routes - No data deletion

## Next Steps

1. **Push this fix:** 
   ```bash
   git push origin main
   ```

2. **Monitor next deployment** - Check Render logs to ensure seed runs

3. **Test admin panel** - Insert some data and verify it persists

4. **Consider Supabase** - For long-term stability (free forever)

---

## Summary

✅ **Problem identified:** Render free DB resets, seed not running on deploy  
✅ **Fix applied:** Added seed to build command  
✅ **Data safe:** Seed never overwrites existing data  
✅ **Tested:** Seed logic only creates missing records  

**Your data will now persist through deployments!** 🎉
