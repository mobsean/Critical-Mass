var SpielfeldRand = 10;
var balls = [];
var AnzBalls = 25;
var dmin=75;
var dmax=100;
var vMin = -3;
var vMax = 3;
var globalStartVel = 0;

function setup() {
	createCanvas(windowWidth*0.99, windowHeight*0.99);
	background('#161618');
	frameRate(60);
	for(var i = 0; i < AnzBalls; i++){
		var x = random(width);
		var y = random(height);
		// var pos = createVector(x, y);
		var vel = createVector(random(vMin,vMax),random(vMin,vMax));
		globalStartVel = globalStartVel + vel.mag();
		var d = random(dmin,dmax);
		var c1 = random(0,255);
		var c2 = random(0,255);
		var c3 = random(0,255);
		var c = color(c1,c2,c3);
		//x = width/2+i*d;
		//y = height/2+i*d*0.1;
		var pos = createVector(x, y);
		balls[i] = new Ball(pos, vel, d, c, i);
	}
	console.log("globalStartVel: "+ globalStartVel);
}

function draw() {
	drawPlaygound();
	var globalVel = 0;
	var globalScore = 0;
	for(var i = 0; i < balls.length; i++){
		globalVel = globalVel + balls[i].vel.mag();
		for(var x = 0; x < balls.length; x++){
			//if(balls[i].isMoving()) {
				if(balls[i].touches(balls[x])) {
					if(!balls[i].isMoving()) {
						balls[x].stopMoving();								//stops the otherBall if the first ball is already stopped
						if(balls[x].getPoints() == 0) {
							balls[x].setPoints(balls[i].getPoints()*2);
						}
					} else {
						balls[i].decideCollision(balls[x]);
						balls[i].swapColor(balls[x]);
					}
				}
			//}
		}
		balls[i].update();
		balls[i].show();
		globalScore = globalScore + balls[i].getPoints();
	}
	//console.log("globalScore: "+ globalScore);
	drawGlobalScore(globalScore);
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

var a = 0.0;
var inc = 0.0025;
function drawPlaygound() {
	background('#161618');
	//Spielfeld Begrenzung
	a = a + inc;
	r = 255 * abs(sin(a));
	b = 255 * abs(sin(1.4*a));
	g = 255 * abs(sin(0.25*a));

	var c = color(r,b,g);
	stroke(c);
	strokeWeight(SpielfeldRand);
	noFill();
	rect(SpielfeldRand/2, SpielfeldRand/2, width-SpielfeldRand, height-SpielfeldRand);
}

function mouseClicked() {
	var x = mouseX;
	var y = mouseY;
	var treffer = -1;
	for(var i = balls.length-1; i >= 0; i--){
		if(balls[i].isHere(x,y)) {  										//checks if the mouse hits a ball
			treffer = i;
			//balls[treffer].togglePoints();
		}
	}
	if(treffer > -1) {
		if(balls[treffer].isMoving()) {
			balls[treffer].stopMoving();										//stops the clicked Ball
			balls[treffer].setPoints(2);
		}
	}
	if(treffer == -1) {																//create new Ball @ Mouse Position if the mouse doesnt stop a ball
		var pos = createVector(x, y);
		var vel = createVector(random(vMin,vMax),random(vMin,vMax));
		var d = random(dmin,dmax);
		var c1 = random(0,255);
		var c2 = random(0,255);
		var c3 = random(0,255);
		var c = color(c1,c2,c3);
		append(balls, new Ball(pos, vel, d, c, balls.length));
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
	translate(width * 0.025, height * 0.95);
	strokeWeight(0.1);
	stroke("white");
	fill("white");
	textSize(25);
	text("Score: " + score, -7, 8);
	pop();

}
