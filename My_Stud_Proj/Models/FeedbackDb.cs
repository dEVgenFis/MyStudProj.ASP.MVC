namespace My_Stud_Proj.Models
{
    public class FeedbackDb
    {
        public Guid Id { get; set; }
        public string UserAvatarPath { get; set; }
        public string UserName { get; set; }
        public bool UserGameWinner { get; set; }
        public int UserTotalGameAttempts { get; set; }
        public Guid UserId { get; set; }
        public byte FeedbackGrade { get; set; }
        public string FeedbackText { get; set; } = string.Empty;
        public bool FeedbackUpdate { get; set; } = false;
        public string DateTime { get; set; }
        // навигационное свойство ("один к одному")
        public FeedbacksDbList FeedbacksDbList { get; set; }
        ///
        public FeedbackDb(Guid userId, string userAvatarPath, string userName, bool userGameWinner, int userTotalGameAttempts, byte feedbackGrade, string feedbackText, string dateTime)
        {
            UserId = userId;
            UserAvatarPath = userAvatarPath;
            UserName = userName;
            UserGameWinner = userGameWinner;
            UserTotalGameAttempts = userTotalGameAttempts;
            FeedbackGrade = feedbackGrade;
            FeedbackText = feedbackText;
            DateTime = dateTime;
        }
    }
}
