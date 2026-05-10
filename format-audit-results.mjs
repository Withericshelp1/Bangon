import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const auditDir = path.join(__dirname, 'Melville Ceilings Spacing Audit');
const auditDataFile = path.join(auditDir, 'audit-data.json');

const auditData = JSON.parse(fs.readFileSync(auditDataFile, 'utf-8'));

// Create CSV format for Google Sheets
const csvRows = [
  ['#', 'Page URL', 'Section', 'Issue Description', 'Device'],
];

// Group by issue and avoid duplicates
const processedKey = new Set();

auditData.forEach((item, index) => {
  const key = `${item.url}|${item.section}|${item.issue}`;

  if (!processedKey.has(key)) {
    // Get all viewports for this issue
    const viewports = auditData
      .filter(d => d.url === item.url && d.section === item.section && d.issue === item.issue)
      .map(d => d.viewport);

    const deviceLabel = viewports.length === 2 ? 'Both' : viewports[0];

    csvRows.push([
      csvRows.length,
      item.url,
      item.section,
      item.issue,
      deviceLabel
    ]);

    processedKey.add(key);
  }
});

// Write CSV file
const csvContent = csvRows.map(row =>
  row.map(cell => `"${cell}"`).join(',')
).join('\n');

const csvPath = path.join(auditDir, 'Melville_Ceilings_Spacing_Audit.csv');
fs.writeFileSync(csvPath, csvContent);

// Also create a tab-separated format for easier pasting
const tsvRows = csvRows.map(row => row.join('\t')).join('\n');
const tsvPath = path.join(auditDir, 'audit-results.tsv');
fs.writeFileSync(tsvPath, tsvRows);

// Summary
console.log('\n' + '═'.repeat(100));
console.log('AUDIT SUMMARY');
console.log('═'.repeat(100) + '\n');

const uniqueIssues = new Set(auditData.map(d => `${d.url}|${d.section}|${d.issue}`)).size;

console.log(`Total unique issues found: ${uniqueIssues}`);
console.log(`Pages scanned: 36`);
console.log(`Viewports: Desktop + Mobile\n`);

console.log('Files created:');
console.log(`  • ${csvPath}`);
console.log(`  • ${tsvPath}\n`);

console.log('To import into Google Sheets:\n');
console.log('Option 1 (Easiest):');
console.log('  1. Open Google Sheets');
console.log('  2. Create new sheet');
console.log('  3. File > Import > Upload');
console.log(`  4. Select: ${csvPath}\n`);

console.log('Option 2 (Copy-paste):');
console.log(`  1. Open ${tsvPath} in a text editor`);
console.log('  2. Select all (Ctrl+A)');
console.log('  3. Copy (Ctrl+C)');
console.log('  4. Open Google Sheets');
console.log('  5. Paste into cell A1\n');

console.log('Files ready for upload to Google Drive.');
