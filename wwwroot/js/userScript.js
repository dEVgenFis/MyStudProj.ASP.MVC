"use strict"

logIn.addEventListener("click", function() {
    amountModal++;
    activateModal(authorRegFrame);
    authorizationLoginHelper.style.left = authorizationLoginInput.offsetLeft + 'px';
    authorizationPasswordHelper.style.left = authorizationPasswordInput.offsetLeft + 'px';
});

logOut.addEventListener("click", function() {
    amountModal++;
    activateModal(logOutModal);
});

logOutAcceptButton.addEventListener("click", function() {
    // очищаем хранилище браузера Пользователя
    localStorage.removeItem("user");
    // перезагружаем вкладку браузера Пользователя во избежание багов
    location.reload();
});

logOutCancelButton.addEventListener("click", function() {
    amountModal--;
    deactivateModal(logOutModal);
});

authorizationLink.addEventListener("click", function() {
    returnAuthorizationFrame();
    authorizationLoginHelper.style.left = authorizationLoginInput.offsetLeft + 'px';
    authorizationPasswordHelper.style.left = authorizationPasswordInput.offsetLeft + 'px';
    inputDetailsChange(registrationLoginInput, registrationLoginHelper, "", true);
    inputDetailsChange(registrationNameInput, registrationNameHelper, "", true);
    inputDetailsChange(registrationPasswordInput, registrationPasswordHelper, "", true);
    inputDetailsChange(registrationPasswordCheckInput, registrationPasswordCheckEmptyHelper, "", true);
    inputDetailsChange(registrationPasswordCheckInput, registrationPasswordCheckCoherenceHelper, "", true);
    registrationFormResetInput.click();
});

authorizationButton.addEventListener("click", function() {
    [authorizationLoginInput, authorizationPasswordInput].forEach(input => {
        input.value = input.value.trim();
    });
    let loginEmpty = inputEmptyCheck(authorizationLoginInput, authorizationLoginHelper),
        passwordEmpty = inputEmptyCheck(authorizationPasswordInput, authorizationPasswordHelper);
    if (!loginEmpty && !passwordEmpty) {
        if (loginInputValidCheck(authorizationLoginInput, authorizationLoginHelper)) {
            let formData = new FormData();
            formData.append("login", authorizationLoginInput.value.toLowerCase());
            formData.append("password", authorizationPasswordInput.value);
            fetch(`/user/authorization`, {
                method: "POST",
                body: formData
            })
            .then(responce => {
                if (responce.ok) {
                    return responce.json();
                } else {
                    return responce.text();
                }
            })
            .then(data => {
                if (typeof(data) != "string") {
                    // сохраняем данные Пользователя в хранилище браузера
                    localStorage.setItem("user", JSON.stringify(data));
                    ///
                    userIdentification();
                    userLogIn();
                    changePositionNotificationHelper();
                    deactivateAuthorRegFrame();
                } else {
                    authorRegHelperChange(authorizationLoginInput, authorizationHelper, data);
                }
            });
        }
    }
});

registrationLink.addEventListener("click", function() {
    if (!actionsLine.hasAttribute("style")) {
        actionsLine.style.transform = "rotateY(180deg)";
        authorizationForm.classList.add("invisible");
        registrationForm.classList.remove("invisible");
        authorizationButton.classList.add("invisible");
        registrationButton.classList.remove("invisible");
        registrationLoginHelper.style.left = registrationLoginInput.offsetLeft + 'px';
        registrationNameHelper.style.left = registrationNameInput.offsetLeft + 'px';
        registrationPasswordHelper.style.left = registrationPasswordInput.offsetLeft + 'px';
        registrationPasswordCheckEmptyHelper.style.left = registrationPasswordCheckInput.offsetLeft + 'px';
        registrationPasswordCheckCoherenceHelper.style.left = registrationPasswordCheckInput.offsetLeft + 'px';
        inputDetailsChange(authorizationLoginInput, authorizationLoginHelper, "", true);
        inputDetailsChange(authorizationPasswordInput, authorizationPasswordHelper, "", true);
        authorRegHelperChange(authorizationLoginInput, authorizationHelper, "", true);
        authorRegHelperChange(registrationLoginInput, registrationHelper, "", true);
        authorizationFormResetInput.click();
    }
});

registrationButton.addEventListener("click", function() {
    [registrationLoginInput, registrationNameInput, registrationPasswordInput, registrationPasswordCheckInput].forEach(input => {
        input.value = input.value.trim();
    });
    let loginEmpty = inputEmptyCheck(registrationLoginInput, registrationLoginHelper),
        passwordEmpty = inputEmptyCheck(registrationPasswordInput, registrationPasswordHelper),
        passwordsCoherenceEmpty = inputEmptyCheck(registrationPasswordCheckInput, registrationPasswordCheckEmptyHelper),
        firstNameValid = userNameInputValidCheck(registrationNameInput, registrationNameHelper);
    if (!loginEmpty && !passwordEmpty && !passwordsCoherenceEmpty) {
        let loginValid = loginInputValidCheck(registrationLoginInput, registrationLoginHelper),
            passwordsCoherence = passwordsCoherenceCheck(registrationPasswordInput, registrationPasswordCheckInput, registrationPasswordCheckCoherenceHelper);
        if (loginValid && firstNameValid && passwordsCoherence) {
            let formData = new FormData();
            formData.append("login", registrationLoginInput.value.toLowerCase());
            formData.append("password", registrationPasswordInput.value);
            formData.append("name", registrationNameInput.value.length > 0 ? registrationNameInput.value[0].toUpperCase() + registrationNameInput.value.slice(1, registrationNameInput.value.length).toLowerCase() : "User");
            formData.append("date", Date.now().toString());
            fetch(`/user/create`, {
                method: "POST",
                body: formData
            })
            .then(responce => {
                if (responce.ok) {
                    return responce.json();
                } else {
                    return responce.text();
                }
            })
            .then(data => {
                if (typeof (data) != "string") {
                    // сохраняем данные Пользователя в хранилище браузера
                    localStorage.setItem("user", JSON.stringify(data));
                    ///
                    userIdentification();
                    userLogIn();
                    changePositionNotificationHelper();
                    deactivateAuthorRegFrame();
                } else {
                    authorRegHelperChange(registrationLoginInput, registrationHelper, data);
                }
            });
        }
    }
});

authorRegFrameClosing.addEventListener("click", function() {
    inputDetailsChange(authorizationLoginInput, authorizationLoginHelper, "", true);
    inputDetailsChange(authorizationPasswordInput, authorizationPasswordHelper, "", true);
    authorRegHelperChange(authorizationLoginInput, authorizationHelper, "", true);
    authorRegHelperChange(registrationLoginInput, registrationHelper, "", true);
    inputDetailsChange(registrationLoginInput, registrationLoginHelper, "", true);
    inputDetailsChange(registrationNameInput, registrationNameHelper, "", true);
    inputDetailsChange(registrationPasswordInput, registrationPasswordHelper, "", true);
    inputDetailsChange(registrationPasswordCheckInput, registrationPasswordCheckEmptyHelper, "", true);
    inputDetailsChange(registrationPasswordCheckInput, registrationPasswordCheckCoherenceHelper, "", true);
    deactivateAuthorRegFrame();
});

userPageLink.addEventListener("click", function() {
    if (!mainContent.children[0].classList.contains("user-page") && user) {
        let formData = new FormData();
        formData.append("id", user.id);
        formData.append("login", user.login);
        fetch(`/user/index`, {
            method: "POST",
            body: formData,
            signal
        })
        .then(response => {
            if (response.ok) {
                return response.text();
            } else {
                handlingIdentificationError();
                // прерываем дальнейшее выполнение fetch-запроса
                controller.abort();
            }
        })
        .then(html => {
            mainContent.innerHTML = html;
            if (user.gameWinner) {
                let gameWinnerMessage = document.querySelector(".user-image__game-winner-message");
                let totalGameAttempts = user.totalGameAttempts;
                while (totalGameAttempts > 100) {
                    totalGameAttempts = totalGameAttempts % 100;
                }
                gameWinnerMessage.innerHTML = `
                Похвально!<br>Вы справились со всеми игровыми заданиями за <span>${user.totalGameAttempts}</span> попыт${
                    11 <= totalGameAttempts && totalGameAttempts <= 14 ? "ок" :
                    totalGameAttempts % 10 == 1 ? "ку" :
                    2 <= totalGameAttempts % 10 && totalGameAttempts % 10 <= 4 ? "ки" : "ок"}!
                `;
            }
            let userImageChangeLink = document.querySelector(".user-image__change-image-link"),
                userImageSaveLink = document.querySelector(".user-image__save-image-link"),
                userImageStandartLink = document.querySelector(".user-image__standart-image-link"),
                userImageCancelLink = document.querySelector(".user-image__cancel-image-link"),
                userImage = document.querySelector(".user-image__image"),
                imageInput = document.querySelector("#image-choice"),
                imageURL,
                userGeolocationLink = document.querySelector(".user-details__geolocation-link"),
                userGeolocationHelperIcon = document.querySelector(".user-details__geolocation-help-icon"),
                userGeolocationHelperText = document.querySelector(".user-details__geolocation-help-text"),
                userPasswordChangeLink = document.querySelector(".user-actions__change-password-link"),
                userDeleteLink = document.querySelector(".user-actions__delete-user-link");
            userDetailsChangeLink = document.querySelector(".user-actions__change-details-link"),
            userDetailsList = document.querySelectorAll(".user-details__list li"),
            userDetailsUpdateLink = document.querySelector(".user-actions__update-details-link");
            userImageChangeLink.addEventListener("click", function () {
                imageInput.click();
                imageInput.addEventListener("change", function () {
                    if (imageInput.files[0]) {
                        imageURL = URL.createObjectURL(imageInput.files[0]);
                        userImage.setAttribute("src", imageURL);
                    }
                }, { once: true });
                userImageChangeLink.hidden = true;
                userImageSaveLink.hidden = userImageCancelLink.hidden = false;
                if (!userImage.src.includes("img/Avatar.png")) {
                    userImageStandartLink.hidden = false;
                }
            });
            userImageSaveLink.addEventListener("click", function () {
                formData = new FormData();
                if (imageInput.files[0]) {
                    formData.append("id", user.id);
                    formData.append("login", user.login);
                    formData.append("avatar", imageInput.files[0]);
                    fetch(`/user/updateimage`, {
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
                            userImage.setAttribute("src", user.image);
                            URL.revokeObjectURL(imageURL);
                        }
                    });
                }
                userImageChangeLink.hidden = false;
                userImageSaveLink.hidden = userImageCancelLink.hidden = userImageStandartLink.hidden = true;
            });
            userImageCancelLink.addEventListener("click", function () {
                userImage.setAttribute("src", user.image);
                userImageChangeLink.hidden = false;
                userImageSaveLink.hidden = userImageCancelLink.hidden = userImageStandartLink.hidden = true;
                imageInput.value = "";
                URL.revokeObjectURL(imageURL);
            });
            userImageStandartLink.addEventListener("click", function () {
                formData = new FormData();
                formData.append("id", user.id);
                formData.append("login", user.login);
                fetch(`/user/updateimage`, {
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
                        userImage.setAttribute("src", user.image);
                        URL.revokeObjectURL(imageURL);
                    }
                });
                userImageChangeLink.hidden = false;
                userImageSaveLink.hidden = userImageCancelLink.hidden = userImageStandartLink.hidden = true;
            });
            userGeolocationLink.addEventListener("click", function () {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function (position) {
                        let { latitude } = position.coords,   // 53.203772
                            { longitude } = position.coords;  // 50.1606382
                        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
                        .then(response => {
                            if (response.ok) {
                                return response.json();
                            }
                        })
                        .then(data => {
                            let geoPosition = {
                                country: data.address.country,
                                city: data.address.city
                            };
                            if (user.geolocation.country != data.address.country && user.geolocation.city != data.address.city) {
                                formData = new FormData();
                                formData.append("id", user.id);
                                formData.append("login", user.login);
                                formData.append("geoPosition", JSON.stringify(geoPosition));
                                fetch(`/user/updategeoposition`, {
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
                                        userGeolocationHelperText.innerHTML = `
                                            <p><span>Страна:</span>&emsp;${user.geolocation.country}</p><p><span>Город:</span>&emsp;${user.geolocation.city}</p>
                                        `;
                                        if (!userGeolocationHelperText.classList.contains("user-details__geolocation-house-text")) {
                                            userGeolocationHelperText.classList.add("user-details__geolocation-house-text");
                                        }
                                        if (!userGeolocationHelperIcon.classList.contains("user-details__geolocation-house-icon")) {
                                            userGeolocationHelperIcon.innerHTML = "";
                                            userGeolocationHelperIcon.classList.add("user-details__geolocation-house-icon");
                                        }
                                    }
                                });
                            }
                        });
                    }, function () { alert("Вы не предоставили доступ к своему местоположению.") }, { enableHighAccuracy: true });
                }
            });
            userDetailsChangeLink.addEventListener("click", function () {
                userDetailsFrameChange(userDetailsChangeLink);
            });
            userDetailsUpdateLink.addEventListener("click", function () {
                let userDetailsFirstNameInput = document.querySelector(".user-details__first-name-input"),
                    userDetailsFirstNameHelper = document.querySelector(".user-details__first-name-helper"),
                    firstNameValid = userNameInputValidCheck(userDetailsFirstNameInput, userDetailsFirstNameHelper),
                    userDetailsSurNameInput = document.querySelector(".user-details__sur-name-input"),
                    userDetailsSurNameHelper = document.querySelector(".user-details__sur-name-helper"),
                    surNameValid = userNameInputValidCheck(userDetailsSurNameInput, userDetailsSurNameHelper);
                userDetailsFirstNameHelper.style.left = userDetailsFirstNameInput.offsetLeft + 'px';
                userDetailsSurNameHelper.style.left = userDetailsSurNameInput.offsetLeft + 'px';
                [userDetailsFirstNameInput, userDetailsSurNameInput].forEach(input => {
                    input.value = input.value.trim();
                });
                if (userDetailsFirstNameInput.value != user.firstName || userDetailsSurNameInput.value != user.surName) {
                    if (firstNameValid && surNameValid) {
                        formData = new FormData();
                        formData.append("id", user.id);
                        formData.append("login", user.login);
                        formData.append("firstName", userDetailsFirstNameInput.value.length > 0 ? userDetailsFirstNameInput.value[0].toUpperCase() + userDetailsFirstNameInput.value.slice(1, userDetailsFirstNameInput.value.length).toLowerCase() : "User");
                        formData.append("surName", userDetailsSurNameInput.value.length > 0 ? userDetailsSurNameInput.value[0].toUpperCase() + userDetailsSurNameInput.value.slice(1, userDetailsSurNameInput.value.length).toLowerCase() : "-");
                        fetch(`/user/updateinfo`, {
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
                                userDetailsFrameChange(userDetailsUpdateLink);
                            }
                        });
                    }
                } else {
                    userDetailsFrameChange(userDetailsUpdateLink);
                }
            });
            userPasswordChangeLink.addEventListener("click", function () {
                amountModal++;
                activateModal(userPasswordChangeModal);
                userOldPasswordInput.focus();
            });
            userDeleteLink.addEventListener("click", function () {
                amountModal++;
                activateModal(userDeleteModal);
                userDeletePasswordInput.focus();
            });
        })
        .catch(error => { console.log("Что-то пошло не так...") });
        if (HTMLbody.clientWidth < 450) {
            amountModal = 0;
            deactivateModal(sidebar);
        }
    }
});

userFavoritesList.addEventListener("click", function () {
    if (user) {
        amountModal++;
        activateModal(futureInfoModal);
        futureInfoModal.children[0].innerHTML = `
            <span>Список избранных разработчиков</span> будет представлен в скором времени.<br>
            Спасибо за ожидание!
        `;
    }
});

userOldPasswordInput.addEventListener("input", function () {
    if (user && userOldPasswordInput.value.length != 0) {
        userOldPasswordHelper.style.left = userOldPasswordInput.offsetLeft + 'px';
        let formData = new FormData();
        formData.append("id", user.id);
        formData.append("login", user.login);
        formData.append("passwordPart", userOldPasswordInput.value);
        fetch(`/user/checkpassword`, {
            method: "POST",
            body: formData
        })
        .then(responce => {
            if (responce.ok) {
                return responce.text();
            } else {
                deactivateModal(userPasswordChangeModal);
                handlingIdentificationError();
            }
        })
        .then(message => {
            switch (message) {
                case "Неверный пароль":
                    inputDetailsChange(userOldPasswordInput, userOldPasswordHelper, message);
                    break;
                case "Верный пароль":
                    userOldPasswordInput.disabled = true;
                    userNewPasswordInput.disabled = userPasswordCheckInput.disabled = false;
                    showButton(userPasswordChangeAcceptButton);
                    break;
            }
        });
    }
});

userPasswordChangeAcceptButton.addEventListener("click", function () {
    if (user) {
        userNewPasswordHelper.style.left = userNewPasswordInput.offsetLeft + 'px';
        userPasswordCheckEmptyHelper.style.left = userPasswordCheckInput.offsetLeft + 'px';
        userPasswordCheckCoherenceHelper.style.left = HTMLbody.clientWidth >= 450 ? userPasswordCheckInput.offsetLeft + 'px' : "auto";
        let newPasswordEmpty = inputEmptyCheck(userNewPasswordInput, userNewPasswordHelper),
            checkPasswordEmpty = inputEmptyCheck(userPasswordCheckInput, userPasswordCheckEmptyHelper);
        if (!newPasswordEmpty && !checkPasswordEmpty &&
            passwordsCoherenceCheck(userNewPasswordInput, userPasswordCheckInput, userPasswordCheckCoherenceHelper)) {
            let formData = new FormData();
            formData.append("id", user.id);
            formData.append("login", user.login);
            formData.append("newPassword", userNewPasswordInput.value);
            fetch(`/user/updatepassword`, {
                method: "POST",
                body: formData
            })
            .then(responce => {
                if (responce.ok) {
                    userOldPasswordInput.disabled = false;
                    userNewPasswordInput.disabled = userPasswordCheckInput.disabled = true;
                    hideButton(userPasswordChangeAcceptButton);
                    userPasswordChangeFormResetInput.click();
                    amountModal--;
                    deactivateModal(userPasswordChangeModal);
                    alert("Пароль успешно изменён. Постарайтесь его не забыть!");
                } else {
                    deactivateModal(userPasswordChangeModal);
                    handlingIdentificationError();
                }
            });
        }
    }
});

userPasswordChangeCancelButton.addEventListener("click", function () {
    if (user) {
        inputDetailsChange(userOldPasswordInput, userOldPasswordHelper, "", true);
        inputDetailsChange(userNewPasswordInput, userNewPasswordHelper, "", true);
        inputDetailsChange(userPasswordCheckInput, userPasswordCheckEmptyHelper, "", true);
        inputDetailsChange(userPasswordCheckInput, userPasswordCheckCoherenceHelper, "", true);
        userPasswordChangeFormResetInput.click();
        amountModal--;
        deactivateModal(userPasswordChangeModal);
        userOldPasswordInput.disabled = false;
        userNewPasswordInput.disabled = userPasswordCheckInput.disabled = true;
        hideButton(userPasswordChangeAcceptButton);
    }
});

userDeleteAcceptButton.addEventListener("mouseover", function () {
    if (HTMLbody.clientWidth >= 450) {
        let minPos = -25, maxPos = 75;
        userDeleteAcceptButton.style.position = "absolute";
        userDeleteAcceptButton.style.top = Math.floor(Math.random() * (maxPos - minPos + 1)) + minPos + "px";
        userDeleteAcceptButton.style.left = Math.floor(Math.random() * (maxPos - minPos + 1)) + minPos + "px";
    }
});

userDeleteAcceptButton.addEventListener("click", function () {
    if (user) {
        userDeletePasswordHelper.style.left = userDeletePasswordInput.offsetLeft + 'px';
        let passwordEmpty = inputEmptyCheck(userDeletePasswordInput, userDeletePasswordHelper);
        if (!passwordEmpty) {
            let formData = new FormData();
            formData.append("id", user.id);
            formData.append("login", user.login);
            formData.append("password", userDeletePasswordInput.value);
            fetch(`/user/delete`, {
                method: "DELETE",
                body: formData
            })
            .then(responce => {
                if (responce.ok) {
                    localStorage.removeItem("user");
                    // отменяем изменение данных Пользователя
                    userDetailsFrameChange(userDeleteAcceptButton);
                    // очищаем поле ввода пароля
                    userDeleteFormResetInput.click();
                    // возвращаем кнопку "на место"
                    userDeleteAcceptButton.removeAttribute("style");
                    // изменяем модальное окно перед перезагрузкой страницы
                    [userDeleteAcceptButton, userDeleteCancelButton].forEach(button => {
                        button.classList.add("invisible");
                    });
                    userDeleteCloseButton.classList.remove("invisible");
                    userDeleteModal.children[0].innerHTML = `
                        Ваша учётная запись&nbsp;<span>удалена</span>.<br>
                        Спасибо за уделённое время!
                    `;
                    userDeleteModal.children[0].style.cssText = `
                        padding: 2.5rem 3.5rem;
                        background: url(img/Background.png) center/100% 100% no-repeat;
                        font-size: 1.5rem;
                    `;
                    // скрываем форму ввода пароля
                    userDeleteModal.children[1].classList.add("invisible");
                    ///
                    setTimeout(() => { userDeleteCloseButton.click() }, 5000);
                } else if (responce.status === 404) {
                    deactivateModal(userDeleteModal);
                    handlingIdentificationError();
                } else {
                    inputDetailsChange(userDeletePasswordInput, userDeletePasswordHelper, "Неверный пароль");
                }
            });
        }
    }
});

userDeleteCancelButton.addEventListener("click", function () {
    if (user) {
        inputDetailsChange(userDeletePasswordInput, userDeletePasswordHelper, "", true);
        userDeleteFormResetInput.click();
        userDeleteAcceptButton.removeAttribute("style");
        amountModal--;
        deactivateModal(userDeleteModal);
    }
});

userDeleteCloseButton.addEventListener("click", function() {
    location.reload();
});