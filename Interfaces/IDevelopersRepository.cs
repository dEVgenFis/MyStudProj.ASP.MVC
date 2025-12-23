using My_Stud_Proj.Models;

namespace My_Stud_Proj.Interfaces
{
    public interface IDevelopersRepository
    {
        IList<Developer> GetAll();
        IList<Developer> Sorting(string sortingValue);
        Developer? TryGetById(Guid id);
    }
}