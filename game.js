let ChancesEasy = 50; // عدد الفرص للمستوى السهل
let ChancesHard = 50; // عدد الفرص للمستوى الصعب
let Scor = 0; // نقاط اللاعب
let treasureLocation; // مكان الكنز
let mineLocations = []; // مواقع الألغام
let playerDifficulty; // مستوى اللعبة
let clickedCells = new Set(); // مجموعة لتخزين الخلايا التي تم النقر عليها
let clickSound = new Audio("click.mp3"); // صوت الضغط
let winSound = new Audio("win.mp3"); // صوت الفوز
let lossSound = new Audio("loss.mp3"); // صوت الخسارة

// التأكد من أن DOM تم تحميله بالكامل
document.addEventListener("DOMContentLoaded", function () {
  let currentPath = window.location.pathname;

  // إذا كانت الصفحة الرئيسية (Home.html)
  if (currentPath.includes("Home.html")) {
    initializeHomePage(); // تجهيز صفحة إدخال الاسم
  }
  // إذا كانت صفحة اللعبة (Game.html)
  else if (currentPath.includes("Game.html")) {
    initializeGamePage(); // تجهيز صفحة اللعبة
  }
});

// دالة لتجهيز صفحة إدخال الاسم (Home.html)
function initializeHomePage() {
  let startEasyButton = document.querySelector(".card1 .button");
  let startHardButton = document.querySelector(".card2 .button");

  // عند الضغط على زر "Start Game" للمستوى السهل
  startEasyButton.onclick = function () {
    StartGameEasy();
  };

  // عند الضغط على زر "Start Game" للمستوى الصعب
  startHardButton.onclick = function () {
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
  window.location.href = "Game.html";
  backgroundsound.play();
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
  window.location.href = "Game.html";
}

// دالة لتجهيز صفحة اللعبة (Game.html)
function initializeGamePage() {
  let playerName = localStorage.getItem("playerName");
  let playerChances = localStorage.getItem("playerChances");
  let playerScor = localStorage.getItem("playerScor");

  let nameDisplay = document.getElementById("player-name");
  let chanceDisplay = document.getElementById("player-chances");
  let scorDisplay = document.getElementById("scor");

  if (nameDisplay) {
    nameDisplay.innerText = `Welcome ( ${
      playerName.charAt(0).toUpperCase() + playerName.slice(1)
    } ) to Mines-vs-Treasure game`;
  }
  if (scorDisplay) {
    scorDisplay.innerText = ` ( ${playerScor} ) `;
  }
  if (chanceDisplay) {
    chanceDisplay.innerText = `(${playerChances})`;
  }

  updateGameLogic(playerChances, playerScor);
  let backgroundMusic = new Audio("/media/background.mp3"); // تحميل صوت الخلفية
  backgroundMusic.loop = true; // تكرار الموسيقى
  backgroundMusic.volume = 0.1;
  backgroundMusic.play();
}

function updateGameLogic(chances, score) {
  let canvas = document.getElementById("canvas");
  let ctx = canvas.getContext("2d");
  let rows = 8;
  let cols = 8;
  let cellSize = canvas.width / cols;

  // رسم المصفوفة
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let x = col * cellSize;
      let y = row * cellSize;
      ctx.strokeStyle = "#FFF";
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, cellSize, cellSize);
    }
  }

  // تحديد موقع الكنز
  treasureLocation = Math.floor(Math.random() * (rows * cols));

  // وضع الألغام بناءً على المستوى المختار
  let numberOfMines = playerDifficulty === "easy" ? 12 : 24; // عدد الألغام بناءً على المستوى
  while (mineLocations.length < numberOfMines) {
    let mineLocation = Math.floor(Math.random() * (rows * cols));
    if (
      mineLocation !== treasureLocation &&
      !mineLocations.includes(mineLocation)
    ) {
      mineLocations.push(mineLocation);
    }
  }

  // إضافة حدث للنقر على كل خلية
  canvas.addEventListener("click", function (event) {
    let rect = canvas.getBoundingClientRect();
    let mouseX = event.clientX - rect.left;
    let mouseY = event.clientY - rect.top;
    let clickedCol = Math.floor(mouseX / cellSize);
    let clickedRow = Math.floor(mouseY / cellSize);
    let clickedIndex = clickedRow * cols + clickedCol;

    handleCellClick(clickedIndex);
  });
}

function scores() {
  let playerScor = parseInt(localStorage.getItem("playerScor")) || 0;
  let messageElement = document.getElementById("scores_message");

  if (!messageElement) {
    console.error("Element with id 'scores_message' not found.");
    return;
  }

  let message;
  if (playerScor < 0) {
    message = "JUST GIVE UP 🤡";
  } else if (playerScor >= 1 && playerScor <= 30) {
    message = "little points 🌞";
  } else if (playerScor >= 31 && playerScor <= 70) {
    message = "you can do better than this!";
  } else if (playerScor >= 71 && playerScor <= 100) {
    message = "you are amazing, keep going!";
  } else if (playerScor >= 101) {
    message = "you are a hacker 🧿";
  }

  messageElement.innerText = message;
}

function handleCellClick(index) {
  let canvas = document.getElementById("canvas");
  let ctx = canvas.getContext("2d");
  let rows = 8;
  let cols = 8;
  let cellSize = canvas.width / cols;
  let clickedRow = Math.floor(index / cols);
  let clickedCol = index % cols;
  let x = clickedCol * cellSize;
  let y = clickedRow * cellSize;

  clickSound.play();

  let playerChances = parseInt(localStorage.getItem("playerChances"));

  if (playerChances <= 0) {
    document.getElementById("result").innerText = "You Have No Chances Left";
    return;
  }

  if (clickedCells.has(index)) {
    document.getElementById("result").innerText = "You Have Click This Button";
    return;
  }

  clickedCells.add(index);

  let playerScor = parseInt(localStorage.getItem("playerScor"));

  if (index === treasureLocation) {
    winSound.play();
    document.getElementById("result").innerText = "Congratulations You Won 🎉";
    playerScor += 10;
    localStorage.setItem("playerScor", playerScor);
    ctx.fillStyle = "gold";
    ctx.fillRect(x, y, cellSize, cellSize);
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("💎", x + cellSize / 3, y + cellSize / 1.5);

    canvas.style.pointerEvents = "none";

    scores();
    askToContinueWin();
    return;
  } else if (mineLocations.includes(index)) {
    lossSound.play();
    document.getElementById("result").innerText = "Boom!💥";
    playerChances -= 3;
    playerScor -= 7;
    localStorage.setItem("playerScor", playerScor);
    ctx.fillStyle = "red";
    ctx.fillRect(x, y, cellSize, cellSize);
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("💣", x + cellSize / 3, y + cellSize / 1.5);
  } else {
    document.getElementById("result").innerText = "Safe👍";
    playerScor += 8;
    localStorage.setItem("playerScor", playerScor);
    ctx.fillStyle = "green";
    ctx.fillRect(x, y, cellSize, cellSize);
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("✔️", x + cellSize / 3, y + cellSize / 1.5);
  }

  document.getElementById("scor").innerText = ` ( ${playerScor} ) `;
  playerChances--;
  localStorage.setItem("playerChances", playerChances);
  document.getElementById("player-chances").innerText = `(${playerChances})`;

  scores();

  if (playerChances <= 0) {
    document.getElementById("result").innerText = " Game over! No chance left";
    canvas.style.pointerEvents = "none";
    askToContinue();
  }
}

function askToContinue() {
  let resultElement = document.getElementById("result");

  resultElement.innerHTML = `
        Game Over! Do you want to continue?
        <button id="continue-button" class="continue-button game">YES</button>
        <button id="end-button" class="end-button game">NO</button>
    `;

  document.getElementById("continue-button").onclick = function () {
    window.location.href = "Home.html";
  };

  document.getElementById("end-button").onclick = function () {
    window.location.href = "end.html";
  };
}

function close() {
  if (confirm("Are you sure about that?")) {
    window.close();
  }
}
