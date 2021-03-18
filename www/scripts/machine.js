export default class machine {
    constructor(input, blank, start, accept, states_Set) {
        this.states = new Array();
        this.input = input;
        this.blank = blank;
        this.start = start;
        this.accept = accept;
        this.numStates = states_Set.length;
        this.result = input;

        for(let i = 0; i < this.numStates;i++)
        {
            this.states[i] = new Array(states_Set[i][0], states_Set[i][1], states_Set[i][2]);
        }

    }


	
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
					
					for(let j = 0; j < this.states[i][CURRSTATEVAL].length; j++) { //looking for the matching char
						
						if(currentVal == this.states[i][CURRSTATEVAL][j]) {
							
							//this stuff should prob be it's own function but i need to sort out variables
							
							if(currentState == this.accept) { //if it doesn't have a full next move set
								currentState = this.accept;
							}
							else { //perform the transition
								colonPos1 = this.states[i][NEXTSTATESTR][j].indexOf(":"); //grab colon pos so we can slice
								colonPos2 = this.states[i][NEXTSTATESTR][j].lastIndexOf(":");
								
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
}