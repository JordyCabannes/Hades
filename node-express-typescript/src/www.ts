import app from './app';
import debugModule = require('debug');
import http = require('http');
import {FrameselfDispatcher} from "./routes/frameself-dispatcher";

const debug = debugModule('node-express-typescript:server');

// Get port from environment and store in Express.
const port = 3001;
app.set('port', port);

// create server and listen on provided port (on all network interfaces).
const server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  let bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  let addr = server.address();
  let bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;

  debug('Listening on ' + bind);
}

const frameselfServer = new FrameselfDispatcher('127.0.0.1', 6000, 7000);
frameselfServer.startServer();