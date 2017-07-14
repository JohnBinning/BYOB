const environment = process.env.NODE_ENV || 'development';
const express = require('express');
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);
const bodyParser = require('body-parser');
const config = require('dotenv').config().parsed;
const jwt = require('jsonwebtoken');

const port = (process.env.PORT || 3000);
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested With, Content-Type, Accept');
  next();
});

if (!process.env.CLIENT_SECRET) {
  throw 'Make sure you have a CLIENT_SECRET in your .env file';
}
app.set('secretKey', process.env.CLIENT_SECRET);

app.post('/authenticate', (request, response) => {
  const user = request.body;

  if (user.username !== process.env.USERNAME || user.password !== process.env.PASSWORD) {
    response.status(403).send({
      success: false,
      message: 'Invalid Credentials'
    });
  } else {
    const token = jwt.sign(user, app.get('secretKey'), {
      expiresIn: 1209600
    });

    response.json({
      success: true,
      username: user.username,
      token
    });
  }
});

const checkAuth = (request, response, next) => {
  const token = request.body.token ||
                request.param('token') ||
                request.headers.authorization;

  if (token) {
    jwt.verify(token, app.get('secretKey'), (error, decoded) => {
      if (error) {
        return response.status(403).send({
          success: false,
          message: 'Invalid authorization token.'
        });
      } else {
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

// routes

// franchises

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

app.post('/api/v1/franchises', checkAuth, (request, response) => {
  const franchise = request.body.newFranchise;

  for (const requiredParameter of ['franch_id', 'franch_name', 'active']) {
    if (!franchise[requiredParameter]) {
      return response.status(422).json({
        error: `Expected format: { franchId: <String>, franchName: <String>, active: <String>
        with optional values of league: <String>, founded: <String> }. You are missing a ${requiredParameter} property.`
      });
    }
  }

  database('franchises').insert(franchise, 'id')
  .then((franchiseId) => {
    response.status(201).json({ id: franchiseId[0] });
  })
  .catch((error) => {
    response.status(500).json({ error });
  });
});

// inducted_people

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

app.put('/api/v1/inducted_people/id/:id', checkAuth, (request, response) => {
  const personUpdate = request.body.person;
  database('inducted_people').where('id', request.params.id).select()
    .update(personUpdate, 'id')
    .then((person) => {
      if (person.length) {
        response.status(201).json(person);
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

app.post('/api/v1/inducted_people', checkAuth, (request, response) => {
  const person = request.body.newPerson;

  for (const requiredParameter of ['career', 'induction_method', 'name', 'primary_team', 'vote_percentage', 'year_inducted', 'team_id']) {
    if (!person[requiredParameter]) {
      return response.status(422).json({
        error: `Expected format: { career: <String>, induction_method: <String>, name: <String>, primary_team: <String>, vote_percentage: <String>, year_inducted: <String>,
        team_id: <Integer>}. You are missing a ${requiredParameter} property.`
      });
    }
  }

  database('inducted_people').insert(person, 'id')
  .then((personId) => {
    response.status(201).json({ id: personId[0] });
  })
  .catch((error) => {
    response.status(500).json({ error });
  });
});

// batters

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

app.put('/api/v1/batter_data/id/:id', checkAuth, (request, response) => {
  const batterUpdate = request.body.batter;
  database('batter_data').where('id', request.params.id).select()
    .update(batterUpdate, 'id')
    .then((batter) => {
      if (batter.length) {
        response.status(201).json(batter);
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

app.post('/api/v1/batter_data', checkAuth, (request, response) => {
  const person = request.body.newBatter;

  for (const requiredParameter of ['avg', 'hits', 'name', 'obp', 'rbi', 'runs', 'induction_id', 'slg', 'sb']) {
    if (!person[requiredParameter]) {
      return response.status(422).json({
        error: `Expected format: { avg: <String>, hits: <String>, name: <String>, obp: <String>, rbi: <String>, runs: <String>, sb: <String>, slg: <String>,
        induction_id: <Integer>}. You are missing a ${requiredParameter} property.`
      });
    }
  }

  database('batter_data').insert(person, 'id')
  .then((personId) => {
    response.status(201).json({ id: personId[0] });
  })
  .catch((error) => {
    response.status(500).json({ error });
  });
});

// pitchers

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

app.put('/api/v1/pitcher_data/id/:id', checkAuth, (request, response) => {
  const pitcherUpdate = request.body.pitcher;
  database('pitcher_data').where('id', request.params.id).select()
    .update(pitcherUpdate, 'id')
    .then((pitcher) => {
      if (pitcher.length) {
        response.status(201).json(pitcher);
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

app.post('/api/v1/pitcher_data', checkAuth, (request, response) => {
  const pitcher = request.body.newPitcher;

  for (const requiredParameter of ['name', 'games', 'starts', 'losses', 'era', 'induction_id', 'strikeouts', 'walks']) {
    if (!pitcher[requiredParameter]) {
      return response.status(422).json({
        error: `Expected format: { name: <String>, games: <String>, starts: <String>, losses: <String>, era: <String>, walks: <String>, strikeouts: <String>,
        induction_id: <Integer>}. You are missing a ${requiredParameter} property.`
      });
    }
  }

  database('pitcher_data').insert(pitcher, 'id')
  .then((pitcherId) => {
    response.status(201).json({ id: pitcherId[0] });
  })
  .catch((error) => {
    response.status(500).json({ error });
  });
});


app.listen(port, () => {
  console.log(`BYOB server listening on port ${port}!`);
});

module.exports = app;
