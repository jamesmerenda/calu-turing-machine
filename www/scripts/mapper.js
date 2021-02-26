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
document.getElementById('moverightbtn').addEventListener('click', function(){tapeValuesOffset++;calculateViewableTapeValues();});
document.getElementById('moveleftbtn').addEventListener('click', function(){tapeValuesOffset--;calculateViewableTapeValues();});
document.getElementById('resetposbtn').addEventListener('click', function(){tapeValuesOffset = 0;calculateViewableTapeValues();});

inputButton.onclick = function() {
	//add check to see if input already exists or keep it like this
	tapeValues.splice("",tapeValues.length);
	resetPos();
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

	mapViewedTapeValues();
}

function mapViewedTapeValues() 
{
	beginningOfTape = getBeginningOfTape();
	let currentCell = beginningOfTape;

	//map values to tape
	for(let i=0;i<viewedValues.length;++i)
	{
		cell[i].childNodes[1].innerHTML = viewedValues[i];
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

	//console.log(leftmostCell);

	return leftmostCell;
}

function calculateViewableTapeValues()
{

	//for(let i=0;i<tapeValues.length;++i)
	//{
	//	viewedValues[(i + 5 - (tapeValuesOffset))] = tapeInput[i];
	//}

	//console.log(viewedValues);
	//mapViewedTapeValues();
}