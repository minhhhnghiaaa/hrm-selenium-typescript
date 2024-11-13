import { By, WebDriver, until, WebElement } from 'selenium-webdriver';

export class BasePage {
    constructor(protected driver: WebDriver) {
        this.driver = driver;
    }

    protected async get(locator: By): Promise<WebElement> {
        return await this.driver.wait(until.elementLocated(locator), 10000);
    }

    protected async click(locator: By): Promise<void> {
        const element = await this.get(locator);
        await element.click();
    }

    protected async sendKeys(locator: By, text: string): Promise<void> {
        const element = await this.get(locator);
        await element.sendKeys(text);
    }

    protected async getText(locator: By): Promise<string> {
        const element = await this.get(locator);
        return (await element.getText()).trim();
    }

    protected async waitForElement(locator: By, timeout = 10000): Promise<void> {
        await this.driver.wait(until.elementLocated(locator), timeout);
    }
}
