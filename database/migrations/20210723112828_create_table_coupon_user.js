
exports.up = function (knex) {
    return knex.schema.createTable('coupon-user', function (table) {
        table.increments();
        table.integer('couponId').unsigned().index().references('id').inTable('coupon');
        table.integer('userId').unsigned().index().references('id').inTable('users');
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('coupon-user');
};
