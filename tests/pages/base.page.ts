import { By, WebDriver, until, WebElement } from 'selenium-webdriver';
import { isNil, isString, invariant } from 'es-toolkit';
import { isNumber } from 'es-toolkit/compat';

/**
 * BasePage Class - Chứa các hàm cơ bản để tương tác với elements trên trang web
 *
 * Các hàm chính:
 *
 * 1. Tìm kiếm elements:
 * - get(): Tìm và đợi element xuất hiện trên trang
 * - waitForElement(): Đợi cho đến khi element xuất hiện
 *
 * 2. Tương tác cơ bản:
 * - click(): Click vào element
 * - sendKeys(): Nhập text vào element
 * - clearAndSendKeys(): Xóa text cũ và nhập text mới
 *
 * 3. Lấy thông tin:
 * - getText(): Lấy text của element
 * - getAttribute(): Lấy giá trị của thuộc tính element
 *
 * 4. Kiểm tra trạng thái:
 * - isElementDisplayed(): Kiểm tra element có hiển thị không
 * - isElementEnabled(): Kiểm tra element có được kích hoạt không
 *
 * 5. Đợi và xác nhận:
 * - waitForElementToBeClickable(): Đợi element có thể click được
 * - waitForElementToContainText(): Đợi element chứa text cụ thể
 * - waitForElementToDisappear(): Đợi element biến mất
 * - waitForLoadingComplete(): Đợi loading spinner biến mất
 *
 * 6. Thao tác khác:
 * - scrollIntoView(): Cuộn trang đến vị trí element
 *
 * Cách sử dụng:
 * - Tất cả các hàm đều nhận vào locator kiểu By để định vị element
 * - Các hàm wait có thể tùy chỉnh timeout (mặc định 10s)
 * - Các hàm đều trả về Promise nên cần dùng async/await
 * - Có xử lý lỗi và kiểm tra tham số đầu vào
 */
export class BasePage {
    constructor(protected readonly driver: WebDriver) {
        invariant(!isNil(driver), 'WebDriver instance is required');
    }

    /**
     * Tìm và đợi cho đến khi element xuất hiện trên trang
     * @param locator - Định vị element
     * @returns WebElement đã tìm thấy
     */
    protected async get(locator: By): Promise<WebElement> {
        invariant(locator instanceof By, 'Invalid locator type');
        return await this.driver.wait(until.elementLocated(locator), 10_000);
    }

    /**
     * Click vào element
     * @param locator - Định vị element cần click
     */
    protected async click(locator: By): Promise<void> {
        invariant(locator instanceof By, 'Invalid locator type');
        return await (await this.get(locator)).click();
    }

    /**
     * Nhập text vào element
     * @param locator - Định vị element cần nhập
     * @param text - Text cần nhập
     */
    protected async sendKeys(locator: By, text: string): Promise<void> {
        invariant(locator instanceof By && isString(text), 'Invalid locator or text');
        return await (await this.get(locator)).sendKeys(text);
    }

    /**
     * Lấy text của element
     * @param locator - Định vị element cần lấy text
     * @returns Text của element
     */
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

    /**
     * Đợi cho đến khi element xuất hiện trên trang
     * @param locator - Định vị element cần đợi
     * @param timeout - Thời gian tối đa đợi (ms)
     * @returns WebElement đã tìm thấy
     */
    protected async waitForElement(locator: By, timeout = 10_000): Promise<WebElement> {
        invariant(locator instanceof By && isNumber(timeout) && timeout > 0, 'Invalid parameters');
        return await this.driver.wait(until.elementLocated(locator), timeout);
    }

    /**
     * Lấy giá trị thuộc tính của element
     * @param locator - Định vị element
     * @param attributeName - Tên thuộc tính cần lấy
     * @returns Giá trị của thuộc tính
     */
    protected async getAttribute(locator: By, attributeName: string): Promise<string> {
        invariant(locator instanceof By && isString(attributeName), 'Invalid parameters');
        return await (await this.get(locator)).getAttribute(attributeName);
    }

    /**
     * Kiểm tra element có được kích hoạt không
     * @param locator - Định vị element cần kiểm tra
     * @returns true nếu element được kích hoạt
     */
    protected async isElementEnabled(locator: By): Promise<boolean> {
        invariant(locator instanceof By, 'Invalid locator type');
        return await (await this.get(locator)).isEnabled();
    }

    /**
     * Kiểm tra element có đang hiển thị không
     * @param locator - Định vị element cần kiểm tra
     * @returns true nếu element đang hiển thị
     */
    protected async isElementDisplayed(locator: By): Promise<boolean> {
        invariant(locator instanceof By, 'Invalid locator type');
        return await (await this.get(locator)).isDisplayed();
    }

    /**
     * Đợi cho đến khi element có thể click được
     * @param locator - Định vị element cần đợi
     * @param timeout - Thời gian tối đa đợi (ms)
     * @returns WebElement có thể click được
     */
    protected async waitForElementToBeClickable(
        locator: By,
        timeout = 10_000,
    ): Promise<WebElement> {
        invariant(locator instanceof By && isNumber(timeout) && timeout > 0, 'Invalid parameters');
        return await this.driver.wait(until.elementIsVisible(await this.get(locator)), timeout);
    }

    /**
     * Xóa text hiện tại và nhập text mới vào element
     * @param locator - Định vị element cần nhập
     * @param text - Text mới cần nhập
     */
    protected async clearAndSendKeys(locator: By, text: string): Promise<void> {
        invariant(locator instanceof By && isString(text), 'Invalid parameters');
        await (await this.get(locator)).clear();
        return await (await this.get(locator)).sendKeys(text);
    }

    /**
     * Đợi cho đến khi element chứa text cụ thể
     * @param locator - Định vị element cần kiểm tra
     * @param text - Text cần tìm
     * @param timeout - Thời gian tối đa đợi (ms)
     * @returns true nếu element chứa text
     */
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

    /**
     * Cuộn trang đến element
     * @param locator - Định vị element cần cuộn đến
     */
    protected async scrollIntoView(locator: By): Promise<void> {
        invariant(locator instanceof By, 'Invalid locator type');
        const element = await this.get(locator);
        await this.driver.executeScript('arguments[0].scrollIntoView(true);', element);
    }

    /**
     * Đợi cho đến khi element biến mất khỏi trang
     * @param locator - Định vị element cần đợi
     * @param timeout - Thời gian tối đa đợi (ms)
     */
    protected async waitForElementToDisappear(locator: By, timeout = 10_000): Promise<void> {
        invariant(locator instanceof By && isNumber(timeout) && timeout > 0, 'Invalid parameters');
        await this.driver.wait(until.stalenessOf(await this.get(locator)), timeout);
    }

    /**
     * Đợi cho đến khi loading spinner biến mất
     * @param spinner - Định vị loading spinner
     */
    protected async waitForLoadingComplete(spinner: By): Promise<void> {
        if (await this.isElementDisplayed(spinner)) {
            await this.waitForElementToDisappear(spinner);
            await new Promise((resolve) => setTimeout(resolve, 500));
        }
    }
}
