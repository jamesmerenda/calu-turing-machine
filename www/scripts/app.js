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
<<<<<<< HEAD
    else{
        console.log("compiler failed");
=======
    else
    {
		console.log("compiler failed");
>>>>>>> fac82f3f55b2663d62d637aa3d6bcce098e70361
        machineConsole.displayError(markupCompiler.getErrorCode());
    }

    if(machine == undefined)
        machineConsole.displayError(markupCompiler.getErrorCode(), markupCompiler.getErrorContext());
    else
    {
        machineConsole.displayMachine(machine);
		
		let diagram = new stateDiagram(machine.getStates(), machine.getStart(), machine.getAccept());
		diagram.drawDiagram();
	}
};