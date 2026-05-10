import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const auditDir = path.join(__dirname, 'Melville Ceilings Spacing Audit');
const findingsPath = path.join(auditDir, 'audit-findings.json');

if (!fs.existsSync(findingsPath)) {
  console.error('No audit findings found. Run spacing-audit.mjs first.');
  process.exit(1);
}

const findings = JSON.parse(fs.readFileSync(findingsPath, 'utf-8'));

// Create workbook
const workbook = XLSX.utils.book_new();

// Prepare data for sheet
const data = [
  ['#', 'Page Name', 'Page URL', 'Section / Location', 'Issue Description', 'Device', 'Priority', 'Actioned', 'Screenshot Reference']
];

findings.forEach((finding, index) => {
  data.push([
    index + 1,
    finding.pageName,
    finding.url,
    finding.section,
    finding.description,
    finding.device,
    finding.priority,
    '', // Actioned - left blank for developer
    finding.screenshot || ''
  ]);
});

// Create worksheet
const worksheet = XLSX.utils.aoa_to_sheet(data);

// Set column widths
worksheet['!cols'] = [
  { wch: 4 },
  { wch: 25 },
  { wch: 50 },
  { wch: 25 },
  { wch: 60 },
  { wch: 12 },
  { wch: 12 },
  { wch: 15 },
  { wch: 40 }
];

// Set the header row with formatting
const headerFill = { fgColor: { rgb: 'C6E0B4' } }; // Light green
for (let col = 0; col < 9; col++) {
  const cellRef = XLSX.utils.encode_col(col) + '1';
  worksheet[cellRef].fill = headerFill;
  worksheet[cellRef].font = { bold: true };
}

// Set the Actioned column with light green background for all data rows
for (let row = 2; row <= data.length; row++) {
  const cellRef = XLSX.utils.encode_col(7) + row; // Column H (Actioned)
  if (!worksheet[cellRef]) {
    worksheet[cellRef] = {};
  }
  worksheet[cellRef].fill = { fgColor: { rgb: 'E2EFDA' } }; // Very light green
}

// Add worksheet to workbook
XLSX.utils.book_append_sheet(workbook, worksheet, 'Spacing Issues');

// Save workbook
const outputPath = path.join(auditDir, 'Melville_Ceilings_Spacing_Audit.xlsx');
XLSX.writeFile(workbook, outputPath);

console.log(`✓ Excel file generated: ${outputPath}`);
console.log(`✓ Total issues found: ${findings.length}`);
console.log(`✓ High priority issues: ${findings.filter(f => f.priority === 'High').length}`);
console.log(`✓ Medium priority issues: ${findings.filter(f => f.priority === 'Medium').length}`);
