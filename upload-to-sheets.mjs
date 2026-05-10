import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { google } from 'googleapis';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const auditDir = path.join(__dirname, 'Melville Ceilings Spacing Audit');
const dataFile = path.join(auditDir, 'audit-data.json');

if (!fs.existsSync(dataFile)) {
  console.error('✗ audit-data.json not found. Run spacing-audit.mjs first.\n');
  process.exit(1);
}

const findings = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));

// Check for credentials
const credentialsPath = path.join(process.env.HOME || process.env.USERPROFILE, '.google', 'credentials.json');
const tokenPath = path.join(process.env.HOME || process.env.USERPROFILE, '.google', 'token.json');

if (!fs.existsSync(credentialsPath)) {
  console.log('\n⚠️  Google credentials not found.\n');
  console.log('Setup Instructions:');
  console.log('1. Visit: https://console.cloud.google.com/');
  console.log('2. Create an OAuth 2.0 credential (Desktop app)');
  console.log('3. Download as credentials.json');
  console.log(`4. Save to: ${credentialsPath}\n`);
  console.log('For now, generating CSV file...\n');

  generateCSV(findings);
  process.exit(0);
}

async function getAuthClient() {
  const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf-8'));
  const { client_id, client_secret, redirect_uris } = credentials.installed || credentials.web;

  const oauth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  if (fs.existsSync(tokenPath)) {
    const token = JSON.parse(fs.readFileSync(tokenPath, 'utf-8'));
    oauth2Client.setCredentials(token);
  } else {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/spreadsheets'],
    });

    console.log('Authorize this app by visiting this url:', authUrl);
    console.log('\nNote: For automated uploads, use service account credentials instead.\n');
    process.exit(1);
  }

  return oauth2Client;
}

function generateCSV(findings) {
  const headers = ['#', 'Page Name', 'Page URL', 'Section', 'Issue Description', 'Device', 'Priority', 'Actioned'];
  const rows = findings.map((f, i) => [
    i + 1,
    f.pageName,
    f.url,
    f.section,
    f.description,
    f.device,
    f.priority,
    ''
  ]);

  const csv = [headers, ...rows].map(row =>
    row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
  ).join('\n');

  const csvPath = path.join(auditDir, 'Melville_Ceilings_Spacing_Audit.csv');
  fs.writeFileSync(csvPath, csv);

  console.log(`✓ CSV generated: ${csvPath}`);
  console.log(`\nTo create Google Sheet from CSV:`);
  console.log(`1. Open https://sheets.google.com`);
  console.log(`2. Click "+ New Blank spreadsheet"`);
  console.log(`3. File → Import → Select the CSV file`);
  console.log(`4. Move to folder: https://drive.google.com/drive/folders/1YMo7P-8CMOYX0WluwwHRC1lHxKHEmTdR\n`);
}

async function uploadToGoogleSheets(auth, findings) {
  const sheets = google.sheets({ version: 'v4', auth });
  const drive = google.drive({ version: 'v3', auth });

  try {
    // Create spreadsheet
    const spreadsheet = await sheets.spreadsheets.create({
      requestBody: {
        properties: {
          title: 'Melville Ceilings - Spacing Audit',
          locale: 'en_US',
        },
      },
    });

    const spreadsheetId = spreadsheet.data.spreadsheetId;
    console.log(`✓ Created spreadsheet: ${spreadsheetId}`);

    // Prepare data
    const headers = [['#', 'Page Name', 'Page URL', 'Section', 'Issue Description', 'Device', 'Priority', 'Actioned']];
    const rows = findings.map((f, i) => [
      i + 1,
      f.pageName,
      f.url,
      f.section,
      f.description,
      f.device,
      f.priority,
      ''
    ]);

    // Update cells
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'Sheet1!A1',
      valueInputOption: 'RAW',
      requestBody: {
        values: [...headers, ...rows],
      },
    });

    console.log(`✓ Populated ${findings.length} rows`);

    // Format header
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            repeatCell: {
              range: {
                sheetId: 0,
                startRowIndex: 0,
                endRowIndex: 1,
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: { red: 0.122, green: 0.306, blue: 0.47 },
                  textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } },
                },
              },
              fields: 'userEnteredFormat',
            },
          },
        ],
      },
    });

    console.log(`✓ Formatted header row`);

    // Move to folder
    const folderId = '1YMo7P-8CMOYX0WluwwHRC1lHxKHEmTdR';
    await drive.files.update({
      fileId: spreadsheetId,
      addParents: folderId,
      fields: 'id, parents',
    });

    console.log(`✓ Moved to Google Drive folder\n`);
    console.log(`📊 View spreadsheet: https://docs.google.com/spreadsheets/d/${spreadsheetId}\n`);

    return spreadsheetId;
  } catch (error) {
    console.error('✗ Error:', error.message);
    console.log('\nFalling back to CSV generation...\n');
    generateCSV(findings);
  }
}

try {
  const auth = await getAuthClient();
  await uploadToGoogleSheets(auth, findings);
} catch (error) {
  console.log('\n✗ Could not authenticate with Google.\n');
  console.log('Generating CSV as fallback...\n');
  generateCSV(findings);
}
