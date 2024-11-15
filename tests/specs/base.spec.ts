import { WebDriver } from 'selenium-webdriver';
import { LoginPage } from '../pages/login.page';
import { initializeDriver } from '../config/driverFactory';
import { ENV } from '../env/manager';
import { captureAndAttachScreenshot } from '../utils/screenshot.util';
import { isNil, invariant } from 'es-toolkit';
import * as allure from 'allure-js-commons';

export abstract class BaseTest {
    protected driver!: WebDriver;
    protected loginPage!: LoginPage;

    constructor() {
        this.before = this.before.bind(this);
        this.beforeEach = this.beforeEach.bind(this);
        this.afterEach = this.afterEach.bind(this);
        this.after = this.after.bind(this);
    }

    /**
     * Khởi tạo môi trường test
     */
    async before(): Promise<void> {
        try {
            await allure.step('Setup Test Environment', async () => {
                this.driver = await initializeDriver();
                this.loginPage = new LoginPage(this.driver);
                allure.label('feature', this.constructor.name);
            });
        } catch (error) {
            console.error('Before hook failed:', error instanceof Error ? error.message : error);
            throw error;
        }
    }

    /**
     * Chuẩn bị cho mỗi test case
     */
    async beforeEach(testContext: Mocha.Context): Promise<void> {
        const testName = testContext.currentTest?.title;
        invariant(!isNil(testName), 'Test name is required');

        try {
            await allure.step('Test Setup', async () => {
                allure.label('story', testName);
                allure.attachment('testName', testName, 'text/plain');
                allure.attachment('appUrl', ENV.APP_URL, 'text/plain');
                await this.driver.get(ENV.APP_URL);
            });
        } catch (error) {
            await captureAndAttachScreenshot(this.driver, 'BeforeEach-Failure');
            throw error;
        }
    }

    /**
     * Dọn dẹp sau mỗi test case
     */
    async afterEach(testContext: Mocha.Context): Promise<void> {
        const status = testContext.currentTest?.state;
        const testName = testContext.currentTest?.title;
        invariant(!isNil(testName), 'Test name is required');

        try {
            await allure.step('Test Cleanup', async () => {
                allure.attachment('testStatus', status || 'unknown', 'text/plain');
                allure.attachment('testName', testName, 'text/plain');

                // Add 1s delay before taking screenshots
                await new Promise((resolve) => setTimeout(resolve, 1000));

                if (status === 'failed') {
                    await captureAndAttachScreenshot(
                        this.driver,
                        `${testName}-Failure`,
                        true,
                        'error',
                    );
                    const pageSource = await this.driver.getPageSource();
                    const currentUrl = await this.driver.getCurrentUrl();

                    allure.attachment('Page Source', pageSource, 'text/html');
                    allure.attachment('Current URL', currentUrl, 'text/plain');
                } else {
                    await captureAndAttachScreenshot(
                        this.driver,
                        `${testName}-Success`,
                        false,
                        'success',
                    );
                }
            });
        } catch (error) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            await captureAndAttachScreenshot(this.driver, 'AfterEach-Failure', true, 'error');
            throw error;
        }
    }

    /**
     * Dọn dẹp sau khi hoàn thành tất cả test case
     */
    async after(): Promise<void> {
        try {
            await allure.step('Teardown Test Environment', async () => {
                if (this.driver) {
                    await this.driver.quit();
                }
            });
        } catch (error) {
            console.error('After hook failed:', error instanceof Error ? error.message : error);
            throw error;
        }
    }
}
