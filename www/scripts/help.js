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

function helpMessage(){
	document.getElementById('code-area').value += 
	'# Welcome to the Virtualization of a Turing Machine website!\n\n' +
	'# To get started, check out the pre-made machines in the\n' +
	'# \"Select Pre-Made Machine\" menu or write your own here! \n' +
	'# From there, click the Compile button then click Play in \n' +
	'# the animation window on the right.\n\n' +
	'# For details on each area of this page,\n' +
	'# click the information button symbol located in the top \n' +
	'# right of each window for explanations on controls and\n' +
	'# other interactions.\n\n' +
	'# For anything else, check the User\'s Manual in the\n' +
	'# Documentation tab.'
	;
};