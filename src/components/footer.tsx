import React from "react";
import styles from "./styles/footer.module.css"

function Footer(){
    return(
        <footer>
        <div className={styles.footer}>
            Made by <a href="https://cusianovic.net">Sebastian Cusianovic</a><br/>
            <a href="https://github.com/cusianovic/hex">View on GitHub</a><br/>
            <a href="https://www.buymeacoffee.com/cusianovic">Buy me a coffee!</a>
        </div>
        </footer>
    )
}

export default Footer;