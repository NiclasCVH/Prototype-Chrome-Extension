/* To-do list:

3. Finish simple card editing
	c. navigation level indicators for card text content
	d. simple color editing
4. Finish saving features
	a. rebuild start-up loop
	b. automate saving, keyed to events
5. Re-introduce 3d features and graphic touch-ups

 */
var load = false

var clock = new Clock()

function setup() {

	//MAIN GRAPHICS SET-UP
	width = window.innerWidth + widthMargin
	height = window.innerHeight + heightMargin
	createCanvas(width, height);
	background(0)

	//INITIALISE FIRST FRAME
	clock.initialise()

	//PICTURE INSERT
	img = createImg("plato.png")
	img.size(200,200*1.2427)
	img.position(0, height - 200*1.2427)
	img.style("pointer-events","none")
	img.style("opacity",0)

	chrome.storage.local.get("life",(data) => {
			lifeImage = data.life
			if (typeof lifeImage !== "undefined") {
				load = true
			}
		})

	//START-UP CONDITIONAL
	if (firstTime) {

		//FIRST-TIME HTML SET-UP
		ageInput = createInput()
		ageInput.parent("ageParent")
		ageInput.style("background","black")
		ageInput.style("color","white")
		ageInput.changed(() => {
			if (!isNaN(ageInput.value())) {
				firstTime = !firstTime
				initialise()
				life.saveText()
			}
		})

		clock.span.style("opacity","0")
	}
}

function draw() {

	if (load) {
		ageInput.value(2019 - lifeImage[0])
		initialise()
		life.loadText(lifeImage)
		load = false
		firstTime = false
	}

	//UPDATE CLOCK
	clock.draw()

	//MAIN DRAWING LOOP
	if (!firstTime) {

		//MOUSE-TIMING
		if (click.active) {
			click.timeElapsed = (new Date()).getTime() - click.startTime
			if (click.timeElapsed > 250) {
				click.singleClick()
				click.timeElapsed = 0
				click.active = false
			}
		}

		
		background(0)

		if (!currentSelection.editing) {
			drawRectangles(rectangles);
		} else {
			drawCard(currentSelection)
		}
	} else {
		// loadingAnimation()
	}
}
