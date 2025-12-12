let song;
let fft;
let amp;

let playBtn, pauseBtn, stopBtn;

let ripples = [];
let themeBlue, themeLight, themeDark;

let colorModeIndex = 0;
let visMode = 0;

// 노래 파일 로드
function preload() {
  song = loadSound("music.mp3");
}

// 초기 설정
function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);

  fft = new p5.FFT(0.8, 64);
  amp = new p5.Amplitude();

  setupColorMode(0);
  setupButtons();
}

// 색상 모드 설정
function setupColorMode(mode) {
  if (mode === 0) {
    themeDark = color(10, 15, 35);
    themeBlue = color(45, 110, 255);
    themeLight = color(150, 190, 255);
  } else {
    themeDark = color(20, 30, 50);
    themeBlue = color(200, 220, 255);
    themeLight = color(230, 240, 255);
  }
}

// 버튼 UI 세팅
function setupButtons() {
  playBtn = createButton("Play");
  pauseBtn = createButton("Pause");
  stopBtn = createButton("Stop");

  let btns = [playBtn, pauseBtn, stopBtn];
  let x = 20;

  btns.forEach((btn) => {
    btn.position(x, 20);
    btn.style("padding", "8px 14px");
    btn.style("background", "#112244");
    btn.style("color", "#e0ecff");
    btn.style("border", "1px solid #335588");
    btn.style("border-radius", "4px");
    btn.style("cursor", "pointer");
    x += 85;
  });

  playBtn.mousePressed(() => !song.isPlaying() && song.play());
  pauseBtn.mousePressed(() => song.pause());
  stopBtn.mousePressed(() => song.stop());
}

// 매 프레임마다 호출
function draw() {
  let level = amp.getLevel();
  let spectrum = fft.analyze();
  let waveform = fft.waveform();

  drawBackground(level);

  if (visMode === 0) {
    drawEQ(spectrum, level);
    drawWaveform(waveform);
    drawPulse(level);
  }
  if (visMode === 1) drawEQ(spectrum, level);
  if (visMode === 2) drawWaveform(waveform);
  if (visMode === 3) drawPulse(level);

  drawRipples();
  drawLabels();
}

// 배경 그리기
function drawBackground(level) {
  let offset = map(level, 0, 0.3, 0, 30);

  let g = drawingContext.createLinearGradient(0, 0, 0, height);
  g.addColorStop(0, themeDark);
  g.addColorStop(
    1,
    color(
      red(themeBlue) / 4 + offset,
      green(themeBlue) / 4 + offset,
      blue(themeBlue) / 4 + offset
    )
  );

  drawingContext.fillStyle = g;
  noStroke();
  rect(0, 0, width, height);
}

// 펄스 원형 그리기
function drawPulse(level) {
  let size = map(level, 0, 0.3, 80, 260);

  push();
  translate(width / 2, height * 0.35);

  stroke(themeBlue);
  strokeWeight(20);
  stroke(red(themeBlue), green(themeBlue), blue(themeBlue), 40);
  noFill();
  ellipse(0, 0, size + 70);

  stroke(themeBlue);
  strokeWeight(4);
  ellipse(0, 0, size);

  pop();
}

// EQ 바 그리기
function drawEQ(spectrum, level) {
  let bw = width / spectrum.length;
  let shake = map(level, 0, 0.3, 0, 2);

  push();
  translate(0, shake);

  fill(0, 0, 0, 40);
  rect(0, height - 40, width, 40);

  for (let i = 0; i < spectrum.length; i++) {
    let v = spectrum[i];
    let h = map(v, 0, 255, 2, height * 0.25);

    noStroke();
    fill(themeLight);
    rect(i * bw, height - h, bw - 2, h);
  }

  pop();
}

// 웨이브폼 그리기
function drawWaveform(waveform) {
  noFill();

  stroke(themeLight);
  strokeWeight(6);
  stroke(red(themeLight), green(themeLight), blue(themeLight), 40);
  beginShape();
  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length, 0, width);
    let y = map(waveform[i], -1, 1, height * 0.58, height * 0.83);
    vertex(x, y);
  }
  endShape();

  stroke(themeBlue);
  strokeWeight(3);
  beginShape();
  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length, 0, width);
    let y = map(waveform[i], -1, 1, height * 0.55, height * 0.8);
    vertex(x, y);
  }
  endShape();
}

// Ripple 클래스
class Ripple {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 0;
    this.alpha = 200;
  }

  update() {
    this.size += 10;
    this.alpha -= 3;
  }

  draw() {
    stroke(themeBlue);
    strokeWeight(10);
    stroke(red(themeBlue), green(themeBlue), blue(themeBlue), this.alpha / 4);
    noFill();
    ellipse(this.x, this.y, this.size + 30);

    stroke(themeLight);
    strokeWeight(2);
    stroke(red(themeLight), green(themeLight), blue(themeLight), this.alpha);
    ellipse(this.x, this.y, this.size);
  }

  get dead() {
    return this.alpha <= 0;
  }
}

// 리플 효과 모음 그리기
function drawRipples() {
  ripples.forEach((r) => {
    r.update();
    r.draw();
  });
  ripples = ripples.filter((r) => !r.dead);
}

// 마우스 클릭 리플 생성
function mousePressed() {
  ripples.push(new Ripple(mouseX, mouseY));
}

// 화면 오른쪽 위 라벨 표시
function drawLabels() {
  fill(180);
  noStroke();
  textSize(14);

  let label = "C : 색상 모드  |  SPACE : 비주얼 모드 전환";
  let tw = textWidth(label);

  text(label, width - tw - 20, 30);
}

// 키보드 입력 처리
function keyPressed() {
  if (key === "c" || key === "C") {
    colorModeIndex = (colorModeIndex + 1) % 2;
    setupColorMode(colorModeIndex);
  }

  if (key === " ") {
    visMode = (visMode + 1) % 4;
  }
}

// 창 크기 변경 대응
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
