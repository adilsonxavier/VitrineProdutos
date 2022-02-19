using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VitrineProdutos.Models;

namespace VitrineProdutos.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriasController : ControllerBase
    {
        private readonly VitrineProdutoDBContext _context;

        public CategoriasController(VitrineProdutoDBContext context)
        {
            _context = context;
        }

        // GET: api/Categorias
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Categoria>>> GetCategorias()
        {
            return await _context.Categorias.ToListAsync();
        }

        // GET: api/Categorias/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Categoria>> GetCategoria(int id)
        {
            var categoria = await _context.Categorias.FindAsync(id);

            if (categoria == null)
            {
                return NotFound();
            }

            return categoria;
        }

        // PUT: api/Categorias/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCategoria(int id, Categoria categoria)
        {
            if (id != categoria.CategoriaId)
            {
                return BadRequest();
            }

            _context.Entry(categoria).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CategoriaExists(id))
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

        [HttpPut("[action]/{id}")]
        [Authorize]
        public async Task<IActionResult> PutCategoriasProduto(int id, [FromBody] IEnumerable<Categoria> categorias)
        {
            //Deletar antigos
            var categoriasAntigas = _context.ProdutoCategorias.Where(x => x.ProdutoId == id).ToList();
            if (categoriasAntigas != null)
            {
                _context.ProdutoCategorias.RemoveRange(categoriasAntigas);

            }

            List<ProdutoCategoria> categoriasNovas = categorias.Where(x => x.Checked == true).Select(x => new ProdutoCategoria()
            {
                ProdutoId = id,
                CategoriaId = x.CategoriaId
            }).ToList();

            _context.ProdutoCategorias.AddRange(categoriasNovas);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/Categorias
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Categoria>> PostCategoria(Categoria categoria)
        {
            _context.Categorias.Add(categoria);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCategoria", new { id = categoria.CategoriaId }, categoria);
        }

        // DELETE: api/Categorias/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategoria(int id)
        {
            var categoria = await _context.Categorias.FindAsync(id);
            if (categoria == null)
            {
                return NotFound();
            }

            _context.Categorias.Remove(categoria);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [Route("[action]/{id}")]
        //[Authorize]
        public async Task<ActionResult<IEnumerable<Categoria>>> GetCategoriasProduto(int id)
        {
            /* return await _context.CategoriaProdutos
                .Where(x=> x.ProdutoId == id)
                .Select(x =>new CategoriaProduto {
                     CategoriaId = x.CategoriaId,
                     ProdutoId = x.ProdutoId,
                     CategoriaName = _context.Categorias.FirstOrDefault(s => s.CategoriaId == x.CategoriaId).CategoriaName
                     //CategoriaName = (from s in _context.Categorias where s.CategoriaId == x.CategoriaId select s.CategoriaName).FirstOrDefault()

                  })
                 .ToListAsync();
            */

            return await _context.Categorias
                .Select(x => new Categoria
                {
                    CategoriaId = x.CategoriaId,
                    CategoriaNome = x.CategoriaNome,
                    // Checked = _context.CategoriaProdutos.FirstOrDefault(se => se.ProdutoId == id && se.CategoriaId == x.CategoriaId)!= null ? true : false
                    Checked = (from se in _context.ProdutoCategorias where se.ProdutoId == id && se.CategoriaId == x.CategoriaId select se).Any() //? true : false
                })

                .ToListAsync();
        }

        private bool CategoriaExists(int id)
        {
            return _context.Categorias.Any(e => e.CategoriaId == id);
        }
    }
}
