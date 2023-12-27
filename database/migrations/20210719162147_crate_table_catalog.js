
exports.up = function (knex) {
    return knex.schema.createTable('catalog', function (table) {
        table.increments();
        table.string('name').notNullable();
        table.string('description');
        table.integer('status').defaultTo(0);
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.fn.now());
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('catalog');
};
