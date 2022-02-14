import React from "react";
import axios from "axios";
import api from "../../api";

import { useHistory, Link } from 'react-router-dom';

import { Context } from "../Contexts/Context1";



export default function Login() {
    const history = useHistory();
    const { authorized, setAuthorized, baseUrl,token,setToken,logged,setLogged} = React.useContext(Context)
    //const handleLogar = e => {
    //   e.preventDefault();
    //    console.log("btn2");
    //    history.push("/admin/produtosAdmin");
    //}

    const userAPI = (url = `${baseUrl}/user`) => {
        return {
            authenticate: (user) => axios.post(`${url}/user/login`, user)
            //fetchAll: () => axios.get(url),
            ////fetchByPaginationNome: (wordkey) => axios.get(url + "/GetProdutosPaginacao/" + wordkey),
            //fetchByPagination: () => axios.get(`${url}/GetProdutosPaginacao/${currentPage2}/${PAGESIZE}/${busca}`),
            //create: (newRecord) => axios.post(url, newRecord),
            //update: (id, updatedRecord) => axios.put(url + "/" + id, updatedRecord),
            //delete: (id) => axios.delete(url + "/" + id)
        }
    }


   async function handleAutenticate () {
        console.log("auth 0938");
        const user = { name: "maysa", password: "123456" };
      // const { data } = await userAPI().authenticate(user);
      // api.defaults.baseURL = 'https://api.example.com';
       const { data } = await api.post("/user/login", user)

      // const { data: { token } } = await api.post("/authenticate");

       const meutoken = JSON.stringify(data.token);
       setToken(meutoken);
       setAuthorized(true); 
     //  localStorage.setItem("token", meutoken);
       
       api.defaults.headers.Authorization = `Bearer ${data.token}`
       localStorage.setItem("token", `Bearer ${data.token}`);
       /* console.log("handle authedafd0502s 36" + data.token + "json"+ JSON.stringify(data.token));*/
       console.log("api def 12300 " + api.defaults.headers.Authorization)
       setLogged(true);
       setAuthorized(true);
       console.log("logged tela login " + logged);
       console.log("authorizedd tela login " + authorized)
      history.push("/ProdutosAdmin");

    }
    return (
        <div>
            <h1>Tela de Login buc443454545</h1>
            
            <button onClick={handleAutenticate}>Logar</button>

        </div>

        );
}
