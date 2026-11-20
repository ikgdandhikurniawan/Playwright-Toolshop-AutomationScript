const { test, expect } = require('../fixtures/test-fixtures');
const { users, invalidEmails, invalidPasswords } = require('../utils/test-data');

test.describe('Register Tests', () => {

    test.beforeEach(async ({ registerPage }) => {
        await registerPage.goto();
    });

    test('TC-REG-001 user can register with valid data and then login @regression', async ({ registerPage, page, navBar, newUser, loginPage }) => {
        await registerPage.register(newUser);
        await expect(page).toHaveURL(/\/auth\/login/);

        await loginPage.login(newUser.email, newUser.password);
        await expect(page).toHaveURL(/\/account/);
        await expect(loginPage.pageTitle).toHaveText(/my account/i);
        await expect(navBar.navMenu).toContainText(newUser.fullName);
        console.log(`Registered and logged in with email: ${newUser.email} and password: ${newUser.password}`);
    });

    test('TC-REG-002 required-field validation on empty registration form @regression', async ({ registerPage, page }) => {
        await registerPage.registerButton.click();

        for (const field of registerPage.requiredFieldError) {
            //1. Field is marked as invalid
            if (field.checkAria !== false) {
                await expect.soft(field.input, `${field.name}: aria-invalid`)
                    .toHaveAttribute('aria-invalid', 'true');
            }

            //2. Error message is displayed
            for (const message of field.messages) {
                await expect.soft(registerPage.page.getByText(message), `${field.name}: ${message}`).toBeVisible();
            }

        }
        //3. Form not submitted, user remains on the registration page
        await expect(page).toHaveURL(/\/auth\/register/);

    });

    test('TC-REG-003 Registration is rejected when the email is already registered @regression', async ({ registerPage, page, newUser }) => {
        const duplicateUser = { ...newUser, email: users.customer2.email };

        await registerPage.register(duplicateUser);
        await expect(registerPage.page.getByText('customer with this email address already exists.')).toBeVisible();
        await expect(page).toHaveURL(/\/auth\/register/);
    });

    test('TC-REG-004 date of birth format is invalid @regression', async ({ registerPage, page, newUser }) => {
        const invalidDobUser = { ...newUser, dateOfBirth: '01-01-2000' }; // Invalid format

        await registerPage.register(invalidDobUser);
        await expect(registerPage.page.getByText('Please enter a valid date in YYYY-MM-DD format.')).toBeVisible();
        await expect(page).toHaveURL(/\/auth\/register/);
    });

    test('TC-REG-005 phone number format is invalid @regression', async ({ registerPage, page, newUser }) => {
        const invalidPhoneUser = { ...newUser, phoneNumber: 'abcvdf' }; // Invalid format
        await registerPage.register(invalidPhoneUser);
        await expect(registerPage.page.getByText('Only numbers are allowed.')).toBeVisible();
        await expect(page).toHaveURL(/\/auth\/register/);
    });

    // TC-REG-006 Test case for invalid email format
    for (const emailTest of invalidEmails) {
        test(`TC-REG-006 email format is rejected: ${emailTest.name} @regression`, async ({ registerPage, page, newUser }) => {
            await registerPage.register({ ...newUser, email: emailTest.value });
            await expect(registerPage.page.getByText('Email format is invalid')).toBeVisible();
            await expect(page).toHaveURL(/\/auth\/register/);
        });
    }

    //TC-REG-007 Test case for invalid password format
    for (const passwordTest of invalidPasswords) {
        test(`TC-REG-007 password format is rejected: ${passwordTest.name} @regression`, async ({ registerPage, page, newUser }) => {
            await registerPage.register({ ...newUser, password: passwordTest.value });

            for (const message of passwordTest.messages) {
            await expect.soft(registerPage.page.getByText(message), `${passwordTest.name}: "${message}"`).toBeVisible();
            }
            
            await expect(page).toHaveURL(/\/auth\/register/);
        });
    }
});