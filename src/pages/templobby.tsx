import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from "@mui/material/Button";
import Grid from "@mui/material/Unstable_Grid2"
import PlayerContainer from '../components/playerContainter';
import styles from "./styles/lobby.module.css"
import Box from '@mui/material/Box';


function SpectatorList(props : any){


    return(
        <ul><li>{props.spectators}</li></ul>
    );

}

const Lobby = ()=>{
    /*
    return(
        <span>
            <div>
                Player 1: John
            </div>

            <div>
                Player 2: Steve
            </div>

            <div>
                Spectators: 
                <SpectatorList spectators={"george"}/>
            </div>
            <div>
                <Button variant="contained" >Start Game</Button>
            </div>
        </span>
    );
    */

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
                    Steven
                </PlayerContainer>
                <Grid xs={4} display="flex" justifyContent="center" sx={{userSelect: "none"}}>
                    <div>VS</div>
                </Grid>
                <PlayerContainer xs={2} sx={{borderColor: "blue", background: "RGBA(0, 0, 255, .10)"}}>
                    RAWR
                </PlayerContainer>
                <Grid xs={4}/>
                <Grid xs={7}/>
                <Grid xs={2} display="flex" justifyContent="center">
                    <Button variant='contained'>Start Game</Button>
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
                Lobby Code:
                <br/>
                Invite Link: 
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
                ​
                 
            </Box>
        </Box>
        
    )
}

export default Lobby;