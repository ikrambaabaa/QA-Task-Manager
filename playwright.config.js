import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  retries: 1,                  // 1 retry en CI pour éviter les faux négatifs réseau

  reporter: [
    ['list'],
    ['json', { outputFile: 'test-results/report.json' }],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:5174',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'off',
  },
});