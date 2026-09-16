# 📊 Data Population Guide for Dr. Mbita's Website

This guide explains how to populate the website with real academic data and information.

## 🚀 Quick Start - Automatic Seeding

**Option 1: Use the Seed API Endpoint**
1. Visit: `https://deogratis-mbita.onrender.com/api/seed-data`
2. This will automatically populate the profile with base information
3. Then manually add remaining data through admin panel

**Option 2: Run Seed Script Locally**
```bash
npx ts-node scripts/seed-real-data.ts
```

## 📝 Manual Data Entry Through Admin Panel

### 1. **Profile Information** (`/admin/profile`)

#### Photos Tab:
- Upload professional photo for each location:
  - Main/Default Photo (recommended: 400x400px)
  - Navbar Photo (40x40px circle)
  - Hero Photo (220x220px circle)
  - About Page Photo (200x200px)
  - Contact Page Photo (150x150px)
  - Footer Photo (48x48px)
  - Admin Photo (sidebar)

#### Profile Info Tab:
- **Full Name**: Dr. Deogratius Mbita Emmanuel
- **Title**: Senior Lecturer in Computer Science
- **Department**: Department of Computer Science
- **Institution**: University of Dar es Salaam (UDSM)
- **Email**: deogratius.mbita@udsm.ac.tz
- **Office Location**: CoICT Building, Room 305
- **Office Hours**: Monday-Friday: 10:00 AM - 12:00 PM, 2:00 PM - 4:00 PM
- **Bio**: [See full bio in seed script or write your own]

#### Academic Links Tab:
- **Google Scholar**: Your Google Scholar profile URL
- **ORCID**: Your ORCID ID URL
- **ResearchGate**: Your ResearchGate profile URL
- **GitHub**: Your GitHub profile URL
- **LinkedIn**: Your LinkedIn profile URL
- **Toggle Auto-Sync**: ON (to enable automatic content fetching)

---

### 2. **Research Projects** (`/admin/research`)

Add your active and completed research projects:

**Example Project:**
- **Title**: AI-Powered Crop Disease Detection System
- **Description**: Developing mobile app using ML for crop disease detection
- **Status**: Active / Completed
- **Start Year**: 2022
- **End Year**: 2025 (or leave blank if ongoing)
- **Funding**: Amount and source
- **Collaborators**: Partner institutions
- **Technologies**: Python, TensorFlow, Flutter, etc.
- **Publications**: Related papers
- **Outcomes**: Impact and results

**Suggested Research Areas for Dr. Mbita:**
1. AI for Agriculture in Tanzania
2. Machine Learning for Healthcare
3. Educational Technology and Data Analytics
4. Natural Language Processing for Swahili
5. Computer Vision Applications
6. Data Science for Social Good

---

### 3. **Publications** (`/admin/publications`)

Add your academic publications:

**Example Publication:**
- **Title**: Deep Learning Approaches for Crop Disease Detection
- **Authors**: Deogratius Mbita, Co-Author 1, Co-Author 2
- **Venue**: IEEE Transactions on Agricultural Engineering
- **Year**: 2023
- **Type**: Journal Article / Conference Paper
- **DOI**: 10.1109/TAE.2023.123456
- **Abstract**: Brief summary of the paper
- **Keywords**: Deep Learning, Agriculture, Tanzania
- **PDF URL**: Link to full paper (optional)

**Publication Categories:**
- Journal Articles
- Conference Papers
- Book Chapters
- Technical Reports
- Preprints

---

### 4. **Teaching Courses** (`/admin/teaching`)

Add courses you teach:

**Example Course:**
- **Code**: CS301
- **Name**: Introduction to Artificial Intelligence
- **Level**: Undergraduate / Graduate
- **Description**: Comprehensive AI course covering...
- **Credits**: 4
- **Semester**: Fall / Spring / Both
- **Syllabus URL**: Link to course syllabus PDF
- **Prerequisites**: CS201 - Data Structures

**Typical Computer Science Courses:**
1. Introduction to Programming (CS101)
2. Data Structures and Algorithms (CS201)
3. Database Systems (CS202)
4. Introduction to AI (CS301)
5. Machine Learning (CS402)
6. Advanced Deep Learning (CS601 - Graduate)
7. Data Science and Analytics (CS403)

---

### 5. **Blog Posts** (`/admin/blog`)

Share insights and knowledge:

**Example Blog Post:**
- **Title**: Getting Started with Machine Learning in Tanzania
- **Slug**: getting-started-ml-tanzania (auto-generated)
- **Excerpt**: A beginner's guide to learning ML...
- **Content**: Full blog post content (Markdown supported)
- **Featured Image**: Upload relevant image
- **Tags**: Machine Learning, Education, Tanzania, Beginners
- **Status**: Published / Draft

**Blog Post Ideas:**
1. "AI for Agriculture: Success Stories from East Africa"
2. "The Future of Healthcare Technology in Africa"
3. "Learning Python for Data Science - A Practical Guide"
4. "Research Opportunities in Computer Science"
5. "How to Choose Your Research Topic"
6. "Tips for Graduate Students"

---

### 6. **Students** (`/admin/students`)

Add information about students you supervise:

**Example Student:**
- **Name**: Student Full Name
- **Level**: MSc / PhD / Undergraduate
- **Research Topic**: Title of their research
- **Start Year**: 2022
- **Expected Completion**: 2024
- **Status**: Active / Graduated
- **Thesis Title**: Final thesis title (if graduated)

---

### 7. **Events** (`/admin/events`)

Add upcoming and past events:

**Example Event:**
- **Name**: AI & Data Science Workshop 2024
- **Description**: 3-day intensive workshop on...
- **Date**: July 15, 2024
- **Location**: UDSM CoICT, Dar es Salaam
- **Type**: Workshop / Seminar / Conference / Guest Lecture
- **Virtual**: Yes / No
- **Registration URL**: Link to registration page

---

### 8. **Gallery** (`/admin/gallery`)

Add photos from events, labs, teaching, etc.:

**Photo Categories:**
- Research Lab
- Teaching Sessions
- Conferences and Workshops
- Student Activities
- Collaborative Meetings
- Awards and Recognition

**Image Requirements:**
- Format: JPG, PNG, WebP
- Max Size: 5MB
- Recommended: 1200x800px for best quality

---

### 9. **Announcements** (`/admin/announcements`)

Post important announcements:

**Example Announcement:**
- **Title**: New Research Grant Awarded
- **Message**: Excited to announce...
- **Priority**: High / Medium / Low
- **Active**: Yes
- **Expiration Date**: When announcement should stop showing

---

### 10. **CV Management** (`/admin/cv`)

Upload your academic CV:
- **PDF Format**: Recommended
- **Keep Updated**: Update regularly with new publications, awards, etc.
- **Downloadable**: Will be available on CV page

---

## 🎯 Content Best Practices

### Writing Tips:
1. **Be Specific**: Include concrete details, numbers, and outcomes
2. **Use Keywords**: For better SEO and discoverability
3. **Stay Current**: Regularly update with new achievements
4. **Tell Stories**: Make research accessible and engaging
5. **Show Impact**: Highlight real-world applications and benefits

### Image Guidelines:
1. **Professional Quality**: Use high-resolution images
2. **Proper Attribution**: Credit photographers/sources
3. **Optimize Size**: Compress images before uploading
4. **Alt Text**: Always add descriptive alt text for accessibility
5. **Consistent Style**: Maintain visual consistency across site

### SEO Optimization:
1. **Descriptive Titles**: Clear, keyword-rich titles
2. **Meta Descriptions**: Write compelling summaries
3. **Internal Links**: Link between related pages
4. **Regular Updates**: Fresh content improves rankings
5. **Mobile-Friendly**: Ensure content works on all devices

---

## 🔄 Auto-Sync Feature

### Enable Auto-Sync:
1. Go to `/admin/profile` → Academic Links tab
2. Add your academic profile URLs (Google Scholar, ORCID, etc.)
3. Toggle "Auto-Sync" to ON
4. Click "Save Links"

### Trigger Sync:
1. Go to `/admin/auto-sync`
2. Click "Sync Now"
3. System will fetch publications/research from your profiles
4. Content is automatically imported to correct tables

### Supported Platforms:
- ✅ Google Scholar (requires SerpAPI key)
- ✅ ORCID (free - no key needed)
- ✅ GitHub (free - no key needed)
- 🔜 ResearchGate (coming soon)
- 🔜 LinkedIn (coming soon)

---

## 📧 Need Help?

If you need assistance populating data or have questions:
1. Check the admin panel tooltips (ℹ️ icons)
2. Review this guide
3. Contact technical support

---

## ✅ Checklist

- [ ] Profile information complete
- [ ] Professional photos uploaded
- [ ] Academic links added
- [ ] Auto-sync enabled
- [ ] At least 3 research projects added
- [ ] At least 5 publications added
- [ ] Current courses listed
- [ ] 2-3 blog posts published
- [ ] Student information added
- [ ] Upcoming events listed
- [ ] Gallery photos uploaded
- [ ] CV uploaded
- [ ] Contact information verified

---

**Last Updated**: January 2024
**Maintained By**: Dr. Mbita's Web Development Team
