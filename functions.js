//VARIABLES
var rectangles
var width
var height
var widthMargin = -15
var heightMargin = -15
var initialised = false
var ageInput
var currentSelection

//MOUSE EVENTS -------------------------------------

var click = new Click(0,0,0,0,false)
click.singleClick = function() {
	if (!currentSelection.editing && !click.offRectangles) {
		currentSelection = currentSelection.array[click.arrayIndex]
		oldText = currentSelection.text
		currentSelection.editing = true
		createCardTextBox(currentSelection)

	} else if (currentSelection.editing 
			   && !click.inArea(width/2 - currentSelection.w/2, height/2 - currentSelection.h/2, 
			   	   				width/2 + currentSelection.w/2, height/2 + currentSelection.h/2)) {
		
		currentSelection.text = textbox.value()
		if (currentSelection.text !== oldText) {
			life.saveText()
		}
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

function mouseClicked() {
	if (initialised) {
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

//FUNCTIONS -------------------------------------

function keyPressed() {
	if (keyCode === 13) {
	}
}

function drawCard(card) {
	card.h = height*(3/4)
	card.w = (rectangles.rectW/rectangles.rectH)*card.h
	noFill()
	strokeWeight(2)
	stroke(card.stroke)
	rect(rectangles.x + rectangles.w/2 - card.w/2,rectangles.centreY - card.h/2,card.w,card.h)
	clock.position(rectangles.x + rectangles.w/2 - card.w/2,rectangles.centreY - card.h/2)
}

function createCardTextBox(card) {
	var cardH = height*(3/4)
	var cardW = (rectangles.rectW/rectangles.rectH)*cardH
	textbox = createElement("textarea")
	textbox.position(rectangles.x + rectangles.w/2 - cardW*0.9/2,rectangles.centreY - cardH*0.95/2)
	textbox.size(cardW*0.9,cardH*0.95)
	textbox.style("background","transparent")
	textbox.style("outline","none")
	textbox.style("border","none")
	textbox.style("fontsize")
	textbox.style("resize","none")
	if (card.stroke == 100) {
		textbox.style("color","grey")
	} else {
		textbox.style("color","white")
	}
	textbox.value(card.text)
}

//Initialisation
function initialise(){
	ageInput.remove()
	ageBox 
	document.getElementById("ageBox").remove()
	clock.initialise()

	//IMG INITIALISE
	img = createImg("plato.png")
	img.size(200,200*1.2427)
	img.position(50, height - 200*1.2427)
	img.style("pointer-events","none")
	img.style("-webkit-user-select", "none")
	img.style("opacity",0)

	life = new Life(2019 - ageInput.value())
	buildLife(life)
	currentSelection = life

	rectangles = new Rectangles(currentSelection,width/2,height/2)
	clock.positionByRectangles()
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

	if (initialised){
		drawRectangles(rectangles);

		if (currentSelection.editing) {
			currentSelection.text = textbox.value()
			textbox.remove()
			createCardTextBox(currentSelection)
		}
	}
}

function drawRectangles(rectangles) {
	clear();
	strokeWeight(rectangles.strokeWeight)
	noFill();
		for (let y of rectangles.array) {
			for (let x of y) {
				let globalX = x.x + rectangles.x
				let globalY = x.y + rectangles.y
				stroke(x.card.stroke)
				strokeWeight(rectangles.strokeWeight)
				fill(x.card.fill,x.card.alpha);
				rect(globalX,globalY,x.w,x.h)
				let nLines =  numberOfLines(x.card.text)
				let lineLimit = Math.ceil(nLines/2)
				if (lineLimit > 8) {
					lineLimit = 9
				}
				for (let i = 0; i < lineLimit; i++) {
					let lineY = globalY + x.h*0.15 + x.h*i/11
					let leftLineX = globalX + rectangles.strokeWeight + 0.2*(x.w - rectangles.strokeWeight*2)
					let rightLineX = globalX + rectangles.strokeWeight + 0.8*(x.w - rectangles.strokeWeight*2)
					
					if (x.card.current) {
						stroke(0)
					} else {
						stroke(x.card.stroke)
					}

					strokeWeight(rectangles.strokeWeight)
					strokeCap(SQUARE)
					line(globalX + 0.2*x.w,lineY,globalX + 0.8*x.w,lineY)
				}
		}
	}

	clock.positionByRectangles()
}

function numberOfLines(str) {
	var stringArray = str.split(/\r*\n/)
	for (let i = 0; i < stringArray.length; i++) {
		if (stringArray[i].search(/[A-z]/) == -1) {
			stringArray.splice(i,1)
			i--
		}
	}

	if (str.length/30 > stringArray.length) {
		return str.length/25
	} else {
		return stringArray.length
	}
}

// Trouble-shooting:

function Spam() {
	var str = "wefkjajnfkwjaenfkjwnkefjnawkjfnkjewankfjnlsknfkznilfeusnkfuesiufeznezileunsiuzfnswefkjajnfkwjaenfkjwnkefjnawkjfnkjewankfjnlsknfkznilfeusnkfuesiufeznezileunsiuzfnswefkjajnfkwjaenfkjwnkefjnawkjfnkjewankfjnlsknfkznilfeusnkfuesiufeznezileunsiuzfnswefkjajnfkwjaenfkjwnkefjnawkjfnkjewankfjnlsknfkznilfeusnkfuesiufeznezileunsiuzfnswefkjajnfkwjaenfkjwnkefjnawkjfnkjewankfjnlsknfkznilfeusnkfuesiufeznezileunsiuzfnswefkjajnfkwjaenfkjwnkefjnawkjfnkjewankfjnlsknfkznilfeusnkfuesiufeznezileunsiuzfnswefkjajnfkwjaenfkjwnkefjnawkjfnkjewankfjnlsknfkznilfeusnkfuesiufeznezileunsiuzfnswefkjajnfkwjaenfkjwnkefjnawkjfnkjewankfjnlsknfkznilfeusnkfuesiufeznezileunsiuzfns"

	for (var i of life.array) {
		for (var u of i.array) {
			for (var o of u.array) {
				o.text = str
			}
			u.text = str
		}
		i.text = str
	}
	life.saveText()
}
