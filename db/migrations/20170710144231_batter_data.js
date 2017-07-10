exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('batter_data', (table) => {
      table.increments('id').primary();
      table.string('avg');
      table.string('hits');
      table.string('hr');
      table.string('name');
      table.integer('induction_id').unsigned();
      table.foreign('induction_id').references('inducted_people.id');
      table.string('obp');
      table.string('rbi');
      table.string('runs');
      table.string('sb');
      table.string('slg');
      table.timestamps();
    }),
  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('batter_data'),
  ]);
};
