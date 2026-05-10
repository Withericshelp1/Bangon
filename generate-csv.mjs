import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const auditDir = path.join(__dirname, 'Melville Ceilings Spacing Audit');
const dataFile = path.join(auditDir, 'audit-data.json');

if (!fs.existsSync(dataFile)) {
  console.error('audit-data.json not found. Run trial-audit.mjs first.');
  process.exit(1);
}

const allIssues = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));

// Create CSV format
let csv = 'Page URL,Section,Issue,Device\n';

// Group by URL and section to avoid duplicates
const byUrl = {};
allIssues.forEach(issue => {
  if (!byUrl[issue.url]) {
    byUrl[issue.url] = {};
  }
  const key = issue.section;
  if (!byUrl[issue.url][key]) {
    byUrl[issue.url][key] = {
      issue: issue.issue,
      viewports: []
    };
  }
  if (!byUrl[issue.url][key].viewports.includes(issue.viewport)) {
    byUrl[issue.url][key].viewports.push(issue.viewport);
  }
});

Object.entries(byUrl).forEach(([url, sections]) => {
  Object.entries(sections).forEach(([section, data]) => {
    const viewportLabel = data.viewports.includes('Desktop') && data.viewports.includes('Mobile')
      ? 'Both'
      : data.viewports[0];

    const escapedUrl = `"${url}"`;
    const escapedSection = `"${section.replace(/"/g, '""')}"`;
    const escapedIssue = `"${data.issue.replace(/"/g, '""')}"`;

    csv += `${escapedUrl},${escapedSection},${escapedIssue},${viewportLabel}\n`;
  });
});

// Save CSV
const csvFile = path.join(auditDir, 'audit-results.csv');
fs.writeFileSync(csvFile, csv);

console.log(`✓ CSV created: ${csvFile}`);
console.log(`\nTotal unique issues: ${Object.values(byUrl).reduce((sum, sections) => sum + Object.keys(sections).length, 0)}`);
console.log(`\nTo import to Google Sheets:`);
console.log(`1. Open https://sheets.google.com`);
console.log(`2. Create new sheet or open existing`);
console.log(`3. File → Import → Upload → Select: audit-results.csv`);
console.log(`4. Choose: Replace spreadsheet`);
console.log(`5. Click Import\n`);
