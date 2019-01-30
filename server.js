const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const amazon = require('./routes/api/amazon');
const goodreads = require('./routes/api/goodreads');

const app = express();
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('server', err));

app.get('/', (req, res) => res.send('Hello'));

app.use('/api/amazon', amazon);

//app.use("/api/goodreads", goodreads);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
