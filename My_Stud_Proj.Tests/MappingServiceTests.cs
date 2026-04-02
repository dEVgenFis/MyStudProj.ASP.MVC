using My_Stud_Proj.Helpers;
using My_Stud_Proj.Models;

namespace My_Stud_Proj.Tests
{
    public class MappingServiceTests
    {
        [Fact]
        public void MappingToDeveloperViewModelTest()
        {
            // Arrange
            var developerDb = new DeveloperDb
            {
                Id = Guid.NewGuid(),
                ÐhotoPath = "ÐhotoPath",
                PhotoText = "PhotoText",
                Name = "Name",
                Spec = "Spec",
                Price = 0.00M,
                ProgramLangString = string.Empty
            };

            // Act
            var result = MappingService.MappingToDeveloperViewModel(developerDb);

            // Assert
            Assert.Equal(developerDb.Id, result.Id);
            Assert.Equal(developerDb.ÐhotoPath, result.ÐhotoPath);
            Assert.Equal(developerDb.PhotoText, result.PhotoText);
            Assert.Equal(developerDb.Name, result.Name);
            Assert.Equal(developerDb.Spec, result.Spec);
            Assert.Equal(developerDb.Price.ToString(), result.Price);
        }

        [Fact]
        public void MappingToUserViewModelTest()
        {
            // Arrange
            var userDb = new UserDb(
                "Login@something.com",
                "Password",
                "FirstName",
                "RegistrationDate"
            );
            userDb.Id = Guid.NewGuid();
            userDb.AvatarPath = "AvatarPath";
            userDb.SurName = "SurName";
            userDb.GameWinner = false;
            userDb.TotalGameAttempts = 3;
            userDb.SortingDevListValue = "priceDown";
            userDb.SortingFdbackListValue = "ratingUp";
            userDb.GamesListString = "canvas";

            // Act
            var result = MappingService.MappingToUserViewModel(userDb);

            // Assert
            Assert.Equal(userDb.Id, result.Id);
            Assert.Equal(userDb.Login, result.Login);
            Assert.Equal(userDb.AvatarPath, result.AvatarPath);
            Assert.Equal(userDb.FirstName, result.FirstName);
            Assert.Equal(userDb.SurName, result.SurName);
            Assert.Equal(userDb.GameWinner, result.GameWinner);
            Assert.Equal(userDb.TotalGameAttempts, result.TotalGameAttempts);
            Assert.Equal(userDb.SortingDevListValue, result.SortingDevListValue);
            Assert.Equal(userDb.SortingFdbackListValue, result.SortingFdbackListValue);
            Assert.Equal(userDb.GamesListString.Split(','), result.GamesList);
        }

        // òåñò ñ íàáîðîì êîíêðåòíûõ çíà÷åíèé
        [Theory]
        ///
        [InlineData(0, 0, "0")]
        [InlineData(9, 2, "4.5")]
        [InlineData(10, 2, "5")]
        [InlineData(10, 3, "3.3")]
        public void MappingToFeedbacksViewModelListTest(int totalGrade, int feedbacksCount, string rating)
        {
            // Arrange
            var feedbackDb = new FeedbackDb(
                Guid.NewGuid(),
                "UserAvatarPath",
                "UserName",
                true,
                1,
                5,
                "FeedbackText",
                "DateTime"
            );
            var feedbacksDbList = new FeedbacksDbList(Guid.NewGuid());
            feedbacksDbList.TotalGrade = totalGrade;
            feedbacksDbList.List = Enumerable.Repeat(feedbackDb, feedbacksCount).ToList();

            // Act
            var result = MappingService.MappingToFeedbacksViewModelList(feedbacksDbList);

            // Assert
            Assert.Equal(feedbacksDbList.DeveloperId, result.DeveloperId);
            Assert.Equal(rating.ToString(), result.Rating);
        }
    }
}
