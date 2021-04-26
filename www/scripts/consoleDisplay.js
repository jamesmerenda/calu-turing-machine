export default class consoleDisplay {
	
    constructor() {
        this.console = document.getElementById("consoleText");
        document.getElementById('clearConsole').addEventListener('click', () => this.clearConsole());
    }

    displayErrorTemp(errorNum){
        this.console.value = `error: ${errorNum}`;
    }

    clearConsole()
    {
        this.console.value = "";
    }

    testFunction()
    {
        this.console.innerHTML = "it works";
    }
	
	setValue(value) {
		this.console.value += value;
		this.console.value = value;
	}

    displayMachine(machine) 
    {	
        this.console.value =`Successful Machine Build!\n\n`;
        this.console.value +=`input:\t\t\t\"${machine.input}\"\n`;
        this.console.value +=`blank character:\t\"${machine.blank}\"\n`;
        this.console.value +=`starting state:\t\t${machine.start}\n`;
        this.console.value +=`accepting state:\t${machine.accept}\n\n`;

        this.console.value =`Successful Machine Build!
		i: ${machine.input}
		b: "${machine.blank}"
		s: ${machine.start}
		a: ${machine.accept}\n`;

        for(let i = 0; i < machine.numStates;i++)
        {
            let numOfValues = 0;
            this.console.value += `${machine.states[i][0]}:\n`

            while(numOfValues < machine.states[i][1].length)
            {
                this.console.value += `\tread:\"${machine.states[i][1][numOfValues]}\"`;

                let WDN = machine.states[i][2][numOfValues];

                this.console.value += `   write:\"`;
                WDN = WDN.replace("\n",'\"   direction:\"');
                WDN = WDN.replace("\n",'\"   next state:\"');

                this.console.value += `${WDN}\"\n`;

                numOfValues++;
            }
        }

    }

    machineIsStuckInAStateThatDoesNotExist(stateStuckIn, lastState)
    {
        this.console.value = `The machine is stuck in -${stateStuckIn} (Transistioned to from ${lastState})
        Possible causes:
                        1. -${stateStuckIn} does not have any transition functions defined for the symbol under read head`;
    }

    stateHasNoAvailableTransitions(stateStuckIn, currentRead)
    {
        this.console.value = `The machine is stuck in -${stateStuckIn}
        Possible causes:
                        1. -${stateStuckIn} does not have any transition functions defined for ${currentRead}`;
    }
}