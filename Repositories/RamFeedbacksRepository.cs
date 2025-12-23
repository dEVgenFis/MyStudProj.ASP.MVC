using My_Stud_Proj.Interfaces;
using My_Stud_Proj.Models;

namespace My_Stud_Proj.Repositories
{
    public class RamFeedbacksRepository : IFeedbacksRepository
    {
        private readonly List<FeedbacksList> _feedbacks = new List<FeedbacksList>();

        // временный метод
        public List<FeedbacksList> Create(Guid developerId, string developerSpec)
        {
            switch (developerSpec)
            {
                case "Junior Backend":
                    _feedbacks.Add(
                        new FeedbacksList(
                            developerId,
                            new List<Feedback>()
                            {
                                new Feedback(
                                    "img/Full-stack_Ph-Full.png",
                                    "Евгений",
                                    true,
                                    1,
                                    Guid.Parse("fa6b33e3-b04f-43b3-8f9e-f68299f92d25"),
                                    3,
                                    "Малый процент серверного кода.",
                                    false,
                                    "1759514749741"
                                )
                            }
                        )
                    );
                    break;
                case "Junior Frontend":
                    _feedbacks.Add(
                        new FeedbacksList(
                            developerId,
                            new List<Feedback>()
                        )
                    );
                    break;
                case "Junior Fullstack":
                    _feedbacks.Add(
                        new FeedbacksList(
                            developerId,
                            new List<Feedback>()
                            {
                                new Feedback(
                                    "img/Avatar.png",
                                    "User",
                                    false,
                                    0,
                                    Guid.Parse("fa6b33e3-b04f-43b3-8f9e-f68299f22d25"),
                                    4,
                                    "Хороший сайт.",
                                    false,
                                    "1759514749740"
                                ),
                                new Feedback(
                                    "img/Avatar.png",
                                    "User",
                                    true,
                                    3,
                                    Guid.Parse("fa6b33e3-b04f-43b3-8f9e-f68299f32d25"),
                                    5,
                                    "Отличное оформление сайта!",
                                    true,
                                    "1559514749742"
                                ),
                                new Feedback(
                                    "img/Avatar.png",
                                    "User",
                                    false,
                                    0,
                                    Guid.Parse("fa6b33e3-b04f-43b3-8f9e-f68299f42d25"),
                                    2,
                                    "",
                                    false,
                                    "1759514749702"
                                ),
                                new Feedback(
                                    "img/Avatar.png",
                                    "User",
                                    true,
                                    2,
                                    Guid.Parse("fa6b33e3-b04f-43b3-8f9e-f68299f52d25"),
                                    5,
                                    "Интересная интерактивная игра (заставила подумать =D ).",
                                    false,
                                    "1259514749742"
                                ),
                                new Feedback(
                                    "img/Full-stack_Ph-Full.png",
                                    "Евгений",
                                    true,
                                    1,
                                    Guid.Parse("fa6b33e3-b04f-43b3-8f9e-f68299f92d25"),
                                    4,
                                    "Неплохо для \"пробы пера\".",
                                    false,
                                    "1959514749742"
                                ),
                                new Feedback(
                                    "img/Avatar.png",
                                    "User",
                                    false,
                                    2,
                                    Guid.Parse("fa6b33e3-b04f-43b3-8f9e-f68299f92d15"),
                                    4,
                                    "",
                                    false,
                                    "1759512749742"
                                ),
                                new Feedback(
                                    "img/Avatar.png",
                                    "User",
                                    false,
                                    0,
                                    Guid.Parse("fa6b33e3-b04f-43b3-8f9e-f68299f92d35"),
                                    1,
                                    "",
                                    false,
                                    "1757514749742"
                                ),
                                new Feedback(
                                    "img/Avatar.png",
                                    "User",
                                    false,
                                    5,
                                    Guid.Parse("fa6b33e3-b04f-43b3-8f9e-f65299f92d25"),
                                    5,
                                    "Молодец!",
                                    false,
                                    "1159514749742"
                                )
                            }
                        )
                    );
                    break;
            }
            return _feedbacks;

        }
        ///

        public FeedbacksList? TryGetFeedbacksListById(Guid id)
        {
            return _feedbacks.FirstOrDefault(feedbackList => feedbackList.DeveloperId == id);
        }

        public string TryGetRatingById(Guid id)
        {
            return _feedbacks.FirstOrDefault(feedbackList => feedbackList.DeveloperId == id).Rating;
        }

        public Feedback? TryGetFeedbackById(Guid id, FeedbacksList feedbackList)
        {
            return feedbackList.List.FirstOrDefault(feedback => feedback.Id == id);
        }

        public IList<Feedback> Sorting(IList<Feedback> list, string sortingValue)
        {
            IList<Feedback> sortedList = new List<Feedback>();
            switch (sortingValue)
            {
                case "dateTimeUp":
                    sortedList = list.OrderBy(feedback => feedback.DateTime).ToList();
                    break;
                case "dateTimeDown":
                    sortedList = list.OrderByDescending(feedback => feedback.DateTime).ToList();
                    break;
                case "ratingUp":
                    sortedList = list.OrderBy(feedback => feedback.FeedbackGrade).ToList();
                    break;
                case "ratingDown":
                    sortedList = list.OrderByDescending(feedback => feedback.FeedbackGrade).ToList();
                    break;
            }
            return sortedList;
        }

        public void Add(FeedbacksList feedbackList, Guid userId, byte feedbackGrade, string feedbackText, string dateTime)
        {
            var newFeedback = new Feedback(userId, feedbackGrade, feedbackText, dateTime);
            feedbackList.List.Insert(0, newFeedback);
        }

        public void Update(Feedback feedback, byte grade, string text, string dateTime)
        {
            feedback.FeedbackGrade = grade;
            feedback.FeedbackText = text is null ? "" : text;
            feedback.DateTime = dateTime;
            feedback.FeedbackUpdate = true;
        }

        public void Delete(FeedbacksList feedbackList, Feedback feedback)
        {
            feedbackList.List.Remove(feedback);
        }
    }
}
