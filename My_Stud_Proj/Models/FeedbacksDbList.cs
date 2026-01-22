namespace My_Stud_Proj.Models
{
    public class FeedbacksDbList
    {
        public Guid Id { get; set; }
        public Guid DeveloperId { get; set; }
        public int TotalGrade { get; set; } = 0;
        // навигационное свойство ("один ко многим")
        public IList<FeedbackDb> List { get; set; }
        ///
        public FeedbacksDbList(Guid developerId)
        {
            DeveloperId = developerId;
            List = new List<FeedbackDb>();
        }
    }
}
