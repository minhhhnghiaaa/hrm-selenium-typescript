import { BaseTest } from './base.spec';
import { describe, it } from 'mocha';
import { assert } from 'chai';
import { HomePage } from '../pages/home.page';
import axios from 'axios';
import { USER_CONSTANTS, HEADER_CONSTANTS } from '../constants/appConstants';
import loginData from '../testdata/login.json';

class HomeTest extends BaseTest {
    protected homePage!: HomePage;

    constructor() {
        super();
    }

    async before(): Promise<void> {
        await super.before();
        this.homePage = new HomePage(this.driver);
    }

    private async performLogin(): Promise<void> {
        await this.loginPage.login({
            username: loginData.valid.username,
            password: loginData.valid.password,
        });
        await this.loginPage.isLoggedIn();
    }

    private async getAuthToken(): Promise<string> {
        const headers = {
            'User-Agent': HEADER_CONSTANTS.USER_AGENT,
            Accept: HEADER_CONSTANTS.ACCEPT,
            'Accept-Language': HEADER_CONSTANTS.ACCEPT_LANGUAGE,
            'Accept-Encoding': HEADER_CONSTANTS.ACCEPT_ENCODING,
            Connection: HEADER_CONSTANTS.CONNECTION,
            device_id: USER_CONSTANTS.DEVICE_ID,
        };

        const response = await axios.post(
            `${loginData.valid.url_api_login}`,
            {
                tai_khoan: loginData.valid.username,
                mat_khau: loginData.valid.password,
            },
            { headers },
        );

        return response.data.data.token;
    }

    private async getUsersFromApi(): Promise<any[]> {
        const getUsers = async () => {
            const params = {
                page: 1,
                limit: 20,
                sort_direction: 'asc',
                sort_column: 'phong_ban_id',
                'f[0][field]': 'phong_ban_id',
                'f[0][operator]': 'equal',
                'f[0][value]': '2154',
            };

            const token = await this.getAuthToken();
            const response = await axios.get(loginData.valid.url_api_user, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: HEADER_CONSTANTS.ACCEPT,
                    'User-Agent': HEADER_CONSTANTS.USER_AGENT,
                    device_id: USER_CONSTANTS.DEVICE_ID,
                },
                params,
            });

            return response.data.data.collection;
        };

        return await getUsers();
    }

    async testGetListOfUserItems(): Promise<void> {
        await this.performLogin();
        const userItems = await this.homePage.getListOfUserItems();
        assert.isNotEmpty(userItems, 'User list should not be empty');
    }

    async testFilterUserByDepartment(): Promise<void> {
        await this.performLogin();
        const userItems = await this.homePage.filterUserByDepartment();
        const apiUsers = await this.getUsersFromApi();

        assert.isNotEmpty(userItems, 'Filtered user list should not be empty');
        assert.equal(userItems.length, apiUsers.length, 'UI and API user counts should match');
    }
}

describe('Home Test Suite', function () {
    let homeTest: HomeTest;

    before(async function () {
        homeTest = new HomeTest();
        await homeTest.before();
    });

    beforeEach(async function () {
        await homeTest.beforeEach(this);
    });

    afterEach(async function () {
        await homeTest.afterEach(this);
    });

    after(async function () {
        await homeTest.after();
    });

    it('should retrieve list of users', async function () {
        await homeTest.testGetListOfUserItems();
    });

    it('should filter users by department', async function () {
        await homeTest.testFilterUserByDepartment();
    });
});
