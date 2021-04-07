export default class stateDiagram {

	radius = 15;

	constructor(states, start, accept) {
		this.states = [];
		this.stateNames = [];
		this.numStates = states.length;
		this.start = start;
		this.accept = accept;
		this.numEdges = 0;
		let tempArray = [];
		
		this.canvas = document.getElementById("state_diagram");
		this.context = this.canvas.getContext("2d");	
		
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		
		for(let i = 0; i < this.numStates; i++) { //maybe rewrite array
			this.states.push(states[i]); //copy array
			this.stateNames.push(states[i][0]);
			this.states[i][3] = this.states[i][4] = undefined; //coords for the state
			for(let j = 0; j < this.states[i][1].length; j++) {
				tempArray[j] = false; //keeping track of what edges have been drawn
			}
			this.states[i][5] = tempArray;
			tempArray = []; //kinda roundabout, might rewrite
			
			this.numEdges += this.states[i][2].length; //counting how many edges
		}
	}
	
	toRadian(degree) {
		return (Math.PI / 180) * degree;
	}
	
	drawState(index, x, y, radius) {
		let circle = new Path2D();
		
		this.states[index][3] = x;
		this.states[index][4] = y;
		circle.arc(x, y, radius, 0, 2 * Math.PI);
		this.context.stroke(circle);
		this.context.fillText(this.states[index][0], x, y);
	}
	
	getX(x, radius, degree, multiplier) {
		if(multiplier == null) {
			multiplier = 1;
		}
		return x + radius * Math.cos(this.toRadian(degree * multiplier));
	}
	
	getY(y, radius, degree, multiplier) {
		if(multiplier == null) {
			multiplier = 1;
		}
		return y + radius * Math.sin(this.toRadian(degree * multiplier));
	}	
	
	placeStates() { //draw all the states, no edges yet
		const origin = 100; //so i can change these later and not have to change 10 mil things
		const acceptRadius = 17;
		const spacing = 53;
		const bigRadius = 50;
		
		let i = 0;
		let drewStart = false;
		let currVal = 0;
		let nodeCount = this.numStates - 1;
		let degreeSpace = 360;
		let statesDrawn	= 1;
		
		while(!drewStart) { //draw start state
			if(this.states[i][0] == this.start) {
				this.drawState(i, origin, origin, this.radius);
				
				drewStart = true;
			}
			else { //start state should exist
				i++;
			}
		}
		currVal = i;
		degreeSpace = Math.floor(degreeSpace / nodeCount); //floor for performance
		
		currVal++;
		if(currVal >= this.numStates) { //rollover
			currVal = 0;
		}
		
		while(currVal != i) {
			
			
			this.drawState(currVal, this.getX(origin, bigRadius, degreeSpace, statesDrawn),
				this.getY(origin, bigRadius, degreeSpace, statesDrawn), this.radius);
			
			if(this.states[currVal][0] == this.accept){
				this.drawState(currVal, this.getX(origin, bigRadius, degreeSpace, statesDrawn),
				this.getY(origin, bigRadius, degreeSpace, statesDrawn), acceptRadius);
			}
			
			currVal++;
			if(currVal >= this.numStates) { //rollover
				currVal = 0;
			}
			statesDrawn++;
		}
	}
	
	calcEdges() {
		const textSpacing = 10;
		let temp = undefined;
		let nextState = undefined;
		let x = 0;
		let y = 0;
		let isEmpty = false;
		
		for(let i = 0; i < this.numStates;i++) { //for each state
			for(let j = 0; j < this.states[i][1].length; j++) { //for each substate
				temp = this.states[i][2][j].slice(this.states[i][2][j].lastIndexOf("\n") + 1); //grab its next state
				nextState = this.stateNames.indexOf(temp);
				
				x = Math.floor((this.states[i][3] + this.states[nextState][3]) / 2);
				y = Math.floor((this.states[i][4] + this.states[nextState][4]) / 2);
				
				let imDat = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height); //pixel data of the canvas
				let alphaComp = imDat.data[(((y - textSpacing) * (imDat.width * 4)) + (x * 4) + 3)]; //get alpha value of point slightly above mid of line
				
				if(alphaComp == 0 && this.states[i][0] != this.states[nextState][0]) { //if there's nothing there
					this.context.beginPath();
					this.context.moveTo(this.states[i][3], this.states[i][4]);
					this.context.lineTo(this.states[nextState][3], this.states[nextState][4]);
					this.context.stroke();
					
					this.context.fillText("placeholder text", x, y - textSpacing);
				}
				//catch states that go to itself here
				
				else { //something's already drawn there
					let k = 2;
					while(isEmpty == false) { //should catch if it goes off the canvas
						alphaComp = imDat.data[(((y - (textSpacing * k)) * (imDat.width * 4)) + (x * 4) + 3)];
						if(alphaComp == 0) {
							isEmpty = true;
						}
						else {
							k++;
						}
					}
					this.context.fillText("placeholder text", x, y - (textSpacing * k));
				}	
			}
		}
	}
	
	drawDiagram() {
		this.placeStates();
		
		this.context.globalCompositeOperation = "destination-over"; //makes it so it can't draw over previous drawings
		
		this.calcEdges();
	}
}