using My_Stud_Proj.Models;

namespace My_Stud_Proj.Interfaces
{
    public interface IFeedbacksRepository
    {
        Task<IList<FeedbacksDbList>> GetAllAsync();
        Task<FeedbacksDbList?> TryGetFeedbacksListByIdAsync(Guid id);
        FeedbackDb? TryGetFeedbackById(Guid id, FeedbacksDbList feedbackList);
        Task<FeedbacksDbList> CreateAsync(Guid developerId);
        Task AddAsync(FeedbacksDbList feedbackList, UserDb userDb, byte feedbackGrade, string feedbackText, string dateTime);
        Task UpdateAsync(FeedbacksDbList feedbackDbList, FeedbackDb feedback, byte grade, string text, string dateTime);
        Task DeleteAsync(FeedbacksDbList feedbackList, FeedbackDb feedback);
    }
}