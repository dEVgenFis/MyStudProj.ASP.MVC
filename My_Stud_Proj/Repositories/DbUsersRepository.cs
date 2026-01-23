using Microsoft.EntityFrameworkCore;
using My_Stud_Proj.Helpers;
using My_Stud_Proj.Interfaces;
using My_Stud_Proj.Models;

namespace My_Stud_Proj.Repositories
{
    public class DbUsersRepository : IUsersRepository
    {
        private readonly DatabaseContext _databaseContext;

        private readonly IFeedbacksRepository _feedbacksRepository;

        public DbUsersRepository(DatabaseContext databaseContext, IFeedbacksRepository feedbacksRepository)
        {
            _databaseContext = databaseContext;
            _feedbacksRepository = feedbacksRepository;
        }

        public async Task<IList<UserDb>> GetAllAsync() => await _databaseContext.Users.ToListAsync();

        public async Task<UserDb?> TryGetByLoginAsync(string login)
        {
            return await _databaseContext.Users.FirstOrDefaultAsync(user => user.Login == login);
        }

        public async Task<UserDb?> TryGetByIdAsync(Guid id)
        {
            return await _databaseContext.Users.FirstOrDefaultAsync(user => user.Id == id);
        }

        public async Task<UserDb> AddAsync(string login, string password, string name, string date)
        {
            var newUser = new UserDb(login, password, name, date);
            _databaseContext.Users.Add(newUser);
            await _databaseContext.SaveChangesAsync();
            return newUser;
        }

        public async Task UpdateSortingValueAsync(UserDb userDb, string list, string sortingValue)
        {
            switch (list)
            {
                case "developersList":
                    userDb.SortingDevListValue = sortingValue;
                    break;
                case "feedbacksList":
                    userDb.SortingFdbackListValue = sortingValue;
                    break;
            }
            await _databaseContext.SaveChangesAsync();
        }

        public async Task UpdateGeopositionAsync(UserDb userDb, string geoPosition)
        {
            userDb.Geolocation = geoPosition;
            await _databaseContext.SaveChangesAsync();
        }

        public async Task UpdateGameListAsync(UserDb userDb, string gameKey, bool wrong)
        {
            // останавливаем выполнение функции в случае, когда Пользователь авторизован одновременно с нескольких устройств
            if (string.IsNullOrEmpty(userDb.GamesListString))
            {
                return;
            }
            ///
            if (wrong)
            {
                userDb.TotalGameAttempts++;
            }
            else
            {
                userDb.GamesListString = userDb.GamesListString.Replace(gameKey, "").Replace(",,", ",").Trim(',');
                if (userDb.GamesListString.Length == 0)
                {
                    userDb.GameWinner = true;
                    userDb.TotalGameAttempts++;
                    // обновляем данные Пользователя в таблице отзывов
                    await DbService.UpdateFeedbackUserInfoAsync(userDb, "GamesListString", userDb.TotalGameAttempts.ToString(), _feedbacksRepository);
                    ///
                }
            }
            await _databaseContext.SaveChangesAsync();
        }

        public async Task UpdateInfoAsync(UserDb userDb, string firstName, string surName)
        {
            userDb.FirstName = firstName;
            userDb.SurName = surName;
            var userNewName = userDb.SurName == "-" ? userDb.FirstName : userDb.FirstName + " " + userDb.SurName[0] + ".";
            await DbService.UpdateFeedbackUserInfoAsync(userDb, "UserName", userNewName, _feedbacksRepository);
            await _databaseContext.SaveChangesAsync();
        }

        public async Task UpdatePasswordAsync(UserDb userDb, string newPassword)
        {
            userDb.Password = newPassword;
            await _databaseContext.SaveChangesAsync();
        }

        public async Task SaveImageAsync(UserDb userDb, IFormFile image, IWebHostEnvironment appEnvironment)
        {
            if (image is not null)
            {
                string imagePath = Path.Combine(appEnvironment.WebRootPath + $"/img/users/{userDb.Id}/{image.Name + (image.Name == "avatar" ? string.Empty : "es")}/");
                if (!Directory.Exists(imagePath))
                {
                    Directory.CreateDirectory(imagePath);
                }
                switch (image.Name)
                {
                    case "avatar":
                        if (Directory.GetFiles(imagePath).Length > 0)
                        {
                            File.Delete(Directory.GetFiles(imagePath)[0]);
                        }
                        using (var fileStream = new FileStream(imagePath + image.FileName, FileMode.Create))
                        {
                            image.CopyTo(fileStream);
                        }
                        userDb.AvatarPath = $"/img/users/{userDb.Id}/avatar/" + image.FileName;
                        await DbService.UpdateFeedbackUserInfoAsync(userDb, "SaveImage", userDb.AvatarPath, _feedbacksRepository);
                        break;
                    case "canvas":
                        var canvasFolderFullness = Directory.GetFiles(imagePath).Length;
                        using (var fileStream = new FileStream(imagePath + image.FileName.Split('.')[0] + $"_{++canvasFolderFullness}." + image.FileName.Split('.')[1], FileMode.Create))
                        {
                            image.CopyTo(fileStream);
                        }
                        break;
                }
            }
            else
            {
                var userImagesFolder = Path.Combine(appEnvironment.WebRootPath + $"/img/users/{userDb.Id}/avatar");
                if (Directory.Exists(userImagesFolder))
                {
                    Directory.Delete(userImagesFolder, true);
                }
                userDb.AvatarPath = "img/Avatar.png";
                await DbService.UpdateFeedbackUserInfoAsync(userDb, "SaveImage", "img/Avatar.png", _feedbacksRepository);
            }
            await _databaseContext.SaveChangesAsync();
        }

        public async Task DeleteAsync(UserDb userDb, IWebHostEnvironment appEnvironment)
        {
            await DbService.UpdateFeedbackUserInfoAsync(userDb, "SaveImage", "img/Avatar.png", _feedbacksRepository);
            _databaseContext.Remove(userDb);
            await _databaseContext.SaveChangesAsync();
            var userImagesFolder = Path.Combine(appEnvironment.WebRootPath + $"/img/users/{userDb.Id}");
            if (Directory.Exists(userImagesFolder))
            {
                Directory.Delete(userImagesFolder, true);
            }
        }
    }
}
