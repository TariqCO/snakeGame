const board = document.querySelector(".board");
const menuPopUp = document.getElementById("menu");
const scoreText = document.querySelector(".score");
const highScoreText = document.querySelector(".highScore");
const playingTime = document.querySelector(".time");
const menuScore = document.querySelector(".menuScore");
const menuHighScore = document.querySelector(".menuHighScore");

const startGame = document.querySelector("#startGame");
const restartGame = document.querySelector("#restartGame");

const blockHeight = 30;
const blockWidth = 30;

// Calculate rows & columns
const rows = Math.floor(board.clientHeight / blockHeight);
const cols = Math.floor(board.clientWidth / blockWidth);

let score = 0;
let highScore = localStorage.getItem("highScore");
let level = 200; // Initial speed

const blocks = [];
let snake = [
  { x: 7, y: 3 },
  { x: 7, y: 4 },
  { x: 7, y: 5 },
];

let food = {
  x: Math.floor(Math.random() * rows),
  y: Math.floor(Math.random() * cols),
};

let direction = "right";
let intervalId = null;
let lastDirection = "";

// --------------------------------------------------
// CREATE BOARD BLOCKS
// --------------------------------------------------
for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const block = document.createElement("div");
    block.classList.add("block");
    board.appendChild(block);
    blocks[`${row}-${col}`] = block;
  }
}

// --------------------------------------------------
// UPDATE SPEED BASED ON SCORE
// --------------------------------------------------
function updateSpeed() {
  // Minimum speed (fastest)
  const minSpeed = 40;

  // Maximum speed (starting)
  const maxSpeed = 250;

  // Gradually decrease speed as score increases
  // speed = maxSpeed - score * 3
  let newLevel = Math.max(minSpeed, maxSpeed - score * 3);

  if (newLevel !== level) {
    level = newLevel;

    clearInterval(intervalId);
    intervalId = setInterval(render, level);
  }
}

// --------------------------------------------------
// MAIN RENDER LOOP
// --------------------------------------------------
function render() {
  let head = null;

  // Render food
  blocks[`${food.x}-${food.y}`].classList.add("food");

  // if (direction === "left") head = { x: snake[0].x, y: snake[0].y - 1 };
  // if (direction === "right") head = { x: snake[0].x, y: snake[0].y + 1 };
  // if (direction === "down") head = { x: snake[0].x + 1, y: snake[0].y };
  // if (direction === "up") head = { x: snake[0].x + 1, y: snake[0].y };

  if (direction === "right" && lastDirection !== "left") {
    head = { x: snake[0].x, y: snake[0].y + 1 };
    lastDirection = "right";
  
  } else if (direction === "left" && lastDirection !== "right") {
    head = { x: snake[0].x, y: snake[0].y - 1 };
    lastDirection = "left";
  
  } else if (direction === "down" && lastDirection !== "up") {
    head = { x: snake[0].x + 1, y: snake[0].y };
    lastDirection = "down";
  
  } else if (direction === "up" && lastDirection !== "down") {
    head = { x: snake[0].x - 1, y: snake[0].y }; // <-- fixed
    lastDirection = "up";
  
  } else {
    // If opposite direction pressed, continue moving in lastDirection
    if (lastDirection === "right") {
      head = { x: snake[0].x, y: snake[0].y + 1 };
    } else if (lastDirection === "left") {
      head = { x: snake[0].x, y: snake[0].y - 1 };
    } else if (lastDirection === "down") {
      head = { x: snake[0].x + 1, y: snake[0].y };
    } else if (lastDirection === "up") {
      head = { x: snake[0].x - 1, y: snake[0].y };
    }
  }
  

  // WALL COLLISION
  if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
    clearInterval(intervalId);
    board.style.boxShadow = `0 0 15px rgba(255, 0, 0, 0.2)`;
    menuPopUp.style.display = "block";
    startGame.style.display = "none";
    restartGame.style.display = "block";

    if (score > highScore) {
      localStorage.setItem("highScore", score);
      highScore = score;
    }

    highScoreText.innerText = `High Score: ${highScore}`;
    menuHighScore.innerText = `High Score: ${highScore}`;
    menuScore.innerText = `Score: ${score}`;
    return;
  }

  // FOOD EATEN
  if (head.x === food.x && head.y === food.y) {
    blocks[`${food.x}-${food.y}`].classList.remove("food");

    score++;
    scoreText.innerText = `Score: ${score}`;

    snake.unshift(head);

    updateSpeed();

    food = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols),
    };
  }

  // Remove old snake
  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.remove("snk");
  });

  // Move snake
  snake.unshift(head);
  snake.pop();

  // Draw snake
  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.add("snk");
  });
}

highScoreText.innerText = `High Score: ${highScore}`;
menuHighScore.innerText = `High Score: ${highScore}`;
menuScore.innerText = `Score: ${score}`;

// --------------------------------------------------
// START GAME
// --------------------------------------------------
startGame.addEventListener("click", () => {
  menuPopUp.style.display = "none";
  intervalId = setInterval(render, level);
});

// --------------------------------------------------
// RESTART GAME
// --------------------------------------------------
restartGame.addEventListener("click", restart);

function restart() {
  score = 0;
  scoreText.innerText = `Score: ${score}`;
  board.style.boxShadow = `0 0 15px rgba(0, 255, 150, 0.2)`;

  level = 250; // Reset to original speed
  direction = "right";
  snake = [
    { x: 7, y: 3 },
    { x: 7, y: 4 },
    { x: 7, y: 5 },
  ];

  menuPopUp.style.display = "none";

  // Remove ALL snk blocks
  document.querySelectorAll(".snk").forEach((b) => b.classList.remove("snk"));

  // Remove old food
  document.querySelector(".food")?.classList.remove("food");

  // Generate new food
  food = {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols),
  };

  clearInterval(intervalId);
  intervalId = setInterval(render, level);
}

// --------------------------------------------------
// KEYBOARD CONTROLS
// --------------------------------------------------
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") direction = "up";
  if (e.key === "ArrowDown") direction = "down";
  if (e.key === "ArrowRight") direction = "right";
  if (e.key === "ArrowLeft") direction = "left";
});
