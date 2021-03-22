import machine from "./machine.js";
import "./mapper.js";
import errorHandler from "./errorHandler.js";

export default class compiler {
	
	//various regex combos
	SINGLE_CHAR_TOKENS = /-|=|;|,|\[|\]/;
	LOOK_AHEAD_TOKENS = /'|"/;
	WHITESPACE_TOKENS = /\s/;
	
	inputIdentifier_RegEx = /input/;
	inputString_RegEx = /("|').+("|')/;
	blankString_RegEx = /("|').("|')/;
	startOrAcceptState_RegEx = /.+/;

	stateName_RegEx = /\S+/;
	potentialRead_RegEx = /('|").('|")/;
	writeAction_RegEx = /(^.$)|(("|').("|'))/;
	directionAction_RegEx = /(r|l)/;
	nextStateAction_RegEx = /\S+/;
	ActionSetStart_RegEx = /\[/;
	ActionSetEnd_RegEx = /\]/;
	
    constructor() {
		this.errorHandler = new errorHandler();
		
        this.numTokens = 0;
        this.tokens = new Array();

        this.tempInputString = "";
        this.tempBlankString = "";
        this.tempStartStateString = "";
        this.tempAcceptStateString= "";

        this.potentialReads_Set = new Array();
        this.actions_Set = new Array();
        this.states_Set = new Array();

        this.errorCode = 0;
        this.errorState = "";
        this.errorSymbol = "";

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

        this.tokens = {undefined};

        while(index < code.length && !stopScan)
        {
            if(this.SINGLE_CHAR_TOKENS.test(code[index])) //if it's a singular char
            {
                if(activeToken)
                {
                    this.tokens[numTokens] = tempToken;
                    numTokens++;
                    tempToken = "";
                    activeToken = false;
                }
                tempToken += code[index];
                this.tokens[numTokens] = tempToken;
                tempToken = "";
                numTokens++;
            }
			
            else if(this.LOOK_AHEAD_TOKENS.test(code[index])) //if it's a string and we need to look for its end
            {
                if(activeToken)
                {
                    this.tokens[numTokens] = tempToken;
                    numTokens++;
                    tempToken = "";
                    activeToken = false;
                }

                lookAheadMatch = code[index];

                do{
                    if(this.WHITESPACE_TOKENS.test(code[index]) && code[index] != " ")
                    {
                        stopScan = true;
                        this.errorCode = -220;
                    }
                    tempToken += code[index];
                    index++;
                }while(index < code.length && code[index] != lookAheadMatch);
				
                if(index >= code.length && !stopScan)
                {
                    console.log("hit end");
                    stopScan = true;
                    this.errorCode = -100;//Expected end of quotes but reached end of file
                }
                else
                {
                    tempToken += code[index];
                    this.tokens[numTokens] = tempToken;
                    numTokens++;
                    tempToken = "";
                    activeToken = false;
                }
            }
			
            else if(this.WHITESPACE_TOKENS.test(code[index]))
            {
                if(activeToken)
                {
                    this.tokens[numTokens] = tempToken;
                    numTokens++;
                    tempToken = "";
                    activeToken = false;
                }
            }
			
            else{
                tempToken += code[index];
                activeToken = true;
            }

            if((index == code.length-1 && activeToken))
            {
                this.tokens[numTokens] = tempToken;
                numTokens++;
            }
            index++;
        }
        this.numTokens = numTokens;
        return stopScan;
    }

    parseTokens()
    {
        let turingMachine = undefined;
        let index = 0;
        let stopParse = false;
        let addState = false;

        let tempNumPotentialReads = 0;
        let tempNumActions = 0;
        let numStates = 0;
        
        let tempState = new Array();

        let tempErrorCode = undefined;

        while(index < this.numTokens && !stopParse)
        {
            switch(this.tokens[index])
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
					
                case "-":
                    stopParse = this.match_StateName(index);
                    if(!stopParse)
                    {
                        index+=2;
                        if(this.tokens[index] != ";")
                        {
                            tempErrorCode = tempNumPotentialReads = this.match_PotentialReads(index);
                            while(tempNumPotentialReads > 0 && !stopParse)
                            {
                                index += (tempNumPotentialReads*2)-1;
                                tempNumPotentialReads = 0;

                                tempErrorCode = tempNumActions = this.match_ActionSet(index);
                                if(tempNumActions > 0)
                                {
                                    index+=(tempNumActions*2)+1;
                                    if(this.tokens[index] == this.SEMICOLON)
                                    {
                                        addState = true;
                                    }
                                    else{
                                        tempNumPotentialReads = this.match_PotentialReads(index);
                                    }
                                }
                                else{
                                    this.errorCode = tempErrorCode;
                                    stopParse = true;
                                    console.log("expected action set");
                                }

                            }
                            if(tempNumPotentialReads < 0)
                            {
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
                    else
                    {
                        this.errorCode = tempErrorCode;
                        console.log("expected alphanumeric statename");
                        stopParse = true;
                    }
                    break;
					//this is the end of the - case    
					
				default:
					this.errorCode = -214;
					stopParse = true;
					break;
            }
            index++;
        }

        if(!stopParse)
        {
			if(this.states_Set[0] != null)
			{
				updateTape(this.tempInputString);
				turingMachine = new machine(this.tempInputString, this.tempBlankString,this.tempStartStateString, this.tempAcceptStateString, this.states_Set);
				this.tempInputString=this.tempBlankString=this.tempStartStateString=this.tempAcceptStateString = "";
				this.states_Set = new Array();
			}
			else{this.errorCode = -204;}//no states defined
		}

        return turingMachine;
    }

    match_Input(index) //look for a valid input string
    {
        let stopParse = false;
        if(this.tokens[index+1] == "=" && this.inputString_RegEx.test(this.tokens[index+2]) 
			&& this.tokens[index+3] == ";")
        { //if set of tokens is =, a valid input string and ;
            this.tempInputString = this.tokens[index+2].substr(1,this.tempInputString.length-2);
        }
		else {
			this.errorHandler.printBadInputDef();
			stopParse = true;
		}
		//don't need to check if tempInputString is empty cause it won't accept an empty string
		
        return stopParse;
    }

    match_Blank(index) //look for a valid blank char
    {
        let stopParse = false;
        if(this.tokens[index+1] == "=" && this.blankString_RegEx.test(this.tokens[index+2])
			&& this.tokens[index+3] == ";")
        { //if set of tokens is =, a single char and ;
            this.tempBlankString = this.tokens[index+2][1];
            returnVal = 1;
        }
		else {
			this.errorHandler.printBadBlankDef();
			stopParse = true;
		}
		//again, can't have empty strings
		
        return stopParse;
    }

    match_StartOrAcceptState(index) //look for valid start and accept states
    {
        let stopParse = false;
        if(this.tokens[index+1] == "=" && this.startOrAcceptState_RegEx.test(this.tokens[index+2])
			&& this.tokens[index+3] == ";")
        { //if set of tokens is =, a valid string and ;
            if(this.tokens[index] == "start")
            {
                this.tempStartStateString = this.tokens[index+2];
            }
            else
            {
                this.tempAcceptStateString = this.tokens[index+2];
            }
        }
		else {
			this.errorHandler.printBadStateDef();
			stopParse = true;
		}
		//needs to have an start/accept name
		
        return stopParse;
    }

    match_StateName(index) //looks for a valid state name
    {
        let stopParse = false;
        if(this.stateName_RegEx.test(this.tokens[index+1]))
        {
            this.tempStateName = this.tokens[index+1];
        }
		else {
			stopParse = true;
			this.errorHandler.printBadStateName();
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
            if(this.potentialRead_RegEx.test(this.tokens[index]) 
				|| (this.tokens[index] != null && this.tokens[index].length == 1))
            { //if a string, not null and has a length of 1
                returnVal++;

                if(this.tokens[index].includes("\"") || this.tokens[index].includes("\'"))
                {
                    tempPotentialReadsString += this.tokens[index][1];
                }
                else{
                    tempPotentialReadsString += this.tokens[index];
                }

                if(this.tokens[index+1] != ",")
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
                console.log("no pot reads");
                returnVal = -209;
            }
        }
        if(returnVal < 0)
        {
            this.setErrorContext();
        }
        return returnVal;
    }

    match_ActionSet(index)
    {

        let returnVal = 0;
        let tempActionsString = "";

        if(this.ActionSetStart_RegEx.test(this.tokens[index]))
        {
            if((this.writeAction_RegEx.test(this.tokens[index+1]))&& this.tokens[index+2] == ",")
            {
                if((this.tokens[index+3] != undefined && this.tokens[index+3].length==1)&&this.directionAction_RegEx.test(this.tokens[index+3]) && this.tokens[index+4] == ",")
                {
                    if(this.nextStateAction_RegEx.test(this.tokens[index+5]) && this.ActionSetEnd_RegEx.test(this.tokens[index+6]))
                    {
                        if(this.tokens[index+1].includes("\"") || this.tokens[index+1].includes("\'"))
                        {tempActionsString += this.tokens[index+1][1] + "\n";}
                        else{tempActionsString += this.tokens[index+1] + "\n";}

                        tempActionsString += this.tokens[index+3] + "\n";
                        tempActionsString += this.tokens[index+5];
                        this.actions_Set.push(tempActionsString);
                        returnVal = 2;
                        returnVal = 3;
                    }
                    else{
                        returnVal = -212;
                    }
                }
                else if(this.directionAction_RegEx.test(this.tokens[index+1]) && this.nextStateAction_RegEx.test(this.tokens[index+3]) && this.ActionSetEnd_RegEx.test(this.tokens[index+4]))
                {
                    tempActionsString += this.tokens[index+1] + "\n";
                    tempActionsString += this.tokens[index+3];
                    this.actions_Set.push(tempActionsString);
                    returnVal = 2;
                }
                else{
                    returnVal = -213;
                }
            }
            else
            {
                returnVal = -211;
            }
        }
        else{
            returnVal = -210;
        }

        if(returnVal < 0)
        {
            this.setErrorContext();
        }
        return returnVal;
    }

}//end of class