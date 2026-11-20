class LoginPage {
    constructor(page) {
        this.page = page;
        this.pageTitle = page.getByTestId('page-title');
        this.emailInput = page.getByTestId('email');
        this.passwordInput = page.getByTestId('password');
        this.loginButton = page.getByTestId('login-submit');
        this.emailError = page.getByTestId('email-error');
        this.passwordError = page.getByTestId('password-error');
        this.loginError = page.getByTestId('login-error');
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