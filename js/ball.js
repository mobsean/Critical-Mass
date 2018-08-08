
class Ball {
  constructor(pos, vel, d, c, points) {
		this.pos = pos;
		this.vel = vel;
		this.d = d;
    this.InitialD = d;
		this.c = c;
		this.mass = d^2 * PI/4;
		this.filled = true;
    this.showPoint = false;
    this.points = points;
    if(this.vel.mag() == 0) {
      this.stopped = true;
    } else {
      this.stopped = false;
    }
    this.freezeTime = 1.5*60;
    this.StartdisappearTime = 0;                  //is a function of this.points set in stopMoving()
    this.disappearTime = this.StartdisappearTime; //is a function of this.points set in stopMoving()
  }

  update() {
		this.reflect();
		this.pos.add(this.vel);
  }

  show() {
		strokeWeight(0.0);
    fill(this.c);
		ellipse(this.pos.x, this.pos.y, this.d);
    this.showPoints();
  }

  disappear(i) {
    if(!this.isMoving()) {
      this.freezeTime = this.freezeTime - 1;
      if (this.freezeTime < 0) {
        this.d = map(this.disappearTime, this.StartdisappearTime, 0, 2 * dmax, 0);
        this.disappearTime = this.disappearTime - 1;
        if(this.d < 0) {
           balls.splice(i, 1);  //remove this.ball from array
        }
      }
    }
  }

  setPoints(p) {
    this.points = p;
  }
  getPoints() {
    return this.points;
  }

  togglePoints() {
    if(this.showPoint == false) {
      this.showPoint = true;
    } else {
      this.showPoint = false;
    }
  }

	showPoints() {
    if(this.showPoint == true) {
      push();
      translate(this.pos.x, this.pos.y);
      strokeWeight(0.1);
      stroke("white");
      fill("white");
      textAlign(CENTER);
      textSize(15);
      text(this.points, 0, 15/2);
      pop();
    }
	}

	swapColor(otherBall) {
    if(this.isMoving() && otherBall.isMoving()) {
      var tmpColor = this.c;
  		this.c = otherBall.c;
  		otherBall.c = tmpColor;
    }

	}

	reflect() {
    var multiplier = 1;
    //wand in +x richtung
		if(this.pos.x+this.d/2 > width - SpielfeldRand) {
			this.pos.x = width - this.d/2 - SpielfeldRand;
			this.vel.x = this.vel.x * (-1);
      this.vel.mult(multiplier);
      this.c = spielfeld.getColor();
		}
		//wand in -x richtung
		if(this.pos.x-this.d/2 < SpielfeldRand) {
			this.pos.x = this.d/2 + SpielfeldRand;
			this.vel.x = this.vel.x * (-1);
      this.vel.mult(multiplier);
			this.c = spielfeld.getColor();
		}
		//wand in +y richtung
		if(this.pos.y+this.d/2 > height - SpielfeldRand) {
			this.pos.y = height - this.d/2 - SpielfeldRand;
			this.vel.y = this.vel.y * (-1);
      this.vel.mult(multiplier);
			this.c = spielfeld.getColor();
		}
		//wand in -y richtung
		if(this.pos.y-this.d/2 < SpielfeldRand) {
			this.pos.y = this.d/2 + SpielfeldRand;
			this.vel.y = this.vel.y * (-1);
      this.vel.mult(multiplier);
			this.c = spielfeld.getColor();
		}
    this.vel.limit(dmin*0.2);

	}

  isHere(x,y) {
    var abstand = dist(this.pos.x, this.pos.y, x, y);
		if(abstand <= this.d/2) {
			return true;
		}	else {
			return false;
		}
  }

  isMoving(){
      if(this.stopped == false && this.vel.mag() > 0)
      {
        return true;
      } else {
        this.stopMoving();
        return false;
      }
  }

  stopMoving() {
    this.vel.x = 0;
    this.vel.y = 0;
    this.showPoint = true;
    this.stopped = true;
    if (this.freezeTime > 0) {
      this.d = 2 * dmax;
      this.StartdisappearTime = 60 * (log(50000/this.points)+2);
      this.disappearTime = this.StartdisappearTime;
    }
  }

  increaseVel(factor) {
    this.vel.mult(factor);
    this.vel.limit(dmin*2);
  }

	touches(otherBall) {
	//this.ball gegen andere bälle. this and otherBall drehen sich entsprechend
		var abstand = dist(this.pos.x, this.pos.y, otherBall.pos.x, otherBall.pos.y);
		if(abstand >0 && abstand <= this.d/2+otherBall.d/2) {
			return true;
		}	else {
			return false;
		}
	}

	decideCollision(otherBall) {
    if(!this.stopped) {
      //console.log("Treffer von " + this.name + " an " + otherBall.name);
  		var otherDirection = createVector(otherBall.pos.x, otherBall.pos.y).sub(this.pos); //Vektor von this. zu otherBall.


  		//stecken Bälle ineinander werden sie entlang otherDirection verschoben, damit sie nicht mehr in ineinander stecken
  		// https://processing.org/examples/circlecollision.html
  		var minDistance = this.d/2 + otherBall.d/2;
  		var distanceVectMag = otherDirection.mag();
  		var distanceCorrection = (minDistance-distanceVectMag)/2.0;
  		var corrVec = otherDirection.copy();
  		var correctionVector = corrVec.normalize().mult(distanceCorrection);
  		otherBall.pos.add(correctionVector);
  		this.pos.sub(correctionVector);
  		var otherDirection = createVector(otherBall.pos.x, otherBall.pos.y).sub(this.pos);

  		// https://processing.org/examples/circlecollision.html
  		// get angle of distanceVect
  		var theta  = otherDirection.heading();
  		// precalculate trig values
  		var sine = sin(theta);
  		var cosine = cos(theta);
  		var bTmp = [];
  		bTmp[0] = createVector(this.pos.x, this.pos.y);
  		bTmp[0].x = 0;
  		bTmp[0].y = 0;
  		bTmp[1] = createVector(0,0);
  		bTmp[1].x  = cosine * otherDirection.x + sine * otherDirection.y;
      bTmp[1].y  = cosine * otherDirection.y - sine * otherDirection.x;

  		var vTmp = [];
  		vTmp[0] = createVector(0,0);
  		vTmp[0].x  = cosine * this.vel.x + sine * this.vel.y;
      vTmp[0].y  = cosine * this.vel.y - sine * this.vel.x;
  		vTmp[1] = createVector(0,0);
      vTmp[1].x  = cosine * otherBall.vel.x + sine * otherBall.vel.y;
      vTmp[1].y  = cosine * otherBall.vel.y - sine * otherBall.vel.x;
  		// console.log(vTmp);

  		/* Now that velocities are rotated, you can use 1D
  	   conservation of momentum equations to calculate
  	   the final velocity along the x-axis. */
  	  var vFinal = [];
  		vFinal[0] = createVector(0,0);
  		vFinal[1] = createVector(0,0);
  	  // final rotated velocity for b[0]

  	  vFinal[0].x = ((this.mass - otherBall.mass) * vTmp[0].x + 2 * otherBall.mass * vTmp[1].x) / (this.mass + otherBall.mass);
  	  vFinal[0].y = vTmp[0].y;

  	  // final rotated velocity for b[1]
  	  vFinal[1].x = ((otherBall.mass - this.mass) * vTmp[1].x + 2 * this.mass * vTmp[0].x) / (this.mass + otherBall.mass);
  	  vFinal[1].y = vTmp[1].y;

  		// hack to avoid clumping
      bTmp[0].x += vFinal[0].x;
      bTmp[1].x += vFinal[1].x;

  		/* Rotate ball positions and velocities back
       Reverse signs in trig expressions to rotate
       in the opposite direction */
      // rotate balls
  		var bFinal = [];
  		bFinal[0] = createVector(0,0);
  		bFinal[1] = createVector(0,0);

      bFinal[0].x = cosine * bTmp[0].x - sine * bTmp[0].y;
      bFinal[0].y = cosine * bTmp[0].y + sine * bTmp[0].x;
      bFinal[1].x = cosine * bTmp[1].x - sine * bTmp[1].y;
      bFinal[1].y = cosine * bTmp[1].y + sine * bTmp[1].x;

  		// otherBall.pos.x = this.pos.x + bFinal[1].x;
      // otherBall.pos.y = this.pos.y + bFinal[1].y;
  		//
  		// this.pos.add(bFinal[0]);

  		// update velocities
      this.vel.x = cosine * vFinal[0].x - sine * vFinal[0].y;
      this.vel.y = cosine * vFinal[0].y + sine * vFinal[0].x;
      otherBall.vel.x = cosine * vFinal[1].x - sine * vFinal[1].y;
      otherBall.vel.y = cosine * vFinal[1].y + sine * vFinal[1].x;
    }
	}
}
