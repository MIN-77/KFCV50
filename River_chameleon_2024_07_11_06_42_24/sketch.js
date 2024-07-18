let heartX, heartY, heartSize;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
}

function draw() {
  background(0); // 设置背景为黑色
  heartX = width / 2;
  heartY = height / 2;
  heartSize = 100 + 50 * sin(frameCount * 0.1); // 心形大小随时间变化
  let glowSize = 30 + 15 * sin(frameCount * 0.1); // 增加发光效果的范围
  let alpha = 150 + 105 * sin(frameCount * 0.1); // 设置透明度随时间变化

  // 设置外发光效果
  drawingContext.shadowBlur = glowSize;
  drawingContext.shadowColor = color(0, 0, 255, alpha);

  fill(255, 0, 0, alpha); // 设置心形颜色为红色，并添加透明度
  drawHeart(heartX, heartY, heartSize); // 画出心形

  // 重置发光效果
  drawingContext.shadowBlur = 0;

  // 设置文字属性
  fill(255, 255, 255, alpha); // 设置文字颜色为白色，并添加透明度
  textAlign(CENTER, CENTER); // 设置文字对齐方式
  textSize(heartSize / 5); // 设置文字大小与心形大小相关
  text('START', heartX, heartY + heartSize / 2); // 在红心上绘制文字
}

function drawHeart(x, y, size) {
  beginShape();
  vertex(x, y + size / 4);
  bezierVertex(x - size / 2, y - size / 4, x - size, y + size / 2, x, y + size);
  bezierVertex(x + size, y + size / 2, x + size / 2, y - size / 4, x, y + size / 4);
  endShape(CLOSE);
}

function mousePressed() {
  let d = dist(mouseX, mouseY, heartX, heartY);
  if (d < heartSize) {
    window.location.href = 'second.html';
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
