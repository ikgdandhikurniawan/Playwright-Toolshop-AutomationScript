const base = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { NavBar } = require('../pages/NavBar');
const { RegisterPage } = require('../pages/RegisterPage');
const { generateRegistrationData } = require('../utils/data-generator');

const test = base.test.extend({
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },
    navBar: async ({ page }, use) => {
        const navBar = new NavBar(page);
        await use(navBar);
    },
    registerPage: async ({ page }, use) => {
        const registerPage = new RegisterPage(page);
        await use(registerPage);
    },
    newUser: async ({}, use) => {
        await use(generateRegistrationData());
    }
});
module.exports = { test, expect: base.expect };