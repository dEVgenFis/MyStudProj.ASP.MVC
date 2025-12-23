using My_Stud_Proj.Models;

namespace My_Stud_Proj.Interfaces
{
    public interface IUsersRepository
    {
        List<User> Users { get; }
        void Add(User user);
        void Delete(User user);
        void SaveImage(User user, IFormFile image, IWebHostEnvironment appEnvironment);
        User? TryGetById(Guid id);
        User? TryGetByLogin(string login);
    }
}