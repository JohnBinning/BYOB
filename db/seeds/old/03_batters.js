// const batters = require('../../../data/testData/testBatters.js');
//
// const createBatter = (knex, person) => {
//   return knex('batter_data').insert({
//     id: person.id,
//     avg: person.avg,
//     hits: person.hits,
//     hr: person.hr,
//     name: person.name,
//     induction_id: person.inductionId,
//     obp: person.obp,
//     rbi: person.rbi,
//     runs: person.runs,
//     sb: person.sb,
//     slg: person.slg,
//   }, 'id');
// };
//
// exports.seed = (knex, Promise) => {
//   return knex('batter_data').del()
//     .then(() => {
//       const batterPromises = [];
//       batters.forEach((batter) => {
//         batterPromises.push(createBatter(knex, batter));
//       });
//
//       return Promise.all(batterPromises);
//     })
//     .catch(error => console.log(`Error seeding data: ${error}`));
// };
