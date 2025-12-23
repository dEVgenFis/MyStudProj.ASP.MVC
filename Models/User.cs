using System.Text.Json.Serialization;

namespace My_Stud_Proj.Models
{
    public class User
    {
        private string _password;
        public Guid Id { get; set; }
        public string Login { get; set; }
        [JsonIgnore]
        public string Password
        { 
            get => _password;
            set => _password = value;
        }
        public string FirstName { get; set; }
        public string SurName { get; set; } = "-";
        public IDictionary<string, string> Geolocation { get; set; } = new Dictionary<string, string>();
        public string Image { get; set; } = "img/Avatar.png";
        public bool GameWinner { get; set; } = false;
        public int TotalGameAttempts { get; set; } = 0;
        public string SortingDevListValue { get; set; } = "ratingDown";
        public string SortingFdbackListValue { get; set; } = "ratingDown";
        public IList<string> GamesList { get; set; } = ["атомарность", "destructuring", "canvas", "drag"];
        [JsonIgnore]
        public string RegistrationDate { get; set; }
        public User(string login, string password, string firstName, string registrationDate)
        {
            Id = Guid.NewGuid();
            Login = login;
            Password = password;
            FirstName = firstName;
            RegistrationDate = registrationDate;
        }
        // тестовый конструктор
        public User(Guid id, string login, string password, string firstName, IDictionary<string, string> geolocation, string image, bool gameWinner, int totalGameAttempts, IList<string> gamesList, string registrationDate)
        {
            Id = id;
            Login = login;
            Password = password;
            FirstName = firstName;
            Geolocation = geolocation;
            Image = image;
            GameWinner = gameWinner;
            TotalGameAttempts = totalGameAttempts;
            GamesList = gamesList;
            RegistrationDate = registrationDate;
        }
        ///
    }
}
