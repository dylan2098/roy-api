exports.seed = function (knex) {

    return knex('registered-product').del()
        .then(function () {

            let data = [];

            const listLastName = ["Smith", "Jones", "Black", "Potter", "Williams", "Taylor", "Brown", "Davies", "Evans", "Wilson", "Thomas", "Johnson", "Roberts", "Robinson", "Thompson", "Wright", "Walker", "White", "Edwards", "Hughes", "Green", "Hall", "Carney", "Norwood", "Martin", "Ellis", "Freeman"];
            const listFirstName = ["Tom", "Harry", "James", "Lily", "Sirius", "Acacia", "Adela", "Adelaide", "Agatha", "Aubrey", "Audrey", "Aurora", "Fiona", "Griselda", "Cadell", "Devlin", "Duncan", "Egbert", "Kenelm", "Kelsey", "Fred", "Ethelbert", "Hubert", "Darryl", "Erasmus", "Ambrose", "Jonathan"];

            for (let i = 1; i <= 20; i++) {
                data.push({
                    id: i,
                    productId: i,
                    storeId: i,
                    name: listFirstName[i % 20] + " " + listLastName[i % 20],
                    email: (listFirstName[i % 20] + listLastName[i % 20]).toLowerCase() + '@gmail.com',
                    phone: "0923456789"
                })
            }

            // Inserts seed entries
            return knex('registered-product').insert(data);
        });
}