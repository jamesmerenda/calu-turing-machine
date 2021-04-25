export default class layout{
    constructor()
    {

        this.codeArea = document.getElementById('code-area');
        this.lineNumbers = document.getElementById('line-numbers');
        var lineCount = 1;
        this.consoleShown = 1;
        this.editorShown = 1;
        this.machineShown = 1;
        this.layout = 1;

        //initializes functions so they can be defined in main/index.js

        //adds scroll event listener to code-area. allows the sync with line-numbers scroll
        document.getElementById('code-area').addEventListener('scroll', (event) => {
 
        //function to run on scroll
            this.syncEditorScroll();
        });

        /*
        adds input listener to code-area
        
        if the number of lines changes in code-area, then the number of lines shown in line-numbers will be synced
        */
        document.getElementById('code-area').addEventListener('input', (event) => {
            
            var linesActual = this.countLines();
            //function to run on input
                if(linesActual != lineCount)
                {
                    lineCount = linesActual;
                    this.lineNumbers.value = "";
                    for(let i = 1;i <= lineCount;i++)
                    {
                        this.lineNumbers.value += i +"\n";
                    }
                }
            });

        //adds click event listener to the reset button
        document.getElementById('select').addEventListener('click', (event) => {
            const isButton = event.target.nodeName === 'BUTTON';
            if (!isButton) {
                return;
            }
            //function to run on click
            this.onSelectClick();
            });

                    //adds click event listener to the reset button
        document.getElementById('toggle_console').addEventListener('click', (event) => {
            const isButton = event.target.nodeName === 'BUTTON';
            if (!isButton) {
                return;
            }
            //function to run on click
                this.toggleConsole();
            });

        document.getElementById('toggle_editor').addEventListener('click', (event) => {
            const isButton = event.target.nodeName === 'BUTTON';
            if (!isButton) {
                return;
            }
            //function to run on click
                this.toggleEditor();
            });

        document.getElementById('toggle_machine').addEventListener('click', (event) => {
            const isButton = event.target.nodeName === 'BUTTON';
            if (!isButton) {
                return;
            }
            //function to run on click
                this.toggleMachine();
            });

    }

    onLoadClick(){
        console.log(document.getElementById("code-area").value);
    }

    onSelectClick(){
        console.log("Select");
    }

    //syncs line-numbers with code-area scroll
    syncEditorScroll(){
        this.lineNumbers.scrollTop = this.codeArea.scrollTop;
    }

    //returns number of lines of text are in code-area
    countLines()
    {
        let lines = 1;
        for(let i = 0; i <= this.codeArea.value.length;i++)
        {
            if(this.codeArea.value[i] == '\n')
                lines++;
        }
        return lines;
    }

    toggleConsole()
    {
        if(this.consoleShown){
            document.getElementById("console").style.display = "none";
            document.getElementById("editor").style.bottom = "1%";
            document.getElementById("machine").style.bottom = "1%";
        }
        
        else{
            document.getElementById("console").style.display = "";
            document.getElementById("editor").style.bottom = "27%";
            document.getElementById("machine").style.bottom = "27%";
        }

        this.consoleShown = !this.consoleShown;
    }

    toggleEditor()
    {
        if(this.machineShown == 1)
        {
            if(this.editorShown){
                document.getElementById("editor").style.display = "none";
                document.getElementById("machine").style.left = "1%";
            }
            
            else{
                document.getElementById("editor").style.display = "";
                document.getElementById("machine").style.left = "50.35%";
            }

            this.editorShown = !this.editorShown;
        }
    }

    toggleMachine()
    {
        if(this.editorShown == 1)
        {
            if(this.machineShown){
                document.getElementById("machine").style.display = "none";
                document.getElementById("editor").style.right = "1%";
            }
            
            else{
                document.getElementById("machine").style.display = "";
                document.getElementById("editor").style.right = "50.35%";
            }

            this.machineShown = !this.machineShown;
        }
    }
}