using Microsoft.EntityFrameworkCore;
using My_Stud_Proj.Interfaces;
using My_Stud_Proj.Models;

namespace My_Stud_Proj.Repositories
{
    public class DbFeedbacksRepository : IFeedbacksRepository
    {
        private readonly DatabaseContext _databaseContext;

        public DbFeedbacksRepository(DatabaseContext databaseContext)
        {
            _databaseContext = databaseContext;
        }

        public async Task<IList<FeedbacksDbList>> GetAllAsync() => await _databaseContext.FeedbacksList.Include(feedbacksDbList => feedbacksDbList.List).ToListAsync();

        public async Task<FeedbacksDbList?> TryGetFeedbacksListByIdAsync(Guid id)
        {
            return await _databaseContext.FeedbacksList.Include(feedbacksDbList => feedbacksDbList.List).FirstOrDefaultAsync(feedbackList => feedbackList.DeveloperId == id);
        }

        public FeedbackDb? TryGetFeedbackById(Guid id, FeedbacksDbList feedbackList)
        {
            return feedbackList.List.FirstOrDefault(feedback => feedback.Id == id);
        }

        public async Task<FeedbacksDbList> CreateAsync(Guid developerId)
        {
            var feedbackList = new FeedbacksDbList(developerId);
            _databaseContext.FeedbacksList.Add(feedbackList);
            await _databaseContext.SaveChangesAsync();
            return feedbackList;
        }

        public async Task AddAsync(FeedbacksDbList feedbackList, UserDb userDb, byte feedbackGrade, string feedbackText, string dateTime)
        {
            var newFeedback = new FeedbackDb(
                userDb.Id,
                userDb.AvatarPath,
                userDb.SurName == "-" ? userDb.FirstName : userDb.FirstName + " " + userDb.SurName[0] + ".",
                userDb.GameWinner,
                userDb.TotalGameAttempts,
                feedbackGrade,
                feedbackText,
                dateTime
            );
            newFeedback.FeedbacksDbList = feedbackList;
            feedbackList.List.Insert(0, newFeedback);
            feedbackList.TotalGrade += newFeedback.FeedbackGrade;
            await _databaseContext.SaveChangesAsync();
        }

        public async Task UpdateAsync(FeedbacksDbList feedbackDbList, FeedbackDb feedback, byte grade, string text, string dateTime)
        {
            feedbackDbList.TotalGrade -= feedback.FeedbackGrade;
            feedback.FeedbackGrade = grade;
            feedbackDbList.TotalGrade += feedback.FeedbackGrade;
            feedback.FeedbackText = text is null ? "" : text;
            feedback.DateTime = dateTime;
            feedback.FeedbackUpdate = true;
            await _databaseContext.SaveChangesAsync();
        }

        public async Task DeleteAsync(FeedbacksDbList feedbackList, FeedbackDb feedback)
        {
            feedbackList.TotalGrade -= feedback.FeedbackGrade;
            feedbackList.List.Remove(feedback);
            await _databaseContext.SaveChangesAsync();
        }
    }
}
