using My_Stud_Proj.Interfaces;
using My_Stud_Proj.Models;

namespace My_Stud_Proj.Helpers
{
    public static class DbService
    {
        public static async Task UpdateFeedbackUserInfoAsync(UserDb userDb, string property, string userNewInfo, IFeedbacksRepository feedbacksRepository)
        {
            var feedbacksDbLists = await feedbacksRepository.GetAllAsync();
            foreach (var feedbacksDbList in feedbacksDbLists)
            {
                foreach (var feedbackDb in feedbacksDbList.List)
                {
                    if (feedbackDb.UserId == userDb.Id)
                    {
                        switch (property)
                        {
                            case "GamesListString":
                                feedbackDb.UserGameWinner = true;
                                feedbackDb.UserTotalGameAttempts = int.Parse(userNewInfo);
                                break;
                            case "UserName":
                                feedbackDb.UserName = userNewInfo;
                                break;
                            case "SaveImage":
                                feedbackDb.UserAvatarPath = userNewInfo;
                                break;
                        }
                    }
                }
            }
        }
    }
}
