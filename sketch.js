let song;
let playBtn, pauseBtn, stopBtn;

let fft;
let amp;

function preload() {
  song = loadSound("music.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  fft = new p5.FFT(0.8, 64);
  amp = new p5.Amplitude();

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
  background(20);

  // test: draw ellipse reacting to volume
  let level = amp.getLevel();
  let size = map(level, 0, 0.3, 20, 200);

  noStroke();
  fill(100, 150, 255);
  ellipse(width / 2, height / 2, size);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
