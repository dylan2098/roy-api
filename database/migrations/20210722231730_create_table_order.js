
exports.up = function (knex) {
    return knex.schema.createTable('orders', function (table) {
        table.increments();
        table.string('orderNo').notNullable();
        table.integer('confirmationStatus').defaultTo(0);
        table.string('currencyCode').notNullable();
        table.string('customerEmail').notNullable();
        table.string('customerName').notNullable();
        table.string('customerLocaleID').notNullable();
        table.string('customerNo');
        table.date('expectedDate');
        table.integer('paymentStatus').defaultTo(0);
        table.integer('shippingStatus').defaultTo(0);
        table.integer('exportStatus').defaultTo(0);
        table.string('createdBy').notNullable();
        table.string('cancelDescription');
        table.integer('cancelCode'); // NONE_SPECIFIED - WRONG_SIZE - WRONG_COLOR
        table.string('affiliatePartnerName');
        table.integer('status').defaultTo(0);
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.fn.now());
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('orders');
};
