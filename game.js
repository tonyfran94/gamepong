const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 90;
const PADDLE_MARGIN = 20;
const BALL_SIZE = 16;
const PLAYER_COLOR = "#4CAF50";
const AI_COLOR = "#F44336";
const BALL_COLOR = "#FFF";
const NET_COLOR = "#888";
const FPS = 60;

// Initial game state
let playerY = (canvas.height - PADDLE_HEIGHT) / 2;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;
let ballX = canvas.width / 2 - BALL_SIZE / 2;
let ballY = canvas.height / 2 - BALL_SIZE / 2;
let ballSpeedX = 6 * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = 4 * (Math.random() * 2 - 1);

// Mouse event for player's paddle
canvas.addEventListener('mousemove', function (evt) {
    let rect = canvas.getBoundingClientRect();
    let mouseY = evt.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;

    // Clamp within bounds
    if (playerY < 0) playerY = 0;
    if (playerY > canvas.height - PADDLE_HEIGHT) playerY = canvas.height - PADDLE_HEIGHT;
});

// Draw everything
function draw() {
    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw net
    for (let i = 0; i < canvas.height; i += 30) {
        ctx.fillStyle = NET_COLOR;
        ctx.fillRect(canvas.width / 2 - 1, i, 2, 20);
    }

    // Draw paddles
    ctx.fillStyle = PLAYER_COLOR;
    ctx.fillRect(PADDLE_MARGIN, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillStyle = AI_COLOR;
    ctx.fillRect(canvas.width - PADDLE_MARGIN - PADDLE_WIDTH, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw ball
    ctx.fillStyle = BALL_COLOR;
    ctx.fillRect(ballX, ballY, BALL_SIZE, BALL_SIZE);
}

// AI paddle logic
function updateAI() {
    // Simple AI: move towards the ball's Y center
    let aiCenter = aiY + PADDLE_HEIGHT / 2;
    let ballCenter = ballY + BALL_SIZE / 2;
    let diff = ballCenter - aiCenter;

    // Difficulty: lower for easier, higher for harder
    let aiSpeed = 4;

    if (diff > 10) {
        aiY += aiSpeed;
    } else if (diff < -10) {
        aiY -= aiSpeed;
    }

    // Clamp within bounds
    if (aiY < 0) aiY = 0;
    if (aiY > canvas.height - PADDLE_HEIGHT) aiY = canvas.height - PADDLE_HEIGHT;
}

// Ball logic and collisions
function updateBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Top and bottom wall collision
    if (ballY < 0) {
        ballY = 0;
        ballSpeedY *= -1;
    }
    if (ballY + BALL_SIZE > canvas.height) {
        ballY = canvas.height - BALL_SIZE;
        ballSpeedY *= -1;
    }

    // Left paddle collision
    if (
        ballX <= PADDLE_MARGIN + PADDLE_WIDTH &&
        ballY + BALL_SIZE >= playerY &&
        ballY <= playerY + PADDLE_HEIGHT
    ) {
        ballX = PADDLE_MARGIN + PADDLE_WIDTH;
        ballSpeedX *= -1;

        // Add some "spin" based on where it hits the paddle
        let deltaY = (ballY + BALL_SIZE / 2) - (playerY + PADDLE_HEIGHT / 2);
        ballSpeedY = deltaY * 0.28;
    }

    // Right paddle collision (AI)
    if (
        ballX + BALL_SIZE >= canvas.width - PADDLE_MARGIN - PADDLE_WIDTH &&
        ballY + BALL_SIZE >= aiY &&
        ballY <= aiY + PADDLE_HEIGHT
    ) {
        ballX = canvas.width - PADDLE_MARGIN - PADDLE_WIDTH - BALL_SIZE;
        ballSpeedX *= -1;

        // Add some "spin"
        let deltaY = (ballY + BALL_SIZE / 2) - (aiY + PADDLE_HEIGHT / 2);
        ballSpeedY = deltaY * 0.28;
    }

    // Reset if ball is out of bounds
    if (ballX < 0 || ballX > canvas.width) {
        resetBall();
    }
}

// Reset ball to center
function resetBall() {
    ballX = canvas.width / 2 - BALL_SIZE / 2;
    ballY = canvas.height / 2 - BALL_SIZE / 2;
    // Randomize direction
    ballSpeedX = 6 * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = 4 * (Math.random() * 2 - 1);
}

// Game loop
function gameLoop() {
    updateAI();
    updateBall();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game!
gameLoop();
