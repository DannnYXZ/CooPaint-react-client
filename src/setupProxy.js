const proxy = require('http-proxy-middleware');
module.exports = function (app) {
  app.use(proxy('/coopaint', {target: 'http://127.0.0.1:8080', ws: true}));
};
