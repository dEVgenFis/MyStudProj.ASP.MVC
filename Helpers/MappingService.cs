using My_Stud_Proj.Models;

namespace My_Stud_Proj.Helpers
{
    public static class MappingService
    {
        public static DeveloperViewModel MappingToDeveloperViewModel(DeveloperDb developerDb)
        {
            var developerViewModel = new DeveloperViewModel(
                developerDb.Id,
                developerDb.РhotoPath,
                developerDb.PhotoText,
                developerDb.Name,
                developerDb.Spec,
                developerDb.Price,
                developerDb.IdeString,
                developerDb.ProgramLangString,
                developerDb.DbString,
                developerDb.LibrariesString,
                developerDb.OtherSkillsString,
                developerDb.CertificatesString,
                developerDb.About
            );
            return developerViewModel;
        }

        public static IList<DeveloperViewModel> MappingToDevelopersViewModelList(IList<DeveloperDb> developersDb)
        {
            var developersViewModel = new List<DeveloperViewModel>();
            foreach (var developerDb in developersDb)
            {
                developersViewModel.Add(MappingToDeveloperViewModel(developerDb));
            }
            return developersViewModel;
        }

        public static UserViewModel MappingToUserViewModel(UserDb userDb)
        {
            var userViewModel = new UserViewModel(
                userDb.Id,
                userDb.Login,
                userDb.AvatarPath,
                userDb.FirstName,
                userDb.SurName,
                userDb.Geolocation,
                userDb.GameWinner,
                userDb.TotalGameAttempts,
                userDb.SortingDevListValue,
                userDb.SortingFdbackListValue,
                userDb.GamesListString
            );
            return userViewModel;
        }

        public static FeedbackViewModel MappingToFeedbackViewModel(FeedbackDb feedbackDb)
        {
            var feedbackViewModel = new FeedbackViewModel(
                feedbackDb.Id,
                feedbackDb.UserAvatarPath,
                feedbackDb.UserName,
                feedbackDb.UserGameWinner,
                feedbackDb.UserTotalGameAttempts,
                feedbackDb.UserId,
                feedbackDb.FeedbackGrade,
                feedbackDb.FeedbackText,
                feedbackDb.FeedbackUpdate,
                feedbackDb.DateTime
            );
            return feedbackViewModel;
        }

        public static FeedbacksViewModelList MappingToFeedbacksViewModelList(FeedbacksDbList feedbacksDbList)
        {
            var feedbacksViewModelList = new FeedbacksViewModelList(
                feedbacksDbList.DeveloperId,
                feedbacksDbList.List.Count > 0 ? (float)feedbacksDbList.TotalGrade / feedbacksDbList.List.Count : 0,
                feedbacksDbList.List.Select(feedbackDb => MappingToFeedbackViewModel(feedbackDb)).ToList()
            );
            return feedbacksViewModelList;
        }
    }
}
