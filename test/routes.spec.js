/* eslint-disable */
process.env.NODE_ENV = 'test';

const express = require('express');
const bodyParser = require('body-parser');
const knex = require('knex');
const app = express();
const environment = 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server/server');
const should = chai.should();

chai.use(chaiHttp);

const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN0ZXZlIiwicGFzc3dvcmQiOiJ0aWdlciIsImlhdCI6MTUwMDAwNDYzNywiZXhwIjoxNTAxMjE0MjM3fQ.ZQtF1M9Rfq6e1pAK4C11g5Joo9fVRLYOG6_StgbLA-Q';
describe('base sad path', () => {
  beforeEach((done) => {
    database.seed.run()
      .then(() => {
        done();
      });
  });

  it('/api/v1/sadthings should not work', () => {
    chai.request(server)
    .get('/api/v1/sadthings')
    .end((err, response) => {
      response.should.have.status(404);
      done();
    });
  })

  it('/should not work', () => {
    chai.request(server)
    .get('/')
    .end((err, response) => {
      response.should.have.status(404);
      done();
    });
  })
});

describe('franchise routes', () => {
  beforeEach((done) => {
    database.seed.run()
      .then(() => {
        done();
      });
  });


  it('should get the franchises', (done) => {
    chai.request(server)
    .get('/api/v1/franchises')
    .end((err, response) => {
      response.should.have.status(200);
      response.should.be.json;
      response.body[0].should.be.a('object');
      response.body.length.should.equal(5);
      done();
    });
  });

  it('should get a specific franchise', (done) => {
    chai.request(server)
    .get('/api/v1/franchises/id/1')
    .end((err, response) => {

      response.should.have.status(200);
      response.should.be.json;
      response.body[0].should.be.a('object');
      response.body.length.should.equal(1);
      done();
    });
  });

  it('should not get a specific franchise with bad id info', (done) => {
    chai.request(server)
    .get('/api/v1/franchises/id/10000')
    .end((err, response) => {

      response.should.have.status(404);
      response.body.should.be.a('object');
      response.body.error.should.equal('No franchise found with id of 10000')
      done();
    });
  });

  it('should post a franchise', (done) => {
    let newFranchiseBody = {
    	newFranchise: {
        id: 6,
    		franch_id: "BNB",
    		franch_name: "Bad News Bears",
    		active: "Y",
    		league: "little",
    		founded: "1976"
    	},
      	token: authToken
    }
    chai.request(server)
    .post('/api/v1/franchises')
    .send(newFranchiseBody)
    .end((err, response) => {
      response.should.have.status(201);
      response.body.id.should.equal(6)
      done();
    });
  });

  it('should not post a franchise w/o a token', (done) => {
    let newFranchiseBody = {
    	newFranchise: {
        id: 6,
    		franch_id: "BNB",
    		franch_name: "Bad News Bears",
    		active: "Y",
    		league: "little",
    		founded: "1976"
    	}
    }
    chai.request(server)
    .post('/api/v1/franchises')
    .send(newFranchiseBody)
    .end((err, response) => {
      response.should.have.status(403);
      response.body.message.should.equal('You must be authorized to hit this endpoint');
      done();
    });
  });

  it('should not post a franchise w a missing required param', (done) => {
    let newFranchiseBody = {
    	newFranchise: {
        id: 6,
    		franch_id: "BNB",
    		active: "Y",
    		league: "little",
    		founded: "1976"
    	},
      token: authToken
    }
    chai.request(server)
    .post('/api/v1/franchises')
    .send(newFranchiseBody)
    .end((err, response) => {
      response.should.have.status(422);
      response.body.error.should.equal('Expected format: { franchId: <String>, franchName: <String>, active: <String>\n        with optional values of league: <String>, founded: <String> }. You are missing a franch_name property.');
      done();
    });
  });

  it('should delete a franchise', (done) => {
    chai.request(server)
    .get('/api/v1/franchises')
    .end((err, response) => {

      response.body.length.should.equal(5);

      chai.request(server)
      .delete('/api/v1/franchises/delete/1')
      .send({ token: authToken })
      .end((error, response) => {

        response.should.have.status(204);

        chai.request(server)
        .get('/api/v1/franchises')
        .end((err, response) => {

          response.body.length.should.equal(4);
        })
      done();
      });
    });

    it('should edit a franchise', (done) => {
      let newUpdate = {
        "franchise": {
    			"franch_name": "Bad News Bears"
    			},
        	token: authToken
      }
      chai.request(server)
      .put('/api/v1/franchises/id/1')
      .send(newUpdate)
      .end((err, response) => {

        response.should.have.status(201);

        chai.request(server)
        .get('/api/v1/franchises/id/1')
        .end((err, response) => {

          response.should.have.status(200);
          response.should.be.json;
          response.body[0].should.be.a('object');
          response.body[0].franch_name.should.equal('Bad News Bears');
        done();
        });
      });
    });
  });

   it('should not edit a franchise if the id does not exist', (done) => {
    let newUpdate = {
      "franchise": {
  			"franch_name": "Very Bad News Bears"
  			},
      	token: authToken
    }
    chai.request(server)
    .put('/api/v1/franchises/id/100000')
    .send(newUpdate)
    .end((err, response) => {

      response.should.have.status(422);
      done();
      });
    });

  it('should not delete a franchise when the id is incorrect', (done) => {
    chai.request(server)
    .delete('/api/v1/franchises/delete/10000')
    .send({ token: authToken })
    .end((error, response) => {

    response.should.have.status(404);
    });
    done();
  });
});

describe('inducted people routes', () => {
  beforeEach((done) => {
    database.seed.run()
      .then(() => {
        done();
      });
  });

  it('should get all the people', (done) => {
    chai.request(server)
    .get('/api/v1/inducted_people')
    .end((err, response) => {
      response.should.have.status(200);
      response.should.be.json;
      response.body[0].should.be.a('object');
      response.body.length.should.equal(28);
      done();
    });
  });

  it('should get a specific person', (done) => {
    chai.request(server)
    .get('/api/v1/inducted_people/id/1')
    .end((err, response) => {

      response.should.have.status(200);
      response.should.be.json;
      response.body[0].should.be.a('object');
      response.body.length.should.equal(1);
      done();
    });
  });

  it('should not get a specific person with bad id info', (done) => {
    chai.request(server)
    .get('/api/v1/inducted_people/id/10000')
    .end((err, response) => {

      response.should.have.status(404);
      response.body.should.be.a('object');
      response.body.error.should.equal('No people found with id of 10000')
      done();
    });
  });

  it('should post a person', (done) => {
    let newPersonBody = {
      "newPerson": {
        "id": 29,
    		"career": "1984-2017",
    		"induction_method": "BBWAA",
    		"name": "Roy Hobbs",
    		"primary_team": "Atlanta Braves",
    		"vote_percentage": "88",
    		"year_inducted": "2017",
    		"team_id": "4"
    	},
      	token: authToken
    }
    chai.request(server)
    .post('/api/v1/inducted_people')
    .send(newPersonBody)
    .end((err, response) => {
      response.should.have.status(201);
      response.body.id.should.equal(29);

      chai.request(server)
      .get('/api/v1/inducted_people')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body[0].should.be.a('object');
        response.body.length.should.equal(29);
      done();
      });
    });
  });

  it('should not post a person w a missing required param', (done) => {
    let newPersonBody = {
    	"newPerson": {
        "id": 29,
    		"career": "1984-2017",
    		"induction_method": "BBWAA",
    		"primary_team": "Atlanta Braves",
    		"vote_percentage": "88",
    		"year_inducted": "2017",
    		"team_id": "4"
    	},
      token: authToken
    }
    chai.request(server)
    .post('/api/v1/inducted_people')
    .send(newPersonBody)
    .end((err, response) => {
      response.should.have.status(422);
      response.body.error.should.equal('Expected format: { career: <String>, induction_method: <String>, name: <String>, primary_team: <String>, vote_percentage: <String>, year_inducted: <String>,\n        team_id: <Integer>}. You are missing a name property.')
      done();
    });
  });

  it('should not post a person w/o a token', (done) => {
    let newPersonBody = {
    	"newPerson": {
        "id": 29,
    		"career": "1984-2017",
    		"induction_method": "BBWAA",
    		"name": "Roy Hobbs",
    		"primary_team": "Atlanta Braves",
    		"vote_percentage": "88",
    		"year_inducted": "2017",
    		"team_id": "4"
    	}
    }
    chai.request(server)
    .post('/api/v1/inducted_people')
    .send(newPersonBody)
    .end((err, response) => {
      response.should.have.status(403);
      response.body.message.should.equal('You must be authorized to hit this endpoint');
      done();
    });
  });

  it('should edit a person', (done) => {
    let newUpdate = {
      "person": {
  			"name": "Roy Hobbs"
  			},
      	token: authToken
    }
    chai.request(server)
    .put('/api/v1/inducted_people/id/1')
    .send(newUpdate)
    .end((err, response) => {

      response.should.have.status(201);

      chai.request(server)
      .get('/api/v1/inducted_people/id/1')
      .end((err, response) => {

        response.should.have.status(200);
        response.should.be.json;
        response.body[0].should.be.a('object');
        response.body[0].name.should.equal('Roy Hobbs');
      done();
      });
    });
  });

  it('should not edit a person if the id does not exist', (done) => {
    let newUpdate = {
      "person": {
  			"name": "Roy Hobbs"
  			},
      	token: authToken
    }
    chai.request(server)
    .put('/api/v1/inducted_people/id/100000')
    .send(newUpdate)
    .end((err, response) => {

      response.should.have.status(422);
      done();
      });
  });

  it('should not edit a person w/o a token', (done) => {
    let newUpdate = {
      "person": {
  			"name": "Roy Hobbs"
  			},
    }
    chai.request(server)
    .put('/api/v1/inducted_people/id/1')
    .send(newUpdate)
    .end((err, response) => {

      response.should.have.status(403);
      done();
      });
  });

  it('should delete a person', (done) => {
    chai.request(server)
    .get('/api/v1/inducted_people')
    .end((err, response) => {

      response.body.length.should.equal(28);

      chai.request(server)
      .delete('/api/v1/inducted_people/delete/1')
      .send({ token: authToken })
      .end((error, response) => {
        response.should.have.status(204);

        chai.request(server)
        .get('/api/v1/inducted_people')
        .end((err, response) => {

          response.body.length.should.equal(27);
        })
      done();
      });
    });
  });

  it('should not delete a person w/o a correct token', (done) => {
    chai.request(server)
      .delete('/api/v1/inducted_people/delete/1')
      .send({ token: '42' })
      .end((error, response) => {
        response.should.have.status(403);
      done()
    })
    });
  });

describe('batter_data routes', () => {
    beforeEach((done) => {
      database.seed.run()
        .then(() => {
          done();
        });
    });

    it('should get the batters', (done) => {
      chai.request(server)
      .get('/api/v1/batter_data')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body[0].should.be.a('object');
        response.body.length.should.equal(12);
        done();
      });
    });

    it('should get a specific batter', (done) => {
      chai.request(server)
      .get('/api/v1/batter_data/id/1')
      .end((err, response) => {

        response.should.have.status(200);
        response.should.be.json;
        response.body[0].should.be.a('object');
        response.body.length.should.equal(1);
        done();
      });
    });

    it('should not get a specific batter with bad id info', (done) => {
      chai.request(server)
      .get('/api/v1/batter_data/id/10000')
      .end((err, response) => {

        response.should.have.status(404);
        response.body.should.be.a('object');
        response.body.error.should.equal('No batters found with id of 10000')
        done();
      });
    });

    it('should post a batter', (done) => {

      let newPersonBody = {
      "newPerson": {
        "id": 29,
    		"career": "1984-2017",
    		"induction_method": "BBWAA",
    		"name": "Roy Hobbs",
    		"primary_team": "Atlanta Braves",
    		"vote_percentage": "88",
    		"year_inducted": "2017",
    		"team_id": "4"
    	},
      	token: authToken
    }
    chai.request(server)
    .post('/api/v1/inducted_people')
    .send(newPersonBody)
    .end((err, response) => {
      response.should.have.status(201);
      response.body.id.should.equal(29);
      let newBatterBody = {
        "newBatter": {
          "id": 13,
          "avg": ".350",
          "hits": "140",
          "hr": "44",
          "name": "Roy Hobbs",
          "induction_id": 1 ,
          "obp": ".447",
          "rbi": "106",
          "runs": "92",
          "sb": "3",
          "slg": ".750"
        },
          token: authToken
      }
      chai.request(server)
      .post('/api/v1/batter_data')
      .send(newBatterBody)
      .end((err, response) => {
        response.should.have.status(201);
        response.body.id.should.equal(13)
        done();
      });
    });

    it('should edit a batter', (done) => {
      let newUpdate = {
        "batter": {
          "name": "Roy Hobbs"
          },
          token: authToken
      }
      chai.request(server)
      .put('/api/v1/batter_data/id/1')
      .send(newUpdate)
      .end((err, response) => {

        response.should.have.status(201);

        chai.request(server)
        .get('/api/v1/batter_data/id/1')
        .end((err, response) => {

          response.should.have.status(200);
          response.should.be.json;
          response.body[0].should.be.a('object');
          response.body[0].name.should.equal('Roy Hobbs');
        done();
        });
      });
    });

    it('should not edit a batter if the id does not exist', (done) => {
      let newUpdate = {
        "batter": {
          "name": "Roy Hobbs"
          },
          token: authToken
      }
      chai.request(server)
      .put('/api/v1/batter_data/id/100000')
      .send(newUpdate)
      .end((err, response) => {

        response.should.have.status(422);
        done();
        });
    });
  });

  it('should edit a batter', (done) => {
      let newUpdate = {
        "batter": {
          "name": "Roy Hobbs"
          },
          token: authToken
      }
      chai.request(server)
      .put('/api/v1/batter_data/id/1')
      .send(newUpdate)
      .end((err, response) => {

        response.should.have.status(201);

        chai.request(server)
        .get('/api/v1/batter_data/id/1')
        .end((err, response) => {

          response.should.have.status(200);
          response.should.be.json;
          response.body[0].should.be.a('object');
          response.body[0].name.should.equal('Roy Hobbs');
        done();
        });
      });
    });

    it('should not edit a batter if the id does not exist', (done) => {
      let newUpdate = {
        "batter": {
          "name": "Roy Hobbs"
          },
          token: authToken
      }
      chai.request(server)
      .put('/api/v1/batter_data/id/100000')
      .send(newUpdate)
      .end((err, response) => {

        response.should.have.status(422);
        done();
        });
    });

    it('should delete a batter', (done) => {
      chai.request(server)
      .get('/api/v1/batter_data')
      .end((err, response) => {

        response.body.length.should.equal(12);

        chai.request(server)
        .delete('/api/v1/batter_data/delete/1')
        .send({ token: authToken })
        .end((error, response) => {
          response.should.have.status(204);

          chai.request(server)
          .get('/api/v1/batter_data')
          .end((err, response) => {

            response.body.length.should.equal(11);
          })
        done();
        });
      });
    });

    it('should not delete a batter w/o a correct token', (done) => {
      chai.request(server)
        .delete('/api/v1/batter_data/delete/1')
        .send({ token: '42' })
        .end((error, response) => {
          response.should.have.status(403);
        done()
      })
    });

});

describe('pitcher_data routes', () => {
    beforeEach((done) => {
      database.seed.run()
        .then(() => {
          done();
        });
    });

    it('should get the pitchers', (done) => {
      chai.request(server)
      .get('/api/v1/pitcher_data')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body[0].should.be.a('object');
        response.body.length.should.equal(10);
        done();
      });
    });

    it('should get a specific pitcher', (done) => {
      chai.request(server)
      .get('/api/v1/pitcher_data/id/1')
      .end((err, response) => {

        response.should.have.status(200);
        response.should.be.json;
        response.body[0].should.be.a('object');
        response.body.length.should.equal(1);
        done();
      });
    });

    it('should not get a specific pitcher with bad id info', (done) => {
      chai.request(server)
      .get('/api/v1/pitcher_data/id/10000')
      .end((err, response) => {

        response.should.have.status(404);
        response.body.should.be.a('object');
        response.body.error.should.equal('No pitchers found with id of 10000')
        done();
      });
    });

    it('should post a pitcher', (done) => {

      let newPersonBody = {
        "newPerson": {
          "id": 29,
          "career": "1984-2017",
          "induction_method": "BBWAA",
          "name": "Ricky Vaughn",
          "primary_team": "Atlanta Braves",
          "vote_percentage": "88",
          "year_inducted": "2017",
          "team_id": "4"
        },
          token: authToken
      }
      chai.request(server)
      .post('/api/v1/inducted_people')
      .send(newPersonBody)
      .end((err, response) => {
        let newPitcherBody = {
          "newPitcher": {
            "id": 11,
            "name": "Ricky Vaughn",
            "games": "189",
            "starts": "103",
            "wins": "46",
            "losses": "40",
            "era": "3.76",
            "strikeouts": "613",
            "walks": "325",
            "induction_id": 29
          },
            token: authToken
        }
        chai.request(server)
        .post('/api/v1/pitcher_data')
        .send(newPitcherBody)
        .end((err, response) => {
          response.should.have.status(201);
          response.body.id.should.equal(11)
          done();
        });
      });
  });

    it('should edit a pitcher', (done) => {
      let newUpdate = {
        "pitcher": {
          "name": "Roy Hobbs"
          },
          token: authToken
      }
      chai.request(server)
      .put('/api/v1/pitcher_data/id/1')
      .send(newUpdate)
      .end((err, response) => {

        response.should.have.status(201);

        chai.request(server)
        .get('/api/v1/pitcher_data/id/1')
        .end((err, response) => {

          response.should.have.status(200);
          response.should.be.json;
          response.body[0].should.be.a('object');
          response.body[0].name.should.equal('Roy Hobbs');
        done();
        });
      });
    });

    it('should not edit a pitcher if the id does not exist', (done) => {
      let newUpdate = {
        "pitcher": {
          "name": "Roy Hobbs"
          },
          token: authToken
      }
      chai.request(server)
      .put('/api/v1/pitcher_data/id/100000')
      .send(newUpdate)
      .end((err, response) => {

        response.should.have.status(422);
        done();
        });
    });

    it('should delete a pitcher', (done) => {
      chai.request(server)
      .get('/api/v1/pitcher_data')
      .end((err, response) => {

        response.body.length.should.equal(10);

        chai.request(server)
        .delete('/api/v1/pitcher_data/delete/1')
        .send({ token: authToken })
        .end((error, response) => {
          response.should.have.status(204);

          chai.request(server)
          .get('/api/v1/pitcher_data')
          .end((err, response) => {

            response.body.length.should.equal(9);
          })
        done();
        });
      });
    });

    it('should not delete a pitcher w/o a correct token', (done) => {
      chai.request(server)
        .delete('/api/v1/pitcher_data/delete/1')
        .send({ token: '42' })
        .end((error, response) => {
          response.should.have.status(403);
        done()
      })
    });
});
