const proxy = require('http-proxy-middleware');
const port = process.env.PORT || 5000;

module.exports = function(app) {
  app.use(proxy('/api/amazon/v1', { target: `http://127.0.0.1:${port}/` }));
  app.use(proxy('/api/amazon/v2', { target: `http://127.0.0.1:${port}/` }));
  app.use(proxy('/api/bookshelf', { target: `http://localhost:${port}/` }));

  if (process.env.REACT_APP_ENV !== 'offline') {
    console.log('setting goodreads proxy to http://localhost:8080/')
    app.use(proxy('/api/goodreads/v1', { target: 'http://localhost:8080/' }));
  } else {
    console.log(`setting goodreads proxy to http://127.0.0.1:${port}/`)
    app.use(proxy('/api/goodreads/v1', { target: `http://127.0.0.1:${port}/` }));
  }

  app.use(
    proxy('/api/google/v1', {
      target: `http://127.0.0.1:${port}/`,
    })
  );
};

// TODO: can i cycle through apiConfigs?
