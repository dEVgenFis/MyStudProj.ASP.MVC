namespace My_Stud_Proj.Models
{
    public class FeedbacksList
    {
        public Guid DeveloperId { get; set; }
        public string Rating
        {
            get
            {
                if (List.Count() > 0)
                {
                    var result = List.Average(feedback => feedback.FeedbackGrade).ToString();
                    return result.Length > 1 ? result.Substring(0, 3).Replace(",", ".") : result;
                }
                else
                {
                    return "0";
                }
            }
        }
        public IList<Feedback> List { get; set; }
        public FeedbacksList(Guid developerId, IList<Feedback> list)
        {
            DeveloperId = developerId;
            List = list;
        }
    }
}
