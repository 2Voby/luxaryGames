import * as impNav from "../navigation.js";
import * as impWSNav from "../ws-navigation.js";
import * as impLotoNav from "../loto/loto-navigation.js";
import * as impPopup from "../pages/popup.js";
import * as impDominoGame from "./domino-game.js";
import * as impHttp from "../http.js";

const intervals = [
  // {
  //   dominoRoomId: 1,
  //   tableId: 1,
  //   playerMode: 2
  //   interval: null,
  // },
  // {
  //   dominoRoomId: 1,
  //   tableId: 1,
  //   playerMode: 2
  //   interval: null,
  // },
  // {
  //   dominoRoomId: 1,
  //   tableId: 1,
  //   playerMode: 2
  //   interval: null,
  // },
  // {
  //   dominoRoomId: 2,
  //   tableId: 3,
  //   playerMode: 4
  //   interval: null,
  // },
];

export function openDominoChoosePage() {
  let main__container = document.querySelector(".main__container");
  main__container.innerHTML = `
    <section class="domino-choose">
      <div class="domino-choose__button classic">DOMINO CLASSIC</div>
      <div class="domino-choose__button telephone">DOMINO TELEPHONE</div>
    </section>
  `;

  const classicButton = document.querySelector(
    ".domino-choose__button.classic"
  );
  classicButton.addEventListener("click", () => {
    location.hash = "#domino-menu";
  });

  const telephoneButton = document.querySelector(
    ".domino-choose__button.telephone"
  );
  telephoneButton.addEventListener("click", () => {
    location.hash = "#domino-menu-telephone";
  });
}

export function openDominoMenuPage(
  isTwoPlayers = true,
  ws = null,
  gameMode = "CLASSIC"
) {
  const main = document.querySelector("main");
  main.innerHTML = "";
  let main__container = document.createElement("div");
  main__container.classList.add(
    "main__container",
    "header__padding",
    "footer__padding"
  );

  createChoosePlayersButtons(main__container, isTwoPlayers);

  if (isTwoPlayers) {
    formTwoPlayersMenu(main, main__container, ws, gameMode);
  } else {
    formFourPlayersMenu(main, main__container, ws, gameMode);
  }

  impNav.addListeners(window.ws);

  // добавляем навигацию сайта
  let footer = document.querySelector("footer");
  const header = document.querySelector("header");
  header.classList.remove("d-none");
  footer.classList.remove("d-none");
  main__container.classList.add("footer__padding", "header__padding");

  // get info about domino rooms
  setTimeout(() => {
    window.ws.send(
      JSON.stringify({
        method: "getAllDominoInfo",
        playerMode: isTwoPlayers ? 2 : 4,
        gameMode: gameMode.toUpperCase(),
      })
    );
  }, 200);
}

function createChoosePlayersButtons(main__container, isTwoPlayers) {
  const choosePlayersBlock = document.createElement("div");
  choosePlayersBlock.classList.add("domino-choose-players");
  const chooseTwoPlayersButton = document.createElement("button");
  chooseTwoPlayersButton.classList.add(
    "choose-players-button",
    "choose-players-button-2"
  );
  chooseTwoPlayersButton.innerHTML = `2 игрока`;
  const chooseFourPlayersButton = document.createElement("button");
  chooseFourPlayersButton.classList.add(
    "choose-players-button",
    "choose-players-button-4"
  );
  chooseFourPlayersButton.innerHTML = `4 игрока`;

  if (isTwoPlayers) {
    chooseTwoPlayersButton.classList.add("active");
  } else {
    chooseFourPlayersButton.classList.add("active");
  }

  const gameMode = (
    window.location.hash.split("-")[2] || "CLASSIC"
  ).toUpperCase();

  choosePlayersBlock.appendChild(chooseTwoPlayersButton);
  choosePlayersBlock.appendChild(chooseFourPlayersButton);

  chooseTwoPlayersButton.addEventListener("click", () => {
    openDominoMenuPage(true, null, gameMode);
  });

  chooseFourPlayersButton.addEventListener("click", () => {
    openDominoMenuPage(false, null, gameMode);
  });

  main__container.appendChild(choosePlayersBlock);
}

function formTwoPlayersMenu(main, main__container, ws, gameMode) {
  const gamesBlock = document.createElement("div");
  gamesBlock.classList.add("domino-games", "games");

  const rooms = [
    { id: 1, bet: 0.5 },
    { id: 2, bet: 1 },
    { id: 3, bet: 3 },
    { id: 4, bet: 5 },
    { id: 5, bet: 10 },
  ];

  let roomsHtml = ``;
  rooms.forEach((room) => {
    roomsHtml += `
    <div class="domino-room domino-room-players-2 domino-room-mode-${gameMode.toLowerCase()}" dominoRoomId=${
      room.id
    }>
      <div class="domino-room-header">
        <p class="domino-room-header__title">Домино: ${
          gameMode == "CLASSIC" ? "Классическая" : "Телефон"
        } <span>(2 игроков)</span></p>
        <div class="domino-room-header__info">
          <p class="domino-room-bet">
            ${room.bet.toFixed(2)}₼
          </p>
          <p class="domino-room-duration">
            Длительность игры: 5 минут
          </p>
        </div>
      </div>
      <div class="domino-room-content">
        <div class="domino-room-content__tables">
          <div class="domino-room-content__table" tableId=1>
            <div class="domino-room-content__table-image">
              <div class="domino-room-table-half domino-room-table-part"></div>
              <div class="domino-room-table-half domino-room-table-part"></div>
            </div>
            <div class="domino-room-content__table-info">
              <p class="domino-room-table-info__title">Стол 1</p>
              <p class="domino-room-table-info__timer">00:00 сек</p> 
              <p class="domino-room-table-info__players">Игроков: <span>0</span></p>
            </div>
          </div>

          <div class="domino-room-content__table" tableId=2>
            <div class="domino-room-content__table-image">
              <div class="domino-room-table-half domino-room-table-part"></div>
              <div class="domino-room-table-half domino-room-table-part"></div>
            </div>
            <div class="domino-room-content__table-info">
              <p class="domino-room-table-info__title">Стол 2</p>
              <p class="domino-room-table-info__timer">00:00 сек</p> 
              <p class="domino-room-table-info__players">Игроков: <span>0</span></p>
            </div>
          </div>

          <div class="domino-room-content__table" tableId=3>
            <div class="domino-room-content__table-image">
              <div class="domino-room-table-half domino-room-table-part"></div>
              <div class="domino-room-table-half domino-room-table-part"></div>
            </div>
            <div class="domino-room-content__table-info">
              <p class="domino-room-table-info__title">Стол 3</p>
              <p class="domino-room-table-info__timer">00:00 сек</p> 
              <p class="domino-room-table-info__players">Игроков: <span>0</span></p>
            </div>
          </div>
        </div>
      </div> 
    </div>
    `;
  });

  gamesBlock.innerHTML = roomsHtml;
  main__container.appendChild(gamesBlock);
  main.appendChild(main__container);
  addDominoListeners(ws);
}

function formFourPlayersMenu(main, main__container, ws, gameMode) {
  const gamesBlock = document.createElement("div");
  gamesBlock.classList.add("domino-games", "games");

  const rooms = [
    { id: 1, bet: 0.5 },
    { id: 2, bet: 1 },
    { id: 3, bet: 3 },
    { id: 4, bet: 5 },
    { id: 5, bet: 10 },
  ];

  let roomsHtml = ``;
  rooms.forEach((room) => {
    roomsHtml += `
    <div class="domino-room domino-room-players-4 domino-room-mode-${gameMode.toLowerCase()}" dominoRoomId="${
      room.id
    }">
      <div class="domino-room-header">
        <p class="domino-room-header__title">Домино: ${
          gameMode == "CLASSIC" ? "Классическая" : "Телефон"
        } <span>(4 игроков)</span></p>
        <div class="domino-room-header__info">
          <p class="domino-room-bet">
            ${room.bet.toFixed(2)}₼
          </p>
          <p class="domino-room-duration">
            Длительность игры: 5 минут
          </p>
        </div>
      </div>
      <div class="domino-room-content">
        <div class="domino-room-content__tables">
          <div class="domino-room-content__table" tableId="1">
            <div class="domino-room-content__table-image-grid">
              <div class="domino-room-table-quater domino-room-table-part"></div>
              <div class="domino-room-table-quater domino-room-table-part"></div>
              <div class="domino-room-table-quater domino-room-table-part"></div>
              <div class="domino-room-table-quater domino-room-table-part"></div>
            </div>
            <div class="domino-room-content__table-info">
              <p class="domino-room-table-info__title">Стол 1</p>
              <p class="domino-room-table-info__timer">00:00 сек</p> 
              <p class="domino-room-table-info__players">Игроков: <span>0</span></p>
            </div>
          </div>

          <div class="domino-room-content__table" tableId="2">
            <div class="domino-room-content__table-image-grid">
              <div class="domino-room-table-quater domino-room-table-part"></div>
              <div class="domino-room-table-quater domino-room-table-part"></div>
              <div class="domino-room-table-quater domino-room-table-part"></div>
              <div class="domino-room-table-quater domino-room-table-part"></div>
            </div>
            <div class="domino-room-content__table-info">
              <p class="domino-room-table-info__title">Стол 2</p>
              <p class="domino-room-table-info__timer">00:00 сек</p> 
              <p class="domino-room-table-info__players">Игроков: <span>0</span></p>
            </div>
          </div>

          <div class="domino-room-content__table" tableId="3">
            <div class="domino-room-content__table-image-grid">
              <div class="domino-room-table-quater domino-room-table-part"></div>
              <div class="domino-room-table-quater domino-room-table-part"></div>
              <div class="domino-room-table-quater domino-room-table-part"></div>
              <div class="domino-room-table-quater domino-room-table-part"></div>
            </div>
            <div class="domino-room-content__table-info">
              <p class="domino-room-table-info__title">Стол 3</p>
              <p class="domino-room-table-info__timer">00:00 сек</p> 
              <p class="domino-room-table-info__players">Игроков: <span>0</span></p>
            </div>
          </div>
        </div>
      </div> 
    </div>
    `;
  });

  gamesBlock.innerHTML = roomsHtml;
  main__container.appendChild(gamesBlock);
  main.appendChild(main__container);
  addDominoListeners(ws);
}

const addDominoListeners = () => {
  const dominoRooms = document.querySelectorAll(".domino-room");
  dominoRooms.forEach((room) => {
    const tables = room.querySelectorAll(".domino-room-content__table");
    tables.forEach((table) => {
      table.addEventListener("click", async () => {
        const dominoRoomId = +room.getAttribute("dominoRoomId");
        const tableId = +table.getAttribute("tableId");
        // playerMode: 2 or 4
        const playerMode = Number(room.classList[1].split("-")[3]);
        const gameMode = room.classList[2].split("-")[3];

        const user = JSON.parse(localStorage.getItem("user"));
        const betInfo = getDominoRoomBetInfo(dominoRoomId);

        if (user.balance < betInfo.bet) {
          impPopup.openErorPopup("Недостаточно средств на балансе", 300);
          return;
        }
        let roomStatus = await impHttp.isDominoStarted(
          dominoRoomId,
          tableId,
          playerMode,
          gameMode.toUpperCase()
        );
        if (roomStatus.status == 200 && roomStatus.data.allow == true) {
          console.log(roomStatus);
          window.location.hash = `domino-room-table/${dominoRoomId}/${tableId}/${playerMode}/${gameMode.toUpperCase()}`;
        } else {
          impPopup.openErorPopup("Подождите пока закончится игра!", 300);
        }
      });
    });
  });
};

export const getDominoRoomBetInfo = (roomId) => {
  switch (roomId) {
    case 1:
      return {
        bet: 0.5,
      };
    case 2:
      return {
        bet: 1,
      };
    case 3:
      return {
        bet: 3,
      };
    case 4:
      return {
        bet: 5,
      };
    case 5:
      return {
        bet: 10,
      };
  }
};

export async function addDominoRoomsInfo(msg) {
  let { dominoInfo } = msg;
  if (!dominoInfo) {
    return;
  }

  // console.log(dominoInfo);

  // check if user is on right page
  const hash = window.location.hash.split("/");
  if (hash[0] !== "#domino-menu" && hash[0] !== "#domino-menu-telephone") {
    return;
  }

  const gameMode = hash[0] == "#domino-menu" ? "CLASSIC" : "TELEPHONE";

  // filter info by playerMode
  const playerMode = getPlayerMode();
  dominoInfo = dominoInfo.filter(
    (room) =>
      room.playerMode === playerMode &&
      room.gameMode.toUpperCase() === gameMode.toUpperCase()
  );
  console.log(dominoInfo);

  // clear all tables
  const dominoRooms = document.querySelectorAll(".domino-room");
  dominoRooms.forEach((room) => {
    const tables = room.querySelectorAll(".domino-room-content__table");
    tables.forEach((table) => {
      const playersOnline = table.querySelector(
        ".domino-room-table-info__players span"
      );
      playersOnline.innerHTML = 0;
      let tableHalfs = table.querySelectorAll(".domino-room-table-part");
      tableHalfs.forEach((item) => [item.classList.remove("filled")]);
    });
  });

  for (const room of dominoInfo) {
    const dominoRoom = document.querySelector(
      `.domino-room[dominoRoomId="${room.dominoRoomId}"]`
    );

    const tables = dominoRoom.querySelectorAll(".domino-room-content__table");
    for (const table of tables) {
      const tableId = +table.getAttribute("tableId");
      const tableInfo = room.tables.find((table) => table.tableId === tableId);
      if (tableInfo) {
        console.log(table, tableInfo);
        const playersOnline = table.querySelector(
          ".domino-room-table-info__players span"
        );
        let tableHalfs = table.querySelectorAll(".domino-room-table-part");
        for (let i = 0; i < tableInfo.online; i++) {
          tableHalfs[i].classList.add("filled");
        }
        playersOnline.innerHTML = tableInfo.online;
        const timerBlock = table.querySelector(
          ".domino-room-table-info__timer"
        );
        // чистим интервалы

        intervals
          .filter(
            (interval) =>
              interval.dominoRoomId === room.dominoRoomId &&
              interval.tableId === tableInfo.tableId
          )
          .forEach((interval) => {
            clearInterval(interval.interval);
            intervals.splice(intervals.indexOf(interval), 1);
          });

        if (tableInfo.isStarted == true) {
          timerBlock.innerHTML = "Игра идет";
          return;
        }

        if (tableInfo.startedAt != null) {
          // запускаем таймер на стол
          let countDownDate = new Date(tableInfo.startedAt).getTime() + 10000;
          console.log(countDownDate);

          let nowClientTime = await impLotoNav.NowClientTime();

          let distance = countDownDate - nowClientTime;
          let timer = setInterval(() => {
            distance -= 500;
            console.log(distance);
            timerBlock.innerHTML = `00:${String(
              Math.ceil(distance / 1000)
            ).padStart(2, "0")} сек`;

            if (distance < 0) {
              clearInterval(timer);

              timerBlock.innerHTML = "Игра идет";
            }
          }, 500);

          intervals.push({
            dominoRoomId: room.dominoRoomId,
            tableId: tableInfo.tableId,
            playerMode: room.playerMode,
            gameMode: room.gameMode.toUpperCase(),
            interval: timer,
          });
        }
      }
    }
  }
}

export async function createDominoTimer(msg) {
  // "startDominoTableTimerMenu"
  let startedAt = msg.startedAt;
  const tables = document.querySelectorAll(".domino-room-content__table");
  if (tables) {
    // get table element
    console.log(msg.dominoRoomId, msg.tableId);
    const playerMode = getPlayerMode();
    if (playerMode != msg.playerMode) return;
    const table = document.querySelector(
      `.domino-room[dominoRoomId="${msg.dominoRoomId}"] .domino-room-content__table[tableId="${msg.tableId}"]`
    );
    if (table) {
      console.log(table);

      const timerBlock = table.querySelector(".domino-room-table-info__timer");

      if (timerBlock) {
        // чистим интервалы

        intervals
          .filter(
            (interval) =>
              interval.dominoRoomId === room.dominoRoomId &&
              interval.tableId === msg.tableId
          )
          .forEach((interval) => {
            clearInterval(interval.interval);
            intervals.splice(intervals.indexOf(interval), 1);
          });

        if (msg.isStarted == true) {
          timerBlock.innerHTML = "Игра идет";
          return;
        }

        // запускаем таймер на стол
        let countDownDate = new Date(startedAt).getTime() + 10000;
        console.log(countDownDate);

        let nowClientTime = await impLotoNav.NowClientTime();

        let distance = countDownDate - nowClientTime;
        let timer = setInterval(() => {
          distance -= 500;
          console.log(distance);
          timerBlock.innerHTML = `00:${String(
            Math.ceil(distance / 1000)
          ).padStart(2, "0")} сек`;

          if (distance < 0) {
            clearInterval(timer);

            timerBlock.innerHTML = "Игра идет";
          }
        }, 500);

        intervals.push({
          dominoRoomId: msg.dominoRoomId,
          tableId: msg.tableId,
          playerMode: msg.playerMode,
          gameMode: msg.gameMode.toUpperCase(),
          interval: timer,
        });
      }
    }
  }
}

function getPlayerMode() {
  // get playerMode by checking if button is active
  const choosePlayersButtons = document.querySelectorAll(
    ".choose-players-button"
  );
  let playerMode = 2;
  choosePlayersButtons.forEach((button) => {
    if (button.classList.contains("active")) {
      playerMode = Number(button.classList[1].split("-")[3]);
    }
  });
  return playerMode;
}

export function addOnlineToTable(msg) {
  console.log(msg);
  const roomId = msg.dominoRoomId;
  const tableId = msg.tableId;

  const playerMode = getPlayerMode();

  const hash = window.location.hash.split("/");
  const gameMode = hash[0] == "#domino-menu" ? "CLASSIC" : "TELEPHONE";

  // check if user is on right page
  if (
    (hash[0] !== "#domino-menu" && hash[0] !== "#domino-menu-telephone") ||
    playerMode !== msg.playerMode ||
    gameMode.toUpperCase() !== msg.gameMode.toUpperCase()
  ) {
    return;
  }

  const tableBlock = document.querySelector(
    `.domino-room[dominoRoomId="${roomId}"] .domino-room-content__table[tableId="${tableId}"]`
  );
  if (!tableBlock) return;
  const playersOnline = tableBlock.querySelector(
    ".domino-room-table-info__players span"
  );
  let roomHalfs = tableBlock.querySelectorAll(".domino-room-table-part");
  console.log(roomHalfs);
  for (let i = 0; i < Number(playersOnline.innerHTML) + 1; i++) {
    let roomHalf = roomHalfs[i];
    roomHalf.classList.add("filled");
  }

  playersOnline.innerHTML = Number(playersOnline.innerHTML) + 1;
}

export function openDominoTable(
  dominoRoomId = null,
  tableId = null,
  playerMode = null,
  gameMode = null
) {
  if (!dominoRoomId || !tableId) {
    const hash = window.location.hash.split("/");
    dominoRoomId = +hash[1];
    tableId = +hash[2];
    playerMode = +hash[3];
    gameMode = hash[4];
  }
  const main__container = document.querySelector(".main__container");
  main__container.innerHTML = `
  <section class="domino-game-page" id="domino-game-page">
  <div class = "domino-game-room__preloader"><div class="lds-ring"><div></div><div></div><div></div><div></div></div></div>
  <div class="domino-games__container">
    <div class="domino-game-page__body-wrapper">
      <div class="domino-game-page__body">
        <div class="domino-game-page-table-block domino-game-table">
          <div class="domino-game-table__table">
            <div id="1" class="domino-game-table__table-tiles-block-1 domino-game-table__table-tiles-block"></div>
            <div id="2" class="domino-game-table__table-tiles-block-2 domino-game-table__table-tiles-block"></div>
            <div id="3" class="domino-game-table__table-tiles-block-3 domino-game-table__table-tiles-block"></div>
            <div id="4" class="domino-game-table__table-tiles-block-4 domino-game-table__table-tiles-block"></div>
            <div id="5" class="domino-game-table__table-tiles-block-5 domino-game-table__table-tiles-block"></div>
            <div id="6" class="domino-game-table__table-tiles-block-6 domino-game-table__table-tiles-block"></div>
            <div id="7" class="domino-game-table__table-tiles-block-7 domino-game-table__table-tiles-block"></div>
            <div id="8" class="domino-game-table__table-tiles-block-8 domino-game-table__table-tiles-block"></div>
            <div id="9" class="domino-game-table__table-tiles-block-9 domino-game-table__table-tiles-block"></div>
          </div>
          <div
            class="domino-game-table__enemy-player domino-enemy-player domino-enemy-player-1"
          >
            <div class="domino-enemy-player__img">
              <img src="img/profile.png" alt="" /><span>0</span>
            </div>
            <div class="domino-enemy-player__info">
              <h2 class="domino-enemy-player__name">Anonymus</h2>
              <span class="domino-enemy-player__score">0/165</span>
            </div>
          </div>
          <div class="domino-table-store">
            <div class="domino-table-store__text">Базар</div>
            <div class="domino-table-store__score">0</div>
          </div>
        </div>
      </div>
    </div>
    <div class="domino-game-page__footer">
      <div class="domino-game-user">
        <div class="domino-game-user__avatar">
          <div class="user-avatar__image shaded">
            <img src="img/profile.png" alt="" />
          </div>
          <div class="user-avatar__countdown">25</div>
        </div>
        <div class="domino-game-user__info">
          <div class="domino-game-user__name">Anonymus</div>
          <div class="domino-game-user__score"><span>0</span>/165</div>
        </div>
      </div>
      <div class="domino-game__tiles">
        
      </div>
      <div class="domino-game__buttons">
        <button class="domino-game__button chat-button">
          <img src="img/chat-icon.png" alt="" />
        </button>
        <button class="domino-game__button emoji-button">
          <img src="img/smile-chat-icon.png" alt="" />
        </button>
      </div>
    </div>
  </div>
  </section>
  `;

  const emojiButton = document.querySelector(".emoji-button");
  const textButton = document.querySelector(".chat-button");

  emojiButton.addEventListener("click", () => {
    impPopup.openEmojiPopup();
  });

  textButton.addEventListener("click", () => {
    impPopup.openTextPopup();
  });
}
