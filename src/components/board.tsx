import React, { useEffect } from 'react';
import styles from '../pages/styles/game.module.css'
import { useNavigate } from 'react-router-dom';

const colorEnum : {[key: number]: string} = {
  0: "White",
  1: "Red",
  2: "Blue",
}




function Hex({board, row, column, handler} : any){

  let click = ()=>{
    handler(row, column);
  }

  return(
    <div key={"Row" + row.toString() + "Col" + column.toString()} className={styles.hex} style={{background: `${colorEnum[board[row][column]]}`}} onClick={() => click()}></div>
  );
}


function CreateHexRow({ j, vw, vh, boardState, handler} : any ){

    let width = Math.min(((vw) / 16) - (vw / 512), (vh) / 11);

    const translate = j * ((width / 2) + Math.min((vw / 960), (vh / 540)));

    let final : Array<JSX.Element> = [];
    for(let i = 0; i < 11; i++){
        let row = <Hex row={j} column={i} board={boardState} handler={handler}/>;
        
        final.push(row);
    }


    return (<div className={styles.row} style={{transform: `translate(${translate}px)`, zIndex: (11 - j)}}>{final}</div>);
  }


function HexBoard(props){

  let {ws, boardState} = props;
  const [vw, vh] = useWindowSize();

  const targetRef : any = React.useRef();

  function useWindowSize() {
    const [size, setSize] = React.useState([0, 0]);
    React.useLayoutEffect(() => {
      function updateSize() {
        if(targetRef.current) setSize([targetRef.current.offsetWidth, targetRef.current.offsetHeight]);
      }
      window.addEventListener('resize', updateSize);
      updateSize();
      return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
  }

  React.useLayoutEffect(()=>{

  }, [boardState])
  
  let boardUpdateHandler = (i : number, j : number) => {
    console.log(`x: ${j}, y: ${i}`);

    ws.send(JSON.stringify({
      type: "move",
      x: j,
      y: i
    }));
  }

  return(
    <div id={"main"} className={styles.main}>
      <div id={"container"} className={styles.container} ref={targetRef}>

          {[0,1,2,3,4,5,6,7,8,9,10].map((i) =>{
            return <CreateHexRow j={i} vw={vw} vh={vh} boardState={boardState} handler={boardUpdateHandler}/>;
          })}

      </div>
    </div>
  );
  
}

export default HexBoard;