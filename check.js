const franchises = require('./data/teamData');

const players = require('./data/inductedPeople');
const batters = require('./data/batterData');

const biz = batters.filter( batter => {
  return batter.name.includes('biz');
})

const idArr = batters.map( batter => {
  return batter.inductionId
})

const idLimit = idArr.filter( batterId => {
  return batterId < 309
})

const batterId = idArr.reduce((acc, batter) => {
  acc[batter] ? acc[batter] +=1 : acc[batter] = 1
  return acc
},{})

// const catcherNames = catchers.map( a => {
//   return a.name
// })

console.log(batters.length);
