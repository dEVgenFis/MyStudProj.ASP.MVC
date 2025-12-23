using Microsoft.AspNetCore.Mvc;
using My_Stud_Proj.Interfaces;
using System.Text.Json;

namespace My_Stud_Proj.Controllers
{
    public class FeedbackController : Controller
    {
        private readonly IFeedbacksRepository _feedbacksRepository;

        private readonly IUsersRepository _usersRepository;

        public FeedbackController(IFeedbacksRepository feedbacksRepository, IUsersRepository usersRepository)
        {
            _feedbacksRepository = feedbacksRepository;
            _usersRepository = usersRepository;
        }

        public IActionResult Index()
        {
            return PartialView("_Feedback");
        }

        public IActionResult GetAll(Guid id, string sortingValue)
        {
            var userList = _usersRepository.Users;
            var feedbackList = _feedbacksRepository.TryGetFeedbacksListById(id);
            if (feedbackList is null)
            {
                return NotFound();
            }
            feedbackList.List = _feedbacksRepository.Sorting(feedbackList.List, sortingValue);
            foreach (var feedback in feedbackList.List)
            {
                foreach (var user in userList)
                {
                    if (feedback.UserId == user.Id)
                    {
                        feedback.UserImage = user.Image;
                        feedback.UserName = user.SurName == "-" ? user.FirstName : user.FirstName + " " + user.SurName[0] + ".";
                        feedback.UserGameWinner = user.GameWinner;
                        feedback.UserTotalGameAttempts = user.TotalGameAttempts;
                        break;
                    }
                }
            }
            var data = JsonSerializer.Serialize(feedbackList, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });
            return Ok(data);
        }

        public IActionResult Create(Guid developerId, Guid userId, string login, byte feedbackGrade, string dateTime, string feedbackText = "")
        {
            var existingFeedbackList = _feedbacksRepository.TryGetFeedbacksListById(developerId);
            var user = _usersRepository.TryGetById(userId);
            if (existingFeedbackList is null || user is null || user.Login != login)
            {
                return NotFound();
            }
            _feedbacksRepository.Add(existingFeedbackList, userId, feedbackGrade, feedbackText, dateTime);
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
            _feedbacksRepository.Update(existingFeedback, grade, text, dateTime);
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
