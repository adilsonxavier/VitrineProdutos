import React from "react";
import Foto from "./Foto";
import { useParams } from "react-router-dom";
import axios from "axios";
import api from "../../api"




export default function Fotos() {
    const { id } = useParams()
    const [fotos, setFotos] = React.useState([]);
    const [recordForEdit, setRecordForEdit] = React.useState(null);

        React.useEffect(() => {
        // console.log("AC.useeffect executado");
        const token = localStorage.getItem("token");
        if (token) {
            api.defaults.headers.Authorization = token;
        }
    }, []);


    React.useEffect(() => {
        console.log("fotos 1844");
        refreshFotosList();
    }, []
    );

    //const fotosAPI = (url = "http://localhost:55366/api/fotos") => {
    //    return {
    //        fetchAll: () => axios.get(url),
    //        fetchAllByProduto: (id) => axios.get(url + "/GetFotosProduto/" + id),
    //        create: (newRecord) => axios.post(url, newRecord),
    //        update: (id, updatedRecord) => axios.put(url + "/" + id, updatedRecord),
    //        delete: (id) => axios.delete(url + "/" + id),

    //    }
    //}

    function refreshFotosList() {
        api.get(`/fotos/GetFotosProduto/${id}`, id)
        //fotosAPI().fetchAllByProduto(id)
            .then(resp => { setFotos(resp.data); console.log(resp.data) })
            .catch(err => console.log("o erro lina 26 foi : " + err));

    }

    const onDelete = (e, id) => {
        e.preventDefault() 

        e.stopPropagation();
        if (confirm("tem certeza ?")) {
            //delete: (id) => axios.delete(url + "/" + id),
            api.delete(`/fotos/${id}`)
           // fotosAPI().delete(id)
                .then(resp => refreshFotosList())
                .catch(erro => console.log(erro));
        }

    }

    const estiloimagem = {
        width: "200px",
        height: "200px"
    }

    return (
        <div className="row">
            <div className="col-md-12">
                <div className="jumbotron junbotron-fluid py-4">
                    <div className="container list">
                        <h1 className="display-4">Fotos do Produto {id}</h1>
                    </div>
                </div>
            </div>
            <div style={{display:"flex"}}>
                <div >
                    <Foto
                        produtoId={id}
                        refreshFotosList={refreshFotosList}
                    />
                </div>
                <div className="col-md-8">
                    {
                        fotos.length > 0 &&
                        <ul>
                            {
                                (
                                    fotos.map(
                                        (foto) => (
                                            <li key={foto.fotoId}>{foto.imageName} -- {foto.description} --{foto.fotoId}
                                                <img src={foto.imageSrc} className="card-img-top rounded-circle" style={estiloimagem} ></img>
                                                <button onClick={(e) => onDelete(e, parseInt(foto.fotoId))} >Deletar</button>

                                            </li>
                                        )
                                    ))
                            }
                        </ul>
                    }

                </div>

            </div>



        </div>
    );
}

