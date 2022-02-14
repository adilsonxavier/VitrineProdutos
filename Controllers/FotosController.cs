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
    public class FotosController : ControllerBase
    {
        private readonly VitrineProdutoDBContext _context;
        private readonly IWebHostEnvironment _hostEnvironment;
        public FotosController(VitrineProdutoDBContext context, IWebHostEnvironment hostEnvironment)
        {
            _context = context;
            _hostEnvironment = hostEnvironment;
        }

        // GET: api/Fotos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Foto>>> GetFotos()
        {
            return await _context.Fotos.ToListAsync();
        }

        //[Route("[action]", Name = "GetFotosProduto")]
        [Route("[action]/{id}")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Foto>>> GetFotosProduto(int id)
        {
            return await _context.Fotos.Where(x => x.ProdutoId == id).OrderBy(x => x.Position)
                .Select(x => new Foto()
                {
                    FotoId = x.FotoId,
                    ProdutoId = x.ProdutoId,
                    Description = x.Description,
                    ImageName = x.ImageName,
                    //O Request.PathBase retorna "". Ele e usado para quando é configurado um nome adicional no Startup.Configure
                    //Adding app.usePathBase("/mysite1") one needs to call /mysite1/api/items instead of /api/items
                    ImageSrc = String.Format("{0}://{1}{2}/images/{3}", Request.Scheme, Request.Host, Request.PathBase, x.ImageName)
                })
                .ToListAsync();
        }

        // GET: api/Fotos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Foto>> GetFoto(int id)
        {
            var foto = await _context.Fotos.FindAsync(id);

            if (foto == null)
            {
                return NotFound();
            }

            return foto;
        }

        // PUT: api/Fotos/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFoto(int id, Foto foto)
        {
            if (id != foto.FotoId)
            {
                return BadRequest();
            }

            _context.Entry(foto).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FotoExists(id))
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

        // POST: api/Fotos
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Foto>> PostFoto([FromForm] Foto foto)
        {
            // var a = foto;
            foto.ImageName = await SaveImage(foto.ImageFile);
            foto.Position = nextFoto(foto.ProdutoId);
            _context.Fotos.Add(foto);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetFoto", new { id = foto.FotoId }, foto);
            //return NoContent();
        }

        // DELETE: api/Fotos/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteFoto(int id)
        {
            var foto = await _context.Fotos.FindAsync(id);
            if (foto == null)
            {
                return NotFound();
            }

            _context.Fotos.Remove(foto);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool FotoExists(int id)
        {
            return _context.Fotos.Any(e => e.FotoId == id);
        }

        private int nextFoto(int employeeId)
        {
            int nextFoto = 1;
            var ultimaFoto = _context.Fotos.Where(x => x.ProdutoId == employeeId).OrderByDescending(x => x.Position).FirstOrDefault();
            if (ultimaFoto != null)
            {
                nextFoto = ultimaFoto.Position == 0 ? 1 : ultimaFoto.Position + 1;
            }

            return nextFoto;

        }
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
