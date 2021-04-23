import consoleDisplay from "./consoleDisplay.js";

export default class errorHandler {
	
	constructor() {
		this.display = new consoleDisplay();
		//double check this is correct
		
		/*
		this.errorCode = undefined;
		this.errorState = undefined;
		this.errorSymbol = undefined;
		*/
	}
	
	getErrorCode() {
        return this.errorCode;
    }

    getErrorState() {
        return this.errorState;
    }

    getErrorSymbol() {
        return this.errorSymbol;
    }
	
	setErrorContext() {
        this.errorCode = this.tempErrorCode;
        this.errorState = this.tempStateName;
        this.errorSymbol = this.tempPotentialReadsString;
    }
	
	getErrorContext() {
        return new Array(this.errorState, this.errorSymbol);
    }
	
	//general print to console right now, can be edited to include specific details later
	printBadEOF() {
		//-100
		this.display.setValue("Expected end of quotes but reached end of file");
	}
	
	printBadInput() {
		//-200, double check if needed
		this.display.setValue("No input defined");
	}

	printBadBlank() {
		//-201
		this.display.setValue("No blank character defined");
	}

	printBadStart() {
		//-202
		this.display.setValue("No start state defined");
	}	
	
	printBadAccept() {
		//-203
		this.display.setValue("No accept state defined");
	}		
	
	printBadStates() {
		//-204
		this.display.setValue("No states were defined for the machine");
	}

	printBadInputDef() {
		//-205
		this.display.setValue("Could not find input definition after identifier");
	}	
	
	printBadBlankDef() {
		//-206
		this.display.setValue("Could not find blank definition after identifier");
	}		
	
	printBadStateDef() {
		//-207
		this.display.setValue("Could not find state definition after identifier");
	}
	
	printBadStateName() {
		//-208
		this.display.setValue("Expected an alphanumeric state name");
	}
	
	printBadEOL() {
		//-220
		this.display.setValue("Expected end of quotes before new line");
	}
	
	printBadStateRead(errorContext) { //template literals start here
		//-209
		this.display.setValue(`Expected list of potential reads for state: ${errorContext}`);
	}
	
	printNoBracket() {
		this.display.setValue("Missing opening bracket for action set");
	}

	printBadStateSyntax(stateContext, symbolContext) { //don't need \n with template literals
		this.display.setValue(`Potentially incorrect syntax for action set.
		State: ${stateContext}
		Symbols: ${symbolContext}
		Expected: [char, (l|r), state name]`);
	}
		
	printBadWriteAction(writeAction, comma)	{ //21l
		this.setDisplay.setValue(`Expected a valid write action and a comma
		Write action: ${writeAction}
		Comma: ${comma}`)
	}
		
	printBadNextStateAction(nextState, bracket) { //212
		this.setDisplay.setValue(`Expected a valid state name and a closing bracket
		State name: ${nextState}
		Bracket: ${bracket}`);
	}
	
	printBadDirection() { //213
		this.setDisplay.setValue("Expected a singular r or l");
	}

	printBadStartLine() { //214
		this.setDisplay.setValue("Current token is not a valid line start");
	}	
}
