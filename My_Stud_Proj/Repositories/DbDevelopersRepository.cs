using Microsoft.EntityFrameworkCore;
using My_Stud_Proj.Interfaces;
using My_Stud_Proj.Models;

namespace My_Stud_Proj.Repositories
{
    public class DbDevelopersRepository : IDevelopersRepository
    {
        private readonly DatabaseContext _databaseContext;

        public DbDevelopersRepository(DatabaseContext databaseContext)
        {
            _databaseContext = databaseContext;
        }

        public async Task<IList<DeveloperDb>> GetAllAsync() => await _databaseContext.Developers.ToListAsync();

        public async Task<DeveloperDb?> TryGetByIdAsync(Guid id)
        {
            return await _databaseContext.Developers.FirstOrDefaultAsync(developer => developer.Id == id);
        }
    }
}
