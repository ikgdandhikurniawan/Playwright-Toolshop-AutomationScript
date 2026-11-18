const { test, expect } = require('../fixtures/test-fixtures');
const { users } = require('../utils/test-data');

test.describe('Login Tests', () => {

    test.beforeEach(async ({ loginPage }) => {
        await loginPage.goto();
    });

    test('TC-AUTH-001 user can log in with valid credentials @smoke', async ({ loginPage, page, navBar }) => {
        await loginPage.login(users.customer2.email, users.customer2.password);
        await expect(page).toHaveURL(/\/account/);
        await expect(page.locator('[data-test="page-title"]')).toHaveText('My account');
        await expect(navBar.navMenu).toContainText(users.customer2.fullName);
    });

    test('TC-AUTH-002 login fails with wrong password @regression', async ({ loginPage, page}) => {
        await loginPage.login(users.customer2.email, 'invalid-password');
        await expect(loginPage.loginError).toBeVisible();
        await expect(loginPage.loginError).toHaveText('Invalid email or password');
        await expect(page).toHaveURL(/\/auth\/login/);
        await expect(page).not.toHaveURL(/\/account/);
    });

    test('TC-AUTH-003 login fails with unregisteredemail @regression', async ({ loginPage, page }) => {
        await loginPage.login('invalid-email@practicesoftwaretesting.com', users.customer2.password);
        await expect(loginPage.loginError).toBeVisible();
        await expect(loginPage.loginError).toHaveText('Invalid email or password');
        await expect(page).toHaveURL(/\/auth\/login/);
    });

    test('TC-AUTH-004 login fails with empty credentials @regression', async ({ loginPage, page }) => {
        await loginPage.login('', '');
        await expect(loginPage.emailError).toHaveText('Email is required');
        await expect(loginPage.passwordError).toHaveText('Password is required');
        await expect(page).toHaveURL(/\/auth\/login/);
    });

    test('TC-AUTH-005 email format validation @regression', async ({ loginPage, page }) => {
        await loginPage.login('invalid-email', users.customer2.password);
        await expect(loginPage.emailError).toHaveText('Email format is invalid');
        await expect(page).toHaveURL(/\/auth\/login/);
    });

    test('TC-AUTH-006 user can log out @regression', async ({ loginPage, page, navBar }) => {
        await loginPage.login(users.customer2.email, users.customer2.password);
        await expect(page).toHaveURL(/\/account/);

        await navBar.signOut();
        await expect(page).toHaveURL(/\/auth\/login/);
        await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
        await expect(navBar.navSignIn).toBeVisible();
        await page.goto('/account');
        await expect(page).toHaveURL(/\/auth\/login/);

    });

    test('TC-AUTH-007 guest is redirected to login on a protected page @regression', async ({ loginPage, page }) => {
        await page.goto('/account');
        await expect(page).toHaveURL(/\/auth\/login/);
        await expect(loginPage.emailInput).toBeVisible();
    });
});
