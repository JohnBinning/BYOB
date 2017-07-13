const pitchers = require('../../../data/pitcherData.js');

const createPerson = (knex, person) => {
  return knex('pitcher_data').insert({
    name: person.name,
    games: person.games,
    starts: person.starts,
    wins: person.wins,
    losses: person.losses,
    era: person.era,
    strikeouts: person.strikeouts,
    walks: person.walks,
    induction_id: person.inductionId,
  }, 'id');
};

exports.seed = (knex, Promise) => {
  return knex('pitcher_data').del()
    .then(() => {
      const pitcherPromises = [];
      pitchers.forEach((pitcher) => {
        pitcherPromises.push(createPerson(knex, pitcher));
      });

      return Promise.all(pitcherPromises);
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
