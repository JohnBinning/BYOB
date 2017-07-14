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

    it('should edit a person', (done) => {
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
});
