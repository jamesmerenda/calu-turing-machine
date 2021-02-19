export default class {
    constructor() {
        this.console = document.getElementById("consoleText");
        document.getElementById('clearConsole').addEventListener('click', () => this.clearConsole());
    }

    clearConsole()
    {
        this.console.value = "";
    }

    displayError (errorCode, errorContext) {
        switch(errorCode)
        {
            case -100:
                this.console.value = "Expected end of quotes but reached end of file";
                break;
            case -200:
                this.console.value = "No input defined";
                break;
            case -201:
                this.console.value = "No blank character defined";
                break;
            case -202:
                this.console.value = "No start state defined";
                break;
            case -203:
                this.console.value = "No accept state defined";
                break;
            case -204:
                this.console.value = "No states were defined for the machine";
                break;
            case -205:
                this.console.value = "could not find input definition after identifier";
                break;
            case -206:
                this.console.value = "could not find blank definition after identifier";
                break;
            case -207:
                this.console.value = "could not find state definition after identifier";
                break;
            case -208:
                this.console.value = "expected an alpanumeric state name";
                break;
            case -209:
                this.console.value = `expected list of potential reads for state: ${errorContext[0]}`;
                break;
            case -210:
                this.console.value = `Error Code: ${errorCode}\nPotentially incorrect syntax for action set.\nstate: ${errorContext[0]}\nSymbols: ${errorContext[1]}\nExpected: [char, (r|l), state name];`;
                break;
            case -211:
                this.console.value = `Error Code: ${errorCode}\n`;
                break;
            case -212:
                this.console.value = `Error Code: ${errorCode}\n`;
                break;
            case -213:
                this.console.value = `Error Code: ${errorCode}\n`;
                break;
            case -214:
                this.console.value = `Error Code: ${errorCode}\n`;
                break;
            case -220:
                this.console.value = "expected end of quotes before new line";
                break;
        }


    }

    displayMachine(machine)
    {
        this.console.value =`i: ${machine.input}\nb: ${machine.blank}\ns: ${machine.start}\na: ${machine.accept}\n`;
        console.log(machine.numStates);

        for(let i = 0; i < machine.numStates;i++)
        {
            this.console.value += `${machine.states[i][0]}\n`;
            for(let j = 0; j < machine.states[i][1].length;j++)
            {
                this.console.value += `\t${machine.states[i][1][j]}\t${machine.states[i][2][j]}\n`;
            }
        }
    }
}