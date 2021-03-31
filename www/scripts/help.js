var helpWindowCodeEditor = document.querySelector('#help-code-editor-message');
var helpWindowMachine = document.querySelector('#help-machine-message');
var helpWindowStateDiagram = document.querySelector('#help-state-diagram-message');
var helpWindowConsole = document.querySelector('#help-console-message');

//information button display in transition editor
document.getElementById('help-code-editor').addEventListener('click', (event) => {
	if(helpWindowCodeEditor.style.display === 'none')
	{
		helpWindowCodeEditor.style.display = 'block';
		document.getElementById('help-code-editor').innerHTML = '&#x2715;';
	} else {
		helpWindowCodeEditor.style.display = 'none';
		document.getElementById('help-code-editor').innerHTML = '&#x1F6C8;';
	}
});

//information button display in animator
document.getElementById('help-machine').addEventListener('click', (event) => {
	if(helpWindowMachine.style.display === 'none')
	{
		helpWindowMachine.style.display = 'block';
		document.getElementById('help-machine').innerHTML = '&#x2715;';
	} else {
		helpWindowMachine.style.display = 'none';
		document.getElementById('help-machine').innerHTML = '&#x1F6C8;';
	}
});

//information button display in state diagram
document.getElementById('help-state-diagram').addEventListener('click', (event) => {
	if(helpWindowStateDiagram.style.display === 'none')
	{
		helpWindowStateDiagram.style.display = 'block';
		document.getElementById('help-state-diagram').innerHTML = '&#x2715;';
	} else {
		helpWindowStateDiagram.style.display = 'none';
		document.getElementById('help-state-diagram').innerHTML = '&#x1F6C8;';
	}
});

//information button display in console
document.getElementById('help-console').addEventListener('click', (event) => {
	if(helpWindowConsole.style.display === 'none')
	{
		helpWindowConsole.style.display = 'block';
		document.getElementById('help-console').innerHTML = '&#x2715;';
	} else {
		helpWindowConsole.style.display = 'none';
		document.getElementById('help-console').innerHTML = '&#x1F6C8;';
	}
});