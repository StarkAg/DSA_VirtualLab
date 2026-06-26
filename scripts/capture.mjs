// Captures README screenshots from the LIVE site (where /api/execute + Convex work).
// Usage: ADMIN_PASSCODE=... node scripts/capture.mjs
import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const BASE = process.env.CAPTURE_URL || 'https://dsa-virtual-lab.vercel.app';
const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || '';
const OUT = 'docs/screenshots';
mkdirSync(OUT, { recursive: true });

// A seeded demo student (see convex/seed.ts) so the dashboard shows progress.
const DEMO_EMAIL = 'aarav@srmist.edu.in';
const DEMO_NAME = 'Aarav Sharma';

const stackReverseC = `#include <stdio.h>
int main(){
    int n; scanf("%d",&n);
    int a[200];
    for(int i=0;i<n;i++) scanf("%d",&a[i]);
    for(int i=n-1;i>=0;i--) printf("%d%s", a[i], i?" ":"");
    return 0;
}`;

const run = async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();

  // log in as the seeded demo student
  await page.goto(`${BASE}/login`);
  await page.waitForTimeout(800);
  await page.locator('input').first().fill(DEMO_NAME);
  await page.locator('input[type=email]').fill(DEMO_EMAIL);
  await page.getByRole('button', { name: /Continue|Signing/ }).click();
  await page.waitForURL('**/dashboard', { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `${OUT}/dashboard.png` });
  console.log('captured dashboard');

  // pre-seed editor code for the practice shot
  await page.evaluate((code) => localStorage.setItem('dsalab.code.stack.reverse.c', code), stackReverseC);

  // Experiment — theory + live visualizer (sorting)
  await page.goto(`${BASE}/experiment/sorting`);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}/experiment-theory.png` });
  console.log('captured experiment-theory');

  // Practice — code editor + passing evaluation (Stack › Reverse)
  await page.goto(`${BASE}/experiment/stack`);
  await page.waitForTimeout(800);
  await page.getByRole('button', { name: 'Practice' }).click();
  await page.waitForTimeout(400);
  await page.getByRole('button', { name: /Reverse/ }).click();
  await page.waitForTimeout(400);
  await page.getByRole('button', { name: 'Evaluate' }).click();
  await page.waitForFunction(() => /test cases passed/.test(document.body.textContent), { timeout: 60000 });
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/practice.png`, fullPage: true });
  console.log('captured practice');

  // Quiz
  await page.goto(`${BASE}/experiment/queue`);
  await page.waitForTimeout(700);
  await page.getByRole('button', { name: 'Quiz' }).click();
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${OUT}/quiz.png` });
  console.log('captured quiz');

  // Admin panel (needs ADMIN_PASSCODE in env)
  if (ADMIN_PASSCODE) {
    await page.goto(`${BASE}/admin`);
    await page.waitForTimeout(800);
    await page.locator('input[type=password]').fill(ADMIN_PASSCODE);
    await page.getByRole('button', { name: 'Enter' }).click();
    await page.waitForTimeout(2500);
    await page.screenshot({ path: `${OUT}/admin.png` });
    console.log('captured admin');
  } else {
    console.log('skipped admin (set ADMIN_PASSCODE to capture it)');
  }

  await browser.close();
};

run().catch((e) => { console.error(e); process.exit(1); });
