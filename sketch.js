let song;
let playBtn, pauseBtn, stopBtn;

let fft;
let amp;

let themeDark;
let themeBlue;

function preload() {
  song = loadSound("music.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);

  fft = new p5.FFT(0.8, 64);
  amp = new p5.Amplitude();

  themeDark = color(10, 15, 35);
  themeBlue = color(45, 110, 255);

  setupButtons();
}

function setupButtons() {
  playBtn = createButton("Play");
  pauseBtn = createButton("Pause");
  stopBtn = createButton("Stop");

  let buttons = [playBtn, pauseBtn, stopBtn];
  let x = 20;

  buttons.forEach((btn) => {
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

function draw() {
  drawBackground();

  let level = amp.getLevel();
  let spectrum = fft.analyze();
  let waveform = fft.waveform();

  // Pulse
  drawPulse(level);

  // EQ Bars
  drawEQ(spectrum, level);

  // Waveform
  drawWaveform(waveform);

  // 기존 테스트 원 유지
  let size = map(level, 0, 0.3, 20, 200);
  noStroke();
  fill(100, 150, 255, 150);
  ellipse(width / 2, height / 2, size);
}

function drawBackground() {
  let level = amp.getLevel();
  let offset = map(level, 0, 0.3, 0, 30);

  let g = drawingContext.createLinearGradient(0, 0, 0, height);
  g.addColorStop(0, themeDark);
  g.addColorStop(
    1,
    color(
      red(themeBlue) / 3 + offset,
      green(themeBlue) / 3 + offset,
      blue(themeBlue) / 3 + offset
    )
  );

  drawingContext.fillStyle = g;
  noStroke();
  rect(0, 0, width, height);
}

function drawPulse(level) {
  let size = map(level, 0, 0.3, 80, 260);

  push();
  translate(width / 2, height / 2 - 100);

  // Outer Glow
  stroke(themeBlue);
  strokeWeight(20);
  stroke(red(themeBlue), green(themeBlue), blue(themeBlue), 40);
  noFill();
  ellipse(0, 0, size + 70);

  // Main Circle
  stroke(themeBlue);
  strokeWeight(4);
  ellipse(0, 0, size);

  pop();
}

function drawEQ(spectrum, level) {
  let barWidth = width / spectrum.length;
  let shake = map(level, 0, 0.3, 0, 2);

  push();
  translate(0, shake);

  for (let i = 0; i < spectrum.length; i++) {
    let v = spectrum[i];
    let h = map(v, 0, 255, 2, height * 0.25);

    noStroke();
    fill(150, 200, 255, 180);
    rect(i * barWidth, height - h, barWidth - 2, h);
  }

  pop();
}

function drawWaveform(waveform) {
  noFill();

  // Wave shadow (부드러운 그림자)
  stroke(180, 200, 255, 60);
  strokeWeight(6);
  beginShape();
  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length, 0, width);
    let y = map(waveform[i], -1, 1, height * 0.6, height * 0.85);
    vertex(x, y);
  }
  endShape();

  // Main waveform 라인
  stroke(themeBlue);
  strokeWeight(3);
  beginShape();
  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length, 0, width);
    let y = map(waveform[i], -1, 1, height * 0.57, height * 0.82);
    vertex(x, y);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
