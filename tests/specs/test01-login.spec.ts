import { BaseTest } from './base.spec';
import { describe, it } from 'mocha';
import { assert } from 'chai';
import { isNil } from 'es-toolkit';
import { invariant } from 'es-toolkit/compat';
import loginData from '@testdata/login.json';

class LoginTest extends BaseTest {
    constructor() {
        super();
    }

    async testSuccessfulLogin(): Promise<void> {
        invariant(
            !isNil(loginData.valid.username) && !isNil(loginData.valid.password),
            'Tài khoản và mật khẩu không được để trống',
        );

        await this.loginPage.login(loginData.valid);
        const isLoggedIn = await this.loginPage.isLoggedIn();
        assert.isTrue(isLoggedIn, 'Đăng nhập thành công');
    }

    async testInvalidLogin(): Promise<void> {
        await this.loginPage.login(loginData.invalid);
        const errorText = await this.loginPage.invalidLoginError();
        assert.include(
            errorText.toLowerCase(),
            'tài khoản hoặc mật khẩu không hợp lệ',
            'Lỗi đăng nhập',
        );
    }

    async testForgotPasswordLink(): Promise<void> {
        await this.loginPage.clickForgotPassword();

        const currentUrl = await this.driver.getCurrentUrl();
        const expectedUrl = loginData.valid.url_forgot_password;
        assert.include(currentUrl, expectedUrl, 'Đường dẫn quên mật khẩu');
    }
}

describe('Login Test Suite', function () {
    let loginTest: LoginTest;

    before(async function () {
        loginTest = new LoginTest();
        await loginTest.before();
    });

    beforeEach(async function () {
        await loginTest.beforeEach(this);
    });

    afterEach(async function () {
        await loginTest.afterEach(this);
    });

    after(async function () {
        await loginTest.after();
    });

    it('should login successfully with valid credentials', async function () {
        await loginTest.testSuccessfulLogin();
    });

    it('should show error with invalid credentials', async function () {
        await loginTest.testInvalidLogin();
    });

    it('should navigate to forgot password page', async function () {
        await loginTest.testForgotPasswordLink();
    });
});
