//collection of example programs from user select
var programs = [
[
'Binary Increment',

`input = "1011";
blank = " ";
start = moveright;
accept = finish;

-moveright      1   [1, r, moveright]
    		0   [0, r, moveright]
    		" " [" ", l, carry];
-carry 		1   [0, l, carry]
		0   [1, l, finish]
		" " [1, l, finish];
-finish;`
],
[
'Palindrome',

`input = "0110";
blank = " ";
start = start;
accept = accept;

-start 0   [" ", r, have0]
       1   [" ", r, have1]
       " " [" ", r, accept];

-have0 0   [0, r, have0]
       1   [1, r, have0]
       " " [" ", l, match0];

-have1 0   [0, r, have1]
       1   [1, r, have1]
       " " [" ", l, match1];

-match0 0   [" ", l, back]
	1   [1, l, reject]
	" " [" ", l, accept];

-match1 1   [" ", l, back]
	0   [0, l, reject]
	" " [" ", l, accept];

-back 0   [0, l, back]
      1   [1, l, back]
      " " [" ", r, start];

-reject
-accept;`
],
[
'Binary Addition',

`input = "110110 101011";
blank = " ";
start = q0;
accept = qf;

-q0 " " [" ", r, q1]
	0	[0, r, q0]
	1	[1, r, q0];

-q1 " " [0, l, q2]
	0	[0, r, q1]
	1	[1, r, q1];

-q2 0 	[" ", l, q3x]
	1	[" ", l, q3y]
	" "	[" ", l, q7];

-q3x " " [" ", l, q4x]
	 0	 [0, l, q3x]
	 1	 [1, l, q3x];

-q3y " " [" ", l, q4y]
	 0	 [0, l, q3y]
	 1	 [1, l, q3y];

-q4x 0   [x, r, q0]
	 1 	 [y, r, q0]
	 " " [x, r, q0]
	 x	 [x, l, q4x]
	 y	 [y, l, q4x]

-q4y 0	 [1,]

-q7

-qf;`
],
[
'Binary Pong',

`input = "0 1";
blank = " ";
start = start;
accept = never;

-start 0   [1, r, ping]
       1   [0, r, ping];

-ping " " [" ", r, ping]
      1   [0, l, pong]
      0   [1, l, pong];

-pong " " [" ", l, pong]
      1	  [0, r, ping]
      0	  [1, r, ping];

-never;`
],
[
'The Classic',

`input = " ";
blank = " ";
start = b;
accept = never;

-b " " [0, r, c];
-c " " [" ", r, e];
-e " " [1, r, f];
-f " " [" ", r, b];

-never;`
],
[
'Binary Complement',

`input = "1011";
blank = " ";
start = q0;
accept = qf;

-q0 1   [0, r, q0]
    0   [1, r, q0]
    " " [" ", l, qf];
-qf;`
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