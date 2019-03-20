
var rectangles
var width
var height
var running = false
var firstTime = true
var time
var hms = []
var viewfinderRatio
var ageInput


function setup() {

	ageInput = createInput()
	ageInput.parent("ageParent")
	ageInput.style("background","black")
	ageInput.style("color","white")
	ageInput.style("top","-30px")
	ageInput.changed(() => {initialise()})

	//MAIN GRAPHICS SET-UP
	width = windowWidth
	height = windowHeight
	createCanvas(width, height, WEBGL);
	background(0)
	cam = createCamera()
	cam.setPosition(0,0,(height/2)/tan(PI*27.5/180))
	ambientLight(255);
	graphics = createGraphics(width, height);

	rectangles = new Rectangles(64,20,40,10,10,width/2,height/2)
	viewfinderRatio = height/rectangles.h

	//CLOCK ELEMENT SET-UP
	updateTime()

	//INITIALISE FIRST FRAME

	drawRectangleTexture();
	plane(width,height);

	clock = createSpan(hms[0] + ":" + hms[1] + ":" + hms[2])
	clock.style("font-size", "40px")
	clock.position(rectangles.x + clock.size().width*0.06, rectangles.y - clock.size().height*0.5-20)

	if (firstTime) {
		fill(0);
		plane(width,height);
		clock.style("color","black")
	}
}


function draw() {

	//UPDATE TIME HTML
	updateTime()

	clock.html(hms[0] + ":" + hms[1] + ":" + hms[2])


	//MAIN DRAWING LOOP
	if (running & !firstTime) {

		background(0)
		
		drawRectangleTexture();

		rotateByMouse()

		plane(width,height);
	}
}



//FUNCTIONS:

function initialise(){
	if (firstTime & !isNaN(ageInput.value())) {
		firstTime = !firstTime
		ageInput.remove()
		document.getElementById("ageBox").remove()
		clock.style("color","white")
		rectangles = new Rectangles(ageInput.value(),20,40,10,10,width/2,height/2)
	}
}

function windowResized() {

	//UPDATE DIMENSIONS
	width = windowWidth-3;
	height = windowHeight-3;

	//RESIZES CANVAS & RECTANGLES
	resizeCanvas(width,height);
	graphics = createGraphics(width, height);
	graphics.background(0);

	rectangles.x = width/2 - rectangles.w/2
	rectangles.y = height/2 - rectangles.h/2

	drawRectangleTexture();

	if (!firstTime){
		plane(width,height);
	}

	cam.setPosition(0,0,(height/2)/tan(PI*27.5/180))

	//UPDATES CLOCK POSITION
	clock.position(rectangles.x + clock.size().width*0.06, rectangles.y - clock.size().height*0.5-20);
}

function startUp() {
	let entryText = createP("TEST")
	entryText.position(width/2, height/2)
}

function mousePressed() {

	if (!running) {
		running = !running
	}
}

function zoom() {

	xOffset = rectangles.array[0][0].x + rectangles.array[0][0].w/2 + rectangles.x - rectangles.centreX
	yOffset = rectangles.array[0][0].y + rectangles.array[0][0].h/2 + rectangles.y - rectangles.centreY

	cam.setPosition(xOffset,yOffset,(viewfinderRatio*rectangles.rectH/2)/tan(PI*30/180))

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

function drawRectangleTexture() {
	graphics.clear();
	graphics.stroke(255);
	graphics.strokeWeight(2)
	graphics.noFill();
	for (let y of rectangles.array) {
		for (let x of y) {
			graphics.rect(x.x + rectangles.x,x.y + rectangles.y,x.w,x.h)
		}
	}

	texture(graphics);
}

function rotateByMouse() {
	var yAngle = map(mouseX - width/2, -width/2, width/2, -PI/30, PI/30)
	var xAngle = -map(mouseY - height/2, -height/2, height/2, -PI/30, PI/30)

	rotateY(yAngle);
	rotateX(xAngle);
}