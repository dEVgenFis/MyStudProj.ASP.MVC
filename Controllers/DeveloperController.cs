using Microsoft.AspNetCore.Mvc;
using My_Stud_Proj.Interfaces;

namespace My_Stud_Proj.Controllers
{
    public class DeveloperController : Controller
    {
        private readonly IDevelopersRepository _developersRepository;

        private readonly IFeedbacksRepository _feedbacksRepository;

        public DeveloperController(IDevelopersRepository developersRepository, IFeedbacksRepository feedbacksRepository)
        {
            _developersRepository = developersRepository;
            _feedbacksRepository = feedbacksRepository;
        }

        public IActionResult Index(Guid developerId, int screenWidth)
        {
            ViewBag.ScreenWidth = screenWidth;
            var developer = _developersRepository.TryGetById(developerId);
            if (developer is null)
            {
                return BadRequest("Разработчик не найден.");
            }
            developer.Rating = _feedbacksRepository.TryGetRatingById(developer.Id);
            return PartialView("_Developer", developer);
        }

        public string GetRating(Guid developerId)
        {
            var developer = _developersRepository.TryGetById(developerId);
            developer.Rating = _feedbacksRepository.TryGetRatingById(developer.Id);
            return developer.Rating;
        }
    }
}
