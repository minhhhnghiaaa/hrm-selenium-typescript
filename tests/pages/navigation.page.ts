import { By } from 'selenium-webdriver';
import { BasePage } from './base.page';

export class NavigationPage extends BasePage {
    async clickOnLeftNavigationMenu(menuItemName: string) {
        const element = By.xpath(`//a[contains(@href, "${menuItemName}")]`);
        await this.driver.findElement(element).click();
    }

    private get header() {
        return By.className('page-title');
    }

    async getHeaderText() {
        const pageHeader = await this.driver.findElement(this.header).getText();
        return pageHeader.trim();
    }
}
