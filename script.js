let score = 0;
let timeLeft = 30;
let gameRunning = true;

const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const message = document.getElementById("message");
const board = document.getElementById("board");
const resetBtn = document.getElementById("resetBtn");

function createBoard() {
  board.innerHTML = "";

  for (let i = 0; i < 9; i++) {
    const tile = document.createElement("button");
    tile.classList.add("tile");
    tile.textContent = "🚰";

    tile.addEventListener("click", function () {
      handleClick(tile);
    });

    board.appendChild(tile);
  }

  randomizeTiles();
}

function randomizeTiles() {
  const tiles = document.querySelectorAll(".tile");

  tiles.forEach(tile => {
    tile.className = "tile";
    tile.textContent = "🚰";

    const randomNumber = Math.random();

    if (randomNumber > 0.75) {
      tile.classList.add("leak");
      tile.textContent = "💧";
    } else if (randomNumber < 0.18) {
      tile.classList.add("dirty");
      tile.textContent = "🦠";
    }
  });
}

function handleClick(tile) {
  if (!gameRunning) return;

  if (tile.classList.contains("leak")) {
    score += 10;
    tile.className = "tile fixed";
    tile.textContent = "✅";
    message.textContent = "Nice! You repaired a leak and delivered clean water.";
  } else if (tile.classList.contains("dirty")) {
    score -= 5;
    message.textContent = "Oh no! Dirty water slowed the mission down.";
  } else {
    message.textContent = "No leak there. Keep searching!";
  }

  scoreDisplay.textContent = score;

  if (score >= 100) {
    winGame();
  }
}

function winGame() {
  gameRunning = false;
  message.textContent = "You win! Clean water reached the community! 🎉";
  document.querySelector(".game").classList.add("win");
  board.innerHTML = "🎉 💧 🎉";
  board.style.fontSize = "4rem";
}

function endGame() {
  gameRunning = false;

  if (score >= 60) {
    message.textContent = "Great job! You helped repair the water system.";
  } else {
    message.textContent = "Time is up! Try again to deliver more clean water.";
  }
}

let gameTimer = setInterval(function () {
  if (gameRunning) {
    timeLeft--;
    timerDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame();
    }
  }
}, 1000);

let tileTimer = setInterval(function () {
  if (gameRunning) {
    randomizeTiles();
  }
}, 1200);

resetBtn.addEventListener("click", function () {
  score = 0;
  timeLeft = 30;
  gameRunning = true;

  scoreDisplay.textContent = score;
  timerDisplay.textContent = timeLeft;
  message.textContent = "Click leaks to repair them. Avoid dirty water!";
  board.style.fontSize = "initial";
  document.querySelector(".game").classList.remove("win");

  createBoard();
});

createBoard();
