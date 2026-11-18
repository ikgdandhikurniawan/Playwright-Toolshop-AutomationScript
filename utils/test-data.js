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

module.exports = { users };