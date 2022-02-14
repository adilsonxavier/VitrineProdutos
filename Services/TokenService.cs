using APIComJwtBalta.Models;
using System;
using System.Collections.Generic;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Security.Claims;

namespace VitrineProdutos.Services
{
    //Aqui a classe é estática porque é um demo
    // Numa situação real use não estática e injeção de dependência
    public static  class TokenService
    {
        
        public static string GenetateToken(User user)
        {
            
            var tokenHandler = new JwtSecurityTokenHandler(); // Vem de System.IdentityModel.Tokens.Jwt;
            var key = Encoding.ASCII.GetBytes(Settings.Secret); // Retorna array de bytes
            var tokenDescriptor = new SecurityTokenDescriptor() // vem de Microsoft.IdentityModel.Tokens;
            {
                Subject = new ClaimsIdentity(new [] {       // Vem de  System.Security.Claims;
                    new Claim(ClaimTypes.Name, user.Name), //User.Identity.Name
                    new Claim(ClaimTypes.Role, user.Role) // User.IsInRole()
                   // new Claim("meutipoclain","meuconteudo") // Só pra mostrar que além de escolher as constantes string da clesse
                                                            // ClaimTypes, também posso informar uma personalizada
                }), 
                Expires = DateTime.UtcNow.AddHours(2), // O Balta costuma usar 8 horas antes do refresh
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature // Sha256 é uma encriptação muito dificil de ser quebrada
                    )
            };

            // return tokenHandler.WriteToken(tokenHandler.CreateToken(tokenDescriptor));
            var token = tokenHandler.CreateToken(tokenDescriptor);
            string tokenretorno = tokenHandler.WriteToken(token);
            return tokenretorno;
        }
    }
}
