using Microsoft.EntityFrameworkCore.Migrations;

namespace VitrineProdutos.Migrations
{
    public partial class increaseprodutodesc : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "ProdutoDescricao",
                table: "Produtos",
                type: "nvarchar(1000)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(200)",
                oldNullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "ProdutoDescricao",
                table: "Produtos",
                type: "nvarchar(200)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(1000)",
                oldNullable: true);
        }
    }
}
