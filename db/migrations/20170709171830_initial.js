exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('franchises', (table) => {
      table.increments('id').primary();
      table.string('franch_id').unique();
      table.string('franch_name');
      table.string('active');
      table.string('league');
      table.string('founded');
      table.timestamps();
    }),
  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('franchises'),
  ]);
};
