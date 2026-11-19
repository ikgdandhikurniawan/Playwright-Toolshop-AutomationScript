class RegisterPage {
    constructor(page) {
        this.page = page;
        this.registerLink = page.getByTestId('register-link');
        this.firstNameInput = page.getByTestId('first-name');
        this.lastNameInput = page.getByTestId('last-name');
        this.dateOfBirthInput = page.getByTestId('dob');
        this.countrySelect = page.getByTestId('country');
        this.postalCodeInput = page.getByTestId('postal_code');
        this.houseNumberInput = page.getByTestId('house_number');
        this.streetInput = page.getByTestId('street');
        this.cityInput = page.getByTestId('city');
        this.stateInput = page.getByTestId('state');
        this.phoneNumberInput = page.getByTestId('phone');
        this.emailInput = page.getByTestId('email');
        this.passwordInput = page.getByTestId('password');
        this.registerButton = page.getByTestId('register-submit');
    }

    async goto() {
        await this.page.goto('/auth/login');
        await this.registerLink.click();
    }

    async register(user) {
        const address = user.address;

        await this.firstNameInput.fill(user.firstName);
        await this.lastNameInput.fill(user.lastName);
        await this.dateOfBirthInput.fill(user.dateOfBirth);
        await this.countrySelect.selectOption(address.country);
        await this.postalCodeInput.fill(address.postalCode);
        await this.houseNumberInput.fill(address.houseNumber);

        // Wait for the automatic lookup to finish, then overwrite it with our data
        await this.page.waitForLoadState('networkidle');

        await this.streetInput.fill(address.street);
        await this.cityInput.fill(address.city);
        await this.stateInput.fill(address.state);
        await this.phoneNumberInput.fill(user.phoneNumber);
        await this.emailInput.fill(user.email);
        await this.passwordInput.fill(user.password);
        await this.registerButton.click();
    }

    get requiredFieldError() {
        return [
            { name: 'first name', input: this.firstNameInput, messages: ['First name is required'] },
            { name: 'last name', input: this.lastNameInput, messages: ['Last name is required'] },
            { name: 'date of birth', input: this.dateOfBirthInput, messages: ['Please enter a valid date in YYYY-MM-DD format.', 'Date of Birth is required'] },
            { name: 'country', input: this.countrySelect, messages: ['Country is required'] },
            { name: 'postal code', input: this.postalCodeInput, messages: ['Postcode is required'] },
            { name: 'house number', input: this.houseNumberInput, messages: ['House number is required'], checkAria: false },
            { name: 'street', input: this.streetInput, messages: ['Street is required'] },
            { name: 'city', input: this.cityInput, messages: ['City is required'] },
            { name: 'state', input: this.stateInput, messages: ['State is required'] },
            { name: 'phone', input: this.phoneNumberInput, messages: ['Phone is required'] },
            { name: 'email', input: this.emailInput, messages: ['Email is required'] },
            { name: 'password', input: this.passwordInput, messages: ['Password is required'] },
        ]};
    }

module.exports = { RegisterPage };