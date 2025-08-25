const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function takeScreenshots() {
  console.log('Starting screenshot process...');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    const url = process.env.SCREENSHOT_URL || 'https://3dime.com';
    
    console.log(`Navigating to ${url}`);
    
    // Navigate to the page and wait for network idle
    await page.goto(url, { 
      waitUntil: 'networkidle2', // Wait until there are no more than 2 network connections for at least 500ms
      timeout: 30000 
    });
    
    console.log('Page loaded, waiting for content rendering...');
    
    // Wait for the footer element to be present (stable selector at bottom)
    await page.waitForSelector('footer', { timeout: 15000 });
    console.log('Footer element found');
    
    // Wait for main content container to be present
    await page.waitForSelector('.cards-container', { timeout: 15000 });
    console.log('Main content container found');
    
    // Wait for all container cards to be visible (animations complete)
    await page.waitForFunction(() => {
      const containers = document.querySelectorAll('.container');
      if (containers.length === 0) return false;
      
      // Check if all containers have the 'visible' class (animation complete)
      const visibleContainers = document.querySelectorAll('.container.visible');
      return visibleContainers.length === containers.length;
    }, { timeout: 20000 });
    console.log('All card animations completed');
    
    // Wait for GitHub badge to be updated (if present)
    try {
      await page.waitForFunction(() => {
        const badge = document.getElementById('badge-github');
        if (!badge) return true; // If no badge, continue
        return badge.textContent !== '0' && badge.style.display !== 'none';
      }, { timeout: 10000 });
      console.log('GitHub badge updated successfully');
    } catch (error) {
      console.log('GitHub badge timeout - continuing anyway (this is normal if API is slow)');
    }
    
    // Additional small delay to ensure everything is stable
    await page.waitForTimeout(2000);
    
    console.log('Page fully rendered, taking screenshots...');
    
    // Create screenshots directory
    const screenshotsDir = './screenshots';
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }
    
    // Desktop screenshot (1920x1080)
    await page.setViewport({ width: 1920, height: 1080 });
    await page.waitForTimeout(1000); // Wait for viewport change
    
    await page.screenshot({
      path: path.join(screenshotsDir, 'desktopPage1920x1080.jpeg'),
      type: 'jpeg',
      quality: 90,
      fullPage: true
    });
    console.log('Desktop screenshot saved');
    
    // Mobile screenshot (iPhone 13 Pro Max: 428x926)
    await page.setViewport({ width: 428, height: 926 });
    await page.waitForTimeout(1000); // Wait for viewport change
    
    await page.screenshot({
      path: path.join(screenshotsDir, 'iPhone_13_Pro_Max.jpeg'),
      type: 'jpeg',
      quality: 90,
      fullPage: true
    });
    console.log('Mobile screenshot saved');
    
    console.log('Screenshots completed successfully!');
    
  } catch (error) {
    console.error('Error taking screenshots:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

takeScreenshots();