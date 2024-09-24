function StatrGameEasy() 
{
	window.location.href = 'Game.html';
	let Name = document.getElementById("input-the-name").value
	let showName = document.getElementById("show-name")
	
}

function StartGameHard() 
{
	window.location.href = 'Game.html';
	game()
	
}

function Return()
{
	window.location.href = 'Home.html';
}

document.addEventListener("DOMContentLoaded", game() )

function game() 
{
	let canvas = document.getElementById('canvas');
	let ctx = canvas.getContext('2d');
	let rows = 8;
	let cols = 8;
	let cellSize = canvas.width / cols;
	// رسم المصفوفة
	for (let row = 0; row < rows; row++) 
	{
		for (let col = 0; col < cols; col++)
		{
			// حساب إحداثيات المربع
			let x = col * cellSize;
			let y = row * cellSize;
			// رسم حدود المربع
			ctx.strokeStyle = '#000';
			ctx.strokeRect(x, y, cellSize, cellSize);
    	}
	}
}