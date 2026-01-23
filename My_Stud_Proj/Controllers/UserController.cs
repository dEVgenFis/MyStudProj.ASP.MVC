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
        public async Task<IActionResult> Index(Guid id, string login)
        {
            var userDb = await _usersRepository.TryGetByIdAsync(id);
            if (userDb is null || userDb.Login != login)
            {
                return NotFound();
            }
            return PartialView("_User", MappingService.MappingToUserViewModel(userDb));
        }

        [HttpPost]
        public async Task<IActionResult> Authorization(string login, string password)
        {
            var userDb = await _usersRepository.TryGetByLoginAsync(login);
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
        public async Task<IActionResult> Create(string login, string password, string name, string date)
        {
            var usersDb = await _usersRepository.GetAllAsync();
            foreach (var userDb in usersDb)
            {
                if (userDb.Login == login)
                {
                    return BadRequest("Пользователь уже существует");
                }
            }
            var newUser = await _usersRepository.AddAsync(login, password, name, date);
            return Json(MappingService.MappingToUserViewModel(newUser));
        }

        [HttpPost]
        public async Task<IActionResult> UpdateSortingValue(Guid id, string login, string list, string sortingValue)
        {
            var userDb = await _usersRepository.TryGetByIdAsync(id);
            if (userDb is null || userDb.Login != login)
            {
                return NotFound();
            }
            await _usersRepository.UpdateSortingValueAsync(userDb, list, sortingValue);
            return Json(MappingService.MappingToUserViewModel(userDb));
        }

        [HttpPost]
        public async Task<IActionResult> UpdateImage(Guid id, string login, IFormFile avatar)
        {
            var userDb = await _usersRepository.TryGetByIdAsync(id);
            if (userDb is null || userDb.Login != login)
            {
                return NotFound();
            }
            await _usersRepository.SaveImageAsync(userDb, avatar, _appEnvironment);
            return Json(MappingService.MappingToUserViewModel(userDb));
        }

        [HttpPost]
        public async Task<IActionResult> UpdateGeoposition(Guid id, string login, string geoPosition)
        {
            var userDb = await _usersRepository.TryGetByIdAsync(id);
            if (userDb is null || userDb.Login != login)
            {
                return NotFound();
            }
            await _usersRepository.UpdateGeopositionAsync(userDb, geoPosition);
            return Json(MappingService.MappingToUserViewModel(userDb));
        }

        [HttpPost]
        public async Task<IActionResult> UpdateGameList(Guid id, string login, string gameKey = "", bool wrong = false)
        {
            var userDb = await _usersRepository.TryGetByIdAsync(id);
            if (userDb is null || userDb.Login != login)
            {
                return NotFound();
            }
            await _usersRepository.UpdateGameListAsync(userDb, gameKey, wrong);
            return Json(MappingService.MappingToUserViewModel(userDb));
        }

        [HttpPost]
        public async Task<IActionResult> UpdateInfo(Guid id, string login, string firstName, string surName)
        {
            var userDb = await _usersRepository.TryGetByIdAsync(id);
            if (userDb is null || userDb.Login != login)
            {
                return NotFound();
            }
            await _usersRepository.UpdateInfoAsync(userDb, firstName, surName);
            return Json(MappingService.MappingToUserViewModel(userDb));
        }

        [HttpPost]
        public async Task<IActionResult> CheckPassword(Guid id, string login, string passwordPart)
        {
            var userDb = await _usersRepository.TryGetByIdAsync(id);
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
        public async Task<IActionResult> UpdatePassword(Guid id, string login, string newPassword)
        {
            var userDb = await _usersRepository.TryGetByIdAsync(id);
            if (userDb is null || userDb.Login != login)
            {
                return NotFound();
            }
            await _usersRepository.UpdatePasswordAsync(userDb, newPassword);
            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> SaveCanvasImage(Guid id, string login, IFormFile canvas)
        {
            var userDb = await _usersRepository.TryGetByIdAsync(id);
            if (userDb is null || userDb.Login != login)
            {
                return NotFound();
            }
            await _usersRepository.SaveImageAsync(userDb, canvas, _appEnvironment);
            return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(Guid id, string login, string password)
        {
            var userDb = await _usersRepository.TryGetByIdAsync(id);
            if (userDb is null || userDb.Login != login)
            {
                return NotFound();
            }
            if (userDb.Password == password)
            {
                await _usersRepository.DeleteAsync(userDb, _appEnvironment);
            } else
            {
                return BadRequest("Неверный пароль");
            }
            return Ok();
        }
    }
}
