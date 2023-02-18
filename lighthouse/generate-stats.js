/**
 * @fileoverview Lighthouse on an authenticated page
 */
import fs from 'fs';
import puppeteer from 'puppeteer';
import lighthouse from 'lighthouse';
import esMain from 'es-main';
import * as dotenv from 'dotenv';

import config from './config.js';

dotenv.config();

/**
 * @param {puppeteer.Page} page
 * @param {string} origin
 */
async function login(page, origin) {
  await page.goto(origin);
  await page.waitForSelector('#bb-username-then-password-input', {visible: true});

  // Fill in and submit login form.
  const emailInput = await page.$('#bb-username-then-password-input');
  await emailInput.type(process.env.USERNAME);
  await Promise.all([
    page.$eval('#bb-username-then-password-form', form => form.submit()),
    page.waitForNavigation(),
  ]);
  await page.waitForSelector('#bb-username-then-password-input', {visible: true});
  const passwordInput = await page.$('#bb-username-then-password-input');
  await passwordInput.type(process.env.PASSWORD);
  await Promise.all([
    page.$eval('#bb-username-then-password-form', form => form.submit()),
    page.waitForNavigation(),
  ]);
}

/**
 * @param {puppeteer.Page} page
 * @param {string} origin
 */
async function logout(page, origin) {
  await page.goto(`${origin}/logout`);
}

async function main() {
  // Direct Puppeteer to open Chrome with a specific debugging port.
  const browser = await puppeteer.launch({
    // Optional, if you want to see the tests in action.
    headless: false,
    // slowMo: 50,
  });
  const page = await browser.newPage();

  // Setup the browser session to be logged into our site.
  await login(page, process.env.LOGIN_URL);

  // The local server is running on port 10632.
  const url = process.env.TEST_PAGE;

  // Direct Lighthouse to use the same Puppeteer page.
  // Disable storage reset so login session is preserved.
  const result = await lighthouse(url, {disableStorageReset: true}, config, page);

  // Direct Puppeteer to close the browser as we're done with it.
  await browser.close();

  // Output the result.
  // `.report` is the HTML report as a string
  // console.log(JSON.stringify(result.lhr, null, 2));
  const reportHtml = result.report;
  fs.writeFileSync('lhreport.html', reportHtml);

  // `.lhr` is the Lighthouse Result as a JS object
  console.log('Report is done for', result.lhr.finalDisplayedUrl);
  console.log('Performance score was', result.lhr.categories.performance.score * 100);
}

if (esMain(import.meta)) {
  await main();
}

export {
  login,
  logout,
};