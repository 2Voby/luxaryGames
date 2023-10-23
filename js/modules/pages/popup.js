import * as impNav from "../navigation.js";
import * as authinterface from "../authinterface.js";
import * as impHttp from "../http.js";
import * as impAudio from "../audio.js";
import * as impLocalization from "../localize.js";
import * as impLotoNav from "../loto/loto-navigation.js";

// 100 предупреждения
// 200 выиграш
// 300 проиграш
// 400 ошибка в игре
// 500 анонс

const isPopupOpened = () => {
  return document.querySelector(".popup") ? true : false;
};

export const open = (text, status, showButton = false, ws = null) => {
  let siteLanguage = window.siteLanguage;
  if (isPopupOpened()) {
    return;
  }

  let localUser = localStorage.getItem("user");

  if (localUser) {
    localUser = JSON.parse(localUser);
  }

  const body = document.querySelector("body");
  let popupElement = document.createElement("div");
  popupElement.classList.add("popup", "default-popup");
  popupElement.innerHTML = `<div class="popup__body">
  <div class="popup__content ${status === 200 ? "popup__content_won" : ""} ${
    status === 300 ? "popup__content_lost" : ""
  }">
    <button class="popup__close"></button>
    <div class="popup__text ${status === 400 ? "popup__text-red" : ""}">
      ${text}
    </div>
    ${
      showButton
        ? `<button class="popup__button">${siteLanguage.profilePage.myGamesPage.statsItem.continueText}</button>`
        : ""
    }
  </div>
</div>`;

  body.appendChild(popupElement);

  if (showButton) {
    const button = body.querySelector(".popup__button");
    button.addEventListener("click", () => {
      close(popupElement);
      ws.close(
        1000,
        JSON.stringify({
          method: "exitGame",
          userId: localUser.userId,
          page: "mainLotoPage",
        })
      );
    });
  }
  const closeButton = document.querySelector(".popup__close");
  closeButton.addEventListener("click", function () {
    close(popupElement);
  });
};

export const openErorPopup = (text) => {
  let siteLanguage = window.siteLanguage;
  if (isPopupOpened()) {
    return;
  }
  const body = document.querySelector("body");
  let popupElement = document.createElement("div");
  popupElement.classList.add("popup", "error-popup");
  popupElement.innerHTML = `<div class="popup__body">
  <div class="popup__content">
    <div class="popup-header">
      <p>${siteLanguage.profilePage.myGamesPage.statsItem.errorText}</p>
      <img src="img/error-icon.png" alt="" />
    </div>
    <div class="popup__text">
      ${text}
    </div>
    <button class="popup__button">${siteLanguage.profilePage.myGamesPage.statsItem.closeText}</button>
  </div>
</div>`;

  body.appendChild(popupElement);

  const closeButton = document.querySelector(".popup__button");
  closeButton.addEventListener("click", function () {
    close(popupElement);
  });
};

export const openConnectionErorPopup = (text) => {
  let siteLanguage = window.siteLanguage;
  if (isPopupOpened()) {
    return;
  }
  const body = document.querySelector("body");
  let popupElement = document.createElement("div");
  popupElement.classList.add("popup", "error-popup");
  popupElement.innerHTML = `<div class="popup__body">
  <div class="popup__content">
    <div class="popup-header">
      <p>${siteLanguage.profilePage.myGamesPage.statsItem.errorText}</p>
      <img src="img/error-icon.png" alt="" />
    </div>
    <div class="popup__text">
      ${text}
    </div>
    <button class="popup__button">${siteLanguage.words.reload}</button>
  </div>
</div>`;

  body.appendChild(popupElement);

  const closeButton = document.querySelector(".popup__button");
  closeButton.addEventListener("click", function () {
    window.ws = null;
    location.reload();
  });
};

export function close(element) {
  element.remove();
}

export const openAnotherAccountEnterPopup = (ws) => {
  let siteLanguage = window.siteLanguage;
  if (isPopupOpened()) {
    return;
  }
  const body = document.querySelector("body");
  let popupElement = document.createElement("div");
  popupElement.classList.add("popup");
  popupElement.innerHTML = `
  <div class="popup__body another-account-popup">
  <div class="popup__content">
    <div class="popup__img">
      <img src="img/popup-alert.png" alt="" />
    </div>
    <div class="popup__text">
      ${siteLanguage.popups.anotherAccountEnter}
    </div>
    <div class="popup__buttons">
      <button class="popup__button popup__submit-button">${siteLanguage.profilePage.myGamesPage.statsItem.understandText}</button>
    </div>
  </div>
</div>`;

  body.appendChild(popupElement);

  const button = body.querySelector(".popup__submit-button");
  button.addEventListener("click", async () => {
    close(popupElement);
    location.reload();
  });
};

export const openSuuccessBonusesChange = (ws) => {
  let siteLanguage = window.siteLanguage;
  if (isPopupOpened()) {
    return;
  }
  const body = document.querySelector("body");
  let popupElement = document.createElement("div");
  popupElement.classList.add("popup");
  popupElement.innerHTML = `
    <div class="popup__body success-bonuses-change-popup">
      <div class="popup__content">
        
        <div class="popup__text">
          ${siteLanguage.popups.bonusesSuccess}
        </div>
        <div class="popup__buttons">
          <button class="popup__button popup__submit-button">${siteLanguage.words.ok}</button>
        </div>
      </div>
    </div>`;
  body.appendChild(popupElement);

  const button = body.querySelector(".popup__submit-button");
  button.addEventListener("click", async () => {
    close(popupElement);
  });
};

export const openExitPopup = (text, roomId, bet = null) => {
  let siteLanguage = window.siteLanguage;
  if (isPopupOpened()) {
    return;
  }
  const body = document.querySelector("body");
  let popupElement = document.createElement("div");
  popupElement.classList.add("popup");
  popupElement.innerHTML = `
  <div class="popup__body exit-room-popup">
  <div class="popup__content">
    <div class="popup__img">
      <img src="img/popup-alert.png" alt="" />
    </div>
    <div class="popup__text">
      ${text}
    </div>
    <div class="popup__buttons">
      <button class="popup__button popup__submit-button red">${siteLanguage.words.yes}</button>
      <button class="popup__button close-popup green">${siteLanguage.words.no}</button>
    </div>
  </div>
</div>`;

  body.appendChild(popupElement);

  const button = body.querySelector(".popup__submit-button");
  button.addEventListener("click", async () => {
    close(popupElement);

    let user = localStorage.getItem("user");
    if (user) {
      user = JSON.parse(user);
    } else return;

    let ws = window.ws;
    let closeMsg = {
      reason: "rejectGameBet",
      method: "rejectGameBet",
      roomId: roomId,
      bet: bet,
      userId: user.userId,
    };
    ws.send(JSON.stringify(closeMsg));

    // let responce = await impHttp.deleteTicketsReturnBalance(roomId, bet);
    // if (responce.status == 200) {
    //   authinterface.updateBalance(responce.data.balance);
    //   location.hash = "";
    // } else {
    //   open("Ошибка выхода из игры", 300);
    // }
    // responce.data.balance
  });

  const closeButtons = document.querySelectorAll(".close-popup");
  closeButtons.forEach((closeButton) => {
    closeButton.addEventListener("click", function () {
      close(popupElement);
    });
  });
};

export const openEndGamePopup = (
  title,
  status,
  winnersData,
  bank,
  isJackpotWon,
  jackpotData
) => {
  let siteLanguage = window.siteLanguage;
  if (isPopupOpened()) {
    return;
  }
  //status
  //200 - ok
  //400 - error
  let wonSum = bank / winnersData.length;

  const body = document.querySelector("body");
  let popupElement = document.createElement("div");
  popupElement.classList.add("popup", "end-game-popup");

  popupElement.innerHTML = `
  <div class="popup__body end-game-popup__body">
  <div class="popup__content end-game-popup__content">
    <button class="popup__close-timer close-popup-timer">00</button>
    <div class="popup__title end-game-popup__title">
      ${title}
    </div>
    
      <div class="popup__text end-game-popup__text">
        ${siteLanguage.popups.endGamePopupDescr}:
      </div>
      <div class="end-game-popup__winners-wrapper">
        <div class="end-game-popup__winners end-game-winners">
          
        </div>
      </div>
    </div>
    </div>
    `;

  // вставляем победителей и их билеты

  let winnersBody = popupElement.querySelector(".end-game-winners");
  winnersData.forEach((winnerData) => {
    let winnerItem = document.createElement("div");
    winnerItem.classList.add("end-game-winners__item");

    let winnerItemHeader = document.createElement("div");
    winnerItemHeader.classList.add("end-game-winners__item-header");

    let winnerItemName = document.createElement("div");
    winnerItemName.classList.add("end-game-winners__item-name");
    winnerItemName.innerHTML = `${winnerData.userName}`;

    let winnerItemWon = document.createElement("div");
    winnerItemWon.classList.add("end-game-winners__item-won");
    winnerItemWon.innerHTML = `${wonSum.toFixed(2)}₼`;

    winnerItemHeader.appendChild(winnerItemName);
    winnerItemHeader.appendChild(winnerItemWon);
    winnerItem.appendChild(winnerItemHeader);

    winnerData.cards.forEach((card) => {
      let ticket = document.createElement("div");
      ticket.classList.add("end-game-winners__item-ticket");

      card.forEach((cellNumber) => {
        let cellItem = document.createElement("div");
        cellItem.classList.add("end-game-winners__item-ticket-cell");
        let cellNumberItem = document.createElement("div");
        cellNumberItem.classList.add("end-game-winners__item-ticket-number");
        cellNumberItem.innerHTML = cellNumber;
        if (cellNumber != " ") {
          cellItem.classList.add("active");
        }
        cellItem.appendChild(cellNumberItem);
        ticket.appendChild(cellItem);
      });

      winnerItem.appendChild(ticket);
    });
    winnersBody.appendChild(winnerItem);
  });
  // запускаем таймер до следующего переключения на попап

  var timerElement = popupElement.querySelector(".close-popup-timer");

  // Устанавливаем начальное значение таймера
  var seconds = 10;

  // Функция обновления таймера
  function updateTimer() {
    timerElement.textContent = seconds;
    seconds--;
    timerElement.innerHTML = seconds;

    if (seconds <= 0) {
      clearInterval(timerInterval);
      timerElement.innerHTML = 0;
      close(popupElement);
      openJackpotPopup(isJackpotWon, jackpotData);
    }
  }

  var timerInterval = setInterval(updateTimer, 1000);

  body.appendChild(popupElement);
};

function openJackpotPopup(isJackpotWon, jackpotData) {
  console.log(jackpotData);
  let siteLanguage = window.siteLanguage;
  if (isPopupOpened()) {
    return;
  }
  if (isJackpotWon) {
    const body = document.querySelector("body");
    let popupElement = document.createElement("div");

    // обновления баланса пользователю
    let localUser = localStorage.getItem("user");
    if (localUser) {
      localUser = JSON.parse(localUser);
      authinterface.updateBalance(+localUser.balance);
    }

    let jackpotWinnerText = siteLanguage.popups.jackpotWonPopup;

    jackpotWinnerText = jackpotWinnerText.replace(
      "JACKPOT_USERNAME",
      jackpotData.jackpotWinnerName
    );

    popupElement.classList.add("popup", "jackpot-popup");
    popupElement.innerHTML = `
    <div class="popup__body jackpot-popup__body">
      <div class="popup__content jackpot-popup__content">
        <div class="jackpot-popup__jackpot-img">
          <img src="img/jackpot-text.png" alt="" />
        </div>
        <div class="jackpot-popup__jackpot animation"><span>${jackpotData.jackpotSum}</span>₼</div>
        <div class="popup__title jackpot-popup__title visible">
        ${jackpotWinnerText}
        </div>
      </div>
    </div>
      `;
    body.appendChild(popupElement);
    setTimeout(() => {
      close(popupElement);
    }, 11000);
  } else {
    const body = document.querySelector("body");
    let popupElement = document.createElement("div");
    popupElement.classList.add("popup", "jackpot-popup");
    popupElement.innerHTML = `
    <div class="popup__body jackpot-popup__body">
    <div class="popup__content jackpot-popup__content">
      <div class="jackpot-popup__jackpot-img">
        <img src="img/jackpot-text.png" alt="" />
      </div>
      <div class="jackpot-popup__jackpot animation"><span>${jackpotData.jackpotSum}</span>₼</div>
      <div class="popup__title jackpot-popup__title visible">
      ${siteLanguage.popups.jackpotLosedPopup}
      </div>
    </div>
  </div>
      `;
    body.appendChild(popupElement);
    setTimeout(() => {
      close(popupElement);
    }, 11000);
  }
}

export function openJackpotInfoPopup() {
  let siteLanguage = window.siteLanguage;
  if (isPopupOpened()) {
    return;
  }
  const body = document.querySelector("body");
  let popupElement = document.createElement("div");
  popupElement.classList.add("popup", "jackpot-popup");
  popupElement.innerHTML = `
  <div class="popup__body jackpot-info-popup">
    <div class="popup__content">
      <div class="popup__text">
      ${siteLanguage.popups.jackpotInfoPopup}
      </div>
      <img src="img/jackpot-info-image.png" class="jackpot-popup-image">
      <div class="popup-button__gotit"> ${siteLanguage.profilePage.myGamesPage.statsItem.understandText}</div>
    </div>
  </div>
      `;

  let gotItBtn = popupElement.querySelector(".popup-button__gotit");
  gotItBtn.addEventListener("click", function () {
    close(popupElement);
  });

  body.appendChild(popupElement);
}

export function openInfoTokensPopup() {
  let siteLanguage = window.siteLanguage;
  if (isPopupOpened()) {
    return;
  }

  const body = document.querySelector("body");
  let popupElement = document.createElement("div");
  popupElement.classList.add("popup", "jackpot-popup");
  popupElement.innerHTML = `
  <div class="popup__body jackpot-info-popup">
    <div class="popup__content">
      <div class="popup__text popup__text-bold">
      ${siteLanguage.popups.statsInfoPopup}

      </div>
      <div class="tokens-popup-table">
        <div class="tokens-popup-table__item">
          <div class="tokens-table-item-left">
            <img class="tokens-popup-left-image" src="img/money-arm.png" width="40" alt="icon">
            <p class="tokens-popup-left-text">
              0.20 ₼
            </p>
          </div>
          <div class="tokens-table-item-right">
            <p class="tokens-popup-right-text">
              2 coin
            </p>
            <img class="tokens-popup-right-image" src="img/room-tokens-decor.png" alt="icon">
          </div>
        </div>

        <div class="tokens-popup-table__item">
          <div class="tokens-table-item-left">
            <img class="tokens-popup-left-image" src="img/money-arm.png" width="40" alt="icon">
            <p class="tokens-popup-left-text">
              0.50 ₼
            </p>
          </div>
          <div class="tokens-table-item-right">
            <p class="tokens-popup-right-text">
              5 coin
            </p>
            <img class="tokens-popup-right-image" src="img/room-tokens-decor.png" alt="icon">
          </div>
        </div>

        <div class="tokens-popup-table__item">
          <div class="tokens-table-item-left">
            <img class="tokens-popup-left-image" src="img/money-arm.png" width="40" alt="icon">
            <p class="tokens-popup-left-text">
              1.00 ₼
            </p>
          </div>

          <div class="tokens-table-item-right">
            <p class="tokens-popup-right-text">
              10 coin
            </p>
            <img class="tokens-popup-right-image" src="img/room-tokens-decor.png" alt="icon">
          </div>
        </div>

        <div class="tokens-popup-table__item">
          <div class="tokens-table-item-left">
            <img class="tokens-popup-left-image" src="img/money-arm.png" width="40" alt="icon">
            <p class="tokens-popup-left-text">
              5.00 ₼
            </p>
          </div>
          <div class="tokens-table-item-right">
            <p class="tokens-popup-right-text">
              50 coin
            </p>
            <img class="tokens-popup-right-image" src="img/room-tokens-decor.png" alt="icon">
          </div>
        </div>

        <div class="tokens-popup-table__item">
          <div class="tokens-table-item-left">
            <img class="tokens-popup-left-image" src="img/money-arm.png" width="40" alt="icon">
            <p class="tokens-popup-left-text">
              10.00 ₼
            </p>
          </div>
          <div class="tokens-table-item-right">
            <p class="tokens-popup-right-text">
              100 coin
            </p>
            <img class="tokens-popup-right-image" src="img/room-tokens-decor.png" alt="icon">
          </div>
        </div>
      </div>
      <div class="popup-button__gotit">${siteLanguage.profilePage.myGamesPage.statsItem.understandText}</div>
    </div>
  </div>
  `;

  let gotItBtn = popupElement.querySelector(".popup-button__gotit");
  gotItBtn.addEventListener("click", function () {
    close(popupElement);
  });

  body.appendChild(popupElement);
}

export function openChangeLanguage() {
  let siteLanguage = window.siteLanguage;
  if (isPopupOpened()) {
    return;
  }
  const body = document.querySelector("body");
  let popupElement = document.createElement("div");
  popupElement.classList.add("popup", "change-language-popup");
  popupElement.innerHTML = `
  <div class="popup__body change-language-popup">
  <div class="popup__content language-popup-content">
    <div class="change-language-popup__buttons">
      <button lang="ru" class="language-popup__button">Русский</button>
      <button lang="UA" class="language-popup__button">Українська</button>
      <button lang="AZ" class="language-popup__button">Azərbaycan dili</button>
      <button lang="TR" class="language-popup__button">Türkçe</button>
      <button lang="EN" class="language-popup__button">English</button>
    </div>
  </div>
  `;

  const languageButtons = popupElement.querySelectorAll(
    ".language-popup__button"
  );
  languageButtons.forEach((button) => {
    button.addEventListener("click", async function () {
      let lang = button.getAttribute("lang");
      localStorage.setItem("language", lang);
      let siteLanguage = await impLocalization.getCurrentSiteLang();
      window.siteLanguage = siteLanguage;
      impAudio.setLanguage(lang);
      impLocalization.translateMainPage();
      impLocalization.translateProfilePage();

      const languageText = document.querySelector(
        ".select-language__text span"
      );
      if (languageText) {
        languageText.innerHTML = button.innerHTML;
      }
      impLocalization.translateAuthPage();

      close(popupElement);
    });
  });

  body.appendChild(popupElement);
}

export const openDominoWaitingPopup = (
  online,
  dominoRoomId,
  tableId,
  playerMode,
  gameMode
) => {
  if (isPopupOpened()) {
    return;
  }

  const body = document.querySelector("body");
  let popupElement = document.createElement("div");
  popupElement.classList.add("popup");
  popupElement.innerHTML = `
    <div class="popup">
      <div class="popup__body">
        <div class="popup__content domino-waiting-popup">
          <div class="popup__header"></div>
          <div class="popup__text domino-waiting-popup__text">
            <p><span class="domino-waiting-popup__online">${online}</span>/${playerMode}</p>
            <p>Идет подбор игроков...</p>
          </div>
          <button class="domino-waiting-popup__button">Выйти</button>
        </div>
      </div>
    </div>
  `;

  body.appendChild(popupElement);

  const quitWainingButton = popupElement.querySelector(
    ".domino-waiting-popup__button"
  );

  quitWainingButton.addEventListener("click", function () {
    let websocket = window.ws;
    websocket.send(
      JSON.stringify({
        method: "leaveDominoTable",
        dominoRoomId,
        tableId,
        playerMode,
        gameMode,
        userId: +JSON.parse(localStorage.getItem("user")).userId,
      })
    );
    let localUser = localStorage.getItem("user");
    localUser = JSON.parse(localUser);

    if (websocket && websocket.readyState == 1) {
      console.log("close ws");
      websocket.close(
        3001,
        JSON.stringify({
          userId: localUser.userId,
          username: localUser.username,
          method: "disconnectGame",
          page: "mainDominoPage",
        })
      );
    }

    close(popupElement);
  });
};

export const updateDominoWaitingPopup = (online) => {
  const onlineElement = document.querySelector(".domino-waiting-popup__online");
  if (onlineElement) {
    onlineElement.innerHTML = online;
  }
};

export const openDominoTimerPopup = (online) => {
  const prevPopup = document.querySelector(".popup");
  if (prevPopup) {
    prevPopup.remove();
  }

  if (isPopupOpened()) {
    return;
  }

  let playerMode, dominoRoomId, tableId;
  dominoRoomId = +location.hash.split("/")[1];
  tableId = +location.hash.split("/")[2];
  playerMode = +location.hash.split("/")[3];

  const body = document.querySelector("body");
  let popupElement = document.createElement("div");
  popupElement.classList.add("popup");
  popupElement.innerHTML = `
    <div class="popup">
      <div class="popup__body">
        <div class="popup__content domino-starting-popup">
          <div class="popup__header">
            <div class="popup__timer">
              <img src="img/timer-icon.png" alt="timer" /> 
              <span class="domino-starting-popup__timer">00:10</span>
            </div>
          </div>
          <div class="popup__text domino-starting-popup__text">
            <p>Ожидание начала игры...</p>
          </div>
        </div>
      </div>
    </div>
  `;

  const timerElement = popupElement.querySelector(
    ".domino-starting-popup__timer"
  );

  let timeLeft = 10;

  const timerInterval = setInterval(() => {
    timeLeft -= 1;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      close(popupElement);
    } else {
      timerElement.innerHTML = `00:${
        timeLeft < 10 ? "0" + timeLeft : timeLeft
      }`;
    }
  }, 1000);

  body.appendChild(popupElement);
};

export const openDominoWinGame = (winners, playersTiles) => {
  const main = document.querySelector(".main__container");
  let popupElement = document.createElement("div");
  popupElement.classList.add("popup");

  let winnersList = "";
  winners.forEach((winner) => {
    console.log(winner);
    winnersList += `<p>${winner.username}</p>`;
  });

  popupElement.innerHTML = `
    <div class="popup">
      <div class="popup__body">
        <div class="popup__content domino-win-popup">
          <div class="popup__header">
            <img src="img/win-icon.png" alt="win" />
          </div>
          <div class="popup__text domino-win-popup__text">
            <p>Победители:</p>
            ${winnersList}
          </div>
        </div>
      </div>
    </div>
  `;

  main.appendChild(popupElement);
};

export const openDominoLoseGame = (winners, playersTiles) => {
  const main = document.querySelector(".main__container");
  let popupElement = document.createElement("div");
  popupElement.classList.add("popup");

  let winnersList = "";
  winners.forEach((winner) => {
    winnersList += `
      <p>${winner.username}</p>
    `;
  });

  popupElement.innerHTML = `
    <div class="popup">
      <div class="popup__body">
        <div class="popup__content domino-lose-popup">
          <div class="popup__header">
            <img src="img/lose-icon.png" alt="lose" />
          </div>
          <div class="popup__text domino-lose-popup__text">
            <p>К сожалению, вы проиграли</p>
            <p>Победители:</p>
            ${winnersList}
            <div class="domino-lose-popup__tiles">
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  main.appendChild(popupElement);

  formPopupTiles(playersTiles, popupElement);
};

const formPopupTiles = (playersTiles, popupElement) => {
  const tilesBlock = popupElement.querySelector(".domino-lose-popup__tiles");
  playersTiles.forEach((playerTiles) => {
    tilesBlock.innerHTML += `
      <div>
        <p style="width:100%;background-color:#000;height:2px;margin:10px 0;"></p>
        Костяшки игрока ${playerTiles.username}:
      </div>
      <div class="domino-lose-popup__player-tiles domino-lose-popup__player-tiles-${playerTiles.userId}">
      </div>
    `;
  });

  const tilesContainers = popupElement.querySelectorAll(
    ".domino-lose-popup__player-tiles"
  );

  tilesContainers.forEach((tilesContainer) => {
    const userId = +tilesContainer.classList[1].split("-")[4];
    const playerTiles = playersTiles.find((playerTiles) => {
      return playerTiles.userId == userId;
    });

    if (playerTiles.tiles.length == 0) {
      tilesContainer.innerHTML += `
        <p>Костяшки закончились</p>
      `;
    }

    playerTiles.tiles.forEach((tile) => {
      tilesContainer.innerHTML += `
      <div class="domino-game__tile domino-tile">
        <div class="domino-tile__half domino-dots-${tile.left}">
          ${`<div class="domino-tile__dot"></div>`.repeat(tile.left)}
        </div>
        <div class="domino-tile__half domino-dots-${tile.right}">
          ${`<div class="domino-tile__dot"></div>`.repeat(tile.right)}
        </div>
      </div>
      `;
    });
  });
};

export const openFinisedGamePopup = () => {
  if (isPopupOpened()) {
    return;
  }

  const body = document.querySelector("body");
  let popupElement = document.createElement("div");
  popupElement.classList.add("popup", "finishedGameAlert-popup");
  popupElement.innerHTML = `

  <div class="popup__body">
    <div class="popup__content domino-finishedGameAlert-popup">
      <div class="popup__header">
        <div class="preloader">
          <div class="lds-ring black">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
      <div class="popup__text domino-finishedGameAlert-popup__text">
        Игра окончена, ожидайде ее сброса!
      </div>
    </div>
  </div>

  `;

  body.appendChild(popupElement);
};

export const openDominoTelephoneRoundFinishPopup = (
  score,
  username,
  playersScore,
  prevWinnerScore,
  winnerId,
  playersTiles
) => {
  const main = document.querySelector(".main__container");
  let popupElement = document.createElement("div");
  popupElement.classList.add("popup");

  let playersScoreList = "";
  playersScore.forEach((playerScore) => {
    playersScoreList += `
      <p userid="${playerScore.userId}">
        <span class="telephone-finish-username">${playerScore.username}</span> - <span class="telephone-finish-score telephone-finish-user-${playerScore.userId}">${playerScore.score}</span>
      </p>
    `;
  });

  popupElement.innerHTML = `
    <div class="popup">
      <div class="popup__body">
        <div class="popup__content">
          <div class="popup__text domino-lose-popup__text">
            Результаты раунда:
            <br>
            ${playersScoreList}
            <div class="domino-lose-popup__tiles">
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  main.appendChild(popupElement);

  formPopupTiles(playersTiles, popupElement);

  const winnerScoreElement = document.querySelector(
    `.telephone-finish-user-${winnerId}`
  );

  impLotoNav.animateNumberChange(winnerScoreElement, prevWinnerScore, score, 3);

  const allScoreElements = document.querySelectorAll(".telephone-finish-score");
  let lostScoreElements = [];
  allScoreElements.forEach((scoreElement) => {
    if (!scoreElement.classList.contains(`telephone-finish-user-${winnerId}`)) {
      lostScoreElements.push(scoreElement);
    }
  });

  lostScoreElements.forEach((scoreElement) => {
    impLotoNav.animateNumberChange(scoreElement, score, 0, 3);
  });

  setTimeout(() => {
    close(popupElement);
  }, 5000);
};

export const openEmojiPopup = () => {
  const main = document.querySelector(".main__container");
  let popupElement = document.createElement("div");
  popupElement.classList.add("popup", "emoji-popup");

  popupElement.innerHTML = `
    <div class="popup__body emoji-popup__body">
      <div class="popup__content emoji-popup__content">
        
      </div>
    </div>
  `;

  let closeButton = document.createElement("button");
  closeButton.classList.add("popup__close");
  closeButton.addEventListener("click", () => {
    close(popupElement);
  });

  main.appendChild(popupElement);

  const emojiPopupContent = popupElement.querySelector(".emoji-popup__content");

  emojiPopupContent.appendChild(closeButton);

  if (window.isChatBlocked) {
    emojiPopupContent.classList.add("blocked");
  }

  for (let i = 1; i <= 24; i++) {
    let emojiItem = document.createElement("div");
    emojiItem.classList.add("emoji-popup__item");
    emojiItem.innerHTML = `<img emojiId="${i}" src="img/emojis/${i}.png" alt="emoji" width="64px" />`;

    emojiItem.addEventListener("click", (e) => {
      if (window.isChatBlocked) {
        return;
      }

      window.ws.send(
        JSON.stringify({
          method: "sendEmoji",
          roomId: +location.hash.split("/")[1],
          tableId: +location.hash.split("/")[2],
          playerMode: +location.hash.split("/")[3],
          gameMode: location.hash.split("/")[4],
          emojiId: +e.target.getAttribute("emojiId"),
          userId: JSON.parse(localStorage.getItem("user")).userId,
        })
      );
      close(popupElement);

      window.isChatBlocked = true;
      setTimeout(() => {
        const openedPhrasePopup = document.querySelector(
          ".phrase-popup__content"
        );
        const openedEmojiPopup = document.querySelector(
          ".emoji-popup__content"
        );
        if (openedPhrasePopup) {
          openedPhrasePopup.classList.remove("blocked");
        }
        if (openedEmojiPopup) {
          openedEmojiPopup.classList.remove("blocked");
        }
        window.isChatBlocked = false;
      }, 10000);
    });

    emojiPopupContent.appendChild(emojiItem);
  }
};

export const openTextPopup = () => {
  const siteLanguage = window.siteLanguage;

  const main = document.querySelector(".main__container");
  let popupElement = document.createElement("div");
  popupElement.classList.add("popup", "phrase-popup");

  popupElement.innerHTML = `
    <div class="popup__body phrase-popup__body">
      <div class="popup__content phrase-popup__content">
        
      </div>
    </div>
  `;

  let closeButton = document.createElement("button");
  closeButton.classList.add("popup__close");
  closeButton.addEventListener("click", () => {
    close(popupElement);
  });

  main.appendChild(popupElement);

  const phrasePopupContent = popupElement.querySelector(
    ".phrase-popup__content"
  );

  phrasePopupContent.appendChild(closeButton);

  if (window.isChatBlocked) {
    phrasePopupContent.classList.add("blocked");
  }

  for (let i = 1; i <= 24; i++) {
    let phraseItem = document.createElement("div");
    phraseItem.classList.add("phrase-popup__item");
    phraseItem.setAttribute("phraseId", i);
    phraseItem.innerHTML = siteLanguage.dominoPhrases[`phrase${i}`];

    phraseItem.addEventListener("click", (e) => {
      if (window.isChatBlocked) {
        return;
      }

      window.ws.send(
        JSON.stringify({
          method: "sendPhrase",
          roomId: +location.hash.split("/")[1],
          tableId: +location.hash.split("/")[2],
          playerMode: +location.hash.split("/")[3],
          gameMode: location.hash.split("/")[4],
          phraseId: +e.target.getAttribute("phraseId"),
          userId: JSON.parse(localStorage.getItem("user")).userId,
        })
      );

      close(popupElement);

      // block phrases and emojis for 10 seconds
      window.isChatBlocked = true;
      setTimeout(() => {
        const openedPhrasePopup = document.querySelector(
          ".phrase-popup__content"
        );
        const openedEmojiPopup = document.querySelector(
          ".emoji-popup__content"
        );
        if (openedPhrasePopup) {
          openedPhrasePopup.classList.remove("blocked");
        }
        if (openedEmojiPopup) {
          openedEmojiPopup.classList.remove("blocked");
        }
        window.isChatBlocked = false;
      }, 10000);
    });

    phrasePopupContent.appendChild(phraseItem);
  }
};
