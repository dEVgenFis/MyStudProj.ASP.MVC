using My_Stud_Proj.Models;

namespace My_Stud_Proj.Interfaces
{
    public interface IFeedbacksRepository
    {
        IList<FeedbacksDbList> GetAll();
        FeedbacksDbList? TryGetFeedbacksListById(Guid id);
        FeedbackDb? TryGetFeedbackById(Guid id, FeedbacksDbList feedbackList);
        FeedbacksDbList Create(Guid developerId);
        void Add(FeedbacksDbList feedbackList, UserDb userDb, byte feedbackGrade, string feedbackText, string dateTime);
        void Update(FeedbacksDbList feedbackDbList, FeedbackDb feedback, byte grade, string text, string dateTime);
        void Delete(FeedbacksDbList feedbackList, FeedbackDb feedback);
    }
}