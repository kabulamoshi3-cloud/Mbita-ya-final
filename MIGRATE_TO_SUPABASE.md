# 🚀 Supabase Migration - Step by Step

## What You're Doing
Moving from Render's temporary database (deletes every 90 days) to Supabase's permanent database (FREE FOREVER).

---

## STEP 1: Create Supabase Account ✅

1. Go to: https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub (free, no credit card)

---

## STEP 2: Create Database Project ✅

1. Click "New Project"
2. Fill in:
   - **Project Name**: `dr-mbita-website`
   - **Database Password**: CREATE STRONG PASSWORD
     - Example: `Mbita2025Secure!`
     - WRITE IT DOWN! You'll need it.
   - **Region**: South Africa (Cape Town)
   - **Plan**: FREE ✅

3. Click "Create new project"
4. Wait 2-3 minutes

---

## STEP 3: Get Connection String ✅

1. In Supabase dashboard → Settings (gear icon)
2. Click "Database" in left menu
3. Scroll to "Connection string" section
4. Click "URI" tab
5. Copy the string (looks like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
6. Replace `[YOUR-PASSWORD]` with your actual password

**Example:**
```
Before: postgresql://postgres:[YOUR-PASSWORD]@db.abc123.supabase.co:5432/postgres
After:  postgresql://postgres:Mbita2025Secure!@db.abc123.supabase.co:5432/postgres
```

---

## STEP 4: Backup Current Data 🔴 CRITICAL!

**STOP! Do this before continuing:**

### Option A: From Your Local Machine
```bash
cd /path/to/Mbita-emmanuel
npm run backup
```

This creates: `backup-2025-09-11.json`

### Option B: From Render Shell
1. Go to Render dashboard
2. Click your service (mbita-emmanuel)
3. Click "Shell" tab
4. Run:
```bash
npm run backup
cat backup-*.json
```
5. Copy the output and save it locally as `backup-2025-09-11.json`

**Save this file somewhere safe!** (Google Drive, Dropbox, email to yourself)

---

## STEP 5: Update Render Environment ✅

1. Go to: https://dashboard.render.com
2. Click your service: **mbita-emmanuel**
3. Click **"Environment"** in left sidebar
4. Find **DATABASE_URL** in the list
5. Click **"Edit"** (pencil icon)
6. **Delete the old value**
7. **Paste your Supabase connection string**
   ```
   postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres
   ```
8. Click **"Save"**

**Render will automatically redeploy (takes 2-3 minutes)**

---

## STEP 6: Wait for Deployment ⏳

1. Watch the deployment in Render dashboard
2. Wait for status to show **"Live"**
3. Check for any errors in logs

---

## STEP 7: Restore Your Data ✅

Now restore your backed-up data to the new Supabase database:

### Option A: From Local Machine (Recommended)
```bash
# Set the Supabase connection string:
export DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres"

# Restore data:
node scripts/restore-data.mjs backup-2025-09-11.json
```

### Option B: From Render Shell
1. Go to Render dashboard → Shell
2. Upload your backup file (or paste content)
3. Run:
```bash
node scripts/restore-data.mjs backup-2025-09-11.json
```

**You should see:**
```
✓ Restoring admin users...
✓ Restoring profiles...
✓ Restoring publications...
✓ Restoring courses...
✓ Restoring students...
✓ Restoring awards...
✓ Restoring events...
✅ Restore complete!
```

---

## STEP 8: Test Everything ✅

1. Go to: https://deogratius-mbita.onrender.com/login
2. Login with your admin credentials
3. Check admin panel:
   - ✓ Publications are there
   - ✓ Courses are there
   - ✓ Students are there
   - ✓ Awards are there
   - ✓ Everything restored!

4. Add a test publication
5. Deploy again (git push)
6. Check if test publication is STILL there
7. ✅ Success! Data persists!

---

## STEP 9: Celebrate! 🎉

Your data is now on Supabase and will:
- ✅ NEVER be deleted
- ✅ Always be available
- ✅ Backed up automatically
- ✅ Free forever (500MB)
- ✅ No maintenance needed

**You're done! No more data loss!**

---

## Troubleshooting

### Problem: "Connection failed" after updating DATABASE_URL

**Solution:**
- Check your password doesn't have special characters that need encoding
- If password has `@`, `#`, `:`, etc., URL-encode them:
  - `@` becomes `%40`
  - `#` becomes `%23`
  - `:` becomes `%3A`
  - Space becomes `%20`

**Example:**
```
Password: Mbita@2025
Encoded:  Mbita%402025
```

### Problem: "Table doesn't exist" error

**Solution:**
- Wait for Render deployment to complete
- Prisma should auto-create tables on first connection
- If not, run in Render Shell:
  ```bash
  npx prisma migrate deploy
  ```

### Problem: Backup file is too large for Render Shell

**Solution:**
- Use local restore (Option A in Step 7)
- Or split the backup into smaller chunks

---

## Summary

| Before (Render) | After (Supabase) |
|---|---|
| ❌ Data deleted every 90 days | ✅ Data permanent |
| ❌ No backups | ✅ Automatic backups |
| ⚠️ Risk of data loss | ✅ Zero risk |
| Free | Free |

**Migration time:** 10-15 minutes  
**Result:** Peace of mind forever ✅

---

## Need Help?

If stuck at any step:
1. Check the error message
2. Verify your connection string is correct
3. Make sure password is properly encoded
4. Ask for help with the specific step number

**Let's get you migrated!** 🚀
