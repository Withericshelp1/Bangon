import { chromium } from '@playwright/test';

const testUrl = 'https://apexmarketingservices.net/melvilleceilings/';

async function inspectPageStructure(page, viewport) {
  await page.waitForTimeout(2000);

  const structureData = await page.evaluate(() => {
    const findings = {
      suburbBoxes: [],
      buttonGroups: [],
      paragraphButtonGaps: [],
      imageSpacing: []
    };

    const measureGap = (el1, el2) => {
      const rect1 = el1.getBoundingClientRect();
      const rect2 = el2.getBoundingClientRect();
      return Math.round((rect2.top - (rect1.top + rect1.height)) * 10) / 10;
    };

    // SUBURB BOXES - inspect structure
    const allDivs = document.querySelectorAll('div, a, li, button');
    const suburbKeywords = ['dalkeith', 'claremont', 'cottesloe', 'subiaco', 'applecross',
                           'mosman park', 'south perth', 'peppermint grove', 'nedlands'];

    let suburbBoxCount = 0;
    for (const el of allDivs) {
      const text = el.innerText?.toLowerCase() || '';
      if (suburbKeywords.some(s => text.includes(s)) && text.length < 100 && el.offsetHeight > 30) {
        if (suburbBoxCount < 5) {
          const rect = el.getBoundingClientRect();
          findings.suburbBoxes.push({
            text: el.innerText?.trim().substring(0, 20),
            tagName: el.tagName,
            className: el.className.substring(0, 60),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
            top: Math.round(rect.top)
          });
          suburbBoxCount++;
        }
      }
    }

    // Calculate gaps between suburb boxes
    if (suburbBoxCount >= 2) {
      const suburbElements = Array.from(allDivs).filter(el => {
        const text = el.innerText?.toLowerCase() || '';
        return suburbKeywords.some(s => text.includes(s)) && text.length < 100;
      });

      const gaps = [];
      for (let i = 0; i < Math.min(suburbElements.length - 1, 5); i++) {
        const gap = measureGap(suburbElements[i], suburbElements[i + 1]);
        gaps.push({
          from: suburbElements[i].innerText?.trim().substring(0, 15),
          to: suburbElements[i + 1].innerText?.trim().substring(0, 15),
          gap: gap
        });
      }
      findings.suburbBoxes.gaps = gaps;
    }

    // BUTTON GROUPS - look for Call and Send Message buttons
    const buttons = Array.from(document.querySelectorAll('button, a[class*="button"], a[class*="btn"], [class*="cta"]'));
    const callButtons = buttons.filter(b => {
      const text = (b.innerText || '').toLowerCase();
      return text.includes('call') || text.includes('send') || text.includes('quote');
    });

    for (let i = 0; i < Math.min(callButtons.length, 5); i++) {
      const btn = callButtons[i];
      const rect = btn.getBoundingClientRect();
      const style = window.getComputedStyle(btn);

      findings.buttonGroups.push({
        text: btn.innerText?.trim().substring(0, 30),
        tagName: btn.tagName,
        className: btn.className.substring(0, 60),
        marginBottom: style.marginBottom,
        paddingBottom: style.paddingBottom,
        height: Math.round(rect.height),
        top: Math.round(rect.top)
      });

      // Check spacing to next element
      const nextEl = btn.nextElementSibling;
      if (nextEl) {
        const gap = measureGap(btn, nextEl);
        findings.buttonGroups[i].spacingBelow = gap;
        findings.buttonGroups[i].nextElementType = nextEl.tagName;
        findings.buttonGroups[i].nextElementClass = nextEl.className.substring(0, 40);
      }
    }

    // PARAGRAPH TO BUTTON GAPS
    const paragraphs = document.querySelectorAll('p');
    let pCount = 0;

    for (const para of paragraphs) {
      if (para.innerText.length < 50 || pCount >= 5) continue;

      // Find next button
      let nextBtn = null;
      let current = para;
      let steps = 0;

      while (current && steps < 10) {
        nextBtn = current.querySelector('button, [class*="button"], [class*="btn"]');
        if (nextBtn) break;

        current = current.nextElementSibling;
        steps++;
      }

      if (nextBtn) {
        const gap = measureGap(para, nextBtn);
        findings.paragraphButtonGaps.push({
          paraText: para.innerText.substring(0, 50),
          buttonText: nextBtn.innerText?.trim().substring(0, 20),
          gap: gap,
          stepsToButton: steps
        });
        pCount++;
      }
    }

    // IMAGE SPACING
    const images = document.querySelectorAll('img');
    if (images.length >= 2) {
      const imgGaps = [];
      for (let i = 0; i < Math.min(images.length - 1, 6); i++) {
        const gap = measureGap(images[i], images[i + 1]);
        imgGaps.push({
          index: `${i} → ${i + 1}`,
          alt1: images[i].alt?.substring(0, 15) || 'img',
          alt2: images[i + 1].alt?.substring(0, 15) || 'img',
          gap: gap
        });
      }
      findings.imageSpacing = imgGaps;
    }

    return findings;
  });

  return structureData;
}

function printFindings(findings, viewport) {
  console.log(`\n${'═'.repeat(100)}`);
  console.log(`${viewport.name.toUpperCase()} (${viewport.width}px) - PAGE STRUCTURE ANALYSIS`);
  console.log(`${'═'.repeat(100)}\n`);

  console.log(`📍 SUBURB BOXES`);
  console.log(`Found ${findings.suburbBoxes.length} examples:`);
  findings.suburbBoxes.forEach((box, i) => {
    console.log(`  ${i + 1}. "${box.text}" <${box.tagName}> (${box.width}x${box.height}px)`);
    console.log(`     Class: ${box.className}`);
  });
  if (findings.suburbBoxes.gaps) {
    console.log(`\n  Spacing between boxes:`);
    findings.suburbBoxes.gaps.forEach(g => {
      console.log(`    "${g.from}" → "${g.to}": ${g.gap}px`);
    });
  }

  console.log(`\n${'─'.repeat(100)}\n`);

  console.log(`🔘 BUTTON GROUPS`);
  console.log(`Found ${findings.buttonGroups.length} buttons:`);
  findings.buttonGroups.forEach((btn, i) => {
    console.log(`  ${i + 1}. "${btn.text}" <${btn.tagName}>`);
    console.log(`     Class: ${btn.className}`);
    console.log(`     Margin-bottom: ${btn.marginBottom} | Padding-bottom: ${btn.paddingBottom}`);
    if (btn.spacingBelow !== undefined) {
      console.log(`     Space below: ${btn.spacingBelow}px (to <${btn.nextElementType}>)`);
    }
  });

  console.log(`\n${'─'.repeat(100)}\n`);

  console.log(`📝 PARAGRAPH → BUTTON SPACING`);
  console.log(`Found ${findings.paragraphButtonGaps.length} paragraph-button pairs:`);
  findings.paragraphButtonGaps.forEach((pair, i) => {
    console.log(`  ${i + 1}. Para: "${pair.paraText.substring(0, 30)}..."`);
    console.log(`     Button: "${pair.buttonText}" (Gap: ${pair.gap}px, ${pair.stepsToButton} steps away)`);
  });

  console.log(`\n${'─'.repeat(100)}\n`);

  console.log(`🖼️  IMAGE SPACING`);
  console.log(`Found ${findings.imageSpacing.length} image gaps:`);
  findings.imageSpacing.forEach(img => {
    console.log(`  ${img.index}: "${img.alt1}" → "${img.alt2}": ${img.gap}px`);
  });

  console.log(`\n${'═'.repeat(100)}\n`);
}

async function runInspection() {
  const browser = await chromium.launch({ headless: true });

  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║     PAGE STRUCTURE INSPECTION - HOMEPAGE                ║');
  console.log('║     Melville Ceilings | apexmarketingservices.net       ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');

  for (const viewport of [
    { name: 'Desktop', width: 1440 },
    { name: 'Mobile', width: 390 }
  ]) {
    try {
      process.stdout.write(`\nLoading ${viewport.name}... `);

      const context = await browser.newContext({
        viewport: { width: viewport.width, height: 900 },
        ignoreHTTPSErrors: true
      });

      const page = await context.newPage();

      try {
        await page.goto(testUrl, { waitUntil: 'networkidle', timeout: 35000 });
      } catch (navError) {
        console.log(`⚠ Timeout`);
        await context.close();
        continue;
      }

      console.log(`✓`);

      const findings = await inspectPageStructure(page, viewport);
      printFindings(findings, viewport);

      await context.close();
    } catch (error) {
      console.log(`✗ ${error.message}`);
    }
  }

  await browser.close();

  console.log(`${'═'.repeat(100)}`);
  console.log(`INSPECTION COMPLETE`);
  console.log(`${'═'.repeat(100)}\n`);
  console.log(`Next: Use this structure info to refine the spacing detection logic.\n`);
}

runInspection().catch(error => {
  console.error('\n✗ Error:', error);
  process.exit(1);
});
