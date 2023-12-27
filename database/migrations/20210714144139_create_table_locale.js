
exports.up = function (knex) {
    return knex.schema.createTable('locale', function (table) {
        table.increments();
        table.string('country').notNullable();
        table.string('name').notNullable();
        table.string('currencyCode').notNullable();
        table.string('symbol').notNullable();
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('locale');
};
