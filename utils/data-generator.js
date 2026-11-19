const { faker } = require('@faker-js/faker');

const COUNTRIES = ['Turkey', 'Indonesia', 'Malaysia', 'Singapore', 'Thailand'];

function generatePassword() {
    const base = faker.internet.password({ length: 10, memorable: false });
    return `${base}Aa1!`;
}

function generateDateOfBirth() {
    const date = faker.date.birthdate({ min: 18, max: 65, mode: 'age' });
    return date.toISOString().split('T')[0];
}

function generateAddress() {
    return {
        country: faker.helpers.arrayElement(COUNTRIES),
        postalCode: faker.string.numeric(5),
        houseNumber: faker.string.numeric({ length: { min: 1, max: 2 }, exclude: ['0'] }),
        street: faker.location.street(),
        city: faker.location.city(),
        state: faker.location.state(),
    };
}

function generatePhoneNumber() {
    return faker.string.numeric({ length: 10, allowLeadingZeros: false });
}

function generateRegistrationData() {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const unique = `${Date.now()}${faker.string.alphanumeric(4).toLowerCase()}`;

    return {
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        email: `qa.${unique}@example.com`,
        password: generatePassword(),
        dateOfBirth: generateDateOfBirth(),
        address: generateAddress(),
        phoneNumber: generatePhoneNumber(),
    };
}

module.exports = { generateRegistrationData, generatePassword, generateDateOfBirth, generateAddress, generatePhoneNumber };