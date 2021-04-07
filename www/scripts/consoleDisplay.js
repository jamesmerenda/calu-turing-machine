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
        this.console.value =`Successful Machine Build!\ni: ${machine.input}\nb: ${machine.blank}\ns: ${machine.start}\na: ${machine.accept}\n`;

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