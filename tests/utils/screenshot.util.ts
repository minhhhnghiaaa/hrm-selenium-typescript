import { WebDriver } from 'selenium-webdriver';
import * as allure from 'allure-js-commons';

export async function captureAndAttachScreenshot(
    driver: WebDriver,
    name: string,
    required: boolean = true,
    status: 'success' | 'error' = 'success',
): Promise<void> {
    try {
        const screenshot = await driver.takeScreenshot();
        allure.attachment(`${name} (${status})`, Buffer.from(screenshot, 'base64'), 'image/png');
    } catch (error) {
        if (required) {
            throw error;
        }
        console.warn(`Failed to capture screenshot ${name}:`, error);
    }
}
