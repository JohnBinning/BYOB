# BYOB - Build Your Own Backend
### Baseball Hall of Fame API

### Endpoints

#### Franchises

##### Post to Franchises

Post to http://localhost:3000/api/v1/franchises

body: {
	"newFranchise": {
		"franch_id": "BNB",
		"franch_name": "Bad News Bears",
		"active": "Y",
		"league": "Little",
		"founded": "1976"
	},
	"token": "1234456"  // example, your private token goes here
}

#### Inducted people

##### Post to Inducted People

Post to http://localhost:3000/api/v1/inducted_people

Posts to new people must include a correct team_id for a franchise that has already been entered.  If you want to enter a new player for a franchise/team that is not yet in the database, you must post the franchise/team first.

body: {
	"newPerson": {
		"career": "1984-2017",
		"induction_method": "BBWAA",
		"name": "Roy Hobbs",
		"primary_team": "Detroit Tigers",
		"vote_percentage": "88",
		"year_inducted": "2017",
		"team_id": "35"
	},
	"token": "1234456"  // example, your private token goes here
}

or

body: {
	"newPerson": {
		"career": "1984-1996",
		"induction_method": "BBWAA",
		"name": "Ricky Vaughn",
		"primary_team": "Cleveland Indians",
		"vote_percentage": "91",
		"year_inducted": "2017",
		"team_id": 28
	},
	"token": "1234456"  // example, your private token goes here
}

#### Batters

##### Update Batters (put)

Put to http://localhost:3000/api/v1/batter_data/id/1
(replace 1 with the id of the batter you want)

{
	"batter": {
		"hr": "77"
	},
	"token": "1234456"  // example, your private token goes here
}

##### Post to Batters

A corresponding inducted person is required before posting a batter.  The induction_id of the batter must match the primary id of the inducted person.

Post to http://localhost:3000/api/v1/batter_data

body: {
	"newBatter": {
		"avg": ".350",
		"hits": "140",
		"hr": "44",
		"name": "Roy Hobbs",
		"induction_id": 309,
		"obp": ".447",
		"rbi": "106",
		"runs": "92",
		"sb": "3",
		"slg": ".750"
	},
	"token": "1234456"  // example, your private token goes here
}

#### pitchers

##### Post to pitchers

Post to http://localhost:3000/api/v1/pitcher_data

A corresponding inducted person is required before posting a pitcher.  The induction_id of the pitcher must match the primary id of the inducted person.

body: {
	"newPitcher": {
		"name": "Ricky Vaughn",
		"games": "189",
		"starts": "103",
		"wins": "46",
		"losses": "40",
		"era": "3.76",
		"strikeouts": "613",
		"walks": "325",
		"induction_id": 310
	},
	"token": "1234456"  // example, your private token goes here
}
