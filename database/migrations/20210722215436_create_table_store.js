
exports.up = function (knex) {
    return knex.schema.createTable('store', function (table) {
        table.increments();
        table.string('address_1').notNullable();
        table.string('address_2');
        table.string('city').notNullable();
        table.string('zipCode').notNullable();
        table.string('email').notNullable();
        table.string('phone_1').notNullable();
        table.string('phone_2');
        table.string('fax');
        table.string('latitude').notNullable();
        table.string('longitude').notNullable();
        table.integer('status').defaultTo(0);
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.fn.now());
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('store');
};
