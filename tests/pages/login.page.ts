import { By, until, WebElement } from 'selenium-webdriver';
import { BasePage } from './base.page';
import { isNil, invariant } from 'es-toolkit';
import { captureAndAttachScreenshot } from '../utils/screenshot.util';
import * as allure from 'allure-js-commons';

interface LoginCredentials {
    readonly username: string;
    readonly password: string;
}

export class LoginPage extends BasePage {
    private readonly locators = Object.freeze({
        // Form elements
        usernameInput: By.id('tai_khoan'),
        passwordInput: By.id('mat_khau'),
        loginButton: By.css('button[type="submit"]'),
        // Messages & Alerts
        //relative css selector
        errorMessage: By.className('title title-only'),
        // Navigation
        forgotPasswordLink: By.linkText('Quên mật khẩu?'),
        // User info
        userName: By.css('div[class="ant-col"] div:nth-child(2) span:nth-child(1)'),
        // Loading & Dashboard
        spinner: By.className('dashed-loading'),
    });

    public async login({ username, password }: LoginCredentials): Promise<void> {
        invariant(
            !isNil(username) && !isNil(password),
            'Tài khoản và mật khẩu không được để trống',
        );
        await allure.step('Điền tài khoản và mật khẩu', async () => {
            await this.waitForElementVisible(this.locators.usernameInput);
            await this.clearAndSendKeys(this.locators.usernameInput, username);
            await this.waitForElementVisible(this.locators.passwordInput);
            await this.clearAndSendKeys(this.locators.passwordInput, password);
        });

        await allure.step('Thực hiện đăng nhập', async () => {
            await this.waitForElementToBeClickable(this.locators.loginButton);
            await this.click(this.locators.loginButton);
            // await this.waitForLoadingComplete(this.locators.spinner);
        });
    }

    public async invalidLoginError(): Promise<string> {
        return await allure.step('Lấy thông báo lỗi', async () => {
            return this.getText(this.locators.errorMessage);
        });
    }

    public async getUserName(): Promise<string> {
        return await allure.step('Lấy tên người dùng', async () => {
            await this.waitForElementVisible(this.locators.userName);
            return this.getText(this.locators.userName);
        });
    }

    public async isLoggedIn(): Promise<boolean> {
        return await allure.step('Kiểm tra đăng nhập', async () => {
            await this.waitForElementVisible(this.locators.userName);
            return true;
        });
    }

    public async clickForgotPassword(): Promise<void> {
        return await allure.step('Click vào liên kết quên mật khẩu', async () => {
            await this.waitForElement(this.locators.forgotPasswordLink);
            await this.click(this.locators.forgotPasswordLink);
        });
    }
}
