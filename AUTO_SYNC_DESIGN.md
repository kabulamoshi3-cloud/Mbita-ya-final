# 🔄 AUTO-SYNC SYSTEM DESIGN

## 📋 Overview

Automatically sync publications, profile updates, and content from academic and social platforms to your website.

---

## 🎓 ACADEMIC PLATFORMS (Priority 1)

### 1. Google Scholar
**What to Sync:**
- ✅ Publications (title, authors, year, venue, citations)
- ✅ Citation count
- ✅ h-index
- ✅ Profile bio
- ✅ Co-authors

**How:**
- Use Google Scholar Profile ID
- API: Serpapi or ScraperAPI (Google Scholar doesn't have official API)
- Frequency: Daily

**Data Mapping:**
```
Scholar → Website
- Title → Publication.title
- Authors → Publication.authors
- Year → Publication.year
- Venue → Publication.venue
- Citations → Publication metadata
```

---

### 2. ORCID
**What to Sync:**
- ✅ Publications (with DOI)
- ✅ Education history
- ✅ Employment history
- ✅ Funding information

**How:**
- Use ORCID Public API (free)
- ORCID ID: `0000-0000-0000-0000`
- Frequency: Weekly

**API Endpoint:**
```
https://pub.orcid.org/v3.0/{ORCID-ID}/works
```

---

### 3. ResearchGate
**What to Sync:**
- ✅ Publications
- ✅ Research interests
- ✅ Projects
- ✅ Questions & Answers

**How:**
- Web scraping (no official API)
- Use profile URL
- Frequency: Weekly

---

### 4. Scopus
**What to Sync:**
- ✅ Publications with metrics
- ✅ Citation data
- ✅ Author metrics

**How:**
- Scopus API (requires API key)
- Author ID required
- Frequency: Weekly

---

### 5. Web of Science
**What to Sync:**
- ✅ Publications
- ✅ Citation metrics
- ✅ Research areas

**How:**
- WOS API (requires institutional access)
- Researcher ID required
- Frequency: Weekly

---

### 6. Academia.edu
**What to Sync:**
- ✅ Papers
- ✅ Research interests
- ✅ Profile views

**How:**
- Web scraping
- Profile URL: `academia.edu/EmmanuelMbita`
- Frequency: Weekly

---

## 📱 SOCIAL PLATFORMS (Priority 2)

### 7. LinkedIn
**What to Sync:**
- ✅ Professional experience
- ✅ Education
- ✅ Skills & endorsements
- ✅ Posts about research

**How:**
- LinkedIn API (requires OAuth)
- User grants permission
- Frequency: Daily

---

### 8. Twitter/X
**What to Sync:**
- ✅ Tweets about publications
- ✅ Research announcements
- ✅ Conference updates

**How:**
- Twitter API v2
- OAuth 2.0
- Frequency: Real-time (webhook)

---

### 9. YouTube
**What to Sync:**
- ✅ Lecture videos
- ✅ Research presentations
- ✅ Tutorial videos

**How:**
- YouTube Data API v3
- Channel ID
- Frequency: Daily

---

### 10. Facebook (Academic Page)
**What to Sync:**
- ✅ Public posts about research
- ✅ Event announcements
- ✅ Photos from conferences

**How:**
- Facebook Graph API
- Page Access Token
- Frequency: Daily

---

## 🏗️ SYSTEM ARCHITECTURE

### Database Schema

```sql
-- Connected Accounts
CREATE TABLE ConnectedAccount (
  id UUID PRIMARY KEY,
  platform VARCHAR(50), -- 'google_scholar', 'orcid', 'linkedin', etc.
  accountId VARCHAR(255), -- Platform-specific ID
  accessToken TEXT, -- For OAuth platforms
  refreshToken TEXT,
  apiKey TEXT, -- For API-based platforms
  isActive BOOLEAN DEFAULT true,
  lastSyncedAt TIMESTAMP,
  syncStatus VARCHAR(20), -- 'pending', 'syncing', 'success', 'error'
  syncError TEXT,
  metadata JSONB, -- Platform-specific settings
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

-- Synced Content (before importing to main tables)
CREATE TABLE SyncedContent (
  id UUID PRIMARY KEY,
  platform VARCHAR(50),
  externalId VARCHAR(255), -- ID from external platform
  contentType VARCHAR(50), -- 'publication', 'profile', 'video', etc.
  title TEXT,
  content TEXT,
  metadata JSONB, -- Raw data from platform
  authors TEXT[],
  publishedDate TIMESTAMP,
  citations INT,
  url TEXT,
  importedToDb BOOLEAN DEFAULT false,
  lastFetchedAt TIMESTAMP DEFAULT NOW(),
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

---

## 🔧 TECHNICAL IMPLEMENTATION

### 1. Admin Panel Interface

**Location:** `/admin/integrations`

**Features:**
- ✅ List of all available platforms
- ✅ Connect/Disconnect buttons
- ✅ Sync status indicators
- ✅ Last sync timestamp
- ✅ Manual sync trigger
- ✅ Sync settings (frequency, what to sync)

**UI Design:**
```
┌─────────────────────────────────────────┐
│  🔗 Connected Platforms                 │
├─────────────────────────────────────────┤
│                                         │
│  🎓 ACADEMIC PLATFORMS                  │
│  ┌───────────────────────────────────┐ │
│  │ Google Scholar         [Connected]│ │
│  │ Last sync: 2 hours ago            │ │
│  │ Status: ✅ 11 publications synced │ │
│  │ [Sync Now] [Settings] [Disconnect]│ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ ORCID                [Not Connected]│
│  │ Sync publications with DOI         │ │
│  │ [Connect]                          │ │
│  └───────────────────────────────────┘ │
│                                         │
│  📱 SOCIAL PLATFORMS                    │
│  ┌───────────────────────────────────┐ │
│  │ LinkedIn              [Connected] │ │
│  │ Last sync: 1 day ago              │ │
│  │ Status: ✅ Profile updated        │ │
│  │ [Sync Now] [Settings] [Disconnect]│ │
│  └───────────────────────────────────┘ │
│                                         │
│  [+ Add New Platform]                  │
└─────────────────────────────────────────┘
```

---

### 2. Backend API Structure

```typescript
// API Routes
/api/integrations/
├── available/          GET  - List available platforms
├── connected/          GET  - List connected accounts
├── connect/           POST  - Connect new account
├── disconnect/        POST  - Disconnect account
├── sync/              POST  - Trigger manual sync
├── sync-status/:id    GET  - Get sync status
└── settings/:id       PUT  - Update sync settings

/api/sync/
├── google-scholar     POST  - Sync from Google Scholar
├── orcid              POST  - Sync from ORCID
├── researchgate       POST  - Sync from ResearchGate
├── linkedin           POST  - Sync from LinkedIn
└── process-queue      POST  - Process sync queue
```

---

### 3. Sync Workflow

```
┌────────────┐
│  Trigger   │ (Cron job / Manual / Webhook)
└─────┬──────┘
      │
      ▼
┌────────────────┐
│ Fetch from API │
│  or Scrape     │
└─────┬──────────┘
      │
      ▼
┌──────────────────┐
│ Save to          │
│ SyncedContent    │ (staging table)
└─────┬────────────┘
      │
      ▼
┌──────────────────┐
│ Deduplicate &    │
│ Clean Data       │
└─────┬────────────┘
      │
      ▼
┌──────────────────┐
│ Map to Schema    │
│ (Publications)   │
└─────┬────────────┘
      │
      ▼
┌──────────────────┐
│ Upsert to DB     │
│ (avoid duplicates)│
└─────┬────────────┘
      │
      ▼
┌──────────────────┐
│ Update lastSync  │
│ Mark as imported │
└──────────────────┘
```

---

### 4. Deduplication Strategy

**How to avoid duplicate publications:**

1. **Check by DOI** (if available)
   ```sql
   SELECT * FROM publications WHERE doi = ?
   ```

2. **Check by Title + Year**
   ```sql
   SELECT * FROM publications 
   WHERE LOWER(title) = LOWER(?) 
   AND year = ?
   ```

3. **Fuzzy matching** (for similar titles)
   ```typescript
   // Use Levenshtein distance
   if (similarity(existingTitle, newTitle) > 0.9) {
     // Likely duplicate
   }
   ```

4. **Manual review queue**
   - Flag potential duplicates
   - Admin reviews and merges

---

## ⚙️ SYNC SETTINGS

### Per-Platform Settings

```json
{
  "platform": "google_scholar",
  "settings": {
    "autoSync": true,
    "syncFrequency": "daily",
    "syncTypes": ["publications", "citations", "profile"],
    "autoPublish": false, // Require manual approval
    "notifyOnNewContent": true,
    "filters": {
      "minCitations": 0,
      "yearFrom": 2015,
      "publicationTypes": ["journal", "conference"]
    }
  }
}
```

---

## 🔐 AUTHENTICATION FLOW

### OAuth Platforms (LinkedIn, Twitter, etc.)

```
User clicks "Connect LinkedIn"
         ↓
Redirect to LinkedIn OAuth
         ↓
User grants permission
         ↓
LinkedIn redirects back with code
         ↓
Exchange code for access token
         ↓
Save tokens to ConnectedAccount
         ↓
Trigger initial sync
```

### API Key Platforms (Scopus, ORCID)

```
User enters API key or ID
         ↓
Validate credentials
         ↓
Save to ConnectedAccount
         ↓
Trigger test sync
```

### Scraping Platforms (ResearchGate, Academia.edu)

```
User enters profile URL
         ↓
Validate URL format
         ↓
Save to ConnectedAccount
         ↓
Trigger test scrape
```

---

## 📊 SYNC MONITORING

### Dashboard Metrics

1. **Sync Status**
   - ✅ Last successful sync
   - ⏱️ Next scheduled sync
   - ❌ Failed syncs (with errors)

2. **Content Stats**
   - 📚 Publications synced
   - 👤 Profile updates
   - 📊 Citation changes
   - 🎥 Videos imported

3. **Platform Health**
   - 🟢 Active connections
   - 🔴 Failed connections
   - ⚠️ Rate limit warnings

---

## 🔔 NOTIFICATIONS

### Email Alerts:
- ✅ New publication found
- ✅ Sync failed
- ✅ API key expiring
- ✅ Rate limit reached

### In-App Notifications:
- 📬 New content ready for review
- ⚠️ Duplicate detected
- ✅ Sync completed successfully

---

## 🚀 IMPLEMENTATION PHASES

### Phase 1: Core Infrastructure (Week 1-2)
- ✅ Database tables
- ✅ Basic API structure
- ✅ Admin UI skeleton

### Phase 2: Academic Platforms (Week 3-4)
- ✅ Google Scholar integration
- ✅ ORCID integration
- ✅ Deduplication logic

### Phase 3: Social Platforms (Week 5-6)
- ✅ LinkedIn integration
- ✅ Twitter integration
- ✅ YouTube integration

### Phase 4: Automation (Week 7)
- ✅ Cron jobs
- ✅ Webhook handlers
- ✅ Error recovery

### Phase 5: Polish (Week 8)
- ✅ Monitoring dashboard
- ✅ Email notifications
- ✅ Documentation

---

## 💰 COST ESTIMATE

### Free Options:
- ✅ ORCID API - Free
- ✅ Google Scholar - Free (via scraping)
- ✅ YouTube API - Free (quota limits)

### Paid Options:
- Serpapi (Google Scholar) - $50/month
- Scopus API - Institutional access
- LinkedIn API - Free but limited

### Recommended Budget:
- **$0-50/month** for academic-only sync
- **$50-100/month** for full platform sync

---

## 🎯 PRIORITY ORDER

### Must-Have (MVP):
1. Google Scholar
2. ORCID
3. Manual upload (always available)

### Should-Have:
4. ResearchGate
5. LinkedIn
6. YouTube

### Nice-to-Have:
7. Twitter/X
8. Academia.edu
9. Scopus
10. Web of Science

---

## 📝 NEXT STEPS

1. **Decide which platforms to implement first**
2. **Get API keys** (ORCID, Serpapi, etc.)
3. **Create admin UI mockup**
4. **Build database schema**
5. **Implement Google Scholar sync** (most requested)
6. **Add ORCID sync**
7. **Test with real data**
8. **Deploy & monitor**

---

**Ready to start building? Which platform should we implement first?** 🚀
