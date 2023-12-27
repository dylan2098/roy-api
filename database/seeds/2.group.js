
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('group').del()
    .then(function () {
      // Inserts seed entries
      return knex('group').insert([
        {
          id: 1,
          name: 'Admin',
          description: 'Group admin',
          status: 1
        },
        {
          id: 2,
          name: 'Newbie',
          description: 'Group newbie',
          status: 1
        },
        {
          id: 3,
          name: 'Loyal Customer',
          description: 'Group loyal customer',
          status: 1
        }
      ]);
    });
};
