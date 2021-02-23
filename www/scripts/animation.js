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

var basecellpos = [];
var cellpos = [];

var speedSelector = document.getElementById("speedSelector");
var desiredSpeed = parseInt(speedSelector.value)/100 + 's';

for(let i=0;i<cell.length;i++)
{
	basecellpos[i] = parseFloat(cell[i].style.left);
	cellpos[i] = parseFloat(cell[i].style.left);
}

function moveRight()
{
	for(let i=cell.length-1;i>=0;--i)
	{
		let pos = 0;
		cell[i].style.transitionDuration = desiredSpeed;

		pos = parseFloat(cellpos[i]) - 11.11 + '%';
		if(parseFloat(pos) < -11.11)
		{
			cell[i].style.transitionDuration = '0s';
			pos = '99.99%';
			cell[i].style.left = pos;
		} else {
			cell[i].style.left = pos;
		}
		
		cellpos[i] = pos;
	}
}

function moveLeft()
{
	
	for(let i=0;i<cell.length;++i)
	{
		let pos = 0;
		cell[i].style.transitionDuration = desiredSpeed;

		pos = parseFloat(cellpos[i]) + 11.11 + '%';
		if(parseFloat(pos) > 99.99)
		{
			cell[i].style.transitionDuration = '0s';
			pos = '-11.11%';
			cell[i].style.left = pos;
		} else {
			cell[i].style.left = pos;
		}

		cellpos[i] = pos;
	}
}

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

speedSelector.oninput = function() {
	var speedSelectorValue = (parseInt(this.value) / 100);
	for(let i=0;i<cell.length;i++)
	{
		cell[i].style.transitionDuration = speedSelectorValue + 's';
		desiredSpeed = speedSelectorValue + 's';
		//console.log(desiredSpeed);
	}
}
