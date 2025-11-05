import { useState, useEffect } from "react";

const gridSize = 20;

export default function Game() {
  const [snake, setSnake] = useState([[10,10]]);
  const [food, setFood] = useState([5,5]);
  const [dir, setDir] = useState([0,1]);
  const [pause, setPause] = useState(false);

  const randomFood = () => [Math.floor(Math.random()*gridSize), Math.floor(Math.random()*gridSize)];

  const move = () => {
    if(pause) return;
    
    const newSnake = [...snake];
    const [x,y] = newSnake[newSnake.length - 1];
    const newHead = [x + dir[0], y + dir[1]];

    // Wall hit
    if(newHead[0]<0 || newHead[1]<0 || newHead[0]>=gridSize || newHead[1]>=gridSize) {
      alert("Game Over!");
      location.reload();
      return;
    }

    newSnake.push(newHead);
    if(newHead[0]===food[0] && newHead[1]===food[1]) {
      setFood(randomFood());
    } else {
      newSnake.shift();
    }
    setSnake(newSnake);
  };

  useEffect(() => {
    const interval = setInterval(move, 120);
    document.onkeydown = e => {
      if(e.key === "w") setDir([-1,0]);
      if(e.key === "s") setDir([1,0]);
      if(e.key === "a") setDir([0,-1]);
      if(e.key === "d") setDir([0,1]);
    };
    return () => clearInterval(interval);
  });

  return (
    <div>
      <h2>Snake Game</h2>
      <button onClick={() => setPause(!pause)}>{pause ? "Resume" : "Pause"}</button>
      <button onClick={() => location.reload()}>Retry</button>

      <div className="game-board">
        {Array.from({length:gridSize*gridSize}).map((_,i)=>{
          const x=Math.floor(i/gridSize),y=i%gridSize;
          const isSnake = snake.some(s=>s[0]===x&&s[1]===y);
          const isFood = food[0]===x&&food[1]===y;
          return <div key={i} className={`cell ${isSnake?'snake':''} ${isFood?'food':''}`}></div>
        })}
      </div>
    </div>
  );
}
