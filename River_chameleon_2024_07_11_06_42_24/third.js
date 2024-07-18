let rects = [];
const numRects = 100; // 增加矩形数量以获得更精细的心形
const rectWidth = 5; // 减小矩形宽度以适应心形曲线
const initialHeight = 1; // 初始高度设置为 1
let amplitude = 20; // 控制矩形的最大高度
let state = 0; // 用于跟踪当前的状态
let isMousePressed = false; // 用于跟踪鼠标按下状态
let clickCount = 0; // 用于跟踪点击次数
let startFalling = false; // 用于跟踪矩形是否开始下落
let fallSpeeds = []; // 用于存储矩形的下降速度
let allRectsFallen = false; 

function setup() {
  createCanvas(600, 600);
  background(0);

  for (let i = 0; i < numRects; i++) {
    rects.push({
      height: initialHeight,
      x: 0,
      y: 0
    });
    fallSpeeds.push(random(1, 5)); // 随机生成每个矩形的下降速度
  }

  loop(); // 立即开始绘制循环
}

function draw() {
  background(0); // 设置背景颜色为黑色
  translate(width / 2, height / 2); // 将图案居中

  for (let i = 0; i < numRects; i++) {
    let t = map(i, 0, numRects, -PI, PI);
    let targetX, targetY;

    if (startFalling) {
      // 矩形开始以不同速度下落
      rects[i].y += fallSpeeds[i];
      if (rects[i].y > height / 2) {
        rects[i].y = height / 2; // 保证矩形不会超出画布
      }
    } else if (state === 0) {
      // 计算心形位置
      rects[i].x = 16 * pow(sin(t), 3) * 20;
      rects[i].y = -(13 * cos(t) - 5 * cos(2 * t) - 2 * cos(3 * t) - cos(4 * t)) * 20;
    } else if (state === 1) {
      // 移动到画布中心的水平直线
      targetX = map(i, 0, numRects - 1, -width / 2 + 50, width / 2 - 50);
      targetY = 0;

      rects[i].x = lerp(rects[i].x, targetX, 0.05);
      rects[i].y = lerp(rects[i].y, targetY, 0.05);
    } else if (state === 2) {
      // 计算DNA双螺旋位置
      let dnaT = map(i, 0, numRects, 0, TWO_PI);
      let dnaX = 150 * cos(dnaT + millis() * 0.002);
      let dnaY = 150 * sin(dnaT + millis() * 0.002) + (i % 2 === 0 ? 50 : -50);

      if (isMousePressed) {
        dnaX *= 0.5; // 收缩到原来的一半
        dnaY *= 0.5; // 收缩到原来的一半
      }

      rects[i].x = lerp(rects[i].x, dnaX, 0.05);
      rects[i].y = lerp(rects[i].y, dnaY, 0.05);
    }

    if (state !== 3) {
      // 跳动效果
      let bounce = sin((millis() + i * 100) * 0.01) * amplitude;
      rects[i].height = bounce;

      // 外发光效果
      drawingContext.shadowBlur = 20;
      drawingContext.shadowColor = color(255, 0, 0);
      fill(255, 0, 0);
      rect(rects[i].x, rects[i].y - rects[i].height, rectWidth, rects[i].height);

      drawingContext.shadowColor = color(0, 0, 255);
      fill(0, 0, 255);
      rect(rects[i].x, rects[i].y, rectWidth, rects[i].height);

      // 重置阴影
      drawingContext.shadowBlur = 0;
    }
  }

  if (startFalling) {
    // 检查是否所有矩形都已下落
    let allInPosition = true;
    for (let i = 0; i < numRects; i++) {
      if (rects[i].y < height / 2) {
        allInPosition = false;
        break;
      }
    }
    if (allInPosition) {
      allRectsFallen = true;
      noLoop();
      // 跳转到新的页面
      window.location.href = "forth.html";
    }
  }

  // 当所有矩形接近目标位置时停止动画
  if (state === 1) {
    let allInPosition = true;
    for (let i = 0; i < numRects; i++) {
      targetX = map(i, 0, numRects - 1, -width / 2 + 50, width / 2 - 50);
      targetY = 0;

      if (abs(rects[i].x - targetX) > 1 || abs(rects[i].y - targetY) > 1) {
        allInPosition = false;
        break;
      }
    }

    if (allInPosition) {
      noLoop();
    }
  } else if (state === 2) {
    let allInDNA = true;
    for (let i = 0; i < numRects; i++) {
      let dnaT = map(i, 0, numRects, 0, TWO_PI);
      let dnaX = 150 * cos(dnaT + millis() * 0.002);
      let dnaY = 150 * sin(dnaT + millis() * 0.002) + (i % 2 === 0 ? 50 : -50);

      if (isMousePressed) {
        dnaX *= 0.5; // 收缩到原来的一半
        dnaY *= 0.5; // 收缩到原来的一半
      }

      if (abs(rects[i].x - dnaX) > 1 || abs(rects[i].y - dnaY) > 1) {
        allInDNA = false;
        break;
      }
    }

    if (allInDNA) {
      noLoop();
    }
  }
}

function mousePressed() {
  if (state === 2) {
    isMousePressed = true;
  } else if (state !== 3) {
    state = (state + 1) % 3;
    loop();
  }
}

function mouseReleased() {
  if (state === 2) {
    isMousePressed = false;
    loop();
  }
  
  if (state === 2) {
    clickCount++;
    if (clickCount === 5) {
      setTimeout(() => {
        startFalling = true;
        loop();
      }, 1000); // 1秒延迟后开始下落
    }
  }
}