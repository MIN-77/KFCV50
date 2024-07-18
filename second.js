let skinColor;
let particles = [];
let pressCount = 0;
let showPainText = false;
let showPainTextStartFrame;

function setup() {
  createCanvas(windowWidth, windowHeight);
  skinColor = color(255, 224, 189); // 皮肤颜色
  background(skinColor); // 设置背景为皮肤颜色
}

function draw() {
  if (showPainText) {
    background(0, 0, 0, 150); // 半透明的黑色背景
    fill(255, 0, 0);
    textSize(100);
    textAlign(CENTER, CENTER);
    text('痛い', width / 2, height / 2);

    if (frameCount - showPainTextStartFrame > 60) { // 显示1秒后跳转
      window.location.href = 'third.html';
    }
  } else {
    // 绘制粒子，模拟血液滴落效果
    for (let i = particles.length - 1; i >= 0; i--) {
      let p = particles[i];
      p.update();
      p.display();
      if (p.isOffScreen()) {
        particles.splice(i, 1);
      }
    }
  }
}

function mousePressed() {
  pressCount++;
  if (pressCount >= 4) {
    showPainText = true;
    showPainTextStartFrame = frameCount;
  }
}

function mouseDragged() {
  if (showPainText) {
    return; // 如果正在显示“痛い”，则不响应画笔操作
  }

  // 计算线段的长度
  let distance = dist(pmouseX, pmouseY, mouseX, mouseY);
  
  // 计算笔刷的粗细，两头细中间粗
  let maxStrokeWeight = 10; // 中间的最大粗细
  let minStrokeWeight = 2;  // 两头的最细
  let weight = map(distance, 0, 50, minStrokeWeight, maxStrokeWeight);
  weight = constrain(weight, minStrokeWeight, maxStrokeWeight);

  stroke(255, 0, 0); // 红色的画笔
  strokeWeight(weight); // 动态调整的笔刷粗细
  line(pmouseX, pmouseY, mouseX, mouseY); // 画线

  // 每次拖动时生成少量粒子，并且少量粒子之间间隔
  if (frameCount % 5 === 0) { // 控制粒子生成的频率
    particles.push(new Particle(mouseX, mouseY));
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(skinColor); // 调整窗口大小时重新设置背景颜色
}

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-0.5, 0.5), random(1, 2)); // 调整初始速度
    this.acc = createVector(0, 0.05); // 调整重力加速度
    this.lifetime = 100; // 调整粒子寿命
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.lifetime -= 5; // 每帧减少寿命
  }

  display() {
    noStroke();
    fill(255, 0, 0, this.lifetime); // 红色，带有透明度
    ellipse(this.pos.x, this.pos.y, 3); // 调整粒子大小
  }

  isOffScreen() {
    return (this.pos.y > height || this.lifetime <= 0);
  }
}
