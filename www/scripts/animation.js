var cell = document.querySelectorAll('.tape .tape-cell');
var auxcell = document.querySelectorAll('.aux-tape .tape-cell');

var basecellpos = [];	//cell positions when website is loaded
var cellpos = [];	//live positions of each cell
var baseauxcellpos = [];	//cell positions when website is loaded
var auxcellpos = [];	//live positions of each cell

var speedSelector = document.getElementById("speedSelector");	//slider from webpage
var desiredSpeedRaw = parseInt(speedSelector.value)/100;	//raw value from slider in miliseconds
var desiredSpeed = desiredSpeedRaw + 's';
var displaySpeed = desiredSpeed;	

for(let i=0;i<cell.length;i++)
{
	basecellpos[i] = parseFloat(cell[i].style.left);
	cellpos[i] = parseFloat(cell[i].style.left);
	baseauxcellpos[i] = parseFloat(cell[i].style.left);
	auxcellpos[i] = parseFloat(cell[i].style.left);
}


function moveRight()
{
	let tapeBeginning = findBeginning();
	let tapeEnd = findEnd();

	if(tapeEnd != 100)
	{
		for(let i=tapeEnd;i>tapeBeginning;--i)
		{
			let pos = parseFloat(cellpos[i]) - 11.11 + '%';
			cell[i].style.left = pos;
			cellpos[i] = pos;
		}
	} else {
		//if initial cell in the tape is reached, alert the user
		alert('Maximum side reached.');
	}
}

function moveAuxRight()
{
	let tapeBeginning = findAuxBeginning();
	let tapeEnd = findAuxEnd();

	if(tapeEnd != 100)
	{
		for(let i=tapeEnd;i>tapeBeginning;--i)
		{
			let pos = parseFloat(auxcellpos[i]) - 11.11 + '%';
			auxcell[i].style.left = pos;
			auxcellpos[i] = pos;
		}
	} else {
		//if initial cell in the tape is reached, alert the user
		alert('Maximum auxillary side reached.');
	}
}

function moveLeft()
{
	let tapeBeginning = findBeginning();
	let tapeEnd = findEnd();
	//console.log(tapeEnd);

	if(tapeEnd != 0)
	{
		for(let i=tapeBeginning;i<tapeEnd;++i)
		{
			let pos = parseFloat(cellpos[i]) + 11.11 + '%';
			cell[i].style.left = pos;
			cellpos[i] = pos;
		}
	} else {
		//if final cell in the tape is reached, alert the user
		alert('Maximum side reached.');
	}
}

function moveAuxLeft()
{
	let tapeBeginning = findAuxBeginning();
	let tapeEnd = findAuxEnd();
	//console.log(tapeEnd);

	if(tapeEnd != 0)
	{
		for(let i=tapeBeginning;i<tapeEnd;++i)
		{
			let pos = parseFloat(auxcellpos[i]) + 11.11 + '%';
			auxcell[i].style.left = pos;
			auxcellpos[i] = pos;
		}
	} else {
		//if final cell in the tape is reached, alert the user
		alert('Maximum auxillary side reached.');
	}
}

//reset cell positions to default
function resetPos()
{
	for(let i=0;i<cell.length;++i)
	{
		let pos = 0;
		pos = parseFloat(basecellpos[i]) + '%';
		cellpos[i] = basecellpos[i];
		cell[i].style.left = pos;
	}
}

//reset aux cell positions to default
function resetAuxPos()
{
	for(let i=0;i<cell.length;++i)
	{
		let pos = 0;
		pos = parseFloat(baseauxcellpos[i]) + '%';
		auxcellpos[i] = baseauxcellpos[i];
		auxcell[i].style.left = pos;
	}
}

//finds cell one position before viewable cells on the right side
function findBeginning()
{
	let startCell = 0;

	//get cell leftmost on the tape
	do
	{
		startCell++;
	}
	while(cell[startCell].style.left == '-11.11%');

	//set startCell to one position behind previous result
	startCell -= 1;

	return startCell;
}

function findAuxBeginning()
{
	let startCell = 0;

	//get cell leftmost on the tape
	do
	{
		startCell++;
	}
	while(auxcell[startCell].style.left == '-11.11%');

	//set startCell to one position behind previous result
	startCell -= 1;

	return startCell;
}

//finds cell one position before viewable cells on the left side
function findEnd()
{
	let endCell = 100;
	//get cell rightmost on the tape
	while(cell[endCell].style.left == '99.99%')
	{
		endCell--;
	}

	//set startCell to one position behind previous result
	endCell += 1;

	return endCell;
}

function findAuxEnd()
{
	let endCell = 100;
	//get cell rightmost on the tape
	while(auxcell[endCell].style.left == '99.99%')
	{
		endCell--;
	}

	//set startCell to one position behind previous result
	endCell += 1;

	return endCell;
}

function getSpeed()
{
	desiredSpeedRaw = parseInt(speedSelector.value)/100;
	return desiredSpeedRaw;
}

//get user-selected speed from slider and post value in seconds below slider
speedSelector.oninput = function() {
	var speedSelectorValue = (parseInt(this.value) / 100);
	document.getElementById('currentSpeed').innerHTML = speedSelectorValue + ' s';
	for(let i=0;i<cell.length;i++)
	{
		cell[i].style.transitionDuration = speedSelectorValue + 's';
		auxcell[i].style.transitionDuration = speedSelectorValue + 's';
		desiredSpeed = speedSelectorValue + 's';
	}
}