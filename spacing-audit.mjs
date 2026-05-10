import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const auditDir = path.join(__dirname, 'Melville Ceilings Spacing Audit');

if (!fs.existsSync(auditDir)) fs.mkdirSync(auditDir, { recursive: true });

const urls = [
  { name: 'Home', url: 'https://apexmarketingservices.net/melvilleceilings/' },
  { name: 'Ceiling Repairs', url: 'https://apexmarketingservices.net/melvilleceilings/ceiling-repairs-perth/' },
  { name: 'Ceiling Crack Repair', url: 'https://apexmarketingservices.net/melvilleceilings/ceiling-crack-repair-perth/' },
  { name: 'Ceiling Replacement', url: 'https://apexmarketingservices.net/melvilleceilings/ceiling-replacement-perth/' },
  { name: 'Ceiling Replacement Cost', url: 'https://apexmarketingservices.net/melvilleceilings/ceiling-replacement-cost-perth/' },
  { name: 'Emergency Ceiling Repairs', url: 'https://apexmarketingservices.net/melvilleceilings/emergency-ceiling-repairs-perth/' },
  { name: 'Plasterboard Repairs', url: 'https://apexmarketingservices.net/melvilleceilings/plasterboard-ceiling-repairs-perth/' },
  { name: 'Water Damage Repairs', url: 'https://apexmarketingservices.net/melvilleceilings/water-damage-ceiling-repairs-perth/' },
  { name: 'Sagging Ceiling Repairs', url: 'https://apexmarketingservices.net/melvilleceilings/sagging-ceiling-repairs-perth/' },
  { name: 'Emergency Ceiling Replacement', url: 'https://apexmarketingservices.net/melvilleceilings/emergency-ceiling-replacement-perth/' },
  { name: 'Wall Repairs', url: 'https://apexmarketingservices.net/melvilleceilings/wall-repairs-perth/' },
  { name: 'Cornice Repairs', url: 'https://apexmarketingservices.net/melvilleceilings/cornice-repairs-perth/' },
  { name: 'Wall and Ceiling Repair', url: 'https://apexmarketingservices.net/melvilleceilings/wall-and-ceiling-repair-perth/' },
  { name: 'Ceiling Gallery', url: 'https://apexmarketingservices.net/melvilleceilings/ceiling-gallery/' },
  { name: 'Blog', url: 'https://apexmarketingservices.net/melvilleceilings/blog/' },
  { name: 'Contact', url: 'https://apexmarketingservices.net/melvilleceilings/contact/' },
  { name: 'Dalkeith', url: 'https://apexmarketingservices.net/melvilleceilings/ceiling-repair-dalkeith/' },
  { name: 'Peppermint Grove', url: 'https://apexmarketingservices.net/melvilleceilings/ceiling-repair-peppermint-grove/' },
  { name: 'Nedlands', url: 'https://apexmarketingservices.net/melvilleceilings/ceiling-repair-nedlands/' },
  { name: 'Claremont', url: 'https://apexmarketingservices.net/melvilleceilings/ceiling-repair-claremont/' },
  { name: 'Mosman Park', url: 'https://apexmarketingservices.net/melvilleceilings/ceiling-repair-mosman-park/' },
  { name: 'Cottesloe', url: 'https://apexmarketingservices.net/melvilleceilings/ceiling-repair-cottesloe/' },
  { name: 'Subiaco', url: 'https://apexmarketingservices.net/melvilleceilings/ceiling-repair-subiaco/' },
  { name: 'South Perth', url: 'https://apexmarketingservices.net/melvilleceilings/ceiling-repair-south-perth/' },
  { name: 'Applecross', url: 'https://apexmarketingservices.net/melvilleceilings/ceiling-repair-applecross/' },
  { name: 'Mount Lawley', url: 'https://apexmarketingservices.net/melvilleceilings/ceiling-repair-mount-lawley/' },
  { name: 'Floreat', url: 'https://apexmarketingservices.net/melvilleceilings/ceiling-repair-floreat/' },
  { name: 'Wembley', url: 'https://apexmarketingservices.net/melvilleceilings/ceiling-repair-wembley/' },
  { name: 'Swanbourne', url: 'https://apexmarketingservices.net/melvilleceilings/ceiling-repair-swanbourne/' },
  { name: 'North Perth', url: 'https://apexmarketingservices.net/melvilleceilings/ceiling-repair-north-perth/' },
  { name: 'Shenton Park', url: 'https://apexmarketingservices.net/melvilleceilings/ceiling-repair-shenton-park/' },
  { name: 'Bateman', url: 'https://apexmarketingservices.net/melvilleceilings/ceiling-repair-bateman/' },
  { name: 'Bicton', url: 'https://apexmarketingservices.net/melvilleceilings/ceiling-repair-bicton/' },
  { name: 'Victoria Park', url: 'https://apexmarketingservices.net/melvilleceilings/ceiling-repair-victoria-park/' },
  { name: 'Fremantle', url: 'https://apexmarketingservices.net/melvilleceilings/ceiling-repair-fremantle/' },
  { name: 'Leederville', url: 'https://apexmarketingservices.net/melvilleceilings/ceiling-repair-leederville/' },
];

const viewports = [
  { name: 'Desktop', width: 1440 },
  { name: 'Mobile', width: 390 }
];

const findings = [];
let pageCount = 0;
let totalPages = urls.length * viewports.length;

async function analyzeSpacing(page, viewport) {
  try {
    await page.waitForTimeout(1500);

    const spacingData = await page.evaluate(() => {
      const issues = [];

      const measureGap = (el1, el2) => {
        const rect1 = el1.getBoundingClientRect();
        const rect2 = el2.getBoundingClientRect();
        return rect2.top - (rect1.top + rect1.height);
      };

      // Check cards
      const cards = document.querySelectorAll('[class*="card"], [class*="box"], [class*="item"], [class*="service"]');
      if (cards.length >= 2) {
        const gaps = [];
        for (let i = 0; i < Math.min(cards.length - 1, 10); i++) {
          const gap = measureGap(cards[i], cards[i + 1]);
          if (gap > -50 && gap < 500) gaps.push(gap);
        }
        if (gaps.length >= 2) {
          const minGap = Math.min(...gaps);
          const maxGap = Math.max(...gaps);
          const deviation = maxGap - minGap;
          if (deviation > 8) {
            issues.push({
              section: 'Cards/Boxes',
              minGap: Math.round(minGap * 10) / 10,
              maxGap: Math.round(maxGap * 10) / 10,
              deviation: Math.round(deviation * 10) / 10
            });
          }
        }
      }

      // Check sections
      const sections = document.querySelectorAll('section, [class*="section"]');
      if (sections.length >= 2) {
        const gaps = [];
        for (let i = 0; i < Math.min(sections.length - 1, 8); i++) {
          const gap = measureGap(sections[i], sections[i + 1]);
          if (gap > -50 && gap < 500) gaps.push(gap);
        }
        if (gaps.length >= 2) {
          const minGap = Math.min(...gaps);
          const maxGap = Math.max(...gaps);
          const deviation = maxGap - minGap;
          if (deviation > 8) {
            issues.push({
              section: 'Sections',
              minGap: Math.round(minGap * 10) / 10,
              maxGap: Math.round(maxGap * 10) / 10,
              deviation: Math.round(deviation * 10) / 10
            });
          }
        }
      }

      // Check images
      const images = document.querySelectorAll('img');
      if (images.length >= 2) {
        const gaps = [];
        for (let i = 0; i < Math.min(images.length - 1, 10); i++) {
          const gap = measureGap(images[i], images[i + 1]);
          if (gap > -50 && gap < 500) gaps.push(gap);
        }
        if (gaps.length >= 2) {
          const minGap = Math.min(...gaps);
          const maxGap = Math.max(...gaps);
          const deviation = maxGap - minGap;
          if (deviation > 8) {
            issues.push({
              section: 'Images',
              minGap: Math.round(minGap * 10) / 10,
              maxGap: Math.round(maxGap * 10) / 10,
              deviation: Math.round(deviation * 10) / 10
            });
          }
        }
      }

      return issues;
    });

    return spacingData;
  } catch (error) {
    return [];
  }
}

async function runAudit() {
  const browser = await chromium.launch({ headless: true });

  console.log(`\n${'='.repeat(70)}`);
  console.log('MELVILLE CEILINGS - SPACING AUDIT');
  console.log(`${'='.repeat(70)}\n`);
  console.log(`Pages: ${urls.length} | Viewports: 2 | Total scans: ${totalPages}\n`);

  for (const pageData of urls) {
    for (const viewport of viewports) {
      pageCount++;
      process.stdout.write(`[${pageCount}/${totalPages}] ${pageData.name.padEnd(25)} (${viewport.name})... `);

      try {
        const context = await browser.newContext({
          viewport: { width: viewport.width, height: 900 },
          ignoreHTTPSErrors: true
        });

        const page = await context.newPage();

        try {
          await page.goto(pageData.url, { waitUntil: 'networkidle', timeout: 30000 });
        } catch {
          console.log('⚠');
          await context.close();
          continue;
        }

        const issues = await analyzeSpacing(page, viewport);

        if (issues.length === 0) {
          console.log('✓');
        } else {
          console.log(`✗ (${issues.length})`);

          for (const issue of issues) {
            findings.push({
              pageName: pageData.name,
              url: pageData.url,
              section: issue.section,
              device: viewport.name,
              minGap: issue.minGap,
              maxGap: issue.maxGap,
              deviation: issue.deviation,
              description: `Gaps: ${issue.minGap}px - ${issue.maxGap}px (deviation: ${issue.deviation}px)`,
              priority: issue.deviation > 24 ? 'High' : 'Medium'
            });
          }
        }

        await context.close();
      } catch (error) {
        console.log('✗');
      }
    }
  }

  await browser.close();

  console.log(`\n${'='.repeat(70)}`);
  console.log(`✓ AUDIT COMPLETE - ${findings.length} issues found`);
  console.log(`${'='.repeat(70)}\n`);

  return findings;
}

const results = await runAudit();
fs.writeFileSync(path.join(auditDir, 'audit-data.json'), JSON.stringify(results, null, 2));
console.log(`Data saved to: ${auditDir}\n`);
