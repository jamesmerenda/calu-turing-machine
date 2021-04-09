//define all existing cells
var cell = document.querySelectorAll('.tape .tape-cell');
var auxcell = document.querySelectorAll('.aux-tape .tape-cell');

//get value from cell in main tape under read head
function getCellUnderHead()
{
	return cell[findBeginning() + 5].querySelector('.cell-contents').innerHTML;
}

//get value from cell in auxillary tape under read head
function getAuxCellUnderHead()
{
	return cell[findAuxBeginning() + 5].querySelector('.cell-contents').innerHTML;
}

//apply transition result to cell under read head
function updateCell(result)
{
	let cellUnderHead = findBeginning() + 5;
	cell[cellUnderHead].querySelector('.cell-contents').innerHTML = result;
}

//apply transition result to auxillary cell under read head
function updateAuxCell(result)
{
	let cellUnderHead = findAuxBeginning() + 5;
	auxcell[cellUnderHead].querySelector('.cell-contents').innerHTML = result;
}

//reset tapes to default states
function updateTape(updatedTape, blankChar)
{
	//reset cells to default positions
	resetPos();
	resetAuxPos();
	//clear contents from cells add
	for(let i=0;i<cell.length;++i)
	{
		cell[i].querySelector('.cell-contents').innerHTML = blankChar;
		auxcell[i].querySelector('.cell-contents').innerHTML = blankChar;
	}
	let tapeBeginning = findBeginning();
	for(let i=tapeBeginning+5;i<cell.length;++i)
	{
		if(updatedTape[i-(tapeBeginning+5)] != undefined)
		{
			cell[i].querySelector('.cell-contents').innerHTML = updatedTape[i-(tapeBeginning+5)];
		}
	}
}