const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const box = 20;
const rows = canvas.height / box;
const cols = canvas.width / box;

let snake = [{ x: 9 * box, y: 9 * box }];
let direction = "RIGHT";
let food = randomFood();
let score = 0;

document.addEventListener("keydown", changeDirection);

function changeDirection(e) {
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  else if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
}

function randomFood() {
  return {
    x: Math.floor(Math.random() * cols) * box,
    y: Math.floor(Math.random() * rows) * box
  };
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "lime" : "green";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // Draw food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  // Move snake
  let head = { ...snake[0] };
  if (direction === "LEFT") head.x -= box;
  if (direction === "RIGHT") head.x += box;
  if (direction === "UP") head.y -= box;
  if (direction === "DOWN") head.y += box;

  // Game over conditions
  if (
    head.x < 0 || head.x >= canvas.width ||
    head.y < 0 || head.y >= canvas.height ||
    snake.some(segment => segment.x === head.x && segment.y === head.y)
  ) {
    clearInterval(game);
    alert("Game Over! Final score: " + score);
    return;
  }

  // Eat food
  if (head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById("score").innerText = "Score: " + score;
    food = randomFood();
  } else {
    snake.pop();
  }

  snake.unshift(head);
}

const game = setInterval(draw, 100);