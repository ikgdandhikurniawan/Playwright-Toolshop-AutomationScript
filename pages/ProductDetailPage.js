class ProductDetailPage {
    constructor(page) {
        this.page = page;
        this.productName = page.getByTestId('product-name')
        this.unitPrice = page.getByTestId('unit-price')
        this.addToCartButton = page.getByTestId('add-to-cart')
    }
}

module.exports = { ProductDetailPage }