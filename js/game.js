var SpielfeldRand = 10;
var balls = [];
var AnzBalls = 150;
var dmin=15;
var dmax=45;
var vMin = 6;
var vMax = 10;
var globalStartVel = 0;
var globalScore = 0;

function setup() {
	createCanvas(windowWidth*0.99, windowHeight*0.99);
	spielfeld = new Playground();
	frameRate(60);
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
		console.log(m+" - "+n);
		var vel = createVector(m*random(vMin,vMax),n*random(vMin,vMax));
		globalStartVel = globalStartVel + vel.mag();
		var d = random(dmin,dmax);
		var c1 = random(50,255);
		var c2 = random(50,255);
		var c3 = random(50,255);
		var c = color(c1,c2,c3);
		var pos = createVector(x, y);
		balls[i] = new Ball(pos, vel, d, c, 0);
	}
}

function draw() {
	var globalVel = 0;
	spielfeld.draw();
	for(var i = balls.length-1; i >= 0; i--){
		globalVel +=  balls[i].vel.mag();
		for(var x = balls.length-1; x >= 0 ; x--){
			if(balls[i].touches(balls[x])) {
				if(!balls[i].isMoving()) {
					balls[x].stopMoving();								//stops the otherBall if the first ball is already stopped
					if(balls[x].getPoints() == 0) {
						balls[x].setPoints(balls[i].getPoints()*2);
						globalScore = globalScore + balls[x].getPoints();
					}
				} else {
					balls[i].decideCollision(balls[x]);
					balls[i].swapColor(balls[x]);
				}
			}
		}
		balls[i].update();
		balls[i].show();
		balls[i].disappear(i);

	}
	drawGlobalScore(globalScore);
	drawGlobalVel(globalVel);


	//console.log("globalVel: " + globalVel);			 //indikator für spielende?

	//verkleinert das spielfeld wenn die globale Geschwindigkeit im verhältnis zur anfangsgeschwindigkeit abnimmt....
	// console.log((globalStartVel-globalVel)/globalStartVel);
	// if((globalStartVel-globalVel)/globalStartVel > 0.1) {
	// 	SpielfeldRand = width/10*(globalStartVel-globalVel)/globalStartVel;
	// }
	// if((globalStartVel-globalVel)/globalStartVel > 0.75) {
	// 	alert("Game Over.");
	// }

}

function mouseClicked() {
	var x = mouseX;
	var y = mouseY;
	var treffer = -1;
	for(var i = balls.length-1; i >= 0; i--){
		if(balls[i].isHere(x,y)) {  										//checks if the mouse hits a ball
			treffer = i;
			balls[i].increaseVel(2);											//accelerate clicked ball
		}
	}

	if(treffer == -1) {																//create new stopped Ball @ Mouse Position if the mouse doesnt hit a ball
		var pos = createVector(x, y);
		var vel = createVector(0,0);
		var d = 2*dmax;
		var c1 = random(0,255);
		var c2 = random(0,255);
		var c3 = random(0,255);
		var c = color(c1,c2,c3);
		append(balls, new Ball(pos, vel, d, c, 2));
	}
}

function windowResized() {														// called if the windows is resized
	//console.log("resize!!");
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



class Playground {
	constructor() {
		this.background = "#161618";
		this.a = 0;
		this.increment = 0.0040;
		this.r = 0;
		this.b = 0;
		this.g = 0;
		this.c = color(this.r, this.b, this.g);
	}

	draw() {
		background(this.background);
		//Spielfeld Begrenzung
		this.a = this.a + this.increment;
		this.r = 255 * abs(sin(this.a));
		this.b = 255 * abs(sin(1.4*this.a));
		this.g = 255 * abs(sin(0.25*this.a));

		this.c = color(this.r, this.b, this.g);
		stroke(this.c);
		strokeWeight(SpielfeldRand);
		noFill();
		rect(SpielfeldRand/2, SpielfeldRand/2, width-SpielfeldRand, height-SpielfeldRand);
	}

	getColor() {
		return this.c;
	}

}
