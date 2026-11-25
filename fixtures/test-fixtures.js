const base = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { NavBar } = require('../pages/NavBar');
const { RegisterPage } = require('../pages/RegisterPage');
const { generateRegistrationData } = require('../utils/data-generator');
const { CatalogPage } = require('../pages/CatalogPage');

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
    catalogPage: async ({ page }, use) => {
        const catalogPage = new CatalogPage(page);
        await use(catalogPage);
    },
    newUser: async ({}, use) => {
        await use(generateRegistrationData());
    }
});
module.exports = { test, expect: base.expect };