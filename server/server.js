const environment = process.env.NODE_ENV || 'development';
const express = require('express');
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);
const bodyParser = require('body-parser');
const config = require('dotenv').config().parsed;
const jwt = require('jsonwebtoken');

const port = (process.env.PORT || 3000);
const app = express();
const password = process.env.DOMAIN_ENV || 'baseball';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested With, Content-Type, Accept');
  next();
});

if (!config.CLIENT_SECRET) {
  throw 'Make sure you have a CLIENT_SECRET in your .env file';
}
app.set('secretKey', config.CLIENT_SECRET);

app.post('/authenticate', (request, response) => {
  const user = request.body;

    // If the user enters credentials that don't match our hard-coded
    // credentials in our .env configuration file, send a JSON error
  if (user.username !== config.USERNAME || user.password !== config.PASSWORD) {
    response.status(403).send({
      success: false,
      message: 'Invalid Credentials'
    });
  }

    // If the credentials are accurate, create a token and send it back
  else {
    let token = jwt.sign(user, app.get('secretKey'), {
      expiresIn: 172800 // expires in 48 hours
    });

    response.json({
      success: true,
      username: user.username,
      token: token
    });
  }
});

const checkAuth = (request, response, next) => {

  // Check headers/POST body/URL params for an authorization token
  const token = request.body.token ||
                request.param('token') ||
                request.headers.authorization;

  if (token) {
    // do a lot of fancy things
    jwt.verify(token, app.get('secretKey'), (error, decoded) => {

    // If the token is invalid or expired, respond with an error
      if (error) {
        return response.status(403).send({
          success: false,
          message: 'Invalid authorization token.'
        });
      }

    // If the token is valid, save the decoded version to the
    // request for use in other routes & continue on with next()
      else {
        request.decoded = decoded;
        next();
      }
    });
  } else {
    return response.status(403).send({
      success: false,
      message: 'You must be authorized to hit this endpoint'
    });
  }
};

app.get('/api/v1/franchises', (request, response) => {
  database('franchises').select()
    .then((franchises) => {
      if (franchises.length) {
        response.status(200).json(franchises);
      } else {
        response.status(404).json({
          error: 'No franchises found'
        });
      }
    })
  .catch((error) => {
    response.status(500).json({ error });
  });
});

app.put('/api/v1/franchises/id/:id', checkAuth, (request, response) => {
  const franchUpdate = request.body.franchise;
  database('franchises').where('id', request.params.id).select()
    .update(franchUpdate, 'id')
    .then((franchise) => {
      if (franchise.length) {
        response.status(201).json(franchise);
      } else {
        response.status(422).json({
          error: 'unsuccessful edit, please try again'
        });
      }
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/franchises/id/:id', (request, response) => {
  database('franchises').where('id', request.params.id).select()
    .then((franchises) => {
      if (franchises.length) {
        response.status(200).json(franchises);
      } else {
        response.status(404).json({
          error: `No franchise found with id of ${request.params.id}`
        });
      }
    })
  .catch((error) => {
    response.status(500).json({ error });
  });
});

app.get('/api/v1/franchises/name/:name', (request, response) => {
  database('franchises').where('franch_name', request.params.name).select()
    .then((franchises) => {
      if (franchises.length) {
        response.status(200).json(franchises);
      } else {
        response.status(404).json({
          error: `No franchise found with name of ${request.params.name}`
        });
      }
    })
  .catch((error) => {
    response.status(500).json({ error });
  });
});


app.get('/api/v1/inducted_people', (request, response) => {
  database('inducted_people').select()
    .then((inductedPeople) => {
      if (inductedPeople.length) {
        response.status(200).json(inductedPeople);
      } else {
        response.status(404).json({
          error: 'No inducted people found'
        });
      }
    })
  .catch((error) => {
    response.status(500).json({ error });
  });
});

app.get('/api/v1/inducted_people/id/:id', (request, response) => {
  database('inducted_people').where('id', request.params.id).select()
    .then((inductedPeople) => {
      if (inductedPeople.length) {
        response.status(200).json(inductedPeople);
      } else {
        response.status(404).json({
          error: `No people found with id of ${request.params.id}`
        });
      }
    })
  .catch((error) => {
    response.status(500).json({ error });
  });
});

app.get('/api/v1/inducted_people/name/:name', (request, response) => {
  database('inducted_people').where('name', request.params.name).select()
    .then((inductedPeople) => {
      if (inductedPeople.length) {
        response.status(200).json(inductedPeople);
      } else {
        response.status(404).json({
          error: `No people found with name of ${request.params.name}`
        });
      }
    })
  .catch((error) => {
    response.status(500).json({ error });
  });
});

app.get('/api/v1/batter_data', (request, response) => {
  database('batter_data').select()
    .then((batterData) => {
      if (batterData.length) {
        response.status(200).json(batterData);
      } else {
        response.status(404).json({
          error: 'No batter data found'
        });
      }
    })
  .catch((error) => {
    response.status(500).json({ error });
  });
});

app.get('/api/v1/batter_data/id/:id', (request, response) => {
  database('batter_data').where('id', request.params.id).select()
    .then((batterData) => {
      if (batterData.length) {
        response.status(200).json(batterData);
      } else {
        response.status(404).json({
          error: `No batters found with id of ${request.params.id}`
        });
      }
    })
  .catch((error) => {
    response.status(500).json({ error });
  });
});

app.get('/api/v1/batter_data/name/:name', (request, response) => {
  database('batter_data').where('name', request.params.name).select()
    .then((batterData) => {
      if (batterData.length) {
        response.status(200).json(batterData);
      } else {
        response.status(404).json({
          error: `No batters found with name of ${request.params.name}`
        });
      }
    })
  .catch((error) => {
    response.status(500).json({ error });
  });
});

app.get('/api/v1/pitcher_data', (request, response) => {
  database('pitcher_data').select()
    .then((pitcherData) => {
      if (pitcherData.length) {
        response.status(200).json(pitcherData);
      } else {
        response.status(404).json({
          error: 'No pitcher data found'
        });
      }
    })
  .catch((error) => {
    response.status(500).json({ error });
  });
});

app.get('/api/v1/pitcher_data/id/:id', (request, response) => {
  database('pitcher_data').where('id', request.params.id).select()
    .then((pitcherData) => {
      if (pitcherData.length) {
        response.status(200).json(pitcherData);
      } else {
        response.status(404).json({
          error: `No pitchers found with id of ${request.params.id}`
        });
      }
    })
  .catch((error) => {
    response.status(500).json({ error });
  });
});

app.get('/api/v1/pitcher_data/name/:name', (request, response) => {
  database('pitcher_data').where('name', request.params.name).select()
    .then((pitcherData) => {
      if (pitcherData.length) {
        response.status(200).json(pitcherData);
      } else {
        response.status(404).json({
          error: `No pitchers found with name of ${request.params.name}`
        });
      }
    })
  .catch((error) => {
    response.status(500).json({ error });
  });
});


app.listen(port, () => {
  console.log(`BYOB server listening on port ${port}!`);
});

module.exports = app;
