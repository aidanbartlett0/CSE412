let mic;
let waveSpeed;
let currentHeight = 10;
let fft;
let circles = [];
//initialize some variables and the circles array


function setup() {
  createCanvas(600, 400);
  waveSpeed = 0.03;

  mic= new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  fft.setInput(mic);
  //frequency and audio input initializing
}

function draw() {
  background(255);
  noStroke();
  let frequency = fft.analyze();
  let volBass = fft.getEnergy("bass");
  let volTreble = fft.getEnergy("treble");
  let volMid = fft.getEnergy("mid");
  //get frequency and map to different colors
  
  let bassC = map(volBass, 0, 255, 0, 255);
  let trebleC = map(volTreble, 0, 255, 0, 255);
  let midC = map(volMid, 0, 255, 0, 360);

  fill(trebleC, bassC, midC);
  //color for sound wave
  
  let micLevel = mic.getLevel();
  let waveHeight = map(micLevel, 0, 1, 5, height * 10);
  //get audio level
  
  currentHeight = lerp(currentHeight, waveHeight, 0.1); 
  //smooth the wave out
  
//begin drawing the volume wave
  beginShape();
  for (let x = 0; x <= width / 2; x += 1) {
  let y = height / 2 + sin(x * waveSpeed + frameCount * 0.1) * currentHeight;
    //height of wave
    vertex(x, y);
  }
  vertex(width / 2, height/2);
  //right point of line
  vertex(0, height/2);
  //left point of line
  endShape(CLOSE);
  
//Start the frequency graph shape
  push();
  translate(width/1.4, height/2);
  beginShape();
  noFill();
  rotate(radians(270));
  for (let i = 0; i < frequency.length; i++) {
    let angle = map(i, 0, frequency.length, 0, TWO_PI); 
    // Map index to angle around the circle
    let radius = map(frequency[i], 0, 255, 50, 200); 
    //make each line be mapped to the circle's radius
    let x = radius * cos(angle);
    let y = radius * sin(angle);
    let col = map(i, 0, frequency.length, 0, 255);
    stroke(trebleC, bassC, midC);
    
    vertex(x, y); // Draw line
  }
  endShape(CLOSE);
  pop();
  //reset from the frequency 
  if (circles.length >= 10) {
    circles.splice(0, circles.length);
  }
  //if theres too many circles delete them so more can be added
  
//start drawing more circles to appear for signifigant treble input
  push();
  translate(0, 0);
  if (trebleC > 50 && circles.length < 10) {
    let circle = {
      x: random(width),
      y: random(height),
      size: random(10, 30),
      speedX: random(-5, 5),
      speedY: random(-5, 5),
      R: random(0, 255),
      G: random(0, 255),
      B: random(0, 255),
      O: random(0, 255)
    };
    circles.push(circle);
  }
  for(let circle of circles) {
    if (circle.x <= 0 || circle.x >= width) {
      circle.speedX *= -1;
    }
    if (circle.y <= 0 || circle.y >= height) {
      circle.speedY *= -1;
    }
    fill(circle.R, circle.G, circle.B);
    ellipse(circle.x, circle.y, circle.size);
    
    circle.x += circle.speedX;
    circle.y += circle.speedY;
  }
  
//RGB squares at the bottom so you can see the audio makup
  fill(trebleC, 0, 0)
  square(width/2 - 75, height - 50, 50);
  fill(0, bassC, 0)
  square(width/2 - 25, height - 50, 50);
  fill(0, 0, midC)
  square(width/2 + 25, height - 50, 50);

  pop();
  //reset
  
}
