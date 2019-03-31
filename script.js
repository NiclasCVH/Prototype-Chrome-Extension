/* To-do list:

3. Create simple card editing
	c. navigation level indicators for card text content
	d. simple color editing
4. Build cross-session data saving feature
5. Re-introduce 3d features and graphic touch-ups

 */


var rectangles
var width
var height
var widthMargin = -15
var heightMargin = -15
var running = false
var firstTime = true
var ageInput
var currentSelection
var life
var cardEditing = false
var rectanglesX0
var rectanglesY0


//MOUSE EVENTS -------------------------------------

var click = new Click(0,0,0,0,false)
click.singleClick = function() {
	if (!currentSelection.editing && !click.offRectangles) {

		currentSelection = currentSelection.array[click.arrayIndex]
		currentSelection.editing = true
		createCardTextBox(currentSelection)

	} else if (currentSelection.editing 
			   && !click.inArea(width/2 - currentSelection.w/2, height/2 - currentSelection.h/2, 
			   	   				width/2 + currentSelection.w/2, height/2 + currentSelection.h/2)) {

		currentSelection.text = textbox.value()
		textbox.remove()
		currentSelection.editing = false
		currentSelection = currentSelection.parent

	}
}

click.doubleClick = function() {
	if (!currentSelection.editing) {
		if (click.offRectangles && currentSelection.id !== "life") {
			currentSelection = currentSelection.parent

			rectangles = new Rectangles(currentSelection,width/2,height/2)
		}

		if (!click.offRectangles && !click.offArray && currentSelection.id !== "month") {
			currentSelection = currentSelection.array[click.arrayIndex]

			rectangles = new Rectangles(currentSelection,width/2,height/2)
		}
	}
}


//DRAWING -------------------------------------

var clock = new Clock()

function setup() {

	//FIRST-TIME HTML SET-UP
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

	//INITIALISE FIRST FRAME
	clock.initialise()

	if (firstTime) {
		fill(0);
		clock.span.style("opacity","0")
	}
}

function draw() {

	//MOUSE-TIMING
	if (click.active) {
		click.timeElapsed = (new Date()).getTime() - click.startTime
		if (click.timeElapsed > 250) {
			click.singleClick()
			click.timeElapsed = 0
			click.active = false
		}
	}

	//UPDATE CLOCK
	clock.draw()

	//MAIN DRAWING LOOP
	if (running && !firstTime) {
		
		background(0)

		if (!currentSelection.editing) {
			drawRectangles(rectangles);
		} else {
			drawCard(currentSelection)
		}
	}
}


//FUNCTIONS -------------------------------------

//Mouse & navigation
function mouseClicked() {
	if (!firstTime) {
		if (!click.active) {
			click.x = mouseX
			click.y = mouseY
			click.clickedRectangles()
			click.startTime = (new Date()).getTime()
			click.active = true
		} else {
			click.doubleClick()
			click.active = false
			click.timeElapsed = 0
		}
	}
}

function selectCard() {
	
}

function drawCard(card) {
	card.h = height*(3/4)
	card.w = (rectangles.rectW/rectangles.rectH)*card.h
	noFill()
	strokeWeight(2)
	stroke(255)
	rect(rectangles.x + rectangles.w/2 - card.w/2,rectangles.centreY - card.h/2,card.w,card.h)
	clock.position(rectangles.x + rectangles.w/2 - card.w/2,rectangles.centreY - card.h/2)
}

function createCardTextBox(card) {
	var cardH = height*(3/4)
	var cardW = (rectangles.rectW/rectangles.rectH)*cardH
	textbox = createElement("textarea")
	textbox.position(rectangles.x + rectangles.w/2 - cardW/2,rectangles.centreY - cardH/2)
	textbox.size(cardW,cardH)
	textbox.style("background","transparent")
	textbox.style("outline","none")
	textbox.style("border","none")
	textbox.style("fontsize")
	textbox.style("color","white")
	textbox.value(card.text)
}

function mousePressed() {
	if (!running) {
		running = !running
	}
}

//Initialisation
function initialise(){
	if (firstTime & !isNaN(ageInput.value())) {
		firstTime = !firstTime
		ageInput.remove()
		document.getElementById("ageBox").remove()

		life = new Life(ageInput.value())
		buildLife(life)
		currentSelection = life

		rectangles = new Rectangles(currentSelection,width/2,height/2)
		clock.span.style("opacity","1")
		clock.positionByRectangles()

		rectanglesX0 = rectangles.x
		rectanglesY0 = rectangles.y
	}
}

//Drawing
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
}

function drawRectangles(rectangles) {
	clear();
	strokeWeight(rectangles.strokeWeight)
	noFill();
		for (let y of rectangles.array) {
			for (let x of y) {
				stroke(x.card.stroke)
				fill(x.card.fill,x.card.alpha);
				rect(x.x + rectangles.x,x.y + rectangles.y,x.w,x.h)
		}
	}

	clock.positionByRectangles()
}
