import React from "react";
import logo from "../../img/costs_logo.png";
import api from "../../api"

export default function Foto(props) {

    const { recordForEdit, produtoId,  refreshFotosList } = props;

    const defaultImageSrc = logo;

    const initialFieldValues = {
        fotoId: "0",
        description: "",
        position: "0",
        imageName: "",
        imageSrc: defaultImageSrc,
        imageFile: null,
        produtoId: produtoId,
    }

    const [values, setValues] = React.useState(initialFieldValues);
    const [errors, setErrors] = React.useState({});

    const showPreview = e => {
        if (e.target.files && e.target.files[0]) {
            let imageFile = e.target.files[0];
            const reader = new FileReader();
            reader.onload = x => {
                setValues(
                    {
                        ...values,
                        imageFile,
                        imageSrc: x.target.result,
                    }
                );
            }
            reader.readAsDataURL(imageFile);
            // console.log(imageFile);
        }
        else {
            alert("dfas");
            setValues(
                {
                    ...values,
                    imageFile: null,
                    imageSrc: defaultImageSrc
                }
            );
        }
    }
    const validate = () => {
        let temp = {};
        temp.description = values.description == "" ? false : true;
        temp.imageSrc = values.imageSrc == defaultImageSrc ? false : true;
        setErrors(temp);
        console.log(temp);
        return Object.values(temp).every(x => x == true);

        //O Object.values(temp) retorna um array com os valores dos elementos do objeto temp( só os valores sem os nomes das pro-
        // priedades ) no caso [bool, bool]

        // O Array.every(função) checa se todos os valores do array passam pela função dentro do parâmetro e retorna true apenas se
        // todos os valores passarem pelo teste
        // No caso .every(x => x == false); retorna true (todos os campos ok) apenas se o valor de todos os elementos de temp
        // forem false ( sem erro)
    }

    const addOrEdit = (formData, onSuccess) => {
        console.log("fotos 1517 " + formData.get("produtoId"));
        ////if (formData.get("produtoId") == "0") {
        // create: (newRecord) => axios.post(url, newRecord),
        api.post("/fotos", formData)
       // fotosAPI().create(formData)
            .then(resp => {
                console.log(resp); onSuccess(); refreshFotosList();
            })
            .catch((err) => { "erro el 74 " + console.log(err) });
        //}
        //else {

        //    produtoAPI().update(formData.get("produtoId"), formData)
        //        .then(resp => {
        //            console.log("erro foi " + resp); onSuccess(); refreshEmployeeList();
        //        })
        //        .catch((err) => { "erro el 60 " + console.log(err) });
        //}

    }

    const resetForm = () => {
        setValues(initialFieldValues);
        document.getElementById("image-uploader").value = null;
        console.log("reset form - success")
        setErrors({});
    }
    const resetImage = (e) => {
        e.preventDefault();
        setValues(
            {
                ...values,
                imageFile: null,
                imageSrc: defaultImageSrc
            }
        );
    }

    const handleFormSubmit = e => {
        e.preventDefault();
        console.log("85");
        if (validate()) {
            const formData = new FormData();
            formData.append("produtoId", values.produtoId);
            formData.append("description", values.description);
            formData.append("imageName", values.imageName);
            formData.append("imageFile", values.imageFile);

            addOrEdit(formData, resetForm);


            console.log("ok 97")
        }
        else {
            console.log("n ok")
        }
    }

    const handleInputChange = e => {
        // const [name, value] = e.target;
        setValues(
            {
                ...values,
                [e.target.name]: e.target.value
            }

        );
        // console.log(values);

    }

    React.useEffect(() => {
        if (recordForEdit != null) {
            setValues(recordForEdit)
        }

    }, [recordForEdit]);


    //  const applyErrorClass = (field) => ( (field in errors && errors[field] == false) ? " invalid-field" : "");
    const applyErrorClass = (field) => { return (field in errors && errors[field] == false) ? " invalid-field" : "" };
    // (field in errors ) retorna true se todos se a propriedade com o nome field existir no objeto errors

    const estiloFoto = {
        width: "200px",
        height: "200px"
    }

    return (

        <>
            <p> Nova foto do Produto</p>
            <form onSubmit={handleFormSubmit}>
                <div className="card">
                    <img src={values.imageSrc} style={ estiloFoto} onChange={showPreview} id="image-uploader" />

                    <div className="card-body">
                        <input type="file"
                            accept="image/*"
                            onChange={showPreview}
                            className={"form-control-file" + applyErrorClass("imageSrc")}

                        />
                        <button onClick={resetImage} >Limpar Imagem</button>
                    </div>
                    <div className="card-body">
                        <input type="text" name="description"
                            value={values.description}
                            onChange={handleInputChange}
                            placeholder="descriçao"
                            className={"form-control" + applyErrorClass("description")}
                        />
                    </div>
                    <div className="card-body">
                        <button type="submit">Submit</button>
                    </div>
                </div>
            </form>


        </>
    );
}