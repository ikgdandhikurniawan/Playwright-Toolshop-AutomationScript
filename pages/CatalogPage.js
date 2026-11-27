class CatalogPage {
    constructor(page) {
        this.page = page;
        this.productCards = page.locator('a.card');
        this.productNames = page.getByTestId('product-name');
        this.productPrices = page.getByTestId('product-price');
        this.sortSelect = page.getByTestId('sort');
        this.searchInput = page.getByTestId('search-query');
        this.searchButton = page.getByTestId('search-submit');
        this.searchCaption = page.getByTestId('search-caption');
        this.searchResultsCount = page.getByTestId('search-result-count');
        this.noResultsMessage = page.getByTestId('no-results');
    }

    async goto() {
        await this.page.goto('/');
    }

    async sortBy(option, sortValue) {
        const responsePromise = this.page.waitForResponse((response) => {
            const req = response.request();
            if (!response.url().includes('/products') || req.method() !== 'QUERY' || response.status() !== 200) {
                return false;
            }
            try {
                return req.postDataJSON()?.sort === sortValue;
            } catch {
                return false;
            }
        });
        await this.sortSelect.selectOption({ label: option });
        await responsePromise;
    }

    async getProductNames() {
        const names = await this.productNames.allTextContents();
        return names.map((name) => name.trim());
    }

    async getProductPrices() {
        const prices = await this.productPrices.allTextContents();
        return prices.map((price) => parseFloat(price.replace(/[^0-9.]/g, '')));
    }

    async getCo2Ratings() {
        const ratings = [];
        for (const card of await this.productCards.all()) {
            const activeLetter = card.locator('.co2-letter.active');
            ratings.push((await activeLetter.textContent()).trim());
        }
        return ratings;
    }

    async search(keyword) {
        const responsePromise = this.page.waitForResponse((response) => {
            const req = response.request();
            if (!response.url().includes('/products') || response.status() !== 200) {
                return false;
            }
            const inUrl = decodeURIComponent(response.url()).toLowerCase().includes(keyword.toLowerCase());
            const inBody = (req.postData() ?? '').toLowerCase().includes(keyword.toLowerCase());
            return inUrl || inBody;
        });

        await this.searchInput.fill(keyword);
        await this.searchButton.click();
        await responsePromise;
    }

    getCategoryCheckbox(name) {
        // exact: true prevents "Saw" from also matching "Hand Saw" (strict mode violation)
        return this.page.getByRole('checkbox', { name, exact: true });
    }

    async filterByCategory(name) {
        // Register the wait BEFORE clicking, so a fast response is not missed.
        // The initial list is already loaded when this is called, so the next
        // QUERY /products response belongs to this filter action.
        const responsePromise = this.page.waitForResponse((response) =>
            response.url().includes('/products') &&
            response.request().method() === 'QUERY' &&
            response.status() === 200
        );

        await this.getCategoryCheckbox(name).check();
        return responsePromise;
    }
}
module.exports = { CatalogPage };