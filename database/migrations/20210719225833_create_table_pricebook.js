
exports.up = function (knex) {
    return knex.schema.createTable('pricebook', function (table) {
        table.increments();
        table.string('currencyCode').notNullable();
        table.string('description');
        table.string('name').notNullable();;
        table.integer('status').defaultTo(1);
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.fn.now());
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('pricebook');
};
