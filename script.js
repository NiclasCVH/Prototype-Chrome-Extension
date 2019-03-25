/* To-do list:

3. Create simple card editing
4. Build data saving feature
5. Re-introduce 3d features and graphic touch-ups

 */

var rectangles
var width
var height
var widthMargin = -15
var heightMargin = -15
var running = false
var firstTime = true
var time
var hms = []
var ageInput
var currentSelection

var life

function setup() {

	ageInput = createInput()
	ageInput.parent("ageParent")
	ageInput.style("background","black")
	ageInput.style("color","white")
	ageInput.changed(() => {initialise()})

	//MAIN GRAPHICS SET-UP
	width = window.innerWidth + widthMargin
	height = window.innerHeight + heightMargin
	createCanvas(width, height);
	background(0)

	// rectangles = new Rectangles(0,20,40,10,10,width/2,height/2)

	//CLOCK ELEMENT SET-UP
	updateTime()

	//INITIALISE FIRST FRAME

	// drawRectangles(rectangles)

	clock = createSpan(hms[0] + ":" + hms[1] + ":" + hms[2])
	clock.style("font-size", "40px")
	clock.style("color","white")
	clock.position(0,0)

	if (firstTime) {
		fill(0);
		clock.style("opacity","0")
	}
}


function draw() {

	//UPDATE TIME HTML
	updateTime()

	clock.html(hms[0] + ":" + hms[1] + ":" + hms[2])


	//MAIN DRAWING LOOP
	if (running & !firstTime) {

		background(0)
		drawRectangles(rectangles);
	}
}



//FUNCTIONS:

function mouseClicked(){
	if (!firstTime) {
		var h = rectangles.h;
		var w = rectangles.w;
		var x = rectangles.x;
		var y = rectangles.y;
		var localX
		var localY
		var colNum
		var rowNum

		if (mouseX > x && mouseX < x + w 
			&& mouseY > y && mouseY < y + h) {

			localX = mouseX - x
			localY = mouseY - y

			colIndex = ceilMultiple(localX, rectangles.rectW + rectangles.padding) - 1
			rowIndex = ceilMultiple(localY, rectangles.rectH + rectangles.padding) - 1

			if (localX < (colIndex + 1)*rectangles.rectW + colIndex*rectangles.padding &&
				localY < (rowIndex + 1)*rectangles.rectH + rowIndex*rectangles.padding) {
				let index = colIndex + rowIndex*rectangles.maxCol
				
				// console.log(index)
				console.log(currentSelection.array[index].age)

				if (currentSelection.id !== "month") {
					currentSelection = currentSelection.array[index]

					rectangles = new Rectangles(currentSelection,width/2,height/2)
					clock.position(rectangles.x, rectangles.y - clock.size().height)
				}
			}
		} else if (currentSelection.id !== "life") {
				currentSelection = currentSelection.parent

				rectangles = new Rectangles(currentSelection,width/2,height/2)
				clock.position(rectangles.x, rectangles.y - clock.size().height)
		}
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

function initialise(){
	if (firstTime & !isNaN(ageInput.value())) {
		firstTime = !firstTime
		ageInput.remove()
		document.getElementById("ageBox").remove()

		life = new Life(ageInput.value())
		buildLife(life)
		currentSelection = life

		rectangles = new Rectangles(currentSelection,width/2,height/2)
		clock.style("opacity","1")
		clock.position(rectangles.x, rectangles.y - clock.size().height)
	}
}

function windowResized() {

	//UPDATE DIMENSIONS
	width = window.innerWidth + widthMargin;
	height = window.innerHeight + heightMargin;

	//RESIZES CANVAS & RECTANGLES
	resizeCanvas(width,height);
	background(0);

	rectangles.x = width/2 - rectangles.w/2
	rectangles.y = height/2 - rectangles.h/2

	if (!firstTime){
		drawRectangles(rectangles);
	}

	//UPDATES CLOCK POSITION
	clock.position(rectangles.x, rectangles.y - clock.size().height);
}


function mousePressed() {

	if (!running) {
		running = !running
	}
}

function updateTime() {
	time = new Date()

	hms[0] = time.getHours().toString()
	hms[1] = time.getMinutes().toString()
	hms[2] = time.getSeconds().toString()

	hms = hms.map( (t) => {

		if (t.length == 1) {
			return ("0" + t)
		} else {
			return t
		}

	})

}

function drawRectangles(rectangles) {
	clear();
	strokeWeight(2)
	noFill();
		for (let y of rectangles.array) {
			for (let x of y) {
			stroke(x.card.stroke)
			fill(x.card.fill,x.card.alpha);
			rect(x.x + rectangles.x,x.y + rectangles.y,x.w,x.h)
			}
		}
	}