import { Builder } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';
import * as edge from 'selenium-webdriver/edge';
import * as firefox from 'selenium-webdriver/firefox';
import { Browser } from 'selenium-webdriver/lib/capabilities';
import { FRAMEWORK_ENV_CONFIG } from 'tests/helper/envReader';
import { BrowserType } from '../types/driver';

const BROWSER_NAME: BrowserType = FRAMEWORK_ENV_CONFIG.BROWSER;
const RUN_MODE: string = FRAMEWORK_ENV_CONFIG.RUN_MODE;
const REMOTE_GRID_URL: string = FRAMEWORK_ENV_CONFIG.GRID_URL;

const getChromeInstance = async () => {
    const options = new chrome.Options()
        .addArguments('--incognito')
        .addArguments('--disable-notifications')
        .addArguments('--disable-popup-blocking');

    if (RUN_MODE === 'docker') {
        return await new Builder()
            .forBrowser(Browser.CHROME)
            .usingServer(REMOTE_GRID_URL)
            .setChromeOptions(options as chrome.Options)
            .build();
    } else {
        return await new Builder()
            .forBrowser(Browser.CHROME)
            .setChromeOptions(options as chrome.Options)
            .build();
    }
};

const getFirefoxInstance = async () => {
    const options = new firefox.Options()
        .addArguments('-private')
        .setPreference('dom.webnotifications.enabled', false)
        .setPreference('browser.privatebrowsing.autostart', true);

    if (RUN_MODE === 'docker') {
        return await new Builder()
            .forBrowser(Browser.FIREFOX)
            .usingServer(REMOTE_GRID_URL)
            .setFirefoxOptions(options as firefox.Options)
            .build();
    } else {
        return await new Builder()
            .forBrowser(Browser.FIREFOX)
            .setFirefoxOptions(options as firefox.Options)
            .build();
    }
};

const getEdgeInstance = async () => {
    const options = new edge.Options()
        .addArguments('--inprivate')
        .addArguments('--disable-notifications')
        .addArguments('--disable-popup-blocking');

    if (RUN_MODE === 'docker') {
        return await new Builder()
            .forBrowser(Browser.EDGE)
            .usingServer(REMOTE_GRID_URL)
            .setEdgeOptions(options as edge.Options)
            .build();
    } else {
        return await new Builder()
            .forBrowser(Browser.EDGE)
            .setEdgeOptions(options as edge.Options)
            .build();
    }
};

export const getBrowserInstance = async () => {
    switch (BROWSER_NAME) {
        case 'chrome':
            return await getChromeInstance();
        case 'firefox':
            return await getFirefoxInstance();
        case 'edge':
            return await getEdgeInstance();
        default:
            return await getChromeInstance();
    }
};
