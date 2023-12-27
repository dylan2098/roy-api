exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('siteconfig').del()
        .then(function () {
            let data = [{
                id: 1,
                name: "Dark night",
                key: "night-theme"
            }];

            for (let i = 2; i < 30; i++) {
                data.push({
                    id: i,
                    name: "Config " + i,
                    key: "config_" + i
                })
            }

            // Inserts seed entries
            return knex('siteconfig').insert(data);
        });
};
