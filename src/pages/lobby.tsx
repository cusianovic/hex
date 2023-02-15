import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from "@mui/material/Button";
import Grid from "@mui/material/Unstable_Grid2"
import PlayerContainer from '../components/playerContainter';
import styles from "./styles/lobby.module.css"
import Box from '@mui/material/Box';


function SpectatorList(props : any){
    console.log("speclist update");
    //console.log(props.spectators);

    let specs : Array<any> = [];
    if(props.spectators) specs = props.spectators;
    
    let list = Array();
    console.log(specs);

    specs.map((entry) =>{
        let name = entry[1]["name"] || entry[1]["UID"];
        list.push(<li>{name}</li>)
    });

    return(
        <ul>{list}</ul>
    );

}

const Lobby = () => {
    
    const navigate = useNavigate();
    const lobbyCode = window.location.pathname.split('/').pop();
    console.log(lobbyCode);
    
    const [spectators, setSpectators] = React.useState();
    const [player1, setPlayer1] = React.useState("");
    const [player2, setPlayer2] = React.useState("");
    
    const ws : any = React.useRef(null);
    
    React.useEffect(()=>{
        ws.current = new WebSocket(`ws://${window.location.hostname}:${window.location.port}/${lobbyCode}`);
        ws.current.onopen = () => console.log("ws opened");
        ws.current.onclose = () => console.log("ws closed");
        

        ws.current.onmessage = (event) => {
            console.log("recieved message");
            let data = JSON.parse(event.data);
            console.log(data);
            let p1 = "";
            let p2 = "";

            if(data.type == 'join' && data.result == true){
                if(data.player1 != undefined) setPlayer1(data.player1.UID);
                if(data.player2 != undefined) setPlayer2(data.player2.UID);
                setSpectators(data.spectators);
            }
            
            else if(data.type == 'update'){
                if(data.player1 != undefined) p1 = data.player1.name || data.player1.UID
                if(data.player2 != undefined) p2 = data.player2.name || data.player2.UID;
                setPlayer1(p1);
                setPlayer2(p2);
                setSpectators(data.spectators);

                if(data.inGame == true){
                    navigate(`../game/${lobbyCode}`, {replace: true});
                  }
            }
            console.log(spectators);
        };
        
        const wsCurrent = ws.current;
        
        return() =>{
            wsCurrent.close();
        }
        
    }, [])
    
    
    React.useEffect(()=>{}, [spectators]);


    return(
        <Box sx={{
            position: "fixed",
            display: "grid",
            alignItems:"center",
            minHeight: "100vh",
            minWidth: "100vw",
            left: 0,
            top: 0,

        }}>
            <Box className={styles.lobbyHeader}>Lobby</Box>
            <Grid container spacing={4} columns={16}>
                <Grid xs={4}/>
                <PlayerContainer xs={2} sx={{borderColor: "red", background: "RGBA(255, 0, 0, .10)"}}>
                    {player1}
                </PlayerContainer>
                <Grid xs={4} display="flex" justifyContent="center" sx={{userSelect: "none"}}>
                    <div>VS</div>
                </Grid>
                <PlayerContainer xs={2} sx={{borderColor: "blue", background: "RGBA(0, 0, 255, .10)"}}>
                    {player2}
                </PlayerContainer>
                <Grid xs={4}/>
                <Grid xs={7}/>
                <Grid xs={2} display="flex" justifyContent="center">
                    <Button variant='contained' onClick={()=>{ws.current.send(JSON.stringify({type: "start"}))}}>Start Game</Button>
                </Grid>
                <Grid xs={7}/>
            </Grid>
            <Box sx={{
                position: "absolute",
                alignSelf: "end",
                padding: 2,
                paddingRight: 15,
                borderTop: "solid 1px black",
                borderRight: "solid 1px black"
            }}>
                Lobby Code: {lobbyCode}
                <br/>
                Click to copy invite link.
            </Box>
            <Box sx={{
                position: "absolute",
                alignSelf: "end",
                justifySelf: "end",
                padding: 2,
                paddingRight: 15,
                borderTop: "solid 1px black",
                borderLeft: "solid 1px black"
            }}>
                Spectators:
                <br/>
                ​<SpectatorList spectators={spectators}/>
            </Box>
        </Box>
    );

}

export default Lobby;