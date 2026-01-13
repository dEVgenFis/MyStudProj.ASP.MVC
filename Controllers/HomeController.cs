using Microsoft.AspNetCore.Mvc;
using My_Stud_Proj.Helpers;
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
            var developersDb = _developersRepository.GetAll();
            var developersViewModel = MappingService.MappingToDevelopersViewModelList(developersDb);
            foreach (var developer in developersViewModel)
            {
                var feedbacksDbList = _feedbacksRepository.TryGetFeedbacksListById(developer.Id) ?? _feedbacksRepository.Create(developer.Id);
                developer.Rating = MappingService.MappingToFeedbacksViewModelList(feedbacksDbList).Rating;
            }
            return PartialView("_Catalog", SortingService.SortingDevelopersList(developersViewModel, sortingValue));
        }

        public IActionResult Back()
        {
            return PartialView("_Home");
        }
    }
}
