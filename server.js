// Using express: http://expressjs.com/
var express = require('express');

function randomInteger(min, max) {
  // получить случайное число от (min-0.5) до (max+0.5)
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}
// Create the app
var app = express();
var blobs = [];
var bots = [];
var enemies = [];


function Enemy(id, x, y, r) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.r = r;
  this.red = randomInteger(200, 255)
  this.green = randomInteger(200, 255)
  this.blue = 0
}

function Blob(id, username, x, y, r) {
  this.id = id;
  this.username = username
  this.x = x;
  this.y = y;
  this.r = r;
  this.red = randomInteger(0, 255)
  this.green = randomInteger(0, 100)
  this.blue = randomInteger(150, 255)
}
function Bot(id, x, y, r) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.r = r;
  this.red = 0
  this.green = randomInteger(200, 255)
  this.blue = randomInteger(50, 100)
}

// Set up the server
// process.env.PORT is related to deploying on heroku
var server = app.listen(process.env.PORT || 3000, listen);

// This call back just tells us that the server has started
function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
}

app.use(express.static('public'));


// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io')(server);


setInterval(function () {
  for (var i = 0; i < 20; i++) {
    var x = randomInteger(-5000, 5000);
    var y = randomInteger(-5000, 5000);
    bots.push(new Bot(bots.length+i,x, y, 16));
  }
}, 5000)


setInterval(function () {
  for (var i = 0; i < 10; i++) {
    var x = randomInteger(-5000, 5000);
    var y = randomInteger(-5000, 5000);
    enemies[i] = new Enemy(enemies.length+i,x, y, randomInteger(78, 120));
  }
}, 50000)


setInterval(function () {
  io.sockets.emit('heartbeat', {
    blobs: blobs,
    bots: bots,
    enemy: enemies,
  })
}, 33)

for (var i = 0; i < 200; i++) {
  var x = randomInteger(-5000, 5000);
  var y = randomInteger(-5000, 5000);
  bots.push(new Bot(bots.length+i,x, y, 16));
}
for (var i = 0; i < 10; i++) {
  var x = randomInteger(-5000, 5000);
  var y = randomInteger(-5000, 5000);
  enemies[i] = new Enemy(enemies.length+i,x, y, randomInteger(130, 420));
}

io.sockets.on('connection',function(socket) {
  console.log('We have a new client: ' + socket.id);
  
  
  socket.on('start', function(data) {
      var blob = new Blob(socket.id, data.username, data.x, data.y, 64)
      blobs.push(blob)
      
    });

    socket.on('update', function (data) {
    for (const blob of blobs) {
      if (blob.id == socket.id) {
        blob.x = data.x
        blob.y = data.y
        blob.r = data.r
      }
    }
  });
  
  socket.on('eaten', function (data) {
    if (data.type == 'blob') {
      blob_i = 0
      while (blob_i < blobs.length) {
        if (blobs[blob_i].id == data.id) {
          blobs.splice(blob_i, 1)
          io.sockets.emit('end',{'id':data.id})
        }
        blob_i++
      }
    }
    if (data.type == 'bot') {
      bot_i = 0
      while (bot_i < bots.length) {
        if (bots[bot_i].id == data.id) {
          bots.splice(bot_i, 1)
        }
        bot_i++
      }
    }
    if (data.type == 'enemy') {
      enemy_i = 0
      for (const enemy of enemies) {
        if (enemy.id == data.id) {
          enemies.splice(enemy_i, 1)
        }
        enemy_i++
      }
    }
  });

 
    
    
    
    
  
    
    
    socket.on('disconnect', function() {
      console.log('Client has disconnected');
      var blob_i = 0
      for (const blob of blobs) {
        if (blob.id === socket.id) {
          blobs.splice(blob_i,1)
        }
        blob_i++
      }

    });
  }
);