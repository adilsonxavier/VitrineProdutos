using APIComJwtBalta.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VitrineProdutos.Repositories
{
    public static class UserRepository
    {
        public static User Get(string userName, string password)
        {
            var users = new List<User>();

            users.Add(new User() { Id = 1, Name = "adilson", Password = "123456", Role = "management" }); ;
            users.Add(new User() { Id = 2, Name = "maysa", Password = "123456", Role = "employee" }); ;

            return users.Where(x => x.Name.ToLower() == userName.ToLower() && x.Password.ToLower() == password.ToLower())
                .FirstOrDefault();



        }

        public static User GetUser(string userName)
        {
            var users = new List<User>();

            users.Add(new User() { Id = 1, Name = "adilson", Password = "123456", Role = "management" }); ;
            users.Add(new User() { Id = 2, Name = "maysa", Password = "123456", Role = "employee" }); ;

            return users.Where(x => x.Name.ToLower() == userName.ToLower())
                .FirstOrDefault();

        }
    }
}
