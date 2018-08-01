var istroke = 10;
var balls = [];
var AnzBalls = 2;
var dmin=100;
var dmax=200;
var vMin = 1;
var vMax = 3;

function setup() {
	createCanvas(windowWidth*0.99, windowHeight*0.99);
	background('#161618');
	frameRate(60);


	for(var i = 0; i < AnzBalls; i++){
		var x = random(2*istroke+2*dmax,windowWidth-2*dmax);
		var y = random(2*dmax,height-2*dmax);
		var pos = createVector(x, y);
		var vel = createVector(random(vMin,vMax),random(vMin,vMax));
		vel.x = 2.5*(i+1);
		vel.y = 0;
		var d = random(dmin,dmax);
		var c1 = random(0,255);
		var c2 = random(0,255);
		var c3 = random(0,255);
		var c = color(c1,c2,c3);
		balls[i] = new Ball(pos, vel, d, c, i);
	}

}

function windowResized() {
	console.log("resize!!");
  resizeCanvas(windowWidth, windowHeight);
	}


function draw() {
	drawPlaygound()
	for(var i = balls.length-1; i >= 0; i--){
		balls[i].update();
		balls[i].show();
		for(var x = i-1; x >= 0; x--){
			balls[i].touches(balls[x]);
		}

	}
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
	strokeWeight(istroke);
	noFill();
	rect(istroke/2, istroke/2, width-istroke, height-istroke);

}


// draw an arrow for a vector at a given base position
function drawArrow(base, vec, myColor, scaling) {
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


class Ball {
  constructor(pos, vel, d, c, name) {
		this.pos = pos;
		this.vel = vel;
		this.d = d;
		this.c = c;
		this.name = name;
		this.filled = true;

  }

	drawName() {
		push();
		translate(this.pos.x, this.pos.y);
		strokeWeight(0.1);
		stroke("white");
		fill("white");
		textSize(25);
		text(this.name, 0, 0);
		pop();
	}

  update() {
		this.pos.add(this.vel);
		this.reflect(balls);
		//console.log(balls);
  }

  show() {
    stroke(this.c);
    fill(this.c);
		if(!this.filled) {
		 	noFill();
		}
		ellipse(this.pos.x, this.pos.y, this.d);
		this.drawName();
		drawArrow(this.pos, this.vel, 'blue', 10);

  }

	reflect(balls) {
		//wand x richtung
		if(this.pos.x+this.d/2 > width - 1.5*istroke || this.pos.x-this.d/2 < 1.5*istroke) {
			this.vel.x = this.vel.x * (-1);
			a = 2*a;
			this.c = color(random(0,255),random(0,255),random(0,255));
		}
		//wand y richtung
		if(this.pos.y+this.d/2 > height - 1.5*istroke || this.pos.y-this.d/2 < 1.5*istroke) {
			this.vel.y = this.vel.y * (-1);
			a = 2*a;
			this.c = color(random(0,255),random(0,255),random(0,255));
		}
	}

	touches(otherBall) {
	//bälle gegeneinander
		var abstand = dist(this.pos.x, this.pos.y, otherBall.pos.x, otherBall.pos.y);
		if(abstand < this.d/2+otherBall.d/2) {
			var oldVel = createVector(this.vel.x, this.vel.y);
			var oldotherBallVel = createVector(otherBall.vel.x, otherBall.vel.y);
			drawArrow(this.pos, this.vel, "white", 15);
			drawArrow(otherBall.pos, otherBall.vel, "white", 15);
			this.filled = false;
			otherBall.filled = false;
			console.log("Treffer von " + this.name + " an " + otherBall.name);
			var tempOtherBallPos = createVector(otherBall.pos.x, otherBall.pos.y);
			var otherDirection = tempOtherBallPos.sub(this.pos);
			//console.log("this.pos: "+this.pos+"\notherDir: "+ otherDirection);
			drawArrow(this.pos, otherDirection, "red", 1);
			var thisangleBetween = this.vel.angleBetween(otherDirection);
			console.log("Winkel: thisangleBetween vel/dir: " + degrees(thisangleBetween));
			var otherangleBetween = otherBall.vel.angleBetween(otherDirection);
			console.log("Winkel: otherangleBetween vel/dir: " + degrees(otherangleBetween));
			var winkel = otherDirection.heading();
			console.log("Winkel: otherDirection.heading: " + degrees(winkel));


			//var xVelCos = this.vel.mag() * cos(winkel);
			//var yVelSin = this.vel.mag() * sin(winkel);
			//console.log("this.vel.x: "+ this.vel.x + "\nxVelCos: "+ xVelCos + "\nthis.vel.y: "+ this.vel.y + "\nyVelSin: "+ yVelSin);
			//var otherxVelCos = otherBall.vel.mag() * cos(winkel);
			//var otheryVelSin = otherBall.vel.mag() * sin(winkel);
			//console.log("\nother.vel.x: "+ otherBall.vel.x + "\notherxVelCos: "+ otherxVelCos + "\nother.vel.y: "+ otherBall.vel.y + "\notheryVelSin: "+ otheryVelSin);
			var WinkelVel = this.vel.angleBetween(otherBall.vel);
			console.log("WinkelVel: " + degrees(WinkelVel));
			//this.vel = createVector((-1)*xVelCos, (-1)*yVelSin);
			// this.vel = createVector((-0.5)*xVelCos, (-2)*yVelSin);
			//otherBall.vel = createVector((-1)*otherxVelCos, (-1)*otheryVelSin);
			// otherBall.vel = createVector((-1)*otherxVelCos, otheryVelSin);
			this.vel.rotate(2*thisangleBetween);
			if (degrees(thisangleBetween) > 45) {
				if (degrees(WinkelVel) <= 100) {
					this.vel = createVector((-1)*this.vel.x, (-1)*this.vel.y);
				} else {
					this.vel = createVector(this.vel.x, this.vel.y);
				}

			} else {
				if (degrees(WinkelVel) <= 100) {
					this.vel = createVector(this.vel.x, this.vel.y);
				} else {
					this.vel = createVector((-1)*this.vel.x, (-1)*this.vel.y);
				}
			}


			otherBall.vel.rotate((2)*otherangleBetween);
			if (degrees(WinkelVel) <= 100) {
				otherBall.vel = createVector(otherBall.vel.x, otherBall.vel.y);
			} else {
				otherBall.vel = createVector((-1)*otherBall.vel.x, (-1)*otherBall.vel.y);
			}


			drawArrow(this.pos, this.vel, "yellow", 15);
			drawArrow(otherBall.pos, otherBall.vel, "green", 15);
			push(); //senkrechte
				translate(this.pos.x, this.pos.y);
				translate(otherDirection.x/2, otherDirection.y/2);
				otherDirection.rotate(PI/2); //90°
				strokeWeight(2);
				stroke("white");
				line(-10*otherDirection.x, -10*otherDirection.y, otherDirection.x*10, otherDirection.y*10);
			pop();
			push();
				translate(this.pos.x, this.pos.y);
				console.log(this.vel + " <<new old>> "+ oldVel);
				translate(15*oldVel.x, 15*oldVel.y);
				drawArrow(oldVel, this.vel, "orange", 15);
			pop();

			push();
				translate(otherBall.pos.x, otherBall.pos.y);
				console.log(otherBall.vel + " <<new old>> "+ oldotherBallVel);
				translate(15*oldotherBallVel.x, 15*oldotherBallVel.y);
				drawArrow(oldotherBallVel, otherBall.vel, "orange", 15);
			pop();

			//noLoop();
			alert("des");

			console.log("--------ENDE------");
			//this.update();
			//otherBall.update();

			}
		}
}
