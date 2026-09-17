# 🔐 Complete Backup - Navigation & Database Information
**Date**: September 16, 2024  
**Project**: Dr. Deogratius Mbita Emmanuel Academic Website

---

## 📋 CURRENT NAVIGATION STRUCTURE

### **Main Navigation Routes** (All Working)

#### 1. **Home** (`/`)
- Hero section with profile
- Announcements slider
- Stats dashboard
- News & updates
- Upcoming events
- Recent publications
- Testimonials
- Research highlights
- Achievements showcase

#### 2. **About** (`/about`)
- Full biography
- Vision & Mission
- Skills showcase
- Languages
- Education timeline
- Work experience
- Certifications
- Professional memberships
- Video introduction
- Leadership positions
- Media appearances

#### 3. **Research** Dropdown
- Research Overview (`/research`)
- Active Projects (`/research#projects`)
- Publications (`/publications`)
- Research Datasets (`/research-data`)
- Presentations (`/presentations`)
- Research Network (`/research-network`)
- Proposals (`/research-proposals`)

#### 4. **Teaching** Dropdown
- Teaching Philosophy (`/teaching`)
- Current Courses (`/teaching#courses`)
- Course Materials (`/course-materials`)
- Student Resources (`/student-resources`)
- Virtual Lab (`/virtual-lab`)

#### 5. **Students** Dropdown
- Current Students (`/students`)
- Alumni Network (`/alumni`)
- Student Portal (Login required)
- Mentorship Program
- Career Services
- Success Stories

#### 6. **Publications** (`/publications`)
- Complete publication list
- Filter by type (journal, conference, book)
- Search functionality
- Citation metrics
- Download PDFs

#### 7. **Gallery** (`/gallery`)
- Photo gallery with categories
- Events photos
- Research activities
- Awards & ceremonies

#### 8. **Events** (`/events`)
- Upcoming events
- Past events archive
- Event registration
- Event calendar

#### 9. **Blog** (`/blog`)
- Blog posts
- Research updates
- News articles

#### 10. **Resources** Dropdown
- Academic Resources (`/resources`)
- Datasets
- Software Tools
- Templates
- Tutorials
- Course Materials

#### 11. **Community** Dropdown
- Discussion Forum (`/community`)
- FAQs (`/community#faqs`)
- Testimonials (`/community#testimonials`)
- Live Polls
- Q&A Section

#### 12. **More** Dropdown (`/more`)
- Newsletter (`/newsletter`)
- Collaborations (`/collaborations`)
- Alumni Network (`/alumni`)
- Certificates (`/certificates`)
- Video Library (`/video-library`)
- Student Resources (`/student-resources`)
- Research Network (`/research-network`)
- Virtual Lab (`/virtual-lab`)
- AI Assistant (`/ai-assistant`)
- Scheduling (`/scheduling`)
- Analytics Dashboard (`/analytics`)
- Live Polling

#### 13. **Contact** (`/contact`)
- Contact form
- Office location with map
- Office hours
- WhatsApp link
- Building image
- FAQ section

---

## 🗄️ CURRENT DATABASE (Render PostgreSQL)

### **Connection String**:
```
postgresql://mbita_user:UMkuBF9t2w6nrqRk0UuMRrtMNDQCgqrw@dpg-dakhotp594qs73e484p0-a.frankfurt-postgres.render.com/mbita_database?sslmode=require
```

### **Database Details**:
- **Provider**: Render.com (Frankfurt, Germany)
- **Database Name**: `mbita_database`
- **Username**: `mbita_user`
- **Total Tables**: 115+ tables
- **Admin Credentials**: 
  - Username: `Mbita`
  - Password: `Mbita@2026`

---

## 📊 ALL DATABASE TABLES (115 Tables)

### **Core Content Tables**
1. Profile
2. Publication
3. ResearchProject
4. Course
5. Student
6. Award
7. BlogPost
8. Event
9. Collaborator
10. Resource
11. GalleryItem
12. TeamMember
13. Announcement

### **Newsletter System**
14. NewsletterSubscriber
15. NewsletterCampaign
16. EmailTemplate
17. EmailLog
18. SMSNotification

### **Community Features**
19. CommunityPost
20. CommunityReply
21. FAQ
22. Testimonial
23. ContactMessage
24. AppointmentRequest

### **Scheduling**
25. AvailabilitySlot
26. Appointment
27. AppointmentReminder

### **Polling & Quizzes**
28. LivePoll
29. PollResponse
30. Quiz
31. QuizAttempt
32. QuizQuestion

### **Analytics**
33. PageView
34. AnalyticsEvent
35. StudentEngagement
36. CitationMetric
37. ImpactHistory
38. PublicationDownload
39. ResourceAnalytics

### **LMS Features**
40. CourseMaterial
41. Assignment
42. AssignmentSubmission
43. StudentMilestone
44. CourseForum
45. CourseRegistration
46. CourseFeedback
47. CourseAttendance
48. CourseGrade

### **Video Library**
49. VideoLecture
50. VideoProgress
51. VideoComment
52. VideoPlaylist

### **Research Collaboration**
53. Researcher
54. CollaborationProposal
55. ResearchMatch
56. CoAuthorshipNetwork
57. ResearchDataset
58. ResearchPresentation
59. ResearchProposal
60. ResearchRepository

### **Certificates**
61. Certificate
62. CertificateTemplate
63. CertificateVerification

### **Alumni Network**
64. Alumni
65. AlumniStory
66. JobPosting
67. MentorshipRequest
68. AlumniEvent

### **Grant Management**
69. FundingOpportunity
70. GrantApplication
71. GrantBudget

### **Virtual Lab**
72. ResearchData
73. LabNotebook
74. Experiment
75. EquipmentBooking

### **Gamification**
76. StudentPoints
77. Achievement
78. StudentAchievement
79. Leaderboard
80. Challenge
81. ChallengeProgress

### **Peer Review**
82. PeerReview
83. ReviewRubric
84. PlagiarismCheck

### **Student Portal**
85. StudentUser
86. StudentEnrollment
87. StudentMessage
88. StudentNotification

### **Administration**
89. AdminUser
90. SiteSettings
91. ActivityLog
92. SecurityLog
93. BackupLog
94. AdminNotification
95. NavigationMenu
96. WebhookIntegration
97. Integration

### **Auto-Sync**
98. ConnectedAccount
99. SyncedContent
100. SyncLog

### **AI Features**
101. AIConversation
102. AITrainingData
103. DocumentSummary
104. ChatMessage
105. PredictiveAnalytic
106. ABTest

### **Internationalization**
107. Translation
108. ContentTranslation

### **Mobile App**
109. MobileDevice
110. PushNotification
111. OfflineSync

### **Miscellaneous**
112. CollaborationRequest
113. StudentFeedback
114. OAuthToken
115. AccessibilityPreference
116. MediaAltText

---

## 🔧 HOW TO ACCESS YOUR OLD VERCEL DATABASE

### **Option 1: Check Vercel Dashboard**
1. Go to: https://vercel.com/dashboard
2. Select your old project
3. Go to **Settings** → **Environment Variables**
4. Look for `DATABASE_URL` variable
5. Copy the connection string

### **Option 2: Check Vercel Postgres Dashboard**
If you used Vercel Postgres:
1. Go to: https://vercel.com/dashboard/stores
2. Find your database
3. Click **Connect** to get connection details

### **Option 3: Check Local Backup Files**
Check these locations:
```bash
# Look for .env.local (Vercel uses this)
cat .env.local

# Check git history for old database URLs
git log --all -p | grep "DATABASE_URL"

# Check if there's a backup folder
ls -la ~/backups/
ls -la ~/Documents/backups/
```

---

## 📥 HOW TO EXPORT DATA FROM OLD DATABASE

### **Once you find the old DATABASE_URL:**

```bash
# 1. Export entire database to SQL file
pg_dump "YOUR_OLD_DATABASE_URL" > old_database_backup.sql

# 2. Or export specific tables
pg_dump "YOUR_OLD_DATABASE_URL" -t Profile -t Publication -t NavigationMenu > important_data.sql

# 3. Or export as JSON using Prisma
# First, update .env with old DATABASE_URL temporarily
# Then run:
npx prisma db pull
npx ts-node scripts/export-data.ts
```

---

## 📤 HOW TO IMPORT DATA TO NEW DATABASE

### **Method 1: Import SQL Dump**
```bash
# Import entire database
psql "postgresql://mbita_user:UMkuBF9t2w6nrqRk0UuMRrtMNDQCgqrw@dpg-dakhotp594qs73e484p0-a.frankfurt-postgres.render.com/mbita_database?sslmode=require" < old_database_backup.sql
```

### **Method 2: Copy Specific Data**
```javascript
// Create a migration script
// File: scripts/import-old-data.ts

import { PrismaClient as OldPrismaClient } from '@prisma/client-old'
import { PrismaClient as NewPrismaClient } from '@prisma/client'

const oldDb = new OldPrismaClient({
  datasources: { db: { url: 'OLD_DATABASE_URL' } }
})

const newDb = new NewPrismaClient()

async function migrate() {
  // Copy Profile
  const oldProfile = await oldDb.profile.findFirst()
  if (oldProfile) {
    await newDb.profile.upsert({
      where: { id: 1 },
      create: oldProfile,
      update: oldProfile
    })
  }
  
  // Copy Publications
  const oldPublications = await oldDb.publication.findMany()
  for (const pub of oldPublications) {
    await newDb.publication.create({ data: pub })
  }
  
  // Copy NavigationMenu
  const oldNavigation = await oldDb.navigationMenu.findMany()
  for (const nav of oldNavigation) {
    await newDb.navigationMenu.create({ data: nav })
  }
}

migrate()
```

---

## 🚨 IMPORTANT VERCEL-SPECIFIC NOTES

### **Vercel Postgres**
If you used Vercel Postgres, the connection string format is:
```
postgres://default:PASSWORD@HOST-pooler.REGION.postgres.vercel-storage.com:5432/verceldb?sslmode=require
```

### **Vercel KV (Redis)**
If you used Vercel KV for sessions:
```
redis://default:PASSWORD@HOST.kv.vercel-storage.com
```

### **Environment Variables Location**
Vercel stores env vars in:
- Dashboard: https://vercel.com/[username]/[project]/settings/environment-variables
- Local: `.env.local` file (not committed to git)
- Vercel CLI: `vercel env pull`

---

## 🔍 FINDING YOUR OLD DATA - CHECKLIST

- [ ] Check Vercel dashboard for DATABASE_URL
- [ ] Check `.env.local` file in your local project
- [ ] Check Vercel Storage dashboard
- [ ] Check git history: `git log --all -p | grep DATABASE`
- [ ] Check email from Vercel for database setup
- [ ] Check browser saved passwords for database credentials
- [ ] Check your notes/documentation for database info
- [ ] Check other computers where you deployed
- [ ] Ask team members who had access
- [ ] Contact Vercel support if database was deleted

---

## 💾 BACKUP CURRENT SYSTEM

### **Database Backup Commands**:
```bash
# Full schema backup
npx prisma db pull > schema_backup.prisma

# Data export to JSON
npx prisma db push --skip-generate
node scripts/export-all-data.js > data_backup.json

# SQL dump
pg_dump "postgresql://mbita_user:..." > render_backup_$(date +%Y%m%d).sql
```

### **Code Backup**:
- GitHub Repository: https://github.com/kabulamoshi3-cloud/Mbita-ya-final
- Latest Commit: `f3df199`
- All features committed and pushed

---

## 📞 SUPPORT CONTACTS

**Render Support**: https://render.com/support  
**Vercel Support**: https://vercel.com/support  
**Database Recovery**: Contact respective provider

---

## ✅ VERIFIED WORKING FEATURES

All navigation routes tested and working:
- ✅ Home page with all sections
- ✅ About page with full bio
- ✅ Research pages and projects
- ✅ Publications with filtering
- ✅ Teaching and courses
- ✅ Students and alumni
- ✅ Gallery with categories
- ✅ Events calendar
- ✅ Blog system
- ✅ Resources library
- ✅ Community forum
- ✅ Newsletter system (NEW)
- ✅ Scheduling system (NEW)
- ✅ Polling system (NEW)
- ✅ Analytics dashboard (NEW)
- ✅ Contact form
- ✅ Admin panel with full CRUD

---

**Last Updated**: September 16, 2024  
**Deployment**: https://deogratis-mbita.onrender.com  
**Status**: ✅ All systems operational
