import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles/home.module.css'
import Button from '../components/button';
import TextField from "@mui/material/TextField";


let Join = () => {
    const navigate = useNavigate();

    const [inputField, setInputField] = React.useState('');

    const inputHandler = (e) => {
        setInputField(e.target.value);
    }

    const submit = () => {
        navigate(`../lobby/${inputField}`);
    }

    return(
        <main className={styles.main}>
            <div className={styles.title}>Hex</div>
            <div className={styles.buttonContainer}>
                <div className={styles.button}>
                    <TextField type="text" variant='standard' name="code" onChange={inputHandler} placeholder='Lobby Code' value={inputField}/>
                    <br/>
                    <Button onClick={submit}>Join Game</Button></div>
            </div>
        </main>
        )
}
export default Join;