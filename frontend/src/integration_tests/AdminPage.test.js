const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
require('dotenv').config();

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
    return driver;
}

var driver;

beforeAll(async () => {
    driver = await setUpDriver();
});


test('Admin can access Admin Panel', async() => {
    // user with admin role access admin panel
    await driver.wait(until.elementLocated(By.className("usersettings-dropdown dropdown")));
    await driver.findElement(By.className("usersettings-dropdown dropdown")).click();
    await driver.wait(until.elementLocated(By.partialLinkText("Admin")));
    await driver.findElement(By.partialLinkText("Admin")).click();
    await driver.wait(until.urlContains("Admin"));
    let currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toContain("Admin");
});

test('Admin can create a new question', async() => {
    // create new question button
    await driver.wait(until.elementLocated(By.xpath('//*[@id="wb-cont"]/div[1]/div[1]/div/table/thead/tr/th[1]/button')));
    await driver.findElement(By.xpath('//*[@id="wb-cont"]/div[1]/div[1]/div/table/thead/tr/th[1]/button')).click();


    await driver.findElement(By.id('resetButton')).click();
    await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Yes')]")));
    await driver.findElement(By.xpath("/html/body/div[8]/div/div/div[3]/button[1]")).click();
});

test('Admin can edit a question', async() => {
    // edit question button
    await driver.wait(until.elementLocated(By.xpath('//*[@id="wb-cont"]/div[1]/div[1]/div/table/tbody/tr[1]/td[4]/button')));
    await driver.findElement(By.xpath('//*[@id="wb-cont"]/div[1]/div[1]/div/table/tbody/tr[1]/td[4]/button')).click();

    await driver.wait(until.elementLocated(By.id('saveButton')));
    await driver.findElement(By.id('saveButton')).click();
});

test('Admin can create a new Trusted AI Provider', async () => {
    // switch to providers admin tab
    await driver.wait(until.elementLocated(By.partialLinkText('Providers')));
    await driver.findElement(By.partialLinkText('Providers')).click();

    // create new providers button
    await driver.wait(until.elementLocated(By.xpath('/html/body/main/div[1]/div/div/main/div[1]/div[4]/div/table/thead/tr/th[3]/button')));
    await driver.findElement(By.xpath('/html/body/main/div[1]/div/div/main/div[1]/div[4]/div/table/thead/tr/th[3]/button')).click();
    
    await driver.findElement(By.id('resetButton')).click();
    await driver.wait(until.elementLocated(By.id("DeleteSurveyButton")));
    await driver.findElement(By.id("DeleteSurveyButton")).click();
});

test('Admin can edit a Trusted AI Provider', async () => {
    // edit providers button
    await driver.wait(until.elementLocated(By.xpath('/html/body/main/div[1]/div/div/main/div[1]/div[4]/div/table/tbody/tr[1]/td[3]/button')));
    await driver.findElement(By.xpath('/html/body/main/div[1]/div/div/main/div[1]/div[4]/div/table/tbody/tr[1]/td[3]/button')).click();
    
    await driver.wait(until.elementLocated(By.id('saveButton')));
    await driver.findElement(By.id('saveButton')).click();
});

test('Admin can view Analytics', async () => {
    // switch over to analytics admin tab
    await driver.wait(until.elementLocated(By.partialLinkText('Analytics')));
    await driver.findElement(By.partialLinkText('Analytics')).click();

    // check if analytics are visible
    await driver.wait(until.elementLocated(By.xpath('/html/body/main/div[1]/div/div/main/div[1]/div[6]')));
    let analytics = await driver.findElement(By.xpath('/html/body/main/div[1]/div/div/main/div[1]/div[6]'));
    expect(analytics).toBeTruthy();
});

test('Admin can view list of users', async () => {
    // switch over to admin users tab
    await driver.wait(until.elementLocated(By.partialLinkText('Users')));
    await driver.findElement(By.partialLinkText('Users')).click();

    // check if table of users are visible
    await driver.wait(until.elementLocated(By.id('users')));
    let users = await driver.findElement(By.id('users'));
    expect(users).toBeTruthy();
});

test('Admin can view list of submissions', async () => {
    // switch over to submissions tab
    await driver.wait(until.elementLocated(By.partialLinkText('Submissions')));
    await driver.findElement(By.partialLinkText('Submissions')).click();

    // check if table of submissions are visible
    await driver.wait(until.elementLocated(By.xpath('//*[@id="submissions"]/tbody/tr[1]/td[5]/button')));
    let users = await driver.findElement(By.xpath('//*[@id="submissions"]/tbody/tr[1]/td[5]/button'));
    expect(users).toBeTruthy();
});

test('Admin can view a response', async () => {
    // view a specific response
    await driver.wait(until.elementLocated(By.xpath('/html/body/main/div[1]/div/div/main/div[1]/div[3]/div/table/tbody/tr[1]/td[5]/button')));
    await driver.findElement(By.xpath('/html/body/main/div[1]/div/div/main/div[1]/div[3]/div/table/tbody/tr[1]/td[5]/button')).click();
    
    // should redirect to results page
    await driver.wait(until.urlContains("Results"));
    let currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toContain("Results");
});