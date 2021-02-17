import layout from "./layout.js";
import compiler from "./compiler.js";

let machine = undefined;

let machineLayout = new layout();
let markupCompiler = new compiler();


markupCompiler.loadCode = function () {
    this.userCode = document.getElementById('code-area').value;

    if(!this.scanTokens(this.userCode))
        machine = this.parseTokens();
    else
    {
        console.log("failed scan");
    }
};