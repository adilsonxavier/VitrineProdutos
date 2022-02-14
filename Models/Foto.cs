using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Http;

namespace VitrineProdutos.Models
{
    public class Foto
    {
        [Key]
        public int FotoId { get; set; }

        [Column(TypeName = "nvarchar(100)")]
        public string Description { get; set; }

        [Column(TypeName = "int")]

        public int Position { get; set; }

        [Column(TypeName = "nvarchar(100)")]
        public string ImageName { get; set; }

        [NotMapped]  // Indica que o campo não tem correspondente no BD
        public IFormFile ImageFile { get; set; }
        [NotMapped]
        public string ImageSrc { get; set; }



        //Chave estrangeira para Employee
        public int ProdutoId { get; set; }
        public Produto Produto { get; set; }

        ///==> Importante : Os dados vem do React em camel case e são convertidos automaticamente para Pascal Case pelo .net core
        /// Ex. vem imageSrc do React e é convertido para ImageSrc

    }
}
