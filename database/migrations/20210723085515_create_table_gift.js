
exports.up = function (knex) {
    return knex.schema.createTable('gift', function (table) {
        table.increments();
        table.string('recipientEmail').notNullable();
        table.string('recipientName').notNullable();
        table.string('recipientPhone').notNullable();
        table.string('receipientAddress').notNullable();
        table.string('senderName').notNullable();
        table.string('senderEmail').notNullable();
        table.string('senderPhone').notNullable();
        table.string('message').notNullable();
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('gift');
};
