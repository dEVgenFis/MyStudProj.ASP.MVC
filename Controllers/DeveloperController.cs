using Microsoft.AspNetCore.Mvc;
using My_Stud_Proj.Helpers;
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
            var developerDb = _developersRepository.TryGetById(developerId);
            if (developerDb is null)
            {
                return BadRequest("Разработчик не найден.");
            }
            var developerViewModel = Mapping.MappingToDeveloperViewModel(developerDb);
            var feedbacksDbList = _feedbacksRepository.TryGetFeedbacksListById(developerViewModel.Id);
            developerViewModel.Rating = Mapping.MappingToFeedbacksViewModelList(feedbacksDbList).Rating;
            return PartialView("_Developer", developerViewModel);
        }

        public string GetRating(Guid developerId)
        {
            var developerDb = _developersRepository.TryGetById(developerId);
            var developerViewModel = Mapping.MappingToDeveloperViewModel(developerDb);
            var feedbacksDbList = _feedbacksRepository.TryGetFeedbacksListById(developerViewModel.Id);
            developerViewModel.Rating = Mapping.MappingToFeedbacksViewModelList(feedbacksDbList).Rating;
            return developerViewModel.Rating;
        }
    }
}
