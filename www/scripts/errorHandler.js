import consoleDisplay from "./consoleDisplay.js";

export default class errorHandler { //prints errors, wowee
	
	constructor() {
		this.display = new consoleDisplay();
		//double check this is correct
	}
	
	printBadEOF(lineNumber) {
		//-100
		this.display.setValue("Expected end of quotes but reached end of file on line", lineNumber);
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

	printBadInputDef(lineNum) {
		//-205
		this.display.setValue(`Input was not properly defined on line ${lineNum}\n`);
	}	
	
	printBadBlankDef(lineNum) {
		//-206
		this.display.setValue(`Blank was not properly defined on line ${lineNum}\n`);
	}		
	
	printBadStateDef(lineNum) {
		//-207
		this.display.setValue(`State was not properly defined on line ${lineNum}\n`);
	}
	
	printBadStateName(tokArr) {
		//-208
		this.display.setValue(`State name cannot contain whitespace characters
		Inputted state name: ${tokArr[0]}
		Line number: ${tokArr[1]}\n`);
	}
	
	printBadEOL(lineNumber) {
		//-220
		this.display.setValue(`Expected end of quotes before new line on line ${lineNumber}\n`);
	}
	
	printBadStateRead(tokArr) { 
		//-209
		this.display.setValue(`Expected list of potential reads for state ${tokArr[0]} on line ${tokArr[1]}\n`);
	}
	
	printNoBracket(lineNum) { //210
		this.display.setValue(`Missing opening bracket for action set on line ${lineNum}\n`);
	}

	printBadStateSyntax(stateContext, symbolContext) { //don't need \n with template literals
		this.display.setValue(`Potentially incorrect syntax for action set.
		State: ${stateContext}
		Symbols: ${symbolContext}
		Expected: [char, (l|r), state name]\n`);
	}
		
	printBadWriteAction(tokArr, comma)	{ //21l
		this.display.setValue(`Expected a valid write action and a comma on line ${tokArr[1]}
		Write action: ${tokArr[0]}
		Comma: ${comma}\n`)
	}
		
	printBadNextStateAction(tokArr, bracket) { //212
		this.display.setValue(`Expected a valid state name and a closing bracket on line ${tokArr[1]}
		State name: ${tokArr[0]}
		Bracket: ${bracket}\n`);
	}
	
	printBadDirection(tokArr) { //213
		this.display.setValue(`Expected a singular r or l on line ${tokArr[1]}
		Current token: ${tokArr[0]}\n`);
	}

	printBadStartLine(tokArr) { //214
		this.display.setValue(`Current token on line ${tokArr[1]} is not a valid line start
		Current token: ${tokArr[0]}
		Expected: input, blank, start, accept or -\n`);
	}	
}
