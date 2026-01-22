using Microsoft.AspNetCore.Mvc;
using My_Stud_Proj.Helpers;
using My_Stud_Proj.Interfaces;
using System.Text.Json;

namespace My_Stud_Proj.Controllers
{
    public class FeedbackController : Controller
    {
        private readonly IFeedbacksRepository _feedbacksRepository;

        private readonly IDevelopersRepository _developersRepository;

        private readonly IUsersRepository _usersRepository;

        public FeedbackController(IFeedbacksRepository feedbacksRepository, IDevelopersRepository developersRepository, IUsersRepository usersRepository)
        {
            _feedbacksRepository = feedbacksRepository;
            _developersRepository = developersRepository;
            _usersRepository = usersRepository;
        }

        public IActionResult Index()
        {
            return PartialView("_Feedback");
        }

        public IActionResult GetAll(Guid id, string sortingValue)
        {
            var developerDb = _developersRepository.TryGetById(id);
            var usersDb = _usersRepository.GetAll();
            if (developerDb is null)
            {
                return NotFound();
            }
            var feedbacksDbList = _feedbacksRepository.TryGetFeedbacksListById(id);
            var feedbacksViewModelList = MappingService.MappingToFeedbacksViewModelList(feedbacksDbList);
            feedbacksViewModelList.List = SortingService.SortingFeedbacksList(feedbacksViewModelList.List, sortingValue);
            var data = JsonSerializer.Serialize(feedbacksViewModelList, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });
            return Ok(data);
        }

        public IActionResult Add(Guid developerId, Guid userId, string login, byte feedbackGrade, string dateTime, string feedbackText = "")
        {
            var existingFeedbackList = _feedbacksRepository.TryGetFeedbacksListById(developerId);
            var userDb = _usersRepository.TryGetById(userId);
            if (existingFeedbackList is null || userDb is null || userDb.Login != login)
            {
                return NotFound();
            }
            _feedbacksRepository.Add(existingFeedbackList, userDb, feedbackGrade, feedbackText, dateTime);
            return Ok();
        }

        public IActionResult Update(Guid developerId, Guid feedbackId, byte grade, string text, string dateTime)
        {
            var existingFeedbackList = _feedbacksRepository.TryGetFeedbacksListById(developerId);
            if (existingFeedbackList is null)
            {
                return NotFound();
            }
            var existingFeedback = _feedbacksRepository.TryGetFeedbackById(feedbackId, existingFeedbackList);
            if (existingFeedback is null)
            {
                return NotFound();
            }
            _feedbacksRepository.Update(existingFeedbackList, existingFeedback, grade, text, dateTime);
            return Ok();
        }

        [HttpDelete]
        public IActionResult Delete(Guid developerId, Guid feedbackId)
        {
            var existingFeedbackList = _feedbacksRepository.TryGetFeedbacksListById(developerId);
            if (existingFeedbackList is null)
            {
                return NotFound();
            }
            var existingFeedback = _feedbacksRepository.TryGetFeedbackById(feedbackId, existingFeedbackList);
            if (existingFeedback is null)
            {
                return NotFound();
            }
            _feedbacksRepository.Delete(existingFeedbackList, existingFeedback);
            return Ok();
        }
    }
}
