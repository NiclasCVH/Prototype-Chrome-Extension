/* To-do list:

3. Polish up and put on Chrome store
4. Finish saving features
	c. create a loading screen
	d. polish saving feature
5. Figure out what the core use of this app is.
	- Just really quick and easy multi-level reflections?
	- Allowing a limited amount of flagging/highlighting within each card? i.e. a line, 2 cards a month, one a year
	- Have prompts in there, and frequent reminders?
	- Come back to card-editing here
6. Re-introduce 3d features and graphic touch-ups

 */
var startTime

var load = false

var clock = new Clock()

function setup() {

	//MAIN GRAPHICS SET-UP
	width = window.innerWidth + widthMargin
	height = window.innerHeight + heightMargin
	createCanvas(width, height);
	background(0)

	chrome.storage.local.get("life",(data) => {
			lifeImage = data.life
			if (typeof lifeImage !== "undefined") {
				load = true
			}
		})

	//START-UP CONDITIONAL
	if (!initialised) {

		//FIRST-TIME HTML SET-UP
		ageInput = createInput()
		ageInput.parent("ageParent")
		ageInput.style("background","black")
		ageInput.style("color","white")
		ageInput.changed(() => {
			if (!isNaN(ageInput.value())) {
				initialised = true
				initialise()
				life.saveText()
			}
		})
	}

	startTime = (new Date()).getTime()

}

function draw() {

	var timeNow = (new Date()).getTime()

	if (load) {
		ageInput.value(2019 - lifeImage[0])
		initialise()
		life.loadText(lifeImage)
		load = false
		initialised = true
	}

	//MAIN DRAWING LOOP
	if (initialised) {

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

		//UPDATE CLOCK
		clock.draw()

		if (!currentSelection.editing) {
			drawRectangles(rectangles);
		} else {
			drawCard(currentSelection)
		}
	}

	if (timeNow - startTime < 500) {
		background(0)
		loadingAnimation()
	} else if (initialised) {
		clock.span.style("opacity","1")
		if(width/2 - rectangles.w/2 > 230) {
					img.style("opacity","1")
				} else {
					img.style("opacity","0")
				}
	}
}
