const inductedPeople = require('../../../data/inductedPeople.js');

const createPerson = (knex, person) => {
  return knex('inducted_people').insert({
    career: person.career,
    name: person.name,
    position: person.position,
    primary_team: person.primaryTeam,
    vote_percentage: person.votePercentage,
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
