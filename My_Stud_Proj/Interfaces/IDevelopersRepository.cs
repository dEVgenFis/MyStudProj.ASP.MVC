using My_Stud_Proj.Models;

namespace My_Stud_Proj.Interfaces
{
    public interface IDevelopersRepository
    {
        Task<IList<DeveloperDb>> GetAllAsync();
        Task<DeveloperDb?> TryGetByIdAsync(Guid id);
    }
}