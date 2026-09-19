# Cron Job Setup for Auto-Sync

## Overview

The auto-sync system automatically syncs publications from academic platforms (Google Scholar, ORCID, ResearchGate, etc.) on a schedule. This guide covers multiple deployment options.

## Setup Options

### Option 1: Render Cron Jobs (Recommended for Render deployments)

Render provides built-in cron job support. Add this to your `render.yaml`:

```yaml
services:
  - type: web
    name: mbita-website
    env: node
    buildCommand: npm install && npx prisma generate && npm run build
    startCommand: npm start
    # ... other config ...

  # Add Cron Job Service
  - type: cron
    name: auto-sync-publications
    env: node
    schedule: "0 2 * * *"  # Run daily at 2 AM UTC
    buildCommand: npm install
    startCommand: curl -X POST https://deogratius-mbita.onrender.com/api/cron/auto-sync -H "Authorization: Bearer ${CRON_SECRET}"
```

**Schedule Options**:
- `"0 2 * * *"` - Daily at 2 AM UTC
- `"0 */6 * * *"` - Every 6 hours
- `"0 0 * * 0"` - Weekly on Sunday at midnight
- `"0 0 1 * *"` - Monthly on the 1st at midnight

### Option 2: External Cron Service (EasyCron, cron-job.org)

#### EasyCron (Free tier: 1 cron job)

1. Sign up at https://www.easycron.com/
2. Create new cron job:
   - **URL**: `https://deogratius-mbita.onrender.com/api/cron/auto-sync`
   - **Method**: POST
   - **Headers**: `Authorization: Bearer YOUR_CRON_SECRET`
   - **Schedule**: Daily at 2:00 AM
3. Save and enable

#### cron-job.org (Free, unlimited)

1. Sign up at https://cron-job.org/
2. Create new job:
   - **URL**: `https://deogratius-mbita.onrender.com/api/cron/auto-sync`
   - **Method**: POST (in Advanced settings)
   - **Headers**: Add `Authorization: Bearer YOUR_CRON_SECRET`
   - **Schedule**: Every day at 02:00
3. Save and activate

### Option 3: GitHub Actions (Free for public repos)

Create `.github/workflows/auto-sync.yml`:

```yaml
name: Auto-Sync Publications

on:
  schedule:
    # Run daily at 2 AM UTC
    - cron: '0 2 * * *'
  workflow_dispatch:  # Allow manual trigger

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Auto-Sync
        run: |
          curl -X POST https://deogratius-mbita.onrender.com/api/cron/auto-sync \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
            -H "Content-Type: application/json"
      
      - name: Check Response
        if: failure()
        run: echo "Auto-sync failed"
```

**Setup**:
1. Add `CRON_SECRET` to GitHub Secrets (Settings → Secrets → Actions)
2. Commit the workflow file
3. Enable GitHub Actions in repository settings

### Option 4: Vercel Cron Jobs

If deploying to Vercel, add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/auto-sync",
      "schedule": "0 2 * * *"
    }
  ]
}
```

**Note**: Requires Vercel Pro plan ($20/month)

### Option 5: Local Development (Testing)

For testing, use Node.js `node-cron`:

**Install**:
```bash
npm install node-cron
```

**Create** `scripts/cron-runner.mjs`:
```javascript
import cron from 'node-cron';

// Run every day at 2 AM
cron.schedule('0 2 * * *', async () => {
  console.log('🤖 Running auto-sync...');
  
  try {
    const response = await fetch('http://localhost:3000/api/cron/auto-sync', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CRON_SECRET}`
      }
    });
    
    const result = await response.json();
    console.log('✅ Auto-sync completed:', result);
  } catch (error) {
    console.error('❌ Auto-sync failed:', error);
  }
});

console.log('✅ Cron job started. Waiting for schedule...');
```

**Run**:
```bash
node scripts/cron-runner.mjs
```

## Environment Variables

Add to `.env`:

```env
# Cron Secret (generate a random string)
CRON_SECRET=your_random_secret_here_min_32_chars

# Base URL (for internal API calls)
NEXT_PUBLIC_BASE_URL=https://deogratius-mbita.onrender.com
```

**Generate secure secret**:
```bash
openssl rand -base64 32
```

## Security

### 1. Use Cron Secret
Always protect the cron endpoint with a secret token:

```typescript
// In route.ts
const authHeader = request.headers.get('authorization');
const cronSecret = process.env.CRON_SECRET;

if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

### 2. IP Whitelist (Optional)
For extra security, whitelist trusted IPs in Vercel/Render:

```typescript
const allowedIPs = process.env.ALLOWED_CRON_IPS?.split(',') || [];
const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0];

if (allowedIPs.length > 0 && !allowedIPs.includes(clientIP)) {
  return NextResponse.json({ error: 'Unauthorized IP' }, { status: 403 });
}
```

### 3. Rate Limiting
Prevent abuse with rate limiting:

```typescript
// Using simple in-memory rate limit
const lastRun = new Map<string, number>();
const COOLDOWN = 3600000; // 1 hour

const now = Date.now();
const lastRunTime = lastRun.get('auto-sync') || 0;

if (now - lastRunTime < COOLDOWN) {
  return NextResponse.json({ 
    error: 'Rate limited. Try again later.' 
  }, { status: 429 });
}

lastRun.set('auto-sync', now);
```

## Testing the Cron Job

### Manual Trigger via API
```bash
curl -X POST https://deogratius-mbita.onrender.com/api/cron/auto-sync \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -H "Content-Type: application/json"
```

### Expected Response
```json
{
  "success": true,
  "duration": 5432,
  "sync": {
    "platforms": [
      {
        "platform": "google_scholar",
        "status": "success",
        "count": 25
      }
    ],
    "totalSynced": 25,
    "totalErrors": 0
  },
  "import": {
    "imported": 3,
    "updated": 2,
    "skipped": 20,
    "errors": 0
  },
  "message": "Synced 25 items from 1 platforms, imported 3 new publications"
}
```

### Test Script
Create `scripts/test-cron.mjs`:

```javascript
import dotenv from 'dotenv';
dotenv.config();

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const cronSecret = process.env.CRON_SECRET;

console.log('🧪 Testing cron endpoint...\n');

try {
  const response = await fetch(`${baseUrl}/api/cron/auto-sync`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${cronSecret}`,
      'Content-Type': 'application/json',
    },
  });

  const result = await response.json();
  
  if (response.ok) {
    console.log('✅ Cron test PASSED');
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log('❌ Cron test FAILED');
    console.log('Status:', response.status);
    console.log('Error:', result);
  }
} catch (error) {
  console.error('❌ Request failed:', error.message);
}
```

Run: `node scripts/test-cron.mjs`

## Monitoring

### Check Logs
Monitor cron execution in your deployment platform:

**Render**:
```bash
# View cron job logs
render logs --service auto-sync-publications --tail
```

**Vercel**:
- Dashboard → Project → Logs → Filter by "cron"

### Database Check
Verify sync is working:

```sql
-- Check last sync time
SELECT "lastSyncAt" FROM "Profile" LIMIT 1;

-- Check recent synced content
SELECT platform, COUNT(*) as count, MAX("lastFetchedAt") as last_sync
FROM "SyncedContent"
GROUP BY platform;

-- Check notifications
SELECT * FROM "AdminNotification"
ORDER BY "createdAt" DESC
LIMIT 10;
```

### Admin Panel
1. Go to `/admin/integrations`
2. Check "Last synced" time on platform cards
3. View "Deduplication Status" section
4. Click notification bell 🔔 to see sync notifications

## Troubleshooting

### Cron Not Running
1. **Check logs** for errors
2. **Verify CRON_SECRET** is set correctly
3. **Test manually** with curl command
4. **Check schedule** syntax (cron format)

### Sync Failing
1. Check API endpoint is accessible
2. Verify database connection
3. Check platform scrapers are working
4. Review error notifications in admin panel

### No Notifications
1. Verify `AdminNotification` table exists
2. Check notification API: `GET /api/notifications`
3. Ensure auto-sync returned `imported > 0`
4. Check browser console for errors

### Performance Issues
If sync takes too long:

1. **Run platforms in parallel** (current: sequential)
2. **Reduce sync frequency** (daily → weekly)
3. **Limit items per sync** (e.g., last 50 publications)
4. **Use pagination** for large datasets

## Best Practices

1. **Start with daily syncs** - Adjust based on publication frequency
2. **Run during off-peak hours** - 2-4 AM in your timezone
3. **Monitor first week** - Check logs daily to catch issues
4. **Set up alerts** - Email notifications for failures
5. **Keep secrets secure** - Never commit CRON_SECRET to git
6. **Test locally first** - Verify sync works before scheduling
7. **Document changes** - Update this file if you modify the cron

## Schedule Recommendations

**Active Researcher** (publishing frequently):
- Sync: Daily at 2 AM
- Import: Automatically after sync
- Notifications: Enabled

**Established Researcher** (stable publication list):
- Sync: Weekly on Sunday
- Import: Automatically after sync
- Notifications: Enabled

**Archived Profile** (no new publications expected):
- Sync: Monthly on 1st
- Import: Automatically after sync
- Notifications: Optional

## Disable Auto-Sync

To temporarily disable auto-sync:

1. **Via Admin Panel** (Coming soon):
   - Settings → Auto-Sync → Toggle Off

2. **Via Database**:
   ```sql
   UPDATE "Profile" SET "autoSyncEnabled" = false;
   ```

3. **Via Cron Service**:
   - Pause/disable the cron job in your cron service

The endpoint will return immediately with `{ skipped: true }` when disabled.

## Cost Estimate

| Service | Free Tier | Cost if Exceeded |
|---------|-----------|------------------|
| Render Cron | 90 hours/month | $0.01/hour |
| EasyCron | 1 job | $3.99/month |
| cron-job.org | Unlimited | Free forever |
| GitHub Actions | 2000 min/month | $0.008/minute |
| Vercel Cron | 0 (requires Pro) | $20/month |

**Recommendation**: Use **cron-job.org** (free, unlimited) or **Render Cron** (included with web service).

---

**Last Updated**: September 11, 2026  
**Version**: 1.0  
**Status**: Production Ready ✅
