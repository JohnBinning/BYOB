/* eslint-disable */

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

process.env.NODE_ENV = 'test';

chai.use(chaiHttp);

describe('franchise routes', () => {
  beforeEach((done) => {
    database.seed.run()
      .then(() => {
        done();
      });
  });

  it('should start', () => {
    chai.request(server)
    .get('/api/v1/franchises')
    .end((err, response) => {
      console.log('response', response);
      response.should.have.status(200);
      done();
    });
  });

});
