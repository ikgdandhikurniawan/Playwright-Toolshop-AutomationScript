const { test, expect } = require('../fixtures/test-fixtures');

test.describe('Catalog Page', () => {

    test.beforeEach(async ({ catalogPage }) => {
        await catalogPage.goto();
    });

    test('TC-CAT-001 Verify that the catalog page displays a list of products @regression', async ({ catalogPage }) => {
        const productCard = catalogPage.productCards;
        await expect(productCard).not.toHaveCount(0);

        for (const card of await productCard.all()) {
            await expect.soft(card.getByTestId('product-name')).not.toBeEmpty();
            await expect.soft(card.getByTestId('product-price')).toHaveText(/^\$\d+(\.\d{2})?$/); // Assuming price format is like $10.00
        }
    });

    test('TC-CAT-002 Verify that the products can be sorted by name A-Z @regression', async ({ catalogPage }) => {
        // Wait the page to load and display products
        await expect(catalogPage.productCards).not.toHaveCount(0);

        await catalogPage.sortBy('Name (A - Z)', 'name,asc');
        // Verify that the products are loaded and sorted by name A-Z
        await expect(async () => {
            const productNames = await catalogPage.getProductNames();
            const sortedNames = [...productNames].sort((a, b) => a.localeCompare(b));
            expect(productNames.length).toBeGreaterThan(0);
            expect(productNames).toEqual(sortedNames);
        }).toPass({ timeout: 10_000 });

    });

    test('TC-CAT-003 Verify that the products can be sorted by name Z-A @regression', async ({ catalogPage }) => {
        // Wait the page to load and display products
        await expect(catalogPage.productCards).not.toHaveCount(0);

        await catalogPage.sortBy('Name (Z - A)', 'name,desc');
        // Verify that the products are loaded and sorted by name Z-A
        await expect(async () => {
            const productNames = await catalogPage.getProductNames();
            const sortedNames = [...productNames].sort((a, b) => b.localeCompare(a));
            expect(productNames.length).toBeGreaterThan(0);
            expect(productNames).toEqual(sortedNames);
        }).toPass({ timeout: 10_000 });
    });

    test('TC-CAT-004 Verify that the products can be sorted by price Low to High @regression', async ({ catalogPage }) => {
        await expect(catalogPage.productCards).not.toHaveCount(0);

        await catalogPage.sortBy('Price (Low - High)', 'price,asc');
        await expect(async () => {
            const productPrices = await catalogPage.getProductPrices();
            expect(productPrices.length).toBeGreaterThan(0);
            expect(productPrices.every((price) => !Number.isNaN(price))).toBe(true);
            expect(productPrices).toEqual([...productPrices].sort((a, b) => a - b));
        }).toPass({ timeout: 10_000 });
    });

    test('TC-CAT-005 Verify that the products can be sorted by price High to Low @regression', async ({ catalogPage }) => {
        await expect(catalogPage.productCards).not.toHaveCount(0);

        await catalogPage.sortBy('Price (High - Low)', 'price,desc');
        await expect(async () => {
            const productPrices = await catalogPage.getProductPrices();
            expect(productPrices.length).toBeGreaterThan(0);
            expect(productPrices.every((price) => !Number.isNaN(price))).toBe(true);
            expect(productPrices).toEqual([...productPrices].sort((a, b) => b - a));
        }).toPass({ timeout: 10_000 });
    });

    test('TC-CAT-006 Verify that can be sorted by CO2 ratings A-E @regression', async ({ catalogPage }) => {
        await expect(catalogPage.productCards).not.toHaveCount(0);

        await catalogPage.sortBy('CO₂ Rating (A - E)', 'co2_rating,asc');
        await expect(async () => {
            const ratings = await catalogPage.getCo2Ratings();
            expect(ratings.length).toBeGreaterThan(0);
            expect(ratings.every((rating) => /^[A-E]$/.test(rating))).toBe(true);
            expect(ratings).toEqual([...ratings].sort());
        }).toPass({ timeout: 10_000 });
    });

    test('TC-CAT-007 Verify that can be sorted by CO2 ratings E-A @regression', async ({ catalogPage }) => {
        await expect(catalogPage.productCards).not.toHaveCount(0);

        await catalogPage.sortBy('CO₂ Rating (E - A)', 'co2_rating,desc');
        await expect(async () => {
            const ratings = await catalogPage.getCo2Ratings();
            expect(ratings.length).toBeGreaterThan(0);
            expect(ratings.every((rating) => /^[A-E]$/.test(rating))).toBe(true);
            expect(ratings).toEqual([...ratings].sort((a, b) => b.localeCompare(a)));
        }).toPass({ timeout: 10_000 });
    });

    test('TC-CAT-008 Verify that the search functionality returns relevant products @regression', async ({ catalogPage }) => {
        const keyword = 'drill';

        await expect(catalogPage.productCards).not.toHaveCount(0);
        await catalogPage.search(keyword);

        await expect(catalogPage.searchCaption).toContainText(keyword, { ignoreCase: true });

        await expect(async () => {
            const captionText = (await catalogPage.searchResultsCount.textContent()).trim();
            const match = captionText.match(/^(\d+)\s+products? found/i);
            expect(match, `caption was: "${captionText}"`).not.toBeNull();
            const cardCount = await catalogPage.productCards.count();
            expect(cardCount).toBeGreaterThan(0);
            expect(cardCount).toBe(Number(match[1]));
        }).toPass({ timeout: 10_000 });

        const productNames = await catalogPage.getProductNames();
        expect(productNames.length).toBeGreaterThan(0);
        for (const name of productNames) {
            expect(name.toLowerCase()).toContain(keyword);
        }

    });

});