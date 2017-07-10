exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('inducted_people', (table) => {
      table.increments('id').primary();
      table.string('career');
      table.string('induction_method');
      table.string('name');
      table.string('position');
      table.string('primary_team');
      table.string('vote_percentage');
      table.string('year_inducted');
      table.integer('team_id').unsigned();
      table.foreign('team_id').references('franchises.id');
      table.timestamps();
    }),
  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('inducted_people'),
  ]);
};
