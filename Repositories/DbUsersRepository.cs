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

        public IList<UserDb> GetAll() => _databaseContext.Users.ToList();

        public UserDb? TryGetByLogin(string login)
        {
            return _databaseContext.Users.FirstOrDefault(user => user.Login == login);
        }

        public UserDb? TryGetById(Guid id)
        {
            return _databaseContext.Users.FirstOrDefault(user => user.Id == id);
        }

        public UserDb Add(string login, string password, string name, string date)
        {
            var newUser = new UserDb(login, password, name, date);
            _databaseContext.Users.Add(newUser);
            _databaseContext.SaveChanges();
            return newUser;
        }

        public void UpdateSortingValue(UserDb userDb, string list, string sortingValue)
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
            _databaseContext.SaveChanges();
        }

        public void UpdateGeoposition(UserDb userDb, string geoPosition)
        {
            userDb.Geolocation = geoPosition;
            _databaseContext.SaveChanges();
        }

        public void UpdateGameList(UserDb userDb, string gameKey, bool wrong)
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
                    DbService.UpdateFeedbackUserInfo(userDb, "GamesListString", userDb.TotalGameAttempts.ToString(), _feedbacksRepository);
                    ///
                }
            }
            _databaseContext.SaveChanges();
        }

        public void UpdateInfo(UserDb userDb, string firstName, string surName)
        {
            userDb.FirstName = firstName;
            userDb.SurName = surName;
            var userNewName = userDb.SurName == "-" ? userDb.FirstName : userDb.FirstName + " " + userDb.SurName[0] + ".";
            DbService.UpdateFeedbackUserInfo(userDb, "UserName", userNewName, _feedbacksRepository);
            _databaseContext.SaveChanges();
        }

        public void UpdatePassword(UserDb userDb, string newPassword)
        {
            userDb.Password = newPassword;
            _databaseContext.SaveChanges();
        }

        public void SaveImage(UserDb userDb, IFormFile image, IWebHostEnvironment appEnvironment)
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
                        DbService.UpdateFeedbackUserInfo(userDb, "SaveImage", userDb.AvatarPath, _feedbacksRepository);
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
                DbService.UpdateFeedbackUserInfo(userDb, "SaveImage", "img/Avatar.png", _feedbacksRepository);
            }
            _databaseContext.SaveChanges();
        }

        public void Delete(UserDb userDb, IWebHostEnvironment appEnvironment)
        {
            DbService.UpdateFeedbackUserInfo(userDb, "SaveImage", "img/Avatar.png", _feedbacksRepository);
            _databaseContext.Remove(userDb);
            _databaseContext.SaveChanges();
            var userImagesFolder = Path.Combine(appEnvironment.WebRootPath + $"/img/users/{userDb.Id}");
            if (Directory.Exists(userImagesFolder))
            {
                Directory.Delete(userImagesFolder, true);
            }
        }
    }
}
