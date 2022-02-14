using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using VitrineProdutos.Models;

#nullable disable

namespace VitrineProdutos.Models
{
    public partial class VitrineProdutoDBContext: DbContext
    {
        public VitrineProdutoDBContext()
        {
        }

        public VitrineProdutoDBContext(DbContextOptions<VitrineProdutoDBContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Produto> Produtos { get; set; }
        public virtual DbSet<Foto> Fotos { get; set; }
        public DbSet<Categoria> Categorias { get; set; }
        public DbSet<ProdutoCategoria> ProdutoCategorias { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Cpnfigurações necessárias no muitos-para-muitos (criado manuelmente )
            modelBuilder.Entity<ProdutoCategoria>()
                .HasKey(pc => new { pc.ProdutoId, pc.CategoriaId });

            modelBuilder.Entity<ProdutoCategoria>()
                .HasOne(p => p.Produto)
                .WithMany(pc => pc.ProdutoCategorias)
                .HasForeignKey(p=> p.ProdutoId);

            modelBuilder.Entity<ProdutoCategoria>()
                .HasOne(c => c.Categoria)
                .WithMany(pc => pc.ProdutoCategorias)
                .HasForeignKey(c => c.CategoriaId);
        }

    }
}
