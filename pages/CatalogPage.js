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
}
module.exports = { CatalogPage };