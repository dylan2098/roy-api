
exports.up = function (knex) {
    return knex.schema.createTable('service', function (table) {
        table.increments();
        table.string('host').notNullable();
        table.string('username').notNullable();
        table.string('password').notNullable();
        table.string('type').notNullable();
        table.string('port');
        table.integer('rateLimitMillis');
        table.integer('timeoutMillis');
        table.integer('status').defaultTo(0);
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.fn.now());
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('service');
};
