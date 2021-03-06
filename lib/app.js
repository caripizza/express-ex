/* eslint-disable no-console */
const express = require('express');
const app = express();
const tweets = require('./routes/tweets');
const tags = require('./routes/tags');
const notFound = require('./middleware/notFound');
const { handler } = require('./middleware/error');
const ronSwanson = require('./middleware/ronSwanson');

app.use((req, res, next) => {
  req.startAt = Date.now();
  const reqPath = req.path;
  res.on('finish', () => {
    const responseTime = Date.now() - req.startAt;
    console.log(`
      ${req.method}`, reqPath + ` [${res.statusCode}]`
      + ' - ' + responseTime + 'ms' + ` (${responseTime / 1000} sec)`);
  });
  next();
});

app.use(express.json());
app.get('/random', ronSwanson, (req, res) => {
  res.status(200).send(req.quote);
});
app.use('/tweets', tweets);
app.use('/tags', tags);
app.get('/', (req, res) => {
  res.status(200).send('Welcome to my amazing Express app');
});
app.use(notFound);
app.use(handler);


module.exports = app;
