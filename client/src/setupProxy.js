const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(proxy('/api/amazon/v1', { target: 'http://localhost:5000/' }));
  app.use(proxy('/api/amazon/v2', { target: 'http://localhost:5000/' }));
  app.use(proxy('/api/bookshelf', { target: 'http://localhost:5000/' }));
  if (process.env.REACT_APP_ENV !== 'Offline') {
    app.use(proxy('/api/goodreads/v1', { target: 'http://localhost:8080/' }));
  } else {
    app.use(proxy('/api/goodreads/v1', { target: 'http://localhost:5000/' }));
  }
  app.use(
    proxy('/api/google/v1', {
      target: 'http://localhost:5000/',
    })
  );
};

// TODO: can i cycle through apiConfigs?
