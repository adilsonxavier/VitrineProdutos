using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace VitrineProdutos.Models
{
    public class ProdutoCategoria
    {
        //Chave estrangeira para Produto
        public int ProdutoId { get; set; }
        public Produto Produto { get; set; }

        //Chave estrangeira para Categoria
        public int CategoriaId { get; set; }
        public Categoria Categoria { get; set; }

        [NotMapped]
        public string CategoriaNome { get; set; }
    }
}
