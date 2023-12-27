
exports.seed = function (knex) {
    return knex('locale').del()
        .then(function () {

            let data = [{
                id: 1,
                country: "en_IE",
                name: "Ireland",
                currencyCode: 'EUR',
                symbol: '€'
            }, {
                id: 2,
                country: "en_GB",
                name: "United Kingdom",
                currencyCode: 'GBP',
                symbol: '£'
            },
            {
                id: 3,
                country: "en_NZ",
                name: "New Zealand",
                currencyCode: 'NZD',
                symbol: '$'
            },
            {
                id: 4,
                country: "en_US",
                name: "United States",
                currencyCode: 'USD',
                symbol: '$'
            },
            {
                id: 5,
                country: "vi_VN",
                name: "Vietnam",
                currencyCode: 'VND',
                symbol: '₫'
            }]
            // Inserts seed entries
            return knex('locale').insert(data);
        });
}