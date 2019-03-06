const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const amazon = require('./routes/api/amazon');
const goodreads = require('./routes/api/goodreads');
const bookshelf = require('./routes/api/bookshelf');
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
} else {
  console.log(info('Using database prod'));
  db = require('./config/keys').mongoURI;
}

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.info('MongoDB Connected'))
  .catch(err => console.error('server', err));

app.use('/api/amazon', amazon);

app.use('/api/google', google);
//app.use("/api/goodreads", goodreads);

app.use('/api/bookshelf', bookshelf);

const port = process.env.PORT || 5000;

app.listen(port, () => console.info(`Server running on port ${port}`));
