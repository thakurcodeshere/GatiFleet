const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR:', error.stack || error.message));
    page.on('requestfailed', request => console.log('REQ FAILED:', request.url(), request.failure().errorText));
    
    console.log('Navigating to https://gati-fleet.vercel.app/ ...');
    await page.goto('https://gati-fleet.vercel.app/', { waitUntil: 'networkidle2', timeout: 30000 });
    
    await new Promise(r => setTimeout(r, 3000));
    
    const bodyHTML = await page.evaluate(() => document.body.innerHTML);
    console.log('Body HTML length:', bodyHTML.length);
    console.log('Body snippet:', bodyHTML.substring(0, 300));
    
    await browser.close();
  } catch (err) {
    console.error('PUPPETEER ERROR:', err);
  }
})();
