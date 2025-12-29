namespace My_Stud_Proj.Models
{
    public class DeveloperDb
    {
        public Guid Id { get; set; }
        public string РhotoPath { get; set; }
        public string PhotoText { get; set; }
        public string Name { get; set; }
        public string Spec { get; set; }
        public decimal Price { get; set; }
        public string? IdeString { get; set; }
        public string ProgramLangString { get; set; }
        public string? DbString { get; set; }
        public string? LibrariesString { get; set; }
        public string? OtherSkillsString { get; set; }
        public string? CertificatesString { get; set; }
        public string? About { get; set; }
    }
}
