export default class consoleDisplay {
	
    constructor() {
        this.console = document.getElementById("consoleText");
        document.getElementById('clearConsole').addEventListener('click', () => this.clearConsole());
    }

    clearConsole()
    {
        this.console.value = "";
    }
	
	setValue(value) {
		this.console.value += value;
	}

    displayMachine(machine) 
    {
        this.console.value =`Successful Machine Build!\n\n`;
        this.console.value +=`input:\t\t\t\"${machine.input}\"\n`;
        this.console.value +=`blank character:\t\"${machine.blank}\"\n`;
        this.console.value +=`starting state:\t\t${machine.start}\n`;
        this.console.value +=`accepting state:\t${machine.accept}\n\n`;

        //console.log(machine.states);
        //console.log(machine.states[0][1].length);

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
}