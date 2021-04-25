//collection of example programs from user select
var programs = [
[
'Binary Increment',

`# Binary Increment - takes a binary number and increments 
#                    it by 1.
# Input - a single binary number without spaces.
# Output - the sum of the binary number plus 1.

input = "1011";
blank = " ";
start = moveright;
accept = finish;

# move to the end of the binary number.
-moveright      1   [1, r, moveright]
    		0   [0, r, moveright]
    		" " [" ", l, carry];

# increment rightmost digit and update following digits.
-carry 		1   [0, l, carry]
		0   [1, l, reset]
		" " [1, l, reset];

# set read head to first item of result.
-reset 		" "	[" ", r, finish]
		0	[0, l, reset]
		1	[1, l, reset];

-finish;`
],
[
'Palindrome',

`# Palindrome - accepts binary palindromes.
# Input - a binary number that mirrors in the middle, 
#         including an empty value.
# Output - none.

input = "0110";
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

-reject;
-accept;`
],
[
'Binary Addition',

`# Binary Addition - takes two binary numbers and sums 
#                   them together.
# Input - two binary numbers separated by a space.
# Output - the sum of the two binary numbers entered.

input = "110110 101011";
blank = " ";
start = q0;
accept = qf;

# move to the right until a blank space is encountered.
-q0 " " [" ", r, q1]
    0	[0, r, q0]
    1	[1, r, q0]
    x	[x, r, q0]
    y	[y, r, q0];

# move right until another space is encountered.
-q1 " " [" ", l, q2]
    0	[0, r, q1]
    1	[1, r, q1];

# when a blank space is encountered, move left and remove
# the first digit seen or a blank space is encountered.
-q2 0 	[" ", l, q3x]     # branching path for 0
    1	[" ", l, q3y]     # branching path for 1
    " "	[" ", l, q7];     # cleanup

# move left until a blank space is encountered, ignoring 
# 0 and 1.
# branching path for 0.
-q3x " " [" ", l, q4x]
     0	 [0, l, q3x]
     1	 [1, l, q3x];

# move left until a blank space is encountered, ignoring 
# 0 and 1.
# branching path for 1.
-q3y " " [" ", l, q4y]
     0	 [0, l, q3y]
     1	 [1, l, q3y];

# accepts the rightmost digit from the first binary number.
# if the number is a 0, it is replaced with an x.
# if the number is a 1, it is replaced with a y.
# if a blank space is encountered, add an x symbol.
# this occurs all while ignoring x and y symbols.
-q4x 0   [x, r, q0]
     1 	 [y, r, q0]
     " " [x, r, q0]
     x	 [x, l, q4x]
     y	 [y, l, q4x];

# accepts the rightmost digit from the first binary number.
# if the number is a 0, it is replaced with a 1.
# if the number is a 1, a carry occurs and maintains the same
# state until a 0 or blank space is encountered and write 1.
# this occurs all while ignoring x and y symbols.
-q4y 0	 [1, l, q5]
     1	 [0, l, q4y]
     " " [1, r, q5]
     x	 [x, l, q4y]
     y 	 [y, l, q4y];

# move to the right until a symbol is encountered, then move
# left.
-q5 " "	[" ", l, q6]
    0	[0, r, q5]
    1	[1, r, q5]
    x	[x, l, q6]
    y 	[y, l, q6];

# replace 0 with x and 1 with y, then return to repeat the cycle.
-q6 0	[x, r, q0]
    1	[y, r, q0];

# clean up symbols and return to the beginning of the binary sum
# calculated.
-q7 x	[0, l, q7]
    y	[1, l, q7]
    " " [" ", r, qf]
    0	[0, l, q7]
    1	[1, l, q7];

-qf;`
],
[
'Binary Pong',

`# Binary Pong - the read head bounces back and forth.
# Input - a binary digit and another binary digit separated by a space.
# Output - a really intense game of table tennis.

input = "0 1";
blank = " ";
start = start;
accept = never;

# first serve on the left side.
-start 0   [1, r, ping]
       1   [0, r, ping];

# receives the pitch and passes back.
-ping " " [" ", r, ping]
      1   [0, l, pong]
      0   [1, l, pong];

# also receives and hits back.
-pong " " [" ", l, pong]
      1	  [0, r, ping]
      0	  [1, r, ping];

# the game will never end
-never;`
],
[
'The Classic',

`# The Classic - The first example machine given by Alan Turing
#               in his 1936 paper:
#               "On Computable Numbers, with an 
#               Application to the Entscheidungsproblem".
# Input - none
# Output - an endless sequence of 0 1 0 1...

input = " ";
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

`# Binary Complement - accepts a binary number and outputs the complement of it.
# Input - a binary number.
# Output - the binary complement of the input.

input = "1011";
blank = " ";
start = q0;
accept = qf;

-q0 1   [0, r, q0]
    0   [1, r, q0]
    " " [" ", l, q1];
-q1 1	[1, l, q1]
	0	[0, l, q1]
	" " [" ", r, qf];

-qf;`
],
[
'x-y, where x is greater than y',
`# x-y, where x is greater than y - accepts two strings of 1s separated by a
                                   0 and outputs the difference of x and y.
# Input -  two strings of 1s separated by a 0.
# Output - the difference between x and y.

input = "1111011";
blank = " ";
start = q0;
accept = qf;

-q0 1   [1, r, q0]
    0   [0, r, q0]
    " " [" ", l, q1];

-q1 1 [" ", l, q2]
    0 [" ", l, q4];

-q2 1 [1, l, q2]
    0 [0, l, q3];

-q3 1 [0, r, q0]
    0 [0, l, q3];

-q4 0   [" ", l, q4]
    1   [1, l, q4]
    " " [" ", r, qf];

-qf;`
],
[
'wcw, where w is an element of {a,b}*',
`# wcw, where w is an element of {a,b}* - accepts two strings of a combination of
                                         a's and b's in the same order separated
                                         by a c.
# Input -  two strings of 1s separated by a 0.
# Output - if each side matches, an equal amount of y's on each side of a c.

input = "aabcaab";
blank = " ";
start = q0;
accept = qf;

-q0 a [x, r, q1]
	b [x, r, q2]
	c [c, r, q6];

-q1 a [a, r, q1]
	b [b, r, q1]
	c [c, r, q3];

-q2 a [a, r, q2]
	b [b, r, q2]
	c [c, r, q4];

-q3 a [y, l, q5]
	y [y, r, q3];

-q4 b [y, l, q5]
	y [y, r, q4];

-q5 c [c, l, q5]
	b [b, l, q5]
	a [a, l, q5]
	x [x, r, q0]
	y [y, l, q5];

-q6 y [y, r, q6]
	" " [" ", l, qf];

-qf;

`
]
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
		console.log(item.innerHTML);
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