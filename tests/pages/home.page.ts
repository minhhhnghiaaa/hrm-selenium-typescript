import { By } from 'selenium-webdriver';
import { BasePage } from './base.page';
import * as allure from 'allure-js-commons';

export class HomePage extends BasePage {
    private readonly locators = Object.freeze({
        // Form inputs
        departmentsInput: By.id('phong_ban_id'),
        departmentsOption: By.className('ant-select-item-option-content'),
        roleInput: By.id('chuc_vu.ma_chuc_vu'),
        fullnameInput: By.id('ho_va_ten'),
        searchButton: By.css("button[type='submit']"),
        // Table elements
        userRow: By.className('ant-table-row'),
        fullnameText: By.css('div[class="ant-col"] div:nth-child(2) span:nth-child(1)'),
    });

    public async getListOfUserItems(): Promise<string[]> {
        return await allure.step('Get list of user items', async () => {
            await this.waitForElement(this.locators.userRow);
            const userItems = await this.driver.findElements(this.locators.userRow);
            const itemsCount = userItems.length;
            console.log(`Number of users found: ${itemsCount}`);

            if (itemsCount > 0) {
                const texts = await Promise.all(
                    userItems.map(async (item, idx) => {
                        const text = await item.getText();
                        return `| ${idx + 1} | ${text.replace('\n', ' | ')} |`;
                    }),
                );

                const tableHeader = '| No. | User Information |\n|-----|------------------|\n';
                const formattedTable = tableHeader + texts.join('\n');
                console.log('Users List Table:\n' + formattedTable);

                return texts;
            }

            return [];
        });
    }

    public async filterUserByDepartment(): Promise<string[]> {
        return await allure.step('Filter users by department', async () => {
            try {
                await this.click(this.locators.departmentsInput);
                await new Promise((resolve) => setTimeout(resolve, 1000));
                const elements = await this.driver.findElements(this.locators.departmentsOption);

                const departmentName = 'Trung tâm Kinh doanh Công nghệ số-Phòng Sản phẩm';
                let departmentFound = false;

                // Find and click the matching department
                for (const element of elements) {
                    const text = await element.getText();
                    if (text === departmentName) {
                        await element.click();
                        departmentFound = true;
                        break;
                    }
                }

                if (!departmentFound) {
                    const availableDepartments = await Promise.all(
                        elements.map((el) => el.getText()),
                    );
                    const errorMsg = `Department '${departmentName}' not found. Available departments: ${availableDepartments.join(
                        ', ',
                    )}`;
                    allure.attachment(
                        'Available Departments',
                        JSON.stringify(availableDepartments),
                        'text/plain',
                    );
                    throw new Error(errorMsg);
                }

                await this.click(this.locators.searchButton);
                await new Promise((resolve) => setTimeout(resolve, 1000));

                const filteredItems = await this.getListOfUserItems();
                allure.attachment(
                    'Filter Results',
                    `Found ${filteredItems.length} users in department '${departmentName}'`,
                    'text/plain',
                );

                return filteredItems;
            } catch (error) {
                const errorMsg = `Failed to filter users by department: ${
                    error instanceof Error ? error.message : error
                }`;
                allure.attachment('Filter Error', errorMsg, 'text/plain');
                throw error;
            }
        });
    }
}
