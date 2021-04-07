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

    displayMachine(machine) //don't need \n for template literals 
    {
        this.console.value =`Successful Machine Build!
		i: ${machine.input}
		b: ${machine.blank}
		s: ${machine.start}
		a: ${machine.accept}\n`;

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