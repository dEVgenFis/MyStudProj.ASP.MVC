"use strict"

window.addEventListener("load", function() {
    scrollingElem(window, 0);
    // проверяем авторизацию Пользователя
    userIdentification();
    ///
    if (user) {userLogIn()}
    changePositionNotificationHelper();
    renderDevelopersList();
});

hamburger.addEventListener("click", function() {
    if (window.scrollY != 0) {
        scrollingElem(window, 0);
    }
    if (!hamburger.children[0].classList.contains("hamburger__line-active")) {
        amountModal++;
        activateModal(sidebar);
    } else {
        amountModal--;
        deactivateModal(sidebar);
    }
});

sidebarArrow.addEventListener("click", function() {
    if (window.scrollY != 0) {
        scrollingElem(window, 0);
    }
    sidebarArrow.classList.toggle("sidebar-arrow-active");
    if (navButtons.classList.contains("mobile-nav")) {
        navButtons.classList.remove("mobile-nav");
        navButtons.classList.add("mobile-nav-inactive");
        setTimeout(() => iconsFrame.removeChild(navButtons), 100);
        setTimeout(() => sidebarArrow.parentNode.insertAdjacentElement("beforebegin", logo), 140);
    } else {
        iconsFrame.removeChild(logo);
        sidebarArrow.parentNode.insertAdjacentElement("beforebegin", navButtons);
        if (navButtons.classList.contains("mobile-nav-inactive")) {
            navButtons.classList.remove("mobile-nav-inactive");
        }
        navButtons.classList.add("mobile-nav");
    }
});

notificationView.addEventListener("click", function() {
    notificationView.classList.add("invisible");
    topSection.classList.add("home-content__top-section-active");
    notificationInfo.classList.add("notification__info-active");
    if (user != null) {
        notificationButtonMobile.classList.remove("invisible");
    }
    notificationWelcomeMobile.classList.remove("invisible");
});

notificationWelcomeMobile.addEventListener("click", function() {
    deactivateNotificationFrameMobile(550);
});

homePageLink.addEventListener("click", function () {
    if (!mainContent.children[0].classList.contains("home-content")) {
        fetch(`/home/back`)
        .then(response => {
            if (response.ok) {
                return response.text();
            }
        })
        .then(html => {
            mainContent.innerHTML = html;
            catalog = document.querySelector(".home-content__catalog");
            // сбрасываем привязанные события с некоторых глобальных переменных
            feedbackCreateLink = feedbackCreateLink.cloneNode(feedbackCreateLink);
            feedbackCreateFixLink = feedbackCreateFixLink.cloneNode(feedbackCreateFixLink);
            feedbackUpdateButton = feedbackUpdateButton.cloneNode(feedbackUpdateButton);
            feedbackDeleteButton = feedbackDeleteButton.cloneNode(feedbackDeleteButton);
            // заменяем элементы вновь полученной страницы на изначальные с привязанными событиями
            document.querySelector(".home-content__top-section").replaceWith(topSection);
            document.querySelector(".right-frame").replaceWith(rightFrameContent);
            document.querySelector(".notification").replaceWith(notificationContent);
            document.querySelector(".notification__info-view").replaceWith(notificationView);
            document.querySelector(".notification__info").replaceWith(notificationInfo);
            document.querySelector(".notification__welcome").replaceWith(notificationWelcome);
            document.querySelector(".notification__welcome-mobile").replaceWith(notificationWelcomeMobile);
            document.querySelector(".notification__button").replaceWith(notificationButton);
            document.querySelector(".notification__button-mobile").replaceWith(notificationButtonMobile);
            document.querySelector(".home-content__sorting-frame select").replaceWith(sortDevListFrame);
            ///
            if (user) {
                if (!userAppeal) {
                    userAppeal = document.querySelector(".notification__appeal");
                }
                userAppeal.innerHTML = `Уважаемый(-ая) ${user.firstName}!`;
            }
            changePositionNotificationHelper();
            renderDevelopersList();
        });
        if (HTMLbody.clientWidth < 450) {
            amountModal = 0;
            deactivateModal(sidebar);
        }
    }
});

userComparisonList.addEventListener("click", function(e) {
    amountModal++;
    activateModal(futureInfoModal);
    futureInfoModal.children[0].innerHTML = `
        <span>Список сравнения разработчиков</span> будет представлен в скором времени.<br>
        Спасибо за ожидание!
    `;
});

userCart.addEventListener("click", function(e) {
    amountModal++;
    activateModal(futureInfoModal);
    futureInfoModal.children[0].innerHTML = `
        <span>Корзина</span> будет представлена в скором времени.<br>
        Спасибо за ожидание!
    `;
});

sortDevListFrame.addEventListener("change", function () {
    updateUserSortingValue("developersList", sortDevListFrame.value);
    renderDevelopersList();
});

futureInfoButton.addEventListener("click", function() {
    amountModal--;
    deactivateModal(futureInfoModal);
});