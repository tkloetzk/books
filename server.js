const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const amazon = require('./routes/api/amazon');
const goodreads = require('./routes/api/goodreads');
const bookshelf = require('./routes/api/bookshelf');
const bookshelfOffline = require('./routes/api/offline/bookshelfOffline');
const google = require('./routes/api/google');
const app = express();
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var env = process.env.NODE_ENV || 'prod';

// db
let db;
if (env === 'dev') {
  console.info('Using database Test');
  db = require('./config/keys').mongoURITest;
} else if (env === 'prod') {
  console.info('Using database Prod');
  db = require('./config/keys').mongoURI;
}

if (env === 'offline') {
  console.info('using offline bookshelf');
  app.use('/api/bookshelf', bookshelfOffline);
} else {
  mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => console.info('MongoDB Connected'))
    .catch(err => console.error('server', err));

  app.use('/api/bookshelf', bookshelf);
}

app.use('/api/amazon', amazon);

app.use('/api/google', google);
//app.use("/api/goodreads", goodreads);

const port = process.env.PORT || 5000;

app.listen(port, () => console.info(`Server running on port ${port}`));
