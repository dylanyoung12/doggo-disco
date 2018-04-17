
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('doggos', function(table) {
      table.increments('id').primary();
      table.string('breed');
      table.string('sub_breed');
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users');
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
      knex.schema.dropTable('doggos'),
    ]);
};
