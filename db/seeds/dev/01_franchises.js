const franchises = require('../../../data/teamData.js');

const createFranchise = (knex, franchise) => {
  return knex('franchises').insert({ //knex.insert is a Promise and MUST be returned
    franch_id: franchise.franchID,
    franch_name: franchise.franchName,
    active: franchise.active,
    league: franchise.league,
    founded: franchise.founded,
  }, 'id');
};

exports.seed = (knex, Promise) => {
  return knex('franchises').del()
    .then(() => {
      const franchisePromises = [];
      franchises.forEach((franchise) => {
        franchisePromises.push(createFranchise(knex, franchise));
      });

      return Promise.all(franchisePromises);
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
