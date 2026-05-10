# Melville Ceilings Website Spacing Audit

**Output Format**: Google Sheets (direct upload to your Drive folder)
**Pages**: 36 | **Viewports**: 2 (Desktop 1440px, Mobile 390px)
**Total Scans**: 72
**Time**: ~15-20 minutes

---

## Quick Start

### Option 1: Full Audit + Direct Google Sheets Upload

```bash
npm install
node run-full-audit.mjs
```

This will:
1. ✓ Run spacing audit on all 36 pages × 2 viewports
2. ✓ Save results to `audit-data.json`
3. ✓ Create Google Sheet automatically
4. ✓ Upload to: https://drive.google.com/drive/folders/1YMo7P-8CMOYX0WluwwHRC1lHxKHEmTdR

**Result**: Spreadsheet appears in your Google Drive folder automatically ✨

---

### Option 2: Audit Only (Manual Upload)

```bash
npm install
node spacing-audit.mjs
node upload-to-sheets.mjs
```

Or separately:
```bash
npm run audit      # Step 1: Run spacing audit
npm run upload     # Step 2: Upload to Google Sheets
```

---

### Option 3: Audit Only (CSV Fallback)

If you don't have Google credentials:

```bash
npm install
node spacing-audit.mjs
node upload-to-sheets.mjs  # Will generate CSV instead
```

Then import CSV to Google Sheets manually:
1. Open https://sheets.google.com
2. **+ New Blank spreadsheet**
3. **File → Import** → Select CSV
4. Move to folder: https://drive.google.com/drive/folders/1YMo7P-8CMOYX0WluwwHRC1lHxKHEmTdR

---

## Output

### Spreadsheet Columns

| # | Page Name | Page URL | Section | Issue Description | Device | Priority | Actioned |
|---|-----------|----------|---------|-------------------|--------|----------|----------|
| 1 | Home | https://... | Cards/Boxes | Gaps: 2.5px - 188px (dev: 185.5px) | Desktop | **High** | [Green] |
| 2 | ... | ... | ... | ... | ... | ... | [Green] |

**Column Descriptions:**
- **#**: Issue number
- **Page Name**: Your page name
- **Page URL**: Link to the page (clickable)
- **Section**: What element has the spacing issue (Cards, Images, Sections, etc.)
- **Issue Description**: Gap range and deviation in pixels
- **Device**: Desktop (1440px) or Mobile (390px)
- **Priority**:
  - 🔴 **High**: Deviation > 24px (obviously wrong)
  - 🟡 **Medium**: Deviation ≤ 24px (noticeable)
- **Actioned**: Leave for you to mark when fixed

---

## What Gets Analyzed

The audit measures gaps between **repeating elements**:

- ✓ Cards and boxes
- ✓ Section-to-section spacing
- ✓ Images stacked vertically
- ✓ Service items and lists

**Only reports issues where gaps differ by more than 8px** (immediately noticeable)

---

## How to Set Up Google Sheets Auto-Upload

### Prerequisites
- Google account with Drive access
- Folder created/access: https://drive.google.com/drive/folders/1YMo7P-8CMOYX0WluwwHRC1lHxKHEmTdR

### Step 1: Create Google Cloud Project

1. Go to https://console.cloud.google.com/
2. **Select a Project** → **NEW PROJECT**
3. Name: `Melville Ceilings Audit`
4. Create

### Step 2: Enable APIs

1. **APIs & Services** → **Library**
2. Search for `Google Sheets API` → **ENABLE**
3. Search for `Google Drive API` → **ENABLE**

### Step 3: Create OAuth Credentials

1. **APIs & Services** → **Credentials**
2. **+ CREATE CREDENTIALS** → **OAuth client ID**
3. Click **CONFIGURE CONSENT SCREEN** (external app)
4. Fill required fields:
   - App name: `Melville Ceilings Audit`
   - User support email: your email
   - Developer contact: your email
5. Skip optional settings → **SAVE & CONTINUE**
6. **ADD OR REMOVE SCOPES** →
   - Add: `https://www.googleapis.com/auth/spreadsheets`
   - Add: `https://www.googleapis.com/auth/drive`
   - Save & Continue
7. Back to Credentials → **+ CREATE CREDENTIALS** → **OAuth client ID**
8. Application type: **Desktop application**
9. **CREATE**
10. **DOWNLOAD JSON** button

### Step 4: Save Credentials

1. Rename downloaded file to: `credentials.json`
2. Move to: `C:\Users\e_ibe\.google\credentials.json`
3. Create the `.google` folder if it doesn't exist

### Step 5: Run Audit

```bash
node run-full-audit.mjs
```

On first run, you'll be asked to authorize. A browser window will open - click **Allow**.

Then spreadsheet uploads automatically! ✨

---

## Troubleshooting

### "Playwright not found"
```bash
npm install @playwright/test
npx playwright install
```

### "googleapis module not found"
```bash
npm install googleapis
```

### "audit-data.json not found"
- Make sure `spacing-audit.mjs` ran successfully
- Check console output for errors
- Try running again: `node spacing-audit.mjs`

### "Credentials not found"
- Run in CSV mode: Google Sheets API is optional
- Or set up credentials following the steps above

### "Network timeout"
- Website might be slow - wait a moment and retry
- Script has 30-second timeout per page

---

## Script Details

### `spacing-audit.mjs`
- Launches headless Chrome
- Loads each page twice (desktop + mobile)
- Measures gaps between repeating elements
- Saves to `audit-data.json`
- **Time**: ~15-20 minutes

### `upload-to-sheets.mjs`
- Reads `audit-data.json`
- Creates Google Sheet if credentials exist
- Falls back to CSV if no credentials
- **Time**: < 1 minute

### `run-full-audit.mjs`
- Master script that runs both above in sequence
- Shows progress and summary

---

## Example Output

```
Melville Ceilings - Spacing Audit

Pages: 36 | Viewports: 2 | Total scans: 72

[1/72] Home (Desktop)... ✗ (3)
[2/72] Home (Mobile)... ✗ (2)
[3/72] Ceiling Repairs (Desktop)... ✓
...
[72/72] Leederville (Mobile)... ✓

======================================
✓ AUDIT COMPLETE - 18 issues found
======================================

Data saved to: Melville Ceilings Spacing Audit
✓ CSV/Sheet generated and uploaded
```

---

## Notes

- **No screenshots**: We just reference the URL and section name
- **Fast**: No image capture overhead = much quicker
- **Accurate**: Measures actual rendered pixel gaps, not CSS
- **Exportable**: Save as CSV whenever needed
- **Shareable**: Google Sheet can be shared with team

---

## Support

If scripts fail:
1. Check Node.js version: `node --version` (v18+)
2. Check Playwright: `npm install @playwright/test`
3. Check Google APIs: `npm install googleapis`
4. Run audit only first: `node spacing-audit.mjs`
5. Then upload: `node upload-to-sheets.mjs`

---

**Created**: 2026-04-07
**Target Folder**: https://drive.google.com/drive/folders/1YMo7P-8CMOYX0WluwwHRC1lHxKHEmTdR
