using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace APIComJwtBalta.Models
{
    public class User
    {
        [NotMapped]
        public int Id { get; set; }

        [NotMapped]
        public string Name { get; set; }

        [NotMapped]
        public string Password { get; set; }

        [NotMapped]
        public string Role { get; set; }

    }
}
