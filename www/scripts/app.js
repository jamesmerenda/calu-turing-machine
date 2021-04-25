import layout from "./layout.js";
import compiler from "./compiler.js";
import consoleDisplay from "./consoleDisplay.js";
import machine from "./machine.js";

<<<<<<< HEAD

=======
let turingMachine = new machine();
>>>>>>> c45789e6842434812ab203d19b60948013d5b155

window.machine = undefined;
let machineLayout = new layout();
let markupCompiler = new compiler();
let machineConsole = new consoleDisplay();

let turingMachine = new machine(machineConsole);

var appError;//temporary fix

markupCompiler.loadCode = function () {
    this.userCode = document.getElementById('code-area').value;
    appError = this.scanTokens();
    if(!appError){ //while still tokens to scan
        appError = this.parseTokens(turingMachine);
    }
	else{
		console.log("compiler failed");
    }

    if(appError < 0){ //should probably have a generic error here since it should have already thrown errors
        console.log(appError);
        machineConsole.displayErrorTemp(appError);
    }
    else
    {
        machineConsole.displayMachine(turingMachine);
    }
};