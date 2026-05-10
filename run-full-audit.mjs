#!/usr/bin/env node

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const NODE = process.execPath;

function runScript(scriptName) {
  return new Promise((resolve, reject) => {
    const proc = spawn(NODE, [path.join(__dirname, scriptName)], {
      stdio: 'inherit',
      shell: true
    });

    proc.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`${scriptName} exited with code ${code}`));
      } else {
        resolve();
      }
    });

    proc.on('error', reject);
  });
}

async function main() {
  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║  MELVILLE CEILINGS SPACING AUDIT SUITE     ║');
  console.log('║  Output: Google Sheets (Direct Upload)    ║');
  console.log('╚════════════════════════════════════════════╝\n');

  try {
    console.log('📊 Step 1: Running spacing audit...\n');
    await runScript('spacing-audit.mjs');

    console.log('\n\n📤 Step 2: Uploading to Google Sheets...\n');
    await runScript('upload-to-sheets.mjs');

    console.log('\n✅ AUDIT COMPLETE!\n');
    console.log('Your Google Sheet is ready in the folder:');
    console.log('https://drive.google.com/drive/folders/1YMo7P-8CMOYX0WluwwHRC1lHxKHEmTdR\n');

  } catch (error) {
    console.error('\n✗ Error:', error.message);
    process.exit(1);
  }
}

main();
