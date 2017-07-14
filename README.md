# BYOB - Build Your Own Backend
### Baseball Hall of Fame API

### Endpoints

#### Franchises

##### Get Franchises

For all franchises:
Get to http://byobaseball.herokuapp.com/api/v1/franchises/


For a specific franchise by id:
Get to http://byobaseball.herokuapp.com/api/v1/franchises/id/3

For a specific franchise by name:
Get to http://byobaseball.herokuapp.com/api/v1/franchises/name/Colorado%20Rockies

For active/not active franchises:
Get to
 http://byobaseball.herokuapp.com/api/v1/franchises/?active=y or active=n


##### Update Franchises (put)

Put to http://byobaseball.herokuapp.com/api/v1/franchises/id/1
(replace 1 with the id of the batter you want)

body: {
		"franchise": {
			"active": "N"
			},
			"token": "1234456"  // example, your private token goes here
		}

Only put the data fields you would like to update, not all fields will be necessary for every put request

If updating active please use capital letters

##### Post to Franchises

Post to http://byobaseball.herokuapp.com/api/v1/franchises

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

All data fields in the above example are required

##### Delete Franchise

If an inducted person is dependent on the target person, that person's record must be deleted prior to deleting the franchise.

Delete to http://byobaseball.herokuapp.com/api/v1/franchises/delete/14

body: {
	"token": "1234456"  // example, your private token goes here
}

#### Inducted People

##### Get People

For all people:
Get to http://byobaseball.herokuapp.com/api/v1/inducted_people/


For a specific person by id:
Get to http://byobaseball.herokuapp.com/api/v1/inducted_people/id/3

For a specific person by name:
Get to http://byobaseball.herokuapp.com/api/v1/inducted_people/name/Ty%20Cobb

##### Update Inducted People (put)

Put to http://byobaseball.herokuapp.com/api/v1/inducted_people/id/1
(replace 1 with the id of the person you want)

body: {
		"person": {
			"name": "Roy Hobbs"
			},
			"token": "1234456"  // example, your private token goes here
		}

Only put the data fields you would like to update, not all fields will be necessary for every put request

##### Post to Inducted People

Post to http://byobaseball.herokuapp.com/api/v1/inducted_people

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

All data fields in the above example are required


##### Delete Inducted Person

If a pitcher or batter is dependent on the target person, the pitcher/batter's record must be deleted prior to deleting the person.

Delete to http://byobaseball.herokuapp.com/api/v1/inducted_people/delete/14

body: {
	"token": "1234456"  // example, your private token goes here
}

#### Batters

##### Get Batters

For all batters:
Get to http://byobaseball.herokuapp.com/api/v1/batter_data/


For a specific batter by id:
Get to http://byobaseball.herokuapp.com/api/v1/batter_data/id/3

For a specific batter by name:
Get to http://byobaseball.herokuapp.com/api/v1/batter_data/name/Ty%20Cobb

##### Update Batters (put)

Put to http://byobaseball.herokuapp.com/api/v1/batter_data/id/1
(replace 1 with the id of the batter you want)

body: {
		"batter": {
			"hr": "77"
			},
			"token": "1234456"  // example, your private token goes here
		}

Only put the data fields you would like to update, not all fields will be necessary for every put request

##### Post to Batters

A corresponding inducted person is required before posting a batter.  The induction_id of the batter must match the primary id of the inducted person.

Post to http://byobaseball.herokuapp.com/api/v1/batter_data

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

All data fields in the above example are required


##### Delete Batters

Delete to http://byobaseball.herokuapp.com/api/v1/batter_data/delete/14

body: {
	"token": "1234456"  // example, your private token goes here
}

#### Pitchers

##### Get Pitchers

For all pitchers:
Get to http://byobaseball.herokuapp.com/api/v1/pitcher_data/


For a specific pitcher by id:
Get to http://byobaseball.herokuapp.com/api/v1/pitcher_data/id/3

For a specific pitcher by name:
Get to http://byobaseball.herokuapp.com/api/v1/pitcher_data/name/Randy%20Johnson



##### Update Pitchers (put)

Put to http://byobaseball.herokuapp.com/api/v1/pitcher_data/id/1
(replace 1 with the id of the pitcher you want)

body: {
		"pitcher": {
			"era": "3.18",
			"wins": "201"
			},
			"token": "1234456"  // example, your private token goes here
		}

Only put the data fields you would like to update, not all fields will be necessary for every put request

##### Post to pitchers

Post to http://byobaseball.herokuapp.com/api/v1/pitcher_data

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

All data fields in the above example are required


##### Delete Pitchers

Delete to http://byobaseball.herokuapp.com/api/v1/pitcher_data/delete/14

body: {
	"token": "1234456"  // example, your private token goes here
}
