/* eslint-disable no-console */
const fs = require("fs")
const app = require('./app');
const hostname = app.get('host');
const port = app.get('port');
const server = app.listen(process.env.PORT || port)
// const server = app.listen(port, hostname);

process.on('unhandledRejection', (reason, p) =>
  console.error('Unhandled Rejection at: Promise ', p, reason)  
);

server.on('listening', () =>
  console.info('Feathers application started on http://%s:%d', hostname, port)  
);


fs.readdir("./", (err, files) => {
    if (err)
        console.log("Error reding directory: ", err)
    else {
        console.log("Files in root directory: ", files.join(", "))
    }
})