using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using My_Stud_Proj.Helpers;
using My_Stud_Proj.Interfaces;
using My_Stud_Proj.Repositories;
using OpenTelemetry.Metrics;
using Serilog;

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
                        // регистрируем собственную метрику
                        .AddMeter("MonitoringMetrics")
                        // конвертируем собранные метрики в формат для Prometheus
                        .AddPrometheusExporter();
                });

            // заменяем встроенную систему логирования на Serilog
            /*
             * "context" - объект-"снимок" (экземпляр класса "HostBuilderContext") состояния приложения в момент сборки
             * "configuration" - объект настроек Serilog
             * "ReadFrom.Configuration(context.Configuration)" - настраиваем Serilog файлом "appsettings.json"
             */
            builder.Host.UseSerilog((context, configuration) => configuration.ReadFrom.Configuration(context.Configuration));

            var app = builder.Build();

            // "читаем" заголовки для компонента ForwardedHeadersMiddleware
            app.UseForwardedHeaders(new ForwardedHeadersOptions
            {
                // "разрешаем" Kestrel принять от Nginx реальные IP клиента (XForwardedFor), протокол запроса (XForwardedProto) и адрес запроса (XForwardedHost)
                ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto | ForwardedHeaders.XForwardedHost
                /*
                 * HttpContext.Connection.RemoteIpAddress = XForwardedFor
                 * HttpContext.Request.Scheme = XForwardedProto
                 * HttpContext.Request.Host = XForwardedHost
                 */
            });

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
