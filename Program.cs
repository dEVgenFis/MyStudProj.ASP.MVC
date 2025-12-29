using Microsoft.EntityFrameworkCore;
using My_Stud_Proj.Interfaces;
using My_Stud_Proj.Repositories;

namespace My_Stud_Proj
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllersWithViews();

            var connectionString = builder.Configuration.GetConnectionString("MySQLConnection");
            var serverVersion = ServerVersion.AutoDetect(connectionString);
            builder.Services.AddDbContext<DatabaseContext>(options => options.UseMySql(connectionString, serverVersion));

            builder.Services.AddScoped<IDevelopersRepository, DbDevelopersRepository>();
            builder.Services.AddScoped<IFeedbacksRepository, DbFeedbacksRepository>();
            builder.Services.AddScoped<IUsersRepository, DbUsersRepository>();

            var app = builder.Build();

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseRouting();

            app.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}");

            app.Run();
        }
    }
}
