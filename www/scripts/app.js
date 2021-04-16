import layout from "./layout.js";
import compiler from "./compiler.js";
import consoleDisplay from "./consoleDisplay.js";
<<<<<<< HEAD
import machine from "./machine.js";
=======
//import stateDiagram from "./stateDiagram.js";
>>>>>>> 3bf2503a73b304c750a66aa2dc6b997708bc4e74

let turingMachine = new machine();

let machineLayout = new layout();
let markupCompiler = new compiler();
let machineConsole = new consoleDisplay();

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

    if(appError < 0) //should probably have a generic error here since it should have already thrown errors
        console.log(appError);
    else
    {
        machineConsole.displayMachine(turingMachine);
	}
};