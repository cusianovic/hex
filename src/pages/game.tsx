import React from 'react';
import styles from './styles/game.module.css'
import HexBoard from '../components/board';
import { useNavigate } from 'react-router-dom';


const Game = () => {

  const lobbyCode = window.location.pathname.split('/').pop();
  const ws : any = React.useRef(null);

  const navigate = useNavigate();

  let tempState : Array<Array<number>> = [];
  for(let i = 0; i < 11; i++){
    tempState.push([]);
    for(let j = 0; j < 11; j++){
      tempState[i][j] = 0;
    }
  }
  
  let [boardState, updateBoardState] : any = React.useState(tempState);

  React.useEffect(()=>{
    ws.current = new WebSocket(`ws://${window.location.hostname}:${window.location.port}/${lobbyCode}`);
    ws.current.onopen = () => console.log("ws opened");
    ws.current.onclose = () => console.log("ws closed");
    
    ws.current.onmessage = (event) =>{
      console.log(event.data);
      let data = JSON.parse(event.data);
      console.log(data);
      
      if(data.type == 'update'){
        if(data.inGame == false) navigate(`../lobby/${lobbyCode}`, {replace: true});
        console.log(data.gameState);
        updateBoardState(data.gameState);
      }
      

        const wsCurrent = ws.current;

        return() =>{
            wsCurrent.close();
        }
      }

  }, []);

    return(
        <div id={"main"} className={styles.page}>
          <HexBoard boardState={boardState} ws={ws.current}/>
        </div>
    )
}

export default Game;