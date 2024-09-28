let ChancesEasy = 15; // عدد الفرص للمستوى السهل
let ChancesHard = 10; // عدد الفرص للمستوى الصعب
let Scor = 0; // نقاط اللاعب

// التأكد من الصفحة الحالية عند تحميل الصفحة
window.onload = function() {
    let currentPath = window.location.pathname;

    // إذا كانت الصفحة الرئيسية (Home.html)
    if (currentPath.includes('Home.html')) {
        initializeHomePage();
    }
    // إذا كانت صفحة اللعبة (Game.html)
    else if (currentPath.includes('Game.html')) {
        initializeGamePage();
    }
};

// دالة لتجهيز صفحة إدخال الاسم (Home.html)
function initializeHomePage() {
    let startEasyButton = document.querySelector('.card1 .button');
    let startHardButton = document.querySelector('.card2 .button');

    // عند الضغط على زر "Start Game" للمستوى السهل
    startEasyButton.onclick = function() {
        StartGameEasy();
    };

    // عند الضغط على زر "Start Game" للمستوى الصعب
    startHardButton.onclick = function() {
        StartGameHard();
    };
}

// دالة تشغيل اللعبة على المستوى السهل
function StartGameEasy() {
    let Name = document.getElementById("input-the-name").value;

    // التحقق من وجود الاسم
    if (!Name) {
        alert("HELLO!\nEnter your name first");
        return;
    }

    // تخزين الاسم وعدد الفرص في LocalStorage
    localStorage.setItem("playerName", Name);
    localStorage.setItem("playerChances", ChancesEasy);
    localStorage.setItem("playerScor", Scor);

    // الانتقال إلى صفحة اللعبة
    window.location.href = 'Game.html';
}

// دالة تشغيل اللعبة على المستوى الصعب
function StartGameHard() {
    let Name = document.getElementById("input-the-name").value;

    // التحقق من وجود الاسم
    if (!Name) {
        alert("HELLO!\nEnter your name first");
        return;
    }

    // تخزين الاسم وعدد الفرص في LocalStorage
    localStorage.setItem("playerName", Name);
    localStorage.setItem("playerChances", ChancesHard);
    localStorage.setItem("playerScor", Scor);

    // الانتقال إلى صفحة اللعبة
    window.location.href = 'Game.html';
}

// دالة لتجهيز صفحة اللعبة (Game.html)
function initializeGamePage() {
    // استرجاع البيانات من LocalStorage
    let playerName = localStorage.getItem("playerName");
    let playerChances = localStorage.getItem("playerChances");
    let playerScor = localStorage.getItem("playerScor");

    // تحديث عناصر الصفحة
    let nameDisplay = document.getElementById('player-name');
    let chanceDisplay = document.getElementById('player-chances');
    let scorDisplay = document.getElementById('scor');

    if (nameDisplay) {
        nameDisplay.innerText = `Welcome ( ${playerName.charAt(0).toUpperCase() + playerName.slice(1)} ) to Mines-vs-Treasure game`;
    }

    if (scorDisplay) {
        scorDisplay.innerText = ` ( ${playerScor} ) `; 
    }

    if (chanceDisplay) {
        chanceDisplay.innerText = ` ( ${playerChances} ) `; 
    }

    
    
    updateGameLogic(playerChances, playerScor);
}


function updateGameLogic(chances, score) {
    
    
    
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
game()
//----------------------------------------------------------------------------------------------------------
function close() {
	if (confirm("Are you sure about that?"))
	{
		window.close();
	}
}
//----------------------------------------------------------------------------------------------------------

	




