class NavBar {
    constructor(page) {
        this.page = page;
        this.navMenu = page.getByTestId('nav-menu');
        this.navSignOut = page.getByTestId('nav-sign-out');
        this.navSignIn = page.getByTestId('nav-sign-in');
    }

    async signOut() {
        await this.navMenu.click();
        await this.navSignOut.click();
    }
}
module.exports = { NavBar };