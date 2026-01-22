using Microsoft.EntityFrameworkCore;
using My_Stud_Proj.Helpers;
using My_Stud_Proj.Interfaces;
using My_Stud_Proj.Repositories;
using OpenTelemetry.Metrics;

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
            builder.Services.AddSingleton<MetricsService>();

            // создаем точку входа для OTel-инструментария
            builder.Services.AddOpenTelemetry()
                // настраиваем MeterProvider ("диспетчер системы метрик")
                .WithMetrics(metrics =>
                {
                    metrics
                        // активируем автоматический сбор "ASP.NET Core"-метрик (данных о входящих HTTP-запросах)
                        .AddAspNetCoreInstrumentation()
                        // регистрируем собственную метрику
                        .AddMeter("MonitoringMetrics")
                        // конвертируем собранные метрики в формат для Prometheus
                        .AddPrometheusExporter();
                });

            var app = builder.Build();

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseRouting();

            app.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}"
            );

            // добавляем эндпоинт ("/metrics") для "визита" Prometheus
            app.UseOpenTelemetryPrometheusScrapingEndpoint();

            app.Run();
        }
    }
}
