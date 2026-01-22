using Microsoft.AspNetCore.Mvc;
using My_Stud_Proj.Helpers;
using My_Stud_Proj.Interfaces;

namespace My_Stud_Proj.Controllers
{
    public class UserController : Controller
    {
        private readonly IWebHostEnvironment _appEnvironment;

        private readonly IUsersRepository _usersRepository;

        public UserController(IWebHostEnvironment appEnvironment, IUsersRepository usersRepository)
        {
            _appEnvironment = appEnvironment;
            _usersRepository = usersRepository;
        }

        [HttpPost]
        public IActionResult Index(Guid id, string login)
        {
            var userDb = _usersRepository.TryGetById(id);
            if (userDb is null || userDb.Login != login)
            {
                return NotFound();
            }
            return PartialView("_User", MappingService.MappingToUserViewModel(userDb));
        }

        [HttpPost]
        public IActionResult Authorization(string login, string password)
        {
            var userDb = _usersRepository.TryGetByLogin(login);
            if (userDb is null)
            {
                return NotFound("Пользователь не найден");
            } else if (userDb.Password != password)
            {
                return BadRequest("Неверный пароль");
            }
            return Json(MappingService.MappingToUserViewModel(userDb));
        }

        [HttpPost]
        public IActionResult Create(string login, string password, string name, string date)
        {
            foreach (var userDb in _usersRepository.GetAll())
            {
                if (userDb.Login == login)
                {
                    return BadRequest("Пользователь уже существует");
                }
            }
            var newUser = _usersRepository.Add(login, password, name, date);
            return Json(MappingService.MappingToUserViewModel(newUser));
        }

        [HttpPost]
        public IActionResult UpdateSortingValue(Guid id, string login, string list, string sortingValue)
        {
            var userDb = _usersRepository.TryGetById(id);
            if (userDb is null || userDb.Login != login)
            {
                return NotFound();
            }
            _usersRepository.UpdateSortingValue(userDb, list, sortingValue);
            return Json(MappingService.MappingToUserViewModel(userDb));
        }

        [HttpPost]
        public IActionResult UpdateImage(Guid id, string login, IFormFile avatar)
        {
            var userDb = _usersRepository.TryGetById(id);
            if (userDb is null || userDb.Login != login)
            {
                return NotFound();
            }
            _usersRepository.SaveImage(userDb, avatar, _appEnvironment);
            return Json(MappingService.MappingToUserViewModel(userDb));
        }

        [HttpPost]
        public IActionResult UpdateGeoposition(Guid id, string login, string geoPosition)
        {
            var userDb = _usersRepository.TryGetById(id);
            if (userDb is null || userDb.Login != login)
            {
                return NotFound();
            }
            _usersRepository.UpdateGeoposition(userDb, geoPosition);
            return Json(MappingService.MappingToUserViewModel(userDb));
        }

        [HttpPost]
        public IActionResult UpdateGameList(Guid id, string login, string gameKey = "", bool wrong = false)
        {
            var userDb = _usersRepository.TryGetById(id);
            if (userDb is null || userDb.Login != login)
            {
                return NotFound();
            }
            _usersRepository.UpdateGameList(userDb, gameKey, wrong);
            return Json(MappingService.MappingToUserViewModel(userDb));
        }

        [HttpPost]
        public IActionResult UpdateInfo(Guid id, string login, string firstName, string surName)
        {
            var userDb = _usersRepository.TryGetById(id);
            if (userDb is null || userDb.Login != login)
            {
                return NotFound();
            }
            _usersRepository.UpdateInfo(userDb, firstName, surName);
            return Json(MappingService.MappingToUserViewModel(userDb));
        }

        [HttpPost]
        public IActionResult CheckPassword(Guid id, string login, string passwordPart)
        {
            var userDb = _usersRepository.TryGetById(id);
            if (userDb is null || userDb.Login != login)
            {
                return NotFound();
            }
            if (!userDb.Password.Contains(passwordPart))
            {
                return Ok("Неверный пароль");
            }
            else if (userDb.Password == passwordPart)
            {
                return Ok("Верный пароль");
            }
            return Ok("Ввод...");
        }

        [HttpPost]
        public IActionResult UpdatePassword(Guid id, string login, string newPassword)
        {
            var userDb = _usersRepository.TryGetById(id);
            if (userDb is null || userDb.Login != login)
            {
                return NotFound();
            }
            _usersRepository.UpdatePassword(userDb, newPassword);
            return Ok();
        }

        [HttpPost]
        public IActionResult SaveCanvasImage(Guid id, string login, IFormFile canvas)
        {
            var userDb = _usersRepository.TryGetById(id);
            if (userDb is null || userDb.Login != login)
            {
                return NotFound();
            }
            _usersRepository.SaveImage(userDb, canvas, _appEnvironment);
            return Ok();
        }

        [HttpDelete]
        public IActionResult Delete(Guid id, string login, string password)
        {
            var userDb = _usersRepository.TryGetById(id);
            if (userDb is null || userDb.Login != login)
            {
                return NotFound();
            }
            if (userDb.Password == password)
            {
                _usersRepository.Delete(userDb, _appEnvironment);
            } else
            {
                return BadRequest("Неверный пароль");
            }
            return Ok();
        }
    }
}
