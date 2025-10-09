class ProductFactory {
    private static nextId = 1;

    static create(payload: ProductDTO) {
        const { name, productType, stock, price } = payload;

        switch (payload.productType) {
            case ProductType.Regular:
                return new RegularProduct(
                    this.nextId++,
                    name,
                    productType,
                    stock,
                    price
                );

            case ProductType.Limited:
                const { releaseDate } = payload;

                return new LimitedProduct(
                    this.nextId++,
                    name,
                    productType,
                    stock,
                    price,
                    releaseDate
                );

            case ProductType.Subscription:
                const { subscriptionPeriod } = payload;
                return new SubscriptionProduct(
                    this.nextId++,
                    name,
                    productType,
                    stock,
                    price,
                    subscriptionPeriod
                );

            default:
                console.log('There is no Product type.');
                break;
        }
    }
}