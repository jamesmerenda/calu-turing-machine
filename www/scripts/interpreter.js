var cell = [document.getElementById('0'),
			document.getElementById('1'),
			document.getElementById('2'),
			document.getElementById('3'),
			document.getElementById('4'),
			document.getElementById('5'),
			document.getElementById('6'),
			document.getElementById('7'),
			document.getElementById('8'),
			document.getElementById('9'),
			document.getElementById('10')];

var viewedValues = ['','','','','','','','','','',''];
var tapeValues = [];
var tapeInput;
var beginningOfTape;
var tapeValuesOffset = 0;

var inputButton = document.getElementById('enterInput');

//document.getElementById("left").addEventListener();
//document.getElementById("right").addEventListener();
//document.getElementById("reset").addEventListener();

inputButton.onclick = function() {
	//add check to see if input already exists or keep it like this
	tapeValues.splice("",tapeValues.length);
	resetPos();
	//moveLeft();
	let inputIndex = 0;
	tapeInput = document.getElementById('tapeInput').value;

	for(let i=0;i<tapeInput.length;++i)
	{
		if(i + 5 < viewedValues.length)
		{
			viewedValues[i+5] = tapeInput[i];
		}
		tapeValues.push(tapeInput[i]);
	}
	console.log(viewedValues);
	console.log(tapeValues);

	mapViewedTapeValues();
}

function mapViewedTapeValues() 
{
	beginningOfTape = getBeginningOfTape();
	let currentCell = beginningOfTape;
	//enter values to cells
	console.log(currentCell);
	for(let i=0;i<viewedValues.length;++i)
	{
		if(currentCell > 10)
		{
			currentCell = 0;
		} 
		cell[currentCell].childNodes[1].innerHTML = viewedValues[i];
		currentCell++;
	}

	
}

function getBeginningOfTape()
{
	let winner = '999%';
	let leftmostCell;
	for(let i=0;i<11;++i)
	{
		if(parseFloat(cell[i].style.left) < parseFloat(winner))
		{
			winner = cell[i].style.left;
			leftmostCell = i;
		}
	}

	console.log(leftmostCell);

	return leftmostCell;
}

function calculateViewableTapeValues()
{

}