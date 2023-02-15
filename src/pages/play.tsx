import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles/home.module.css'
import Button from "@mui/material/Button";



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


let Play = () => {
    const navigate = useNavigate();
    return(
        <main className={styles.main}>
            <div className={styles.title}>Hex.io</div>
            <div className={styles.buttonContainer}>
                <div><Button variant="contained" onClick={()=>{ajax(navigate)}} className={styles.button}>Create Game</Button></div>
                <div><Button variant="contained" className={styles.button}><Link to="/join" style={{all: "unset"}}>Join Game</Link></Button></div>
            </div>
        </main>
        )
}
export default Play;