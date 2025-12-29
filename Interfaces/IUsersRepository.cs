using My_Stud_Proj.Models;

namespace My_Stud_Proj.Interfaces
{
    public interface IUsersRepository
    {
        IList<UserDb> GetAll();
        UserDb? TryGetByLogin(string login);
        UserDb? TryGetById(Guid id);
        UserDb Add(string login, string password, string name, string date);
        void UpdateSortingValue(UserDb userDb, string list, string sortingValue);
        void UpdateGeoposition(UserDb userDb, string geoPosition);
        void UpdateGameList(UserDb userDb, string gameKey, bool wrong);
        void UpdateInfo(UserDb userDb, string firstName, string surName);
        void UpdatePassword(UserDb userDb, string newPassword);
        void SaveImage(UserDb userDb, IFormFile image, IWebHostEnvironment appEnvironment);
        void Delete(UserDb userDb, IWebHostEnvironment appEnvironment);
    }
}