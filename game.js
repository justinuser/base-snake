/* ————————————— GLOBALS ————————————— */
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const grid = 20;

let snake, dx, dy, food, score, loop, paused = false, muted = false;

const eatSound = new Audio("assets/eat.mp3");
const dieSound = new Audio("assets/die.mp3");

/* ————————————— SCREENS ————————————— */
const splash = document.getElementById("splash");
const loading = document.getElementById("loading");
const menu = document.getElementById("menu");
const gameUI = document.getElementById("gameUI");
const tutorial = document.getElementById("tutorial");
const scores = document.getElementById("scores");
const retryBtn = document.getElementById("retryBtn");

/* ————————————— START FLOW ————————————— */
setTimeout(() => {
    splash.classList.add("hidden");
    loading.classList.remove("hidden");
    animateLoadingSnake();
}, 1200);

setTimeout(() => {
    loading.classList.add("hidden");
    menu.classList.remove("hidden");
}, 3200);

/* ————————————— MENUS ————————————— */
function startGame() {
    menu.classList.add("hidden");
    gameUI.classList.remove("hidden");
    initGame();
}
function openTutorial(){ tutorial.classList.remove("hidden"); }
function closeTutorial(){ tutorial.classList.add("hidden"); }
function openScores(){
    scores.classList.remove("hidden");
    document.getElementById("bestScoreText").textContent =
        localStorage.getItem("bestSnakeScore") || 0;
}
function closeScores(){ scores.classList.add("hidden"); }

/* ————————————— GAME LOGIC ————————————— */
function initGame() {
    snake = [{x:200, y:200}];
    dx = grid; dy = 0;
    food = placeFood();
    score = 0;
    document.getElementById("score").textContent = score;
    loop = setInterval(update, 120);
}
function placeFood() {
    return {
        x: Math.floor(Math.random()*20)*grid,
        y: Math.floor(Math.random()*20)*grid
    };
}
function update() {
    if(paused) return;

    const head = { x: snake[0].x+dx, y: snake[0].y+dy };

    // Hit wall or self?
    if (head.x<0||head.x>=400||head.y<0||head.y>=400 ||
        snake.some(p => p.x===head.x && p.y===head.y)) {

        if(!muted) dieSound.play();
        endGame();
        return;
    }

    snake.unshift(head);

    if (head.x===food.x && head.y===food.y) {
        score++;
        if(!muted) eatSound.play();
        document.getElementById("score").textContent = score;
        food = placeFood();
    } else {
        snake.pop();
    }

    draw();
}
function draw() {
    ctx.clearRect(0,0,400,400);

    // Food (pixel base coin)
    let coin = new Image();
    coin.src = "assets/basecoin.png";
    ctx.drawImage(coin, food.x, food.y, grid, grid);

    // Snake pixel style
    snake.forEach((p,i)=>{
        ctx.fillStyle = i===0 ? "#4F8BFF" : "#FFFFFF";
        ctx.fillRect(p.x,p.y,grid,grid);
    });
}

/* ————————————— GAME CONTROLS ————————————— */
document.addEventListener("keydown", e=>{
    if(e.key==="w"||e.key==="ArrowUp") dy===0 && (dx=0,dy=-grid);
    if(e.key==="s"||e.key==="ArrowDown") dy===0 && (dx=0,dy=grid);
    if(e.key==="a"||e.key==="ArrowLeft") dx===0 && (dx=-grid,dy=0);
    if(e.key==="d"||e.key==="ArrowRight") dx===0 && (dx=grid,dy=0);
});

function pauseGame(){ paused=!paused; }
function retryGame(){ location.reload(); }

/* ————————————— SOUND ————————————— */
function toggleMute(){
    muted=!muted;
    document.getElementById("muteBtn").textContent = muted?"🔇":"🔊";
}

/* ————————————— WALLET ————————————— */
async function connectWallet(){
    if(!window.ethereum) return alert("Install wallet");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts",[]);
    const signer = provider.getSigner();
    document.getElementById("walletAddr").textContent =
       (await signer.getAddress()).slice(0,6)+"...connected";
}

/* ————————————— GAME OVER ————————————— */
function endGame(){
    clearInterval(loop);
    retryBtn.classList.remove("hidden");

    let best = localStorage.getItem("bestSnakeScore") || 0;
    if(score > best) localStorage.setItem("bestSnakeScore", score);
}

/* ————————————— LOADING ANIMATION ————————————— */
function animateLoadingSnake(){
    const c = document.getElementById("loadingSnake");
    const g = c.getContext("2d");
    let x=0;
    setInterval(()=>{
        g.clearRect(0,0,200,200);
        g.fillStyle="#4F8BFF";
        g.fillRect(10+x,100,10,10);
        x = (x+10)%180;
    },100);
}
