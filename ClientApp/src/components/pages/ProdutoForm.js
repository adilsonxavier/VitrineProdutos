import React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useHistory } from 'react-router-dom';
import { Link } from "react-router-dom";
import api from "../../api"

export default function ProdutoForm() {

    const history = useHistory();

    const { id } = useParams()
    //#region ProdutoForm 
    ///////comp ProdutoForm inicio//////////******************************

    const initialFieldValues = {
        produtoId: "0",
        produtoNome: "",
        produtoDescricao: "",
        produtoValor: "0"
     }

    const [values, setValues] = React.useState(initialFieldValues);

    React.useEffect(() => {

        //refreshProdutoList();
        if (id != "0") {
            refeshProduto(id);
        }
        refreshCategoriasList(id);
        //if (recordForEdit != null) {
        //    setValues(recordForEdit)
        //}
    }, []
    );

    const produtoAPI = (url = "http://localhost:55366/api/produtos") => {
        return {
            fetchAll: () => axios.get(url),
            fetchByName: (wordkey) => axios.get(url + "/GetProdutoByName/" + wordkey),
            //fetchById: (id) => axios.get(url + "/" + id),
            create: (newRecord) => axios.post(url, newRecord),
            update: (id, updatedRecord) => axios.put(url + "/" + id, updatedRecord),
            delete: (id) => axios.delete(url + "/" + id)
        }
    }

    const refeshProduto = (id) => {
        console.log("api getbyid 1310 " + api.defaults.headers.Authorization);
        api.get(`/produtos/${id}`)
        //produtoAPI().fetchById(id)
            .then(resp => {
                setValues(resp.data);
                console.log("dados: " + resp.data);
            })
            .catch(erro => console.log("refresh Produtos erro:"+ erro ));

    }
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


        //////////////////
        //var formData = new FormData;
        //var arr = ['this', 'is', 'an', 'array'];

        //for (var i = 0; i < arr.length; i++) {
        //    formData.append('arr[]', arr[i]);
        //}
        //////////////////

        if (validate()) {
            const formData = new FormData();
            formData.append("produtoId", values.produtoId);
            formData.append("produtoNome", values.produtoNome);
            formData.append("produtoDescricao", values.produtoDescricao);
            formData.append("produtoValor", values.produtoValor.toString().replace(".", ",")); // precisa ir com vírgula senão chega como int na api

            //console.log("cats values" + values.categorias);
            //for (var i = 0; i < categorias.length; i++) {
            //    formData.append('categorias[]',JSON.stringify(categorias[i]));
            //    console.log("102 categoria " + i + " = " + JSON.stringify(categorias[i]));
            //}
           // console.log(" 104 categorias[] ", JSON.stringify(values.categorias));

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
        temp.produtoValor = produtoValor == "" || isNaN(produtoValor) || parseFloat(produtoValor) <= 0 ? false : true;
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
       
       // create: (newRecord) => axios.post(url, newRecord),
        if (formData.get("produtoId") == "0") {

            api.post("/produtos/", formData)
           // produtoAPI().create(formData)
                .then(response => { return response.data
                   // resp.json()
                  //  console.log("150" + response.json());
                    //console.log(resp); onSuccess(); /* refreshProdutoList()*/;
                    //alert("Produto inserido com sucesso ");
                    //history.push("/produtosAdmin");
                }
                )
                .then(data => {
                    api.put(`/categorias/PutCategoriasProduto/${data.produtoId}`, categorias)
                    //categoriasAPI().update(data.produtoId, categorias)
                        .then(resp => {
                            console.log("1002 1404")
                             alert("Produto inserido com sucesso ");
                            history.push(`/produtoForm/${data.produtoId}`);
                        })
                        .catch(erro => console.log(erro))

                })
                .catch((err) => { "erro el 19 " + console.log(err) });
        }
        else {
            //update: (id, updatedRecord) => axios.put(url + "/" + id, updatedRecord),
            api.put(`/produtos/${formData.get("produtoId")}`, formData)
           // produtoAPI().update(formData.get("produtoId"), formData)
                .then(resp => {
                    //console.log("erro foi " + resp); onSuccess(); /*refreshProdutoList()*/;
                    //alert("Produto " + formData.get("produtoId") + " atualizado");
                    //history.push("/produtosAdmin");
                    //update: (id, updatedRecord) => axios.put(url + "/PutCategoriasProduto/" + id, updatedRecord),
                    api.put(`/categorias/PutCategoriasProduto/${id}`,categorias)
                   // categoriasAPI().update(id, categorias)
                        .then(resp => {
                            console.log("1002 1400")
                               alert("Produto " + formData.get("produtoId") + " atualizado");
                                 history.push("/produtosAdmin");
                        })
                        .catch(erro => console.log(erro))
                })
                 .catch((err) => { "erro el 60 " + console.log(err) });
        }
    }

    //////////////
    //categoriasAPI().update(id, categorias)
    //    .then(data => console.log(data))
    //    .catch(erro => console.log(erro));
    /////////////



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


    //#region categorias
    /////// checklist categorias inicio /////////cccccccccccccccccccccccccccccccccccccc
    const [categorias, setCategorias] = React.useState([]);
    const categoriasAPI = (url = "http://localhost:55366/api/categorias") => {
        return {
            fetchAll: () => axios.get(url),
            fetchAllByProduto: (id) => axios.get(url + "/GetCategoriasProduto/" + id),
            create: (newRecord) => axios.post(url, newRecord),
            update: (id, updatedRecord) => axios.put(url + "/PutCategoriasProduto/" + id, updatedRecord),
            delete: (id) => axios.delete(url + "/" + id),

        }
    }

    function refreshCategoriasList(id) {
        console.log("refredh cat id " + id)
        api.get(`/categorias/GetCategoriasProduto/${id}`)
      //  categoriasAPI().fetchAllByProduto(id)
            .then(resp => setCategorias(resp.data))
            .catch(err => console.log("o erro lina 26 foi : " + err));
       // console.log("213 : "+ JSON.stringify(categorias));
        // setValues({ ...values, categorias: categorias });
    }


    const handleOnChangeCategorias = (e, index) => {

        const updatedCheckedState = categorias.map((categoria, position) => {
            let updateElement = {
                //categoriaId: categoria.categoriaId,
                //categoriaName : categoria.categoriaName,
                ...categoria,
                checked: position == index ? !categoria.checked : categoria.checked
            }
            return updateElement;
        });
        setCategorias(updatedCheckedState);
       // console.log("227 " + JSON.stringify(categorias));
        //setValues({ ...values, categorias: categorias });
        //console.log("227 " + JSON.stringify(categorias));
    }

     /////// checklist categorias fim /////////cccccccccccccccccccccccccccccccccccccc
     //#endregion

    return (
  
        <div >
            <h1>{ id != "0" ? "editando produto " + id : "novo produto" }</h1>
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
                         

                            <section>
                                <h1>categorias</h1>
                                <div >
                                    {
                                        categorias.length > 0 &&
                                        /*<form onSubmit={handleFormSubmit}>*/
                                        (

                                            <ul>
                                                {
                                                    (
                                                        categorias.map(
                                                            (categoria, index) => (

                                                                <div className="left-section" key={categoria.categoriaId}>
                                                                    <input
                                                                        type="checkbox"
                                                                        id={categoria.categoriaId}
                                                                        name={categoria.categoriaNome}
                                                                        value={categoria.categoriaNome}
                                                                        checked={categoria.checked}
                                                                        onChange={(e) => handleOnChangeCategorias(e, index)}
                                                                    />
                                                                    <label htmlFor={categoria.categoriaNome}>{categoria.categoriaNome} -indice: {index}</label>
                                                                </div>
                                                            )
                                                        ))
                                                }
                                            </ul>
                                        )

                                    }
                                </div>

                            </section>
                            <br />
                            <button type="submit" >Submit</button>
                            {id != 0 &&
                                <Link to={`/Fotos/${id}`} >fotos </Link>
                            }
                            &nbsp;
                            <Link to="/produtosAdmin" >Voltar</Link>
                         </div>
                    </form>
                </div >
                {/*<!----- produto form fim ------->*/}
            </div>
        </div >
       
        );

}