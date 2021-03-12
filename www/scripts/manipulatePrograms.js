var programs = [
[
'Program 1',

`This is content associated with Program 1.
This is more of the program body.
Probably more here.
The end of this program.`
],
[
'Program 2',

`This is content associated with Program 2.
This is more of the program body.
Probably more here.
The end of this program.`
],
[
'Program 3',

`This is content associated with Program 3.
This is more of the program body.
Probably more here.
The end of this program.`
],
[
'Program 4',

`This is content associated with Program 4
This is more of the program body.
Probably more here.
The end of this program.`
],
[
'Program 5',

`This is content associated with Program 5.
This is more of the program body.
Probably more here.
The end of this program.`
],
[
'Program 6',

`This is content associated with Program 6.
This is more of the program body.
Probably more here.
The end of this program.`
],
[
'Program 7',

`This is content associated with Program 7.
This is more of the program body.
Probably more here.
The end of this program.`
],
[
'Program 8',

`This is content associated with Program 8
This is more of the program body.
Probably more here.
The end of this program.`
],

];

var cWindow = document.getElementById('consoleText');

//display list of example programs
document.getElementById('select').addEventListener('click', (event) => {
	let list = document.getElementById('selection_list');
	if(list.style.display === 'none')
	{
		list.style.display = 'block';
	} else {
		list.style.display = 'none';
	}
});

//check to see if user loses focus in selection window
document.getElementById('selection_list').addEventListener('mouseleave', function(e) {
  	var container = document.getElementById('selection_list');
  	container.style.display = 'none';
});

//retrieve clicked program option and load related program
document.querySelectorAll('#selection_option').forEach(item => {
	item.addEventListener('click', event =>{
		//console.log(item.innerHTML);
		let list = document.getElementById('selection_list');
		let selectedProgram = item.innerHTML;
		loadSelectedProgram(selectedProgram);
		list.style.display = 'none';
	})
});

//find program associated with passed name
function loadSelectedProgram(selectedProgram)
{
	document.getElementById('code-area').value = '';

	let pName = selectedProgram;
	let rProgram;

	for(let i=0;i<programs.length;i++)
	{
		if(programs[i][0] === pName)
		{
			rProgram = programs[i][1];
		}
	}

	document.getElementById('code-area').value += rProgram;
	cWindow.value = `${pName} successfully loaded.`;
}

//upload a file via file button
document.getElementById('upload').addEventListener('change', function() {
	document.getElementById('code-area').value = '';

	let fr = new FileReader();
	fr.onload = function(){
		document.getElementById('code-area').value += fr.result;
	}

	fr.readAsText(this.files[0]);
});

//save machine from website via text document.
document.getElementById('save').addEventListener('click', function() {
	let fileName = prompt('Enter the name you wish to save the machine as: ', 'myMachine.txt');
	let abort = false;

	if (fileName == null || fileName == '') {
		cWindow.value = 'File name was left empty, aborting file save.';
		abort = true;
	} else {
		cWindow.value = `File name: ${fileName} was chosen.\n`;
	}	

	if(!abort)
	{
		let machineText = document.getElementById('code-area').value;
		let blob = new Blob([machineText], {type:'text/plain'});
		let link = document.createElement('a');

		link.download = fileName;
		link.href = window.URL.createObjectURL(blob);

		document.body.appendChild(link);
		link.click();

		cWindow.value += `File ${fileName} successfully created.`;

		setTimeout(() => {
			document.body.removeChild(link);
			window.URL.revokeObjectURL(link.href);
		}, 100);
	}
});