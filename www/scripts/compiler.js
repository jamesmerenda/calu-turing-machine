import machine from "./machine.js";
import "./mapper.js";
import errorHandler from "./errorHandler.js";

export default class compiler {
	
	//various regex combos
	SINGLE_CHAR_TOKENS = /#|-|=|;|,|\[|\]/;
	LOOK_AHEAD_TOKENS = /'|"/;
	WHITESPACE_TOKENS = /\s/;
	
	inputString_RegEx = /.+/;
	blankString_RegEx = /^.$/; //forces a single char
	startOrAcceptState_RegEx = /\S+/;

	stateName_RegEx = /\S+/;
	potentialRead_RegEx = /^.$/;
	writeAction_RegEx = /^.$/;
	directionAction_RegEx = /^(r|l)$/;
	nextStateAction_RegEx = /\S+/;
	
    constructor() {
        this.numTokens = 0;
        this.tokens = new Array();

        this.tempInputString = "";
        this.tempBlankString = "";
        this.tempStartStateString = "";
        this.tempAcceptStateString= "";

        this.potentialReads_Set = new Array();
        this.actions_Set = new Array();
        this.states_Set = new Array();

        this.errorHandler = new errorHandler();

        this.userCode = undefined;
        this.loadCode = undefined;
		
        document.getElementById('load').addEventListener('click', () => this.loadCode());
    }
	
    scanTokens() //looking for tokens
    {
        let code = this.userCode.toLowerCase();
        let numTokens = 0;
        let index = 0;
        let stopScan = false;
        let tempToken = "";
        let lookAheadMatch = "";
        let activeToken = false;
		let lineNumber = 1;

        //this.tokens = {undefined};
		this.tokens = [];

        while(index < code.length && !stopScan)
        {
            if(this.SINGLE_CHAR_TOKENS.test(code[index])) //if it's a singular char
            {
                if(activeToken) //started a token already
                {
                    this.tokens[numTokens] = [tempToken, lineNumber];
                    numTokens++;
                    tempToken = "";
                    activeToken = false;
                }

                if(code[index] == '#') //if it's a comment
                {
                    do{
                        index++;
                    }while(index < code.length && code[index] != '\n');
					lineNumber++; //since index increments again after
                }
                else //single char token
                {
                    tempToken += code[index];
                    this.tokens[numTokens] = [tempToken, lineNumber];
                    tempToken = "";
                    numTokens++;
                }
            }
			
            else if(this.LOOK_AHEAD_TOKENS.test(code[index])) //if it's a string and we need to look for its end
            {
                if(activeToken)
                {
                    this.tokens[numTokens] = [tempToken, lineNumber];
                    numTokens++;
                    tempToken = "";
                    activeToken = false;
                }

                lookAheadMatch = code[index];

                do{
                    if(this.WHITESPACE_TOKENS.test(code[index]) && code[index] != " ")
                    {
                        stopScan = true;
                        this.errorHandler.printBadEOL(lineNumber);
                    }
                    tempToken += code[index];
                    index++;
                }while(index < code.length && code[index] != lookAheadMatch);
				
                if(index >= code.length && !stopScan)
                {
                    stopScan = true;
                    this.errorHandler.printBadEOF(lineNumber);
                }
                else
                {
                    tempToken += code[index];
                    this.tokens[numTokens] = [tempToken, lineNumber];
                    numTokens++;
                    tempToken = "";
                    activeToken = false;
                }
            }
			
            else if(this.WHITESPACE_TOKENS.test(code[index]))
            {
                if(activeToken)
                {
                    this.tokens[numTokens] = [tempToken, lineNumber];
                    numTokens++;
                    tempToken = "";
                    activeToken = false;
                }
				
				if(code[index] == "\n") { //if new line
					lineNumber++;
				}
            }
			
            else{
                tempToken += code[index];
                activeToken = true;
            }

            if((index == code.length-1 && activeToken))
            {
                this.tokens[numTokens] = [tempToken, lineNumber];
                numTokens++;
            }
            index++;
        }
        this.numTokens = numTokens;
		this.cleanTokens();
		
        return stopScan;
    }
	
	cleanTokens() { //strips "/' from tokens so we don't have to keep checking them every time
		let index = 0;
		
		while(index < this.numTokens) {
			if(this.tokens[index][0].includes("\"") || this.tokens[index][0].includes("\'")) {
				this.tokens[index][0] = this.tokens[index][0].substr(1,this.tokens[index][0].length-2)
			}
			index++;
		}
		return;
	}

    parseTokens(turingMachine)
    {
        //let turingMachine = undefined;
        let index = 0;
        let stopParse = false;
        let addState = false;

        let tempNumPotentialReads = 0;
        let tempNumActions = 0;
        let numStates = 0;
        
        let tempState = new Array();

        let tempErrorCode = 0;

        while(index < this.numTokens && !stopParse)
        {
            switch(this.tokens[index][0])
            {
                case "input":
                    stopParse = this.match_Input(index);
                    if(!stopParse)
                    {
                        index+=3;
                    }
                    break;

                case "blank":
                    stopParse = this.match_Blank(index);
                    if(!stopParse)
                    {
                        console.log("blank");
                        index+=3;
                    }
                    break;
					
                case "start":
					//since these use the same func, just group together
                case "accept":
                    stopParse = this.match_StartOrAcceptState(index);
                    if(!stopParse)
                    {
                        index+=3;
                    }
                    break;
					
                case "-": //grabs a state, its potential reads and potential nexts
                    stopParse = this.match_StateName(index);
                    if(!stopParse)
                    {
                        index+=2;
                        if(this.tokens[index][0] != ";") //if we haven't reached the end of a line
                        {
                            tempErrorCode = tempNumPotentialReads = this.match_PotentialReads(index);
                            while(tempNumPotentialReads > 0 && !stopParse)
                            {
                                index += (tempNumPotentialReads*2)-1;
                                tempNumPotentialReads = 0;

                                stopParse = this.match_ActionSet(index);
                                if(!stopParse)
                                {
                                    //index+=(tempNumActions*2)+1;
									index += 7;
									
                                    if(this.tokens[index][0] == ";")
                                    {
                                        addState = true;
                                    }
                                    else{
                                        tempNumPotentialReads = this.match_PotentialReads(index);
                                    }
                                }
                            }
                            if(tempNumPotentialReads < 0)
                            { //update this
                                this.errorCode = tempErrorCode;
                                stopParse = true;
                            }
                        }
                        else
                        {
                            addState = true;
                        }

                        
                        if(addState)
                        {
                            tempState[0] = this.tempStateName;
                            tempState[1] = this.potentialReads_Set;
                            tempState[2] = this.actions_Set;
                            this.states_Set[numStates] = tempState;
                            numStates++;
                            tempState = {undefined};
                            this.potentialReads_Set = new Array();
                            this.actions_Set = new Array();
                            addState = false;
                        }
                    }
                    break;
					//this is the end of the - case    
					
				default:
					this.errorHandler.printBadStartLine(this.tokens[index]);
					stopParse = true;
					console.log("improper start");
					break;
            }
            index++;
        }

        if(this.tempInputString == "")
        {
            stopParse = true;
            tempErrorCode = -5550;
        }
        else if(this.tempBlankString == "")
        {
            stopParse = true;
            tempErrorCode = -5551;
        }
        else if(this.tempStartStateString == "")
        {
            stopParse = true;
            tempErrorCode = -5552;
        }
        else if(this.tempAcceptStateString == "")
        {
            stopParse = true;
            tempErrorCode = -5553;
        }
        else if(!this.checkExistingStartState())
        {
            console.log("no start good");
            stopParse = true;
            tempErrorCode = -5554;
        }
        else if(!this.checkExistingAcceptState())
        {
            stopParse = true;
            tempErrorCode = -5555;
        }

        if(!stopParse) //sanity check this
        {
			console.log("about to build new machine");
			updateTape(this.tempInputString, this.tempBlankString);
			turingMachine.createMachine(this.tempInputString, this.tempBlankString,this.tempStartStateString, this.tempAcceptStateString, this.states_Set);
			this.tempInputString=this.tempBlankString=this.tempStartStateString=this.tempAcceptStateString = "";
			this.states_Set = new Array();
		}

        return tempErrorCode;
    }

    checkExistingStartState()
    {
        let i = 0;
        let exists = false;
        while( i < this.states_Set.length && !exists)
        {
            console.log(`${this.states_Set[i][0]}:${this.tempStartStateString}`);
            if(this.states_Set[i][0] == this.tempStartStateString)
                exists = true;
            i++;
        }
        return exists;
    }

    checkExistingAcceptState()
    {
        let i = 0;
        let exists = false;
        while( i < this.states_Set.length && !exists)
        {
            if(this.states_Set[i][0] == this.tempAcceptStateString)
                exists = true;
            i++;
        }
        
        return exists;
    }

    match_Input(index) //look for a valid input string
    {
        let stopParse = false;
        if(this.tokens[index+1][0] == "=" && this.inputString_RegEx.test(this.tokens[index+2][0]) 
			&& this.tokens[index+3][0] == ";")
        { //if set of tokens is =, a valid input string and ;
            this.tempInputString = this.tokens[index+2][0];
        }
		else {
			this.errorHandler.printBadInputDef(this.tokens[index+1][1]);
			stopParse = true;
		}
		//don't need to check if tempInputString is empty cause it won't accept an empty string
		
        return stopParse;
    }

    match_Blank(index) //look for a valid blank char
    {
        let stopParse = false;
        if(this.tokens[index+1][0] == "=" && this.blankString_RegEx.test(this.tokens[index+2][0])
			&& this.tokens[index+3][0] == ";")
        { //if set of tokens is =, a single char and ;
            this.tempBlankString = this.tokens[index+2][0];
            stopParse = false;
        }
		else {
			this.errorHandler.printBadBlankDef(this.tokens[index+1][1]);
			stopParse = true;
		}
		//again, can't have empty strings
		
        return stopParse;
    }

    match_StartOrAcceptState(index) //look for valid start and accept states
    {
        let stopParse = false;
        if(this.tokens[index+1][0] == "=" && this.startOrAcceptState_RegEx.test(this.tokens[index+2][0])
			&& this.tokens[index+3][0] == ";")
        { //if set of tokens is =, a valid string and ;
            if(this.tokens[index][0] == "start")
            {
                this.tempStartStateString = this.tokens[index+2][0];
            }
            else
            {
                this.tempAcceptStateString = this.tokens[index+2][0];
            }
        }
		else {
			this.errorHandler.printBadStateDef(this.tokens[index+1][1]);
			stopParse = true;
		}
		//needs to have an start/accept name
		
        return stopParse;
    }

    match_StateName(index) //looks for a valid state name
    {
        let stopParse = false;
        if(this.stateName_RegEx.test(this.tokens[index+1][0]))
        {
            this.tempStateName = this.tokens[index+1][0];
        }
		else {
			stopParse = true;
			this.errorHandler.printBadStateName(this.tokens[index+1]);
		}
        return stopParse;
    }

    match_PotentialReads(index) //looks for all the potential reads
    {
        let returnVal = 0;
        let stopMatch = false;

        let tempPotentialReadsString = "";

        while(returnVal > -1 && !stopMatch)
        {
            if(this.potentialRead_RegEx.test(this.tokens[index][0]) 
				|| (this.tokens[index][0] != null && this.tokens[index][0].length == 1))
            { //if a string, not null and has a length of 1
                returnVal++;
				tempPotentialReadsString += this.tokens[index][0];

                if(this.tokens[index+1][0] != ",")
                {
                    this.potentialReads_Set.push(tempPotentialReadsString);
                    stopMatch = true;
                }
                else
                {
                    index+=2;
                }
            }
            else
            {
				this.errorHandler.printBadStateRead(this.tokens[index - 1]);
				//-1 to get the state name and not the potential read
                returnVal = -209;//no potential reads found
				//fix this later
            }
        }
        return returnVal;
    }

    match_ActionSet(index)
    {
		let stopParse = false;
        let returnVal = 0;
        let tempActionsString = "";

        if(this.tokens[index][0] == "[")
        {
            if((this.writeAction_RegEx.test(this.tokens[index+1][0]))&& this.tokens[index+2][0] == ",")
            { //if valid replacement state character and comma
                if(this.directionAction_RegEx.test(this.tokens[index+3][0]) && this.tokens[index+4][0] == ",")
                { //if r or l and comma
                    if(this.nextStateAction_RegEx.test(this.tokens[index+5][0]) && this.tokens[index+6][0] == "]")
                    {
						tempActionsString += this.tokens[index+1][0] + "\n" + this.tokens[index+3][0] + 
						"\n" + this.tokens[index+5][0];
                        this.actions_Set.push(tempActionsString);
                        //returnVal = 3;
                    }
                    else{
                        this.errorHandler.printBadNextStateAction(this.tokens[index+5], this.tokens[index+6][0]);
						stopParse = true;
					}
                }
                else{
                    this.errorHandler.printBadDirection(this.tokens[index+3]);
					stopParse = true;
                }
            }
            else
            {
                this.errorHandler.printBadWriteAction(this.tokens[index+1], this.tokens[index+2][0]);
				stopParse = true;
            }
        }
        else{
			this.errorHandler.printNoBracket(this.tokens[index][1]);
			stopParse = true;
        }
		
        return stopParse;
    }

}//end of class
