const base = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { NavBar } = require('../pages/NavBar');

const test = base.test.extend({
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },
    navBar: async ({ page }, use) => {
        const navBar = new NavBar(page);
        await use(navBar);
    }
});
module.exports = { test, expect: base.expect };