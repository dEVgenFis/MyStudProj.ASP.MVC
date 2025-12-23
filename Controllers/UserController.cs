using Microsoft.AspNetCore.Mvc;
using My_Stud_Proj.Interfaces;
using My_Stud_Proj.Models;
using System.Text.Json;

namespace My_Stud_Proj.Controllers
{
    public class UserController : Controller
    {
        private readonly IWebHostEnvironment _appEnvironment;

        private readonly IUsersRepository _usersRepository;

        public UserController(IWebHostEnvironment appEnvironment, IUsersRepository usersRepository)
        {
            this._appEnvironment = appEnvironment;
            this._usersRepository = usersRepository;
        }

        [HttpPost]
        public IActionResult Index(Guid id, string login)
        {
            var user = _usersRepository.TryGetById(id);
            if (user is null || user.Login != login)
            {
                return NotFound();
            }
            return PartialView("_User", user);
        }

        [HttpPost]
        public IActionResult Authorization(string login, string password)
        {
            var user = _usersRepository.TryGetByLogin(login);
            if (user is null)
            {
                return NotFound("Пользователь не найден");
            } else if (user.Password != password)
            {
                return BadRequest("Неверный пароль");
            }
            return Json(user);
        }

        [HttpPost]
        public IActionResult Create(string login, string password, string name, string date)
        {
            foreach (var user in _usersRepository.Users)
            {
                if (user.Login == login)
                {
                    return BadRequest("Пользователь уже существует");
                }
            }
            var newUser = new User(login, password, name, date);
            _usersRepository.Add(newUser);
            return Json(newUser);
        }

        [HttpPost]
        public IActionResult UpdateSortingValue(Guid id, string login, string list, string sortingValue)
        {
            var user = _usersRepository.TryGetById(id);
            if (user is null || user.Login != login)
            {
                return NotFound();
            }
            switch (list)
            {
                case "developersList":
                    user.SortingDevListValue = sortingValue;
                    break;
                case "feedbacksList":
                    user.SortingFdbackListValue = sortingValue;
                    break;
            }
            return Json(user);
        }

        [HttpPost]
        public IActionResult UpdateImage(Guid id, string login, IFormFile avatar)
        {
            var user = _usersRepository.TryGetById(id);
            if (user is null || user.Login != login)
            {
                return NotFound();
            }
            _usersRepository.SaveImage(user, avatar, _appEnvironment);
            return Json(user);
        }

        [HttpPost]
        public IActionResult UpdateGeoposition(Guid id, string login, string geoPosition)
        {
            var user = _usersRepository.TryGetById(id);
            if (user is null || user.Login != login)
            {
                return NotFound();
            }
            user.Geolocation = JsonSerializer.Deserialize<Dictionary<string, string>>(geoPosition);
            return Json(user);
        }

        [HttpPost]
        public IActionResult UpdateGameList(Guid id, string login, string gameKey = "", bool wrong = false)
        {
            var user = _usersRepository.TryGetById(id);
            if (user is null || user.Login != login)
            {
                return NotFound();
            }
            if (wrong)
            {
                user.TotalGameAttempts++;
            }
            else
            {
                user.GamesList.Remove(gameKey);
                if (user.GamesList.Count == 0)
                {
                    user.GameWinner = true;
                    user.TotalGameAttempts++;
                }
            }
            return Json(user);
        }

        [HttpPost]
        public IActionResult UpdateInfo(Guid id, string login, string firstName, string surName)
        {
            var user = _usersRepository.TryGetById(id);
            if (user is null || user.Login != login)
            {
                return NotFound();
            }
            user.FirstName = firstName;
            user.SurName = surName;
            return Json(user);
        }

        [HttpPost]
        public IActionResult CheckPassword(Guid id, string login, string passwordPart)
        {
            var user = _usersRepository.TryGetById(id);
            if (user is null || user.Login != login)
            {
                return NotFound();
            }
            if (!user.Password.Contains(passwordPart))
            {
                return Ok("Неверный пароль");
            }
            else if (user.Password == passwordPart)
            {
                return Ok("Верный пароль");
            }
            return Ok("Ввод...");
        }

        [HttpPost]
        public IActionResult UpdatePassword(Guid id, string login, string newPassword)
        {
            var user = _usersRepository.TryGetById(id);
            if (user is null || user.Login != login)
            {
                return NotFound();
            }
            user.Password = newPassword;
            return Ok();
        }

        [HttpPost]
        public IActionResult SaveCanvasImage(Guid id, string login, IFormFile canvas)
        {
            var user = _usersRepository.TryGetById(id);
            if (user is null || user.Login != login)
            {
                return NotFound();
            }
            _usersRepository.SaveImage(user, canvas, _appEnvironment);
            return Ok();
        }

        [HttpDelete]
        public IActionResult Delete(Guid id, string login, string password)
        {
            var user = _usersRepository.TryGetById(id);
            if (user is null || user.Login != login)
            {
                return NotFound();
            }
            if (user.Password == password)
            {
                _usersRepository.Delete(user);
            } else
            {
                return BadRequest("Неверный пароль");
            }
            return Ok();
        }
    }
}
