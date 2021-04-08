import layout from "./layout.js";
import compiler from "./compiler.js";
import consoleDisplay from "./consoleDisplay.js";
import stateDiagram from "./stateDiagram.js";

let machine = undefined;

let machineLayout = new layout();
let markupCompiler = new compiler();
let machineConsole = new consoleDisplay();

markupCompiler.loadCode = function () {
    machine = undefined;
	
    this.userCode = document.getElementById('code-area').value;
    if(!this.scanTokens()){ //while still tokens to scan
        machine = this.parseTokens();
    }
    else
    {
		console.log("compiler failed");
        machineConsole.displayError(markupCompiler.getErrorCode());
    }

    if(machine == undefined) //should probably have a generic error here since it should have already thrown errors
        machineConsole.displayError(markupCompiler.getErrorCode(), markupCompiler.getErrorContext());
    else
    {
        machineConsole.displayMachine(machine);
		
		let diagram = new stateDiagram(machine.getStates(), machine.getStart(), machine.getAccept());
		diagram.drawDiagram();
	}
};