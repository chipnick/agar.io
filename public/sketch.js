var blob;

var blobs = [];
var bots = [];
var enemies = [];
var zoom = 1;

var socket = io.connect('http://192.168.1.102:3000');

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}



  

function setup() {
  createCanvas(window.innerWidth - 20, window.innerHeight - 20);
  angleMode(DEGREES);
  noStroke();
  let params = (new URL(window.location.href)).searchParams;
  if (params.get('username') === null) {
    window.location.href = "/login.html";
  } 
  blob = new Blob(random(width), random(2400), 64);
  data = {
    x: blob.pos.x,
    y: blob.pos.y,
    username: params.get('username'),
  }
  socket.emit('start', data);
  
  socket.on('heartbeat', function(data) {
    // console.log(data)
    blobs = data.blobs;
    bots = data.bots;
    enemies = data.enemy;
  });

}
socket.on('end', function (data) {
  if (socket.id == data.id) {
    location.reload();
  }
});
function draw() {
  background(0);
  translate(width / 2, height / 2);
  fill(255)
  var newzoom = 64 / blob.r;
  zoom = lerp(zoom, newzoom, 0.1);
  scale(zoom);
  translate(-blob.pos.x, -blob.pos.y);
  rect(-2400,-2400,2400*2,2400*2)
  for (var i = blobs.length - 1; i >= 0; i--) {


    var id = blobs[i].id;
    if (id !== socket.id) {
      fill(blobs[i].red,blobs[i].green,blobs[i].blue);
      // ellipse(blobs[i].x, blobs[i].y, blobs[i].r * 2, blobs[i].r * 2);

      // console.log(blobs[i])
      beginShape();
      for (let ee = 0; ee < 20; ee++) {
        let angle = (360 / 20) * ee;
        let x = cos(angle) * blobs[i].r + blobs[i].x;
        let y = sin(angle) * blobs[i].r + blobs[i].y;
        let xnoise = (noise(frameCount * 0.02 + ee) - 0.5) * blobs[i].r*0.5;
        let ynoise = (noise(frameCount * 0.02 + ee) - 0.5) * blobs[i].r*0.5;
        vertex(x + xnoise, y + ynoise);
      }
      endShape(CLOSE);
      fill(0);
      textAlign(CENTER);
      textSize(15*(blobs[i].r/40));
      text(blobs[i].username, blobs[i].x, blobs[i].y - blobs[i].r * 1.25);

      if (blob.eats(blobs[i],'blob')) {
        socket.emit('eaten',{
          type: 'blob',
          id:id
        })
      }

      
    }
  }
  for (var i = bots.length - 1; i >= 0; i--) {

    fill(bots[i].red,bots[i].green,bots[i].blue);
    ellipse(bots[i].x, bots[i].y, bots[i].r * 2, bots[i].r * 2);

    if (blob.eats(bots[i],'bot')) {
      socket.emit('eaten',{
        type: 'bot',
        id:bots[i].id
      })
    }
  }



  for (var i = enemies.length - 1; i >= 0; i--) {

    fill(enemies[i].red,enemies[i].green,enemies[i].blue);
    beginShape();
      for (let ee = 0; ee < 7; ee++) {
        let angle = (360 / 7) * ee;
        let x = cos(angle) * enemies[i].r + enemies[i].x;
        let y = sin(angle) * enemies[i].r + enemies[i].y;
        let xnoise = (noise(frameCount * 0.02 + ee) - 0.5) * 70;
        let ynoise = (noise(frameCount * 0.02 + ee) - 0.5) * 70;
        vertex(x + xnoise, y + ynoise);
      }
      endShape(CLOSE);0

    if (blob.eats(enemies[i],'enemy')) {
      socket.emit('eaten',{
        type: 'enemy',
        id:enemies[i].id
      })
    }
  }


  var i=0
  while (i < blobs.length) {
    var id = blobs[i].id;
    if (id === socket.id) {
      blob.show({
        red: blobs[i].red,
        green: blobs[i].green,
        blue: blobs[i].blue
      });
      // fill(0);
      // textAlign(CENTER);
      // textSize(15*(blobs[i].r/40));
      // text(blobs[i].username, blobs[i].x, blobs[i].y + blobs[i].r * 1.25);
    }
    i++
  }
  if (mouseIsPressed) {
    blob.update();
  }
  blob.constrain();
  socket.emit('update', { x: blob.pos.x, y: blob.pos.y, r: blob.r })
}

// function mouseClicked() {
//   if (blob.shot()) {
    
//   }
// }