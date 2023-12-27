
exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('catalog').del()
        .then(function () {
            let data = [
                {
                    id: 1,
                    name: "New Arrials",
                    description: "Catalog New Arrials",
                    status: 1
                },
                {
                    id: 2,
                    name: "Womens",
                    description: "Catalog Womens",
                    status: 1
                },
                {
                    id: 3,
                    name: "Womens",
                    description: "Catalog Womens",
                    status: 1
                }
            ];

            // Inserts seed entries
            return knex('catalog').insert(data);
        });
};
