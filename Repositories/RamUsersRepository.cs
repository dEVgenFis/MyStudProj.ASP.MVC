using My_Stud_Proj.Interfaces;
using My_Stud_Proj.Models;

namespace My_Stud_Proj.Repositories
{
    public class RamUsersRepository : IUsersRepository
    {
        private readonly List<User> _users =
        [
            new User(
                Guid.Parse("fa6b33e3-b04f-43b3-8f9e-f68299f92d25"),
                "frozen@mail.ru",
                "12",
                "Евгений",
                new Dictionary<string, string>()
                {
                    { "country", "Россия" },
                    { "city", "Кинель" }
                },
                "img/Full-stack_Ph-Full.png",
                true,
                1,
                [],
                "1759514749741"
            ),
            new User(
                "arnold@mail.com",
                "14",
                "User",
                "1559514749742"
            )
        ];

        public List<User> Users { get => _users; }

        public User? TryGetByLogin(string login)
        {
            return _users.FirstOrDefault(user => user.Login == login);
        }

        public User? TryGetById(Guid id)
        {
            return _users.FirstOrDefault(user => user.Id == id);
        }

        public void Add(User user)
        {
            _users.Insert(0, user);
        }

        public void SaveImage(User user, IFormFile image, IWebHostEnvironment appEnvironment)
        {
            if (image is not null)
            {
                string imagePath = Path.Combine(appEnvironment.WebRootPath + $"/img/users/{user.Id}/{image.Name + (image.Name == "avatar" ? "s" : "es")}/");
                if (!Directory.Exists(imagePath))
                {
                    Directory.CreateDirectory(imagePath);
                }
                switch (image.Name)
                {
                    case "avatar":
                        using (var fileStream = new FileStream(imagePath + image.FileName, FileMode.Create))
                        {
                            image.CopyTo(fileStream);
                        }
                        user.Image = $"/img/users/{user.Id}/avatars/" + image.FileName;
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
                user.Image = "img/Avatar.png";
            }
        }

        public void Delete(User user)
        {
            _users.Remove(user);
        }
    }
}
