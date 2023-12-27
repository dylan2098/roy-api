
exports.up = function (knex) {
    return knex.schema.createTable('group-user', function (table) {
        table.increments();
        table.integer('userId').unsigned().index().references('id').inTable('users');
        table.integer('groupId').unsigned().index().references('id').inTable('group');
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('group-user');
};
