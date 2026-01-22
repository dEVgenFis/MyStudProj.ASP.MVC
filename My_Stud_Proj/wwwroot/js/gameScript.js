"use strict"

gameButtonHelper.classList = ["game__button-helper invisible"];

[notificationButton, notificationButtonMobile].forEach(button => {
    button.addEventListener("click", function () {
        if (user) {
            notificationContent.classList.add("invisible");
            gameContent.classList.remove("invisible");
            resolutionPen.removeAttribute("style");
            for (let i = 0; i < resolutionWord.length; i++) {
                resolutionWord[i].removeAttribute("style");
            }
            if (user.gamesList.length == 0) {
                changeGameContent();
            } else {
                gameAttempts = 0;
                generateRandomGame(user.gamesList);
            }
        }
    });
});

gameAnswerButton.addEventListener("click", function () {
    if (window.scrollY != 0) {
        scrollingElem(window, 0);
    }
    [gameAction, gameButtons, gameHelperText].forEach(elem => {
        elem.classList.add(HTMLbody.clientWidth < 450 ? "mobile-invisible" : "modal");
    });
    gameClarifing.classList.remove("invisible");
    gameClarifing.innerHTML = `
        <div>
            Ваш ответ: <span class="clarifing__user-answer">${
                userGameAnswerWord == "restructuring" ? "реструктуризация" :
                userGameAnswerWord == "destructuring" ? "деструктуризация" :
                userGameAnswerWord == "structuring" ? "структуризация" :
                userGameAnswerWord == "bifurcation" ? "бифуркация" :
                userGameAnswerWord == "rave" ? "грубый и неделикатный" : userGameAnswerWord.join("")
            }</span>.
        </div>Вы уверены в своём ответе?
        <div class="clarifing__buttons">
            <button class="button clarifing__button">Уверен(-а)</button>
            <button class="button button-denial clarifing__button-denial">Подумаю ещё...</button>
        </div>
    `;
    clarifingButton = document.querySelector(".clarifing__button");
    clarifingDenialButton = document.querySelector(".clarifing__button-denial");
    clarifingButton.addEventListener("click", function() {
        if (Array.isArray(userGameAnswerWord)) {
            userGameAnswerWord = userGameAnswerWord.join("");
        }
        gameQuestion.classList.add(HTMLbody.clientWidth < 450 ? "mobile-invisible" : "modal");
        gameConclusion.classList.remove("invisible");
        if (randomGameKey == "destructuring" || randomGameKey == "атомарность") {
            gameConclusion.innerHTML = `
                <div class="conclusion__text-wrapper">
                    Ваш ответ
                    <div class="conclusion__text"></div>
                </div>
                <div class="conclusion__game-continuation modal">Перейдём к следующему заданию/вопросу?</div>
                <button class="button conclusion__button modal">Ok</button>
            `;
            conclusionTextWrapper = document.querySelector(".conclusion__text-wrapper");
            conclusionButton = document.querySelector(".conclusion__button");
            hideButton(conclusionButton);
            let conclusionText = document.querySelector(".conclusion__text");
            conclusionGameContinuation = document.querySelector(".conclusion__game-continuation");
            setTimeout(() => {conclusionText.insertAdjacentText("beforeend", ".")}, 500);
            setTimeout(() => {conclusionText.insertAdjacentText("beforeend", ".")}, 1000);
            setTimeout(() => {conclusionText.insertAdjacentText("beforeend", ".")}, 1500);
            setTimeout(() => {
                conclusionText.innerText = `${userGameAnswerWord === randomGameKey ? "правильный" : "неверный"}`;
                conclusionTextWrapper.insertAdjacentText("beforeend", ".");
                if (userGameAnswerWord === randomGameKey) {
                    updateUserGameList(randomGameKey);
                } else {
                    changeResolution();
                }
                conclusionGameContinuation.classList.remove("modal");
                showButton(conclusionButton);
                conclusionButton.classList.remove("modal");
            }, 2000);
            conclusionButton.addEventListener("click", function() {
                [gameQuestion, gameAction, gameButtons, gameHelperText].forEach(elem => {
                    if (elem.classList.contains("mobile-invisible")) {
                        elem.classList.remove("mobile-invisible");
                    } else {
                        elem.classList.remove("modal");
                    }
                });
                gameConclusion.classList.add("invisible");
                if (user.gamesList.length == 0) {
                    changeGameContent();
                } else {
                    generateRandomGame(user.gamesList);
                }
            });
        }
        gameClarifing.classList.add("invisible");
    });
    clarifingDenialButton.addEventListener("click", function() {
        [gameAction, gameButtons, gameHelperText].forEach(elem => {
            if (elem.classList.contains("mobile-invisible")) {
                elem.classList.remove("mobile-invisible");
            } else {
                elem.classList.remove("modal");
            }
        });
        gameClarifing.classList.add("invisible");
    });
});

stampButton.addEventListener("click", function() {
    for (let i = 0; i < dragTable.children.length; i++) {
        for (let j = 0; j < dragTable.children[i].children.length; j++) {
            let dragStamp = dragTable.children[i].children[j].querySelector(".game__stamp");
            if (!dragTable.children[i].children[j].classList.contains("rotate-active") && dragStamp.classList.contains("invisible")) {
                dragStamp.classList.remove("invisible");
                amountDragStamps--;
            }
        }
    }
    amountDragClicks--;
    if (amountDragClicks == 0) {
        gameButtons.classList.add("invisible");
        gameDragCanvasConclusion.classList.remove("invisible");
        if (amountDragStamps == 0) {
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
            changeResolution();
        }
        stampButton.classList.add("invisible");
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
});

gameDenialButton.addEventListener("click", function () {
    if (window.scrollY != 0) {
        scrollingElem(window, 0);
    }
    [gameAction, gameButtons, gameHelperText].forEach(elem => {
        elem.classList.add(HTMLbody.clientWidth < 450 ? "mobile-invisible" : "modal");
    });
    if (HTMLbody.clientWidth > 450 && (randomGameKey == "canvas" || randomGameKey == "drag")) {
        gameAction.style.opacity = 0;
    }
    gameClarifing.classList.remove("invisible");
    gameClarifing.innerHTML = `
        <div class="clarifing__text">
            Ответ, конечно, благородный (потому что честный), однако за подтверждённое незнание Ваше право на ошибку будет сокращено сразу на две единицы.
        </div>Вы уверены в своём ответе?
        <div class="clarifing__buttons">
            <button class="button clarifing__button">Уверен(-а)</button>
            <button class="button button-denial clarifing__button-denial">Подумаю ещё...</button>
        </div>
    `;
    clarifingButton = document.querySelector(".clarifing__button");
    clarifingDenialButton = document.querySelector(".clarifing__button-denial");
    clarifingButton.addEventListener("click", function() {
        if (gameAction.hasAttribute("style")) {
            gameAction.removeAttribute("style");
        }
        [gameAction, gameButtons, gameHelperText].forEach(elem => {
            if (elem.classList.contains("mobile-invisible")) {
                elem.classList.remove("mobile-invisible");
            } else {
                elem.classList.remove("modal");
            }
        });
        gameClarifing.classList.add("invisible");
        gameAttempts++;
        if (gameConclusion.children.length != 0) {
            gameConclusion.children[0].classList.add("invisible");
        }
        changeResolution();
        if (gameAttempts < 3) {
            generateRandomGame(user.gamesList);
        }
    });
    clarifingDenialButton.addEventListener("click", function() {
        [gameAction, gameButtons, gameHelperText].forEach(elem => {
            if (elem.classList.contains("mobile-invisible")) {
                elem.classList.remove("mobile-invisible");
            } else {
                elem.classList.remove("modal");
            }
        });
        if (HTMLbody.clientWidth > 450 && (randomGameKey == "canvas" || randomGameKey == "drag")) {
            gameAction.style.opacity = 1;
        }
        gameClarifing.classList.add("invisible");
    });
});