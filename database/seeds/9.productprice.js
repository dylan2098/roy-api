exports.seed = function (knex) {

    return knex('product-price').del()
        .then(function () {

            const currency = ["EUR", "GBP", "NZD", "USD", "VND"];
            let data = [];

            for (let i = 1; i <= 200; i++) {
                for (let cur = 1; cur <= currency.length; cur++) {
                    let basePrice = 50000 / (i + 1) * 20;
                    let productPrice = {
                        productId: i % 200 + 1,
                        pricebookId: cur,
                        basePrice: basePrice,
                        netPrice: basePrice + i % 25 * 20,
                        grossPrice: ((basePrice + i % 25 * 20) + (basePrice + i % 25 * 20) * 0.1).toFixed(2),
                        tax: ((basePrice + i % 25 * 20) * 0.1).toFixed(2)
                    }
                    data.push(productPrice);
                }
            }

            // Inserts seed entries
            return knex('product-price').insert(data);
        });
}