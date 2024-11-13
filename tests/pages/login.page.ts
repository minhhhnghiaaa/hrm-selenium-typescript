import { By, until } from 'selenium-webdriver';
import { BasePage } from 'tests/pages/base.page';

export class LoginPage extends BasePage {
    private get header() {
        return By.className('login-title');
    }
    private get usernameInput() {
        return By.id('login_username');
    }
    private get passwordInput() {
        return By.id('login_password');
    }
    private get loginButton() {
        return By.xpath('//button[contains(@class, "login-button")]');
    }
    private get loginError() {
        return By.xpath('//*[@class="login-error visible"]');
    }
    private get alertText() {
        return By.className('alert-text');
    }

    async open(appUrl: string) {
        await this.driver.get(appUrl);
        await this.waitForElement(this.header);
    }

    async getHeaderText() {
        return await this.getText(this.header);
    }

    async login(data: { username: string; password: string }) {
        await this.sendKeys(this.usernameInput, data.username);
        await this.sendKeys(this.passwordInput, data.password);
        await this.click(this.loginButton);
    }

    async invalidLoginError() {
        await this.waitForElement(this.loginError);
        await this.driver.wait(
            until.elementTextContains(await this.get(this.alertText), 'invalid'),
        );
        return await this.getText(this.alertText);
    }
}
