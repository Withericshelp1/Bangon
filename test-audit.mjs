import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const auditDir = path.join(__dirname, 'Melville Ceilings Spacing Audit');
const screenshotsDir = path.join(auditDir, 'screenshots');

// Create directories
if (!fs.existsSync(auditDir)) fs.mkdirSync(auditDir, { recursive: true });
if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });

// TEST: Just the homepage
const urls = [
  'https://apexmarketingservices.net/melvilleceilings/',
];

const viewports = [
  { name: 'Desktop', width: 1440, height: 900 },
  { name: 'Mobile', width: 390, height: 844 }
];

const findings = [];

async function analyzeSpacing(page, viewport) {
  try {
    await page.waitForTimeout(2000);

    const spacingData = await page.evaluate(() => {
      const issues = [];

      const measureGap = (el1, el2) => {
        const rect1 = el1.getBoundingClientRect();
        const rect2 = el2.getBoundingClientRect();
        return rect2.top - (rect1.top + rect1.height);
      };

      // Check cards
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
              elementCount: cards.length,
              gaps: gaps,
              inconsistency: maxGap - minGap,
              avgGap: Math.round(gaps.reduce((a,b) => a+b) / gaps.length)
            });
          }
        }
      }

      // Check sections
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
              elementCount: sections.length,
              gaps: gaps,
              inconsistency: maxGap - minGap,
              avgGap: Math.round(gaps.reduce((a,b) => a+b) / gaps.length)
            });
          }
        }
      }

      // Check images
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
                elementCount: images.length,
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
    console.error(`Error analyzing spacing: ${error.message}`);
    return [];
  }
}

async function runAudit() {
  const browser = await chromium.launch({ headless: true });
  console.log(`\nTEST AUDIT: Homepage only\n`);

  for (const url of urls) {
    const pageName = 'Melville Ceilings Home';

    for (const viewport of viewports) {
      try {
        console.log(`Loading ${pageName} (${viewport.name})...`);

        const context = await browser.newContext({
          viewport: { width: viewport.width, height: viewport.height },
          ignoreHTTPSErrors: true
        });

        const page = await context.newPage();
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});

        // Take screenshot
        const fileName = `01_home_${viewport.name.toLowerCase()}.png`;
        const screenshotPath = path.join(screenshotsDir, fileName);
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`  ✓ Screenshot: ${fileName}`);

        // Analyze spacing
        const issues = await analyzeSpacing(page, viewport);

        for (const issue of issues) {
          const record = {
            pageName,
            url,
            section: issue.section,
            description: `${issue.section}: gaps vary from ${Math.min(...issue.gaps)}px to ${Math.max(...issue.gaps)}px (deviation: ${issue.inconsistency}px, avg: ${issue.avgGap}px)`,
            device: viewport.name,
            priority: issue.inconsistency > 24 ? 'High' : 'Medium',
            screenshot: fileName
          };
          findings.push(record);
          console.log(`  ⚠ Issue found: ${record.description} (${record.priority})`);
        }

        if (issues.length === 0) {
          console.log(`  ✓ No spacing inconsistencies found`);
        }

        await context.close();
      } catch (error) {
        console.error(`Error: ${error.message}`);
      }
    }
  }

  await browser.close();
  return findings;
}

// Run test audit
const results = await runAudit();

// Save results
fs.writeFileSync(path.join(auditDir, 'test-findings.json'), JSON.stringify(results, null, 2));

console.log(`\n✓ Test audit complete`);
console.log(`✓ Found ${results.length} issues`);
console.log(`✓ Screenshots saved to: ${screenshotsDir}`);
console.log(`\nResults:`, results);
