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

        public IList<DeveloperDb> GetAll() => _databaseContext.Developers.ToList();

        public DeveloperDb? TryGetById(Guid id)
        {
            return _databaseContext.Developers.FirstOrDefault(developer => developer.Id == id);
        }
    }
}
