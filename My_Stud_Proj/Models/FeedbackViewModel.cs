namespace My_Stud_Proj.Models
{
    public class FeedbackViewModel
    {
        public Guid Id { get; set; }
        public string UserAvatarPath { get; set; }
        public string UserName { get; set; }
        public bool UserGameWinner { get; set; }
        public int UserTotalGameAttempts { get; set; }
        public Guid UserId { get; set; }
        public byte FeedbackGrade { get; set; }
        public string FeedbackText { get; set; }
        public bool FeedbackUpdate { get; set; }
        public string DateTime { get; set; }
        public FeedbackViewModel(Guid id, string userAvatarPath, string userName, bool userGameWinner, int userTotalGameAttempts, Guid userId, byte feedbackGrade, string feedbackText, bool feedbackUpdate, string dateTime)
        {
            Id = id;
            UserAvatarPath = userAvatarPath;
            UserName = userName;
            UserGameWinner = userGameWinner;
            UserTotalGameAttempts = userTotalGameAttempts;
            UserId = userId;
            FeedbackGrade = feedbackGrade;
            FeedbackText = feedbackText;
            FeedbackUpdate = feedbackUpdate;
            DateTime = dateTime;
        }
    }
}
