
exports.seed = function (knex) {
    return knex('pricebook').del()
        .then(function () {

            let data = [{
                id: 1,
                name: "Ireland",
                currencyCode: 'EUR'
            }, {
                id: 2,
                name: "United Kingdom",
                currencyCode: 'GBP'
            },
            {
                id: 3,
                name: "New Zealand",
                currencyCode: 'NZD'
            },
            {
                id: 4,
                name: "United States",
                currencyCode: 'USD'
            },
            {
                id: 5,
                name: "Vietnam",
                currencyCode: 'VND'
            }]
            // Inserts seed entries
            return knex('pricebook').insert(data);
        });
}