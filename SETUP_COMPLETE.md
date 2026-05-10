# ✅ Melville Ceilings Spacing Audit - SETUP COMPLETE

**Status**: ✅ Ready to run
**Output**: Google Sheets (uploaded directly to your Drive folder)
**Estimated Duration**: 15-20 minutes

---

## 🚀 Quick Start (Pick One)

### **Windows (Easiest)**
1. Open: `C:\Users\e_ibe\OneDrive\Documents\WEH\CLAUDE CODE\Claude site test`
2. Double-click: **`START_AUDIT.bat`**
3. Wait ~20 minutes
4. ✅ Done! Sheet appears in your Google Drive folder

---

### **Command Line (Any OS)**
```bash
cd "C:\Users\e_ibe\OneDrive\Documents\WEH\CLAUDE CODE\Claude site test"
npm install
node run-full-audit.mjs
```

---

### **Manual Steps**
```bash
# Just the audit
node spacing-audit.mjs

# Then upload to Google Sheets
node upload-to-sheets.mjs

# If no Google credentials, generates CSV instead
```

---

## 📊 What You Get

A Google Sheet in this folder:
→ https://drive.google.com/drive/folders/1YMo7P-8CMOYX0WluwwHRC1lHxKHEmTdR

**Columns:**
| # | Page Name | Page URL | Section | Issue Description | Device | Priority | Actioned |
|---|-----------|----------|---------|-------------------|--------|----------|----------|
| 1 | Home | URL | Cards/Boxes | Gaps: 2.5px-188px (dev: 185.5px) | Desktop | 🔴 High | [Green] |

---

## 🔧 What Each Script Does

| Script | Purpose | Input | Output | Time |
|--------|---------|-------|--------|------|
| `spacing-audit.mjs` | Scan all pages for spacing issues | Live URLs | `audit-data.json` | ~15m |
| `upload-to-sheets.mjs` | Upload to Google/CSV | `audit-data.json` | Google Sheet or CSV | <1m |
| `run-full-audit.mjs` | Run both above automatically | Live URLs | Google Sheet | ~16m |
| `START_AUDIT.bat` | Windows wrapper - runs everything | None | Google Sheet | ~16m |

---

## 🌐 Auto-Upload to Google Sheets (Optional)

By default, if credentials aren't found, it generates a **CSV file** instead. CSV can be manually imported to Google Sheets.

**To enable auto-upload** (one-time setup):

### Step 1: Create Google Cloud Credentials
1. Go to: https://console.cloud.google.com/
2. Create new project: `Melville Ceilings Audit`
3. **APIs & Services** → **Library**
4. Enable: `Google Sheets API` + `Google Drive API`
5. **Credentials** → **+ CREATE** → **OAuth 2.0 Desktop**
6. Click **DOWNLOAD JSON**

### Step 2: Save Credentials
```
Downloaded file: credentials.json
Save to: C:\Users\e_ibe\.google\credentials.json
```

(Create the `.google` folder if needed)

### Step 3: Run Audit
```bash
node run-full-audit.mjs
```

First time, a browser will pop up asking permission. Click **Allow**.
Then spreadsheet uploads automatically! ✨

---

## 📈 Understanding the Results

### Priority Colors

| Level | Deviation | Meaning |
|-------|-----------|---------|
| 🔴 **HIGH** | > 24px | Immediately noticeable gap variations - **Fix soon** |
| 🟡 **MEDIUM** | ≤ 24px | Noticeable on closer look - **Fix when you can** |
| 🟢 **ACTIONED** | — | Column for you to mark when fixed |

### Example Reading

**Issue**: "Home page, Desktop view, Cards/Boxes"
- Gap between card 1 & 2: **2.5px**
- Gap between card 2 & 3: **188px**
- Deviation: **185.5px**
- **Problem**: One gap is 73× larger than another!

---

## 📋 Workflow

1. **Run audit** → `START_AUDIT.bat` or `npm start`
2. **Wait** → Takes 15-20 minutes
3. **Check Google Drive** → Sheet appears automatically
4. **Review issues** → See what needs fixing
5. **Pass to developers** → Share the Google Sheet
6. **Track fixes** → Mark "Actioned" column as they fix each issue
7. **Re-audit** → Run script again after fixes to verify

---

## 🆘 Troubleshooting

### Script won't run
```bash
# Check Node.js
node --version    # Should be v18 or higher

# Install dependencies
npm install

# Try again
node spacing-audit.mjs
```

### "Playwright not found"
```bash
npm install @playwright/test
npx playwright install
```

### "googleapis module not found"
```bash
npm install googleapis
```

### Generate CSV instead of uploading
The script automatically generates CSV if:
- Google credentials not found → fallback to CSV
- Or manually: it's created in `Melville Ceilings Spacing Audit/` folder

### Slow performance
- Website load times vary - 30-second timeout per page
- Network-dependent: takes 15-20 minutes typically
- Can re-run anytime to rescan

---

## 📁 Files Created

```
Claude site test/
├── spacing-audit.mjs              ← Audit script
├── upload-to-sheets.mjs            ← Google Sheets uploader
├── run-full-audit.mjs              ← Master script
├── START_AUDIT.bat                 ← Windows launcher
├── AUDIT_README.md                 ← Full documentation
├── SETUP_COMPLETE.md               ← This file
│
└── Melville Ceilings Spacing Audit/  ← Output folder
    └── audit-data.json             ← Results (JSON)
    └── [spreadsheet URL when uploaded]
```

---

## ✨ Key Features

✓ **Fast**: No screenshots, just measures actual gaps
✓ **Accurate**: Pixel-perfect measurement of rendered elements
✓ **Complete**: Scans all 36 pages × 2 viewport sizes
✓ **Automatic**: Google Sheet uploaded directly to your folder
✓ **Shared**: Easy to pass to developers or team
✓ **Trackable**: Mark "Actioned" column as fixes are done
✓ **Reliable**: Falls back to CSV if Google credentials unavailable

---

## 🎯 Next Steps

1. **To start immediately**:
   ```bash
   START_AUDIT.bat    # Windows
   npm start          # Any OS
   ```

2. **To set up Google auto-upload** (optional):
   - Follow "Auto-Upload to Google Sheets" section above
   - Then re-run script for automatic uploading

3. **To view results**:
   - Google Sheet appears at: https://drive.google.com/drive/folders/1YMo7P-8CMOYX0WluwwHRC1lHxKHEmTdR
   - Or open CSV locally if Google not available

---

## 📞 Support

| Issue | Solution |
|-------|----------|
| npm/Node not found | Install from https://nodejs.org or use pre-installed C:\nodejs |
| Playwright error | Run: `npm install` then `npx playwright install` |
| Google auth fails | Export results as CSV instead (automatic fallback) |
| Slow scans | Normal - website load times add up, patience! |
| Need to re-run | Just run `START_AUDIT.bat` again |

---

## 🏁 Ready to Go!

Everything is set up and ready to run. Choose your method above and start the audit!

**Questions?** Check `AUDIT_README.md` for full documentation.

---

**Setup Date**: April 7, 2026
**Pages to Audit**: 36
**Total Scans**: 72 (36 pages × 2 viewports)
**Expected Finding**: 10-30 spacing inconsistencies
**Output Format**: Google Sheets (auto-uploaded)
