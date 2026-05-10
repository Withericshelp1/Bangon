#!/usr/bin/env python3
"""
Melville Ceilings Spacing Audit
Full analysis of 36 pages for visual spacing inconsistencies
"""

import sys
import time
import json
import os
from pathlib import Path
from datetime import datetime

# Try importing Playwright
try:
    from playwright.async_api import async_playwright
    import asyncio
except ImportError:
    print("Installing Playwright for Python...")
    os.system(f"{sys.executable} -m pip install playwright -q")
    from playwright.async_api import async_playwright
    import asyncio

# Setup
AUDIT_DIR = Path("Melville Ceilings Spacing Audit")
SCREENSHOTS_DIR = AUDIT_DIR / "screenshots"
LOG_FILE = AUDIT_DIR / "audit-progress.log"

AUDIT_DIR.mkdir(exist_ok=True)
SCREENSHOTS_DIR.mkdir(exist_ok=True)

def log(msg):
    """Log message with timestamp"""
    ts = datetime.now().isoformat()
    log_msg = f"[{ts}] {msg}"
    print(log_msg)
    with open(LOG_FILE, 'a') as f:
        f.write(log_msg + '\n')

URLS = [
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
]

VIEWPORTS = [
    {'name': 'Desktop', 'width': 1440, 'height': 900},
    {'name': 'Mobile', 'width': 390, 'height': 844},
]

async def analyze_spacing(page):
    """Analyze spacing on page"""
    try:
        await page.wait_for_timeout(1500)

        spacing_data = await page.evaluate("""
        () => {
          const issues = [];
          const measureGap = (el1, el2) => {
            const rect1 = el1.getBoundingClientRect();
            const rect2 = el2.getBoundingClientRect();
            return rect2.top - (rect1.top + rect1.height);
          };

          // Cards
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

          // Sections
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

          // Images
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
        }
        """)

        return spacing_data
    except Exception as e:
        log(f"  Error analyzing spacing: {e}")
        return []

async def run_audit():
    """Run full audit"""
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)

        total = len(URLS) * len(VIEWPORTS)
        log(f"Starting audit: {len(URLS)} pages × {len(VIEWPORTS)} viewports = {total} loads")

        findings = []
        count = 0

        for url_idx, url in enumerate(URLS):
            page_name = url.rstrip('/').split('/')[-1] or 'Home'

            for viewport in VIEWPORTS:
                count += 1
                progress = f"{count}/{total}"

                try:
                    log(f"[{progress}] Loading {page_name} ({viewport['name']})")

                    context = await browser.new_context(
                        viewport={"width": viewport['width'], "height": viewport['height']},
                        ignore_https_errors=True
                    )
                    page = await context.new_page()

                    try:
                        await page.goto(url, wait_until='networkidle', timeout=25000)
                    except:
                        log(f"  (partial load)")

                    # Screenshot
                    filename = f"{count:03d}_{page_name[:25]}_{viewport['name'].lower()}.png"
                    screenshot_path = SCREENSHOTS_DIR / filename
                    await page.screenshot(path=str(screenshot_path), full_page=True)

                    # Analyze
                    issues = await analyze_spacing(page)

                    for issue in issues:
                        findings.append({
                            'pageName': page_name,
                            'url': url,
                            'section': issue['section'],
                            'description': f"{issue['section']}: gaps vary from {min(issue['gaps'])}px to {max(issue['gaps'])}px (deviation: {issue['inconsistency']}px)",
                            'device': viewport['name'],
                            'priority': 'High' if issue['inconsistency'] > 24 else 'Medium',
                            'screenshot': filename
                        })
                        log(f"  ⚠ {issue['section']}: {issue['inconsistency']}px deviation")

                    if not issues:
                        log(f"  ✓ No issues")

                    await context.close()

                except Exception as e:
                    log(f"  ✗ Error: {str(e)[:100]}")

        await browser.close()
        return findings

if __name__ == "__main__":
    log("=" * 60)
    log("MELVILLE CEILINGS SPACING AUDIT - FULL")
    log("=" * 60)

    # Clear log file
    with open(LOG_FILE, 'w') as f:
        f.write(f"Audit started: {datetime.now().isoformat()}\n")

    # Run audit
    findings = asyncio.run(run_audit())

    # Save results
    with open(AUDIT_DIR / 'audit-findings.json', 'w') as f:
        json.dump(findings, f, indent=2)

    log(f"\n✓ Audit complete")
    log(f"✓ Found {len(findings)} issues")
    log(f"✓ Results saved to audit-findings.json")
    log(f"✓ Screenshots: {len(list(SCREENSHOTS_DIR.glob('*.png')))} files")
