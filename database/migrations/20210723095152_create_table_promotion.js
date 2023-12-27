
exports.up = function (knex) {
    return knex.schema.createTable('promotion', function (table) {
        table.increments();
        table.string('combinablePromotions');
        table.string('conditionalDescription');
        table.string('name').notNullable();
        table.integer('rank').notNullable();
        table.string('description');
        table.string('images');
        table.integer('exclusivity');
        // NO - Can be combined with any promotion.
        // CLASS - Can't be combined with promotions of the same class.
        // GLOBAL - Can't be combined with any promotion.
        table.text('discountProducts');
        table.text('discount').notNullable(); // JSON {"discount", "percent"}
        table.text('promotionClass').notNullable(); // JSON {"type": "Product, Order, "Shipping", "Example: "Amount, Price, Buy X get Y"}
        table.integer('status').defaultTo(0);
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('promotion');
};
