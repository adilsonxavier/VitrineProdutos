import React from "react";
import jwt_decode from "jwt-decode";

export const Context = React.createContext();

export default function ContextProvider(props) {
    const [authorized, setAuthorized] = React.useState(false);
    const [token, setToken] = React.useState("");
    const [logged, setLogged] = React.useState(false);

    const checkExpiredToken = () => {
        const tokengravado = localStorage.getItem("token").replace("Bearer ", "");

        if (tokengravado) {
            const tokengravado2 = JSON.parse(JSON.stringify(jwt_decode(tokengravado)));
            const exp = tokengravado2.exp;

            const agora = Math.floor(Date.now() / 1000);

            var expired = false;

            if (agora >= exp) {
                expired = true;
            }
            else {
                expired = false;
            }

            return expired;
        }
    }


    //React.useEffect(() => {
    //    // console.log("AC.useeffect executado");
    //    const token = localStorage.getItem("token");
    //    if (token) {
    //        api.defaults.headers.Authorization = token;
    //    }
    //}, []);

    return (
        <Context.Provider value={{ authorized, setAuthorized, token, setToken, checkExpiredToken, logged, setLogged}}>
            {props.children}
        </Context.Provider>
        );

}