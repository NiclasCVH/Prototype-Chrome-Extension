//DATE CLASSES & FUNCTIONS

class Card {
	constructor(value, id, parent, value2) {
		this.value = value

		if (typeof value2 === "undefined") {
			this.value2 = null
		} else {
			this.value2 = value2
		}

		this.current = false
		this.id = id
		this.parent = parent
		this.array = []
		this.fill = 0
		this.alpha = 0
		this.stroke = 255
	}

	buildChild(value, id, index, value2) {
		this.array[index] = new Card(value, id, this, value2)
	}
}

class Life {
	constructor(age) {
		this.array = []
		this.id = "life"

		var today = new Date()
		var yearToday = today.getYear() + 1900
		var birthYear = yearToday - age
		this.birthYear = birthYear

		for (let n = 0; n < 80; n++) {
			this.array[n] = new Card(birthYear + n, "year", this)
		}
	}
}

function buildLife(life) {
	for (let year of life.array) {
		
		for (let n = 0; n < 12; n++) {
			
			year.buildChild(n + 1, "month", n)
			
			for (let month of year.array) {

				var numDays = daysInMonth(month.value,year.value)
				var dayIndex = firstDayofMonth(month.value,year.value)
				
				for (let m = 0; m < daysInMonth(month.value,year.value); m++) {
					
					if (dayIndex == 7) {
						dayIndex = 0
					}
					
					month.buildChild(m + 1, "day", m, dayIndex)
					dayIndex++
				}
			}
		}
	}

	assignCurrent(life)
}

function assignCurrent(life) {
	var today = new Date()
	var currentYear = today.getYear() + 1900
	var birthYear = life.birthYear
	var yearIndex = currentYear - birthYear
	var monthIndex = today.getMonth()
	var dateIndex = today.getDate() - 1

	life.array[yearIndex].current = true
	life.array[yearIndex].array[monthIndex].current = true
	life.array[yearIndex].array[monthIndex].array[dateIndex].current = true
}

function daysInMonth(month,year) {
	return new Date(year, month, 0).getDate();
}

function firstDayofMonth(month,year) {
	return new Date(year,month - 1,1).getDay()
}


//DRAWING CLASSES

class Rectangle {
	constructor(x,y,w,h,card) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.card = card
	}
}

class Rectangles {
	constructor(currentSelection,x,y) {
		this.rectNum = currentSelection.array.length;

		var id = currentSelection.id

		if (id == "life") {
			this.maxCol = 10
			this.rectW = 20;
			this.rectH = 40;
			this.padding = 10;
		} else if (id == "year") {
			this.maxCol = 3
			this.rectW = 40;
			this.rectH = 80;
			this.padding = 20;
		} else if (id == "month") {
			this.maxCol = 7
			this.rectW = 20;
			this.rectH = 40;
			this.padding = 10;
		} else {
			this.maxCol = 10
		}

		this.maxRow = ceil(this.rectNum/this.maxCol);
		this.lastRow = this.maxCol*(1 - this.maxRow) + this.rectNum;
		this.xSpacing = this.rectW + this.padding;
		this.ySpacing = this.rectH + this.padding
		this.w = max(this.lastRow,this.maxCol)*this.xSpacing;
		this.h = this.maxRow*this.ySpacing;
		this.centreX = x
		this.centreY = y
		this.x = x - this.w/2
		this.y = y - this.h/2

		var array = [];

		var pastCurrent = false

		for (let y = 0; y < this.maxRow - 1; y++) {
			array[y] = []
			for (let x = 0; x < this.maxCol; x++) {
				let cardSelect = currentSelection.array[x+y*this.maxCol]
				array[y][x] = new Rectangle(x*this.xSpacing, y*this.ySpacing, this.rectW, this.rectH, cardSelect)
				let rectSelect = array[y][x]
				if (cardSelect.current) {
					cardSelect.fill = 255
					cardSelect.alpha = 255
					pastCurrent = true
				} else if (!pastCurrent && (cardSelect.parent.current || cardSelect.parent.id == "life")) {
					cardSelect.stroke = 100
				}
			}
		}

		array[this.maxRow -1] = [];
		for (let x = 0; x < this.lastRow; x++) {
			let cardSelect = currentSelection.array[x+(this.maxRow-1)*this.maxCol]
			array[this.maxRow -1][x] = new Rectangle(x*this.xSpacing, (this.maxRow - 1)*this.ySpacing, this.rectW, this.rectH,cardSelect)
			let rectSelect = array[this.maxRow - 1][x]
				if (cardSelect.current) {
					cardSelect.fill = 255
					cardSelect.alpha = 255
				}
		}

		this.array = array;
	}
}