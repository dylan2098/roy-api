
exports.up = function (knex) {
    return knex.schema.createTable('product-price', function (table) {
        table.increments();
        table.integer('productId').unsigned().index().references('id').inTable('product');
        table.integer('pricebookId').unsigned().index().references('id').inTable('pricebook');
        table.float('basePrice').notNullable();
        table.float('grossPrice').notNullable();
        table.float('netPrice').notNullable();
        table.float('tax').notNullable();
        table.string('note');
        table.integer('status').defaultTo(1);
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.fn.now());
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('product-price');
};
