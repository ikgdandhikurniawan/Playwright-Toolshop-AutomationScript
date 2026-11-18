class LoginPage {
    constructor(page) {
        this.page = page;
        this.emailInput = page.locator('[data-test="email"]');
        this.passwordInput = page.locator('[data-test="password"]');
        this.loginButton = page.locator('[data-test="login-submit"]');
        this.emailError = page.locator('[data-test="email-error"]');
        this.passwordError = page.locator('[data-test="password-error"]');
        this.loginError = page.locator('[data-test="login-error"]');
    }

    async goto() {
        await this.page.goto('/auth/login');
    }

    async login(email, password) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
}

module.exports = { LoginPage };