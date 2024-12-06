let ChancesEasy = 20; // عدد الفرص للمستوى السهل
let ChancesHard = 15; // عدد الفرص للمستوى الصعب
let Scor = 0; // نقاط اللاعب
let treasureLocation; // مكان الكنز
let mineLocations = []; // مواقع الألغام
let playerDifficulty; // مستوى اللعبة
let clickedCells = new Set(); // مجموعة لتخزين الخلايا التي تم النقر عليها
let clickSound = new Audio('click.mp3'); // صوت الضغط
let winSound = new Audio('win.mp3'); // صوت الفوز
let lossSound = new Audio('loss.mp3'); // صوت الخسارة

// التأكد من أن DOM تم تحميله بالكامل
document.addEventListener("DOMContentLoaded", function() {
    let currentPath = window.location.pathname;

    // إذا كانت الصفحة الرئيسية (Home.html)
    if (currentPath.includes('Home.html')) {
        initializeHomePage(); // تجهيز صفحة إدخال الاسم
    }
    // إذا كانت صفحة اللعبة (Game.html)
    else if (currentPath.includes('Game.html')) {
        initializeGamePage(); // تجهيز صفحة اللعبة
    }
});

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
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    let rows = 8;
    let cols = 8;
    let cellSize = canvas.width / cols;
    let clickedRow = Math.floor(index / cols);
    let clickedCol = index % cols;
    let x = clickedCol * cellSize;
    let y = clickedRow * cellSize;

    // تشغيل صوت الضغط
    clickSound.play();

    // التحقق من عدد المحاولات المتبقية
    let playerChances = parseInt(localStorage.getItem("playerChances"));

    if (playerChances <= 0) {
        // إذا انتهت المحاولات، لا يمكن النقر على أي خلية أخرى
        document.getElementById('result').innerText = "You Have No Chances Left";
        return;
    }

    // لو اللاعب ضغط على نفس الخلية قبل كذا
    if (clickedCells.has(index)) {
        document.getElementById('result').innerText = "You Have Click This Button";
        return; // نوقف هنا وما نخليه يكمل
    }

    clickedCells.add(index); // نحط الخلية بمجموعة الخلايا اللي تم الضغط عليها

    let playerScor = parseInt(localStorage.getItem("playerScor"));

    // لو اللاعب لقى الكنز
    if (index === treasureLocation) {
        winSound.play(); // صوت الفوز
        document.getElementById('result').innerText = "مبروك! لقيت الكنز 🎉";
        playerScor += 10; // نزود النقاط
        localStorage.setItem("playerScor", playerScor);
        ctx.fillStyle = "gold"; // نخلي الخلية لونها ذهبي
        ctx.fillRect(x, y, cellSize, cellSize);
        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.fillText("💎", x + cellSize / 3, y + cellSize / 1.5); // نحط علامة الكنز

        // منع اللاعب من النقر على أي خلية أخرى
        canvas.style.pointerEvents = "none";

        // استدعاء الدالة التي تسأل اللاعب إذا كان يريد الاستمرار
        askToContinue();
        return;
    } 
    // لو ضغط على لغم
    else if (mineLocations.includes(index)) {
        lossSound.play(); // صوت الخسارة
        document.getElementById('result').innerText = "انفجرت! بس لسه تقدر تكمل 💥";
        playerChances -= 2; // نقلل الفرص
        playerScor -= 8; // نقص النقاط
        localStorage.setItem("playerScor", playerScor);
        ctx.fillStyle = "red"; // نخلي لون الخلية أحمر
        ctx.fillRect(x, y, cellSize, cellSize);
        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.fillText("💣", x + cellSize / 3, y + cellSize / 1.5); // نحط علامة اللغم
    } 
    // لو الخلية آمنة
    else {
        document.getElementById('result').innerText = "آمنة! كمل 👍";
        playerScor += 3; // نزود النقاط
        localStorage.setItem("playerScor", playerScor); // نحفظ النقاط
        ctx.fillStyle = "green"; // نخلي لون الخلية أخضر
        ctx.fillRect(x, y, cellSize, cellSize);
        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.fillText("✔️", x + cellSize / 3, y + cellSize / 1.5); // نحط علامة التحقق
    }

    // تحديث العرض للنقاط والفرص بعد الضغط
    document.getElementById('scor').innerText = ` ( ${playerScor} ) `;
    playerChances--; // نقلل عدد الفرص
    localStorage.setItem("playerChances", playerChances); // نحفظ الفرص
    document.getElementById('player-chances').innerText = `(${playerChances})`;

    // لو خلصت الفرص
    if (playerChances <= 0) {
        document.getElementById('result').innerText = "خلصت المحاولات! انتهت اللعبة.";
        canvas.style.pointerEvents = "none"; // منع النقر على الخلايا
        askToContinue(); // نسأل اللاعب لو يبغى يكمل أو يروح لصفحة النهاية
    }
}

// دالة تسأل إذا كان اللاعب يريد الاستمرار في اللعب
function askToContinue() {
    // العنصر الذي سيتم فيه عرض السؤال وخيارات اللاعب
    let resultElement = document.getElementById('result');

    // تحديث النص للسؤال
    resultElement.innerHTML = `
        Game Over! Do you want to continue?
        <button id="continue-button" class = "continue-button">العودة إلى الصفحة الرئيسية</button>
        <button id="end-button">الانتقال إلى صفحة النهاية</button>
    `;

    // إضافة الأحداث للأزرار
    document.getElementById('continue-button').onclick = function() {
        window.location.href = 'Home.html'; // العودة إلى الصفحة الرئيسية
    };

    document.getElementById('end-button').onclick = function() {
        window.location.href = 'end.html'; // الانتقال إلى صفحة النهاية
    };
}

function close() {
    if (confirm("Are you sure about that?")) {
        window.close();
    }
}