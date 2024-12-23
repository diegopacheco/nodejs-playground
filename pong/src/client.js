const socket = io();
const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
let playerNumber;
let paddleY = 250;

// Handle player number assignment
socket.on('playerNumber', (number) => {
    playerNumber = number;
    console.log(`You are Player ${playerNumber}`);
});

// Handle full server
socket.on('full', (isFull) => {
    if (isFull) {
        alert('Game is full!');
    }
});

// Send paddle movement to server
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

// Receive game state from server
socket.on('gameState', (state) => {
    render(state);
});

function render(state) {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player paddles
    context.fillStyle = '#fff';
    context.fillRect(50, state.player1.y, 10, 100);
    context.fillRect(740, state.player2.y, 10, 100);

    // Draw ball
    context.beginPath();
    context.arc(state.ball.x, state.ball.y, state.ball.radius, 0, Math.PI * 2);
    context.fill();

    // Draw scores
    context.font = '30px Arial';
    context.fillText(state.player1.score, 200, 50);
    context.fillText(state.player2.score, 600, 50);
}