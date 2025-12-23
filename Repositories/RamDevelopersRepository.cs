using My_Stud_Proj.Interfaces;
using My_Stud_Proj.Models;

namespace My_Stud_Proj.Repositories
{
    public class RamDevelopersRepository : IDevelopersRepository
    {
        private readonly List<Developer> _developers =
        [
            new Developer(
                "img/Back-end_Ph.png",
                "Гений",
                "Фисунов Евгений",
                "Junior Backend",
                (decimal)1.0,
                ["Visual Studio"],
                ["C#"],
                ["MySQL"],
                ["LINQ", "ASP.NET MVC", "Entity Framework"],
                ["GitHub"],
                [
                    new Dictionary<string, string>()
                    {
                        { "link", "https://stepik.org/certificate/a35a0c80acaf1df86e30f05fa5a6a0039b2b6c62.pdf" },
                        { "img", "img/Csh.png" },
                        { "name", "Основы C#" }
                    },
                    new Dictionary<string, string>()
                    {
                        { "link", "https://stepik.org/certificate/fe2d778ba67b59320b4c1d0708148820bfacae16.pdf" },
                        { "img", "img/Sql.png" },
                        { "name", "Основы SQL" }
                    },
                ],
                "Приверженец простой мысли: алгоритмы обработки входящей и исходящей информации являются важнейшей составляющей любого программного продукта. Какой бы красивой не была картинка на экране, но если на пользовательский запрос программа реагирует неверными данными или долгим откликом, то это нерабочая программа."
            ),
            new Developer(
                "img/Front-end_Ph.png",
                "Миллиардер",
                "Евгений Фисунов",
                "Junior Frontend",
                (decimal)1.1,
                ["Visual Studio Code"],
                ["CSS3", "HTML5", "JavaScript (Vanilla)"],
                [],
                ["SASS", "CSS Grid", "CSS Flexbox"],
                ["Figma", "GitHub"],
                [],
                "При разработке визуальной составляющей программного обеспечения опираюсь прежде всего на мысль о том, что большинство информации воспринимается человеком посредством органов зрения. При этом оформление передаваемого материала может влиять на эффективность его усвоения <a href=\"https://docs.yandex.ru/docs/view?tm=1755094808&tld=ru&lang=en&name=05.larson-picard.pdf&text=%D1%8D%D0%BA%D1%81%D0%BF%D0%B5%D1%80%D0%B8%D0%BC%D0%B5%D0%BD%D1%82%20%D0%9A%D0%B5%D0%B2%D0%B8%D0%BD%D0%B0%20%D0%9B%D0%B0%D1%80%D1%81%D0%BE%D0%BD%D0%B0%20%D0%B8%D0%B7%20Microsoft%20%D0%B8%20%D0%A0%D0%BE%D0%B7%D0%B0%D0%BB%D0%B8%D0%BD%D0%B4%D0%B0%20%D0%9F%D0%B8%D0%BA%D0%B0%D1%80%D0%B4&url=https%3A%2F%2Foutgrow.co%2Fblog%2Fwp-content%2Fuploads%2F2018%2F04%2F05.larson-picard.pdf&lr=47&mime=pdf&l10n=ru&sign=63a48bf317494f8b28c9f9cd32258112&keyno=0&serpParams=tm%3D1755094808%26tld%3Dru%26lang%3Den%26name%3D05.larson-picard.pdf%26text%3D%25D1%258D%25D0%25BA%25D1%2581%25D0%25BF%25D0%25B5%25D1%2580%25D0%25B8%25D0%25BC%25D0%25B5%25D0%25BD%25D1%2582%2B%25D0%259A%25D0%25B5%25D0%25B2%25D0%25B8%25D0%25BD%25D0%25B0%2B%25D0%259B%25D0%25B0%25D1%2580%25D1%2581%25D0%25BE%25D0%25BD%25D0%25B0%2B%25D0%25B8%25D0%25B7%2BMicrosoft%2B%25D0%25B8%2B%25D0%25A0%25D0%25BE%25D0%25B7%25D0%25B0%25D0%25BB%25D0%25B8%25D0%25BD%25D0%25B4%25D0%25B0%2B%25D0%259F%25D0%25B8%25D0%25BA%25D0%25B0%25D1%2580%25D0%25B4%26url%3Dhttps%253A%2F%2Foutgrow.co%2Fblog%2Fwp-content%2Fuploads%2F2018%2F04%2F05.larson-picard.pdf%26lr%3D47%26mime%3Dpdf%26l10n%3Dru%26sign%3D63a48bf317494f8b28c9f9cd32258112%26keyno%3D0\">[занятный эксперимент Кевина Ларсона (Microsoft) и Розалинд Пикард (MIT)]</a>.<br>Если же смотреть на процесс создания web-приложения глазами Frontend-разработчика, в отрыве от дизайнерских рассуждений, то множество задач можно решить написанием кода на том же JavaScript (к примеру, разгрузить серверную часть программы переносом некоторых исполняемых алгоритмов на сторону клиента или, как вариант, значительно ускорить выполнение пользовательского запроса с одновременным сокращением сетевого трафика при помощи Fetch API, который позволяет избежать полной перезагрузки страницы)."
            ),
            new Developer(
                "img/Full-stack_Ph.png",
                "Плейбой",
                "Фисунов Евгений Сергеевич",
                "Junior Fullstack",
                (decimal)1.5,
                ["Visual Studio", "Visual Studio Code"],
                ["C#", "CSS3", "HTML5", "JavaScript (Vanilla)"],
                ["MySQL"],
                ["LINQ", "SASS", "CSS Grid", "CSS Flexbox", "ASP.NET MVC", "Entity Framework"],
                ["Figma", "GitHub"],
                [
                    new Dictionary<string, string>()
                    {
                        { "link", "https://stepik.org/certificate/a35a0c80acaf1df86e30f05fa5a6a0039b2b6c62.pdf" },
                        { "img", "img/Csh.png" },
                        { "name", "Основы C#" }
                    },
                    new Dictionary<string, string>()
                    {
                        { "link", "https://stepik.org/certificate/fe2d778ba67b59320b4c1d0708148820bfacae16.pdf" },
                        { "img", "img/Sql.png" },
                        { "name", "Основы SQL" }
                    },
                ],
                "Разработка полноценного web-приложения - задача многогранная, и чем больше этих самых “граней” способен охватить программист, тем ценнее он для рынка."
            )
        ];

        public IList<Developer> GetAll() => _developers;

        public Developer? TryGetById(Guid id)
        {
            return _developers.FirstOrDefault(developer => developer.Id == id);
        }

        public IList<Developer> Sorting(string sortingValue)
        {
            IList<Developer> sortedList = new List<Developer>();
            switch (sortingValue)
            {
                case "priceUp":
                    sortedList = _developers.OrderBy(developer => developer.Price).ToList();
                    break;
                case "priceDown":
                    sortedList = _developers.OrderByDescending(developer => developer.Price).ToList();
                    break;
                case "ratingUp":
                    sortedList = _developers.OrderBy(developer => developer.Rating).ToList();
                    break;
                case "ratingDown":
                    sortedList = _developers.OrderByDescending(developer => developer.Rating).ToList();
                    break;
            }
            return sortedList;
        }
    }
}
