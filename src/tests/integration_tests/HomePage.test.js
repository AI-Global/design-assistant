const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function setUpDriver() {
  let driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(
      new chrome.Options().headless().windowSize({ width: 1920, height: 1080 })
    )
    .build();
  await driver.get(process.env.REACT_APP_TESTING_ADDR);
  return driver;
}

var driver;

beforeAll(async () => {
  driver = await setUpDriver();
});

test('User can open User Registration page', async () => {
  // open login screen
  await driver.findElement(By.className('user-status btn btn-primary')).click();

  // transition to registration page
  await driver.wait(
    until.elementLocated(By.linkText('Create your account')),
    15000
  );
  await driver.findElement(By.linkText('Create your account')).click();
  await driver.wait(
    until.elementLocated(By.xpath('/html/body/div[6]/div/div/div[1]/div')),
    15000
  );
  let title = await driver
    .findElement(By.xpath('/html/body/div[6]/div/div/div[1]/div'))
    .getText();
  expect(title).toEqual('User Registration');
});

test('User can create an account', async () => {
  // fill out registration information and signup
  await driver.findElement(By.id('signupEmail')).sendKeys('test@selenium');
  await driver.findElement(By.id('signupPassword')).sendKeys('Test123!');
  await driver
    .findElement(By.id('signupPasswordConfirmation'))
    .sendKeys('Test123!');
  await driver.findElement(By.id('signupOrganization')).sendKeys('Selenium');
  await driver
    .findElement(By.xpath("//input[@value='Create My Account']"))
    .click();
  driver.close();
});

test('user can successfully open and Log into selenium test user', async () => {
  driver = await setUpDriver();
  // log into the created test user
  await driver.findElement(By.className('user-status btn btn-primary')).click();
  await driver.findElement(By.id('loginUsername')).sendKeys('test@selenium');
  await driver.findElement(By.id('loginPassword')).sendKeys('Test123!');
  await driver.findElement(By.xpath("//input[@value='Login']")).click();
  await driver.wait(
    until.elementLocated(By.className('usersettings-dropdown dropdown'))
  );
});

test('user can see list of existing surveys once logged in', async () => {
  await driver.wait(until.elementLocated(By.className('card-header')));
  let existingSurveys = await driver.findElement(By.className('card-header'));
  expect(existingSurveys).toBeTruthy();
});

test('User can log out of their account', async () => {
  await driver
    .findElement(By.className('usersettings-dropdown dropdown'))
    .click();
  await driver
    .findElement(By.xpath("//*[contains(text(), 'Log Out')]"))
    .click();
});

test('User can start a new survey without logging in', async () => {
  await driver
    .findElement(By.xpath("//*[contains(text(), 'Start New Survey')]"))
    .click();
  await driver.wait(until.urlContains('DesignAssistantSurvey'));
  let currentUrl = await driver.getCurrentUrl();
  expect(currentUrl).toContain('DesignAssistantSurvey');
  driver.close();
});
