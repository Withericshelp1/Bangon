import { chromium } from '@playwright/test';

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
  { name: 'Desktop', width: 1440 },
  { name: 'Mobile', width: 390 }
];

async function analyzeSpacingRefined(page, viewport) {
  await page.waitForTimeout(2500);

  const spacingData = await page.evaluate(() => {
    const issues = [];

    const measureGap = (el1, el2) => {
      const rect1 = el1.getBoundingClientRect();
      const rect2 = el2.getBoundingClientRect();
      return Math.round((rect2.top - (rect1.top + rect1.height)) * 10) / 10;
    };

    // Suburb button boxes
    const suburbbuttonLinks = Array.from(document.querySelectorAll('a.elementor-button'));
    const suburbLinks = suburbbuttonLinks.filter(a => {
      const text = a.innerText?.toLowerCase() || '';
      const suburbNames = ['dalkeith', 'peppermint', 'nedlands', 'claremont', 'mosman', 'cottesloe',
                          'subiaco', 'south perth', 'applecross', 'mount lawley', 'floreat', 'wembley',
                          'swanbourne', 'north perth', 'shenton', 'bateman', 'bicton', 'victoria', 'fremantle', 'leederville'];
      return suburbNames.some(s => text.includes(s));
    });

    if (suburbLinks.length >= 3) {
      const gaps = [];

      for (let i = 0; i < Math.min(suburbLinks.length - 1, 20); i++) {
        const gap = measureGap(suburbLinks[i], suburbLinks[i + 1]);
        if (gap >= -5 && gap < 200) {
          gaps.push(gap);
        }
      }

      if (gaps.length >= 3) {
        const minGap = Math.min(...gaps);
        const maxGap = Math.max(...gaps);
        const deviation = maxGap - minGap;

        if (deviation > 2) {
          issues.push({
            section: 'We actively service the following suburbs of Perth',
            issue: `Suburb boxes have inconsistent spacing (gaps vary from ${minGap}px to ${maxGap}px)`
          });
        }
      }
    }

    // CTA button groups - check spacing below
    const allCTAButtons = Array.from(document.querySelectorAll('a.elementor-button'));
    const callSendButtons = allCTAButtons.filter(b => {
      const text = (b.innerText || '').toLowerCase();
      return (text.includes('call') || text.includes('send'));
    });

    let processedSections = new Set();

    for (let i = 0; i < callSendButtons.length - 1; i++) {
      const btn1 = callSendButtons[i];
      const btn2 = callSendButtons[i + 1];
      const rect1 = btn1.getBoundingClientRect();
      const rect2 = btn2.getBoundingClientRect();

      // Check if buttons are vertically stacked
      if (Math.abs(rect1.left - rect2.left) < 100 && rect2.top > rect1.top) {
        const gapBetween = measureGap(btn1, btn2);

        if (gapBetween >= 0 && gapBetween <= 60) {
          // Find section heading
          let sectionHeading = null;
          let current = btn2;
          for (let d = 0; d < 30; d++) {
            current = current.parentElement;
            if (!current) break;
            const h2 = current.querySelector('h2, h3, h4');
            if (h2) {
              sectionHeading = h2.innerText.trim();
              break;
            }
          }

          if (sectionHeading && !processedSections.has(sectionHeading)) {
            issues.push({
              section: sectionHeading,
              issue: `Padding below the call and send buttons are not consistent with the rest of the page (barely any space beneath)`
            });
            processedSections.add(sectionHeading);
          }
        }
      }
    }

    // Image spacing
    const images = document.querySelectorAll('img');
    if (images.length >= 2) {
      const gaps = [];

      for (let i = 0; i < Math.min(images.length - 1, 12); i++) {
        const gap = measureGap(images[i], images[i + 1]);
        gaps.push(gap);
      }

      if (gaps.length >= 2) {
        const minGap = Math.min(...gaps);
        const maxGap = Math.max(...gaps);
        const deviation = maxGap - minGap;

        if (deviation > 50) {
          issues.push({
            section: 'Gallery / Image Section',
            issue: `Images have inconsistent spacing (gaps vary from ${minGap}px to ${maxGap}px)`
          });
        }
      }
    }

    return issues;
  });

  return spacingData;
}

async function runAudit() {
  const browser = await chromium.launch({ headless: true });

  const allIssues = [];
  let pageCount = 0;
  const totalPages = urls.length * viewports.length;

  for (const testUrl of urls) {
    const pageName = testUrl.split('/').filter(Boolean).pop() || 'home';

    for (const viewport of viewports) {
      pageCount++;
      process.stdout.write(`[${pageCount}/${totalPages}] ${pageName.substring(0, 30).padEnd(30)} (${viewport.name})... `);

      try {
        const context = await browser.newContext({
          viewport: { width: viewport.width, height: 900 },
          ignoreHTTPSErrors: true
        });

        const page = await context.newPage();

        try {
          await page.goto(testUrl, { waitUntil: 'networkidle', timeout: 35000 });
        } catch (navError) {
          console.log('⚠');
          await context.close();
          continue;
        }

        const issues = await analyzeSpacingRefined(page, viewport);

        issues.forEach(issue => {
          allIssues.push({
            url: testUrl,
            viewport: viewport.name,
            ...issue
          });
        });

        console.log(`✓ (${issues.length})`);
        await context.close();
      } catch (error) {
        console.log('✗');
      }
    }
  }

  await browser.close();

  // Save to file for Google Sheets
  const fs = await import('fs');
  const path = await import('path');
  const auditDir = path.default.join(process.cwd(), 'Melville Ceilings Spacing Audit');

  if (!fs.default.existsSync(auditDir)) {
    fs.default.mkdirSync(auditDir, { recursive: true });
  }

  fs.default.writeFileSync(
    path.default.join(auditDir, 'audit-data.json'),
    JSON.stringify(allIssues, null, 2)
  );

  // Print in simple format
  console.log('\n' + '═'.repeat(100));
  console.log('AUDIT COMPLETE - ' + allIssues.length + ' issues found');
  console.log('═'.repeat(100) + '\n');

  if (allIssues.length === 0) {
    console.log('No spacing issues found.\n');
  } else {
    // Group by URL and section
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
      console.log('PAGE: ' + url);
      Object.entries(sections).forEach(([section, data]) => {
        const viewportLabel = data.viewports.includes('Desktop') && data.viewports.includes('Mobile')
          ? 'Both'
          : data.viewports[0];

        console.log('SECTION: ' + section);
        console.log('ISSUE: ' + data.issue);
        console.log('DEVICE: ' + viewportLabel);
        console.log('');
      });
      console.log('');
    });
  }

  console.log('Data saved to: ' + auditDir);
  console.log('\nNext: Creating Google Sheet...\n');
}

runAudit().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
