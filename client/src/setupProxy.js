const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(proxy('/api/amazon/v1', { target: 'http://127.0.0.1:5000/' }));
  app.use(proxy('/api/amazon/v2', { target: 'http://127.0.0.1:5000/' }));
  app.use(proxy('/api/bookshelf', { target: 'http://127.0.0.1:5000/' }));
  app.use(proxy('/api/goodreads/v1', { target: 'http://127.0.0.1:8080/' }));
  app.use(
    proxy('/api/google/v1', {
      target: 'http://127.0.0.1:5000/',
    })
  );
};

// TODO: can i cycle through apiConfigs?
