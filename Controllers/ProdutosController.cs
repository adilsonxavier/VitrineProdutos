using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VitrineProdutos.Models;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Authorization;

namespace VitrineProdutos.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProdutosController : ControllerBase
    {
        private readonly VitrineProdutoDBContext _context;
        private readonly IWebHostEnvironment _hostEnvironment;

        public ProdutosController(VitrineProdutoDBContext context, IWebHostEnvironment hostEnvironment)
        {
            _context = context;
            this._hostEnvironment = hostEnvironment;
        }

        // GET: api/Produtos
        [HttpGet]
        //[Authorize]
        public async Task<ActionResult<IEnumerable<Produto>>> GetProdutos()
        {
            return await _context.Produtos
                .Select(x => new Produto()
                {
                    ProdutoId = x.ProdutoId,
                    ProdutoNome = x.ProdutoNome,
                    ProdutoValor = x.ProdutoValor,
                    ProdutoDescricao  = x.ProdutoDescricao,
                      //O Request.PathBase retorna "". Ele e usado para quando é configurado um nome adicional no Startup.Configure
                    //Adding app.usePathBase("/mysite1") one needs to call /mysite1/api/items instead of /api/items
                    ImageSrc = String.Format("{0}://{1}{2}/images/{3}", Request.Scheme, Request.Host, Request.PathBase,
                            (from c in _context.Fotos where c.ProdutoId == x.ProdutoId orderby c.Position select c.ImageName).FirstOrDefault()
                       )
                })
                .ToListAsync();
        }

    
        [Route("[action]/{currentPage}/{pageSiza}")]
        [Route("[action]/{currentPage}/{pageSiza}/{palavraChave}")]
        //[Authorize]
        //[Route("[action]")]
        public async Task<ActionResult<IEnumerable<Produto>>> GetProdutosPaginacao(int currentPage,int pageSiza, string palavraChave = "")
        {
            currentPage = currentPage < 1 ? 1 : currentPage;
            return await _context.Produtos
                .Where(x => x.ProdutoNome.Contains(palavraChave))
                .Select(x => new Produto()
                {
                    ProdutoId = x.ProdutoId,
                    ProdutoNome = x.ProdutoNome,
                    ProdutoValor = x.ProdutoValor,
                    ProdutoValorAntigo = x.ProdutoValorAntigo == null ? 0 : x.ProdutoValorAntigo,
                    ProdutoDescricao = x.ProdutoDescricao,
                    //O Request.PathBase retorna "". Ele e usado para quando é configurado um nome adicional no Startup.Configure
                    //Adding app.usePathBase("/mysite1") one needs to call /mysite1/api/items instead of /api/items
                    ImageSrc = String.Format("{0}://{1}{2}/images/{3}", Request.Scheme, Request.Host, Request.PathBase,
                            (from c in _context.Fotos where c.ProdutoId == x.ProdutoId orderby c.Position select c.ImageName).FirstOrDefault()
                       ),
                    QtdTotalItens = _context.Produtos.Where(x => x.ProdutoNome.Contains(palavraChave)).Count()

                }).Skip((currentPage - 1) * pageSiza).Take(pageSiza)
                .ToListAsync();
        }

        // GET: api/Produtos/5
        [HttpGet("{id}")]
        //[Authorize]
        public async Task<ActionResult<Produto>> GetProdutos(int id)
        {
            var produto = await _context.Produtos.FindAsync(id);

            if (produto == null)
            {
                return NotFound();
            }

            return produto;
        }


    
        [Route("[action]/{nome}")]
        public async Task<ActionResult<IEnumerable<Produto>>> GetProdutosByName(string nome)
        {
            return await _context.Produtos
                .Where(x => x.ProdutoNome.Contains(nome))
                 .Select(x => new Produto()
                 {
                     ProdutoId = x.ProdutoId,
                     ProdutoNome = x.ProdutoNome,
                     //O Request.PathBase retorna "". Ele e usado para quando é configurado um nome adicional no Startup.Configure
                     //Adding app.usePathBase("/mysite1") one needs to call /mysite1/api/items instead of /api/items
                     ImageSrc = String.Format("{0}://{1}{2}/images/{3}", Request.Scheme, Request.Host, Request.PathBase,
                             (from c in _context.Fotos where c.ProdutoId == x.ProdutoId orderby c.Position select c.ImageName).FirstOrDefault()
                        )
                 })
                 .ToListAsync();
        }

        // PUT: api/Produtos/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> PutProdutos(int id, [FromForm] Produto produto)
        {

            if (id != produto.ProdutoId)
            {
                return BadRequest();
            }

            //if (produto.ImageFile != null)
            //{
            //    DeleteImage(produto.ImageName);
            //    produto.ImageName = await SaveImage(produto.ImageFile);
            //}

            _context.Entry(produto).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                string erro = ex.Message;
                if (!ProdutosExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }


            return NoContent();
        }

        // POST: api/Produtos
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Produto>> PostProdutos([FromForm] Produto produto) // Com o fromform no postman tem que usar form-data
        {

            _context.Produtos.Add(produto);
            try
            {
                await _context.SaveChangesAsync();
            }catch(Exception ex)
            {
                string erro = ex.Message;
            }


            //return StatusCode(201);
            Response.StatusCode = StatusCodes.Status201Created;

            return new JsonResult(produto);

            // return CreatedAtAction("GetProdutos", new { id = produto.ProdutosId }, produto);

            // Obs : se por o nome errado do método "GetProdutos" da erro 500 de servidor no postman mas o objeto é alimentado
            // no banco mesmo assim
        }

        // DELETE: api/Produtos/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteProduto(int id)
        {
            var produto = await _context.Produtos.FindAsync(id);
            if (produto == null)
            {
                return NotFound();
            }
            
            //***********************************************************************************/
            //******* Fazer rotina para deletar todas as fotos do produto de uma vez ************/
            //***********************************************************************************/

           // DeleteImage(produto.ImageName); // Posso deletar direto sem checar se existe a imagem


            _context.Produtos.Remove(produto);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProdutosExists(int id)
        {
            return _context.Produtos.Any(e => e.ProdutoId == id);
        }

        [NonAction]
       
        // public string SaveImage(IFormFile imageFile, HttpContext httpContext)
        // Ao invéz de receber o parânetro httpContext , soi usado um objeto IWebHostEnvironment que foi injetado 
        // com injeção de dependência no construtor
        public async Task<string> SaveImage(IFormFile imageFile)
        {
            //Procedimento para deixar o nome da imagem sendo único:
            //Primeiro pega o nome da imagem, tira a extensão, pega os 10 primeiros catacteres e troca espaços por hifens
            string imageName = new String(Path.GetFileNameWithoutExtension(imageFile.FileName).Take(10).ToArray()).Replace(" ", "-");
            // Depois adiciona a data com milisegundos e adiciona a extensão ( veja que não preciso concatenar o ponto )
            imageName = imageName + DateTime.Now.ToString("yyyymmddssfff") + Path.GetExtension(imageFile.FileName);

            var imagePath = Path.Combine(_hostEnvironment.ContentRootPath, "images", imageName);

            using (var fileStream = new FileStream(imagePath, FileMode.Create))
            {
                await imageFile.CopyToAsync(fileStream);
            }
            return imageName;
        }

        public void DeleteImage(string imageName)
        {
            var imagePath = Path.Combine(_hostEnvironment.ContentRootPath, "images", imageName);
            if (System.IO.File.Exists(imagePath))
            {
                System.IO.File.Delete(imagePath);
            }
        }
    }
}
