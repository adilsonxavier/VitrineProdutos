import React from "react";
import styles from "./Container.module.css";

export default function Container(props) {
    return (
            <div id="divcont" className={`${styles.container} ${styles[props.customClass]}` }>
 
            {props.children}
        </div>
        );

}