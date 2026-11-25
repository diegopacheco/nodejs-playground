const socket = io();
const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const COLORS = ['#22d3ee', '#f472b6'];
let playerNumber;
let paddleY = 250;
let trail = [];

socket.on('playerNumber', (number) => {
    playerNumber = number;
    console.log('You are Player ' + playerNumber);
});

socket.on('full', (isFull) => {
    if (isFull) {
        drawBackground();
        drawMessage('Game is full!', '#f472b6');
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') {
        paddleY -= 20;
        if (paddleY < 0) paddleY = 0;
        socket.emit('playerMove', { paddleY });
    } else if (event.key === 'ArrowDown') {
        paddleY += 20;
        if (paddleY > 500) paddleY = 500;
        socket.emit('playerMove', { paddleY });
    }
});

socket.on('gameState', (state) => {
    render(state);
});

function drawBackground() {
    context.fillStyle = '#070b1a';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = 'rgba(148, 163, 184, 0.25)';
    context.lineWidth = 4;
    context.setLineDash([16, 16]);
    context.beginPath();
    context.moveTo(canvas.width / 2, 0);
    context.lineTo(canvas.width / 2, canvas.height);
    context.stroke();
    context.setLineDash([]);
    context.lineWidth = 2;
    context.beginPath();
    context.arc(canvas.width / 2, canvas.height / 2, 70, 0, Math.PI * 2);
    context.stroke();
}

function drawMessage(text, color) {
    context.textAlign = 'center';
    context.fillStyle = color;
    context.shadowColor = color;
    context.shadowBlur = 20;
    context.font = 'bold 40px monospace';
    context.fillText(text, canvas.width / 2, canvas.height / 2 + 14);
    context.shadowBlur = 0;
    context.textAlign = 'left';
}

function drawPaddle(x, y, color) {
    context.fillStyle = color;
    context.shadowColor = color;
    context.shadowBlur = 20;
    context.beginPath();
    context.roundRect(x, y, 10, 100, 5);
    context.fill();
    context.shadowBlur = 0;
}

function drawBall(ball) {
    trail.push({ x: ball.x, y: ball.y });
    if (trail.length > 14) trail.shift();
    trail.forEach((point, i) => {
        context.fillStyle = 'rgba(226, 232, 240, ' + (i / trail.length) * 0.35 + ')';
        context.beginPath();
        context.arc(point.x, point.y, ball.radius * (i / trail.length), 0, Math.PI * 2);
        context.fill();
    });
    context.fillStyle = '#ffffff';
    context.shadowColor = '#ffffff';
    context.shadowBlur = 18;
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    context.fill();
    context.shadowBlur = 0;
}

function drawScores(state) {
    context.font = 'bold 64px monospace';
    context.textAlign = 'center';
    context.globalAlpha = 0.85;
    context.fillStyle = COLORS[0];
    context.fillText(state.player1.score, 200, 80);
    context.fillStyle = COLORS[1];
    context.fillText(state.player2.score, 600, 80);
    context.globalAlpha = 1;
    if (playerNumber) {
        context.font = '16px monospace';
        context.fillStyle = COLORS[playerNumber - 1];
        context.fillText('YOU ARE PLAYER ' + playerNumber, playerNumber === 1 ? 200 : 600, canvas.height - 24);
    }
    context.textAlign = 'left';
}

function render(state) {
    drawBackground();
    drawScores(state);
    drawPaddle(50, state.player1.y, COLORS[0]);
    drawPaddle(740, state.player2.y, COLORS[1]);
    drawBall(state.ball);
}
