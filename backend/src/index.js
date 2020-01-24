/* eslint-disable no-console */
const app = require('./app');
const hostname = app.get('host');
const port = app.get('port') || 3001;
const server = app.listen(port)
// const server = app.listen(port, hostname);

process.on('unhandledRejection', (reason, p) =>
  console.error('Unhandled Rejection at: Promise ', p, reason)  
);

server.on('listening', () =>
  console.info('Feathers application started on http://%s:%d', hostname, port)  
);
