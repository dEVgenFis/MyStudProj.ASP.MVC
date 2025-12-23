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

            builder.Services.AddSingleton<IDevelopersRepository, RamDevelopersRepository>();
            builder.Services.AddSingleton<IFeedbacksRepository, RamFeedbacksRepository>();
            builder.Services.AddSingleton<IUsersRepository, RamUsersRepository>();

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
