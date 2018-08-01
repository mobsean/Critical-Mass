var istroke = 10;
var balls = [];
var AnzBalls = 2;
var dmin=150;
var dmax=150;
var vMin = 1;
var vMax = 3;

function setup() {
	createCanvas(windowWidth*0.99, windowHeight*0.99);
	background('#161618');
	frameRate(60);


	for(var i = 0; i < AnzBalls; i++){
		var x = random(2*istroke+2*dmax,windowWidth-2*dmax);
		var y = random(2*dmax,height-2*dmax);
		// var pos = createVector(x, y);
		var vel = createVector(random(vMin,vMax),random(vMin,vMax));
		vel.x = 2.5*(i+1);
		vel.y = 0;
		var d = random(dmin,dmax);
		var c1 = random(0,255);
		var c2 = random(0,255);
		var c3 = random(0,255);
		var c = color(c1,c2,c3);
		x = width/2+i*d;
		y = height/2+i*d*0.1;
		var pos = createVector(x, y);
		balls[i] = new Ball(pos, vel, d, c, i);
	}

}

function windowResized() {
	console.log("resize!!");
  resizeCanvas(windowWidth, windowHeight);
	}


function draw() {
	drawPlaygound();
	for(var i = balls.length-1; i >= 0; i--){
		for(var x = i; x >= 0; x--){
			balls[i].touches(balls[x]);
		}
		balls[i].update();
		balls[i].show();
	}
	// for(var i = balls.length-1; i >= 0; i--){
	// 	balls[i].update();
	// 	balls[i].show();
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
	strokeWeight(istroke);
	noFill();
	rect(istroke/2, istroke/2, width-istroke, height-istroke);

}

function mousePressed() {
	var x = mouseX;
	var y = mouseY;
  var pos = createVector(x, y);
	var vel = createVector(3 * random(vMin,vMax),0);
	var d = random(dmin,dmax);
	var c1 = random(0,255);
	var c2 = random(0,255);
	var c3 = random(0,255);
	var c = color(c1,c2,c3);
	append(balls, new Ball(pos, vel, d, c, balls.length));
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
		this.reflect(balls);
		this.pos.add(this.vel);
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
	//this.ball gegen andere bälle. this and otherBall drehen sich entsprechend
		// console.log("------START--------\nName: " + this.name + " otherBall: "+ otherBall.name);
		var abstand = dist(this.pos.x, this.pos.y, otherBall.pos.x, otherBall.pos.y);
		if(abstand >0 && abstand < this.d/2+otherBall.d/2) {
			var debugHit = false;
			var thisVelOld = createVector(this.vel.x, this.vel.y);
			var otherVelOld = createVector(otherBall.vel.x, otherBall.vel.y);
			drawArrow(this.pos, this.vel, "white", 15);
			drawArrow(otherBall.pos, otherBall.vel, "white", 15);
			this.filled = false;
			otherBall.filled = false;
			console.log("Treffer von " + this.name + " an " + otherBall.name);
			var otherDirection = createVector(otherBall.pos.x, otherBall.pos.y).sub(this.pos);
			//console.log("this.pos: "+this.pos+"\notherDir: "+ otherDirection);
			drawArrow(this.pos, otherDirection, "red", 1);


			var thisWink_Vel_oD = this.vel.heading() - otherDirection.heading();
			console.log("thisWink_Vel_oD: " + int(degrees(thisWink_Vel_oD)));
			// var otherWink_Vel_oD = otherBall.vel.angleBetween(otherDirection);
			var otherWink_Vel_oD = otherBall.vel.heading() - otherDirection.heading();
			console.log("otherWink_Vel_oD: " + int(degrees(otherWink_Vel_oD)));
			//var otherangleBetween = otherBall.vel.angleBetween(otherDirection);
			//console.log("Winkel: otherangleBetween vel/dir: " + degrees(otherangleBetween));
			var Wink_OtherDirection = otherDirection.heading();
			console.log("Wink_OtherDirection: " + int(degrees(Wink_OtherDirection)));
			var thisVel_Heading = this.vel.heading();
			console.log("this.vel.heading(): " + int(degrees(this.vel.heading())));
			console.log("otherBall.vel.heading(): " + int(degrees(otherBall.vel.heading())));
			var diffBothVelHeading = this.vel.heading() - otherBall.vel.heading();
			console.log("diffBothVelHeading: " + int(degrees(diffBothVelHeading)));
			var Win_Vel_oB_Vel = thisVel_Heading - Wink_OtherDirection;
			//console.log("Win_Vel_oB_Vel: " + degrees(Win_Vel_oB_Vel));
			var otherWin_Vel_oB_Vel = otherBall.vel.heading() - Wink_OtherDirection;
			//console.log("otherWin_Vel_oB_Vel: " + degrees(otherWin_Vel_oB_Vel));
			var otherVelDiff = otherWink_Vel_oD - otherWin_Vel_oB_Vel;
			//console.log("otherVelDiff: " + degrees(otherVelDiff));
			this.vel.rotate(-2*thisWink_Vel_oD);
			otherBall.vel.rotate(-2*otherWink_Vel_oD);


			if(360 >= degrees(diffBothVelHeading) && degrees(diffBothVelHeading) > 225) {
				console.log("YEEAH3333333333");
				this.vel = createVector((-1)*this.vel.x, (-1)*this.vel.y);
				console.log("-3this ändere Richtung");
				otherBall.vel = createVector((-1)*otherBall.vel.x, (-1)*otherBall.vel.y);
				console.log("-2other ändere Richtung");
			}
			if(225 >= degrees(diffBothVelHeading) && degrees(diffBothVelHeading) > 135) {
				this.vel = createVector((-1)*this.vel.x, (-1)*this.vel.y);
				console.log("-1this ändere Richtung");
				otherBall.vel = createVector((-1)*otherBall.vel.x, (-1)*otherBall.vel.y);
				console.log("0other ändere Richtung");
			}
			if(135 >= degrees(diffBothVelHeading) && degrees(diffBothVelHeading) > 45) {
				this.vel = createVector((-1)*this.vel.x, (-1)*this.vel.y);
				console.log("1this ändere Richtung");
				otherBall.vel = createVector((-1)*otherBall.vel.x, (-1)*otherBall.vel.y);
				console.log("2other ändere Richtung");
			}
			if(45 >= degrees(diffBothVelHeading) && degrees(diffBothVelHeading) > 45) {
				this.vel = createVector((-1)*this.vel.x, (-1)*this.vel.y);
				console.log("5this ändere Richtung");
				otherBall.vel = createVector((-1)*otherBall.vel.x, (-1)*otherBall.vel.y);
				console.log("6other ändere Richtung");
			}

			if(-0.1 <= degrees(diffBothVelHeading) && degrees(diffBothVelHeading) <= 45) {
				this.vel = createVector((-1)*this.vel.x, (-1)*this.vel.y);
				console.log("7this ändere Richtung");
				//otherBall.vel = createVector((-1)*otherBall.vel.x, (-1)*otherBall.vel.y);
				//console.log("4other ändere Richtung");

			}

			if(-135 >= degrees(diffBothVelHeading) && degrees(diffBothVelHeading) > 90) {
			//if(degrees(diffBothVelHeading) < -135 && degrees(diffBothVelHeading) > 90) {
				this.vel = createVector((-1)*this.vel.x, (-1)*this.vel.y);
				console.log("3this ändere Richtung");
				otherBall.vel = createVector((-1)*otherBall.vel.x, (-1)*otherBall.vel.y);
				console.log("4other ändere Richtung");
			}
			if(-45 <= degrees(diffBothVelHeading) && degrees(diffBothVelHeading) < -0.1) {
				//if()  hier noch die länge des vektors abfragen und dann entscheiden welcher ball reflektiert
					this.vel = createVector((-1)*this.vel.x, (-1)*this.vel.y);
					console.log("9this ändere Richtung");
					//otherBall.vel.rotate(-2*otherWink_Vel_oD);
					otherBall.vel.rotate(2*otherWink_Vel_oD);
					console.log("10 otherBall drehe 2x");
					//debugHit = true;
			}
			if(-360 <= degrees(diffBothVelHeading) && degrees(diffBothVelHeading) < -45) {
				this.vel = createVector((-1)*this.vel.x, (-1)*this.vel.y);
				console.log("11this ändere Richtung");
				otherBall.vel = createVector((-1)*otherBall.vel.x, (-1)*otherBall.vel.y);
				console.log("12other ändere Richtung");
			}

			if(-0.1 <= degrees(diffBothVelHeading) && degrees(diffBothVelHeading) <= -45) {
				this.vel = createVector((-1)*this.vel.x, (-1)*this.vel.y);
				console.log("13this ändere Richtung");
				//otherBall.vel = createVector((-1)*otherBall.vel.x, (-1)*otherBall.vel.y);
				//console.log("4other ändere Richtung");
			}

						// if(degrees(Wink_Vel_oD) < 90) {
			// 	if(degrees(Win_Vel_oB_Vel) < 90) {
			// 		this.vel = createVector((-1)*this.vel.x, (-1)*this.vel.y);
			// 		console.log("1this ändere Richtung");
			// 		} else {
			// 		this.vel = createVector(this.vel.x, this.vel.y);
			// 		console.log("2this Richtung bleibt");
			// 	}
			// } else {
			// 	if(degrees(Win_Vel_oB_Vel) > 90) {
			// 		this.vel = createVector((-1)*this.vel.x, (-1)*this.vel.y);
			// 		console.log("3this ändere Richtung");
			// 		} else {
			// 		this.vel = createVector(this.vel.x, this.vel.y);
			// 		console.log("4this Richtung bleibt");
			// 	}
			// }
			//otherBall
			// if(degrees(otherWink_Vel_oD) < 90) {
			// 	if(degrees(otherWin_Vel_oB_Vel) < 90) {
			// 		otherBall.vel = createVector((-1)*otherBall.vel.x, (-1)*otherBall.vel.y);
			// 		console.log("1other ändere Richtung");
			// 		} else {
			// 		//otherBall.vel = createVector(otherBall.vel.x, otherBall.vel.y);
			// 		console.log("2this Richtung bleibt");
			// 	}
			// 	} else {
			// 	if(degrees(otherWin_Vel_oB_Vel) > 90) {
			// 		otherBall.vel = createVector((-1)*otherBall.vel.x, (-1)*otherBall.vel.y);
			// 		console.log("3other ändere Richtung");
			// 		} else {
			// 		otherBall.vel = createVector(otherBall.vel.x, otherBall.vel.y);
			// 		console.log("4other Richtung bleibt");
			// 	}
			// 	if(degrees(otherWin_Vel_oB_Vel) > -45 && degrees(otherWin_Vel_oB_Vel) < 45) {
			// 		otherBall.vel = createVector((-1)*otherBall.vel.x, (-1)*otherBall.vel.y);
			// 		console.log("1otherBall ändere Richtung");
			// 		} else {
			// 		otherBall.vel = createVector(otherBall.vel.x, otherBall.vel.y);
			// 		console.log("2otherBall Richtung bleibt");
			// 	}
			// } else {
			// 	if(degrees(otherWin_Vel_oB_Vel) > -180 && degrees(otherWin_Vel_oB_Vel) < 180) {
			//
			// 		otherBall.vel = createVector(otherBall.vel.x, otherBall.vel.y);
			// 		console.log("3otherBall Richtung bleibt");
			// 	} else {
			// 		otherBall.vel = createVector((-1)*otherBall.vel.x, (-1)*otherBall.vel.y);
			// 		console.log("4otherBall ändere Richtung");
			// 	}
			// }

			push(); //senkrechte
				translate(this.pos.x, this.pos.y);
				translate(otherDirection.x/2, otherDirection.y/2);
				otherDirection.rotate(PI/2); //90°
				strokeWeight(2);
				stroke("white");
				line(-10*otherDirection.x, -10*otherDirection.y, otherDirection.x*10, otherDirection.y*10);
			pop();
			push(); //new vel pfeil
				translate(this.pos.x, this.pos.y);
				//console.log(this.vel + " <<new old>> "+ oldVel);
				translate(15*thisVelOld.x, 15*thisVelOld.y);
				drawArrow(thisVelOld, this.vel, "orange", 15);
			pop();
			push(); //new otherball vel pfeil
				translate(otherBall.pos.x, otherBall.pos.y);
				//console.log(this.vel + " <<new old>> "+ oldVel);
				translate(15*otherVelOld.x, 15*otherVelOld.y);
				drawArrow(thisVelOld, otherBall.vel, "green", 15);
			pop();

			//noLoop();
			this.show();
			otherBall.show();

			console.log("--------ENDE------");

			if(debugHit) {
				alert("");
			}



			}	else {
				// console.log("-->> NO HIT\n-------");
			}


		}

	}
