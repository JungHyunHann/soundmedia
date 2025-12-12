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
  let size = map(level, 0, 0.3, 20, 200);

  noStroke();
  fill(100, 150, 255);
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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
