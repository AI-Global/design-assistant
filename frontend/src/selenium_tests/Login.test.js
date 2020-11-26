const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
require('dotenv').config();

async function setUpDriver() {
  let driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new chrome.Options().headless())
    .build();
  await driver.get(process.env.REACT_APP_TESTING_ADDR);
  return driver;
}

test('Successfully open login page', async () => {
  let driver = await setUpDriver();
  await driver.findElement(By.className('user-status btn btn-primary')).click();
});