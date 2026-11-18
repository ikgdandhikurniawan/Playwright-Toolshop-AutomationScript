class NavBar {
    constructor(page) {
        this.page = page;
        this.navMenu = page.locator('[data-test="nav-menu"]');
        this.navSignOut = page.locator('[data-test="nav-sign-out"]');
        this.navSignIn = page.locator('[data-test="nav-sign-in"]');
    }

    async signOut() {
        await this.navMenu.click();
        await this.navSignOut.click();
    }
}
module.exports = { NavBar };