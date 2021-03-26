function Blob(x, y, r) {
  this.pos = createVector(x, y);
  this.r = r;
  this.vel = createVector(0, 0);
  this.noisePower = this.r *0.5
  this.speed = 15
  
  



  angleMode(DEGREES);
  noStroke();
  // fill(Math.floor(Math.random() * 255),Math.floor(Math.random() * 255),Math.floor(Math.random() * 255));
  
  this.update = function () {
    var newvel = createVector(mouseX - width / 2, mouseY - height / 2);
    newvel.setMag(this.speed);
    this.vel.lerp(newvel, 0.2);
    this.pos.add(this.vel);
  };

  this.eats = function (other, type) {
    if (type == 'blob') {
      var d = p5.Vector.dist(this.pos, createVector(other.x, other.y))+55;
      if (d < this.r + other.r) {
        if (this.r > other.r) {
          var sum = PI * this.r * this.r + PI * other.r * other.r;
          this.r = sqrt(sum / PI);
          if (this.speed <= 3) {
            this.speed = 3
          } else {
            this.speed = this.speed-other.r/1800;
          }
          //this.r += other.r;
          return true;
        }
      } else {
        return false;
      }
    }else if (type == 'bot') {
      var d = p5.Vector.dist(this.pos, createVector(other.x, other.y));
      if (d < this.r + other.r) {
        if (this.r > other.r) {
          var sum = PI * this.r * this.r + PI * other.r * other.r;
          this.r = sqrt(sum / PI);
          if (this.speed <= 3) {
            this.speed = 3
          } else {
            this.speed = this.speed-other.r/2000;
          }
          //this.r += other.r;
          return true;
        }
      } else {
        return false;
      }
    }else if (type == 'enemy') {
      var d = p5.Vector.dist(this.pos, createVector(other.x, other.y))+55;
      if (d < this.r + other.r) {
        if (this.r > other.r+40) {
          this.r = this.r - other.r * 1.2
          if (this.speed <= 3) {
            this.speed = 3
          } else {
            this.speed = this.speed+(this.r/PI)/8;
          }
          //this.r += other.r;
          return true;
        }
      } else {
        return false;
      }
    }
  }
  this.constrain = function() {
    blob.pos.x = constrain(blob.pos.x, -5000+this.r, 5000-this.r);
    blob.pos.y = constrain(blob.pos.y, -5000+this.r, 5000-this.r);
  };
  this.shot = function () {
    if (this.r > 94) {
      this.r = this.r - 15
      return true
    }
    return false
  }
  this.show = function(data) {
    this.noisePower = this.r *0.5
    fill(data.red,data.green, data.blue);
    // ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
    beginShape();
    for (let i = 0; i < 20; i++) {
      let angle = (360 / 20) * i;
      let x = cos(angle) * this.r + this.pos.x;
      let y = sin(angle) * this.r + this.pos.y;
      let xnoise = (noise(frameCount * 0.02 + i) - 0.5) * this.noisePower;
      let ynoise = (noise(frameCount * 0.02 + i) - 0.5) * this.noisePower;
      vertex(x + xnoise, y + ynoise);
    }
    endShape(CLOSE);
  };
}

