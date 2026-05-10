# MELVILLE CEILINGS SPACING AUDIT
## Complete Setup Package

### ✓ What's Ready
- Playwright browser automation scripts (Node.js)
- Python Excel generation (openpyxl)
- Test audit data from homepage (2 screenshots + 3 spacing issues)
- Comprehensive audit configuration for all 36 pages
- Excel formatting templates with proper styling

### ⏏ How to Run

**Step 1: Verify Node.js is installed**
```bash
node --version
npm --version
```

**Step 2: Install Playwright browsers (one-time)**
```bash
npx playwright install
```

**Step 3: Run the full audit**
```bash
cd "C:\Users\e_ibe\OneDrive\Documents\WEH\CLAUDE CODE\Claude site test"
node spacing-audit-logged.mjs
```

This will:
- Load all 36 pages at 2 viewport sizes (72 total)
- Take full-page screenshots
- Analyze spacing gaps
- Generate `Melville Ceilings Spacing Audit/audit-findings.json`
- Log progress to `audit-progress.log`
- **Estimated time: 15-20 minutes**

**Step 4: Generate Excel report**
```bash
python3 generate_excel.py
```

OR (if Python doesn't work):
```bash
node generate-excel.mjs
```

This creates: `Melville_Ceilings_Spacing_Audit.xlsx`

### 📊 Excel Format
| # | Page Name | Page URL | Section / Location | Issue Description | Device | Priority | Actioned | Screenshot |
|---|-----------|----------|-------------------|-------------------|--------|----------|----------|------------|
| 1 | Home | https://... | Cards/Boxes | Gaps vary from 2.5px to 188px (185.5px deviation) | Desktop | High | [green] | 01_home_desktop.png |

- **Priority coloring**: High (red), Medium (yellow)
- **Actioned column**: Light green for you to fill in
- **Sorted by**: Priority + Page

### 🖼️ Test Results (Homepage Only)
**Desktop (1440px)**
- Cards/Boxes: 2.5px to 188px gaps (185.5px deviation) - HIGH
- Screenshot: `01_home_desktop.png` (1.5MB)

**Mobile (390px)**
- Cards/Boxes: 2.5px to 477.5px gaps (475px deviation) - HIGH
- Images: 10px to 477.1875px gaps (467px deviation) - HIGH
- Screenshot: `01_home_mobile.png` (1.3MB)

### 📁 Output Structure After Audit
```
Melville Ceilings Spacing Audit/
├── screenshots/
│   ├── 001_home_desktop.png
│   ├── 002_home_mobile.png
│   ├── 003_ceiling-repairs-perth_desktop.png
│   └── ... (72 total)
├── audit-findings.json
├── audit-progress.log
└── Melville_Ceilings_Spacing_Audit.xlsx
```

### 📤 Upload to Google Drive
After completing the audit:
1. Right-click `Melville Ceilings Spacing Audit` folder
2. Send to → Google Drive folder or drag-drop: https://drive.google.com/drive/folders/1YMo7P-8CMOYX0WluwwHRC1lHxKHEmTdR

### ⚙️ Customization
To change sensitivity, edit `spacing-audit-logged.mjs`:
- Line with `if (maxGap - minGap > 8)` controls the threshold (currently 8px)
- Increase to 16+ for stricter detection

### 🔧 Troubleshooting
**"No Playwright browsers found"**
```bash
npx playwright install
```

**"Cannot find Node"**
- Check Node.js installation: https://nodejs.org
- Add to PATH if installed manually

**Long running - can I stop and resume?**
- The script logs progress, but currently doesn't resume. Let it run to completion.
- You can interrupt (Ctrl+C) and re-run to start fresh.

---
**Ready?** Run this now:
```bash
cd "C:\Users\e_ibe\OneDrive\Documents\WEH\CLAUDE CODE\Claude site test" && node spacing-audit-logged.mjs
```
