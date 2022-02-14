using Microsoft.AspNetCore.Authentication.JwtBearer;
using VitrineProdutos.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace VitrineProdutos
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            ////////////////////
            services.AddDbContext<VitrineProdutoDBContext>(options =>
                    options.UseSqlServer(Configuration.GetConnectionString("ProdConnection"))
            );
            //////////////////////

            services.AddControllersWithViews();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "VitrineProdutos", Version = "v1" });
            });

            services.AddCors();  // instalar antes Microsof.AspNetCore.Cors

            /////////////Autenticação JWT:

            var key = Encoding.ASCII.GetBytes(Settings.Secret);

            services.AddAuthentication(x => // O parâmetro é um Action, por isso a sintaxe diferente
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme; // este JwtBearerDefaults.AuthenticationScheme nada mais é que uma constante
                                                                                      // string com o valor "Bearer" (portador)
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;   // tem a ver com OAuth não usado aqui
            })
    .AddJwtBearer(x => {
        x.RequireHttpsMetadata = false;
        x.SaveToken = true;
        x.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = false,    // tem a ver com OAuth e o DefaultChallengeScheme acima  não usado aqui
                        ValidateAudience = false   // tem a ver com OAuth e o DefaultChallengeScheme acima  não usado aqui
                    };

    });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseCors(options => options.WithOrigins("http://localhost:3057","http://adilsonxdesouza.somee.com")
                .AllowAnyMethod()
                .AllowAnyHeader()
            );
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "VitrineProdutos v1"));
            }

            //Permitir ler os arquivos da pasta images
            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(Path.Combine(env.WebRootPath, "images")),
                RequestPath = "/images"
            }); ; ;

            app.UseRouting();

            app.UseAuthentication(); // Sempre nesta ordem
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
