using Microsoft.AspNetCore.Mvc;
using My_Stud_Proj.Interfaces;

namespace My_Stud_Proj.Controllers
{
    public class HomeController : Controller
    {
        private readonly IDevelopersRepository _developersRepository;

        private readonly IFeedbacksRepository _feedbacksRepository;

        public HomeController(IDevelopersRepository developersRepository, IFeedbacksRepository feedbacksRepository)
        {
            _developersRepository = developersRepository;
            _feedbacksRepository = feedbacksRepository;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Sorting(string sortingValue)
        {
            var developers = _developersRepository.GetAll();
            foreach (var developer in developers)
            {
                // временный метод
                var feedbacksList = _feedbacksRepository.Create(developer.Id, developer.Spec);
                ///
                developer.Rating = _feedbacksRepository.TryGetRatingById(developer.Id);
            }
            developers = _developersRepository.Sorting(sortingValue);
            return PartialView("_Catalog", developers);
        }

        public IActionResult Back()
        {
            return PartialView("_Home");
        }
    }
}
