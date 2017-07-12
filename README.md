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
