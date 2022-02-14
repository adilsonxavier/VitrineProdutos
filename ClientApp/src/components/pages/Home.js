import React from "react";
import styles from "../estilos/Home.module.css";
import savings from "../../img/savings.svg";
import { Link } from "react-router-dom";

function Home() {
    return (
        <section className ={styles.home_container }>
            <h1>Bem vindo ao <span>Costs  151515151</span></h1>
            <p> comece agora</p>
            <a href="/">Criar Projeto</a>
            <img src={savings} alt="aa" /><br />
            <Link to="/admin/home">Adnin</Link>
            
       </section>

        );
}
export default Home;