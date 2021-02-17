import machine from "./machine.js";

export default class compiler {
    constructor() {


        this.SINGLE_CHAR_TOKENS = /-|=|;|,|\[|\]/;
        this.LOOK_AHEAD_TOKENS = /'|"/;
        this.WHITESPACE_TOKENS = /\s/;
        this.input_RegEx = /input *= *("|').+("|');/;
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
        this.writeAction_RegEx = /\S/;
        this.directionAction_RegEx = /(r|l)/;
        this.nextStateAction_RegEx = /\S+/;
        this.ActionSetStart_RegEx = /\[/;
        this.ActionSetEnd_RegEx = /\]/;

        this.tempToken = "";
        //this.userCode = "";
        this.tokens = new Array();
        this.numTokens = 0;
        this.loadCode = undefined;
        document.getElementById('load').addEventListener('click', () => this.loadCode());
    }

    scanTokens(code)
    {
        code = code.toLowerCase();
        this.numTokens = 0;
        this.tokens = {undefined};
        let index = 0;
        let stopScan = false;
        let tempToken = "";
        let lookAheadMatch = "";

        let activeToken = false;

        while(index < code.length && !stopScan)
        {
            if(this.SINGLE_CHAR_TOKENS.test(code[index]))
            {
                if(activeToken)
                {
                    this.tokens[this.numTokens] = tempToken;
                    this.numTokens++;
                    tempToken = "";
                    activeToken = false;
                }

                tempToken += code[index];
                this.tokens[this.numTokens] = tempToken;
                tempToken = "";
                this.numTokens++;
            }
            else if(this.LOOK_AHEAD_TOKENS.test(code[index]))
            {
                if(activeToken)
                {
                    this.tokens[this.numTokens] = tempToken;
                    this.numTokens++;
                    tempToken = "";
                    activeToken = false;
                }

                if(code[index] == "[")
                {
                    lookAheadMatch = "]";
                }
                else
                    lookAheadMatch = code[index];

                do{
                    tempToken += code[index];
                    index++;
                }while(index < code.length && code[index] != lookAheadMatch);
                if(index >= code.length)
                {
                    stopScan = true;
                }
                else
                {
                    tempToken += code[index];
                    this.tokens[this.numTokens] = tempToken;
                    console.log("t: "+tempToken);
                    this.numTokens++;
                    tempToken = "";
                    activeToken = false;
                }
            }
            else if(this.WHITESPACE_TOKENS.test(code[index]))
            {
                if(activeToken)
                {
                    this.tokens[this.numTokens] = tempToken;
                    this.numTokens++;
                    tempToken = "";
                    activeToken = false;
                }
                console.log("whiteSpace: " + code[index]);
            }
            else{
                
                console.log("added: " + code[index]);
                tempToken += code[index];
                activeToken = true;
            }

            if((index == code.length-1 && activeToken))
            {
                this.tokens[this.numTokens] = tempToken;
                this.numTokens++;
            }
            console.log(index);
            index++;

        }
        return stopScan;
    }

    parseTokens()
    {
        let turingMachine = undefined;
        let index = 0;
        let stopParse = false;
        let createState = false;
        let createStateMachine = false;

        let tempNumPotentialReads = 0;
        let tempNumActions = 0;
        let numStates = 0;

        let tempInputString = "";
        let tempBlankString = "";
        let tempStartStateString = "";
        let tempAcceptStateString= "";

        let tempStateName = "";
        let tempPotentialReadsString = "";
        let tempActionsString = "";

        let potentialReads_Set = new Array();
        let actions_Set = new Array();
        let states_Set = new Array();
        let tempState = new Array();
        for(let i = 0; i < this.numTokens;i++)
        {
            console.log(this.tokens[i]);
        }

        while(index < this.numTokens && !stopParse)
        {
            switch(this.tokens[index])
            {
                case "input":
                    if(this.match_Input(index) == 1)
                    {
                        tempInputString = this.tokens[index+2];
                        index+=3;
                        console.log("input set");
                    }
                    else{
                        console.log("expected input string inside of quotes");
                        stopParse=true;
                    }
                    break;

                case "blank":
                    if(this.match_Blank(index) == 1)
                    {
                        tempBlankString = this.tokens[index+2];
                        index+=3;
                        console.log("blank set");
                    }
                    else{
                        console.log("expected blank character inside of quotes");
                        stopParse = true;
                    }
                    break;
                case "start":
                    if(this.match_StartOrAcceptState(index) == 1)
                    {
                        tempStartStateString = this.tokens[index+2];
                        index+=3;
                        console.log("startState set");
                    }
                    else{
                        console.log("expected state name");
                        stopParse = true;
                    }
                    break;
                case "accept":
                    if(this.match_StartOrAcceptState(index) == 1)
                    {
                        tempAcceptStateString = this.tokens[index+2];
                        index+=3;
                        console.log("acceptState set");
                    }
                    else{
                        console.log("expected state name");
                        stopParse = true;
                    }
                    break;
                case "-":
                    if(this.match_StateName(index) == 1)
                    {
                        tempStateName = this.tokens[index+1];
                        index+=2;
                        console.log("state name set");
                        if(this.tokens[index] != ";")
                        {
                            tempNumPotentialReads = this.match_PotentialReads(index);
                            while(tempNumPotentialReads > 0)
                            {
                                console.log(tempNumPotentialReads);
                                for(let i = 0; i<tempNumPotentialReads;i++)
                                {
                                    if(this.tokens[index+(i*2)].includes("\"") || this.tokens[index+(i*2)].includes("\'"))
                                    {
                                        tempPotentialReadsString += this.tokens[index+(i*2)][1];
                                    }
                                    else{
                                        tempPotentialReadsString += this.tokens[index+(i*2)];
                                    }
                                }
                                console.log("potential reads"+tempPotentialReadsString);

                                potentialReads_Set.push(tempPotentialReadsString);
                                tempPotentialReadsString = "";

                                index += (tempNumPotentialReads*2)-1;
                                tempNumPotentialReads = 0;

                                tempNumActions = this.match_ActionSet(index);
                                if(tempNumActions > 0)
                                {
                                    console.log(tempNumActions);
                                    for(let i = 0;i < tempNumActions;i++)
                                    {
                                        console.log(this.tokens[index+1+(i*2)]);
                                        tempActionsString += this.tokens[index+1+(i*2)] + ":";
                                    }
                                    actions_Set.push(tempActionsString);
                                    tempActionsString = "";
                                    index+=(tempNumActions*2)+1;
                                    if(this.tokens[index] == ";")
                                    {
                                        createState = true;
                                    }
                                    else{
                                        tempNumPotentialReads = this.match_PotentialReads(index);
                                    }
                                }
                                else{
                                    stopParse = true;
                                    console.log("expected action set");
                                }

                            }
                            if(tempNumPotentialReads == -1)
                            {
                                stopParse = true;
                            }
                        }
                        else
                        {
                            createState = true;
                        }

                        
                        if(createState)
                        {
                            tempState[0] = tempStateName;
                            tempState[1] = potentialReads_Set;
                            tempState[2] = actions_Set;
                            states_Set[numStates] = tempState;
                            numStates++;
                            tempState = {undefined};
                            createState = false;
                        }
                    }
                    else
                    {
                        console.log("expected alphanumeric statename");
                        stopParse = true;
                    }
                    break;
            }
            index++;
        }

        if(tempInputString != "")
        {
            if(tempBlankString != "")
            {
                if(tempStartStateString != "")
                {
                    if(tempAcceptStateString != "")
                    {
                        if(states_Set[0] != undefined)
                        {
                            turingMachine = new machine(tempInputString.substr(1,tempInputString.length-2), tempBlankString[1],tempStartStateString, tempAcceptStateString, states_Set);
                        }
                        else{
                            console.log("no states defined");
                        }
                    }
                    else{
                        console.log("accept not defined")
                    }
                }
                else{
                    console.log("start not defined");
                }
            }
            else{
                console.log("blank not defined");
            }
        }
        else{
            console.log("input not defined");
        }
        if(stopParse)
        {
            console.log("stopped parse function");
        }

        
    }

    match_Input(index)
    {
        let returnVal = 0;
        if(this.assignment_RegEx.test(this.tokens[index+1]) && this.inputString_RegEx.test(this.tokens[index+2]) && this.endStatement_RegEx.test(this.tokens[index+3]))
        {
            returnVal = 1;
        }
        return returnVal;
    }

    match_Blank(index)
    {
        let returnVal = 0;
        if(this.assignment_RegEx.test(this.tokens[index+1]) && this.blankString_RegEx.test(this.tokens[index+2]) && this.endStatement_RegEx.test(this.tokens[index+3]))
        {
            returnVal = 1;
        }
        return returnVal;
    }

    match_StartOrAcceptState(index)
    {
        let returnVal = 0;
        if(this.assignment_RegEx.test(this.tokens[index+1]) && this.startOrAcceptState_RegEx.test(this.tokens[index+2]) && this.endStatement_RegEx.test(this.tokens[index+3]))
        {
            returnVal = 1;
        }
        return returnVal;
    }

    match_StateName(index)
    {
        let returnVal = 0;
        if(this.stateName_RegEx.test(this.tokens[index+1]))
        {
            returnVal = 1;
        }
        return returnVal;
    }

    match_PotentialReads(index)
    {
        let returnVal = 0;
        let stopMatch = false;
        while(returnVal > -1 && !stopMatch)
        {
            console.log(this.tokens[index] +" is the current token");
            if(this.potentialRead_RegEx.test(this.tokens[index]) || (this.tokens[index] != undefined && this.tokens[index].length == 1))
            {
                console.log(this.tokens[index] +" is a proper pread");
                returnVal++;
                if(this.tokens[index+1] != ",")
                {
                    stopMatch = true;
                }
                else
                {
                    index+=2;
                }
            }
            else
            {
                returnVal = -1;
            }
        }
        return returnVal;
    }

    match_ActionSet(index)
    {
        let returnVal = 0;
        let stopMatch = false;

        if(this.ActionSetStart_RegEx.test(this.tokens[index]))
        {
            if((this.tokens[index+1] != undefined && this.tokens[index+1].length==1)&&(this.writeAction_RegEx.test(this.tokens[index+1]))&& this.tokens[index+2] == ",")
            {
                if((this.tokens[index+3] != undefined && this.tokens[index+3].length==1)&&this.directionAction_RegEx.test(this.tokens[index+3]) && this.tokens[index+4] == ",")
                {
                    if(this.nextStateAction_RegEx.test(this.tokens[index+5]) && this.ActionSetEnd_RegEx.test(this.tokens[index+6]))
                    {
                        returnVal = 3;
                    }
                    else{
                        returnVal = -1;
                    }
                }
                else if(this.directionAction_RegEx.test(this.tokens[index+1]) && this.nextStateAction_RegEx.test(this.tokens[index+3]) && this.ActionSetEnd_RegEx.test(this.tokens[index+4]))
                {
                    returnVal = 2;
                }
                else{
                    returnVal = -1;
                }
            }
            else
            {
                returnVal = -1;
            }
        }
        else{
            returnVal = -1;
        }
        return returnVal;
    }


    
}