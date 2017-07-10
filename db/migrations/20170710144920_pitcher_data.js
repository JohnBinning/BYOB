exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('pitcher_data', (table) => {
      table.increments('id').primary();
      table.string('name');
      table.string('games');
      table.string('starts');
      table.string('wins');
      table.string('losses');
      table.string('era');
      table.string('strikeouts');
      table.string('walks');
      table.integer('induction_id').unsigned();
      table.foreign('induction_id').references('inducted_people.id');
      table.timestamps();
    }),
  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('pitcher_data'),
  ]);
};
