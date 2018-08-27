class Playground {
	constructor(SpielfeldRand) {
		this.background = "#161618";
		this.a = 1;
		this.increment = 0.0040;
		this.r = 0;
		this.b = 0;
		this.g = 0;
		this.c = color(this.r, this.b, this.g);
		this.SpielfeldRand = SpielfeldRand;
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
		strokeWeight(this.SpielfeldRand);
		noFill();
		rectMode(CENTER);
		rect(width/2, height/2, width-SpielfeldRand, height-SpielfeldRand);
	}

	getColor() {
		return this.c;
	}
}
