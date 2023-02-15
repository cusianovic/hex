import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles/home.module.css'
import Button from '../components/button';
import { Tooltip } from '@mui/material';

async function ajax(nav){
    console.log("POGO");
    let x = await fetch(`/api/lobby/create_lobby`, {
        method: "post",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then((response) => {return response.json()});
    
    if(x.status == 'redirect'){
        nav(`../${x.url}`);
    }
}
const Home = () => {
    const navigate = useNavigate();
    return(
    <main className={styles.main}>
        <div className={styles.title}>Hex</div>
        <hr/>
        <div className={styles.buttonContainer}>
            <div>
                <Button variant="contained" onClick={()=>{ajax(navigate)}}>New Game</Button>
                <Button variant='contained' href='/join'>Join Game</Button>
            </div>
                <div>
                    <Tooltip title="Coming soon">
                        <span>
                            <Button variant='contained' href='/setting' disabled>Settings</Button>
                        </span>
                    </Tooltip>
                </div>
        </div>
    </main>
    )
}

export default Home;