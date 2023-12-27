
exports.seed = function (knex) {
    return knex('group-user').del()
        .then(function () {

            let data = [{
                id: 1,
                userId: 1,
                groupId: 1
            }]

            for (let i = 2; i < 500; i++) {
                data.push({
                    id: i,
                    userId: i,
                    groupId: 2
                })
            }

            for (let i = 500; i < 731; i++) {
                data.push({
                    id: i,
                    userId: i,
                    groupId: 3
                })
            }

            // Inserts seed entries
            return knex('group-user').insert(data);
        });
}