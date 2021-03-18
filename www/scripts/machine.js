import "./mapper.js";
import "./animation.js";
export default class machine {
    constructor(input, blank, start, accept, states_Set) {
        this.states = new Array();
        this.input = input.slice(0);
        this.blank = blank;
        this.start = start;
        this.accept = accept;
        this.numStates = states_Set.length;
		this.result = input;
		this.readHeadIndex = 0;
        for(let i = 0; i < this.numStates;i++)
        {
            this.states[i] = new Array(states_Set[i][0], states_Set[i][1], states_Set[i][2]);
        }
		this.currentState = this.findState(this.start);
		document.getElementById('step').addEventListener('click', () => this.findTransition());
		document.getElementById('play').addEventListener('click', () => this.playMachine());
    }

	playMachine()
	{
		while(this.findTransition() == -1);
		console.log("done stepping through");
	}



	findTransition() {
		//descriptors for looking through state array
		const STATENAME = 0; //ex [0][0] "start"
		const POTENTIALREADS = 1; //ex [0][1] "0"
		const TRANSITIONSTEPS = 2; //ex [0][2] "1;r;q0"

		let currentRead = this.result[this.readHeadIndex];
		let currentState = this.currentState;

		let error = 0;

		if(currentState[STATENAME] != this.accept && error >= 0)//error checking is NOT done, W.I.P. for now please only use machines that should work
		{
			for(let i = 0; i < currentState[POTENTIALREADS].length; i++)
			{
				if(currentState[POTENTIALREADS][i].includes(currentRead)){//proceed with the parallel transition steps
					console.log("about to transition");
					this.performTransition(currentState[TRANSITIONSTEPS][i], this.result);
					currentRead = this.result[this.readHeadIndex];
					i=currentState[POTENTIALREADS].length +1;
					mapInput(this.result);
				}


				else if(i == currentState[POTENTIALREADS].length - 1){//if the state does not recognise the character
					error = -4000;//edit error please
					console.log("error");}
			}
		}

		if(currentState[STATENAME] == this.accept)//is the machine done?
		{
			console.log(currentState);
			return 1;//yes
		}
		else
			return -1;//no
	}

	performTransition(transitionSteps, readString)
	{
		let writeChar = "";
		let direction = "";
		let nextState = "";
		if(transitionSteps.indexOf("\n") == transitionSteps.lastIndexOf("\n"))//then you have an action set of just a direction and a nextState
		{
			direction = transitionSteps[0];
			nextState = transitionSteps.substr(2);
		}
		else {
			writeChar = transitionSteps[0];
			direction = transitionSteps[2];
			nextState = transitionSteps.substr(4);

			switch(this.readHeadIndex)
			{
				case 0://leftmost
					readString = writeChar + readString.slice(1);
					break;
				case readString.length-1://rightmost
					readString = readString.slice(0, readString.length-1) + writeChar;
					break;
				default://some middle index
					readString = readString.slice(0, this.readHeadIndex) + writeChar + readString.slice(this.readHeadIndex+1);
			}
		}

		this.result = readString;
		if(direction == "r")//need to visually move the read head to the right
		{
			this.readHeadIndex++;
			//moveRight();
		}
		else//need to visually move the read head to the left
		{
			this.readHeadIndex--;
			//moveLeft();
		}
		this.currentState = this.findState(nextState);
	}

	findState(stateName)
	{
		console.log(stateName);
		let i = 0;
		while(i < this.states.length && stateName != this.states[i][0])
		{
			i++;
		}
		if(i < this.states.length)
			return this.states[i];
		else
			return -1; //ERRORS AHHHHH
	}


	/*
	seekTransition() { //look for the transition to perform based on current state and value
	
		//descriptors for looking through state array
		const STATENAME = 0; //ex [0][0] "start"
		const CURRSTATEVAL = 1; //ex [0][1] "0"
		const NEXTSTATESTR = 2; //ex [0][2] "1;r;q0"
	
		let index = 0; //where are we in the input string
		let oldIndex = index; //where we were
		let currentState = this.start;
		let output = this.input;
		let currentVal = this.input[0];
		
		let colonPos1; //where colons are in state strings
		let colonPos2;

		while(currentState != this.accept) { //while still transitions to perform	
		//should probably precheck if an accept state exists, might be in scanner already
			
			for(let i = 0; i < this.numStates; i++) { //look for the state we're in
			
				if(currentState == this.states[i][STATENAME]) {
					console.log(i);
					for(let j = 0; j < this.states[i][CURRSTATEVAL].length; j++) { //looking for the matching char
						
						if(currentVal == this.states[i][CURRSTATEVAL][j]) {
							
							//this stuff should prob be it's own function but i need to sort out variables
							
							if(currentState == this.accept) { //if it doesn't have a full next move set
								currentState = this.accept;
							}
							else { //perform the transition
								colonPos1 = this.states[i][NEXTSTATESTR][j].indexOf(":"); //grab colon pos so we can slice
								colonPos2 = this.states[i][NEXTSTATESTR][j].lastIndexOf(":");
								console.log(colonPos1);
								console.log(colonPos2);
								
								//todo: convert these to user console
								console.log("New value: ", this.states[i][NEXTSTATESTR][j].slice(0, colonPos1));
								console.log("Direction: ", this.states[i][NEXTSTATESTR][j].slice(colonPos1 + 1, colonPos2));
								//+ 1 to not include the semicolon
								console.log("New state: ", this.states[i][NEXTSTATESTR][j].slice(colonPos2 + 1));
								
								currentState = this.states[i][NEXTSTATESTR][j].slice(colonPos2 + 1); //update the statename
								currentVal = this.states[i][NEXTSTATESTR][j].slice(0, colonPos1); //and the current value
								
								if(this.states[i][NEXTSTATESTR][j].slice(colonPos1 + 1, colonPos2 == "l")) {
									index = oldIndex - 1; //need to know where we were and where we're going
								}
								else {
									index = oldIndex + 1;
								}
								//should probably add a blank char somehow if it goes out of "bounds"
								
								switch(oldIndex) {
									
									case 0: //if on the leftmost
										output = currentVal + output.slice(1);
										break;
										
									case output.length - 1: //rightmost 
										output = output.slice(0, output.length - 1) + currentVal;
										//double check this is correct
										break;
										
									default: //if not at an end
										output = output.slice(0, index - 1) + currentVal + output.slice(index);
								
								}
								console.log("New string: ", output);
								
								oldIndex = index;
								currentVal = output[index];
							}
							
							
							
						}
						
					}
					//as below, throw error for no matching char
					//might also have to do something about having no char
					
					
				}
				
			}
			//if this hasn't been caught previously, throw an error for no matching state
		}
	}
	*/
}