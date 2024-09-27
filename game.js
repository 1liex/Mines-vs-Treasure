function StatrGameEasy() 
{
    let Name = document.getElementById("input-the-name").value;
    
    // تحقق إذا كان الاسم موجود
    if (!Name) {
        alert("HELLO ! \n Enter your name first"); // رسالة خطأ
        return;
    }

    localStorage.setItem("playerName", Name); // تخزين الاسم
    window.location.href = 'Game.html'; // الانتقال إلى الصفحة الثانية
}
//----------------------------------------------------------------------------------------------------------
function StartGameHard() 
{
    let Name = document.getElementById("input-the-name").value;
    if (!Name) 
	{
        alert("HELLO ! \n Enter your name first"); // رساله خطأ
        return;
    }
    localStorage.setItem("playerName", Name); // تخزين الاسم
    window.location.href = 'Game.html'; // الانتقال إلى الصفحة الثانية
}
//----------------------------------------------------------------------------------------------------------
function game() 
{
	let canvas = document.getElementById('canvas');
	let ctx = canvas.getContext('2d');
	let rows = 8;
	let cols = 8;
	let cellSize = canvas.width / cols;
	// رسم المصفوفة
	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			// حساب إحداثيات المربع
			let x = col * cellSize;
			let y = row * cellSize;
			// رسم حدود المربع
			ctx.strokeStyle = '#000';
			ctx.strokeRect(x, y, cellSize, cellSize);
		}
	}
}
//----------------------------------------------------------------------------------------------------------
function close() {
	if (confirm("Are you sure about that?"))
	{
		window.close();
	}
}
//----------------------------------------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function() 
{
	let showName = document.getElementById("show-name"); 
	let playerName = localStorage.getItem("playerName"); // استرجاع الاسم
	showName.textContent = `Welcome ${playerName}` ; // عرض الاسم وطباعته 
	game(); 
});