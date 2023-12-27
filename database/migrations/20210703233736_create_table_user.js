exports.up = function (knex, Promise) {
    return knex.schema.createTable('users', function (table) {
        table.increments();
        table.string('email').notNullable();
        table.string('username').notNullable();
        table.string('password').notNullable();
        table.string('firstName').notNullable();
        table.string('lastName');
        table.integer('gender').notNullable().defaultTo(0);
        table.datetime('birthday').defaultTo(knex.fn.now());
        table.string('phone').notNullable();
        table.string('codeActive');
        table.integer('role').notNullable().defaultTo(2);
        table.string('refreshToken');
        table.integer('status').defaultTo(0);
        table.boolean('optionEmail').defaultTo(false);
        table.string('locale').notNullable().defaultTo('en_US');
        table.string('image').defaultTo("default-user.jpg");
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.fn.now());
    })
}

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('users');
}