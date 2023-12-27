
exports.up = function (knex) {
    return knex.schema.createTable('payment-transaction', function (table) {
        table.increments();
        table.string('transactionId').notNullable();
        table.integer('orderId').unsigned().index().references('id').inTable('orders');
        table.integer('type').notNullable();  // Authorization - Authorization Reversal - Capture - Credit
        table.integer('status').defaultTo(0);
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('payment-transaction');
};
