
exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('category').del()
        .then(function () {
            let data = [];

            for (let i = 1; i <= 10; i++) {
                data.push({
                    id: i,
                    catalogId: 1,
                    name: "New arials " + i,
                    status: 1
                })
            }

            let categoryWomens = ["Clothing", "Jewelry", "Accessories"];

            for (let i = 11; i <= 20; i++) {
                data.push({
                    id: i,
                    catalogId: 1,
                    name: "Womens " + categoryWomens[i % 3] + " " + i,
                    status: 1,
                    parentId: i % 5 + 1
                })
            }

            let categoryMens = ["Clothing", "Accessories"];
            for (let i = 21; i <= 30; i++) {
                data.push({
                    id: i,
                    catalogId: 1,
                    name: "Mens " + categoryMens[i % 2] + " " + i,
                    status: 1,
                    parentId: i % 5 + 1
                })
            }

            // Inserts seed entries
            return knex('category').insert(data);
        });
};
