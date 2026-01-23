using My_Stud_Proj.Models;

namespace My_Stud_Proj.Interfaces
{
    public interface IUsersRepository
    {
        Task<IList<UserDb>> GetAllAsync();
        Task<UserDb?> TryGetByLoginAsync(string login);
        Task<UserDb?> TryGetByIdAsync(Guid id);
        Task<UserDb> AddAsync(string login, string password, string name, string date);
        Task UpdateSortingValueAsync(UserDb userDb, string list, string sortingValue);
        Task UpdateGeopositionAsync(UserDb userDb, string geoPosition);
        Task UpdateGameListAsync(UserDb userDb, string gameKey, bool wrong);
        Task UpdateInfoAsync(UserDb userDb, string firstName, string surName);
        Task UpdatePasswordAsync(UserDb userDb, string newPassword);
        Task SaveImageAsync(UserDb userDb, IFormFile image, IWebHostEnvironment appEnvironment);
        Task DeleteAsync(UserDb userDb, IWebHostEnvironment appEnvironment);
    }
}