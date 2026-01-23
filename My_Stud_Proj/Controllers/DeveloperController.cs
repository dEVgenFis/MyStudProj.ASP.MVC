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

        public async Task<IActionResult> Index(Guid developerId, int screenWidth)
        {
            ViewBag.ScreenWidth = screenWidth;
            var developerDb = await _developersRepository.TryGetByIdAsync(developerId);
            if (developerDb is null)
            {
                return BadRequest("Разработчик не найден.");
            }
            var developerViewModel = MappingService.MappingToDeveloperViewModel(developerDb);
            var feedbacksDbList = await _feedbacksRepository.TryGetFeedbacksListByIdAsync(developerViewModel.Id);
            developerViewModel.Rating = MappingService.MappingToFeedbacksViewModelList(feedbacksDbList).Rating;
            return PartialView("_Developer", developerViewModel);
        }

        public async Task<string> GetRating(Guid developerId)
        {
            var developerDb = await _developersRepository.TryGetByIdAsync(developerId);
            var developerViewModel = MappingService.MappingToDeveloperViewModel(developerDb);
            var feedbacksDbList = await _feedbacksRepository.TryGetFeedbacksListByIdAsync(developerViewModel.Id);
            developerViewModel.Rating = MappingService.MappingToFeedbacksViewModelList(feedbacksDbList).Rating;
            return developerViewModel.Rating;
        }
    }
}
