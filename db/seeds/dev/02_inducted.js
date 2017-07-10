const inductedPeople = require('../../../data/inductedPeople.js');

const createPerson = (knex, person) => {
  return knex('inducted_people').insert({ //knex.insert is a Promise and MUST be returned
    career: person.career,
    name: person.name,
    position: person.position,
    primary_team: person.primaryTeam,
    year_inducted: person.yearInducted,
    team_id: person.teamId,
  }, 'id');
};

exports.seed = (knex, Promise) => {
  return knex('inducted_people').del()
    .then(() => {
      const peoplePromises = [];
      inductedPeople.forEach((people) => {
        peoplePromises.push(createPerson(knex, people));
      });

      return Promise.all(peoplePromises);
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
