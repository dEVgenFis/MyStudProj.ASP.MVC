using System.Text.Json;

namespace My_Stud_Proj.Models
{
    public class UserViewModel
    {
        public Guid Id { get; set; }
        public string Login { get; set; }
        public string AvatarPath { get; set; }
        public string FirstName { get; set; }
        public string SurName { get; set; }
        public IDictionary<string, string>? Geolocation { get; set; }
        public bool GameWinner { get; set; }
        public int TotalGameAttempts { get; set; }
        public string SortingDevListValue { get; set; }
        public string SortingFdbackListValue { get; set; }
        public IList<string> GamesList { get; set; }
        public UserViewModel(Guid id, string login, string avatarPath, string firstName, string surName, string? geolocation, bool gameWinner, int totalGameAttempts, string sortingDevListValue, string sortingFdbackListValue, string gamesList)
        {
            Id = id;
            Login = login;
            AvatarPath = avatarPath;
            FirstName = firstName;
            SurName = surName;
            Geolocation = geolocation is not null ? JsonSerializer.Deserialize<IDictionary<string, string>>(geolocation) : default;
            GameWinner = gameWinner;
            TotalGameAttempts = totalGameAttempts;
            SortingDevListValue = sortingDevListValue;
            SortingFdbackListValue = sortingFdbackListValue;
            GamesList = !string.IsNullOrEmpty(gamesList) ? gamesList.Split(',') : new List<string>();
        }
    }
}
