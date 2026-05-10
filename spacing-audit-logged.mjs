import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const auditDir = path.join(__dirname, 'Melville Ceilings Spacing Audit');
const screenshotsDir = path.join(auditDir, 'screenshots');
const logFile = path.join(auditDir, 'audit-progress.log');

function log(msg) {
  const timestamp = new Date().toISOString();
  const logMsg = `[${timestamp}] ${msg}`;
  console.log(logMsg);
  fs.appendFileSync(logFile, logMsg + '\n');
}

if (!fs.existsSync(auditDir)) fs.mkdirSync(auditDir, { recursive: true });
if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });
fs.writeFileSync(logFile, `Audit started at ${new Date().toISOString()}\n`);

const urls = [
  'https://apexmarketingservices.net/melvilleceilings/',
  'https://apexmarketingservices.net/melvilleceilings/ceiling-repairs-perth/',
  'https://apexmarketingservices.net/melvilleceilings/ceiling-crack-repair-perth/',
  'https://apexmarketingservices.net/melvilleceilings/ceiling-replacement-perth/',
  'https://apexmarketingservices.net/melvilleceilings/ceiling-replacement-cost-perth/',
  'https://apexmarketingservices.net/melvilleceilings/emergency-ceiling-repairs-perth/',
  'https://apexmarketingservices.net/melvilleceilings/plasterboard-ceiling-repairs-perth/',
  'https://apexmarketingservices.net/melvilleceilings/water-damage-ceiling-repairs-perth/',
  'https://apexmarketingservices.net/melvilleceilings/sagging-ceiling-repairs-perth/',
  'https://apexmarketingservices.net/melvilleceilings/emergency-ceiling-replacement-perth/',
  'https://apexmarketingservices.net/melvilleceilings/wall-repairs-perth/',
  'https://apexmarketingservices.net/melvilleceilings/cornice-repairs-perth/',
  'https://apexmarketingservices.net/melvilleceilings/wall-and-ceiling-repair-perth/',
  'https://apexmarketingservices.net/melvilleceilings/ceiling-gallery/',
  'https://apexmarketingservices.net/melvilleceilings/blog/',
  'https://apexmarketingservices.net/melvilleceilings/contact/',
  'https://apexmarketingservices.net/melvilleceilings/ceiling-repair-dalkeith/',
  'https://apexmarketingservices.net/melvilleceilings/ceiling-repair-peppermint-grove/',
  'https://apexmarketingservices.net/melvilleceilings/ceiling-repair-nedlands/',
  'https://apexmarketingservices.net/melvilleceilings/ceiling-repair-claremont/',
  'https://apexmarketingservices.net/melvilleceilings/ceiling-repair-mosman-park/',
  'https://apexmarketingservices.net/melvilleceilings/ceiling-repair-cottesloe/',
  'https://apexmarketingservices.net/melvilleceilings/ceiling-repair-subiaco/',
  'https://apexmarketingservices.net/melvilleceilings/ceiling-repair-south-perth/',
  'https://apexmarketingservices.net/melvilleceilings/ceiling-repair-applecross/',
  'https://apexmarketingservices.net/melvilleceilings/ceiling-repair-mount-lawley/',
  'https://apexmarketingservices.net/melvilleceilings/ceiling-repair-floreat/',
  'https://apexmarketingservices.net/melvilleceilings/ceiling-repair-wembley/',
  'https://apexmarketingservices.net/melvilleceilings/ceiling-repair-swanbourne/',
  'https://apexmarketingservices.net/melvilleceilings/ceiling-repair-north-perth/',
  'https://apexmarketingservices.net/melvilleceilings/ceiling-repair-shenton-park/',
  'https://apexmarketingservices.net/melvilleceilings/ceiling-repair-bateman/',
  'https://apexmarketingservices.net/melvilleceilings/ceiling-repair-bicton/',
  'https://apexmarketingservices.net/melvilleceilings/ceiling-repair-victoria-park/',
  'https://apexmarketingservices.net/melvilleceilings/ceiling-repair-fremantle/',
  'https://apexmarketingservices.net/melvilleceilings/ceiling-repair-leederville/',
];

const viewports = [
  { name: 'Desktop', width: 1440, height: 900 },
  { name: 'Mobile', width: 390, height: 844 }
];

const findings = [];
let pageCount = 0;
let totalToProcess = urls.length * viewports.length;

async function analyzeSpacing(page) {
  try {
    await page.waitForTimeout(1500);

    const spacingData = await page.evaluate(() => {
      const issues = [];
      const measureGap = (el1, el2) => {
        const rect1 = el1.getBoundingClientRect();
        const rect2 = el2.getBoundingClientRect();
        return rect2.top - (rect1.top + rect1.height);
      };

      const cards = document.querySelectorAll('[class*="card"], [class*="box"], [class*="item"]');
      if (cards.length >= 2) {
        const gaps = [];
        for (let i = 0; i < cards.length - 1; i++) {
          const gap = measureGap(cards[i], cards[i + 1]);
          if (gap > 0 && gap < 500) gaps.push(gap);
        }
        if (gaps.length >= 2) {
          const minGap = Math.min(...gaps);
          const maxGap = Math.max(...gaps);
          if (maxGap - minGap > 8) {
            issues.push({
              section: 'Cards/Boxes',
              gaps: gaps,
              inconsistency: maxGap - minGap,
              avgGap: Math.round(gaps.reduce((a,b) => a+b) / gaps.length)
            });
          }
        }
      }

      const sections = document.querySelectorAll('section, [class*="section"]');
      if (sections.length >= 2) {
        const gaps = [];
        for (let i = 0; i < sections.length - 1; i++) {
          const gap = measureGap(sections[i], sections[i + 1]);
          if (gap > 0 && gap < 500) gaps.push(gap);
        }
        if (gaps.length >= 2) {
          const minGap = Math.min(...gaps);
          const maxGap = Math.max(...gaps);
          if (maxGap - minGap > 8) {
            issues.push({
              section: 'Section-to-Section Gaps',
              gaps: gaps,
              inconsistency: maxGap - minGap,
              avgGap: Math.round(gaps.reduce((a,b) => a+b) / gaps.length)
            });
          }
        }
      }

      const images = document.querySelectorAll('img');
      if (images.length >= 2) {
        const gaps = [];
        for (let i = 0; i < images.length - 1; i++) {
          const gap = measureGap(images[i], images[i + 1]);
          if (gap > -100 && gap < 500) gaps.push(gap);
        }
        if (gaps.length >= 2) {
          const validGaps = gaps.filter(g => g > 0);
          if (validGaps.length >= 2) {
            const minGap = Math.min(...validGaps);
            const maxGap = Math.max(...validGaps);
            if (maxGap - minGap > 8) {
              issues.push({
                section: 'Images',
                gaps: validGaps,
                inconsistency: maxGap - minGap,
                avgGap: Math.round(validGaps.reduce((a,b) => a+b) / validGaps.length)
              });
            }
          }
        }
      }

      return issues;
    });

    return spacingData;
  } catch (error) {
    log(`  Error analyzing spacing: ${error.message}`);
    return [];
  }
}

async function runAudit() {
  const browser = await chromium.launch({ headless: true });
  log(`Audit started: ${urls.length} pages × 2 viewports = ${totalToProcess} total loads`);

  for (let urlIndex = 0; urlIndex < urls.length; urlIndex++) {
    const url = urls[urlIndex];
    const pageName = url.split('/').filter(Boolean).pop() || 'Home';

    for (const viewport of viewports) {
      pageCount++;
      const progress = `${pageCount}/${totalToProcess}`;

      try {
        log(`[${progress}] Loading ${pageName} (${viewport.name})`);

        const context = await browser.newContext({
          viewport: { width: viewport.width, height: viewport.height },
          ignoreHTTPSErrors: true
        });

        const page = await context.newPage();

        try {
          await page.goto(url, { waitUntil: 'networkidle', timeout: 25000 });
        } catch (navError) {
          log(`  Warning: Navigation timeout, continuing with partial load`);
        }

        const fileName = `${pageCount.toString().padStart(3, '0')}_${pageName.slice(0, 25)}_${viewport.name.toLowerCase()}.png`;
        const screenshotPath = path.join(screenshotsDir, fileName);
        await page.screenshot({ path: screenshotPath, fullPage: true });

        const issues = await analyzeSpacing(page);

        for (const issue of issues) {
          findings.push({
            pageName,
            url,
            section: issue.section,
            description: `${issue.section}: gaps vary from ${Math.min(...issue.gaps)}px to ${Math.max(...issue.gaps)}px (deviation: ${issue.inconsistency}px)`,
            device: viewport.name,
            priority: issue.inconsistency > 24 ? 'High' : 'Medium',
            screenshot: fileName
          });
          log(`  ⚠ Issue: ${issue.section} (${issue.inconsistency}px deviation)`);
        }

        if (issues.length === 0) {
          log(`  ✓ No issues`);
        }

        await context.close();
      } catch (error) {
        log(`  ✗ Error: ${error.message}`);
      }
    }
  }

  await browser.close();
  log(`Audit complete. Found ${findings.length} issues`);
  return findings;
}

const results = await runAudit();
fs.writeFileSync(path.join(auditDir, 'audit-findings.json'), JSON.stringify(results, null, 2));
log(`Results saved to audit-findings.json`);
