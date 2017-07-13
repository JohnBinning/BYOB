const franchises = require('../../../data/testData/testTeams.js');
const inductedPeople = require('../../../data/testData/testPeople.js');
const batters = require('../../../data/testData/testBatters.js');
const pitchers = require('../../../data/testData/testPitchers.js');

const createPitcher = (knex, person) => {
  return knex('pitcher_data').insert({
    id: person.id,
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
        pitcherPromises.push(createPitcher(knex, pitcher));
      });

      return Promise.all(pitcherPromises);
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};

const createBatter = (knex, person) => {
  return knex('batter_data').insert({
    id: person.id,
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
        batterPromises.push(createBatter(knex, batter));
      });

      return Promise.all(batterPromises);
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};

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

const createFranchise = (knex, franchise) => {
  return knex('franchises').insert({
    id: franchise.id,
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
