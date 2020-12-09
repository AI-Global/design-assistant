const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
require('dotenv').config();

// log into existing selenium test account and go to results page
async function setUpDriver() {
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(new chrome.Options().headless().windowSize({width: 1920,height: 1080}))
        .build();
    await driver.get(process.env.REACT_APP_TESTING_ADDR);
    await driver.findElement(By.className('user-status btn btn-primary')).click();
    await driver.findElement(By.id('loginUsername')).sendKeys('test@selenium');
    await driver.findElement(By.id('loginPassword')).sendKeys('Test123!');
    await driver.findElement(By.xpath("//input[@value='Login']")).click();
    await driver.wait(until.elementLocated(By.className("usersettings-dropdown dropdown")));
    await driver.findElement(By.id('ResultsButton')).click();
    return driver;
}

var driver;

beforeAll(async () => {
    driver = await setUpDriver();
});

test('User can switch between Tabs', async() => {
    // Score Tab
    await driver.wait(until.elementLocated(By.partialLinkText("Score")));
    await driver.findElement(By.partialLinkText("Score")).click();
    
    // Report Card Tab
    await driver.wait(until.elementLocated(By.partialLinkText("Report Card")));
    await driver.findElement(By.partialLinkText("Report Card")).click();

    // Trusted AI Providers Tab
    await driver.wait(until.elementLocated(By.partialLinkText("Providers")));
    await driver.findElement(By.partialLinkText("Providers")).click();

    // Trusted AI Resources Tab
    await driver.wait(until.elementLocated(By.partialLinkText("Resources")));
    await driver.findElement(By.partialLinkText("Resources")).click();
});

test('User can export the survey to a csv file', async() => {
    await driver.wait(until.elementLocated(By.id('exportButtonCSV')));
    await driver.findElement(By.id('exportButtonCSV')).click();
});

test('User can export the survey to a pdf file', async() => {
    await driver.wait(until.elementLocated(By.id('exportButtonCSV')));
    await driver.findElement(By.id('exportButtonCSV')).click();
});

test('User can start again from results page', async () => {
    await driver.wait(until.elementLocated(By.id('restartButton')));
    await driver.findElement(By.id('restartButton')).click();
    await driver.wait(until.urlContains("/"));
    let currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).not.toContain("Results");
    driver.close();
})
