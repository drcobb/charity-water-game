const difficultySelect = document.getElementById("difficulty");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const scoreDisplay = document.getElementById("score");
const goalDisplay = document.getElementById("goal");
const timeDisplay = document.getElementById("time");
const message = document.getElementById("message");
const milestoneDisplay = document.getElementById("milestone");
const gameArea = document.getElementById("gameArea");

let score = 0;
let goal = 15;
let timeLeft = 30;
let gameTimer;
let spawnTimer;
let gameRunning = false;

const settings = {
  easy: { goal: 10, time: 40, speed: 1200 },
  normal: { goal: 15, time: 30, speed: 900 },
  hard: { goal: 20, time: 25, speed: 650 }
};

const milestones = [
  { points: 5, text: "Nice start! The village is getting closer to clean water." },
  { points: 10, text: "Halfway energy! Keep fixing those pipes." },
  { points: 15, text: "Amazing work! Clean water is almost flowing." },
  { points: 20, text: "Mission complete energy! You made a huge impact." }
];

function startGame() {
  resetGame();

  const mode = difficultySelect.value;
  goal = settings[mode].goal;
  timeLeft = settings[mode].time;

  goalDisplay.textContent = goal;
  timeDisplay.textContent = timeLeft;
  message.textContent = `Game started on ${mode.toUpperCase()} mode!`;

  gameRunning = true;

  gameTimer = setInterval(updateTime, 1000);
  spawnTimer = setInterval(createGameItem, settings[mode].speed);
}

function updateTime() {
  timeLeft--;
  timeDisplay.textContent = timeLeft;

  if (timeLeft <= 0) {
    endGame(false);
  }
}

function createGameItem() {
  if (!gameRunning) return;

  const item = document.createElement("div");
  const isWaterDrop = Math.random() > 0.45;

  item.classList.add(isWaterDrop ? "water-drop" : "pipe");
  item.innerHTML = isWaterDrop ? "<span>+1</span>" : "🔧";

  const maxX = gameArea.clientWidth - 90;
  const maxY = gameArea.clientHeight - 90;

  item.style.left = Math.random() * maxX + "px";
  item.style.top = Math.random() * maxY + "px";

  item.addEventListener("click", () => {
    score++;
    scoreDisplay.textContent = score;
    item.remove();

    checkMilestones();

    if (score >= goal) {
      endGame(true);
    }
  });

  gameArea.appendChild(item);

  setTimeout(() => {
    if (item.parentElement) {
      item.remove();
    }
  }, 1800);
}

function checkMilestones() {
  for (let i = 0; i < milestones.length; i++) {
    if (score === milestones[i].points) {
      milestoneDisplay.textContent = milestones[i].text;
    }
  }
}

function endGame(won) {
  gameRunning = false;
  clearInterval(gameTimer);
  clearInterval(spawnTimer);
  gameArea.innerHTML = "";

  if (won) {
    message.textContent = "You win! You helped bring clean water to the village!";
  } else {
    message.textContent = "Time ran out! Try again and keep the water flowing.";
  }
}

function resetGame() {
  clearInterval(gameTimer);
  clearInterval(spawnTimer);

  score = 0;
  gameRunning = false;

  const mode = difficultySelect.value;
  goal = settings[mode].goal;
  timeLeft = settings[mode].time;

  scoreDisplay.textContent = score;
  goalDisplay.textContent = goal;
  timeDisplay.textContent = timeLeft;
  milestoneDisplay.textContent = "";
  message.textContent = "Pick a difficulty and start fixing pipes!";
  gameArea.innerHTML = "";
}

startBtn.addEventListener("click", startGame);
resetBtn.addEventListener("click", resetGame);
difficultySelect.addEventListener("change", resetGame);

resetGame();
