
exports.up = function (knex) {
    return knex.schema.createTable('order-item', function (table) {
        table.increments();
        table.integer('productId').unsigned().index().references('id').inTable('product');
        table.integer('orderId').unsigned().index().references('id').inTable('orders');
        table.integer('quantity').defaultTo(0);
        table.float('amount').defaultTo(0);
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('order-item');
};
