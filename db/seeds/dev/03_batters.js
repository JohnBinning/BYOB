const batters = require('../../../data/batterData.js');

const createPerson = (knex, person) => {
  return knex('batter_data').insert({ //knex.insert is a Promise and MUST be returned
    avg: person.avg,
    hits: person.hits,
    hr: person.hr,
    name: person.name,
    induction_id: person.inductionId,
    obp: person.obp,
    rbi: person.rbi,
    runs: person.runs,
    sb: person.sb,
    slg: person.slg,
  }, 'id');
};

exports.seed = (knex, Promise) => {
  return knex('batter_data').del()
    .then(() => {
      const batterPromises = [];
      batters.forEach((batter) => {
        batterPromises.push(createPerson(knex, batter));
      });

      return Promise.all(batterPromises);
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
