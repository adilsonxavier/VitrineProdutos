import React from "react";
import styles from "./Footer.module.css";
import {FaFacebook, FaInstagram, FaLinkedin} from "react-icons/fa" //Não esquecer de por o /fa no final

export default function Footer() {
    return (

        <footer>
            <ul className={ styles.list }>
                <li><FaFacebook /> </li>
                <li><FaInstagram /> </li>
                <li><FaInstagram /> </li>
            </ul>
            <p className={ styles.copyright }><span>Costs</span> &nbsp; &copy;2021</p>
        </footer>


    );

}