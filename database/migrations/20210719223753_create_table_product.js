
exports.up = function (knex) {
    return knex.schema.createTable('product', function (table) {
        table.increments();
        table.string('sku').notNullable();
        table.integer('categoryId').unsigned().index().references('id').inTable('category');
        table.string('name').notNullable();
        table.string('type').notNullable();;
        table.integer('productMaster');
        table.text('variants');
        table.text('bundled');
        table.text('productSet');
        table.string('brand').notNullable();
        table.string('color');
        table.string('size');
        table.string('depth');
        table.string('height');
        table.string('weight');
        table.string('width');
        table.string('length');
        table.string('age');
        table.text('additionalAttributes'); // property list added as JSON
        table.text('shortDesc');
        table.text('longDesc');
        table.string('manufacturerName');
        table.integer('minOrderQuantity').defaultTo(1);
        table.boolean('searchableIfUnavailable').defaultTo(false);
        table.boolean('storeForcePriceEnabled').defaultTo(false);
        table.boolean('storeNonDiscountableEnabled').defaultTo(true);
        table.string('unit');
        table.integer('status').defaultTo(0);
        table.integer('numberOrder').defaultTo(0);
        table.text('image');
        table.text('images');
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.fn.now());
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('product');
};
