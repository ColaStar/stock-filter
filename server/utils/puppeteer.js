// https://github.com/puppeteer/puppeteer/blob/v13.0.1/docs/api.md#

const puppeteer = require('puppeteer');
const { list } = require('@tangyansoft/toolkit-common');
const ua = require('../model/ua');

module.exports = (url) => {
  return new Promise(resolve => {
    (async () => {
      const browser = await puppeteer.launch({
        args: ['--headless', '--disable-gpu', '--no-sandbox']
      });
      const page = await browser.newPage();
      page.setUserAgent(list.random(ua.pc, 1)[0]);
      await page.setDefaultNavigationTimeout(0);
      await page.goto(url);
      const content = await page.content();
      resolve(content);
      await browser.close();
    })();
  });
};
