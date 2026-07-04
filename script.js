const difficultySelect = document.getElementById("difficulty");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const scoreDisplay = document.getElementById("score");
const goalDisplay = document.getElementById("goal");
const timeDisplay = document.getElementById("time");
const livesDisplay = document.getElementById("lives");
const message = document.getElementById("message");
const milestoneDisplay = document.getElementById("milestone");
const gameArea = document.getElementById("gameArea");

let score = 0;
let goal = 15;
let timeLeft = 30;
let lives = 3;
let gameRunning = false;
let gameTimer;
let spawnTimer;

const difficultySettings = {
  easy: {
    goal: 10,
    time: 45,
    lives: 5,
    spawnSpeed: 1200,
    hazardChance: 0.1,
    pointsPerPipe: 2
  },
  normal: {
    goal: 15,
    time: 30,
    lives: 3,
    spawnSpeed: 850,
    hazardChance: 0.25,
    pointsPerPipe: 2
  },
  hard: {
    goal: 25,
    time: 22,
    lives: 2,
    spawnSpeed: 550,
    hazardChance: 0.45,
    pointsPerPipe: 1
  }
};

const milestones = [
  { score: 5, text: "Milestone: First water line repaired!" },
  { score: 10, text: "Milestone: The village tank is filling up!" },
  { score: 15, text: "Milestone: Clean water is almost flowing!" },
  { score: 20, text: "Milestone: You are making a major impact!" },
  { score: 25, text: "Milestone: Full clean water mission complete!" }
];

function playSound(type) {
  const audio = new AudioContext();
  const oscillator = audio.createOscillator();
  const gain = audio.createGain();

  oscillator.connect(gain);
  gain.connect(audio.destination);

  if (type === "good") {
    oscillator.frequency.value = 700;
  } else if (type === "bad") {
    oscillator.frequency.value = 180;
  } else {
    oscillator.frequency.value = 950;
  }

  gain.gain.value = 0.08;
  oscillator.start();
  oscillator.stop(audio.currentTime + 0.12);
}

function startGame() {
  resetGame();

  const mode = difficultySelect.value;
  const settings = difficultySettings[mode];

  goal = settings.goal;
  timeLeft = settings.time;
  lives = settings.lives;

  updateScreen();

  gameRunning = true;
  message.textContent = `Mission started on ${mode.toUpperCase()} mode!`;

  gameTimer = setInterval(countdown, 1000);
  spawnTimer = setInterval(spawnItem, settings.spawnSpeed);
}

function countdown() {
  timeLeft--;
  updateScreen();

  if (timeLeft <= 0) {
    endGame(false);
  }
}

function spawnItem() {
  if (!gameRunning) return;

  const mode = difficultySelect.value;
  const settings = difficultySettings[mode];

  const item = document.createElement("div");
  item.classList.add("game-item");

  const random = Math.random();

  if (random < settings.hazardChance) {
    item.classList.add("hazard");
    item.textContent = "☠️";
    item.dataset.type = "hazard";
  } else if (random < 0.6) {
    item.classList.add("pipe");
    item.textContent = "🔧";
    item.dataset.type = "pipe";
  } else {
    item.classList.add("water");
    item.textContent = "💧";
    item.dataset.type = "water";
  }

  const maxX = gameArea.clientWidth - 90;
  const maxY = gameArea.clientHeight - 110;

  item.style.left = Math.random() * maxX + "px";
  item.style.top = Math.random() * maxY + "px";

  item.addEventListener("click", function () {
    handleItemClick(item);
  });

  gameArea.appendChild(item);

  setTimeout(function () {
    if (item.parentElement && gameRunning) {
      if (item.dataset.type !== "hazard") {
        lives--;
        message.textContent = "You missed a clean water item! Life lost.";
        playSound("bad");
      }

      item.remove();
      updateScreen();

      if (lives <= 0) {
        endGame(false);
      }
    }
  }, 1600);
}

function handleItemClick(item) {
  const mode = difficultySelect.value;
  const settings = difficultySettings[mode];

  item.classList.add("clicked");

  if (item.dataset.type === "hazard") {
    lives--;
    message.textContent = "Oh no! You clicked polluted water. Life lost.";
    playSound("bad");
  } else if (item.dataset.type === "pipe") {
    score += settings.pointsPerPipe;
    message.textContent = "Pipe fixed! Water is moving again.";
    playSound("good");
  } else {
    score++;
    message.textContent = "Clean water collected!";
    playSound("good");
  }

  setTimeout(function () {
    item.remove();
  }, 180);

  checkMilestones();
  updateScreen();

  if (score >= goal) {
    endGame(true);
  }

  if (lives <= 0) {
    endGame(false);
  }
}

function checkMilestones() {
  for (let i = 0; i < milestones.length; i++) {
    if (score === milestones[i].score) {
      milestoneDisplay.textContent = milestones[i].text;
    }
  }
}

function endGame(won) {
  gameRunning = false;
  clearInterval(gameTimer);
  clearInterval(spawnTimer);

  const items = document.querySelectorAll(".game-item");
  items.forEach(function (item) {
    item.remove();
  });

  if (won) {
    message.textContent = "You win! The village reached its clean water goal!";
    milestoneDisplay.textContent = "Final Impact: You helped bring clean water to the community.";
    playSound("win");
  } else {
    message.textContent = "Mission failed. Try again and protect every drop!";
  }
}

function resetGame() {
  clearInterval(gameTimer);
  clearInterval(spawnTimer);

  const mode = difficultySelect.value;
  const settings = difficultySettings[mode];

  score = 0;
  goal = settings.goal;
  timeLeft = settings.time;
  lives = settings.lives;
  gameRunning = false;

  const items = document.querySelectorAll(".game-item");
  items.forEach(function (item) {
    item.remove();
  });

  message.textContent = "Choose a difficulty and start the mission.";
  milestoneDisplay.textContent = "";

  updateScreen();
}

function updateScreen() {
  scoreDisplay.textContent = score;
  goalDisplay.textContent = goal;
  timeDisplay.textContent = timeLeft;
  livesDisplay.textContent = lives;
}

startBtn.addEventListener("click", startGame);
resetBtn.addEventListener("click", resetGame);
difficultySelect.addEventListener("change", resetGame);

resetGame();
