namespace My_Stud_Proj.Models
{
    public class Developer
    {
        public Guid Id { get; set; }
        public string Рhoto { get; set; }
        public string PhotoText { get; set; }
        public string Name { get; set; }
        public string Spec { get; set; }
        public decimal Price { get; set; }
        public string Rating { get; set; }
        public IList<string>? IdeList { get; set; }
        public IList<string>? ProgramLangList { get; set; }
        public IList<string>? DbList { get; set; }
        public IList<string>? LibrariesList { get; set; }
        public IList<string>? OtherSkillsList { get; set; }
        public IList<Dictionary<string, string>>? CertificatesList { get; set; }
        public string? About { get; set; }
        public Developer(string photo, string photoText, string name, string spec, decimal price, IList<string>? ideList, IList<string>? programLangList, IList<string>? dbList, IList<string>? librariesList, IList<string>? otherSkillsList, IList<Dictionary<string, string>>? certificatesList, string? about)
        {
            Id = Guid.NewGuid();
            Рhoto = photo;
            PhotoText = photoText;
            Name = name;
            Spec = spec;
            Price = price;
            IdeList = ideList;
            ProgramLangList = programLangList;
            DbList = dbList;
            LibrariesList = librariesList;
            OtherSkillsList = otherSkillsList;
            CertificatesList = certificatesList;
            About = about;
        }
    }
}
