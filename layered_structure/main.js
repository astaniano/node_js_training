'use strict';

const {serverPort, staticServerPort, transport} = require('./config');

const server = require(`./${transport}.js`);
const staticServer = require('./static.js');

const routingScaffold = require('./api/index.js');

const db = require('./db.js');
const hash = require('./hash.js');
const common = {hash};

const routing = routingScaffold(
  Object.freeze(db),
  Object.freeze(common),
);

(async () => {
  staticServer('./static', staticServerPort);
  server(routing, serverPort);
})();
