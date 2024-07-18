let redRectangles = [];
let blueRectangles = [];
const rectWidth = 20;
const rectHeight = 20;
let catcher;
let balanceBoard;
let ball;
let tilt = 0;
let gameOver = false;
let gameWin = false;
let score = 0;
let redScore = 0;
let blueScore = 0;
let restartButton;

function setup() {
  createCanvas(windowWidth, windowHeight);
  catcher = new Catcher();
  balanceBoard = new BalanceBoard(width / 2, height / 2 + 200, 300, 10);
  ball = new Ball(width / 2, height / 2 - 10);
  setupRestartButton();
}

function draw() {
  background(0);

  if (gameOver) {
    displayGameOver();
    return;
  }

  if (gameWin) {
    displayGameWin();
    return;
  }

  manageGameComponents();
}

function manageGameComponents() {
  catcher.update();
  catcher.show(score);
  tilt = calculateTilt();
  balanceBoard.update(tilt);
  balanceBoard.show();
  ball.update(balanceBoard);

  ball.show();
  manageRectangles();

  if (score >= 100) {  // Check if the win condition is met
    gameWin = true;
  }
}

function calculateTilt() {
  return constrain((redScore - blueScore) * 2, -30, 30);
}

function manageRectangles() {
  if (frameCount % 30 == 0) {
    let colorChoice = random(1) > 0.5 ? 'red' : 'blue';
    let rectangle = new Rectangle(random(width), 0, colorChoice);
    if (colorChoice === 'red') {
      redRectangles.push(rectangle);
    } else {
      blueRectangles.push(rectangle);
    }
  }

  updateRectangles(redRectangles, 1, 'red');
  updateRectangles(blueRectangles, -1, 'blue');
}

function updateRectangles(rectangles, tiltChange, color) {
  for (let i = rectangles.length - 1; i >= 0; i--) {
    rectangles[i].update();
    rectangles[i].show();

    if (rectangles[i].hits(catcher)) {
      if (color === 'red') {
        redScore += 5;
      } else {
        blueScore += 5;
      }
      score += 5;
      tilt += tiltChange;
      rectangles.splice(i, 1);
    } else if (rectangles[i].offScreen()) {
      rectangles.splice(i, 1);
    }
  }
}

function displayGameOver() {
  textSize(32);
  textAlign(CENTER, CENTER);
  fill(255, 0, 0);
  text("Game Over! Ball has fallen.", width / 2, height / 2);
  restartButton.show();
}

function displayGameWin() {
  textSize(32);
  textAlign(CENTER, CENTER);
  fill(0, 255, 0);
  text("You Win!", width / 2, height / 2);
  restartButton.show();
}

function setupRestartButton() {
  restartButton = createButton('Restart Game');
  restartButton.position(width / 2 - 50, height / 2 + 50);
  restartButton.mousePressed(restartGame);
  restartButton.hide();
}

function restartGame() {
  redRectangles = [];
  blueRectangles = [];
  tilt = 0;
  gameOver = false;
  gameWin = false;
  score = 0;
  redScore = 0;
  blueScore = 0;
  ball.reset();
  restartButton.hide();
}


class Ball {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.diameter = 20;
    this.velocity = 0; // 初始速度为0
    this.gravity = 0.1;
    this.falling = false;
  }

  update(board) {
    if (!this.falling) {
      let angle = radians(board.tilt);
      this.velocity = 0.1 * abs(board.tilt); // 速度与倾斜程度成比例
      this.x += this.velocity * sin(angle);
      this.y = board.y - this.diameter / 2;

      if (!this.isOnBoard(board)) {
        this.falling = true;
      }
    } else {
      this.y += 5; // 垂直下落
      if (this.y > height) {
        gameOver = true;
      }
    }
  }

  show() {
    fill(255, 255, 0);
    ellipse(this.x, this.y, this.diameter, this.diameter);
  }

  isOnBoard(board) {
    let boardStart = board.x - board.width / 2 + this.diameter / 2;
    let boardEnd = board.x + board.width / 2 - this.diameter / 2;
    return this.x >= boardStart && this.x <= boardEnd;
  }

  fall() {
    this.falling = true;
  }

  reset() {
    this.x = width / 2;
    this.y = height / 2 - 10;
    this.velocity = 0;
    this.falling = false;
  }
}

class Rectangle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.speed = random(5, 8);
  }

  update() {
    this.y += this.speed;
  }

  show() {
    noStroke();
    fill(this.color === 'red' ? color(255, 0, 0, 150) : color(0, 0, 255, 150));
    rect(this.x - 3, this.y - 3, rectWidth + 6, rectHeight + 6);
    fill(this.color === 'red' ? color(255, 0, 0) : color(0, 0, 255));
    rect(this.x, this.y, rectWidth, rectHeight);
  }

  hits(catcher) {
    return (this.y + rectHeight >= catcher.y && this.x + rectWidth >= catcher.x && this.x <= catcher.x + catcher.size);
  }

  offScreen() {
    return this.y > height;
  }
}

class Catcher {
  constructor() {
    this.size = 50;
    this.x = windowWidth / 2 - this.size / 2;
    this.y = windowHeight - this.size * 2;
  }

  update() {
    this.x = mouseX - this.size / 2;
  }

  show(score) {
    noStroke();
    fill(255, 255, 255, 150);
    rect(this.x, this.y, this.size, this.size);
    fill(50, 205, 50);
    let filledHeight = map(score, 0, 100, 0, this.size);
    rect(this.x, this.y + this.size - filledHeight, this.size, filledHeight);
  }
}

class BalanceBoard {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  update(tilt) {
    this.tilt = tilt;
  }

  show() {
    noStroke();
    push();
    translate(this.x, this.y);
    rotate(radians(this.tilt));
    fill(200);
    rect(-this.width / 2, -this.height / 2, this.width, this.height);
    pop();
  }
}
