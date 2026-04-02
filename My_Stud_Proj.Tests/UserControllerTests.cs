using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Moq;
using My_Stud_Proj.Controllers;
using My_Stud_Proj.Interfaces;
using My_Stud_Proj.Models;

namespace My_Stud_Proj.Tests
{
    public class UserControllerTests
    {
        [Fact]
        public async Task ExistingUserIndexTest()
        {
            // Arrange
            var userMock = new Mock<IUsersRepository>();
            var appEnvironmentMock = new Mock<IWebHostEnvironment>();
            var testUser = new UserDb(
                "Login@something.com",
                "Password",
                "FirstName",
                "RegistrationDate"
            );
            testUser.Id = Guid.NewGuid();
            userMock.Setup(_usersRepository => _usersRepository.TryGetByIdAsync(testUser.Id)).ReturnsAsync(testUser);
            var controller = new UserController(appEnvironmentMock.Object, userMock.Object);

            // Act
            var result = await controller.Index(testUser.Id, testUser.Login);

            // Assert
            var viewResult = Assert.IsType<PartialViewResult>(result);
            var modelResult = Assert.IsType<UserViewModel>(viewResult.Model);
            Assert.Equal(testUser.Id, modelResult.Id);
            Assert.Equal(testUser.Login, modelResult.Login);
            userMock.Verify(_usersRepository => _usersRepository.TryGetByIdAsync(testUser.Id), Times.Once);
        }

        [Fact]
        public async Task NonExistingUserByIdIndexTest()
        {
            // Arrange
            var userMock = new Mock<IUsersRepository>();
            var appEnvironmentMock = new Mock<IWebHostEnvironment>();
            var randomUserGuidId = Guid.NewGuid();
            userMock.Setup(_usersRepository => _usersRepository.TryGetByIdAsync(randomUserGuidId)).ReturnsAsync(null as UserDb);
            var controller = new UserController(appEnvironmentMock.Object, userMock.Object);

            // Act
            var result = await controller.Index(randomUserGuidId, "randomLogin");

            // Assert
            Assert.IsType<NotFoundResult>(result);
            userMock.Verify(_usersRepository => _usersRepository.TryGetByIdAsync(randomUserGuidId), Times.Once);
        }

        [Fact]
        public async Task NonExistingUserByLoginIndexTest()
        {
            // Arrange
            var userMock = new Mock<IUsersRepository>();
            var appEnvironmentMock = new Mock<IWebHostEnvironment>();
            var randomUserLogin = "randomLogin";
            var testUser = new UserDb(
                "Login@something.com",
                "Password",
                "FirstName",
                "RegistrationDate"
            );
            testUser.Id = Guid.NewGuid();
            userMock.Setup(_usersRepository => _usersRepository.TryGetByIdAsync(testUser.Id)).ReturnsAsync(testUser);
            var controller = new UserController(appEnvironmentMock.Object, userMock.Object);

            // Act
            var result = await controller.Index(testUser.Id, randomUserLogin);

            // Assert
            Assert.IsType<NotFoundResult>(result);
            Assert.NotEqual(randomUserLogin, testUser.Login);
            userMock.Verify(_usersRepository => _usersRepository.TryGetByIdAsync(testUser.Id), Times.Once);
        }

        [Fact]
        public async Task ExistingUserAuthorizationTest()
        {
            // Arrange
            var userMock = new Mock<IUsersRepository>();
            var appEnvironmentMock = new Mock<IWebHostEnvironment>();
            var formLogin = "Login@something.com";
            var formPassword = "Password";
            var testUser = new UserDb(
                "Login@something.com",
                "Password",
                "FirstName",
                "RegistrationDate"
            );
            testUser.Id = Guid.NewGuid();
            userMock.Setup(_usersRepository => _usersRepository.TryGetByLoginAsync(formLogin)).ReturnsAsync(testUser);
            var controller = new UserController(appEnvironmentMock.Object, userMock.Object);

            // Act
            var result = await controller.Authorization(formLogin, formPassword);

            // Assert
            var jsonResult = Assert.IsType<JsonResult>(result);
            var modelResult = Assert.IsType<UserViewModel>(jsonResult.Value);
            Assert.Equal(formLogin, testUser.Login);
            Assert.Equal(testUser.Id, modelResult.Id);
            Assert.Equal(testUser.FirstName, modelResult.FirstName);
            userMock.Verify(_usersRepository => _usersRepository.TryGetByLoginAsync(formLogin), Times.Once);
        }

        [Fact]
        public async Task NonExistingUserByLoginAuthorizationTest()
        {
            // Arrange
            var userMock = new Mock<IUsersRepository>();
            var appEnvironmentMock = new Mock<IWebHostEnvironment>();
            var formLogin = "randomLogin";
            userMock.Setup(_usersRepository => _usersRepository.TryGetByLoginAsync(formLogin)).ReturnsAsync(null as UserDb);
            var controller = new UserController(appEnvironmentMock.Object, userMock.Object);

            // Act
            var result = await controller.Authorization(formLogin, "randomPassword");

            // Assert
            var message = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal("Пользователь не найден", message.Value);
            userMock.Verify(_usersRepository => _usersRepository.TryGetByLoginAsync(formLogin), Times.Once);
        }

        [Fact]
        public async Task WrongPasswordUserAuthorizationTest()
        {
            // Arrange
            var userMock = new Mock<IUsersRepository>();
            var appEnvironmentMock = new Mock<IWebHostEnvironment>();
            var formLogin = "Login@something.com";
            var formPassword = "randomPassword";
            var testUser = new UserDb(
                "Login@something.com",
                "Password",
                "FirstName",
                "RegistrationDate"
            );
            userMock.Setup(_usersRepository => _usersRepository.TryGetByLoginAsync(formLogin)).ReturnsAsync(testUser);
            var controller = new UserController(appEnvironmentMock.Object, userMock.Object);

            // Act
            var result = await controller.Authorization(formLogin, formPassword);

            // Assert
            var message = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Неверный пароль", message.Value);
            Assert.NotEqual(formPassword, testUser.Password);
            userMock.Verify(_usersRepository => _usersRepository.TryGetByLoginAsync(formLogin), Times.Once);
        }

        [Fact]
        public async Task NonExistingUserCreateTest()
        {
            // Arrange
            var userMock = new Mock<IUsersRepository>();
            var appEnvironmentMock = new Mock<IWebHostEnvironment>();
            var formLogin = "randomLogin";
            var formPassword = "randomPassword";
            var formName = "FirstName";
            var testUser = new UserDb(
                "Login@something.com",
                "Password",
                "FirstName",
                "RegistrationDate"
            );
            // создаем список из пяти ссылок на один тестовый объект в RAM
            var usersDb = Enumerable.Repeat(testUser, 5).ToList();
            userMock.Setup(_usersRepository => _usersRepository.GetAllAsync()).ReturnsAsync(usersDb);
            userMock.Setup(_usersRepository => _usersRepository.AddAsync(formLogin, formPassword, formName, "RegistrationDate")).ReturnsAsync(new UserDb(
                formLogin,
                formPassword,
                formName,
                "RegistrationDate"
            ));
            var controller = new UserController(appEnvironmentMock.Object, userMock.Object);

            // Act
            var result = await controller.Create(formLogin, formPassword, formName, "RegistrationDate");

            // Assert
            var jsonResult = Assert.IsType<JsonResult>(result);
            var modelResult = Assert.IsType<UserViewModel>(jsonResult.Value);
            Assert.Equal(formLogin, modelResult.Login);
            Assert.Equal(formName, modelResult.FirstName);
        }

        [Fact]
        public async Task ExistingUserCreateTest()
        {
            // Arrange
            var userMock = new Mock<IUsersRepository>();
            var appEnvironmentMock = new Mock<IWebHostEnvironment>();
            var formLogin = "Login@something.com";
            // создаем список из пяти ссылок на разные тестовые объекты в RAM
            var usersDb = Enumerable.Range(0, 5).Select(_ => new UserDb(
                "Login@something.com",
                "Password",
                "FirstName",
                "RegistrationDate"
            ) { Id = Guid.NewGuid() }).ToList();
            userMock.Setup(_usersRepository => _usersRepository.GetAllAsync()).ReturnsAsync(usersDb);
            var controller = new UserController(appEnvironmentMock.Object, userMock.Object);

            // Act
            var result = await controller.Create(formLogin, "randomPassword", "FirstName", "RegistrationDate");

            // Assert
            var message = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Пользователь уже существует", message.Value);
            Assert.Equal(formLogin, usersDb[0].Login);
        }

        [Fact]
        public async Task ExistingUserUpdateInfoTest()
        {
            // Arrange
            var userMock = new Mock<IUsersRepository>();
            var appEnvironmentMock = new Mock<IWebHostEnvironment>();
            var formFirstName = "AnotherFirstName";
            var formSurName = "AnotherSurName";
            var testUser = new UserDb(
                "Login@something.com",
                "Password",
                "FirstName",
                "RegistrationDate"
            );
            testUser.Id = Guid.NewGuid();
            userMock.Setup(_usersRepository => _usersRepository.TryGetByIdAsync(testUser.Id)).ReturnsAsync(testUser);
            userMock.Setup(_usersRepository => _usersRepository.UpdateInfoAsync(testUser, formFirstName, formSurName));
            var controller = new UserController(appEnvironmentMock.Object, userMock.Object);

            // Act
            var result = await controller.UpdateInfo(testUser.Id, testUser.Login, formFirstName, formSurName);

            // Assert
            Assert.IsType<JsonResult>(result);
            userMock.Verify(_usersRepository => _usersRepository.TryGetByIdAsync(testUser.Id), Times.Once);
            userMock.Verify(_usersRepository => _usersRepository.UpdateInfoAsync(testUser, formFirstName, formSurName), Times.Once);
        }

        [Fact]
        public async Task ExistingUserDeleteTest()
        {
            // Arrange
            var userMock = new Mock<IUsersRepository>();
            var appEnvironmentMock = new Mock<IWebHostEnvironment>();
            var formPassword = "Password";
            var testUser = new UserDb(
                "Login@something.com",
                "Password",
                "FirstName",
                "RegistrationDate"
            );
            testUser.Id = Guid.NewGuid();
            userMock.Setup(_usersRepository => _usersRepository.TryGetByIdAsync(testUser.Id)).ReturnsAsync(testUser);
            userMock.Setup(_usersRepository => _usersRepository.DeleteAsync(testUser, appEnvironmentMock.Object));
            var controller = new UserController(appEnvironmentMock.Object, userMock.Object);

            // Act
            var result = await controller.Delete(testUser.Id, testUser.Login, formPassword);

            // Assert
            Assert.IsType<OkResult>(result);
            Assert.Equal(formPassword, testUser.Password);
            userMock.Verify(_usersRepository => _usersRepository.TryGetByIdAsync(testUser.Id), Times.Once);
            userMock.Verify(_usersRepository => _usersRepository.DeleteAsync(testUser, appEnvironmentMock.Object), Times.Once);
        }
    }
}
