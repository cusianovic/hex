import React from 'react';
import styles from './styles/game.module.css'
import HexBoard from '../components/board';
import Button from "@mui/material/Button"
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { NavigateFunction, useNavigate } from 'react-router-dom';

function leaveGame(redirect : NavigateFunction){
  redirect("../..");
}

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
            <div className={styles.leave}>
              <Button startIcon={<ExitToAppIcon/>} onClick={()=>{leaveGame(navigate)}}sx={{color: "black"}}/>
            </div>
          <HexBoard boardState={boardState} ws={ws.current}/>
        </div>
    )
}

export default Game;