using System.Diagnostics;
using System.Diagnostics.Metrics;

namespace My_Stud_Proj.Helpers
{
    public class MetricsService
    {
        private readonly Counter<long> _requestCounter;

        private readonly Counter<long> _screenCategoreCounter;

        public MetricsService(IMeterFactory meterFactory)
        {
            // создаем "измерительный прибор"
            var meter = meterFactory.Create("MonitoringMetrics");
            // создаем растущие/неизменные "счетчики"
            _requestCounter = meter.CreateCounter<long>("request_home_index_total");
            _screenCategoreCounter = meter.CreateCounter<long>("user_screen_type_total");
        }

        public void RecordRequest(string controller)
        {
            // увеличиваем "счетчик" на единицу у метрики с конкретным набором меток (тегов)
            _requestCounter.Add(1, new TagList { { "controller", controller } });
            // вывод по запросу "localhost:5000/metrics"
            // # TYPE request_home_index_total counter
            // request_home_index_total{otel_scope_name="MonitoringMetrics",controller="название контроллера"} <количество, ед> <временная метка, мс>
        }

        public void RecordScreenCategory(int screenWidth)
        {
            var screenCategory = screenWidth < 450 ? "Mobile" : screenWidth >= 450 && screenWidth < 1525 ? "Tablet" : "Desktop";
            _screenCategoreCounter.Add(1, new TagList { { "device_type", screenCategory } });
        }
    }
}
