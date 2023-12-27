
exports.up = function (knex) {
    return knex.schema.createTable('coupon', function (table) {
        table.increments();
        table.string('codePrefix');
        table.integer('type').notNullable();
        table.integer('redemptionLimitPerCode');
        table.integer('redemptionLimitPerCustomer');
        table.integer('redemptionLimitPerTimeFrame');
        table.integer('redemptionLimitTimeFrame');
        table.integer('status').defaultTo(0);
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('coupon');
};
