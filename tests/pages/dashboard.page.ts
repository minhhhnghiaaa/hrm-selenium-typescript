import { By } from 'selenium-webdriver';
import { BasePage } from './base.page';

export class DashboardPage extends BasePage {
    private get title() {
        return By.xpath('//*[@title="Dashboard"]');
    }

    async waitUntilTitleVisible() {
        await this.waitForElement(this.title);
    }

    async getHeaderText() {
        return await this.getText(this.title);
    }
}
