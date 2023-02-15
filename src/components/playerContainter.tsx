import React from 'react';
import Box from "@mui/material/Box"
import { padding } from '@mui/system';
import Grid, {Grid2Props} from "@mui/material/Unstable_Grid2";
import { alpha, styled } from '@mui/material/styles';


const PlayerContainer = styled(Grid)<Grid2Props>(({theme})=>({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "solid 1px red",
}));

/*
function PlayerContainer(props){
    let player = props.player;
    return(
        <Box sx={{
            border: "solid 1px red",
            padding: 5,
        }}>
            P1: grapes
        </Box>
    )
}
*/
export default PlayerContainer;