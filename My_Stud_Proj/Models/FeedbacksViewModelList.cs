namespace My_Stud_Proj.Models
{
    public class FeedbacksViewModelList
    {
        public Guid DeveloperId { get; set; }
        public string Rating { get; set; }
        public IList<FeedbackViewModel> List { get; set; }
        public FeedbacksViewModelList(Guid developerId, float rating, IList<FeedbackViewModel> list)
        {
            DeveloperId = developerId;
            Rating = rating != 0 && rating.ToString().Length > 1 ? rating.ToString().Substring(0, 3).Replace(",", ".") : rating.ToString();
            List = list;
        }
    }
}
