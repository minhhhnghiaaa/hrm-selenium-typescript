import { By, WebDriver, until, WebElement } from 'selenium-webdriver';
import { captureAndAttachScreenshot } from '../utils/screenshot.util';
import { isNil, isString, invariant } from 'es-toolkit';
import { isNumber } from 'es-toolkit/compat';
import * as allure from 'allure-js-commons';

export class BasePage {
    constructor(protected readonly driver: WebDriver) {
        invariant(!isNil(driver), 'WebDriver instance is required');
    }

    protected async get(locator: By): Promise<WebElement> {
        invariant(locator instanceof By, 'Invalid locator type');
        return await this.driver.wait(until.elementLocated(locator), 10_000);
    }

    protected async click(locator: By): Promise<void> {
        invariant(locator instanceof By, 'Invalid locator type');

        return await (await this.get(locator)).click();
    }

    protected async sendKeys(locator: By, text: string): Promise<void> {
        invariant(locator instanceof By && isString(text), 'Invalid locator or text');
        return await (await this.get(locator)).sendKeys(text);
    }

    protected async getText(locator: By): Promise<string> {
        invariant(locator instanceof By, 'Invalid locator type');
        const element = await this.get(locator);

        try {
            const text = await this.driver.executeScript(
                'return arguments[0].textContent',
                element,
            );
            return (text as string).trim();
        } catch {
            const text = await element.getText();
            return text.trim();
        }
    }

    protected async waitForElement(locator: By, timeout = 10_000): Promise<WebElement> {
        invariant(locator instanceof By && isNumber(timeout) && timeout > 0, 'Invalid parameters');

        return await this.driver.wait(until.elementLocated(locator), timeout);
    }

    protected async isElementPresent(locator: By): Promise<boolean> {
        invariant(locator instanceof By, 'Invalid locator type');
        return await (await this.get(locator)).isDisplayed();
    }

    protected async waitForElementVisible(locator: By, timeout = 10_000): Promise<boolean> {
        invariant(locator instanceof By && isNumber(timeout) && timeout > 0, 'Invalid parameters');

        return await (await this.get(locator)).isDisplayed();
    }

    protected async getAttribute(locator: By, attributeName: string): Promise<string> {
        invariant(locator instanceof By && isString(attributeName), 'Invalid parameters');
        return await (await this.get(locator)).getAttribute(attributeName);
    }

    protected async isElementEnabled(locator: By): Promise<boolean> {
        invariant(locator instanceof By, 'Invalid locator type');
        return await (await this.get(locator)).isEnabled();
    }

    protected async isElementDisplayed(locator: By): Promise<boolean> {
        invariant(locator instanceof By, 'Invalid locator type');
        return await (await this.get(locator)).isDisplayed();
    }

    protected async waitForElementToBeClickable(
        locator: By,
        timeout = 10_000,
    ): Promise<WebElement> {
        invariant(locator instanceof By && isNumber(timeout) && timeout > 0, 'Invalid parameters');

        return await this.driver.wait(until.elementIsVisible(await this.get(locator)), timeout);
    }

    protected async clearAndSendKeys(locator: By, text: string): Promise<void> {
        invariant(locator instanceof By && isString(text), 'Invalid parameters');

        await (await this.get(locator)).clear();
        return await (await this.get(locator)).sendKeys(text);
    }

    protected async waitForElementToContainText(
        locator: By,
        text: string,
        timeout = 10_000,
    ): Promise<boolean> {
        invariant(
            locator instanceof By && isString(text) && isNumber(timeout) && timeout > 0,
            'Invalid parameters',
        );

        return (await (await this.get(locator)).getText()).includes(text);
    }

    protected async scrollIntoView(locator: By): Promise<void> {
        invariant(locator instanceof By, 'Invalid locator type');

        const element = await this.get(locator);
        await this.driver.executeScript('arguments[0].scrollIntoView(true);', element);
    }

    protected async waitForElementToDisappear(locator: By, timeout = 10_000): Promise<void> {
        invariant(locator instanceof By && isNumber(timeout) && timeout > 0, 'Invalid parameters');

        await this.driver.wait(until.stalenessOf(await this.get(locator)), timeout);
    }

    protected async waitForLoadingComplete(spinner: By): Promise<void> {
        if (await this.isElementPresent(spinner)) {
            await this.waitForElementToDisappear(spinner);
            await new Promise((resolve) => setTimeout(resolve, 500));
        }
    }
}
