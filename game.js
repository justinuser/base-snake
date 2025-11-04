/* ------------------ Splash -> Loading -> Menu ------------------ */
setTimeout(() => {
    splash.style.display="none";
    loading.style.display="block";

    const frames=["Oooo","OOoo","OOOo","OOOO"]; 
    let i=0;
    let anim=setInterval(()=>{
        loadSnake.textContent = frames[i];
        i=(i+1)%frames.length;
    },400);

    setTimeout(()=>{
        clearInterval(anim);
        loading.style.display="none";
        menu.style.display="block";
    },3000);

},1500);

/* ------------------ Buttons ------------------ */
startBtn.onclick = () => { menu.style.display="none"; gameContainer.style.display="block"; startGame(); }
tutorialBtn.onclick = () => alert("Controls:\nW A S D or Arrows\nSwipe on Mobile\nEat BaseCoins ✅");
bestBtn.onclick = () => alert("On-chain leaderboard coming 🔥");
walletBtn.onclick = () => alert("Wallet connect coming soon 💙");

pauseBtn.onclick = ()=> togglePause();
retryBtn.onclick = ()=> location.reload();
muteBtn.onclick = ()=> toggleMute();

/* ------------------ Game ------------------ */
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const grid = 20;

let snake,dx,dy,food,score,speed,loop,paused=false,soundOn=false;

const bite = new Audio(); // future sound fx
bite.src = ""; // placeholder

const coin = new Image();
coin.src = "basecoin.png";

function startGame(){
    snake=[{x:160,y:200}];
    dx=grid; dy=0;
    food=randFood();
    score=0; speed=150;
    loop=setInterval(update,speed);
}

function randFood(){
    return {x:Math.floor(Math.random()*20)*grid, y:Math.floor(Math.random()*20)*grid};
}

function drawSnake(){
    snake.forEach((p,i)=>{
        if(i===0){
            ctx.fillStyle="#4F8BFF";
            ctx.fillRect(p.x,p.y,grid,grid);

            // blinking eyes
            if(Date.now()%700<400){
                ctx.fillStyle="white";
                ctx.fillRect(p.x+4,p.y+4,3,3);
                ctx.fillRect(p.x+13,p.y+4,3,3);
            }
        } else {
            ctx.fillStyle="#2f5dcc";
            ctx.fillRect(p.x,p.y,grid,grid);
        }
    });
}

function drawFood(){ ctx.drawImage(coin,food.x,food.y,grid,grid); }

function update(){
    if(paused) return;

    const head={x:snake[0].x+dx, y:snake[0].y+dy};

    if(head.x<0||head.x>=400||head.y<0||head.y>=400|| snake.some(p=>p.x===head.x&&p.y===head.y)){
        alert("Game ended. Exit?");
        location.reload();
        return;
    }

    snake.unshift(head);

    if(head.x===food.x && head.y===food.y){
        score++;
        food=randFood();
        if(soundOn) bite.play();
    } else snake.pop();

    ctx.clearRect(0,0,400,400);
    drawFood();
    drawSnake();
}

/* ------------------ Controls ------------------ */
document.addEventListener("keydown", e=>{
    const k=e.key;
    if(k==="w"||k==="ArrowUp")   {dx=0; dy=-grid;}
    if(k==="s"||k==="ArrowDown") {dx=0; dy=grid;}
    if(k==="a"||k==="ArrowLeft") {dx=-grid; dy=0;}
    if(k==="d"||k==="ArrowRight"){dx=grid; dy=0;}
});

/* Mobile Swipe */
let sx=0, sy=0;
document.addEventListener("touchstart",e=>{sx=e.touches[0].clientX; sy=e.touches[0].clientY;});
document.addEventListener("touchmove",e=>{
    let dxT=e.touches[0].clientX-sx;
    let dyT=e.touches[0].clientY-sy;
    if(Math.abs(dxT)>Math.abs(dyT)){
        if(dxT>0) {dx=grid;dy=0;} else {dx=-grid;dy=0;}
    } else {
        if(dyT>0) {dx=0;dy=grid;} else {dx=0;dy=-grid;}
    }
});

/* Pause / Sound */
function togglePause(){
    paused=!paused;
    pauseBtn.textContent = paused ? "▶️ Resume" : "⏸ Pause";
}
function toggleMute(){
    soundOn=!soundOn;
    muteBtn.textContent = soundOn ? "🔊" : "🔈";
}
