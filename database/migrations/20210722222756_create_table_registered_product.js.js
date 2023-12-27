
exports.up = function (knex) {
    return knex.schema.createTable('registered-product', function (table) {
        table.increments();
        table.integer('productId').unsigned().index().references('id').inTable('product');
        table.integer('storeId').unsigned().index().references('id').inTable('store');
        table.string('name').notNullable();
        table.string('email').notNullable();
        table.string('phone').notNullable();
        table.boolean('isSendMail').defaultTo(false);
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.fn.now());
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('registered-product');
};
