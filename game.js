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
