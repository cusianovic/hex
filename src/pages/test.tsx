import React from 'react';
import styles from './styles/game.module.css'
import HexBoard from '../components/board';
import { useNavigate } from 'react-router-dom';


const Test = () => {

    let tempState : Array<Array<number>> = [];
    for(let i = 0; i < 11; i++){
      tempState.push([]);
      for(let j = 0; j < 11; j++){
        tempState[i][j] = 0;
      }
    }

    return(
        <div id={"main"} className={styles.page}>
            <HexBoard boardState={tempState}/> 
        </div>
    )
}

export default Test;