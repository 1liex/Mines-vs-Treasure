let ChancesEasy = 15; // عدد الفرص للمستوى السهل
let ChancesHard = 64; // عدد الفرص للمستوى الصعب
let Scor = 0; // نقاط اللاعب
let treasureLocation; // مكان الكنز
let mineLocations = []; // مواقع الألغام
let playerDifficulty; // مستوى اللعبة
let clickedCells = new Set(); // مجموعة لتخزين الخلايا التي تم النقر عليها
let clickSound = new Audio('click.mp3'); // صوت الضغط
let winSound = new Audio('win.mp3'); // صوت الفوز
let lossSound = new Audio('loss.mp3'); // صوت الخسارة

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
    if (!Name) {
        alert("HELLO!\nEnter your name first");
        return;
    }
    playerDifficulty = "easy"; // تعيين مستوى الصعوبة
    localStorage.setItem("playerName", Name);
    localStorage.setItem("playerChances", ChancesEasy);
    localStorage.setItem("playerScor", Scor);
    window.location.href = 'Game.html';
}

// دالة تشغيل اللعبة على المستوى الصعب
function StartGameHard() {
    let Name = document.getElementById("input-the-name").value;
    if (!Name) {
        alert("HELLO!\nEnter your name first");
        return;
    }
    playerDifficulty = "hard"; // تعيين مستوى الصعوبة
    localStorage.setItem("playerName", Name);
    localStorage.setItem("playerChances", ChancesHard);
    localStorage.setItem("playerScor", Scor);
    window.location.href = 'Game.html';
}

// دالة لتجهيز صفحة اللعبة (Game.html)
function initializeGamePage() {
    let playerName = localStorage.getItem("playerName");
    let playerChances = localStorage.getItem("playerChances");
    let playerScor = localStorage.getItem("playerScor");

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
        chanceDisplay.innerText = `(${playerChances})`; 
    }

    updateGameLogic(playerChances, playerScor);
}

function updateGameLogic(chances, score) {
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    let rows = 8;
    let cols = 8;
    let cellSize = canvas.width / cols;

    // رسم المصفوفة
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            let x = col * cellSize;
            let y = row * cellSize;
            ctx.strokeStyle = '#FFF';
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, cellSize, cellSize);
        }
    }

    // تحديد موقع الكنز
    treasureLocation = Math.floor(Math.random() * (rows * cols));

    // وضع الألغام بناءً على المستوى المختار
    let numberOfMines = (playerDifficulty === "easy") ? 12 : 24; // عدد الألغام بناءً على المستوى
    while (mineLocations.length < numberOfMines) {
        let mineLocation = Math.floor(Math.random() * (rows * cols));
        if (mineLocation !== treasureLocation && !mineLocations.includes(mineLocation)) {
            mineLocations.push(mineLocation);
        }
    }

    // إضافة حدث للنقر على كل خلية
    canvas.addEventListener('click', function(event) {
        let rect = canvas.getBoundingClientRect();
        let mouseX = event.clientX - rect.left;
        let mouseY = event.clientY - rect.top;
        let clickedCol = Math.floor(mouseX / cellSize);
        let clickedRow = Math.floor(mouseY / cellSize);
        let clickedIndex = clickedRow * cols + clickedCol;

        handleCellClick(clickedIndex);
    });
}

function handleCellClick(index) {
    // تشغيل صوت الضغط
    clickSound.play(); // تشغيل الصوت عند الضغط على الخلية

    // التحقق مما إذا تم الضغط على الخلية مسبقًا
    if (clickedCells.has(index)) {
        alert("You've already clicked this cell!");
        return; // عدم الاستمرار إذا تم الضغط على الخلية مسبقًا
    }

    let playerChances = parseInt(localStorage.getItem("playerChances"));
    let playerScor = parseInt(localStorage.getItem("playerScor"));

    clickedCells.add(index); // إضافة الخلية إلى المجموعة بعد الضغط عليها

    if (index === treasureLocation) {
        winSound.play(); // تشغيل صوت الفوز
        alert("Congratulations! You've found the treasure!");
        playerScor += 10; // زيادة النقاط عند الفوز
        localStorage.setItem("playerScor", playerScor);
        askToContinue();
    } else if (mineLocations.includes(index)) {
        lossSound.play(); // تشغيل صوت الخسارة
        alert("Boom! You've hit a mine. But keep going!");
        playerChances -= 2; // تقليل الفرص بمقدار 2 عند الضغط على القنبلة
        playerScor -= 8; // خسارة 8 نقاط عند الضغط على القنبلة
        localStorage.setItem("playerScor", playerScor);
    } else {
        alert("Safe! Keep trying.");
        playerScor += 3; // إضافة 3 نقاط عند الضغط على مربع آمن
        localStorage.setItem("playerScor", playerScor); // تأكد من تحديث النقاط في التخزين المحلي
    }

    // تحديث العرض بعد كل نقرة
    document.getElementById('scor').innerText = ` ( ${playerScor} ) `;
    playerChances--; // تقليل عدد الفرص
    localStorage.setItem("playerChances", playerChances);
    document.getElementById('player-chances').innerText = `(${playerChances})`; 

    if (playerChances <= 0) {
        alert("No chances left! Game Over.");
        askToContinue();
    }
}

// دالة تسأل إذا كان اللاعب يريد الاستمرار في اللعب
function askToContinue() {
    let continuePlaying = confirm("Do you want to continue playing? Click OK for Home, Cancel to go to End Page.");
    if (continuePlaying) {
        window.location.href = 'Home.html'; // العودة إلى الصفحة الرئيسية
    } else {
        window.location.href = 'end.html'; // الانتقال إلى صفحة النهاية
    }
}

function close() {
    if (confirm("Are you sure about that?")) {
        window.close();
    }
}