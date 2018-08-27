var SpielfeldRand = 10;
var spielfeld;
var balls = [];
var AnzBallsFaktor = 0.0001;
var dmin=50;
var dmaxFaktor=0.020;
var vMin = 1;
var vMax = 2;
var globalStartVel = 0;
var globalScore = 0;


function setup() {
	createCanvas(windowWidth*0.99, windowHeight*0.99);
	spielfeld = new Playground(SpielfeldRand);
	frameRate(60);
	var canvasArea = width*height;
	AnzBalls = Math.sqrt(canvasArea*AnzBallsFaktor);
	dmax = Math.sqrt(canvasArea*4*PI)*dmaxFaktor;
	dmin = 0.67*dmax;
	for(var i = 0; i < AnzBalls; i++){
		var x = random(width);
		var y = random(height);
		// var pos = createVector(x, y);
		var m = ceil(random(-2,1));
		var n = ceil(random(-2,1));
		if(m==0 || m == -0 ) {
			m+=1;
		}
		if(n==0 || n == -0 ) {
			n+=1;
		}
		var vel = createVector(m*random(vMin,vMax),n*random(vMin,vMax));
		let d = random(dmin,dmax);
		let c1 = random(255);
		let c2 = random(255);
		let c3 = random(255);
		let c = color(c1,c2,c3);
		let pos = createVector(x, y);
		balls[i] = new Ball(pos, vel, d, c, 0, i);
	}
}


function draw() {
	var globalVel = 0;
	spielfeld.draw();
	let boundary = new Rectangle(0, 0, width, height);
	let kapazitaet = 1;
	if(int(AnzBalls/10) > 1) {
		kapazitaet = int(AnzBalls/10);
	}
	let qtree = new QuadTree(boundary, kapazitaet);
	let zaehler = 0;
	for(let ball of balls){
		ball.update();
		ball.show();
		ball.disappear(zaehler);
		zaehler++;
		let point = new Point(ball.pos.x, ball.pos.y, ball);
		qtree.insert(point);
	}
	for(let ball of balls) {
		let range = new Circle(ball.pos.x, ball.pos.y, dmax);
		let points = qtree.query(range);
		for(let point of points) {
			let other = point.userData;
			if(ball !== other && ball.touches(other)) {
				if(!ball.isMoving() || !other.isMoving()) {
					ball.stopMoving();
					other.stopMoving();								//stops the otherBall if the first ball is already stopped
					if(other.getPoints() == 0) {			//sets points of a ball one time.
						other.setPoints(ball.getPoints()*2);
						globalScore = globalScore + other.getPoints();
					}
				} else {
					ball.decideCollision(other);
					ball.swapColor(other);
				}
			}
		}
	}
	drawGlobalScore(globalScore);
	drawFramrate();
}

function mouseClicked() {
	let x = mouseX;
	let y = mouseY;
	let treffer = -1;
	for(let i = balls.length-1; i >= 0; i--){
		if(balls[i].isHere(x,y)) {  										//checks if the mouse hits a ball
			treffer = i;
			balls[i].increaseVel(2);											//accelerate clicked ball
		}
	}

	if(treffer == -1) {																//create new stopped Ball @ Mouse Position if the mouse doesnt hit a ball
		var pos = createVector(x, y);
		var vel = createVector(0,0);
		var d = dmax;
		var c1 = random(0,255);
		var c2 = random(0,255);
		var c3 = random(0,255);
		var c = color(c1,c2,c3);
		append(balls, new Ball(pos, vel, d, c, 2, balls.length));
	}
}

function windowResized() {														// called if the windows is resized
  resizeCanvas(windowWidth*0.99, windowHeight*0.99);
}

function drawArrow(base, vec, myColor, scaling) {			// draw an arrow for a vector at a given base (vector)position
	push();
  stroke(myColor);
  strokeWeight(3);
  fill(myColor);
  translate(base.x, base.y);
  line(0, 0, scaling*vec.x, scaling*vec.y);
  rotate(vec.heading());
  var arrowSize = 7;
  translate(scaling*vec.mag() - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
}

function drawGlobalScore(score) {
	push();
	translate(width * 0.025, height * 0.925);
	strokeWeight(0.1);
	stroke("white");
	fill("white");
	textSize(25);
	textAlign(LEFT);
	text("Score: " + score, 0, 0);
	pop();
}

function drawGlobalVel(vel) {
	push();
	translate(width * 0.025, height * 0.925);
	strokeWeight(0.1);
	stroke("white");
	fill("white");
	textSize(25);
	textAlign(LEFT);
	text("Total Velocity: " + int(vel), 0, 25);
	pop();
}
function drawFramrate() {
	push();
	translate(width * 0.025, height * 0.925);
	strokeWeight(0.1);
	stroke("white");
	fill("white");
	textSize(25);
	textAlign(LEFT);
	text("FrameRate : " + int(frameRate()), 0, 50);
	pop();
}
