//define all existing cells
var cell = [document.getElementById('0'),document.getElementById('1'),document.getElementById('2'),
			document.getElementById('3'),document.getElementById('4'),document.getElementById('5'),
			document.getElementById('6'),document.getElementById('7'),document.getElementById('8'),
			document.getElementById('9'),document.getElementById('10'),document.getElementById('11'),
			document.getElementById('12'),document.getElementById('13'),document.getElementById('14'),
			document.getElementById('15'),document.getElementById('16'),document.getElementById('17'),
			document.getElementById('18'),document.getElementById('19'),document.getElementById('20'),
			document.getElementById('21'),document.getElementById('22'),document.getElementById('23'),
			document.getElementById('24'),document.getElementById('25'),document.getElementById('26'),
			document.getElementById('27'),document.getElementById('28'),document.getElementById('29'),
			document.getElementById('30'),document.getElementById('31'),document.getElementById('32'),
			document.getElementById('33'),document.getElementById('34'),document.getElementById('35'),
			document.getElementById('36'),document.getElementById('37'),document.getElementById('38'),
			document.getElementById('39'),document.getElementById('40'),document.getElementById('41'),
			document.getElementById('42'),document.getElementById('43'),document.getElementById('44'),
			document.getElementById('45'),document.getElementById('46'),document.getElementById('47'),
			document.getElementById('48'),document.getElementById('49'),document.getElementById('50'),
				document.getElementById('51'),document.getElementById('52'),
			document.getElementById('53'),document.getElementById('54'),document.getElementById('55'),
			document.getElementById('56'),document.getElementById('57'),document.getElementById('58'),
			document.getElementById('59'),document.getElementById('60'),document.getElementById('61'),
			document.getElementById('62'),document.getElementById('63'),document.getElementById('64'),
			document.getElementById('65'),document.getElementById('66'),document.getElementById('67'),
			document.getElementById('68'),document.getElementById('69'),document.getElementById('70'),
			document.getElementById('71'),document.getElementById('72'),document.getElementById('73'),
			document.getElementById('74'),document.getElementById('75'),document.getElementById('76'),
			document.getElementById('77'),document.getElementById('78'),document.getElementById('79'),
			document.getElementById('80'),document.getElementById('81'),document.getElementById('82'),
			document.getElementById('83'),document.getElementById('84'),document.getElementById('85'),
			document.getElementById('86'),document.getElementById('87'),document.getElementById('88'),
			document.getElementById('89'),document.getElementById('90'),document.getElementById('91'),
			document.getElementById('92'),document.getElementById('93'),document.getElementById('94'),
			document.getElementById('95'),document.getElementById('96'),document.getElementById('97'),
			document.getElementById('98'),document.getElementById('99'),document.getElementById('100')
			];

var tapeInput;
var inputButton = document.getElementById('enterInput');
//get current beginning of viewable cells
var tapeBeginning = findBeginning();

inputButton.onclick = function() {
	//reset cells to default positions
	resetPos();
	//reset beginning of tape var
	tapeBeginning = findBeginning()
	//clear contents from cells
	for(let i=0;i<cell.length;++i)
	{
		cell[i].querySelector('.cell-contents').innerHTML = '';
	}
	//get values inputted from user
	tapeInput = document.getElementById('tapeInput').value;
	//write values from input to cells from middle cell
	for(let i=tapeBeginning+5;i<cell.length;++i)
	{
		if(tapeInput[i-(tapeBeginning+5)] != undefined)
		{
			cell[i].querySelector('.cell-contents').innerHTML = tapeInput[i-(tapeBeginning+5)];
		}
	}
}