using Microsoft.EntityFrameworkCore;
using My_Stud_Proj.Models;

namespace My_Stud_Proj
{
    public class DatabaseContext : DbContext
    {
        public DbSet<DeveloperDb> Developers { get; set; }
        public DbSet<UserDb> Users { get; set; }
        public DbSet<FeedbacksDbList> FeedbacksList { get; set; }

        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
        {
            // для запуска проекта на VPS необходимо отключить миграции
            // Database.Migrate();
        }
    }
}
