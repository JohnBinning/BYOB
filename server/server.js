const environment = process.env.NODE_ENV || 'development';
const express = require('express');
const bodyParser = require('body-parser');

const port = (process.env.PORT || 3000);
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.listen(port, () => {
  console.log(`BYOB server listening on port ${port}!`);
});

module.exports = app;
