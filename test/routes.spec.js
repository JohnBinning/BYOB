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

describe('franchise routes', () => {
  beforeEach((done) => {
    database.seed.run()
      .then(() => {
        done();
      });
  });

  const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IidnYXJ5JyIsInBhc3N3b3JkIjoiJ2VsX2dhcnknIiwiaWF0IjoxNDk5OTkyODM5LCJleHAiOjE1MDEyMDI0Mzl9.Fl-QhVRJs24LvjSJeWWIu_sgTnb55lXgIyh6JTIakes';

  it('should get the franchises', (done) => {
    chai.request(server)
    .get('/api/v1/franchises')
    .end((err, response) => {
      console.log('response', response.body);
      response.should.have.status(200);
      response.should.be.json;
      response.body[0].should.be.a('object');
      response.body.length.should.equal(5);
      done();
    });
  });

  // it('should post a franchise', (done) => {
  //   let newFranchiseBody = {
  //   	newFranchise: {
  //       id: 6,
  //   		franch_id: "BNB",
  //   		franch_name: "Bad News Bears",
  //   		active: "Y",
  //   		league: "little",
  //   		founded: "1976"
  //   	},
  //     	token: authToken
  //   }
  //   chai.request(server)
  //   .post('/api/v1/franchises')
  //   .send(newFranchiseBody)
  //   .end((err, response) => {
  //     response.should.have.status(201);
  //     response.body.id.should.equal(6)
  //     done();
  //   });
  // });
  //
  // it('should not post a franchise w/o a token', (done) => {
  //   let newFranchiseBody = {
  //   	newFranchise: {
  //       id: 6,
  //   		franch_id: "BNB",
  //   		franch_name: "Bad News Bears",
  //   		active: "Y",
  //   		league: "little",
  //   		founded: "1976"
  //   	}
  //   }
  //   chai.request(server)
  //   .post('/api/v1/franchises')
  //   .send(newFranchiseBody)
  //   .end((err, response) => {
  //     response.should.have.status(403);
  //     response.body.message.should.equal('You must be authorized to hit this endpoint');
  //     done();
  //   });
  // });

});
