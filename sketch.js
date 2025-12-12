// STEP 1 — init: basic canvas + audio preload structure

let song;

function preload() {
  song = loadSound("music.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(20);
}

function draw() {
  background(20);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
