using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VitrineProdutos.Models
{
    public class Categoria
    {
        public Categoria()
        {
            ProdutoCategorias = new HashSet<ProdutoCategoria>();
        }

        [Key]
        public int CategoriaId { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        [Required]
        public string CategoriaNome{ get; set; }

        public virtual ICollection<ProdutoCategoria> ProdutoCategorias { get; set; }


        [NotMapped]
         public bool Checked { get; set; }
    }
}
