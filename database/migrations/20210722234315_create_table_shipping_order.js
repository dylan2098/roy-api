
exports.up = function (knex) {
    return knex.schema.createTable('shipping-order', function (table) {
        table.increments();
        table.string('invoiceNumber').notNullable();
        table.string('shippingNo').notNullable();
        table.float('basePrice').notNullable();
        table.float('grossPrice').notNullable();
        table.float('netPrice').notNullable();
        table.float('tax').notNullable();
        table.text('orderItem').notNullable();
        table.string('orderNo').notNullable();
        table.string('warehouseName').notNullable();
        table.integer('status').defaultTo(1);
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('createdBy').notNullable();
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('shipping-order');
};
