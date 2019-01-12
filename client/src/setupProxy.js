const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(proxy('/api/amazon/v1', { target: 'http://localhost:5000/' }));
  app.use(proxy('/api/goodreads/v1', { target: 'http://localhost:8080/' }));
};