import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { google } from 'googleapis';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const auditDir = path.join(__dirname, 'Melville Ceilings Spacing Audit');
const auditDataFile = path.join(auditDir, 'audit-data.json');

// Read audit data
const auditData = JSON.parse(fs.readFileSync(auditDataFile, 'utf-8'));

// Prepare data for sheets
const rows = [
  ['#', 'Page URL', 'Section', 'Issue Description', 'Device']
];

const processedKey = new Set();
let rowNum = 1;

auditData.forEach((item) => {
  const key = `${item.url}|${item.section}|${item.issue}`;

  if (!processedKey.has(key)) {
    const viewports = auditData
      .filter(d => d.url === item.url && d.section === item.section && d.issue === item.issue)
      .map(d => d.viewport);

    const deviceLabel = viewports.length === 2 ? 'Both' : viewports[0];

    rows.push([
      rowNum,
      item.url,
      item.section,
      item.issue,
      deviceLabel
    ]);

    rowNum++;
    processedKey.add(key);
  }
});

console.log(`\nPrepared ${rows.length - 1} unique issues for Google Sheets\n`);

// Instructions for manual Google Sheets creation
console.log('═'.repeat(100));
console.log('GOOGLE SHEETS IMPORT INSTRUCTIONS');
console.log('═'.repeat(100) + '\n');

console.log('Method 1: Automatic via CSV (Recommended)\n');
console.log('1. Open Google Sheets: https://sheets.google.com');
console.log('2. Create → New spreadsheet');
console.log('3. File → Import → Upload');
console.log(`4. Upload this file:`);
console.log(`   ${path.join(auditDir, 'Melville_Ceilings_Spacing_Audit.csv')}\n`);

console.log('Method 2: Copy data directly\n');
console.log('Option A - Direct paste:');
console.log(`1. Open this file in a text editor:`);
console.log(`   ${path.join(auditDir, 'audit-results.tsv')}`);
console.log('2. Select All (Ctrl+A) → Copy (Ctrl+C)');
console.log('3. Go to Google Sheets → Create new sheet');
console.log('4. Click cell A1, then Paste (Ctrl+V)\n');

console.log('Option B - Share link:');
console.log('Once created in Google Sheets, you can share the link with your team.\n');

console.log('Summary:');
console.log(`  • Total issues: ${rows.length - 1}`);
console.log(`  • Pages audited: 36`);
console.log(`  • Data location: ${auditDir}\n`);

console.log('CSV file is ready to import. Once in Google Sheets, you can:');
console.log('  ✓ Filter by Device (Mobile/Desktop/Both)');
console.log('  ✓ Filter by Page URL');
console.log('  ✓ Filter by Section');
console.log('  ✓ Share with your developer team');
console.log('  ✓ Track which issues have been fixed\n');

console.log('═'.repeat(100) + '\n');
