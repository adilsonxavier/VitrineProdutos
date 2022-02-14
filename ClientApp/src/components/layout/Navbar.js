import React from "react";
import { useHistory, Link } from 'react-router-dom';
import styles from "./Navbar.module.css";
import logo from "../../img/costs_logo.png";
import { Context } from "../Contexts/Context1";

export default function Navbar(props) {
    const { logged, setLogged } = React.useContext(Context);
    const history = useHistory();

    const logout = () => {
        localStorage.removeItem("token");
        setLogged(false);
        history.push("/login");
    }

    return (
        <nav className={styles.navbar}>
            {/*            <Container>*/}
            <Link to="/" ><img src={logo} alt="meu logo" /></Link>

            <ul className={styles.list}>
                <li>
                    <Link to="/" >Home</Link>  {/* o Link é renderizado como uma tag <a>*/}
                </li>

                <li>
                    <Link to="/company" >Empresa</Link>
                </li>

                <li>
                    {logged
                        ? <a onClick={logout } >Logout</a>
                        : <Link to="/login" >Login</Link>
                    }

                </li>


            </ul>

            {/*            </Container>*/}
        </nav>

    );

}