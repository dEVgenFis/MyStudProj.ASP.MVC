using Microsoft.AspNetCore.Mvc;
using Moq;
using My_Stud_Proj.Controllers;
using My_Stud_Proj.Interfaces;
using My_Stud_Proj.Models;

namespace My_Stud_Proj.Tests
{
    public class DeveloperControllerTests
    {
        // тест с одним конкретным значением
        [Fact]
        ///
        public async Task ExistingDeveloperIndexTest()
        {
            // Arrange (блок подготовки входных данных для теста)
            // создаем репозитории-"заглушки"
            var developersMock = new Mock<IDevelopersRepository>();
            var feedbacksMock = new Mock<IFeedbacksRepository>();
            ///
            var randomDeveloperGuidId = Guid.NewGuid();
            var testScreenWidth = 1;
            // настраиваем "ожидаемый" результат работы метода "TryGetByIdAsync()"
            developersMock.Setup(_developersRepository => _developersRepository.TryGetByIdAsync(randomDeveloperGuidId)).ReturnsAsync(new DeveloperDb
            {
                Id = randomDeveloperGuidId,
                РhotoPath = "РhotoPath",
                PhotoText = "PhotoText",
                Name = "Name",
                Spec = "Spec",
                Price = 0.00M,
                ProgramLangString = string.Empty
            });
            // настраиваем "ожидаемый" результат работы метода "TryGetFeedbacksListByIdAsync()"
            feedbacksMock.Setup(_feedbacksRepository => _feedbacksRepository.TryGetFeedbacksListByIdAsync(randomDeveloperGuidId)).ReturnsAsync(new FeedbacksDbList(randomDeveloperGuidId));
            // создаем объект контроллера с репозиториями-"заглушками"
            var controller = new DeveloperController(developersMock.Object, feedbacksMock.Object);

            // Act (блок вызова ключевого метода)
            var result = await controller.Index(randomDeveloperGuidId, testScreenWidth);

            // Assert (блок проверки результата вызова ключевого метода)
            // проверяем объект "result" на соответствие типу "PartialViewResult"
            var viewResult = Assert.IsType<PartialViewResult>(result);
            // проверяем передаваемую в частичное представление модель на соответствие типу "DeveloperViewModel"
            var modelResult = Assert.IsType<DeveloperViewModel>(viewResult.Model);
            // сравниваем переданное в ключевой метод значение со значением свойства результирующего объекта
            Assert.Equal(randomDeveloperGuidId, modelResult.Id);
            // проверяем количество запросов контроллера к репозиториям-"заглушкам" с передачей конкретных значений
            developersMock.Verify(_developersRepository => _developersRepository.TryGetByIdAsync(randomDeveloperGuidId), Times.Once);
            feedbacksMock.Verify(_feedbacksRepository => _feedbacksRepository.TryGetFeedbacksListByIdAsync(randomDeveloperGuidId), Times.Once);
        }

        [Fact]
        public async Task NonExistingDeveloperIndexTest()
        {
            // Arrange
            var developersMock = new Mock<IDevelopersRepository>();
            var feedbacksMock = new Mock<IFeedbacksRepository>();
            var randomDeveloperGuidId = Guid.NewGuid();
            var testScreenWidth = 1;
            developersMock.Setup(_developersRepository => _developersRepository.TryGetByIdAsync(randomDeveloperGuidId)).ReturnsAsync(null as DeveloperDb);
            var controller = new DeveloperController(developersMock.Object, feedbacksMock.Object);

            // Act
            var result = await controller.Index(randomDeveloperGuidId, testScreenWidth);

            // Assert
            var message = Assert.IsType<BadRequestObjectResult>(result);
            // проверяем значение объекта "message" на соответствие ожидаемой фразе
            Assert.Equal("Разработчик не найден.", message.Value);
            ///
            developersMock.Verify(_developersRepository => _developersRepository.TryGetByIdAsync(randomDeveloperGuidId), Times.Once);
            feedbacksMock.Verify(_feedbacksRepository => _feedbacksRepository.TryGetFeedbacksListByIdAsync(randomDeveloperGuidId), Times.Never);
        }
    }
}
