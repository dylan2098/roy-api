
exports.up = function (knex) {
    return knex.schema.createTable('shipping', function (table) {
        table.increments();
        table.integer('shippingOrderId').unsigned().index().references('id').inTable('shipping-order');
        table.string('shippingNo').notNullable();
        table.string('shipmentType').notNullable();
        table.boolean('isGift').defaultTo(false);
        table.integer('giftId').unsigned().index().references('id').inTable('gift');
        table.integer('status').defaultTo(1);
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('createdBy').notNullable();
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('shipping');
};
