
exports.up = function (knex) {
    return knex.schema.createTable('invoice', function (table) {
        table.increments();
        table.string('invoiceNumber').notNullable();
        table.integer('orderId').unsigned().index().references('id').inTable('orders');
        table.string('orderNo').notNullable();
        table.text('orderItem').notNullable(); // JSON items and quantity
        table.float('basePrice').notNullable();
        table.float('grossPrice').notNullable();
        table.float('netPrice').notNullable();
        table.float('tax').notNullable();
        table.integer('status').defaultTo(1);
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('createdBy').notNullable();
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('invoice');
};
