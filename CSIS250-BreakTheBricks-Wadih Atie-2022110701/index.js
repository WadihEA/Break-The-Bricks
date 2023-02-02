class Game {
  constructor() {
    this.canvas = document.getElementById("myGame");
    this.ctx = this.canvas.getContext("2d");
    this.sprites = [];
  }
  update() {
    var lSpritesLength = this.sprites.length;
    for (var i = 0; i < lSpritesLength; i++) {
      this.sprites[i].update();
    }
  }
  addSprites(pSprites) {
    this.sprites.push(pSprites);
  }
  draw() {
    this.ctx.clearRect(0, 0, 800, 600);
    drawEnv(this.ctx);
    var lSpritesLength = this.sprites.length;
    for (var i = 0; i < lSpritesLength; i++) {
      this.sprites[i].draw(this.ctx);
    }
  }
}
var keysDown = {};

addEventListener(
  "keydown",
  function (e) {
    keysDown[e.keyCode] = true;
  },
  false
); //keydown event listener

addEventListener(
  "keyup",
  function (e) {
    delete keysDown[e.keyCode];
  },
  false
); //keyup event listener

class Sprite {
  constructor() {}
  update() {}
  draw() {}
}
class Ball extends Sprite {
  constructor(centerX, centerY, radius, color, uPadel, bricks) {
    super();
    this.cX = centerX;
    this.cY = centerY;
    this.radius = radius;
    this.color = color;
    this.dx = -1;
    this.dy = 1;
    this.padel = uPadel;
    this.bricks = bricks;
    this.score = 0;
    this.gameover = true;
    this.life = 3;
    this.winner = false;
  }

  update() {
    if (!this.gameover) { //check fo collisions
      if (this.cX + this.radius >= 800) {
        this.dx = -1;
      }
      if (this.cX - this.radius < 0) {
        this.dx = 1;
      }
      if (
        this.cY + this.radius >= this.padel.pY &&
        this.cX + this.radius >= this.padel.pX &&
        this.cX + this.radius <= this.padel.pX + 100 &&
        this.cY < 560
      ) {
        this.dy = -1;
      }
      if (this.cY - this.radius < 0) {
        this.dy = 1;
      }
      if (this.cY > 600) {
        this.cX = 400;
        this.cY = 300;
        this.life--;
      }
      for (var i = 0; i < 6; i++) {
        for (var j = 0; j < 4; j++) {
          if (
            this.cX - this.radius >= this.bricks[i][j].bX &&
            this.cX - this.radius <=
              this.bricks[i][j].bX + this.bricks[i][j].length &&
            this.cY - this.radius <=
              this.bricks[i][j].bY + this.bricks[i][j].height &&
            this.cY + this.radius >=
              this.bricks[i][j].bY +
                this.bricks[i][j].height +
                this.radius * 2 &&
            !this.bricks[i][j].deleted
          ) {
            this.bricks[i][j].deleted = true;
            this.dy *= -1;
            this.score++;
            break;
          } else if (
            this.cX - this.radius >= this.bricks[i][j].bX &&
            this.cX - this.radius <=
              this.bricks[i][j].bX + this.bricks[i][j].length &&
            this.cY + this.radius >= this.bricks[i][j].bY &&
            this.cY - this.radius <= this.bricks[i][j].bY - this.radius &&
            !this.bricks[i][j].deleted
          ) {
            this.dy *= -1;
            this.bricks[i][j].deleted = true;
            this.score++;
            break;
          } else if (
            this.cY - this.radius >= this.bricks[i][j].bY &&
            this.cY + this.radius <=
              this.bricks[i][j].bY + this.bricks[i][j].height &&
            this.cX + this.radius >= this.bricks[i][j].bX &&
            this.cX - this.radius <= this.bricks[i][j].bX - this.radius * 2 &&
            !this.bricks[i][j].deleted
          ) {
            this.dx *= -1;
            this.bricks[i][j].deleted = true;
            this.score++;
            break;
          } else if (
            this.cY - this.radius >= this.bricks[i][j].bY &&
            this.cY + this.radius <=
              this.bricks[i][j].bY + this.bricks[i][j].height &&
            this.cX - this.radius <=
              this.bricks[i][j].bX + this.bricks[i][j].length &&
            this.cX + this.radius >=
              this.bricks[i][j].bX +
                this.bricks[i][j].length +
                this.radius * 2 &&
            !this.bricks[i][j].deleted
          ) {
            this.dx *= -1;
            this.bricks[i][j].deleted = true;
            this.score++;
            break;
          }
        }
      }

      this.cX += this.dx;
      this.cY += this.dy;
    }
    if (this.score == 24) { //game over we have a winner
      this.gameover = true;
      this.winner = true;
    }
    if (this.life == 0) { //game lost
      this.gameover = true;
      this.winner = false;
    }
    if (this.gameover) { //reset values
      if (82 in keysDown) {
        this.score = 0;
        this.winner = false;
        this.life = 3;
        for (var i = 0; i < 6; i++) {
          for (var j = 0; j < 4; j++) {
            this.bricks[i][j].deleted = false;
          }
        }
      }
      if (32 in keysDown) {
        this.gameover = false;
      }
      this.cX = 400;
      this.cY = 400;
    }
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.cX, this.cY, this.radius, 2 * Math.PI, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    if (this.gameover && this.winner == false) {
      if (this.life == 0) {
        ctx.font = "30px Ariel";
        ctx.fillStyle = "Red";
        ctx.fillText("Sorry you lost press R to play again", 50, 500);
      } else {
        ctx.font = "30px Ariel";
        ctx.fillStyle = "Green";
        ctx.fillText("Press space to start", 70, 500);
      }
    } else if (this.winner && this.gameover == true) {
      ctx.beginPath();
      ctx.font = "30px Ariel";
      ctx.fillStyle = "Green";
      ctx.fillText("Congratulations, press R to play again", 50, 500);
    }
    ctx.font = "15px Ariel";
    ctx.fillStyle = "White";
    ctx.fillText("Life: " + this.life, 50, 530);
    ctx.fillText("Score: " + this.score, 50, 550);
  }
}
class UserPadel extends Sprite {
  constructor(padelX, padelY, padelLength, padelHeight, color) {
    super();
    this.pX = padelX;
    this.pY = padelY;
    this.padelLength = padelLength;
    this.padelHeight = padelHeight;
    this.color = color;
  }
  update() {
    if (37 in keysDown) {
      //move user padel based on user input
      if (this.pX > 7) {
        this.pX -= 2;
      }
    }
    if (39 in keysDown) {
      if (this.pX < 693) {
        this.pX += 2;
      }
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.rect(this.pX, this.pY, this.padelLength, this.padelHeight);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}
class Bricks extends Sprite {
  constructor(x, y, l, h, color) {
    super();
    this.bX = x;
    this.bY = y;
    this.length = l;
    this.height = h;
    this.color = color;
    this.deleted = false;
  }
  update() {}

  draw(ctx) {
    if (!this.deleted) {
      ctx.beginPath();
      ctx.rect(this.bX, this.bY, this.length, this.height);
      ctx.fillStyle = this.color;

      // if (this.deleted) {
      //   ctx.fillStyle = "black";
      // }
      ctx.fill();
    }
  }
}
var myGame = new Game(); //create game

var uPadel = new UserPadel(360, 560, 100, 20, "grey");
var bricks = new Array(6);
for (var i = 0; i < bricks.length; i++) {
  bricks[i] = new Array(4);
}
var x = 50;
for (var i = 0; i < 6; i++) {
  var y = 40;
  for (var j = 0; j < 4; j++) {
    bricks[i][j] = new Bricks(x, y, 100, 20, "blue");
    //console.log(bricks[i,j]);
    myGame.addSprites(bricks[i][j]);
    y += 40;
  }
  x += 120;
}
//console.log(bricks);
var ball = new Ball(400, 400, 10, "red", uPadel, bricks);
myGame.addSprites(ball);
myGame.addSprites(uPadel);

function animate() {
  myGame.update();
  myGame.draw();
  requestAnimationFrame(animate);
}

function drawEnv(context) {
  //draw blue board and line in the middle
  drawRect(context, 0, 0, 800, 600);
}
function drawRect(context, x, y, l, h) {
  context.beginPath();
  context.rect(x, y, l, h);
  context.lineWidth = 10;
  context.strokeStyle = "orange";
  context.fillStyle = "black";
  context.fillRect(x, y, l, h);
  context.stroke();
}

window.requestAnimationFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function (f) {
    return setTimeout(f, 1000 / 60);
  };

animate();
