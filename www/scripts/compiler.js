import machine from "./machine.js";

export default class compiler {
    constructor() {

        this.SINGLE_CHAR_TOKENS = /-|=|;|,|\[|\]/;
        this.LOOK_AHEAD_TOKENS = /'|"/;
        this.WHITESPACE_TOKENS = /\s/;
        this.SEMICOLON = ";";
        this.assignment_RegEx = /=/;
        this.endStatement_RegEx = /;/;
        this.comma_RegEx = /,/;

        this.inputIdentifier_RegEx = /input/;
        this.inputString_RegEx = /("|').+("|')/;


        this.blankString_RegEx = /("|').("|')/;

        this.startOrAcceptState_RegEx = /.+/;
        this.stateIdentifier_RegEx = /-/;

        this.stateName_RegEx = /\S+/;
        this.potentialRead_RegEx = /('|").('|")/;
        this.writeAction_RegEx = /(^.$)|(("|').("|'))/;
        this.directionAction_RegEx = /(r|l)/;
        this.nextStateAction_RegEx = /\S+/;
        this.ActionSetStart_RegEx = /\[/;
        this.ActionSetEnd_RegEx = /\]/;

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

    scanTokens()
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
            if(this.SINGLE_CHAR_TOKENS.test(code[index]))
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
            else if(this.LOOK_AHEAD_TOKENS.test(code[index]))
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
                    tempErrorCode = this.match_Input(index);
                    if(tempErrorCode == 1)
                    {
                        index+=3;
                    }
                    else{
                        this.errorCode = tempErrorCode;
                        stopParse=true;
                    }
                    break;

                case "blank":
                    tempErrorCode = this.match_Blank(index);
                    if(tempErrorCode == 1)
                    {
                        index+=3;
                    }
                    else{
                        this.errorCode = tempErrorCode;
                        console.log("expected blank character inside of quotes");
                        stopParse = true;
                    }
                    break;
                case "start":
                    tempErrorCode = this.match_StartOrAcceptState(index);
                    if(tempErrorCode == 1)
                    {
                        index+=3;
                    }
                    else{
                        this.errorCode = tempErrorCode;
                        console.log("expected state name");
                        stopParse = true;
                    }
                    break;
                case "accept":
                    tempErrorCode = this.match_StartOrAcceptState(index);
                    if(tempErrorCode == 1)
                    {
                        index+=3;
                    }
                    else{
                        this.errorCode = tempErrorCode;
                        console.log("expected state name");
                        stopParse = true;
                    }
                    break;
                case "-":
                    tempErrorCode = this.match_StateName(index);
                    if(tempErrorCode == 1)
                    {
                        index+=2;
                        if(this.tokens[index] != this.SEMICOLON)
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
                    
                    default:
                        this.errorCode = -214;
                        stopParse = true;
                        break;
            }
            index++;
        }

        if(!stopParse)
        {
            if(this.tempInputString != ""){
                if(this.tempBlankString != ""){
                    if(this.tempStartStateString != ""){
                        if(this.tempAcceptStateString != ""){
                            if(this.states_Set[0] != undefined)
                            {
                                turingMachine = new machine(this.tempInputString, this.tempBlankString,this.tempStartStateString, this.tempAcceptStateString, this.states_Set);
                                this.tempInputString=this.tempBlankString=this.tempStartStateString=this.tempAcceptStateString = "";
                                this.states_Set = new Array();
                            }
                            else{this.errorCode = -204;}//no states defined
                        }else{this.errorCode = -203;}//accept state not defined
                    }else{this.errorCode = -202;}//start state not defined
                }else{this.errorCode = -201;}//blank char not defined
            }else{this.errorCode = -200;}//input not defined
        }

        return turingMachine;

        
    }

    match_Input(index)
    {
        let returnVal = -205;
        if(this.assignment_RegEx.test(this.tokens[index+1]) && this.inputString_RegEx.test(this.tokens[index+2]) && this.endStatement_RegEx.test(this.tokens[index+3]))
        {
            this.tempInputString = this.tokens[index+2];
            this.tempInputString = this.tempInputString.substr(1,this.tempInputString.length-2);
            returnVal = 1;
        }
        return returnVal;
    }

    match_Blank(index)
    {
        let returnVal = -206;
        if(this.assignment_RegEx.test(this.tokens[index+1]) && this.blankString_RegEx.test(this.tokens[index+2]) && this.endStatement_RegEx.test(this.tokens[index+3]))
        {
            this.tempBlankString = this.tokens[index+2];
            this.tempBlankString = this.tempBlankString[1];
            returnVal = 1;
        }
        return returnVal;
    }

    match_StartOrAcceptState(index)
    {
        let returnVal = -207;
        if(this.assignment_RegEx.test(this.tokens[index+1]) && this.startOrAcceptState_RegEx.test(this.tokens[index+2]) && this.endStatement_RegEx.test(this.tokens[index+3]))
        {
            if(this.tokens[index] == "start")
            {
                this.tempStartStateString = this.tokens[index+2];
            }
            else
            {
                this.tempAcceptStateString = this.tokens[index+2];
            }
            returnVal = 1;
        }
        return returnVal;
    }

    match_StateName(index)
    {
        let returnVal = -208;
        if(this.stateName_RegEx.test(this.tokens[index+1]))
        {
            this.tempStateName = this.tokens[index+1];
            returnVal = 1;
        }
        return returnVal;
    }

    match_PotentialReads(index)
    {
        let returnVal = 0;
        let stopMatch = false;

        let tempPotentialReadsString = "";

        while(returnVal > -1 && !stopMatch)
        {
            if(this.potentialRead_RegEx.test(this.tokens[index]) || (this.tokens[index] != undefined && this.tokens[index].length == 1))
            {
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
                        {tempActionsString += this.tokens[index+1][1] + ":";}
                        else{tempActionsString += this.tokens[index+1] + ":";}

                        tempActionsString += this.tokens[index+3] + ":";
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
                    tempActionsString += this.tokens[index+1] + ":";
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