// Captures README screenshots from the LIVE site (where /api/execute works).
// Usage: node scripts/capture.mjs
import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const BASE = process.env.CAPTURE_URL || 'https://dsa-virtual-lab.vercel.app';
const OUT = 'docs/screenshots';
mkdirSync(OUT, { recursive: true });

const profile = { name: 'Dhruv', email: 'dhruv@srmist.edu.in', id: '295967720', dept: 'School of Computing' };
const progress = {
  stack: { solved: { balanced: true, reverse: true }, quizBest: 100 },
  queue: { solved: { fifo: true }, quizBest: 75 },
  linkedlist: { solved: { 'build-print': true }, quizBest: 50 },
  sorting: { solved: { ascending: true }, quizBest: 75 },
  searching: { solved: {}, quizBest: 25 },
};
const stackReverseC = `#include <stdio.h>
int main(){
    int n; scanf("%d",&n);
    int a[200];
    for(int i=0;i<n;i++) scanf("%d",&a[i]);
    for(int i=n-1;i>=0;i--) printf("%d%s", a[i], i?" ":"");
    return 0;
}`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const run = async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();

  // seed localStorage on the origin
  await page.goto(`${BASE}/login`);
  await page.evaluate(([p, pr, code]) => {
    localStorage.setItem('dsalab.profile', p);
    localStorage.setItem('dsalab.progress', pr);
    localStorage.setItem('dsalab.code.stack.reverse.c', code);
  }, [JSON.stringify(profile), JSON.stringify(progress), stackReverseC]);

  // 1) Dashboard
  await page.goto(`${BASE}/dashboard`);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/dashboard.png` });
  console.log('captured dashboard');

  // 2) Experiment — theory + live visualizer (sorting)
  await page.goto(`${BASE}/experiment/sorting`);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}/experiment-theory.png` });
  console.log('captured experiment-theory');

  // 3) Practice — code editor + passing evaluation (Stack › Reverse)
  await page.goto(`${BASE}/experiment/stack`);
  await page.waitForTimeout(800);
  await page.getByRole('button', { name: 'Practice' }).click();
  await page.waitForTimeout(400);
  await page.getByRole('button', { name: /Reverse/ }).click();
  await page.waitForTimeout(400);
  await page.getByRole('button', { name: 'Evaluate' }).click();
  // wait for the real Wandbox grading to finish
  await page.waitForFunction(() => /test cases passed/.test(document.body.textContent), { timeout: 60000 });
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/practice.png`, fullPage: true });
  console.log('captured practice');

  // 4) Quiz
  await page.goto(`${BASE}/experiment/queue`);
  await page.waitForTimeout(700);
  await page.getByRole('button', { name: 'Quiz' }).click();
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${OUT}/quiz.png` });
  console.log('captured quiz');

  await browser.close();
};

run().catch((e) => { console.error(e); process.exit(1); });
