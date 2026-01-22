using System.Text.Json;

namespace My_Stud_Proj.Models
{
    public class DeveloperViewModel
    {
        public Guid Id { get; set; }
        public string РhotoPath { get; set; }
        public string PhotoText { get; set; }
        public string Name { get; set; }
        public string Spec { get; set; }
        public string Price { get; set; }
        public string Rating { get; set; }
        public IList<string>? IdeList { get; set; }
        public IList<string> ProgramLangList { get; set; }
        public IList<string>? DbList { get; set; }
        public IList<string>? LibrariesList { get; set; }
        public IList<string>? OtherSkillsList { get; set; }
        public List<Dictionary<string, string>>? CertificatesList { get; set; }
        public string? About { get; set; }
        public DeveloperViewModel(Guid id, string photoPath, string photoText, string name, string spec, decimal price, string? ideList, string programLangList, string? dbList, string? librariesList, string? otherSkillsList, string? certificatesList, string? about)
        {
            Id = id;
            РhotoPath = photoPath;
            PhotoText = photoText;
            Name = name;
            Spec = spec;
            Price = price.ToString("0.00");
            IdeList = ideList?.Split(',');
            ProgramLangList = programLangList.Split(',');
            DbList = dbList?.Split(',');
            LibrariesList = librariesList?.Split(',');
            OtherSkillsList = otherSkillsList?.Split(',');
            CertificatesList = certificatesList is not null ? JsonSerializer.Deserialize<List<Dictionary<string, string>>>(certificatesList) : default;
            About = about;
        }
    }
}
