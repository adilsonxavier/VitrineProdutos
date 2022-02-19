using APIComJwtBalta.Models;
using VitrineProdutos.Repositories;
using VitrineProdutos.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VitrineProdutos.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        [HttpPost]
        [Route("login")]
        [AllowAnonymous]
        //[HttpPut("{id}")]
        // public async Task<ActionResult<dynamic>> Authenticate([FromBody] User model) // o dynamic é por que o método pode retornar mais de um tipo diferente
        public async Task<ActionResult<dynamic>> Authenticate([FromBody]  User model) // o dynamic é por que o método pode retornar mais de um tipo diferente
        {
            // Recupera o usuário
             var user = UserRepository.Get(model.Name, model.Password);

            // Verifica se o usuário existe
            if (user == null)
                return new
                {
                    mensagem = "Usuário ou senha inválidos",
                    token =""
                };
           // return NotFound(new { message = "Usuário ou senha inválidos" });
              //  return BadRequest(,);

            // Gera o Token
            var token = TokenService.GenetateToken(user);

            // Oculta a senha - Não esquecer senão ela virá no token de resposta
             user.Password = "";

            // Retorna os dados
            return new
            {
                mensagem = "ok",
                token = token
            };
        }

        /// <summary>
        /// //
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("getuser/{userName}")]
        [Authorize]
        public ActionResult<dynamic> GetUser(string userName )
        {
            // Recupera o usuário
            var user = UserRepository.GetUser(userName);

            // Verifica se o usuário existe
            if (user == null)
                return NotFound(new { message = "Usuário ou senha inválidos" });
            //  return BadRequest(,);
            // Retorna os dados
            return user;

        }

        [HttpGet]
        [Route("anonymous")]
        [AllowAnonymous]
        public string Anonymous() => "Anônimo";

        [HttpGet]
        [Route("authenticated")]
        [Authorize]
        public string Authenticated() => String.Format("Autenticado - {0}", User.Identity.Name);
        // Aqui é mostrado o nome do usuário autenticado e é possivel gracas a linha new Claim(ClaimTypes.Name, user.Name)
        // quando foi criado o SecurityTokenDescriptor no método GenetateToken da classe TokenService
        // Pra acessar pelo postman:
        // Get , na aba Headers incluir a key  Authorization com valor Bearer token_gerado....
        // Se o token estiver errado ou vencido retorno o status 401 Unauthorized

        [HttpGet]
        [Route("employee")]
        [Authorize(Roles = "employee,manager")]
        public string Employee() => "Funcionário";

        [HttpGet]
        [Route("manager")]
        [Authorize(Roles = "manager")]
        public string Manager() => "Gerente";
        // Se o usuário autenticado não tiver o hoje Manager, o status retorna 403 - Forbidden
    }
}
