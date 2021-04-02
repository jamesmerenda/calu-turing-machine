import layout from "./layout.js";
import compiler from "./compiler.js";
import consoleDisplay from "./consoleDisplay.js";

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
    else{
        console.log("compiler failed");
    }
};