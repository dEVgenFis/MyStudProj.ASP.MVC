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

        public async Task<IActionResult> GetAll(Guid id, string sortingValue)
        {
            var developerDb = await _developersRepository.TryGetByIdAsync(id);
            if (developerDb is null)
            {
                return NotFound();
            }
            var feedbacksDbList = await _feedbacksRepository.TryGetFeedbacksListByIdAsync(id);
            var feedbacksViewModelList = MappingService.MappingToFeedbacksViewModelList(feedbacksDbList);
            feedbacksViewModelList.List = SortingService.SortingFeedbacksList(feedbacksViewModelList.List, sortingValue);
            var data = JsonSerializer.Serialize(feedbacksViewModelList, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });
            return Ok(data);
        }

        public async Task<IActionResult> Add(Guid developerId, Guid userId, string login, byte feedbackGrade, string dateTime, string feedbackText = "")
        {
            var existingFeedbackList = await _feedbacksRepository.TryGetFeedbacksListByIdAsync(developerId);
            var userDb = await _usersRepository.TryGetByIdAsync(userId);
            if (existingFeedbackList is null || userDb is null || userDb.Login != login)
            {
                return NotFound();
            }
            await _feedbacksRepository.AddAsync(existingFeedbackList, userDb, feedbackGrade, feedbackText, dateTime);
            return Ok();
        }

        public async Task<IActionResult> Update(Guid developerId, Guid feedbackId, byte grade, string text, string dateTime)
        {
            var existingFeedbackList = await _feedbacksRepository.TryGetFeedbacksListByIdAsync(developerId);
            if (existingFeedbackList is null)
            {
                return NotFound();
            }
            var existingFeedback = _feedbacksRepository.TryGetFeedbackById(feedbackId, existingFeedbackList);
            if (existingFeedback is null)
            {
                return NotFound();
            }
            await _feedbacksRepository.UpdateAsync(existingFeedbackList, existingFeedback, grade, text, dateTime);
            return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(Guid developerId, Guid feedbackId)
        {
            var existingFeedbackList = await _feedbacksRepository.TryGetFeedbacksListByIdAsync(developerId);
            if (existingFeedbackList is null)
            {
                return NotFound();
            }
            var existingFeedback = _feedbacksRepository.TryGetFeedbackById(feedbackId, existingFeedbackList);
            if (existingFeedback is null)
            {
                return NotFound();
            }
            await _feedbacksRepository.DeleteAsync(existingFeedbackList, existingFeedback);
            return Ok();
        }
    }
}
