// Screen references
const splashScreen = document.getElementById("splashScreen");
const loadingScreen = document.getElementById("loadingScreen");
const menuScreen = document.getElementById("menuScreen");
const gameScreen = document.getElementById("gameScreen");

// Game Canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 350;
canvas.height = 350;

// Buttons
const startBtn = document.getElementById("startBtn");
const tutorialBtn = document.getElementById("tutorialBtn");
const scoreBtn = document.getElementById("scoreBtn");
const walletBtn = document.getElementById("walletBtn");
const pauseBtn = document.getElementById("pauseBtn");
const retryBtn = document.getElementById("retryBtn");
const muteBtn = document.getElementById("muteBtn");

// Sounds
let eatSound = new Audio("https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg");
let gameOverSound = new Audio("https://actions.google.com/sounds/v1/cartoon/concussive_hit_guitar_boing.ogg");
let muted = false;

// Snake settings
let snake;
let dir;
let food;
let speed = 120;
let gameInterval;
let gamePaused = false;
let eyesBlink = false;

// Load food (Basecoin)
const foodImg = new Image();
foodImg.src = "basecoin.png";

// Splash → Loading → Menu
setTimeout(() => {
    splashScreen.style.display = "none";
    loadingScreen.style.display = "block";
    
    setTimeout(() => {
        loadingScreen.style.display = "none";
        menuScreen.style.display = "block";
    }, 2000);
}, 2000);

// Game start
startBtn.onclick = () => {
    menuScreen.style.display = "none";
    gameScreen.style.display = "block";
    startGame();
};

// Pause / Retry
pauseBtn.onclick = () => {
    gamePaused = !gamePaused;
    pauseBtn.innerText = gamePaused ? "Resume" : "Pause";
};

retryBtn.onclick = () => {
    clearInterval(gameInterval);
    startGame();
};

// Mute button
muteBtn.onclick = () => {
    muted = !muted;
    muteBtn.textContent = muted ? "🔇" : "🔊";
};

// Initialize game
function startGame() {
    snake = [{ x:160, y:160 }];
    dir = { x:10, y:0 };
    newFood();
    gamePaused = false;
    pauseBtn.innerText = "Pause";

    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, speed);
}

// Move snake
function moveSnake() {
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
    snake.unshift(head);

    // Eat food
    if (head.x === food.x && head.y === food.y) {
        if(!muted) eatSound.play();
        newFood();
    } else {
        snake.pop();
    }
}

// Display snake
function drawSnake() {
    snake.forEach((s, i) => {
        ctx.fillStyle = "#00ff0a";
        ctx.fillRect(s.x, s.y, 10, 10);

        // Eyes on head
        if(i === 0){
            ctx.fillStyle = eyesBlink ? "black" : "white";
            ctx.fillRect(s.x + 2, s.y + 2, 2, 2);
            ctx.fillRect(s.x + 6, s.y + 2, 2, 2);
        }
    });
}

setInterval(() => eyesBlink = !eyesBlink, 350);

// Walls
function drawWalls() {
    ctx.strokeStyle = "#00f2ff";
    ctx.lineWidth = 4;
    ctx.strokeRect(0,0,canvas.width,canvas.height);
}

// Food
function newFood() {
    food = {
        x: Math.floor(Math.random() * 35) * 10,
        y: Math.floor(Math.random() * 35) * 10
    };
}

function drawFood() {
    ctx.drawImage(foodImg, food.x, food.y, 10, 10);
}

// Game over
function gameOver() {
    if(!muted) gameOverSound.play();
    clearInterval(gameInterval);
    if(confirm("Game Over! Quit?")) {
        gameScreen.style.display = "none";
        menuScreen.style.display = "block";
    } else {
        startGame();
    }
}

// Game loop
function gameLoop() {
    if(gamePaused) return;

    moveSnake();

    const head = snake[0];
    if(head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) return gameOver();
    for(let i=1; i<snake.length; i++){
        if(head.x===snake[i].x && head.y===snake[i].y) return gameOver();
    }

    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawWalls();
    drawFood();
    drawSnake();
}

// Keyboard controls WASD + Arrows
document.addEventListener("keydown", e => {
    if(e.key === "w" || e.key === "ArrowUp") dir = { x:0, y:-10 };
    if(e.key === "s" || e.key === "ArrowDown") dir = { x:0, y:10 };
    if(e.key === "a" || e.key === "ArrowLeft") dir = { x:-10, y:0 };
    if(e.key === "d" || e.key === "ArrowRight") dir = { x:10, y:0 };
});

// Swipe controls mobile
let startX = null;
let startY = null;

document.addEventListener("touchstart", e => {
    startX = e.changedTouches[0].clientX;
    startY = e.changedTouches[0].clientY;
});

document.addEventListener("touchend", e => {
    let dx = e.changedTouches[0].clientX - startX;
    let dy = e.changedTouches[0].clientY - startY;

    if(Math.abs(dx) > Math.abs(dy)) {
        if(dx > 0) dir = {x:10, y:0};
        else dir = {x:-10, y:0};
    } else {
        if(dy > 0) dir = {x:0, y:10};
        else dir = {x:0, y:-10};
    }
});
