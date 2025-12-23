using My_Stud_Proj.Models;

namespace My_Stud_Proj.Interfaces
{
    public interface IFeedbacksRepository
    {
        void Add(FeedbacksList feedbackList, Guid userId, byte feedbackGrade, string feedbackText, string dateTime);
        List<FeedbacksList> Create(Guid developerId, string developerSpec);
        void Delete(FeedbacksList feedbackList, Feedback feedback);
        IList<Feedback> Sorting(IList<Feedback> list, string sortingValue);
        Feedback? TryGetFeedbackById(Guid id, FeedbacksList feedbackList);
        FeedbacksList? TryGetFeedbacksListById(Guid id);
        string TryGetRatingById(Guid id);
        void Update(Feedback feedback, byte grade, string text, string dateTime);
    }
}