using My_Stud_Proj.Models;

namespace My_Stud_Proj.Helpers
{
    public static class SortingService
    {
        public static IList<DeveloperViewModel> SortingDevelopersList(IList<DeveloperViewModel> list, string sortingValue)
        {
            IList<DeveloperViewModel> sortedList = new List<DeveloperViewModel>();
            switch (sortingValue)
            {
                case "priceUp":
                    sortedList = list.OrderBy(developer => developer.Price).ToList();
                    break;
                case "priceDown":
                    sortedList = list.OrderByDescending(developer => developer.Price).ToList();
                    break;
                case "ratingUp":
                    sortedList = list.OrderBy(developer => developer.Rating).ToList();
                    break;
                case "ratingDown":
                    sortedList = list.OrderByDescending(developer => developer.Rating).ToList();
                    break;
            }
            return sortedList;
        }

        public static IList<FeedbackViewModel> SortingFeedbacksList(IList<FeedbackViewModel> list, string sortingValue)
        {
            IList<FeedbackViewModel> sortedList = new List<FeedbackViewModel>();
            switch (sortingValue)
            {
                case "dateTimeUp":
                    sortedList = list.OrderBy(feedback => feedback.DateTime).ToList();
                    break;
                case "dateTimeDown":
                    sortedList = list.OrderByDescending(feedback => feedback.DateTime).ToList();
                    break;
                case "ratingUp":
                    sortedList = list.OrderBy(feedback => feedback.FeedbackGrade).ToList();
                    break;
                case "ratingDown":
                    sortedList = list.OrderByDescending(feedback => feedback.FeedbackGrade).ToList();
                    break;
            }
            return sortedList;
        }
    }
}
