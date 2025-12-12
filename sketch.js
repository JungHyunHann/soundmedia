let song;
let playBtn, pauseBtn, stopBtn;

function preload() {
  song = loadSound("music.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
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
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
