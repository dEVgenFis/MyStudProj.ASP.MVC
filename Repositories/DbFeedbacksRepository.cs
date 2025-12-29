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

        public IList<FeedbacksDbList> GetAll() => _databaseContext.FeedbacksList.Include(feedbacksDbList => feedbacksDbList.List).ToList();

        public FeedbacksDbList? TryGetFeedbacksListById(Guid id)
        {
            return _databaseContext.FeedbacksList.Include(feedbacksDbList => feedbacksDbList.List).FirstOrDefault(feedbackList => feedbackList.DeveloperId == id);
        }

        public FeedbackDb? TryGetFeedbackById(Guid id, FeedbacksDbList feedbackList)
        {
            return feedbackList.List.FirstOrDefault(feedback => feedback.Id == id);
        }

        public FeedbacksDbList Create(Guid developerId)
        {
            var feedbackList = new FeedbacksDbList(developerId);
            _databaseContext.FeedbacksList.Add(feedbackList);
            _databaseContext.SaveChanges();
            return feedbackList;
        }

        public void Add(FeedbacksDbList feedbackList, UserDb userDb, byte feedbackGrade, string feedbackText, string dateTime)
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
            _databaseContext.SaveChanges();
        }

        public void Update(FeedbacksDbList feedbackDbList, FeedbackDb feedback, byte grade, string text, string dateTime)
        {
            feedbackDbList.TotalGrade -= feedback.FeedbackGrade;
            feedback.FeedbackGrade = grade;
            feedbackDbList.TotalGrade += feedback.FeedbackGrade;
            feedback.FeedbackText = text is null ? "" : text;
            feedback.DateTime = dateTime;
            feedback.FeedbackUpdate = true;
            _databaseContext.SaveChanges();
        }

        public void Delete(FeedbacksDbList feedbackList, FeedbackDb feedback)
        {
            feedbackList.TotalGrade -= feedback.FeedbackGrade;
            feedbackList.List.Remove(feedback);
            _databaseContext.SaveChanges();
        }
    }
}
