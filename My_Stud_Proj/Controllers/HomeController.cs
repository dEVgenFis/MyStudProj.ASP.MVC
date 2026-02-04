using Microsoft.AspNetCore.Mvc;
using My_Stud_Proj.Helpers;
using My_Stud_Proj.Interfaces;

namespace My_Stud_Proj.Controllers
{
    public class HomeController : Controller
    {
        private readonly IDevelopersRepository _developersRepository;

        private readonly IFeedbacksRepository _feedbacksRepository;

        private readonly MetricsService _metricsService;

        private readonly ILogger<HomeController> _logger;

        public HomeController(IDevelopersRepository developersRepository, IFeedbacksRepository feedbacksRepository, MetricsService metricsService, ILogger<HomeController> logger)
        {
            _developersRepository = developersRepository;
            _feedbacksRepository = feedbacksRepository;
            _metricsService = metricsService;
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult MeasuringMetrics(int screenWidth)
        {
            _metricsService.RecordRequest("Home");
            _metricsService.RecordScreenCategory(screenWidth);

            var userIP = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
            var userAgent = Request.Headers["User-Agent"].ToString();
            // создаем лог-запись
            _logger.LogInformation("Посещение сайта. IP: {ClientIP}, Browser: {Browser}.", userIP, userAgent);
            ///
            return Ok();
        }

        public async Task<IActionResult> Sorting(string sortingValue)
        {
            var developersDb = await _developersRepository.GetAllAsync();
            var developersViewModel = MappingService.MappingToDevelopersViewModelList(developersDb);
            foreach (var developer in developersViewModel)
            {
                var feedbacksDbList = await _feedbacksRepository.TryGetFeedbacksListByIdAsync(developer.Id) ?? await _feedbacksRepository.CreateAsync(developer.Id);
                developer.Rating = MappingService.MappingToFeedbacksViewModelList(feedbacksDbList).Rating;
            }
            return PartialView("_Catalog", SortingService.SortingDevelopersList(developersViewModel, sortingValue));
        }

        public IActionResult Back()
        {
            return PartialView("_Home");
        }
    }
}
