class Rectangle {
	constructor(x,y,w,h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h
	}
}

function Rectangles(rNum,rectW,rectH,pad,maxR,x,y) {
	this.rectNum = rNum;
	this.rectW = rectW;
	this.rectH = rectH;
	this.padding = pad;
	this.maxRow = maxR;
	this.maxCol = ceil(this.rectNum/this.maxRow);
	this.lastRow = this.maxRow*(1 - this.maxCol) + this.rectNum;
	this.xSpacing = this.rectW + this.padding;
	this.ySpacing = this.rectH + this.padding
	this.w = max(this.lastRow,this.maxRow)*this.xSpacing;
	this.h = this.maxCol*this.ySpacing;
	this.centreX = x
	this.centreY = y
	this.x = x - this.w/2;
	this.y = y - this.h/2

	var array = [];

	for (let y = 0; y < this.maxCol - 1; y++) {
		array[y] = []

		for (let x = 0; x < this.maxRow; x++) {
			array[y][x] = new Rectangle(x*this.xSpacing, y*this.ySpacing, this.rectW, this.rectH)
		}
	}

	array[this.maxCol -1] = [];
	for (let x = 0; x < this.lastRow; x++) {
		array[this.maxCol -1][x] = new Rectangle(x*this.xSpacing, (this.maxCol - 1)*this.ySpacing, this.rectW, this.rectH)
	}

	this.array = array;
}