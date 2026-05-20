import { test, chromium } from '@playwright/test';

test.describe('JobRight.ai Automation', () => {
  test('Open JobRight.ai and keep browser open for manual testing', async () => {
    // Launch browser in non-headless mode to keep it open
    const browser = await chromium.launch({
      headless: false,
      slowMo: 1000, // Slow down for visibility
    });

    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      recordVideo: {
        dir: './videos/',
        size: { width: 1920, height: 1080 }
      }
    });

    const page = await context.newPage();

    // Navigate to JobRight.ai
    await page.goto('https://jobright.ai/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');

    console.log('Browser is now open. You can manually interact with it.');
    console.log('Press Ctrl+C in the terminal to close the browser.');

    // Keep browser open - this will keep running until manually stopped
    // In a real scenario, you'd want to add automation logic here
    await page.pause(); // This opens Playwright Inspector for debugging

    // Close browser when done
    await context.close();
    await browser.close();
  });
});
