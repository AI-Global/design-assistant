const { wait } = require('@testing-library/react');
const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
require('dotenv').config();

async function setUpDriver() {
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(new chrome.Options().headless().windowSize({width: 1920,height: 1080}))
        .build();
    await driver.get(process.env.REACT_APP_TESTING_ADDR);
    await driver.findElement(By.xpath("//*[contains(text(), 'Start New Survey')]")).click();
    await driver.wait(until.urlContains("DesignAssistantSurvey"));
    return driver;
}

var driver;

beforeAll(async () => {
    driver = await setUpDriver();
});

test('User can navigate to different dimensions and questions', async () => {
    // find Accountability dimension
    await driver.wait(until.elementLocated(By.xpath("//*[@class='card-header' and contains(text(),'Accountability')]")));
    await driver.findElement(By.xpath("//*[@class='card-header' and contains(text(),'Accountability')]")).click();

    // click first question in the Accountability dimension
    await driver.wait(until.elementIsVisible(driver.findElement(By.xpath("/html/body/main/div[1]/div/div/div[1]/div[1]/div[3]/div[2]/div/button[7]"))));
    await driver.findElement(By.xpath("/html/body/main/div[1]/div/div/div[1]/div[1]/div[3]/div[2]/div/button[1]")).click();
    await driver.findElement(By.xpath("//*[@class='card-header' and contains(text(),'Accountability')]")).click();
});

test('User can filter by their role, industry, region, lifecycle', async () => {
    // click filters button
    await driver.findElement(By.xpath("//*[contains(text(), 'Filters')]")).click();
    await driver.wait(until.elementIsVisible(driver.findElement(By.xpath("//*[contains(text(), 'Roles')]"))));

    // assign first Role filter
    await driver.findElement(By.xpath("//*[contains(text(), 'Roles')]")).click();
    await driver.findElement(By.xpath("/html/body/main/div[1]/div/div/div[1]/div[2]/div/div[2]/div/div[1]/div/form/div[1]/input")).click();
    await driver.findElement(By.xpath("//*[contains(text(), 'Roles')]")).click();
    
    // assign first Industry filter
    await driver.findElement(By.xpath("//*[contains(text(), 'Industry')]")).click();
    await driver.findElement(By.xpath("/html/body/main/div[1]/div/div/div[1]/div[2]/div/div[2]/div/div[2]/div/form/div[1]/input")).click();
    await driver.findElement(By.xpath("//*[contains(text(), 'Industry')]")).click();

    // assign first Region filter
    await driver.findElement(By.xpath("//*[contains(text(), 'Regions')]")).click();
    await driver.findElement(By.xpath("/html/body/main/div[1]/div/div/div[1]/div[2]/div/div[2]/div/div[3]/div/form/div[1]/input")).click();
    await driver.findElement(By.xpath("//*[contains(text(), 'Regions')]")).click();

    // assign first Life Cycle filter
    await driver.findElement(By.xpath("//*[contains(text(), 'Life Cycles')]")).click();
    await driver.findElement(By.xpath("/html/body/main/div[1]/div/div/div[1]/div[2]/div/div[2]/div/div[4]/div/form/div[1]/input")).click()
    await driver.findElement(By.xpath("//*[contains(text(), 'Life Cycles')]")).click();

    // apply the assigned filters
    await driver.findElement(By.xpath("//*[contains(text(), 'Apply Filters')]")).click();
});

test('User can save their results', async () => {
    // click save button
    await driver.wait(until.elementLocated(By.id("saveButton")));
    await driver.findElement(By.id("saveButton")).click();
});

test('User can finish the survey', async() => {
    // clicking finish button and check if sent to Results
    await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Finish')]")));
    await driver.findElement(By.xpath("//*[contains(text(), 'Finish')]")).click();
    let currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toContain("Results");
    driver.close();
});
