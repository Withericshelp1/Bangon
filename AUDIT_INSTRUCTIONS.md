# Melville Ceilings Spacing Audit - Instructions

## Status
The audit infrastructure is set up and test data from the homepage has been collected. Due to system constraints, the full 36-page audit needs to be executed locally.

## Quick Start

Run this command from the project directory:

```bash
node spacing-audit-logged.mjs
```

Or with full path if needed:

```bash
C:\nodejs\node.exe spacing-audit-logged.mjs
```

## What It Does
- Loads all 36 URLs at 2 viewport sizes (Desktop: 1440px, Mobile: 390px)
- Takes full-page screenshots of each page
- Analyzes spacing gaps between repeating elements (cards, sections, images)
- Flags inconsistencies > 8px deviation
- Generates `audit-findings.json` with all results

## Expected Output
- **Melville Ceilings Spacing Audit/screenshots/** - 72 PNG files (36 pages × 2 viewports)
- **Melville Ceilings Spacing Audit/audit-findings.json** - Detailed findings
- **Melville Ceilings Spacing Audit/audit-progress.log** - Real-time progress log
- **Melville Ceilings Spacing Audit/Spacing_Audit_Report.xlsx** - Excel report (run after audit completes)

## Generate Excel Report
After the audit completes:

```bash
node generate-excel.mjs
```

This creates the formatted Excel file with:
- # (auto-numbered)
- Page Name
- Page URL
- Section / Location
- Issue Description
- Device (Desktop / Mobile / Both)
- Priority (High > 24px deviation, Medium otherwise)
- Actioned (light green column for manual entry)
- Screenshot Reference

## Test Data (Homepage)
Audit was successfully tested on the homepage, finding:

### Desktop
- Cards/Boxes: Gaps vary from 2.5px to 188px (185.5px deviation) -HIGH

### Mobile
- Cards/Boxes: Gaps vary from 2.5px to 477.5px (475px deviation) - HIGH
- Images: Gaps vary from 10px to 477.1875px (467px deviation) - HIGH

## Current Test Screenshots
✓ 01_home_desktop.png (1.5MB)
✓ 01_home_mobile.png (1.3MB)

## Estimated Time
- Full audit: 15-20 minutes
- Excel generation: < 1 minute

## Troubleshooting
If you get permission errors, ensure Node.js is properly installed:
- Check: `node --version` and `npm --version`
- Install missing Playwright: `npx playwright install`

## Next Steps
1. Run spacing-audit-logged.mjs
2. Wait for completion
3. Run generate-excel.mjs
4. Upload Melville Ceilings Spacing Audit folder to Google Drive
