const { test, expect } = require('../fixtures/test-fixtures');
const { ProductDetailPage } = require('../pages/ProductDetailPage');
const { sampledCategories, sampleProductCards } = require('../utils/test-data');

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

        // Precondition: wait until the home page has loaded its initial product list
        await expect(catalogPage.productCards).not.toHaveCount(0);

        // Step 1: Type the keyword into the search box and click the Search button
        await catalogPage.search(keyword);

        // Step 2: Verify the page heading reflects the searched keyword ("Searched for: drill")
        await expect(catalogPage.searchCaption).toContainText(keyword, { ignoreCase: true });

        // Step 3: Verify the number in the caption ("N products found for ...") matches the number of product cards displayed on the page
        await expect(async () => {
            // Read the caption text, e.g. "4 products found for 'drill'"
            const captionText = (await catalogPage.searchResultsCount.textContent()).trim();
            // Extract the number at the start of the caption (the first capture group)
            const match = captionText.match(/^(\d+)\s+products? found/i);
            // Fail with a readable message if the caption does not have the expected format
            expect(match, `caption was: "${captionText}"`).not.toBeNull();
            // Count the product cards currently displayed
            const cardCount = await catalogPage.productCards.count();
            // There must be at least one result, and the count must equal the caption number
            expect(cardCount).toBeGreaterThan(0);
            expect(cardCount).toBe(Number(match[1]));
        }).toPass({ timeout: 10_000 });

        // Step 4: Verify every displayed product name contains the keyword.
        const productNames = await catalogPage.getProductNames();
        expect(productNames.length).toBeGreaterThan(0);
        for (const name of productNames) {
            expect(name.toLowerCase()).toContain(keyword);
        }
    });

    test('TC-CAT-009 Verify that the search with no matching keyword returns no results @regression', async ({ catalogPage }) => {
        const keyword = 'zxscvcxv';

        await expect(catalogPage.productCards).not.toHaveCount(0);
        await catalogPage.search(keyword);
        await expect(catalogPage.searchCaption).toContainText(keyword, { ignoreCase: true });
        await expect(catalogPage.searchResultsCount).toHaveText(/^\s*0 products? found for/i);
        await expect(catalogPage.noResultsMessage).toContainText('There are no products found.');
        await expect(catalogPage.productCards).toHaveCount(0);
    });

    //TC-CAT-010 script for filter by category with sampled categories
    for (const category of sampledCategories) {
        test(`TC-CAT-010 Verify that products can be filtered by category: ${category} @regression`, async ({ catalogPage}) => {
            // Precondition: wait for the initial list and remember it for comparison
            await expect(catalogPage.productCards).not.toHaveCount(0);
            const initialNames = await catalogPage.getProductNames();

            // Step 1: tick the category checkbox and wait for the filtered response
            const response = await catalogPage.filterByCategory(category);

            // Step 2: the checkbox is checked
            await expect(catalogPage.getCategoryCheckbox(category)).toBeChecked();

            // Step 3: the list changes and is not empty.
            // Retried until the grid has finished re-rendering.
            await expect(async () => {
                const names = await catalogPage.getProductNames();
                expect(names.length).toBeGreaterThan(0);
                expect(names).not.toEqual(initialNames);
            }).toPass({ timeout: 10_000 });

             // Step 4: every product in the API response belongs to the selected category
             const body = await response.json();
             expect(body.data.length).toBeGreaterThan(0);
             for (const product of body.data) {
                expect.soft(product.category?.name, `"${product.name}" category`).toBe(category);
             }
        })
    }

    //TC-CAT-011 script for open product detail from Catalog with sampled products
    for (const sample of sampleProductCards) {
        test(`TC-CAT-011 product detail opens from catalog: ${sample.name} @regression`, async ({ catalogPage, productDetailPage, page}) => {
            await expect(catalogPage.productCards).not.toHaveCount(0);

            const card = catalogPage.productCards.nth(sample.index);
            const expectedName = (await card.getByTestId('product-name').textContent()).trim();
            const expectedPrice = (await card.getByTestId('product-price').textContent()).replace('$', '').trim();

            await card.getByTestId('product-name').click();

            await expect(page).toHaveURL(/\/product\//);
            await expect(productDetailPage.productName).toHaveText(expectedName);
            await expect(productDetailPage.unitPrice).toHaveText(expectedPrice);
            await expect(productDetailPage.addToCartButton).toBeVisible();
        });
    }

});