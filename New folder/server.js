const server = require('http').createServer(handler);
const io = require('socket.io')(server); // Wrap server app in socket.io capability
const fs = require('fs'); // File system to serve static files
const url = require('url'); // To parse URL strings
const PORT = process.env.PORT || 3000; // Useful if you want to specify the port through an environment variable

const ROOT_DIR = 'html'; // Directory to serve static files from

const MIME_TYPES = {
  'css': 'text/css',
  'gif': 'image/gif',
  'htm': 'text/html',
  'html': 'text/html',
  'ico': 'image/x-icon',
  'jpeg': 'image/jpeg',
  'jpg': 'image/jpeg',
  'js': 'application/javascript',
  'json': 'application/json',
  'png': 'image/png',
  'svg': 'image/svg+xml',
  'txt': 'text/plain'
};

//track whether a button was used or not
const buttonIsUsed = {
  homeButton: true,
  awayButton: true,
  spectateButton: true,
};

const buttons = {};

function get_mime(filename) {
  for (let ext in MIME_TYPES) {
    if (filename.indexOf(ext, filename.length - ext.length) !== -1) {
      return MIME_TYPES[ext];
    }
  }
  return MIME_TYPES['txt'];
}

server.listen(PORT); // Start http server listening on PORT

function handler(request, response) {
  // Handler for http server requests
  let urlObj = url.parse(request.url, true, false);
  console.log('\n============================');
  console.log("PATHNAME: " + urlObj.pathname);
  console.log("REQUEST: " + ROOT_DIR + urlObj.pathname);
  console.log("METHOD: " + request.method);

  let filePath = ROOT_DIR + urlObj.pathname;
  if (urlObj.pathname === '/') filePath = ROOT_DIR + '/index.html';

  fs.readFile(filePath, function(err, data) {
    if (err) {
      // Report error to console
      console.log('ERROR: ' + JSON.stringify(err));
      // Respond with not found 404 to client
      response.writeHead(404);
      response.end(JSON.stringify(err));
      return;
    }
    response.writeHead(200, {
      'Content-Type': get_mime(filePath),
    });
    response.end(data);
  });
}

io.on('connection', (socket) => {
  console.log('connected');

  socket.emit('buttonAvailability', buttonIsUsed);

  socket.on('sending', (message) => {

    if (message === 'Disable Home' && buttonIsUsed.homeButton) {
      io.emit('Recieved', 'Disable Home');

      buttonIsUsed.homeButton = false;
      socket.buttonId = 'homeButton';

      buttons[socket.id] = buttons[socket.id] ?? [];
      buttons[socket.id].push('homeButton');

    } else if (message === 'Disable Visitor' && buttonIsUsed.awayButton) {
      io.emit('Recieved', 'Disable Visitor');

      buttonIsUsed.awayButton = false;
      socket.buttonId = 'awayButton';

      buttons[socket.id] = buttons[socket.id] ?? [];
      buttons[socket.id].push('awayButton');
      
    } else if (message === 'Disable Spectator' && buttonIsUsed.spectateButton) {
      io.emit('Recieved', 'Disable Spectator');

      buttonIsUsed.spectateButton = false;
      socket.buttonId = 'spectateButton';

      buttons[socket.id] = buttons[socket.id] ?? [];
      buttons[socket.id].push('JoinAsSpectator');
    }
  });

  socket.on('mousedown', function(x, y)  {
    io.emit('handleMouseDown', x, y);
  });

  socket.on('mousemove', function(x, y ) {
    io.emit('handleMouseMove', x, y);
  });

  socket.on('mouseup', function(data){
    io.emit('handleMouseUp', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  
    const userButtons = buttons[socket.id];
  
    if (userButtons) {
      userButtons.forEach((buttonId) => {
        buttonIsUsed[buttonId] = true; 
      });
  
      delete buttons[socket.id]; 
      io.emit('buttonAvailability', buttonIsUsed); 
    }
  });
  
  
  socket.on('connect', () => {
    console.log('User connected');
    io.emit("updateLocations");
  });
});

console.log(`Server Running at port ${PORT}  CNTL-C to quit`);
console.log(`To Test:`);
console.log("http://localhost:3000/curling.html");
