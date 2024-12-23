const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname));

let players = {};
let ball = {
    x: 400,
    y: 300,
    radius: 10,
    velocityX: 3,
    velocityY: 3
};

let gameState = {
    player1: { y: 250, score: 0 },
    player2: { y: 250, score: 0 },
    ball: ball
};

io.on('connection', (socket) => {
    console.log('A user connected');

    if (Object.keys(players).length < 2) {
        players[socket.id] = {
            paddleY: 250,
            score: 0
        };
        const playerNumber = Object.keys(players).length;
        socket.emit('playerNumber', playerNumber);
        console.log(`Player ${playerNumber} connected: ${socket.id}`);
    } else {
        socket.emit('full', true);
        socket.disconnect();
        console.log('A user was disconnected because the game is full.');
        return;
    }

    // Handle paddle movement
    socket.on('playerMove', (data) => {
        if (players[socket.id]) {
            players[socket.id].paddleY = data.paddleY;
            const playerIndex = Object.keys(players).indexOf(socket.id) + 1;
            gameState[`player${playerIndex}`].y = data.paddleY;
        }
    });

    socket.on('disconnect', () => {
        delete players[socket.id];
        console.log('A user disconnected');
    });
});

setInterval(() => {
    // Update ball position
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // Collision with top and bottom
    if (ball.y + ball.radius > 600 || ball.y - ball.radius < 0) {
        ball.velocityY *= -1;
    }

    // Collision with paddles
    // Left paddle
    if (ball.x - ball.radius < 50) {
        if (ball.y > gameState.player1.y && ball.y < gameState.player1.y + 100) {
            ball.velocityX *= -1;
        } else {
            gameState.player2.score += 1;
            resetBall();
        }
    }

    // Right paddle
    if (ball.x + ball.radius > 750) {
        if (ball.y > gameState.player2.y && ball.y < gameState.player2.y + 100) {
            ball.velocityX *= -1;
        } else {
            gameState.player1.score += 1;
            resetBall();
        }
    }

    gameState.ball = ball;
    io.emit('gameState', gameState);
}, 1000 / 60);

function resetBall() {
    ball.x = 400;
    ball.y = 300;
    ball.velocityX = -ball.velocityX;
    ball.velocityY = 5;
}

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});