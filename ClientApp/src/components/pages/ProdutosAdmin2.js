import React from "react";
import axios from "axios";
import { useHistory, Link } from 'react-router-dom';
import logo from "../../img/costs_logo.png";
import Pagination from "../layout/Pagination";
import Loading from "../layout/Loading";
import { Context } from "../Contexts/Context1";
import api from "../../api"

export default function ProdutosAdmin2() {
    //////////// Paginação ///////////
    const PAGESIZE = 10;
    // const TOTALITENS= 120;
    //const SKIP = 24;
    //const [skip, setSkip] = React.useState(0);
    const [currentPage2, setCurrentPage2] = React.useState(1);
    const [totalItens, setTotalItens] = React.useState(0);

     //////////// Paginação fin ///////////

    const history = useHistory();

    const { authorized, setAuthorized, baseUrl, checkExpiredToken,logged} = React.useContext(Context);

  /*  const [token, setToken] = React.useState("");*/

    const [busca, setBusca] = React.useState("");
    const [values, setValues] = React.useState("");
    const [showLoading, setShowLoading] = React.useState(true);

    const [produtoList, setProdutoList] = React.useState([]);

   // const [recordForEdit, setRecordForEdit] = React.useState(null);

    React.useEffect(() => {

        console.log("logged " + logged);
      //  console.log("token refresh 34 " + token);
        //var tokenAtual = localStorage.getItem("token");
        //console.log(" token atual useeffect 1728" + tokenAtual);
        if (checkExpiredToken()) {
            alert("token expirado! \n Faça novo login.");
            history.push("/login");
        }


        //if (!tokenAtual) {
        //    history.push("/login");
        //  }
        //const token = localStorage.getItem("token");
        //if (token) {
        //    api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`;
        //   // setAuthenticated(true);
        //}
        //setToken(tokenAtual);.

             // console.log("AC.useeffect executado");
            const token = localStorage.getItem("token");
        if (token) {
            api.defaults.headers.Authorization = token;
        }

        refreshProdutoList();
        //if (recordForEdit != null) {
        //    setValues(recordForEdit)
        //}
    }, [currentPage2,busca]
    );

    const produtoAPI = (url = "http://localhost:55366/api/produtos") => {
        return {
            fetchAll: () => axios.get(url),
            //fetchByPaginationNome: (wordkey) => axios.get(url + "/GetProdutosPaginacao/" + wordkey),
            fetchByPagination: (tokenAtual) => axios.get(`${url}/GetProdutosPaginacao/${currentPage2}/${PAGESIZE}/${busca}`, {
                headers: {
                    "Authorization": `Bearer ${tokenAtual}`
                }
              }),
            create: (newRecord) => axios.post(url, newRecord),
            update: (id, updatedRecord) => axios.put(url + "/" + id, updatedRecord),
            delete: (id) => axios.delete(url + "/" + id, {
                headers: {
                    "Authorization": `Bearer ${tokenAtual}`
                }
            })
        }
    }

    function refreshProdutoList() {
        console.log("api def prodadm 1202 " + api.defaults.headers.Authorization);
        api.get(`/produtos/GetProdutosPaginacao/${currentPage2}/${PAGESIZE}/${busca}`)
        //produtoAPI().fetchByPagination(JSON.parse(token))
            .then(resp => {
                setProdutoList(resp.data); setTotalItens(resp.data[0] != undefined ? resp.data[0].qtdTotalItens : 0);
                setShowLoading(false);
                console.log("47 total itens " + totalItens); console.log("resp:" + JSON.stringify(resp.data[0])) })
            .catch(err => console.log("o erro lina 26 foi : " + err));

        console.log("linha 33" + produtoList.length);

    }

    const onDelete = (e, id) => {
        //e.preventDefault()

        // Como o botão está dentro de uma div que já tinha seu proprio onClick, precisa do stopPropagation senão tanto o click
        // do botão quanto da div serão acionados
        console.log("delete 85 1251");

        e.stopPropagation();
        if (confirm("tem certeza ?")) {
            api.delete(`/produtos/${id}`)
          //  produtoAPI().delete(id, JSON.parse(token))
                .then(resp => refreshProdutoList())
                .catch(erro => console.log(erro));
        }

    }

    const handleBusca = () => {
        setBusca(values.busca != undefined ? values.busca : "");
        console.log("78 busca " + busca);
    }

    const handleInputChange = e => {
        // const [name, value] = e.target;
        setValues(
            {
                ...values,
                [e.target.name]: e.target.value
            }

        );
       

    }

    return (
        <div>
            <h1> Produtos admin 0253</h1>
            <input type="text" placeholder="busca" name="busca" onChange={handleInputChange} />
            <button onClick={handleBusca} >Buscar</button>
            {
                showLoading &&
                (
                  <Loading />
                )
            }

            <div style={{ display: "flex",flexDirection:"column" }}>
                <div>
                    <Link to={"/ProdutoForm/0"} > Novo Produto </Link>
                </div>

                <table border="1px">
                    <tbody>
                        <tr>
                            <td>Prod id</td>
                            <td>Prod nome</td>
                            <td>Prod desc</td>
                            <td>Prod valor</td>
                            <td>Thumbr</td>
                            <td>Deletar</td>
                            <td>Editar</td>
                        </tr>
                        {
                            (produtoList.length > 0 &&
                                produtoList.map(produto => (
                                    <tr key={produto.produtoId}>
                                        <td>{produto.produtoId}</td>
                                        <td>{produto.produtoNome}</td>
                                        <td>{produto.produtoDescricao}</td>
                                        <td>{produto.produtoValor}</td>
                                        <td>

                                            <img src={produto.imageSrc != "http://localhost:55366/images/" ? produto.imageSrc : logo} className="thumb" alt={produto.imageSrc} />
                                        </td>
                                         
                                        <td>
                                            <button onClick={(e) => onDelete(e, parseInt(produto.produtoId))} >Deletar</button>
                                        </td>
                                        <td>

                                            <Link style={{ border: "solid 1px red" }} to={`/produtoForm/${produto.produtoId}`} >editar</Link>
                                        </td>
                                    </tr>
                                ))
                            )
                        }
                    </tbody>
                </table>
                <br />
                {totalItens > 0 &&
                    <Pagination
                    pageSize={PAGESIZE}
                    totalItens={totalItens}
                    currentPage2={currentPage2}
                    setCurrentPage2={setCurrentPage2}
                    setShowLoading={setShowLoading}

                    />

                }
            </div>
        </div>

    );
}