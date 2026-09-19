# 📄 AUTO-SYNC FILE RETRIEVAL SYSTEM

## 🎯 What Will Be Retrieved Automatically

### ✅ **YES - These Will Be Retrieved:**

---

## 📚 1. PUBLICATION METADATA (Always)

From all academic platforms:
- ✅ **Title**
- ✅ **Authors**
- ✅ **Year**
- ✅ **Venue** (Journal/Conference name)
- ✅ **Abstract**
- ✅ **Keywords**
- ✅ **DOI** (Digital Object Identifier)
- ✅ **URL** (Link to paper)
- ✅ **Citation count**
- ✅ **Publication type** (Journal, Conference, Book, etc.)

---

## 📄 2. FULL-TEXT PDF FILES (When Available)

### From Open Access Sources:
- ✅ **arXiv** - Direct PDF download
- ✅ **PubMed Central** - Full text PDF
- ✅ **bioRxiv/medRxiv** - Preprint PDFs
- ✅ **Institutional Repositories** - Open access PDFs
- ✅ **Author's personal website** - If linked
- ✅ **ResearchGate** - If uploaded by author
- ✅ **Academia.edu** - If uploaded by author

### From Publisher Sites (If Open Access):
- ✅ **Springer Open**
- ✅ **PLOS**
- ✅ **Nature Open Access**
- ✅ **Frontiers**
- ✅ **MDPI**

### What We CAN'T Auto-Download:
- ❌ **Paywalled papers** (Elsevier, Wiley, etc. - copyright protected)
- ❌ **Subscription-only content**
- ⚠️ **Solution:** Store link instead, download manually, or use institutional access

---

## 🎥 3. VIDEO FILES

From YouTube/Vimeo:
- ✅ **Video metadata** (title, description, views)
- ✅ **Thumbnail images**
- ✅ **Video embed links**
- ⚠️ **Full video download:** Optional (large files, storage intensive)
  - Can download if needed
  - Better to embed/link

---

## 🖼️ 4. IMAGES & FIGURES

From publications:
- ✅ **Cover images**
- ✅ **Journal covers**
- ✅ **Conference posters** (if uploaded)
- ✅ **Author photos**
- ✅ **Graphical abstracts**

From ResearchGate/Academia:
- ✅ **Uploaded figures**
- ✅ **Research images**

---

## 📊 5. SUPPLEMENTARY MATERIALS

If available:
- ✅ **Supplementary PDFs**
- ✅ **Data files** (CSV, Excel)
- ✅ **Code files** (if on GitHub/Zenodo)
- ✅ **Protocols** (from protocols.io)
- ✅ **Datasets** (from figshare, Zenodo, Dryad)

---

## 📝 6. PRESENTATION SLIDES

From SlideShare/Speaker Deck:
- ✅ **PowerPoint/PDF slides**
- ✅ **Presentation metadata**
- ✅ **Conference presentations**

---

## 🎓 7. THESIS & DISSERTATIONS

From institutional repositories:
- ✅ **PhD theses**
- ✅ **Master's theses**
- ✅ **Undergraduate projects**

---

## 💾 8. RESEARCH DATA

From data repositories:
- ✅ **figshare datasets**
- ✅ **Zenodo datasets**
- ✅ **Dryad datasets**
- ⚠️ **Large datasets:** Store link only (can be 100s of GB)

---

## 📋 9. DOCUMENT FORMATS SUPPORTED

### Will Be Retrieved & Stored:
- ✅ **PDF** (.pdf) - Most common
- ✅ **Word Documents** (.docx, .doc)
- ✅ **PowerPoint** (.pptx, .ppt)
- ✅ **Excel** (.xlsx, .xls)
- ✅ **Plain Text** (.txt)
- ✅ **LaTeX** (.tex)
- ✅ **Markdown** (.md)
- ✅ **HTML** (web pages)
- ✅ **Images** (.jpg, .png, .gif, .svg)
- ✅ **CSV** (data files)
- ✅ **JSON/XML** (structured data)

### Large Files (Link Only):
- ⚠️ **Videos** (.mp4, .avi) - Embed/link preferred
- ⚠️ **Large Datasets** (>100MB) - Link only
- ⚠️ **Audio** (.mp3) - Embed/link preferred

---

## 🔄 AUTO-SYNC RETRIEVAL WORKFLOW

### Step 1: Fetch Metadata
```
Platform API/Scraper
    ↓
Get publication list
    ↓
Extract metadata (title, authors, year, DOI)
    ↓
Save to SyncedContent table
```

### Step 2: Check for Full Text
```
For each publication:
    ↓
Check if DOI exists
    ↓
Check Unpaywall API (finds open access versions)
    ↓
If open access found:
        ↓
    Download PDF
        ↓
    Save to /uploads/publications/{doi}.pdf
```

### Step 3: Get Supplementary Files
```
Check publication page
    ↓
Look for supplementary materials
    ↓
Download if available:
    - Supplementary PDFs
    - Data files
    - Code repositories
    ↓
Save to /uploads/supplementary/{doi}/
```

### Step 4: Store Everything
```
Database:
    - Metadata in publications table
    - File paths in documents
    
File System:
    - PDFs in /uploads/publications/
    - Supplementary in /uploads/supplementary/
    - Images in /uploads/images/
```

---

## 💡 SMART FEATURES

### 1. **Unpaywall Integration**
```javascript
// Check if PDF is openly available
const response = await fetch(
  `https://api.unpaywall.org/v2/${doi}?email=your@email.com`
);

if (response.best_oa_location) {
  // Download PDF from open access location
  const pdfUrl = response.best_oa_location.url_for_pdf;
  await downloadPDF(pdfUrl);
}
```

### 2. **Duplicate Detection**
- Check if file already exists (by DOI or title)
- Compare file hashes to avoid re-downloading
- Merge metadata if duplicate found

### 3. **File Storage Strategy**
```
/uploads/
  ├── publications/
  │   ├── pdfs/
  │   │   ├── {doi}.pdf
  │   │   └── {doi}_v2.pdf
  │   ├── covers/
  │   │   └── {doi}_cover.jpg
  │   └── metadata/
  │       └── {doi}.json
  ├── supplementary/
  │   ├── {doi}/
  │   │   ├── data.csv
  │   │   ├── code.zip
  │   │   └── figures/
  ├── presentations/
  │   └── conference_2024.pptx
  ├── videos/
  │   └── (links only, or thumbnails)
  └── datasets/
      └── (links only for large files)
```

### 4. **Automatic OCR** (Optional)
For scanned PDFs:
- Extract text using OCR
- Make searchable
- Store extracted text in database

---

## 🎛️ ADMIN CONTROL PANEL

### Settings for Each Platform:

```javascript
{
  "platform": "google_scholar",
  "autoRetrieve": {
    "metadata": true,        // Always retrieve
    "fullTextPDF": true,     // Try to download PDFs
    "supplementary": true,   // Download supplementary files
    "images": true,          // Download figures/images
    "videos": false,         // Link only (large files)
    "datasets": false        // Link only (very large)
  },
  "filters": {
    "minFileSize": 0,
    "maxFileSize": "50MB",   // Don't auto-download files >50MB
    "fileTypes": ["pdf", "docx", "pptx"],
    "onlyOpenAccess": true   // Only download open access
  }
}
```

### Manual Override:
- Admin can manually upload files
- Manual download button for paywalled papers
- Bulk download option

---

## 📊 WHAT YOU'LL SEE IN ADMIN PANEL

### For Each Publication:

```
┌─────────────────────────────────────────────────────┐
│ Publication: "Mathematics Teaching in Tanzania"     │
├─────────────────────────────────────────────────────┤
│ Status: ✅ Synced from Google Scholar               │
│                                                     │
│ Files Retrieved:                                    │
│ ✅ Metadata (title, authors, abstract)             │
│ ✅ PDF - Downloaded (2.3 MB)                        │
│ ✅ Supplementary Data (data.csv) - Downloaded       │
│ ✅ Cover Image - Downloaded                         │
│ ❌ Video - Not available                            │
│                                                     │
│ Actions:                                            │
│ [View PDF] [Download All] [Manual Upload]          │
│ [Edit Metadata] [Delete]                           │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 IMPLEMENTATION PLAN

### Phase 1: Basic Metadata (Week 1)
- ✅ Sync publication metadata
- ✅ Store titles, authors, abstracts
- ✅ Get DOIs and URLs

### Phase 2: PDF Retrieval (Week 2)
- ✅ Integrate Unpaywall API
- ✅ Download open access PDFs
- ✅ Store in file system
- ✅ Link to publications

### Phase 3: Supplementary Files (Week 3)
- ✅ Detect supplementary materials
- ✅ Download data files, code
- ✅ Organize by publication

### Phase 4: Images & Media (Week 4)
- ✅ Download cover images
- ✅ Extract figures from papers
- ✅ Embed videos (link only)

### Phase 5: Advanced Features (Week 5+)
- ✅ OCR for scanned PDFs
- ✅ Automatic citation extraction
- ✅ Full-text search
- ✅ File versioning

---

## 💰 STORAGE CONSIDERATIONS

### File Sizes:
- **Metadata:** ~5 KB per paper
- **PDF:** 2-5 MB per paper
- **Supplementary:** 1-50 MB per paper
- **Images:** 100 KB - 1 MB

### For 100 Publications:
- Metadata: 500 KB
- PDFs: 200-500 MB
- Supplementary: 1-5 GB
- **Total:** ~5-10 GB

### Storage Solutions:
1. **Local server:** Simple, fast
2. **AWS S3:** Scalable, cheap ($0.023/GB/month)
3. **Cloudflare R2:** Free tier 10 GB
4. **Supabase Storage:** Free 1 GB

**Recommended:** Start with local, move to S3 if needed.

---

## ✅ SUMMARY

### Will Retrieve Automatically:
✅ Publication metadata (always)
✅ Open access PDFs (when available)
✅ Supplementary files (small files)
✅ Images and figures
✅ Video metadata and embeds
✅ Presentation slides (if uploaded)

### Will NOT Retrieve (Link Only):
❌ Paywalled papers (copyright)
❌ Videos (too large, embed instead)
❌ Large datasets (>100MB)

### User Can:
✅ Manually upload paywalled papers
✅ Configure what to auto-download
✅ Set file size limits
✅ Choose open access only

---

## 🎯 BOTTOM LINE

**The system will:**
1. **Automatically retrieve all open access documents and files**
2. **Store links for paywalled/large files**
3. **Give you control over what to download**
4. **Let you manually upload anything missing**

**You'll have:**
- ✅ Complete publication database
- ✅ PDFs for open access papers
- ✅ All supplementary materials
- ✅ Images and presentations
- ✅ Links to everything else

**Ready to build this?** 🚀

Start with metadata sync first, then add PDF retrieval!
