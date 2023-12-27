
exports.up = function (knex) {
    return knex.schema.createTable('category', function (table) {
        table.increments();
        table.integer('catalogId').unsigned().index().references('id').inTable('catalog');
        table.string('image').defaultTo("default-user.jpg");
        table.string('name').notNullable();
        table.string('description');
        table.integer('status').defaultTo(0);
        table.integer('parentId');
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.fn.now());
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('category');
};
