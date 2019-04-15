const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const keys = require('./config/keys');
const amazon = require('./routes/api/amazon');
const amazonOffline = require('./routes/api/offline/amazonOffline')
const goodreads = require('./routes/api/goodreads');
const goodreadsOffline = require('./routes/api/offline/goodreadsOffline');
const bookshelf = require('./routes/api/bookshelf');
const bookshelfOffline = require('./routes/api/offline/bookshelfOffline');
const google = require('./routes/api/google');
const googleOffline = require('./routes/api/offline/googleOffline');
const spawn = require('child_process').spawn

const app = express();
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var env = process.env.NODE_ENV || 'dev';

// db
let db;
let dbName;
if (env === 'dev') {
  dbName = 'Using database Test'
  db = keys.mongoURITest;
} else if (env === 'stg') {
  dbName = 'Using database Stage'
  db = keys.mongoURIStage;
} else if (env === 'prod') {
  dbName = 'Using database Prod'
  db = keys.mongoURI;
}

if (env === 'offline') {
  console.info('using offline bookshelf');
  app.use('/api/bookshelf', bookshelfOffline);
  app.use('/api/amazon', amazonOffline);
  app.use('/api/google', googleOffline);
  app.use("/api/goodreads", goodreadsOffline);
} else {
  console.info(`not offline. using ${dbName} bookshelf`);
  mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => console.info('MongoDB Connected'))
    .catch(err => console.error('server', err));

  app.use('/api/bookshelf', bookshelf);
  app.use('/api/amazon', amazon);
  app.use('/api/google', google);
}


const port = process.env.PORT || 5000;

const server = app.listen(port, () => console.info(`Server running on port ${port}`));

process.on('exit', function() { process.exit(1); });

process.on( 'SIGTERM', function () {
   server.close(function () {
     if (env !== 'offline') {
       mongoose.connection.close(() => {
         console.log('close MongoDB connection')
       })
     }
     console.log("Finished all requests");
   });
});

//On uncaughtException, restart server
// process.on('uncaughtException', () => {
//   spawn(process.argv[0], process.argv.slice(1), {
//     env: { process_restarting: 1, NODE_ENV: env },
//
//     detached: true,
//     stdio: 'ignore'
//   }).unref();
// })
