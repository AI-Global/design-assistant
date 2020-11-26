const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
require('dotenv').config();
 
async function setUpDriver(){
    let driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(new chrome.Options().headless())
      .build();
    await driver.get(process.env.REACT_APP_TESTING_ADDR);
    return driver;
}

test('Successfully open User Registration page', async() => {
  let driver = await setUpDriver();
  await driver.findElement(By.className('user-status btn btn-primary')).click();
  await driver.wait(until.elementLocated(By.linkText('Create your account')),15000);
  await driver.findElement(By.linkText('Create your account')).click();
  await driver.wait(until.elementLocated(By.xpath('/html/body/div[6]/div/div/div[1]/div')),15000);
  let title = await driver.findElement(By.xpath('/html/body/div[6]/div/div/div[1]/div')).getText();
  expect(title).toEqual("User Registration");
});

test('User can successfully create an account', async() => {
    let driver = await setUpDriver();
    await driver.findElement(By.className('user-status btn btn-primary')).click();
    await driver.wait(until.elementLocated(By.linkText('Create your account')),15000);
    await driver.findElement(By.linkText('Create your account')).click();
    await driver.wait(until.elementLocated(By.xpath('/html/body/div[6]/div/div/div[1]/div')),15000);
    await driver.findElement(By.id('signupEmail')).sendKeys('test@selenium');
    await driver.findElement(By.id('signupPassword')).sendKeys('Test123!');
    await driver.findElement(By.id('signupPasswordConfirmation')).sendKeys('Test123!');
    await driver.findElement(By.id('signupOrganization')).sendKeys('Selenium');
    await driver.findElement(By.xpath("//input[@value='Create My Account']")).click();
  });