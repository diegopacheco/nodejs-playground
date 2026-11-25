const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const overlay = document.getElementById("overlay");
const finalScore = document.getElementById("final-score");
const scoreLabel = document.getElementById("score");

const W = 400;
const H = 200;
ctx.scale(canvas.width / W, canvas.height / H);

const LCD = "#c7f0d8";
const INK = "#43523d";
const GHOST = "rgba(67, 82, 61, 0.06)";

const box = 20;
const pixel = box / 4;
const rows = H / box;
const cols = W / box;
const offsets = { LEFT: [-1, 0], RIGHT: [1, 0], UP: [0, -1], DOWN: [0, 1] };

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

function dot(x, y) {
  ctx.fillRect(x + 0.5, y + 0.5, pixel - 1, pixel - 1);
}

function drawBoard() {
  ctx.fillStyle = LCD;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = GHOST;
  for (let y = 0; y < H; y += pixel) {
    for (let x = 0; x < W; x += pixel) dot(x, y);
  }
}

function drawSegment(segment) {
  ctx.fillStyle = INK;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if ((i === 0 || i === 3) && (j === 0 || j === 3)) continue;
      dot(segment.x + i * pixel, segment.y + j * pixel);
    }
  }
}

function drawHead(head) {
  ctx.fillStyle = INK;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) dot(head.x + i * pixel, head.y + j * pixel);
  }
  const [dx, dy] = offsets[direction];
  const ex = dx === 0 ? 1 : dx > 0 ? 2 : 1;
  const ey = dy === 0 ? 1 : dy > 0 ? 2 : 1;
  ctx.fillStyle = LCD;
  dot(head.x + ex * pixel, head.y + ey * pixel);
}

function drawFood() {
  ctx.fillStyle = INK;
  for (const [i, j] of [[1, 0], [0, 1], [2, 1], [1, 2], [3, 2], [2, 3]]) {
    dot(food.x + i * pixel, food.y + j * pixel);
  }
}

function draw() {
  drawBoard();
  snake.slice(1).forEach(drawSegment);
  drawHead(snake[0]);
  drawFood();

  let head = { ...snake[0] };
  if (direction === "LEFT") head.x -= box;
  if (direction === "RIGHT") head.x += box;
  if (direction === "UP") head.y -= box;
  if (direction === "DOWN") head.y += box;

  if (
    head.x < 0 || head.x >= W ||
    head.y < 0 || head.y >= H ||
    snake.some(segment => segment.x === head.x && segment.y === head.y)
  ) {
    clearInterval(game);
    finalScore.textContent = score;
    overlay.classList.add("show");
    return;
  }

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreLabel.innerText = String(score).padStart(4, "0");
    food = randomFood();
  } else {
    snake.pop();
  }

  snake.unshift(head);
}

const game = setInterval(draw, 160);
