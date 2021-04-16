import "./mapper.js";
import "./animation.js";
export default class machine {

	constructor() {
		this.states = new Array();
        this.input = "";
        this.blank = '';
        this.start = "";
        this.accept = "";
        this.numStates = 0;
		this.result = "";
		this.currentState = "";
		this.playback;
		document.getElementById('step').addEventListener('click', () => this.findTransition());
		document.getElementById('play').addEventListener('click', () => this.playMachine());
		document.getElementById('pause').addEventListener('click', () => this.stopTheBus());
		document.getElementById('reset').addEventListener('click', function(){
			document.getElementById('load').click();
		});
	}

	createMachine(input, blank, start, accept, states_Set)
	{
		console.log(input, blank, start, accept, states_Set);
		this.states = new Array();
        this.input = input.slice(0);
        this.blank = blank;
        this.start = start;
        this.accept = accept;
        this.numStates = states_Set.length;
		this.result = input;
        for(let i = 0; i < this.numStates;i++)
        {
            this.states[i] = new Array(states_Set[i][0], states_Set[i][1], states_Set[i][2]);
        }
		this.currentState = this.findState(this.start);
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

		if(currentState[STATENAME] != this.accept && error >= 0)//error checking is NOT done, W.I.P. for now please only use machines that should work
		{
			for(let i = 0; i < currentState[POTENTIALREADS].length; i++)
			{
				if(currentState[POTENTIALREADS][i].includes(currentRead)){//proceed with the parallel transition steps
					console.log("about to transition");
					this.performTransition(currentState[TRANSITIONSTEPS][i], this.result);
					i=currentState[POTENTIALREADS].length +1;
				}


				else if(i == currentState[POTENTIALREADS].length - 1){//if the state does not recognise the character
					error = -4000;//edit error please
					console.log("cannot transition:" + currentRead);}
			}
		}

		if(currentState[STATENAME] == this.accept)//is the machine done?
		{
			console.log("fin");
			clearInterval(this.playback);
		}
		
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
		}

		updateCell(writeChar);

		if(direction == "r")//need to visually move the read head to the right
		{
			moveRight();	
		}
		if(direction == "l")//need to visually move the read head to the left
		{
			moveLeft();
		}
		this.currentState = this.findState(nextState);
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