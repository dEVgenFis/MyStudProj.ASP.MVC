using My_Stud_Proj.Models;

namespace My_Stud_Proj.Interfaces
{
    public interface IDevelopersRepository
    {
        IList<DeveloperDb> GetAll();
        DeveloperDb? TryGetById(Guid id);
    }
}