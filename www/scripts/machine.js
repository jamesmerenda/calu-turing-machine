import "./mapper.js";
import "./animation.js";
import consoleDisplay from "./consoleDisplay.js";
export default class machine {

	constructor(machineConsole) {
		this.states = new Array();
        this.input = "";
        this.blank = '';
        this.start = "";
        this.accept = "";
        this.numStates = 0;
		this.result = "";
		this.currentState = "";
		this.playback;
		this.lastStateTransitionedTo = "";
		this.stateStuckIn = "";
		this.HelpImStuckInAStateThatDoesNotExist = false;

		this.machineConsole = machineConsole;

		document.getElementById('step').addEventListener('click', () => this.findTransition());
		document.getElementById('play').addEventListener('click', () => this.playMachine());
		document.getElementById('pause').addEventListener('click', () => this.stopTheBus());
		document.getElementById('reset').addEventListener('click', function(){
			document.getElementById('load').click();
			//if reset button is clicked, simulate a click on the load button
		});
	}

	createMachine(input, blank, start, accept, states_Set)
	{
		this.states = new Array();
        this.input = input.slice(0);
        this.blank = blank;
        this.start = start;
        this.accept = accept;
        this.numStates = states_Set.length;
		this.result = input;
		this.lastStateTransitionedTo = "";
		this.HelpImStuckInAStateThatDoesNotExist = false;
        for(let i = 0; i < this.numStates;i++)
        {
            this.states[i] = new Array(states_Set[i][0], states_Set[i][1], states_Set[i][2]);
        }
		this.currentState = this.findState(this.start);
	}

	editMachine(states_Set)
	{
		this.states = new Array();
		this.numStates = states_Set.length;
		this.lastStateTransitionedTo = "";
		this.HelpImStuckInAStateThatDoesNotExist = false;

		for(let i = 0; i < this.numStates;i++)
        {
            this.states[i] = new Array(states_Set[i][0], states_Set[i][1], states_Set[i][2]);
        }
		this.currentState = this.findState(this.currentState[0]);
	}
	
	getStates() { //these three mostly for canvas
		return this.states;
	}
	
	getStart() {
		return this.start;
	}
	
	getAccept() {
		return this.accept;
	}

	playMachine()
	{
		this.playback = setInterval(function(){
			document.getElementById('step').click();
		}, getSpeed()*1000);
	}

	stopTheBus()	//I mean, stop the machine...
	{
		clearInterval(this.playback);
	}

	findTransition() {
		//descriptors for looking through state array
		const STATENAME = 0; //ex [0][0] "start"
		const POTENTIALREADS = 1; //ex [0][1] "0"
		const TRANSITIONSTEPS = 2; //ex [0][2] "1;r;q0"

		let currentRead = getCellUnderHead();
		let currentState = this.currentState;

		let error = 0;
		if(this.HelpImStuckInAStateThatDoesNotExist)
		{
			this.machineConsole.machineIsStuckInAStateThatDoesNotExist(this.stateStuckIn, this.lastStateTransitionedTo);
		}
		else if(currentState[STATENAME] != this.accept && error >= 0)
		{
			for(let i = 0; i < currentState[POTENTIALREADS].length; i++)
			{
				if(currentState[POTENTIALREADS][i].includes(currentRead)){//proceed with the parallel transition steps
					this.performTransition(currentState[TRANSITIONSTEPS][i], this.result);
					i=currentState[POTENTIALREADS].length +1;
				}
				else if(i == currentState[POTENTIALREADS].length - 1){//if the state does not recognise the character
					//this.errorHandler.printInvalidCharacter();
					console.log("cannot transition:" + currentRead);
					this.machineConsole.stateHasNoAvailableTransitions(this.stateStuckIn, currentRead);
				}
			}
		}

		if(currentState[STATENAME] == this.accept)//is the machine done?
		{
			clearInterval(this.playback);
		}
		
	}

	performTransition(transitionSteps)
	{
		let validNextState = -1;
		let writeChar = "";
		let direction = "";
		let nextState = "";

			writeChar = transitionSteps[0];
			direction = transitionSteps[2];
			nextState = transitionSteps.substr(4);

		updateCell(writeChar);

		if(direction == "r")//need to visually move the read head to the right
		{
			moveRight();	
		}
		if(direction == "l")//need to visually move the read head to the left
		{
			moveLeft();
		}
		validNextState = this.findState(nextState);
		if(validNextState != -1)
		{
			this.currentState = validNextState;
			this.HelpImStuckInAStateThatDoesNotExist = false;
		}
		else{
			this.HelpImStuckInAStateThatDoesNotExist = true;
			this.lastStateTransitionedTo = this.currentState[0];
			this.stateStuckIn = nextState;
			this.currentState[0] = nextState;
		}
	}

	findState(stateName)
	{
		//console.log(stateName);
		document.querySelector('.read-head-indicator').innerHTML = stateName;
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
}