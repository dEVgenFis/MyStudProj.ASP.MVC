"use strict"

function userLogIn() {
    [logOut.parentElement, hamburger, userFavoritesList.parentElement, notificationButton].forEach(item => {
        item.classList.remove("invisible");
    });
    [logIn.parentElement, notificationWelcome].forEach(item => {
        item.classList.add("invisible");
    });
    notificationInfo.innerHTML = `
        <p class="notification__text">
            Вашему вниманию предлагается мини-игра, демонстрирующая возможность разработчика создать на сайте интерактив, вознаграждающий пользователя за пытливость.
        </p><br>
        <p class="notification__text">
            Представьте: Вы - сотрудник некой IT-организации, в которой раз в три года проводится стандартная переаттестация работников на предмет их соответствия занимаемой должности. Настала Ваша очередь.
        </p><br>
        <p class="notification__text">
            Вы были вызваны к своему руководителю: он задаст Вам несколько вопросов, ответы на которые определят Вашу дальнейшую судьбу в компании.
        </p><br>
        <p class="notification__text">
            Важно: право на ошибку у Вас будет, но не более трёх неверных ответов за одну игру.
        </p>
    `;
    greeting.innerHTML = "Hello, User!";
    userAppeal.innerHTML = `Уважаемый(-ая) ${user.firstName}!`;
    notificationWelcomeMobile.textContent = "Скрыть подсказку";
    // убираем правый margin у "logOut"
    logOut.parentElement.insertAdjacentElement("beforebegin", logIn.parentElement);
    ///
    userPageLink.classList.remove("user-page-link__inactive");
    userPageLinkHelpInfo.remove();
    // скрываем панель отзывов о разработчике
    if (feedbackFrame && feedbackFrame.classList.contains("developer-page__feedback-frame-active")) {
        feedbackCloseButton.click();
    }
    ///
    deactivateNotificationFrameMobile(550);
    sortDevListFrame.value = user.sortingDevListValue;
    renderDevelopersList();
}

function renderDevelopersList() {
    fetch(`/home/sorting?sortingValue=${sortDevListFrame.value}`)
    .then(response => {
        if (response.ok) {
            return response.text();
        }
    })
    .then(html => {
        catalog.innerHTML = html;
        let developerInfoButtons = document.querySelectorAll(".developer-card__button"),
            developerStarsList = document.querySelectorAll(".developer-card__rating-list");
        developerStarsList.forEach(list => {
            renderStarsRatingList("catalog", list.id.toString().slice(20), list.dataset.rating);
        });
        developerInfoButtons.forEach(button => {
            button.addEventListener("click", function () {
                fetch(`/developer/index?developerId=${button.id}&screenWidth=${HTMLbody.clientWidth}`)
                .then(response => {
                    return response.text();
                })
                .then(html => {
                    if (html === "Разработчик не найден.") {
                        mainContent.innerHTML = `
                            <div class="developer-page__error">${html}</div>
                        `;
                    } else {
                        mainContent.innerHTML = html;
                        let developerStarsList = document.querySelector(".developer-page__rating-list");
                        renderStarsRatingList("developer-page", developerStarsList.id.toString().slice(27), developerStarsList.dataset.rating);
                        backPathButton = document.querySelector(".developer-page__back-path-button, .developer-page__back-path-link");
                        scrollingElem(window, 0);
                        renderDeveloperPage();
                    }
                });
            });
        });
    });
}

function renderDeveloperPage() {
    let devPage = document.querySelector(".developer-page"),
        developerAboutSelfWrap;
    feedbackUpdateButton.innerText = "Редактировать";
    feedbackDeleteButton.innerText = "Удалить";
    feedbackCreateLink.innerText = "Оставить отзыв";
    feedbackCreateLink.className = "developer-feedback__create-link invisible";
    developerAboutSelfWrap = document.querySelector(".developer-page__about-self");
    feedbackListFrame = document.querySelector(".developer-feedback__feedback-list");
    backPathButton = document.querySelector(".developer-page__back-path-button, .developer-page__back-path-link");
    feedbackOpenButton = HTMLbody.clientWidth < 450 ? document.querySelector(".developer-page__feedback-open-link") : document.querySelector(".developer-page__feedback-open-button");
    backPathButton.addEventListener("click", function () {
        // временно
        homePageLink.click();
        ///
    });
    feedbackOpenButton.addEventListener("click", function () {
        fetch(`/feedback/index`)
        .then(response => {
            if (response.ok) {
                return response.text();
            }
        })
        .then(html => {
            devPage.insertAdjacentHTML('beforeend', html);
            feedbackFrame = document.querySelector(".developer-page__feedback-frame");
            feedbackListFrame = document.querySelector(".developer-feedback__feedback-list");
            feedbackOverlay = document.querySelector(".developer-feedback__overlay");
            feedbackActionsFrame = document.querySelector(".developer-feedback__actions-frame");
            document.querySelector(".developer-feedback__create-link").replaceWith(feedbackCreateLink);
            feedbackSortingFrame = document.querySelector(".developer-feedback__sorting-content");
            sortfeedbackListFrame = document.querySelector(".developer-feedback__sorting-content select");
            if (user) {
                sortfeedbackListFrame.value = user.sortingFdbackListValue;
            }
            feedbackCloseButton = HTMLbody.clientWidth < 450 ? document.querySelector(".developer-feedback__close-link") : document.querySelector(".developer-page__feedback-close-button");
            if (HTMLbody.clientWidth >= 450) {
                feedbackCloseButton.classList.remove("invisible");
                feedbackOpenButton.classList.add("invisible");
                // добавляем класс, по которому будем следить за открытием блока отзывов
                feedbackFrame.classList.add("developer-page__feedback-frame-active");
                // добавляем анимацию к появлению блока отзывов
                feedbackFrame.classList.add("developer-feedback__frame-active");
                // удаляем анимацию после появления блока отзывов
                setTimeout(() => { feedbackFrame.classList.remove("developer-feedback__frame-active") }, 200);
                ///
                devPage.style.rowGap = "3rem";
                developerAboutSelfWrap.classList.add("invisible");
            }
            renderFeedbackList();
            sortfeedbackListFrame.addEventListener("change", function () {
                feedbackListFrame.innerHTML = "";
                updateUserSortingValue("feedbacksList", sortfeedbackListFrame.value);
                renderFeedbackList();
                if (HTMLbody.clientWidth < 450) { amountModal-- }
            });
            feedbackCloseButton.addEventListener("click", function () {
                feedbackFrame.classList.remove("developer-page__feedback-frame-active");
                if (HTMLbody.clientWidth < 450) {
                    amountModal--;
                    deactivateModal(feedbackFrame);
                } else {
                    feedbackOpenButton.classList.remove("invisible");
                    feedbackCloseButton.classList.add("invisible");
                    // добавляем анимацию к сокрытию блока отзывов
                    feedbackFrame.classList.add("developer-feedback__frame-inactive");
                    ///
                    setTimeout(() => {
                        // исправляем баг ("подёргивание" страницы)
                        feedbackFrame.classList.add("invisible");
                        ///
                        deleteFeedbackActionsFrameStyle(feedbackActionsFrame, feedbackSortingFrame, feedbackOverlay);
                        feedbackOverlay.classList.add("invisible");
                        // удаляем анимацию после сокрытия блока отзывов
                        feedbackFrame.classList.remove("developer-feedback__frame-inactive");
                        ///
                        developerAboutSelfWrap.classList.remove("invisible");
                        devPage.removeAttribute("style");
                    }, 100);
                    scrollingElem(window, 0);
                }
                setTimeout(() => { devPage.lastChild.remove() }, 110);
            }, { once: true });
        });
    });
    [feedbackCreateLink, feedbackCreateFixLink, feedbackUpdateButton].forEach(link => {
        link.addEventListener("click", function() {
            feedbackActionsFrame.style.opacity = ".4";
            feedbackOverlay.classList.remove("invisible");
            if (link === feedbackCreateFixLink) {
                // скрываем справочную информацию
                for (let i = 0; i < feedbackListFrame.children.length; i++) {
                    feedbackListFrame.children[i].classList.add("invisible");
                }
                ///
                feedbackListFrame.style.justifyContent = feedbackListFrame.style.alignItems = "";
            } else if (link === feedbackUpdateButton) {
                // убираем излишний "opacity" у элемента "feedbackSortingFrame" (если в списке отзывов всего два отзыва, один из которых принадлежит авторизованному Пользователю)
                if (feedbackList.list.length == 2) {
                    deleteFeedbackActionsFrameStyle(feedbackSortingFrame, feedbackOverlay);
                }
                // скрываем персональный отзыв
                feedbackListFrame.firstChild.classList.add("invisible");
            }
            // меняем символ переноса строк в открытом редакторе текста
            if (link === feedbackUpdateButton && personalFeedback.feedbackText.includes("<br>")) {
                personalFeedback.feedbackText = fixLineBreaks(personalFeedback.feedbackText, "<br>", "\n");
            }
            ///
            feedbackListFrame.insertAdjacentElement("afterbegin", renderFeedback());
            feedbackPersonalText = document.querySelector(".developer-feedback__input-text-frame");
            // незамедлительно фокусируемся на элементе для привязки к нему события "focus"
            setTimeout(() => {feedbackPersonalText.focus()}, 0);
            ///
            feedbackPersonalText.addEventListener("focus", function() {
                this.style.height = "auto";
                this.style.height = `${feedbackPersonalText.scrollHeight}px`;
            });
            feedbackPersonalText.addEventListener("input", function() {
                this.style.height = "auto";
                this.style.height = `${feedbackPersonalText.scrollHeight}px`;
                if (HTMLbody.clientWidth >= 450) {scrollingElem(window, HTMLbody.scrollHeight, 'auto')}
            });
            if (link === feedbackUpdateButton) {
                feedbackSelectedGrade = personalFeedback.feedbackGrade;
                renderStarsRatingList("developer-feedback", user.id, feedbackSelectedGrade);
                feedbackPersonalText.value = personalFeedback.feedbackText;
                // меняем символ переноса строк на HTML-понятный
                if (personalFeedback.feedbackText.includes("\n")) {
                    personalFeedback.feedbackText = fixLineBreaks(personalFeedback.feedbackText, "\n", "<br>");
                }
                ///
            } else {
                renderStarsRatingList("developer-feedback", user.id, 0);
            }
            if (HTMLbody.clientWidth >= 450) {
                if (feedbackList.list.length == 1) {
                    // имеется баг ("подёргивание" страницы)
                    setTimeout(() => {scrollingElem(window, HTMLbody.scrollHeight, 'auto')}, 0);
                } else {
                    scrollingElem(window, HTMLbody.scrollHeight, 'auto');
                }
            }
            // затемняем фон области создания отзыва
            feedbackListFrame.firstChild.classList.add("personal-feedback");
                // получаем список "звёзд"
            let ratingList = document.querySelectorAll(".create-star"),
                // получаем контейнер, содержащий "звёзды"
                ratingListFrame = document.querySelector(".developer-feedback__rating-list"),
                ///
                cancelFeedbackSendLink = document.querySelector(".cancel-feedback-send"),
                acceptFeedbackSendLink = document.querySelector(".accept-feedback-send");
            // обрабатываем события на конкретной "звезде" (тег "li")
            for (let i = 0; i < ratingList.length; i++) {
                ratingList[i].addEventListener("mouseover", function() {
                    // устанавливаем стиль элементу (тег "svg")
                    this.firstChild.style.fill = "rgb(87, 21, 19)";
                    this.firstChild.style.fillOpacity = "1";
                    // устанавливаем стиль предыдущим соседним элементам (тег "svg")
                    let j = 0;
                    while (j < i) {
                        ratingList[j].firstChild.style.fill = "rgb(87, 21, 19)";
                        ratingList[j].firstChild.style.fillOpacity = "1";
                        j++;
                    }
                    ///
                });
                ratingList[i].addEventListener("mouseleave", function(e) {
                    // "e.offsetX" = 0 относительно начала ("this.getBoundingClientRect().left") "звезды" (тег "li")
                    // проверяем направление движения курсора (влево при e.offsetX < 0)
                    if (e.offsetX < 0 && !this.classList.contains("selected")) {
                        // отменяем закрашивание "звезды" (тег "svg")
                        this.firstChild.removeAttribute("style");
                    }
                    // устанавливаем стиль элементу (тег "svg") при редактировании отзыва согласно направлению движения курсора
                    if (e.offsetX < 0 && this.classList.contains("update-selected")) {
                        this.firstChild.style.fill = "#FFFFFF";
                        this.firstChild.style.fillOpacity = "0.45";
                    }
                    ///
                });
                ratingList[i].addEventListener("click", function() {
                    this.classList.add("selected");
                    // устанавливаем оценку отзыву
                    feedbackSelectedGrade = i + 1;
                    // устанавливаем стиль элементу (тег "svg")
                    this.firstChild.style.fill = "rgb(87, 21, 19)";
                    this.firstChild.style.fillOpacity = "1";
                    this.firstChild.style.transform = "scale(1.3)";
                    ///
                    if (this.classList.contains("update-selected")) {
                        this.classList.remove("update-selected");
                    }
                    // устанавливаем стиль предыдущим соседним элементам
                    let j = 0;
                    while (j < i) {
                        // (тег "li")
                        ratingList[j].classList.add("selected");
                        //  (тег "svg")
                        ratingList[j].firstChild.style.fill = "rgb(87, 21, 19)";
                        ratingList[j].firstChild.style.fillOpacity = "1";
                        ratingList[j].firstChild.style.transform = "none";
                        ///
                        if (ratingList[j].classList.contains("update-selected")) {
                            ratingList[j].classList.remove("update-selected");
                        }
                        j++;
                    }
                    // пропускаем элемент события
                    j++;
                    // устанавливаем стиль следующим соседним элементам
                    while (j < ratingList.length) {
                        if (ratingList[j].classList.contains("selected")) {
                            // (тег "li")
                            ratingList[j].classList.remove("selected");
                            // (тег "svg")
                            ratingList[j].firstChild.removeAttribute("style");
                            ///
                        }
                        if (link === feedbackUpdateButton) {
                            // (тег "li") при редактировании отзыва
                            ratingList[j].classList.add("update-selected");
                            // (тег "svg") при редактировании отзыва
                            ratingList[j].firstChild.style.fill = "#FFFFFF";
                            ratingList[j].firstChild.style.fillOpacity = "0.45";
                        }
                        j++;
                    }
                    ///
                });
            }
            ///
            ratingListFrame.addEventListener("mouseleave", function() {
                for (let i = 0; i < this.children.length; i++) {
                    if (this.children[i].firstChild.hasAttribute("style") && !this.children[i].classList.contains("selected")) {
                        this.children[i].firstChild.removeAttribute("style");
                    }
                    if (this.children[i].classList.contains("update-selected")) {
                        this.children[i].firstChild.style.fill = "#FFFFFF";
                        this.children[i].firstChild.style.fillOpacity = "0.45";
                    }
                }
            });
            cancelFeedbackSendLink.addEventListener("click", function() {
                // скрываем область создания отзыва
                feedbackListFrame.children[0].remove();
                // скрываем возможность сортировать отзывы (если в списке отзывов всего два отзыва, один из которых принадлежит авторизованному Пользователю)
                if (link === feedbackUpdateButton && feedbackList.list.length == 2) {
                    deleteFeedbackActionsFrameStyle(feedbackActionsFrame);
                    feedbackOverlay.style.width = feedbackOverlay.style.left = "50%";
                    feedbackSortingFrame.style.opacity = ".4";
                } else {
                    deleteFeedbackActionsFrameStyle(feedbackActionsFrame, feedbackOverlay);
                    feedbackOverlay.classList.add("invisible");
                }
                if (link === feedbackCreateFixLink) {
                    // возвращаем отображение справочной информации
                    for (let i = 0; i < feedbackListFrame.children.length; i++) {
                        feedbackListFrame.children[i].classList.remove("invisible");
                    }
                    ///
                    feedbackListFrame.style.justifyContent = feedbackListFrame.style.alignItems = "center";
                } else {
                    // возвращаем отображение персонального отзыва
                    feedbackListFrame.firstChild.classList.remove("invisible");
                    ///
                    if (HTMLbody.clientWidth >= 450) {
                        if (feedbackList.list.length == 1) {scrollingElem(feedbackListFrame, feedbackListFrame.scrollHeight, 'auto')}
                        scrollingElem(window, HTMLbody.scrollHeight, 'auto');
                    }
                }
                feedbackSelectedGrade = 0;
            });
            acceptFeedbackSendLink.addEventListener("click", function() {
                if (!feedbackSelectedGrade) {
                    let feedbackHelper = document.querySelector(".developer-feedback__feedback-helper");
                    feedbackHelper.classList.remove("invisible");
                    ratingList.forEach(star => {
                        star.style.animation = "feedback-helper-emersion 1s linear";
                    });
                    setTimeout(() => {
                        feedbackHelper.classList.add("invisible");
                        ratingList.forEach(star => {
                            star.removeAttribute("style");
                        });
                    }, 1500);
                } else {
                    deleteFeedbackActionsFrameStyle(feedbackActionsFrame, feedbackOverlay);
                    feedbackOverlay.classList.add("invisible");
                    feedbackCreateLink.classList.add("invisible");
                    // получаем текст отзыва
                    feedbackPersonalText = document.querySelector(".developer-feedback__input-text-frame").value;
                    ///
                    if (feedbackPersonalText.includes("\n")) {
                        feedbackPersonalText = fixLineBreaks(feedbackPersonalText, "\n", "<br>");
                    }
                    if (link === feedbackUpdateButton) {
                        fetch(`feedback/update?developerId=${feedbackList.developerId}&feedbackId=${personalFeedback.id}&grade=${feedbackSelectedGrade}&text=${feedbackPersonalText}&dateTime=${Date.now().toString()}`)
                        .then(responce => {
                            if (responce.ok) {
                                feedbackListFrame.innerHTML = "";
                                renderFeedbackList();
                                fetch(`developer/getrating?developerId=${feedbackList.developerId}`)
                                .then(responce => {
                                    if (responce.ok) {
                                        return responce.text();
                                    }
                                })
                                .then(data => {
                                    updateDeveloperRating("developer-page", feedbackList.developerId, data);
                                });
                            } else {
                                handlingIdentificationError();
                            }
                        });
                    } else {
                        fetch(`feedback/add?developerId=${feedbackList.developerId}&userId=${user.id}&login=${user.login}&feedbackGrade=${feedbackSelectedGrade}&dateTime=${Date.now().toString()}&feedbackText=${feedbackPersonalText}`)
                        .then(responce => {
                            if (responce.ok) {
                                feedbackListFrame.innerHTML = "";
                                renderFeedbackList();
                                fetch(`developer/getrating?developerId=${feedbackList.developerId}`)
                                .then(responce => {
                                    if (responce.ok) {
                                        return responce.text();
                                    }
                                })
                                .then(data => {
                                    updateDeveloperRating("developer-page", feedbackList.developerId, data);
                                });
                            } else {
                                handlingIdentificationError();
                            }
                        });
                    }
                    feedbackSelectedGrade = 0;
                    if (HTMLbody.clientWidth < 450) { amountModal-- }
                }
                feedbackListUpdate = true;
            });
        });
    });
    feedbackDeleteButton.addEventListener("click", function () {
        // создаём модальное окно в JS во избежание многократной привязки событий к элементам окна
        HTMLbody.lastElementChild.insertAdjacentHTML("beforebegin", `
            <div class="feedback-delete-modal">
                <div class="feedback-delete-modal__question">Вы действительно хотите удалить свой отзыв?</div>
                <div class="feedback-delete-modal__buttons">
                    <button class="button feedback-delete-modal__cancel-button">Передумал(а)</button>
                    <button class="button button-denial feedback-delete-modal__accept-button">Не заслужил!</button>
                </div>
            </div>
        `);
        let feedbackDeleteModal = document.querySelector(".feedback-delete-modal");
        amountModal++;
        activateModal(feedbackDeleteModal);
        let feedbackDeleteAcceptButton = document.querySelector(".feedback-delete-modal__accept-button"),
            feedbackDeleteCancelButton = document.querySelector(".feedback-delete-modal__cancel-button");
        feedbackDeleteAcceptButton.addEventListener("click", function() {
            feedbackCreateLink.classList.remove("invisible");
            if (feedbackList.list[0].userId === user.id) {
                let formData = new FormData();
                formData.append("developerId", feedbackList.developerId);
                formData.append("feedbackId", personalFeedback.id);
                fetch(`feedback/delete`, {
                    method: "DELETE",
                    body: formData
                })
                .then(responce => {
                    if (responce.ok) {
                        feedbackListFrame.innerHTML = "";
                        renderFeedbackList();
                        if (HTMLbody.clientWidth < 450) { amountModal-- }
                        deleteFeedbackActionsFrameStyle(feedbackOverlay);
                        feedbackOverlay.classList.add("invisible");
                        personalFeedback = undefined;
                        amountModal--;
                        deactivateModal(feedbackDeleteModal);
                        // удаляем модальное окно со страницы
                        feedbackDeleteModal.remove();
                        ///
                        fetch(`developer/getrating?developerId=${feedbackList.developerId}`)
                        .then(responce => {
                            if (responce.ok) {
                                return responce.text();
                            }
                        })
                        .then(data => {
                            updateDeveloperRating("developer-page", feedbackList.developerId, data);
                        });
                    } else {
                        amountModal--;
                        deactivateModal(feedbackDeleteModal);
                        handlingIdentificationError();
                    }
                });
            } else {
                amountModal--;
                deactivateModal(feedbackDeleteModal);
                handlingIdentificationError();
            }
        });
        feedbackDeleteCancelButton.addEventListener("click", function() {
            amountModal--;
            deactivateModal(feedbackDeleteModal);
            feedbackDeleteModal.remove();
        });
    });
}

function renderFeedback(feedback) {
    let userGameWinnerVisibleClass = feedback?.userGameWinner ? "" : " invisible",
        userImage = !feedback ? user.avatarPath : feedback.userAvatarPath,
        imageFrame = `
            <img class="developer-feedback__user-image" src="${userImage}">
            <img class="developer-feedback__user-game-winner-image${userGameWinnerVisibleClass}" src="icons/Graduate.svg" alt=""></img>
            <div class="developer-feedback__user-game-winner-message">GameWinner!<br>Кол-во попыток:&ensp;<span>${feedback?.userTotalGameAttempts}</span></div>
        `,
        userName = !feedback || user?.id === feedback.userId ? "Ваш отзыв" : `${feedback.userName}`,
        feedbackText = !feedback ? `
            <textarea class="developer-feedback__input-text-frame" placeholder="Введите текст..."></textarea>
        ` : `
            <div class="developer-feedback__user-text">${feedback.feedbackText}</div>
        `,
        userGradeFrame = !feedback ? `
            <span>Ваша оценка:</span>
            <ul class="developer-feedback__rating-list" id="developer-feedback-rating-list-${user.id}">
                <li class="developer-feedback__rating-item create-star"></li>
                <li class="developer-feedback__rating-item create-star"></li>
                <li class="developer-feedback__rating-item create-star"></li>
                <li class="developer-feedback__rating-item create-star"></li>
                <li class="developer-feedback__rating-item create-star"></li>
            </ul>
        ` : `
            <span>Оценка:</span>
            <ul class="developer-feedback__rating-list" id="developer-feedback-rating-list-${feedback.userId}">
                <li class="developer-feedback__rating-item"></li>
                <li class="developer-feedback__rating-item"></li>
                <li class="developer-feedback__rating-item"></li>
                <li class="developer-feedback__rating-item"></li>
                <li class="developer-feedback__rating-item"></li>
            </ul>
        `,
        feedbackHelperFrame = HTMLbody.clientWidth < 450 ? `
            <div class="developer-feedback__feedback-helper invisible">Выберите оценку&ensp;&uarr;</div>
        ` : `
            <div class="developer-feedback__feedback-helper invisible">&larr;&ensp;Выберите оценку</div>
        `,
        feedbackActionsLinksVisibleClass = user?.id === feedback?.userId ? "" : " invisible",
        userActionsFrame = !feedback ? `
            <div class="developer-feedback__user-actions">
                <span class="cancel-feedback-send">Передумал(а)</span>
                <span class="accept-feedback-send">Заслужил!</span>
            </div>
        ` : `
            <div class="developer-feedback__user-actions${feedbackActionsLinksVisibleClass}">
                <span id="update-feedback-user-${feedback.userId}">Редактировать</span>
                <span id="delete-feedback-user-${feedback.userId}">Удалить</span>
            </div>
        `,
        formatDateTime = new Intl.DateTimeFormat(`ru`, {
            minute: "numeric",
            hour: "numeric",
            day: "numeric",
            month: "long",
            year: "numeric"
        }).format(feedback?.dateTime),
        dateTime = !feedback ? "Сейчас" : feedback.feedbackUpdate ? `<span>Отредактирован:</span>&ensp;${formatDateTime}` : formatDateTime,
        feedbackWrap = document.createElement("li");
    feedbackWrap.className = "developer-feedback__feedback-container";
    feedbackWrap.innerHTML = `
        <div class="developer-feedback__user-info">
            ${imageFrame}
            <div class="developer-feedback__user-name">${userName}</div>
        </div>
        <div class="developer-feedback__user-text-grade">
            <div class="developer-feedback__date-time">${dateTime}</div>
            ${feedbackText}
            <div class="developer-feedback__user-grade-actions">
                <div class="developer-feedback__user-grade">
                    ${userGradeFrame}
                </div>
                ${feedbackHelperFrame}
                ${userActionsFrame}
            </div>
        </div>
    `;
    return feedbackWrap;
}

function renderFeedbackList() {
    fetch(`feedback/getall?id=${feedbackOpenButton.id}&sortingValue=${sortfeedbackListFrame.value}`, { signal })
    .then(responce => {
        if (responce.ok) {
            return responce.text();
        } else {
            handlingIdentificationError();
            // прерываем дальнейшее выполнение fetch-запроса
            controller.abort();
        }
    })
    .then(data => {
        feedbackList = JSON.parse(data);
        if (feedbackList.list.length == 0) {
            if (HTMLbody.clientWidth < 450) {
                feedbackSortingFrame.classList.add("invisible");
                if (!feedbackCreateLink.classList.contains("invisible")) { feedbackCreateLink.classList.add("invisible") }
            } else {
                feedbackActionsFrame.classList.add("invisible");
                feedbackListFrame.style.height = "max-content";
            }
            feedbackListFrame.style.justifyContent = feedbackListFrame.style.alignItems = "center";
            feedbackListFrame.style.gap = "0";
            if (user) {
                feedbackListFrame.innerHTML = `
                    <p>Отзывов пока нет.</p>
                    <p>
                        Вы можете&nbsp;<span class="replacement-element">исправить</span>&nbsp;ситуацию...
                    </p>
                `;
                // меняем HTML-элемент на аналогичный с привязанным событием
                let replacementElem = document.querySelector(".replacement-element");
                feedbackCreateFixLink.innerText = "исправить";
                replacementElem.replaceWith(feedbackCreateFixLink);
                ///
            } else {
                feedbackListFrame.innerHTML = `
                    <p>Отзывов пока нет.</p>
                `;
            }
        } else if (feedbackList.list.length == 1) {
            feedbackListFrame.insertAdjacentElement("beforeend", renderFeedback(feedbackList.list[0]));
            renderStarsRatingList("developer-feedback", feedbackList.list[0].userId, feedbackList.list[0].feedbackGrade);
            if (HTMLbody.clientWidth >= 450) {
                feedbackListFrame.style.height = "max-content";
                if (feedbackListFrame.scrollHeight < 550 - 46) { feedbackListFrame.style.justifyContent = "center" }
                if (!user || user?.id === feedbackList.list[0].userId) {
                    feedbackActionsFrame.classList.add("invisible");
                }
            }
            feedbackSortingFrame.classList.add("invisible");
            if (user && user.id != feedbackList.list[0].userId) {
                feedbackCreateLink.classList.remove("invisible");
            } else if (user && user.id === feedbackList.list[0].userId) {
                // затемняем фон персонального отзыва
                feedbackListFrame.firstChild.classList.add("personal-feedback");
            }
            if (user && user.id === feedbackList.list[0].userId) {
                personalFeedback = feedbackList.list[0];
                // меняем HTML-элементы на аналогичные с привязанным событием
                let replacementUpdateElem = document.querySelector(`#update-feedback-user-${feedbackList.list[0].userId}`);
                feedbackUpdateButton.id = `#update-feedback-developer-${feedbackList.list[0].userId}`;
                replacementUpdateElem.replaceWith(feedbackUpdateButton);
                let replacementDeleteElem = document.querySelector(`#delete-feedback-user-${feedbackList.list[0].userId}`);
                feedbackDeleteButton.id = `#delete-feedback-developer-${feedbackList.list[0].userId}`;
                replacementDeleteElem.replaceWith(feedbackDeleteButton);
                ///
            }
        } else {
            if (user) {
                // перемещаем персональный отзыв в начало списка
                let userFeedback;
                for (let i = 0; i < feedbackList.list.length; i++) {
                    if (feedbackList.list[i].userId === user.id) {
                        userFeedback = feedbackList.list[i];
                        feedbackList.list.splice(i, 1);
                        feedbackList.list.splice(0, 0, userFeedback);
                        break;
                    }
                }
                ///
                if (!userFeedback) {
                    feedbackCreateLink.classList.remove("invisible");
                } else {
                    if (feedbackList.list.length == 2) {
                        feedbackSortingFrame.style.opacity = ".4";
                        feedbackOverlay.style.width = feedbackOverlay.style.left = "50%";
                        feedbackOverlay.classList.remove("invisible");
                        feedbackListFrame.removeAttribute("style");
                        if (feedbackSortingFrame.classList.contains("invisible")) {
                            feedbackSortingFrame.classList.remove("invisible");
                        }
                    }
                }
            }
            feedbackList.list.forEach(feedback => {
                feedbackListFrame.insertAdjacentElement("beforeend", renderFeedback(feedback));
                renderStarsRatingList("developer-feedback", feedback.userId, feedback.feedbackGrade);
                if (user && user.id === feedback.userId) {
                    feedbackListFrame.firstChild.classList.add("personal-feedback");
                    personalFeedback = feedback;
                    let replacementUpdateElem = document.querySelector(`#update-feedback-user-${feedback.userId}`);
                    feedbackUpdateButton.id = `#update-feedback-developer-${feedback.userId}`;
                    replacementUpdateElem.replaceWith(feedbackUpdateButton);
                    let replacementDeleteElem = document.querySelector(`#delete-feedback-user-${feedback.userId}`);
                    feedbackDeleteButton.id = `#delete-feedback-developer-${feedback.userId}`;
                    replacementDeleteElem.replaceWith(feedbackDeleteButton);
                }
            });
        }
        if (HTMLbody.clientWidth < 450) {
            amountModal++;
            activateModal(feedbackFrame);
            scrollingElem(window, 0);
        } else {
            if (feedbackListUpdate) {
                scrollingElem(window, HTMLbody.scrollHeight, 'auto');
                feedbackListUpdate = false;
            } else {
                scrollingElem(window, HTMLbody.scrollHeight);
            }
        }
    })
    .catch(error => { console.log("Что-то пошло не так...") });
}

function renderStarsRatingList(container, id, rating) {
    let ratingList = document.querySelector(`#${container}-rating-list-${id}`).children;
    for (let j = 0; j < ratingList.length; j++) {
        let star = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        if (container == "developer-feedback") {
            star.setAttribute("width", `11`);
            star.setAttribute("height", `11`);
            star.innerHTML = `
                <defs>
                    <linearGradient id="${container}-starGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="25%" style="stop-color: rgb(87, 21, 19); stop-opacity: 1" />
                        <stop offset="50%" style="stop-color: rgb(87, 21, 19); stop-opacity: .45" />
                        <stop offset="50%" style="stop-color: rgb(255, 255, 255); stop-opacity: .45" />
                    </linearGradient>
                </defs>
                <path d="M5.5 0L6.73483 3.80041H10.7308L7.49799 6.14919L8.73282 9.94959L5.5 7.60081L2.26718 9.94959L3.50201 6.14919L0.269189 3.80041H4.26517L5.5 0Z" />
            `;
        } else {
            star.setAttribute("width", `19`);
            star.setAttribute("height", `19`);
            star.innerHTML = `
                <defs>
                    <linearGradient id="${container}-starGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="25%" style="stop-color: rgb(87, 21, 19); stop-opacity: 1" />
                        <stop offset="50%" style="stop-color: rgb(87, 21, 19); stop-opacity: .45" />
                        <stop offset="50%" style="stop-color: rgb(255, 255, 255); stop-opacity: .45" />
                    </linearGradient>
                </defs>
                <path d="M10 0L12.1329 6.56434H19.035L13.4511 10.6213L15.584 17.1857L10 13.1287L4.41604 17.1857L6.54892 10.6213L0.964963 6.56434H7.86712L10 0Z" />
            `;
        }
        if (rating >= 1) {
            star.setAttribute("fill", `#571513`);
        } else if (rating > 0 && rating < 1) {
            star.setAttribute("fill", `url(#${container}-starGradient)`);
        } else {
            star.setAttribute("fill", `#FFFFFF`);
            star.setAttribute("fill-opacity", `0.45`);
        }
        if (!ratingList[j].className.includes("grade")) {
            if (container == "developer-page") {
                // исключаем накопление звёзд в теге "li" при вызове метода "updateDeveloperRating"
                ratingList[j].innerText = "";
                ///
            }
            ratingList[j].insertAdjacentElement("beforeend", star);
        }
        if (rating - 1 >= 0) {
            rating--;
        } else {
            rating = 0;
        }
    }
}

function updateDeveloperRating(container, id, rating) {
    renderStarsRatingList(container, id, rating);
    devRatingGradeView = document.querySelector(`#${container}-rating-grade-${id}`);
    devRatingGradeView.innerHTML = `${rating}`;
}

function fixLineBreaks(elem, rule, replacementRule) {
    while (elem.includes(rule)) {
        elem = elem.replace(rule, replacementRule);
    }
    return elem;
}

function deleteFeedbackActionsFrameStyle(...elements) {
    elements.forEach(elem => {
        if (elem.hasAttribute("style")) {
            elem.removeAttribute("style");
        }
    });
}

function scrollingElem(elem, coord, tempo = 'smooth') {
    elem.scrollTo({
        top: coord,
        behavior: tempo
    });
}

function changePositionNotificationHelper() {
    notificationHelperIcon = document.querySelector(".notification__help-icon");
    notificationHelperText = document.querySelector(".notification__help-text");
    userAppeal = document.querySelector(".notification__appeal");
    if (userAppeal && notificationHelperIcon && notificationHelperText) {
        notificationHelperIcon.style.top = userAppeal.offsetTop - 2 + 'px';
        notificationHelperIcon.style.left = userAppeal.offsetLeft - 100 + 'px';
        notificationHelperText.style.top = userAppeal.offsetTop + 30 + 'px';
        notificationHelperText.style.left = userAppeal.offsetLeft - 100 + 'px';
    }
}

function userIdentification() {
    let userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
        user = userData;
        // console.log(user);
        // очищаем хранилище браузера Пользователя через 20 дней после крайнего входа на сайт
        // (1000 * 60) - кол-во миллисекунд в минуте
        // (1000 * 60 * 60) - кол-во миллисекунд в часе
        // (1000 * 60 * 60 * 24) - кол-во миллисекунд в сутках
        let timeLogOut = 1000 * 60 * 60 * 24 * 20;
        // console.log(new Date(Date.now() + timeLogOut));
        setTimeout(() => {
            localStorage.removeItem("user");
        }, timeLogOut);
    }
}

function updateUserSortingValue(list, sortingValue) {
    if (user) {
        let formData = new FormData();
        formData.append("id", user.id);
        formData.append("login", user.login);
        formData.append("list", list);
        formData.append("sortingValue", sortingValue);
        fetch(`/user/updatesortingvalue`, {
            method: "POST",
            body: formData
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                handlingIdentificationError();
            }
        })
        .then(data => {
            // баг (метод "abort()" объекта "controller" не срабатывает)
            if (data) {
                localStorage.setItem("user", JSON.stringify(data));
                userIdentification();
            }
        });
    }
}

function updateUserGameList(gameKey, wrong = false) {
    if (user) {
        let formData = new FormData();
        formData.append("id", user.id);
        formData.append("login", user.login);
        if (wrong) {
            formData.append("wrong", wrong);
        } else {
            formData.append("gameKey", gameKey);
        }
        fetch(`/user/updategamelist`, {
            method: "POST",
            body: formData
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                handlingIdentificationError();
            }
        })
        .then(data => {
            if (data) {
                localStorage.setItem("user", JSON.stringify(data));
                userIdentification();
            }
        });
    }
}

function inputEmptyCheck(input, helper) {
    if (input.value.length == 0) {
        inputDetailsChange(input, helper, "Заполните поле");
        return true;
    }
    return false;
}

function loginInputValidCheck(input, helper) {
    let loginPattern = /^\w+@[A-Za-z]+\.[A-Za-zА-Яа-я]+$/;
    if (!loginPattern.test(input.value)) {
        inputDetailsChange(input, helper, "Не соответствует шаблону");
        return false;
    }
    return true;
}

function userNameInputValidCheck(input, helper) {
    let userNamePattern = /^[A-Za-zА-Яа-я]*$/;
    if (!userNamePattern.test(input.value)) {
        inputDetailsChange(input, helper, "Не соответствует шаблону");
        return false;
    }
    if (input.value.length == 1) {
        inputDetailsChange(input, helper, "Минимум 2 символа");
        return false;
    }
    return true;
}

function passwordsCoherenceCheck(passwordInput, passwordCheckInput, coherenceHelper) {
    if (passwordInput.value != passwordCheckInput.value) {
        [passwordInput, passwordCheckInput].forEach(input => {
            input.classList.add("input-wrong");
            input.oninput = () => {
                coherenceHelper.style.top = "0";
                [passwordInput, passwordCheckInput].forEach(field => {
                    setTimeout(function() {
                        field.classList.remove("input-wrong");
                        coherenceHelper.removeAttribute("style");
                        coherenceHelper.style.left = coherenceHelper != userPasswordCheckCoherenceHelper || HTMLbody.clientWidth >= 450 ? passwordCheckInput.offsetLeft + 'px' : "auto";
                    }, 100);
                });
            }
        });
        coherenceHelper.style.opacity = 1;
        coherenceHelper.style.top = coherenceHelper === userPasswordCheckCoherenceHelper && HTMLbody.clientWidth < 450 ? "-35%" : "-105%";
        return false;
    }
    return true;
}

function inputDetailsChange(input, helper, message, linkClick = false) {
    if (!input.classList.contains("input-wrong")) {
        input.classList.add("input-wrong");
        helper.innerText = message;
        helper.style.opacity = 1;
        helper.style.top = "105%";
    }
    if (linkClick) {
        helper.removeAttribute("style");
        helper.style.left = input.offsetLeft + 'px';
        setTimeout(function() {
            input.classList.remove("input-wrong");
        }, 100);
    }
    input.oninput = () => {
        helper.removeAttribute("style");
        helper.style.left = input.offsetLeft + 'px';
        setTimeout(function() {
            input.classList.remove("input-wrong");
        }, 100);
    }
}

function authorRegHelperChange(input, helper, message, close = false) {
    helper.style.left = input.offsetLeft + 'px';
    if (helper == registrationHelper) {
        input.classList.add("input-wrong");
        helper.style.top = "105%";
    } else {
        helper.style.top = "150%";
    }
    helper.style.opacity = 1;
    helper.innerText = message;
    if (close) {
        helper.innerText = "";
        helper.removeAttribute("style");
        helper.style.left = input.offsetLeft + 'px';
        if (helper == registrationHelper) {
            input.classList.remove("input-wrong");
        }
    }
    [authorizationLoginInput, authorizationPasswordInput, registrationLoginInput].forEach(item => {
        item.oninput = () => {
            helper.innerText = "";
            helper.removeAttribute("style");
            helper.style.left = item.offsetLeft + 'px';
            if (item == registrationLoginInput) {
                setTimeout(function () {
                    item.classList.remove("input-wrong");
                }, 100);
            }
        }
    });
}

function userDetailsFrameChange(link) {
    if (link === userDetailsChangeLink) {
        userDetailsChangeLink.parentElement.classList.add("invisible");
        userDetailsUpdateLink.parentElement.classList.remove("invisible");
        userDetailsList[1].innerHTML = `
            <h3 class="user-details__item-header">Имя</h3>
            <div class="user-details__first-name">
                <input class="user-details__first-name-input" type="text" maxlength="18" placeholder="Введите имя" value="${
                    user.firstName === "User" ? "" : user.firstName
                }">
                <span class="user-details__first-name-pattern">Любая буква</span>
                <span class="user-details__first-name-helper"></span>
            </div>
        `;
        userDetailsList[2].innerHTML = `
            <h3 class="user-details__item-header">Фамилия</h3>
            <div class="user-details__sur-name">
                <input class="user-details__sur-name-input" type="text" maxlength="18" placeholder="Введите фамилию" value="${
                    user.surName === "-" ? "" : user.surName
                }">
                <span class="user-details__sur-name-pattern">Любая буква</span>
                <span class="user-details__sur-name-helper"></span>
            </div>
        `;
    } else {
        userDetailsUpdateLink.parentElement.classList.add("invisible");
        userDetailsChangeLink.parentElement.classList.remove("invisible");
        userDetailsList[1].innerHTML = `
            <h3 class="user-details__item-header">Имя</h3>
            <span class="user-details__first-name">${user.firstName}</span>
        `;
        userDetailsList[2].innerHTML = `
            <h3 class="user-details__item-header">Фамилия</h3>
            <span class="user-details__sur-name">${user.surName}</span>
        `;
    }
}

function deactivateNotificationFrameMobile(notificationFrameDeactivateDelay) {
    setTimeout(function() {
        if (!notificationWelcomeMobile.classList.contains("invisible")) {
            notificationWelcomeMobile.classList.add("invisible");
        }
        if (!notificationButtonMobile.classList.contains("invisible")) {
            notificationButtonMobile.classList.add("invisible");
        }
        if (notificationInfo.classList.contains("notification__info-active")) {
            notificationInfo.classList.remove("notification__info-active");
        }
        if (notificationView.classList.contains("invisible")) {
            notificationView.classList.remove("invisible");
        }
    }, notificationFrameDeactivateDelay);
    if (topSection.classList.contains("home-content__top-section-active")) {
        topSection.classList.remove("home-content__top-section-active");
    }
}

function activateModal(modal) {
     //console.log(amountModal);
    if (amountModal == 1) { HTMLbody.classList.add("scrolling-ban"); }
    if (modal == sidebar) {
        modal.classList.add("sidebar-active");
        setTimeout(function() {
            mainContent.classList.add("modal");
            footer.classList.add("modal");
        }, 100);
        hamburger.children[0].classList.add("hamburger__line-active");
    } else if (modal == feedbackFrame) {
        feedbackFrame.classList.add("developer-page__feedback-frame-active");
    } else {
        HTMLbody.children[0].classList.add("modal");
        modalOverlay.classList.remove("invisible");
        modal.classList.remove("invisible");
    }
}

function deactivateModal(modal) {
     //console.log(amountModal);
    if (amountModal == 0) { HTMLbody.classList.remove("scrolling-ban"); }
    if (modal == sidebar) {
        modal.classList.remove("sidebar-active");
        setTimeout(function() {
            mainContent.classList.remove("modal");
            footer.classList.remove("modal");
        }, 100);
        hamburger.children[0].classList.remove("hamburger__line-active");
    } else if (modal == feedbackFrame) {
        feedbackFrame.classList.remove("developer-page__feedback-frame-active");
    } else {
        HTMLbody.children[0].classList.remove("modal");
        modalOverlay.classList.add("invisible");
        modal.classList.add("invisible");
    }
}

function deactivateAuthorRegFrame() {
    amountModal--;
    deactivateModal(authorRegFrame);
    authorizationFormResetInput.click();
    registrationFormResetInput.click();
    returnAuthorizationFrame();
}

function returnAuthorizationFrame() {
    if (actionsLine.hasAttribute("style")) {
        actionsLine.removeAttribute("style");
        authorizationForm.classList.remove("invisible");
        registrationForm.classList.add("invisible");
        authorizationButton.classList.remove("invisible");
        registrationButton.classList.add("invisible");
    }
}

function resetArray(array) {
	for (let i = 0; i < array.length; i++) {
        array[i] = "";
    }
}

function checkLetterInputs(array) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] == "") {
            return false;
        }
    }
    return true;
}

function showButton(button) {
    button.disabled = false;
    button.classList.remove("button-disabled");
}

function hideButton(button) {
    button.disabled = true;
    button.classList.add("button-disabled");
}

function showGameButtonHelper() {
    switch (randomGameKey) {
        case "destructuring":
            gameHelperText.classList.add("game__helper-text-wrong");
            break;
        case "атомарность":
            gameButtonHelper.classList.remove("invisible");
            break;
        case "drag":
            gameButtonHelper.classList.remove("invisible");
            break;
    }
}

function hideGameButtonHelper() {
    switch (randomGameKey) {
        case "destructuring":
            gameHelperText.classList.remove("game__helper-text-wrong");
            break;
        case "атомарность":
            gameButtonHelper.classList.add("invisible");
            break;
        case "drag":
            gameButtonHelper.classList.add("invisible");
            break;
    }
}

// тестовая функция
function canvasConsoleInfo(maxCoordDif, amountSkewLineAddPoints, coordXSkewLineStep, coordYSkewLineStep) {
    console.log("maxCoordDif: " + maxCoordDif);
    console.log("amountSkewLineAddPoints: " + amountSkewLineAddPoints);
    console.log("coordXStep: " + coordXSkewLineStep);
    console.log("coordYStep: " + coordYSkewLineStep);
}
///

function directionDefine(lineBeginPoint, lineLastPoint) {
    lineDirection = lineBeginPoint.coordX < lineLastPoint.coordX && lineBeginPoint.coordY == lineLastPoint.coordY ? "right" :
    lineBeginPoint.coordX > lineLastPoint.coordX && lineBeginPoint.coordY == lineLastPoint.coordY ? "left" :
    lineBeginPoint.coordX == lineLastPoint.coordX && lineBeginPoint.coordY < lineLastPoint.coordY ? "down" :
    lineBeginPoint.coordX == lineLastPoint.coordX && lineBeginPoint.coordY > lineLastPoint.coordY ? "up" :
    lineBeginPoint.coordX < lineLastPoint.coordX && lineBeginPoint.coordY > lineLastPoint.coordY ? "up-right" :
    lineBeginPoint.coordX > lineLastPoint.coordX && lineBeginPoint.coordY < lineLastPoint.coordY ? "down-left" :
    lineBeginPoint.coordX < lineLastPoint.coordX && lineBeginPoint.coordY < lineLastPoint.coordY ? "down-right" :
    lineBeginPoint.coordX > lineLastPoint.coordX && lineBeginPoint.coordY > lineLastPoint.coordY ? "up-left" : "point";
}

function countSkewLineAddPoints(maxCoordDif) {
    return Math.trunc(maxCoordDif / 4) % 2 == 0 ? Math.trunc(maxCoordDif / 4) + 1 : Math.trunc(maxCoordDif / 4);
}

function lineTargetIntersectionX(pointX, targetLeftBound, targetRightBound) {
    return pointX == targetLeftBound || (pointX > targetLeftBound && pointX < targetRightBound) || pointX == targetRightBound;
}

function lineTargetIntersectionY(pointY, targetTopBound, targetBottomBound) {
    return pointY == targetTopBound || (pointY > targetTopBound && pointY < targetBottomBound) || pointY == targetBottomBound;
}

function clearCanvas(canvas, ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.closePath();
    ctx.beginPath();
}

function drawImageLine() {
    let gradient = imageCtx.createLinearGradient(beginPoint.coordX, beginPoint.coordY, lastPoint.coordX, lastPoint.coordY);
    gradient.addColorStop("0", "rgba(0, 65, 112, 0)");
    gradient.addColorStop("1", "rgba(0, 65, 112, 0.35)");
    if (canvasUserColorSelected) {
        imageCtx.strokeStyle = canvasUserColorSelected;
        imageCtx.lineWidth = 2;
    } else {
        imageCtx.strokeStyle = gradient;
        imageCtx.lineWidth = 3;
    }
    imageCtx.moveTo(beginPoint.coordX, beginPoint.coordY);
    imageCtx.lineTo(lastPoint.coordX, lastPoint.coordY);
    imageCtx.stroke();
    directionDefine(beginPoint, lastPoint);
    // console.log(lineDirection);
    newPoint = {...beginPoint};
    switch (lineDirection) {
        case "right":
            coordY = beginPoint.coordY;
            while (newPoint.coordX < lastPoint.coordX && Math.abs(newPoint.coordX - lastPoint.coordX) > canvasTargetWidth) {
                coordX = newPoint.coordX + canvasTargetWidth;
                newPoint = {...{coordX, coordY}};
                linePointsList.splice(linePointsList.length - 1, 0, newPoint);
            }
            break;
        case "left":
            coordY = beginPoint.coordY;
            while (newPoint.coordX > lastPoint.coordX && Math.abs(newPoint.coordX - lastPoint.coordX) > canvasTargetWidth) {
                coordX = newPoint.coordX - canvasTargetWidth;
                newPoint = {...{coordX, coordY}};
                linePointsList.splice(linePointsList.length - 1, 0, newPoint);
            }
            break;
        case "down":
            coordX = beginPoint.coordX;
            while (newPoint.coordY < lastPoint.coordY && Math.abs(newPoint.coordY - lastPoint.coordY) > canvasTargetHeight) {
                coordY = newPoint.coordY + canvasTargetHeight;
                newPoint = {...{coordX, coordY}};
                linePointsList.splice(linePointsList.length - 1, 0, newPoint);
            }
            break;
        case "up":
            coordX = beginPoint.coordX;
            while (newPoint.coordY > lastPoint.coordY && Math.abs(newPoint.coordY - lastPoint.coordY) > canvasTargetHeight) {
                coordY = newPoint.coordY - canvasTargetHeight;
                newPoint = {...{coordX, coordY}};
                linePointsList.splice(linePointsList.length - 1, 0, newPoint);
            }
            break;
        case "up-right":
            maxCoordDif = Math.max(Math.abs(beginPoint.coordX - lastPoint.coordX), Math.abs(beginPoint.coordY - lastPoint.coordY));
            amountSkewLineAddPoints = countSkewLineAddPoints(maxCoordDif);
            amountSkewLineSegments = amountSkewLineAddPoints + 1;
            coordXSkewLineStep = Math.abs(beginPoint.coordX - lastPoint.coordX) / amountSkewLineSegments;
            coordYSkewLineStep = Math.abs(beginPoint.coordY - lastPoint.coordY) / amountSkewLineSegments;
            // canvasConsoleInfo(maxCoordDif, amountSkewLineAddPoints, coordXSkewLineStep, coordYSkewLineStep);
            while (amountSkewLineAddPoints > 0) {
                coordX = newPoint.coordX + coordXSkewLineStep;
                coordY = newPoint.coordY - coordYSkewLineStep;
                newPoint = {...{coordX, coordY}};
                linePointsList.splice(linePointsList.length - 1, 0, newPoint);
                amountSkewLineAddPoints -= 1;
            }
            break;
        case "down-left":
            maxCoordDif = Math.max(Math.abs(beginPoint.coordX - lastPoint.coordX), Math.abs(beginPoint.coordY - lastPoint.coordY));
            amountSkewLineAddPoints = countSkewLineAddPoints(maxCoordDif);
            amountSkewLineSegments = amountSkewLineAddPoints + 1;
            coordXSkewLineStep = Math.abs(beginPoint.coordX - lastPoint.coordX) / amountSkewLineSegments;
            coordYSkewLineStep = Math.abs(beginPoint.coordY - lastPoint.coordY) / amountSkewLineSegments;
            // canvasConsoleInfo(maxCoordDif, amountSkewLineAddPoints, coordXSkewLineStep, coordYSkewLineStep);
            while (amountSkewLineAddPoints > 0) {
                coordX = newPoint.coordX - coordXSkewLineStep;
                coordY = newPoint.coordY + coordYSkewLineStep;
                newPoint = {...{coordX, coordY}};
                linePointsList.splice(linePointsList.length - 1, 0, newPoint);
                amountSkewLineAddPoints -= 1;
            }
            break;
        case "down-right":
            maxCoordDif = Math.max(Math.abs(beginPoint.coordX - lastPoint.coordX), Math.abs(beginPoint.coordY - lastPoint.coordY));
            amountSkewLineAddPoints = countSkewLineAddPoints(maxCoordDif);
            amountSkewLineSegments = amountSkewLineAddPoints + 1;
            coordXSkewLineStep = Math.abs(beginPoint.coordX - lastPoint.coordX) / amountSkewLineSegments;
            coordYSkewLineStep = Math.abs(beginPoint.coordY - lastPoint.coordY) / amountSkewLineSegments;
            // canvasConsoleInfo(maxCoordDif, amountSkewLineAddPoints, coordXSkewLineStep, coordYSkewLineStep);
            while (amountSkewLineAddPoints > 0) {
                coordX = newPoint.coordX + coordXSkewLineStep;
                coordY = newPoint.coordY + coordYSkewLineStep;
                newPoint = {...{coordX, coordY}};
                linePointsList.splice(linePointsList.length - 1, 0, newPoint);
                amountSkewLineAddPoints -= 1;
            }
            break;
        case "up-left":
            maxCoordDif = Math.max(Math.abs(beginPoint.coordX - lastPoint.coordX), Math.abs(beginPoint.coordY - lastPoint.coordY));
            amountSkewLineAddPoints = countSkewLineAddPoints(maxCoordDif);
            amountSkewLineSegments = amountSkewLineAddPoints + 1;
            coordXSkewLineStep = Math.abs(beginPoint.coordX - lastPoint.coordX) / amountSkewLineSegments;
            coordYSkewLineStep = Math.abs(beginPoint.coordY - lastPoint.coordY) / amountSkewLineSegments;
            // canvasConsoleInfo(maxCoordDif, amountSkewLineAddPoints, coordXSkewLineStep, coordYSkewLineStep);
            while (amountSkewLineAddPoints > 0) {
                coordX = newPoint.coordX - coordXSkewLineStep;
                coordY = newPoint.coordY - coordYSkewLineStep;
                newPoint = {...{coordX, coordY}};
                linePointsList.splice(linePointsList.length - 1, 0, newPoint);
                amountSkewLineAddPoints -= 1;
            }
            break;
    }
    canvasTargetsList.forEach(target => {
        let targetLeftBound = target.getBoundingClientRect().left,
            targetRightBound = target.getBoundingClientRect().left + canvasTargetWidth,
            targetTopBound = target.getBoundingClientRect().top,
            targetBottomBound = target.getBoundingClientRect().top + canvasTargetHeight;
            // console.log("targetLeftBound: " + targetLeftBound + ", targetRightBound: " + targetRightBound + ", targetTopBound: " + targetTopBound + ", targetBottomBound: " + targetBottomBound);
        for (let i = 0; i < linePointsList.length; i++) {
            let pointX = canvasDraft.getBoundingClientRect().left + canvasBorderSize + linePointsList[i].coordX,
                pointY = canvasDraft.getBoundingClientRect().top + canvasBorderSize + linePointsList[i].coordY;
            if (lineTargetIntersectionX(pointX, targetLeftBound, targetRightBound) &&
                lineTargetIntersectionY(pointY, targetTopBound, targetBottomBound)) {
                if (!target.hasAttribute("style")) {
                    target.style.backgroundColor = canvasUserColorSelected ? canvasUserColorSelected : "rgba(0, 65, 112, 0.45)";
                    amountLineTargetIntersection++;
                }
                // console.log("pointX: " + pointX + ", intersection: " + lineTargetIntersectionX(pointX, targetLeftBound, targetRightBound) + ", pointY: " + pointY + ", intersection: " + lineTargetIntersectionY(pointY, targetTopBound, targetBottomBound));
                break;
            }
        }
        // console.log("------------------------------");
    });
    linePointsList.splice(1, linePointsList.length - 2);
    beginPoint = {...lastPoint};
    clearCanvas(canvasDraft, draftCtx);
    canvasLineCount += 1;
    if (canvasLineCount == 4) {
        draw = false;
        canvasDraft.style.zIndex = -1;
        clearInterval(drawImageLineInterval);
        gameHelperLink.classList.add("invisible");
        if (HTMLbody.clientWidth < 450 && window.scrollY < canvasImage.offsetHeight) {
            scrollingElem(window, window.scrollY + canvasImage.offsetHeight);
        }
        stopTimer();
        gameButtons.classList.add("invisible");
        gameDragCanvasConclusion.classList.remove("invisible");
        if (amountLineTargetIntersection == 9) {
            updateUserGameList(randomGameKey);
            gameDragCanvasConclusion.innerHTML = `
                Вы справились. Похвально! Продолжим?
                <button class="button conclusion__drag-canvas-button">Ok</button>
            `;
        } else {
            gameDragCanvasConclusion.innerHTML = `
                Вы не справились. Продолжим?
                <button class="button conclusion__drag-canvas-button">Ok</button>
            `;
            gameConclusion.innerHTML = `
                <div class="conclusion__text-wrapper">Вы не справились.</div>
                <div class="conclusion__game-continuation"></div>
                <button class="button conclusion__button">До встречи!</button>
            `;
            conclusionGameContinuation = document.querySelector(".conclusion__game-continuation");
            conclusionButton = document.querySelector(".conclusion__button");
            // сохраняем "шедевр"
            canvasImage.toBlob(function(blob) {
                let formData = new FormData();
                formData.append("id", user.id);
                formData.append("login", user.login);
                formData.append("canvas", blob, "canvas.png");
                fetch(`/user/savecanvasimage`, {
                    method: "POST",
                    body: formData
                })
                .then(responce => {
                    if (!responce.ok) {
                        handlingIdentificationError();
                    }
                });
            }, "image/png");
            ///
            changeResolution();
        }
        amountLineTargetIntersection = 0;
        conclusionDragCanvasButton = document.querySelector(".conclusion__drag-canvas-button");
        conclusionDragCanvasButton.addEventListener("click", function() {
            gameAction.removeAttribute("style");
            if (user.gamesList.length == 0) {
                changeGameContent();
            } else {
                stampButton.classList.add("invisible");
                gameAnswerButton.classList.remove("invisible");
                gameButtons.classList.remove("invisible");
                gameDragCanvasConclusion.classList.add("invisible");
                generateRandomGame(user.gamesList);
            }
        });
    }
}

function startTimer() {
    canvasTimer--;
    canvasTimerDigit.innerHTML = canvasTimer;
    if (canvasTimer == 0) {canvasTimer = 2;}
}

function stopTimer() {
    clearInterval(canvasTimerInterval);
    clearInterval(canvasClipingInterval);
    canvasTimerDigit.innerHTML = "";
    canvasTimerFigure.classList = ["timer__figure invisible timer__full-cliping"];
}

function clipingTimer() {
    canvasTimerFigure.classList.add(canvasTimerClipingList[canvasClipingIterator]);
    canvasTimerFigure.classList.remove(canvasTimerClipingList[canvasClipingIterator-1]);
    canvasClipingIterator++;
    if (canvasClipingIterator == canvasTimerClipingList.length) {
        canvasTimerDigit.innerHTML = canvasTimer;
        canvasClipingIterator = 1;
    }
}

function dragTimer(event) {
    canvasTimerContent.ondragstart = true;
    if (event.pointerType == "touch") {
        canvasTimerContent.style.left = event.offsetX - 45 + 'px';
        canvasTimerContent.style.top = event.offsetY - 80 + 'px';
    } else {
        canvasTimerContent.style.left = event.offsetX + 55 + 'px';
        canvasTimerContent.style.top = event.offsetY - 45 + 'px';
    }
}

function changeGameContent() {
    gameContent.innerHTML = `
        Вы безупречно справились со всеми заданиями и ответили на все вопросы, доказав тем самым свою профессиональную состоятельность на сегодняшний день.<br><br>Спасибо за уделённое время!
        <button class="button game__button-continuation">До встречи!</button>
    `;
    continuationButton = document.querySelector(".game__button-continuation");
    continuationButton.addEventListener("click", function() {
        gameConclusion.classList.add("invisible");
        gameContent.classList.add("invisible");
        notificationContent.classList.remove("invisible");
        deactivateNotificationFrameMobile(550);
    });
}

function generateRandomGame(gamesList) {
    randomNumber = Math.floor(Math.random() * gamesList.length);
    randomGameKey = gamesList[randomNumber];
    gameAction.innerHTML = "";
    if (gameAction.hasAttribute("style")) {
        gameAction.removeAttribute("style");
    }
    if (gameAnswerButton.classList.contains("invisible")) {
        gameAnswerButton.classList.remove("invisible");
        stampButton.classList.add("invisible");
    }
    hideButton(gameAnswerButton);
    switch (randomGameKey) {
        case "destructuring":
            gameQuestion.innerHTML = `
                Если нам при работе с JS требуется присвоить элементы какой-либо коллекции отдельным переменным с одновременным объявлением последних, мы вправе использовать особый синтаксис присваивания.<br><br>
                <span class="game__question_paragraph">Вопрос:</span> какой термин описывает вышесказанное?<br><br>
                <span class="game__helper-text"><span class="game__question_paragraph">Подсказка:</span> выберите один из вариантов ответов.</span>
            `;
            gameHelperText = document.querySelector(".game__helper-text");
            gameAction.insertAdjacentHTML("afterbegin", `
                <div class="game__answers-list">
                    <div class="game__answer-version">
                        <input type="radio" name="answer" value="restructuring">Реструктуризация
                    </div>
                    <div class="game__answer-version">
                        <input type="radio" name="answer" value="destructuring">Деструктуризация
                    </div>
                    <div class="game__answer-version">
                        <input type="radio" name="answer" value="structuring">Структуризация
                    </div>
                    <div class="game__answer-version">
                        <input type="radio" name="answer" value="bifurcation">Бифуркация
                    </div>
                    <div class="game__answer-version">
                        <input type="radio" name="answer" value="rave">Что за бред? Ничего подобного в JS не существует
                    </div>
                </div>
            `);
            let answerVersionsList = document.querySelectorAll(".game__answer-version"),
                choiceImage = document.createElement("img");
            choiceImage.setAttribute("src", "img/Figure.png");
            choiceImage.classList.add("game__choice-image");
            answerVersionsList.forEach(answerVersion => {
                let inputImage = document.createElement("img");
                inputImage.setAttribute("src", "img/Figure.png");
                inputImage.classList.add("game__input-image");
                answerVersion.insertAdjacentElement("afterbegin", inputImage);
                answerVersion.onclick = () => {
                    answerVersion.children.answer.checked = true;
                    answerVersion.insertAdjacentElement("afterbegin", choiceImage);
                    userGameAnswerWord = answerVersion.children.answer.value;
                    gameAnswerButton.removeEventListener("mouseover", showGameButtonHelper);
                    gameAnswerButton.removeEventListener("mouseout", hideGameButtonHelper);
                    showButton(gameAnswerButton);
                }
            });
            break;
        case "атомарность":
            gameQuestion.innerHTML = `
                Транзакционные системы (особенно банковские) должны соответствовать ряду требований, обеспечивающих надёжную и предсказуемую их работу. Одним из таких требований является невозможность частичного выполнения какой-либо транзакции.<br><br>
                <span class="game__question_paragraph">Вопрос:</span> какой термин описывает вышесказанное?<br><br>
                <span class="game__helper-text"><span class="game__question_paragraph">Важно:</span> ответ должен состоять только из кириллических букв, регистр которых не имеет значения.</span>
            `;
            gameHelperText = document.querySelector(".game__helper-text");
            userGameAnswerWord = [];
            gameButtonHelper.innerText = "Все ячейки для ввода букв должны быть заполнены";
            gameAction.insertAdjacentElement("afterbegin", gameButtonHelper);
            gameAction.insertAdjacentHTML("afterbegin", `
                <form>
                    <div class="game__letters-input-list"></div>
                    <button class="button game__button-form-reset" type="reset">Сбросить</button>
                </form>
            `);
            let lettersInputList = document.querySelector(".game__letters-input-list"),
                letterInput = '<input class="game__letter-input" type="text" maxlength="1">',
                letterInputBorder = 2,  // px
                letterInputPadding = 2,  // px
                lettersList = [],
                letterInputPattern = /[А-Яа-яЁё]/,
                userGameAnswerResetButton = document.querySelector(".game__button-form-reset");
            for (let i = 0; i < randomGameKey.length; i++) {
                lettersInputList.insertAdjacentHTML("beforeend", letterInput);
                userGameAnswerWord[i] = "";
            }
            lettersList = document.querySelectorAll(".game__letter-input");
            lettersList[0].focus();
            for (let i = 0; i < lettersList.length; i++) {
                lettersList[i].oninput = () => {
                    if (letterInputPattern.test(lettersList[i].value) && i < lettersList.length - 1) {
                        lettersList[i + 1].focus();
                    } else if (lettersList[i].value.length > 0 && !letterInputPattern.test(lettersList[i].value)) {
                        gameHelperText.classList.add("game__helper-text-wrong");
                        hideButton(gameAnswerButton);
                    } else if (lettersList[i].value.length == 0) {
                        gameHelperText.classList.remove("game__helper-text-wrong");
                        hideButton(gameAnswerButton);
                    }
                    userGameAnswerWord[i] = letterInputPattern.test(lettersList[i].value) ? lettersList[i].value.toLowerCase() : "";
                    if (checkLetterInputs(userGameAnswerWord)) {
                        showButton(gameAnswerButton);
                        gameAnswerButton.removeEventListener("mouseover", showGameButtonHelper);
                        gameAnswerButton.removeEventListener("mouseout", hideGameButtonHelper);
                    } else {
                        hideButton(gameAnswerButton);
                        gameAnswerButton.addEventListener("mouseover", showGameButtonHelper);
                        gameAnswerButton.addEventListener("mouseout", hideGameButtonHelper);
                    }
                }
                lettersList[i].onblur = () => {
                    if (gameHelperText.classList.contains("game__helper-text-wrong")) {
                        gameHelperText.classList.remove("game__helper-text-wrong");
                    }
                    if (!letterInputPattern.test(lettersList[i].value) && lettersList[i].value.length > 0) {
                        let letterInputBefore = document.createElement("div");
                        letterInputBefore.classList.add("game__letter-input-before");
                        lettersList[i].insertAdjacentElement("beforebegin", letterInputBefore);
                        letterInputBefore.style.left = lettersList[i].offsetLeft + letterInputBorder + letterInputPadding + "px";
                        lettersList[i].style.border = "2px solid #571513";
                        lettersList[i].style.animation = "letter-input-wrong 1s cubic-bezier(1,0,0,1)";
                        setTimeout(() => {lettersList[i].value = ""}, 500);
                        setTimeout(() => {
                            letterInputBefore.style.opacity = 1;
                            letterInputBefore.style.animation = "letter-input-before-scale .3s";
                        }, 750);
                        setTimeout(() => {lettersList[i].removeAttribute("style")}, 800);
                        setTimeout(() => {letterInputBefore.remove()}, 1050);
                    }
                }
            }
            userGameAnswerResetButton.addEventListener("click", function() {
                lettersList[0].focus();
                resetArray(userGameAnswerWord);
                hideButton(gameAnswerButton);
                gameAnswerButton.addEventListener("mouseover", showGameButtonHelper);
                gameAnswerButton.addEventListener("mouseout", hideGameButtonHelper);
            });
            break;
        case "drag":
            gameQuestion.innerHTML = `
                <span class="game__question_paragraph">Задание:</span> за три нажатия соответствующей кнопки Вам необходимо проставить печати на каждой стороне каждого документа (три документа/листа - шесть сторон/страниц - шесть печатей).<br><br>
                <span class="game__helper-link game__helper-link-open">Показать подробности</span><br><br>
                <span class="game__helper-text"><span class="game__question_paragraph">Важно:</span> одновременно на "столе" может быть не более двух документов.</span>
            `;
            gameHelperText = document.querySelector(".game__helper-text");
            gameButtonHelper.innerText = "\"Стол\" не должен быть пустым";
            gameButtonHelper.style.bottom = "-10%";
            gameAction.insertAdjacentElement("afterbegin", gameButtonHelper);
            hideButton(stampButton);
            stampButton.addEventListener("mouseover", showGameButtonHelper);
            stampButton.addEventListener("mouseout", hideGameButtonHelper);
            gameAction.insertAdjacentHTML("afterbegin", `
                <div class="game__folder">
                    <div class="game__target target" id="target-1" draggable="true">
                        <div class="target__side target__side_front">
                            <span class="target__page-number">1</span>
                            <div class="game__stamp invisible">
                                <div class="game__stamp_white-ring">
                                    <div class="game__stamp_inside"></div>
                                </div>
                            </div>
                        </div>
                        <div class="target__side target__side_back rotate-active">
                            <span class="target__page-number">2</span>
                            <div class="game__stamp invisible">
                                <div class="game__stamp_white-ring">
                                    <div class="game__stamp_inside"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="game__target target" id="target-2" draggable="true">
                        <div class="target__side target__side_front">
                            <span class="target__page-number">3</span>
                            <div class="game__stamp invisible">
                                <div class="game__stamp_white-ring">
                                    <div class="game__stamp_inside"></div>
                                </div>
                            </div>
                        </div>
                        <div class="target__side target__side_back rotate-active">
                            <span class="target__page-number">4</span>
                            <div class="game__stamp invisible">
                                <div class="game__stamp_white-ring">
                                    <div class="game__stamp_inside"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="game__target target" id="target-3" draggable="true">
                        <div class="target__side target__side_front">
                            <span class="target__page-number">5</span>
                            <div class="game__stamp invisible">
                                <div class="game__stamp_white-ring">
                                    <div class="game__stamp_inside"></div>
                                </div>
                            </div>
                        </div>
                        <div class="target__side target__side_back rotate-active">
                            <span class="target__page-number">6</span>
                            <div class="game__stamp invisible">
                                <div class="game__stamp_white-ring">
                                    <div class="game__stamp_inside"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="game__table"></div>
            `);
            gameHelperFrame.innerHTML = `
                <span class="game__helper-link game__helper-link-close">Скрыть подробности</span><br><br>
                У Вас есть три документа, каждый из которых состоит из одного листа, на котором на каждой из сторон необходимо проставить печать. Изначально документы находятся в условной "папке", однако для проставления печатей их необходимо переместить на условный "стол". За раз Вы можете проставить печать только на повёрнутой к Вам стороне каждого документа, лежащего не "столе", на котором, в свою очередь, одновременно могут находиться лишь два документа.<br><br>
                <span class="game__question_paragraph">Задание:</span> за три нажатия соответствующей кнопки Вам необходимо проставить печати на каждой стороне каждого документа (три документа/листа - шесть сторон/страниц - шесть печатей).<br><br>
                <span class="game__question_paragraph">Подсказка:</span> для разворота документа кликните по нему, для перетаскивания - зажмите документ и тяните его из "папки" на "стол" и обратно.<br><br>
                <span class="game__question_paragraph">Весомый намёк на решение задачи:</span> "Кто жарил котлеты - тот поймёт..." ;)
            `;
            gameHelperLink = gameQuestion.querySelector(".game__helper-link-open");
            gameHelperCloseLink = gameHelperFrame.querySelector(".game__helper-link-close");
            dragFolder = document.querySelector(".game__folder");
            dragTable = document.querySelector(".game__table");
            amountDragStamps = document.querySelectorAll(".game__stamp").length;
            amountDragClicks = 3;
            let targetsList = document.querySelectorAll(".target"),
                selectedTarget,
                imageDrag = new Image();
            gameAnswerButton.classList.add("invisible");
            stampButton.classList.remove("invisible");
            imageDrag.src = "img/Sheet-drag.png";
            gameHelperLink.addEventListener("click", () => {
                for (let i = 0; i < gameContent.children.length; i++) {
                    if (gameContent.children[i] != gameHelperFrame &&
                        gameContent.children[i] != gameDragCanvasConclusion) {
                        gameContent.children[i].classList.add("modal");
                    }
                    if (i == 2) {
                        gameContent.children[i].style.opacity = 0;
                    }
                }
                gameHelperFrame.classList.remove("invisible");
                setTimeout(() => {
                    gameHelperFrame.style.top = "50%";
                    gameHelperFrame.style.transform = "translateY(-50%) scale(1)";
                }, 0);
            });
            gameHelperCloseLink.addEventListener("click", () => {
                for (let i = 0; i < gameContent.children.length; i++) {
                    if (gameContent.children[i].classList.contains("modal")) {
                        gameContent.children[i].classList.remove("modal");
                    }
                    if (i == 2) {
                        gameContent.children[i].removeAttribute("style");
                    }
                }
                gameHelperFrame.style.opacity = 0;
                gameHelperFrame.style.transform = "scale(.1)";
                gameHelperFrame.style.top = "-10%";
                setTimeout(() => {
                    gameHelperFrame.classList.add("invisible");
                    gameHelperFrame.removeAttribute("style");
                }, 200);
            });
            targetsList.forEach(target => {
                target.ondragstart = (e) => {
                    selectedTarget = target;
                    setTimeout(() => {selectedTarget.style.display = "none"}, 0);
                    e.dataTransfer.setDragImage(imageDrag, e.offsetX, e.offsetY);
                }
                target.ondragend = () => {
                    selectedTarget.removeAttribute("style");
                }
                target.onclick = () => {
                    for (let i = 0; i < target.children.length; i++) {
                        target.children[i].classList.toggle("rotate-active");
                    }
                }
            });
            [dragFolder, dragTable].forEach(elem => elem.addEventListener("dragover", function(e) {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
                elem.classList.add("game__drag-over");
            }));
            [dragFolder, dragTable].forEach(elem => elem.addEventListener("dragleave", function() {
                elem.classList.remove("game__drag-over");
            }));
            [dragFolder, dragTable].forEach(elem => elem.addEventListener("drop", function() {
                switch (elem) {
                    case dragFolder:
                        elem.insertAdjacentElement("afterbegin", selectedTarget);
                        if (dragTable.children.length == 0) {
                            hideButton(stampButton);
                            stampButton.addEventListener("mouseover", showGameButtonHelper);
                            stampButton.addEventListener("mouseout", hideGameButtonHelper);
                        }
                        break;
                    case dragTable:
                        if (elem.children.length == 2 && selectedTarget.parentNode != elem) {
                            gameHelperText.classList.add("game__helper-text-wrong");
                            setTimeout(() => {gameHelperText.classList.remove("game__helper-text-wrong")}, 4000);
                        } else {
                            elem.insertAdjacentElement("afterbegin", selectedTarget);
                            if (elem.children.length == 1) {
                                showButton(stampButton);
                                stampButton.removeEventListener("mouseover", showGameButtonHelper);
                                stampButton.removeEventListener("mouseout", hideGameButtonHelper);
                            }
                        }
                        break;
                }
                elem.classList.remove("game__drag-over");
            }));
            break;
        case "canvas":
            gameQuestion.innerHTML = `
                Перед Вами на экране расположен холст с девятью квадратами.<br><br>
                <span class="game__question_paragraph">Задача:</span> пересечь все квадраты четырьмя прямыми линиями, не отрывая указательного устройства (курсора мыши, стилуса, пальца) от холста.<br><br>
                <span class="game__helper-link game__helper-link-open">Показать подробности</span><br><br>
                <span class="game__helper-text"><span class="game__question_paragraph">Важно:</span> во избежание сброса выполнения задания не рекомендуется выходить за границы холста (за красные линии), а также отпускать указательное устройтсво от поверхности рисования до отображения четырёх линий.</span>
            `;
            gameHelperText = document.querySelector(".game__helper-text");
            gameAction.insertAdjacentHTML("afterbegin", `
                <div class="game__targets-frame">
                    <div class="game__targets-row">
                        <div class="game__canvas-target"></div>
                        <div class="game__canvas-target"></div>
                        <div class="game__canvas-target"></div>
                    </div>
                    <div class="game__targets-row">
                        <div class="game__canvas-target"></div>
                        <div class="game__canvas-target"></div>
                        <div class="game__canvas-target"></div>
                    </div>
                    <div class="game__targets-row">
                        <div class="game__canvas-target"></div>
                        <div class="game__canvas-target"></div>
                        <div class="game__canvas-target"></div>
                    </div>
                </div>
                <canvas id="canvasDraft" width="350" height="350"></canvas>
                <canvas id="canvasImage" width="350" height="350"></canvas>
                <div class="game__timer-content timer">
                    <div class="timer__figure invisible timer__full-cliping"></div>
                    <div class="timer__digit"></div>
                </div>
            `);
            gameHelperFrame.innerHTML = `
                <span class="game__helper-link game__helper-link-close">Скрыть подробности</span><br><br>
                Перед Вами на экране расположен холст с девятью квадратами.<br><br>
                <span class="game__question_paragraph">Задача:</span> пересечь все квадраты четырьмя прямыми линиями, не отрывая указательного устройства (курсора мыши, стилуса, пальца) от холста.<br><br>
                <span class="game__question_paragraph">Подсказка:</span> при соприкосновении указательного устройства с поверхностью холста запускается процесс поочерёдной отрисовки линий, каждая из которых отображается спустя две секунды после отрисовки предыдущей линии (отсчитывать время Вам поможет видимый в процессе выполнения задания таймер).<br><br>
                <span class="game__canvas-color-text">Также, если Вас не устраивает стандартный цвет линий, Вы можете выбрать свой:<input class="image" type="color" id="canvasLineColorInput"></span><br><br>
                <span class="game__question_paragraph">P.S.:</span> при выходе за границы холста могут возникнуть программные ошибки (автономный запуск или ускорение процесса отрисовки линий). В подобной ситуации помогает перезагрузка страницы браузера. Заранее приношу извинения от лица разработчика сайта за возможные доставленные неудобства.
            `;
            gameHelperLink = gameQuestion.querySelector(".game__helper-link-open");
            gameHelperCloseLink = gameHelperFrame.querySelector(".game__helper-link-close");
            canvasDraft = document.querySelector('#canvasDraft');
            draftCtx = canvasDraft.getContext('2d');
            canvasImage = document.querySelector('#canvasImage');
            imageCtx = canvasImage.getContext('2d');
            canvasTimerContent = document.querySelector(".game__timer-content");
            canvasTimerFigure = document.querySelector(".timer__figure");
            canvasTimerDigit = document.querySelector(".timer__digit");
            canvasTargetsList = document.querySelectorAll(".game__canvas-target");
            canvasTargetWidth = document.querySelector(".game__canvas-target").clientWidth;
            canvasTargetHeight = canvasTargetWidth;
            gameAction.style.cssText = `height: ${canvasDraft.clientHeight + canvasBorderSize * 2}px`;
            if (canvasUserColorSelected) {
                canvasUserColorSelected = undefined;
            }
            let canvasLineColorText = document.querySelector(".game__canvas-color-text"),
                lineColorInput = document.querySelector("#canvasLineColorInput"),
                canvasLineColorImage = document.createElementNS("http://www.w3.org/2000/svg", "svg"),
                rightFrameContentSidePadding = 20;  // (px)
            lineColorInput.classList.add("game__canvas-color-image");
            canvasLineColorImage.setAttribute("fill", `rgba(0, 65, 112, 0.45)`);
            canvasLineColorImage.setAttribute("viewBox", `0 0 16 16`);
            canvasLineColorImage.classList.add("game__canvas-color-image");
            canvasLineColorImage.innerHTML = `
                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
            `;
            canvasLineColorText.insertAdjacentElement("beforeend", canvasLineColorImage);
            lineColorInput.style.width = lineColorInput.style.height = canvasLineColorImage.style.width = canvasLineColorImage.style.height = `23px`;
            gameAnswerButton.classList.add("invisible");
            gameHelperLink.addEventListener("click", () => {
                gameHelperFrame.classList.remove("invisible");
                for (let i = 0; i < gameContent.children.length; i++) {
                    if (HTMLbody.clientWidth < 450) {
                        if (gameContent.children[i] != gameHelperFrame &&
                            gameContent.children[i] != gameDragCanvasConclusion) {
                            gameContent.children[i].classList.add("mobile-invisible");
                        }
                        rightFrameContent.style.cssText = `height: ${gameHelperFrame.clientHeight + rightFrameContentSidePadding * 2}px`;
                    } else {
                        if (gameContent.children[i] != gameHelperFrame &&
                            gameContent.children[i] != gameDragCanvasConclusion) {
                            gameContent.children[i].classList.add("modal");
                        }
                        if (i == 2) {
                            gameContent.children[i].style.opacity = 0;
                        }
                    }
                }
                setTimeout(() => {
                    gameHelperFrame.style.top = HTMLbody.clientWidth < 450 ? 0 : "50%";
                    gameHelperFrame.style.transform = HTMLbody.clientWidth < 450 ? "scale(1)" : "translateY(-50%) scale(1)";
                }, 0);
            });
            gameHelperCloseLink.addEventListener("click", () => {
                rightFrameContent.removeAttribute("style");
                for (let i = 0; i < gameContent.children.length; i++) {
                    if (gameContent.children[i].classList.contains("mobile-invisible")) {
                        gameContent.children[i].classList.remove("mobile-invisible");
                    } else {
                        gameContent.children[i].classList.remove("modal");
                    }
                    if (i == 2) {
                        gameContent.children[i].removeAttribute("style");
                    }
                }
                gameHelperFrame.style.opacity = 0;
                gameHelperFrame.style.transform = "scale(.1)";
                gameHelperFrame.style.top = HTMLbody.clientWidth < 450 ? 0 : "-10%";
                setTimeout(() => {
                    gameHelperFrame.classList.add("invisible");
                    gameHelperFrame.removeAttribute("style");
                }, 200);
            });
            lineColorInput.addEventListener("change", function() {
                canvasLineColorImage.setAttribute("fill", lineColorInput.value);
                canvasUserColorSelected = lineColorInput.value;
            });
            canvasDraft.onpointerdown = (e) => {
                draw = true;
                canvasLineCount = 0;
                beginPoint.coordX = lastPoint.coordX = e.offsetX;
                beginPoint.coordY = lastPoint.coordY = e.offsetY;
                draftCtx.moveTo(e.offsetX, e.offsetY);
                drawImageLineInterval = setInterval(drawImageLine, 2000);
                canvasClipingIterator = 1;
                canvasTimer = 2;
                canvasTimerDigit.innerHTML = canvasTimer;
                canvasTimerFigure.classList.remove("invisible");
                canvasTimerInterval = setInterval(startTimer, 1000);
                canvasClipingInterval = setInterval(clipingTimer, 250);
                dragTimer(e);
            }
            canvasDraft.onpointermove = (e) => {
                if (draw) {
                    draftCtx.setLineDash([5, 5]);
                    draftCtx.lineTo(e.offsetX, e.offsetY);
                    draftCtx.stroke();
                    lastPoint.coordX = e.offsetX;
                    lastPoint.coordY = e.offsetY;
                    dragTimer(e);
                }
            }
            canvasDraft.onpointerup = () => {
                draw = false;
                clearInterval(drawImageLineInterval);
                clearCanvas(canvasDraft, draftCtx);
                if (canvasLineCount < 4) {
                    gameHelperText.classList.add("game__helper-text-wrong");
                    clearCanvas(canvasImage, imageCtx);
                    canvasTargetsList.forEach(target => {
                        if (target.hasAttribute("style")) {
                            target.removeAttribute("style");
                        }
                    });
                    amountLineTargetIntersection = 0;
                    setTimeout(() => {gameHelperText.classList.remove("game__helper-text-wrong")}, 4000);
                }
                stopTimer();
            }
            canvasDraft.onpointerout = () => {
                draw = false;
                clearInterval(drawImageLineInterval);
                clearCanvas(canvasDraft, draftCtx);
                if (canvasLineCount < 4) {
                    clearCanvas(canvasImage, imageCtx);
                    canvasTargetsList.forEach(target => {
                        if (target.hasAttribute("style")) {
                            target.removeAttribute("style");
                        }
                    });
                    amountLineTargetIntersection = 0;
                }
                stopTimer();
            }
            break;
    }
    gameAnswerButton.addEventListener("mouseover", showGameButtonHelper);
    gameAnswerButton.addEventListener("mouseout", hideGameButtonHelper);
}

function changeResolution() {
    gameAttempts++;
    let animationDelay = 0;
    switch (gameAttempts) {
        case 1:
            resolutionWord[0].style.animation = "resolution-word-emersion .2s";
            resolutionWord[0].style.opacity = 1;
            resolutionPen.style.left = "40%";
            break;
        case 2:
            if (resolutionWord[0].style.opacity == 0) {
                resolutionWord[0].style.animation = "resolution-word-emersion .2s";
                resolutionWord[0].style.opacity = 1;
                animationDelay = 200;
            }
            resolutionWord[1].style.animation = `resolution-word-emersion .4s .${animationDelay / 2}s`;
            setTimeout(() => {resolutionWord[1].style.opacity = 1}, animationDelay + animationDelay / 2);
            resolutionPen.style.transition = `all .${300 + animationDelay - animationDelay / 4}s`;
            resolutionPen.style.left = "52%";
            break;
        default:
            updateUserGameList(randomGameKey, true);
            if (resolutionWord[1].style.opacity == 0) {
                resolutionWord[1].style.animation = "resolution-word-emersion .4s";
                resolutionWord[1].style.opacity = 1;
                animationDelay = 400;
            }
            resolutionWord[2].style.animation = `resolution-word-emersion 1s .${animationDelay / 2}s`;
            setTimeout(() => {resolutionWord[2].style.opacity = 1}, animationDelay * 2);
            resolutionPen.style.transition = `all .${750 + animationDelay - animationDelay / 2}s`;
            resolutionPen.style.left = "78%";
            setTimeout(() => {
                resolutionPen.style.transition = "all .2s";
                resolutionPen.style.top = "57%";
                resolutionPen.style.left = "67%";
            }, 750 + animationDelay / 2);
            [gameQuestion, gameAction, gameButtons, gameHelperText].forEach(elem => {
                elem.classList.add(HTMLbody.clientWidth < 450 ? "mobile-invisible" : "modal");
            });
            gameAction.style.opacity = 0;
            if (gameConclusion.children.length != 0 && (randomGameKey == "destructuring" || randomGameKey == "атомарность")) {
                conclusionGameContinuation.innerHTML = `
                    И Вы выиграли!<br><br>В качестве награды Вам достаётся свобода...от работы в компании.<br><br>Спасибо за уделённое время!
                `;
                conclusionButton.innerText = "До встречи!";
            } else if (gameConclusion.children.length != 0 && (randomGameKey == "canvas" || randomGameKey == "drag")) {
                conclusionGameContinuation.innerHTML = `
                    И Вы выиграли!<br><br>В качестве награды Вам достаётся свобода...от работы в компании.<br><br>Спасибо за уделённое время!
                `;
                gameDragCanvasConclusion.classList.add("invisible");
            } else {
                gameConclusion.innerHTML = `
                    <div class="conclusion__game-continuation">Вы выиграли!<br><br>В качестве награды Вам достаётся свобода...от работы в компании.<br><br>Спасибо за уделённое время!</div>
                    <button class="button conclusion__button">До встречи!</button>
                `;
            }
            gameConclusion.classList.remove("invisible");
            conclusionButton = document.querySelector(".conclusion__button");
            conclusionButton.addEventListener("click", function() {
                gameConclusion.classList.add("invisible");
                gameConclusion.innerHTML = "";
                [gameQuestion, gameAction, gameButtons, gameHelperText].forEach(elem => {
                    if (elem.classList.contains("mobile-invisible")) {
                        elem.classList.remove("mobile-invisible");
                    } else {
                        elem.classList.remove("modal");
                    }
                });
                gameAction.removeAttribute("style");
                if (gameButtons.classList.contains("invisible")) {
                    gameButtons.classList.remove("invisible");
                }
                gameContent.classList.add("invisible");
                notificationContent.classList.remove("invisible");
                deactivateNotificationFrameMobile(550);
            });
    }
}

function handlingIdentificationError() {
    localStorage.removeItem("user");
    HTMLbody.lastElementChild.insertAdjacentHTML("beforebegin", `
        <div class="error-identification-modal">
            <div class="error-identification-modal__message">Что-то пошло не так...</div>
            <button class="button button-denial error-identification-modal__button">Ok</button>
        </div>
    `);
    let feedbackDeleteModal = document.querySelector(".error-identification-modal");
    amountModal++;
    activateModal(feedbackDeleteModal);
    let errorIdentificationButton = document.querySelector(".error-identification-modal__button");
    setTimeout(() => { errorIdentificationButton.click() }, 5000);
    errorIdentificationButton.onclick = () => {
        location.reload();
    }
}