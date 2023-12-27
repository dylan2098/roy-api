
exports.up = function (knex) {
    return knex.schema.createTable('customer-payment-instrument', function (table) {
        table.increments();
        table.string('bankAccountHolder').notNullable();
        table.string('bankRoutingNumber').notNullable();
        table.integer('creditCardExpirationMonth').notNullable();
        table.integer('creditCardExpirationYear').notNullable();
        table.string('creditCardHolder').notNullable();
        table.string('creditCardNumber').notNullable();
        table.string('creditCardType').notNullable();
        table.boolean('creditCardValidFromMonth').notNullable();
        table.boolean('creditCardValidFromYear').notNullable();
        table.string('paymentMethod').notNullable();
        table.integer('status').notNullable();
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('customer-payment-instrument');
};
