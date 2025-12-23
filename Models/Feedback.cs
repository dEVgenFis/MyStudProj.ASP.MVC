namespace My_Stud_Proj.Models
{
    public class Feedback
    {
        public Guid Id { get; set; }
        public string UserImage { get; set; } = "img/Avatar.png";
        public string UserName { get; set; } = "User";
        public bool UserGameWinner { get; set; } = false;
        public int UserTotalGameAttempts { get; set; } = 0;
        public Guid UserId { get; set; }
        public byte FeedbackGrade { get; set; }
        public string FeedbackText { get; set; }
        public bool FeedbackUpdate { get; set; } = false;
        public string DateTime { get; set; }
        public Feedback(Guid userId, byte feedbackGrade, string feedbackText, string dateTime)
        {
            Id = Guid.NewGuid();
            UserId = userId;
            FeedbackGrade = feedbackGrade;
            FeedbackText = feedbackText;
            DateTime = dateTime;
        }
        // тестовый конструктор
        public Feedback(string userImage, string userName, bool userGameWinner, int userTotalGameAttempts, Guid userId, byte feedbackGrade, string feedbackText, bool feedbackUpdate, string dateTime)
        {
            Id = Guid.NewGuid();
            UserImage = userImage;
            UserName = userName;
            UserGameWinner = userGameWinner;
            UserTotalGameAttempts = userTotalGameAttempts;
            UserId = userId;
            FeedbackGrade = feedbackGrade;
            FeedbackText = feedbackText;
            FeedbackUpdate = feedbackUpdate;
            DateTime = dateTime;
        }
        ///
    }
}
