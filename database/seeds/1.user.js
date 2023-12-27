exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('users').del()
        .then(function () {

            const listLastName = ["Smith", "Jones", "Black", "Potter", "Williams", "Taylor", "Brown", "Davies", "Evans", "Wilson", "Thomas", "Johnson", "Roberts", "Robinson", "Thompson", "Wright", "Walker", "White", "Edwards", "Hughes", "Green", "Hall", "Carney", "Norwood", "Martin", "Ellis", "Freeman"];
            const listFirstName = ["Tom", "Harry", "James", "Lily", "Sirius", "Acacia", "Adela", "Adelaide", "Agatha", "Aubrey", "Audrey", "Aurora", "Fiona", "Griselda", "Cadell", "Devlin", "Duncan", "Egbert", "Kenelm", "Kelsey", "Fred", "Ethelbert", "Hubert", "Darryl", "Erasmus", "Ambrose", "Jonathan"];

            let data = [{
                id: 1,
                email: 'admin@gmail.com',
                username: "admin",
                password: '$2a$10$Qs6H.IG1/LoZCS59uBEKp.Bn9Bp5vz28ngSzDcW9CnHl8JS8bhscS',
                firstName: 'Admin',
                lastName: 'Nguyen',
                phone: '0933834993',
                gender: 1,
                role: 1,
                status: 1,
            }];

            let i = 1;
            for (lastName of listLastName) {
                for (firstName of listFirstName) {
                    i++;
                    data.push({
                        id: i,
                        email: firstName.toLowerCase() + '.' + lastName.toLowerCase() + '.' + i + '@gmail.com',
                        username: firstName.toLowerCase() + '.' + lastName.toLowerCase() + '.' + i,
                        password: '$2a$10$Qs6H.IG1/LoZCS59uBEKp.Bn9Bp5vz28ngSzDcW9CnHl8JS8bhscS',
                        gender: i % 3,
                        firstName: firstName,
                        lastName: lastName,
                        phone: '0949667264',
                        role: 2,
                        status: i % 50 === 0 ? 0 : 1,
                    })
                }
            }

            // Inserts seed entries
            return knex('users').insert(data);
        });
};
