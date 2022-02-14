import React from "react";
import styles from "./Pagination.module.css";

export default function Pagination({ pageSize, totalItens, skip, setSkip, currentPage2, setCurrentPage2, setShowLoading }) {

    const MAX_ITENS = 9; // quantidade de quadradinhos de paginas mostrados por vez


    const MAX_LEFT = (MAX_ITENS - 1) / 2;
    // Quantidade de quadradinhos a esquerda do quadradinho central

    const currentPage = skip ? (skip / pageSize) + 1 : 1;
    // ex: skip = 20 (pulou 2 primeiras páginas ee 10)
    // pageSize = 10
    // (20 / 10) = 2 , 2+1 = 3 => página atual é a  3
    // se o skip for zero é pq estou pagina 1

    const qtdPages = Math.ceil(totalItens / pageSize);
    // o Math.ceil arredonda pra cima pra quando o resultado for um número quebrado o qtdPages fica 1 a mais

    const firstPageShown = Math.max(currentPage - MAX_LEFT, 1)
    // Ex  MAX_LEFT = 4 (quadradinhos a esquerda)
    // current_page = 45 
    // 45 -4 = 41 ( primeira página a mostrar)
    // O  Math.max faz com que o valor mínimo seja 1 pois o resultado poderia ser negativo ( ex 3 - 4 = -1)



    return (


        <ul className={styles.pagination_container}>
            <li>
                <button onClick={() => setCurrentPage2(currentPage2 - 1)}
                    disabled={currentPage2 === 1}
                    style={currentPage2 === 1 ? { cursor: "default" } : {}}
                >Anterior</button>
            </li>
            {
                
                Array.from({ length: Math.min(MAX_ITENS, qtdPages) })
                    .map((_, index) => index + firstPageShown)
                    /* o Array.from cria um array com qtd de intens definida no lengh mas estes itens são undefinid*/
                    /* Como eu preciso usar no map pra criar a lista , eu uso só o index do map e o primeiro parâmeto eu uso
                        uma variável inexistente só pra obedecer os parâmetros do map() (usei a var _ mas poderia ser qualquer nome )
                      */
                    .map((pageNumber) => <li key={pageNumber }>                        <button                            onClick={() => { setCurrentPage2(pageNumber); setShowLoading(true) }}                            className={pageNumber === currentPage2 ? styles.pagination_container__item__active : ""}                        >{pageNumber} </button>                    </li>)                  /* poderia ser um map só . Foi 2 só pra melhor a le*/
                    //.filter((x) => x!= undefined)

                   
            }
            <li>
                <button onClick={() => setCurrentPage2(currentPage2 + 1)}
                    disabled={currentPage2 === qtdPages}
                    style={currentPage2 === qtdPages ? { cursor: "default" } : {}}
                >Próximo</button>
            </li>


        </ul>
        );
    /*onClick={()=> setSkip((pageNumber -1) * pageSize )}*/
/*    onClick = {() => setCurrentPage2(pageNumber)*/

}