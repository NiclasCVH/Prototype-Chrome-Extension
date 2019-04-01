//MOUSE CLASS
class Click {
	constructor(storedX, storedY, startTime,timeElapsed, active) {
		this.x = storedX
		this.y = storedY
		this.startTime = startTime
		this.timeElapsed
		this.active
		this.arrayIndex
		this.colIndex
		this.rowIndex
		this.offRectangles
		this.offArray
	}

	singleClick(){}
	doubleClick(){}

	clickedRectangles() {
		var h = rectangles.h;
		var w = rectangles.w;
		var x = rectangles.x;
		var y = rectangles.y;

		if (this.x > x && this.x < x + w 
			&& this.y > y && this.y < y + h) {

			this.offRectangles = false

			var localX = this.x - x
			var localY = this.y - y

			var colIndex = ceilMultiple(localX, rectangles.rectW + rectangles.padding) - 1
			var rowIndex = ceilMultiple(localY, rectangles.rectH + rectangles.padding) - 1

			if (localX < (colIndex + 1)*rectangles.rectW + colIndex*rectangles.padding &&
				localY < (rowIndex + 1)*rectangles.rectH + rowIndex*rectangles.padding) {
				this.offArray = false
				this.arrayIndex = colIndex + rowIndex*rectangles.maxCol
				this.colIndex = colIndex
				this.rowIndex = rowIndex
			} else { this.offArray = true }
		} else {
			this.offRectangles = true
		}
	}

	inArea(x0,y0,x1,y1) {
		if (this.x > x0 && this.x < x1
			&& this.y > y0 && this.y < y1) {
			return true
		} else {
			return false
		}
	}
}


//DATE CLASSES & FUNCTIONS

class Card {
	constructor(value, id, parent, date) {
		this.id = id
		this.parent = parent
		this.array = []
		this.value = value

		if (this.id == "month") {
			this.date = date
		}

		if (this.id == "year") {
			this.age = this. value - this.parent.birthYear
		}

		this.current = false
		this.fill = 0
		this.alpha = 0
		this.stroke = 255

		this.editing = false
		this.text = ""
		this.h
		this.w
	}

	buildChild(value, id, index, date) {
		this.array[index] = new Card(value, id, this, date)
	}
}

class Life {
	constructor(birthYear) {
		this.array = []
		this.id = "life"
		this.birthYear = birthYear

		for (let n = 0; n < 80; n++) {
			this.array[n] = new Card(birthYear + n, "year", this)
		
		this.editing = false
		}
	}

	saveText() {
		var savedLife = []
		savedLife[0] = this.birthYear
		savedLife[1] = []
		for (let a = 0; a < this.array.length; a++) {
			let year = this.array[a]
			savedLife[1][a] = [year.text,[]]
			for (let b = 0; b < 12; b++) {
				let month = year.array[b]
				savedLife[1][a][1][b] = [month.text,[]]
				for (let c = 0; c < month.array.length; c++) {
					let day = month.array[c]
					savedLife[1][a][1][b][1][c] = [day.text]
				}
			}
		}

		chrome.storage.local.set({"life": savedLife}, () => {console.log("saved")})
	}

	loadText(savedLife) {
		this.birthYear = savedLife[0]
		for (let a = 0; a < savedLife[1].length; a++) {
			this.array[a].text = savedLife[1][a][0]
			for (let b = 0; b < 12; b++) {
				this.array[a].array[b].text = savedLife[1][a][1][b][0]
				for (let c = 0; c < savedLife[1][b][1].length; c++) {
					this.array[a].array[b].array[c].text = savedLife[1][a][1][b][1][c][0]
				}
			}
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
	updateColors(life)
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

function updateColors(life) {

	//CURRENT COLORING
	var pastCurrent = false
	var currentYearIndex
	var currentMonthIndex

	for (let year of life.array) {

		if (year.age > 75) {
			year.stroke = 255 - (year.age - 75)*51
		}

		if (year.current) {
			year.fill = 255
			year.alpha = 255
			pastCurrent = true
			currentYearIndex = life.array.indexOf(year)
		} else if (!pastCurrent) {
			year.stroke = 100
		}
	}

	for (let i = 0; i < currentYearIndex; i++) {
		for (let month of life.array[i].array) {
			month.stroke = 100
			for (let day of month.array) {
				day.stroke = 100
			}
		}
	}

	pastCurrent = false
	for (let month of life.array[currentYearIndex].array) {
		if (month.current) {
			month.fill = 255
			month.alpha = 255
			pastCurrent = true
			currentMonthIndex = life.array[currentYearIndex].array.indexOf(month)
		} else if (!pastCurrent) {
			month.stroke = 100
		}
	}

	for (let i = 0; i < currentMonthIndex; i++) {
		for (let day of life.array[currentYearIndex].array[i].array) {
			day.stroke = 100
		}
	}

	pastCurrent = false
	for (let day of life.array[currentYearIndex].array[currentMonthIndex].array) {
		if (day.current) {
			day.fill = 255
			day.alpha = 255
			pastCurrent = true
		} else if (!pastCurrent) {
			day.stroke = 100
		}
	}

	pastCurrent = false
}

function daysInMonth(month,year) {
	return new Date(year, month, 0).getDate();
}

function firstDayofMonth(month,year) {
	return new Date(year,month - 1,1).getDay()
}


//DRAWING CLASSES

class Clock {
	constructor() {
		this.span
		this.time
		this.hms = []

	}

	initialise() {
		this.updateTime()
		this.span = createSpan(this.hms[0] + ":" + this.hms[1] + ":" + this.hms[2])
		this.span.style("font-size", "40px")
		this.span.style("color","white")
		this.span.position(0,0)
	}

	updateTime() {
		this.time = new Date()

		this.hms[0] = this.time.getHours().toString()
		this.hms[1] = this.time.getMinutes().toString()
		this.hms[2] = this.time.getSeconds().toString()

		this.hms = this.hms.map( (t) => {

			if (t.length == 1) {
				return ("0" + t)
			} else {
				return t
			}

		})
	}

	draw() {
		this.updateTime()
		this.span.html(this.hms[0] + ":" + this.hms[1] + ":" + this.hms[2])
	}

	positionByRectangles() {
		clock.span.position(rectangles.x, rectangles.y - clock.span.size().height);
	}

	position(x,y) {
		clock.span.position(x, y - clock.span.size().height);
	}
}

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
			this.strokeWeight = 1
		} else if (id == "year") {
			this.maxCol = 3
			this.rectW = 40;
			this.rectH = 80;
			this.padding = 20;
			this.strokeWeight = 1.5
		} else if (id == "month") {
			this.maxCol = 7
			this.rectW = 20;
			this.rectH = 40;
			this.padding = 10;
			this.strokeWeight = 1
		} else {
			this.maxCol = 10
		}

		this.maxRow = ceil(this.rectNum/this.maxCol);
		this.lastRow = this.maxCol*(1 - this.maxRow) + this.rectNum;
		this.xSpacing = this.rectW + this.padding;
		this.ySpacing = this.rectH + this.padding
		this.w = max(this.lastRow,this.maxCol)*this.xSpacing;
		this.h = (this.maxRow)*this.ySpacing;
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
				if (cardSelect.current) {
					cardSelect.fill = 255
					cardSelect.alpha = 255
					pastCurrent = true
				} else if (!pastCurrent && (cardSelect.parent.current || cardSelect.parent.id == "life")) {
					cardSelect.stroke = 100
				} else if (cardSelect == "year" & cardSelect.age > 75) {
					cardSelect.stroke = 255 - (cardSelect.age - 75)*51
				}
			}
		}

		array[this.maxRow - 1] = [];
		for (let x = 0; x < this.lastRow; x++) {
			let cardSelect = currentSelection.array[x+(this.maxRow - 1)*this.maxCol]
			array[this.maxRow - 1][x] = new Rectangle(x*this.xSpacing, (this.maxRow - 1)*this.ySpacing, this.rectW, this.rectH, cardSelect)
				if (cardSelect.current) {
					cardSelect.fill = 255
					cardSelect.alpha = 255
					pastCurrent = true
				} else if (!pastCurrent && (cardSelect.parent.current || cardSelect.parent.id == "life")) {
					cardSelect.stroke = 100
				} else if (cardSelect.id == "year" && cardSelect.age > 75) {
					cardSelect.stroke = 255 - (cardSelect.age - 75)*51
				}
		}

		this.array = array;
	}
}

function ceilMultiple(n,multiple) {
	if ( n > 0 ){
		return Math.ceil(n/multiple)
	 } else if ( n < 0) {
	 	return Math.floor(n/multiple)
	 } else {
	 	return 1
	 }
}