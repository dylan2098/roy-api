exports.seed = function (knex) {

    return knex('store').del()
        .then(function () {

            let data = [];

            for (let i = 1; i <= 20; i++) {
                data.push({
                    id: i,
                    address_1: "Address 1_" + i,
                    address_2: "Address 2_" + i,
                    city: i % 2 ? "Ho Chi Minh" : "Ninh Thuan",
                    zipCode: 70000,
                    email: "store.email_" + i + "@gmail.com",
                    phone_1: "0912345678",
                    phone_2: "0987654321",
                    latitude: "11.613267",
                    longitude: "108.921246"
                })
            }

            // Inserts seed entries
            return knex('store').insert(data);
        });
}