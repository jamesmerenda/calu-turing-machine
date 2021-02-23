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
var tapeIndex = 5;
var tapeInput;

var inputButton = document.getElementById('enterInput');

var step = document.getElementById('step');

inputButton.onclick = function() {
	let inputIndex = 0;
	tapeInput = document.getElementById('tapeInput').value;

	tapeValues.splice(0,tapeValues.length);
	for(let i=0;i<tapeInput.length;++i)
	{
		//cell[i].childNodes[1].innerHTML = tapeInput[inputIndex];
		//viewedValues[i] = tapeInput[inputIndex];
		tapeValues.push(tapeInput[i]);
		//console.log(tapeValues);
	}

	//call mapViewedTapeValues()
}

function mapViewedTapeValues() 
{

}