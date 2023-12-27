const randomstring = require('randomstring');

exports.seed = function (knex) {

    return knex('product').del()
        .then(function () {

            let data = [];

            for (let i = 1; i <= 200; i++) {
                let product = {
                    id: i,
                    sku: randomstring.generate(8),
                    categoryId: i % 30 + 1,
                    name: "Product_" + i,
                    type: "master",
                    brand: "ROY",
                    color: "#" + randomstring.generate({ charset: 'numeric', length: 6 }),
                    size: i % 50,
                    depth: i % 10,
                    height: i % 190,
                    weight: i % 100,
                    width: i % 200,
                    length: i % 500,
                    age: i % 100,
                    manufacturerName: "ROY NGUYEN"
                };

                data.push(product);
            }

            // Inserts seed entries
            return knex('product').insert(data);
        });
}