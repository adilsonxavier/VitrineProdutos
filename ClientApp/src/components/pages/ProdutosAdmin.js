import React from "react";
import axios from "axios";
import ProdutoForm from "./produtoform";
import logo from "../../img/costs_logo.png";

export default function ProdutosAdmin() {
  
    //#region ProdutoForm 
    ///////comp ProdutoForm inicio//////////******************************

    const initialFieldValues = {
        produtoId: "0",
        produtoNome: "",
        produtoDescricao: "",
        produtoValor: "0"
    }

    const [values, setValues] = React.useState(initialFieldValues);

    const handleInputChange = e => {
        //const [name, value] = e.target;
        console.log(e.target.name)

        setValues(
            {
                ...values,
                [e.target.name]: e.target.value
            }

        );
        console.log(values);

    }

    const handleFormSubmit = e => {
        e.preventDefault();
        //console.log("1030");
        //if (validate()) {
        //    console.log("ok 40")
        //}
        //else {
        //    console.log("n ok 42");
        //}

        if (validate()) {
            const formData = new FormData();
            formData.append("produtoId", values.produtoId);
            formData.append("produtoNome", values.produtoNome);
            formData.append("produtoDescricao", values.produtoDescricao);
            formData.append("produtoValor", values.produtoValor.toString().replace(".",",")); // precisa ir com vírgula senão chega como int na api

            addOrEdit(formData, resetForm);

            console.log("ok 54")
        }
        else {
            console.log("tem erro 57")
        }
    }

    const resetForm = () => {
        setValues(initialFieldValues);
        console.log("reset form - success")
        setErrors({});
    }
    const validate = () => {
        let temp = {};
        temp.produtoNome = values.produtoNome == "" ? false : true;
        let produtoValor = values.produtoValor.toString().replace(",", ".");
        temp.produtoValor = produtoValor == "" || isNaN(produtoValor) || parseFloat(produtoValor) <= 0   ? false : true;
        setErrors(temp);
        console.log(temp);
        return Object.values(temp).every(x => x == true);


        //O Object.values(temp) retorna um array com os valores dos elementos do objeto tempo ( só os valores sem os nomes das pro-
        // priedades ) no caso [bool, bool]

        // O Array.every(função) checa se todos os valores do array passam pela função dentro do parâmetro e retorna true apenas se
        // todos os valores passarem pelo teste
        // No caso .every(x => x == false); retorna true (todos os campos ok) apenas se o valor de todos os elementos de temp
        // forem false ( sem erro)
    }
    const [errors, setErrors] = React.useState({});

    const applyErrorClass = (field) => {
         return (field in errors && errors[field] == false) ? " invalid-field" : ""
    };

    const addOrEdit = (formData, onSuccess) => {
        console.log("valor : " + formData.get("produtoValor"))

        if (formData.get("produtoId") == "0") {
            produtoAPI().create(formData)
                .then(resp => {
                    console.log(resp); onSuccess(); refreshProdutoList();
                })
                .catch((err) => { "erro el 19 " + console.log(err) });
        }
        else {

            produtoAPI().update(formData.get("produtoId"), formData)
                .then(resp => {
                    console.log("erro foi " + resp); onSuccess(); refreshProdutoList();
                })
                .catch((err) => { "erro el 60 " + console.log(err) });
        }
    }

    const onDelete = (e, id) => {
        //e.preventDefault()

        // Como o botão está dentro de uma div que já tinha seu proprio onClick, precisa do stopPropagation senão tanto o click
        // do botão quanto da div serão acionados
        e.stopPropagation();
        if (confirm("tem certeza ?")) {
            produtoAPI().delete(id)
                .then(resp => refreshProdutoList())
                .catch(erro => console.log(erro));
        }

    }

    const showRecordDetails = (data) => {
        setRecordForEdit(data);
        // console.log("clicado");

    }
   ///////comp ProdutoForm final//////////****************************************
    //#endregion

    const [produtoList, setProdutoList] = React.useState([]);

    const [recordForEdit, setRecordForEdit] = React.useState(null);

    React.useEffect(() => {

        refreshProdutoList();
        if (recordForEdit != null) {
            setValues(recordForEdit)
        }
    }, [recordForEdit]
    );

    const produtoAPI = (url = "http://localhost:55366/api/produtos") => {
        return {
            fetchAll: () => axios.get(url),
            fetchByName: (wordkey) => axios.get(url + "/GetProdutoByName/" + wordkey),
            create: (newRecord) => axios.post(url, newRecord),
            update: (id, updatedRecord) => axios.put(url + "/" + id, updatedRecord),
            delete: (id) => axios.delete(url + "/" + id)
        }
    }

    function refreshProdutoList() {
        console.log("l 28");
        produtoAPI().fetchAll()
            .then(resp => { setProdutoList(resp.data); console.log("resp:"+resp.data) })
            .catch(err => console.log("o erro lina 26 foi : " + err));

        console.log("linha 33" + produtoList.length);

    }

    return (
        <div>
            <h1> Produtos admin 0253</h1>
            <div style={{display:"flex"}}>
                <div>
                    {/*<!----- produto form inicio ------->*/}
                    <div >
                        <h1>Produto form</h1>
                        <form onSubmit={handleFormSubmit}>
                            <div >

                                <input type="text" name="produtoNome"
                                    value={values.produtoNome}
                                    onChange={handleInputChange}
                                    placeholder="produto nome"
                                    className={applyErrorClass("produtoNome")}
                                />


                                <input type="text" name="produtoDescricao"
                                    value={values.produtoDescricao}
                                    onChange={handleInputChange}
                                    placeholder="descricao"
                                   
                                />

                                <input type="text" name="produtoValor"
                                    value={values.produtoValor}
                                    onChange={handleInputChange}
                                    placeholder="valor"
                                    className={applyErrorClass("produtoValor")}
                                />
                                <button type="submit" >Submit</button>

                            </div>
                        </form>
                    </div >
                    {/*<!----- produto form fim ------->*/}
                </div>


                <table border="1px">
                    <tbody>
                        <tr>
                            <td>Prod id</td>
                            <td>Prod nome</td>
                            <td>Prod desc</td>
                            <td>Prod valor</td>
                            <td>Thumb</td>
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
                                            <img src={produto.imageSrc != "" ? produto.imageSrc : logo} className="thumb" alt={produto.produtoDescricao } /> </td>
                                        <td>
                                            <button onClick={(e) => onDelete(e, parseInt(produto.produtoId))} >Deletar</button>
                                        </td>
                                        <td>
                                            <button onClick={() => { showRecordDetails(produto) }} >Editar</button>
                                        </td>
                                    </tr>
                                ))
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>

    );
}