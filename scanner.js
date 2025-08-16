const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.launch({ 
      headless: false, // Run in headed mode to see what's happening
      slowMo: 1000 // Slow down operations to avoid detection
    });
    
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 720 }
    });
    
    const page = await context.newPage();
    
    // Set longer timeout and add error handling
    page.setDefaultTimeout(60000); // 60 seconds
    
    console.log('Navigating to https://boozt.com...');
    await page.goto('https://boozt.com', { 
      waitUntil: 'domcontentloaded',
      timeout: 60000 
    });
    
    console.log('Page loaded successfully!');
    
    // Wait a bit for dynamic content to load
    await page.waitForTimeout(3000);
    
    // Capture critical elements
    const bannerVisible = await page.isVisible('.cookie-banner');
    const preTicked = await page.$$('input[type=checkbox][checked]');
    
    // Capture screenshots
    await page.screenshot({ path: 'boozt-preconsent.png' });
    console.log('Pre-consent screenshot saved');
    
    // Try to click reject button if it exists
    try {
      await page.click('button:has-text("Avvis alle")', { timeout: 5000 }); // Click "Reject All"
      console.log('Clicked reject button');
    } catch (error) {
      console.log('Reject button not found or not clickable:', error.message);
    }
    
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'boozt-postreject.png' });
    console.log('Post-reject screenshot saved');
    
    await browser.close();
    
    console.log(`Banner visible: ${bannerVisible}`);
    console.log(`Pre-ticked boxes: ${preTicked.length}`);
    
  } catch (error) {
    console.error('Error occurred:', error.message);
    process.exit(1);
  }
})();