namespace My_Stud_Proj.Models
{
    public class UserDb
    {
        public Guid Id { get; set; }
        public string Login { get; set; }
        public string Password { get; set; }
        public string AvatarPath { get; set; } = "img/Avatar.png";
        public string FirstName { get; set; }
        public string SurName { get; set; } = "-";
        public string? Geolocation { get; set; }
        public bool GameWinner { get; set; } = false;
        public int TotalGameAttempts { get; set; } = 0;
        public string SortingDevListValue { get; set; } = "ratingDown";
        public string SortingFdbackListValue { get; set; } = "ratingDown";
        public string GamesListString { get; set; } = "атомарность,destructuring,canvas,drag";
        public string RegistrationDate { get; set; }
        public UserDb(string login, string password, string firstName, string registrationDate)
        {
            Login = login;
            Password = password;
            FirstName = firstName;
            RegistrationDate = registrationDate;
        }
    }
}
