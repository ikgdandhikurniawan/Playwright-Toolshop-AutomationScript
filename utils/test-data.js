const users = {
    admin: {
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        fullName: 'John Doe',
    },
    customer: {
        email: process.env.CUSTOMER_EMAIL,
        password: process.env.CUSTOMER_PASSWORD,
        fullName: 'Jane Doe',
    },
    customer2: {
        email: process.env.CUSTOMER2_EMAIL,
        password: process.env.CUSTOMER2_PASSWORD,
        fullName: 'Jack Howe',
    },

};

const invalidEmails = [
    { name: 'missing @',        value: 'invalid-email' },
    { name: 'missing domain',   value: 'user@' },
    { name: 'missing username', value: '@example.com' },
    { name: 'contains space',   value: 'user name@example.com' },
];

const invalidPasswords = [
    { name: 'length less than 8 characters',    value: 'Short1@',   messages: ['Password must be minimal 6 characters long.'] },
    { name: 'missing uppercase letter',         value: 'short123@', messages: ['Password can not include invalid characters.'] },
    { name: 'missing lowercase letter',         value: 'SHORT123@', messages: ['Password can not include invalid characters.'] },
    { name: 'missing number',                   value: 'Short@*#',  messages: ['Password can not include invalid characters.'] },
    { name: 'missing special character',        value: 'Short1234', messages: ['Password can not include invalid characters.'] },
];

module.exports = { users, invalidEmails, invalidPasswords };