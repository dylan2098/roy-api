
exports.up = function (knex) {
    return knex.schema.createTable('siteconfig', function (table) {
        table.increments();
        table.string('name').notNullable();
        table.string('key').notNullable();
        table.integer('value').defaultTo(0);
        table.integer('status').defaultTo(1);
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.fn.now());
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('siteconfig');
};
