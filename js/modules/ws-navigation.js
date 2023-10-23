import * as impLotoGame from "./loto/loto-game.js";
import * as impLotoNav from "./loto/loto-navigation.js";
import * as impPopup from "./pages/popup.js";
import * as impHttp from "./http.js";
import * as impNav from "./navigation.js";
import * as authinterface from "./authinterface.js";
import * as impDominoNav from "./domino/domino-navigation.js";
import * as impdominoGame from "./domino/domino-game.js";

let preloader = document.querySelector(".page-preloader");

let lotoTimer = null;
let timerStarted = false;

let intervals = [];
let activeTimers = {
  room1: null,
  room2: null,
  room3: null,
  room4: null,
  room5: null,
};
let activeFinishTimers = {
  room1: null,
  room2: null,
  room3: null,
  room4: null,
  room5: null,
};

export const connectWebsocketFunctions = () => {
  // const ws = new WebSocket(`wss://app.24loto.com/game`);
  // const ws = new WebSocket(`wss://loto-server-new.onrender.com/game`);
  const ws = new WebSocket(`ws://localhost:5001/game`);
  window.ws = ws;
  let clientId = impLotoNav.createClientId();

  let localUser = localStorage.getItem("user");

  if (localUser) {
    localUser = JSON.parse(localUser);
  }

  ws.onopen = () => {
    console.log("Подключение установлено");
    ws.send(
      JSON.stringify({
        clientId: clientId,
        username: localUser.username,
        userId: localUser.userId,
        method: "connectGeneral",
      })
    );
  };

  ws.onmessage = async (event) => {
    let msg = JSON.parse(event.data);
    localUser = JSON.parse(localStorage.getItem("user"));
    let dominoRoomLoader = document.querySelector(".domino-game-loader");

    console.log(msg);
    switch (msg.method) {
      case "connectGeneral":
        break;
      case "logoutUser":
        console.log(msg);
        localStorage.removeItem("token");
        location.username = null;
        localStorage.removeItem("user");
        let disconnectMsg = {
          reason: "anotherConnection",
          page: "mainLotoPage",
        };
        ws.close(1000, JSON.stringify(disconnectMsg));
        impPopup.openAnotherAccountEnterPopup(ws);
        break;
      case "getAllInfo":
        impLotoNav.updateAllRoomsOnline(msg.rooms);
        impLotoNav.updateAllRoomsBet(msg.bank);

        for (let room = 1; room <= 5; room++) {
          let roomTimer = activeTimers[`room${room}`];
          if (roomTimer != null) {
            roomTimer = null;
            clearInterval(roomTimer);
          }
        }

        await impLotoNav.startMenuTimerLobby(
          msg.timers,
          activeTimers,
          activeFinishTimers
        );

        for (let room = 1; room <= 5; room++) {
          if (activeFinishTimers[`room${room}`] != null) {
            clearInterval(activeFinishTimers[`room${room}`]);
            activeFinishTimers[`room${room}`] = null;
          }
        }
        await impLotoNav.startMenuTimerGame(
          msg.timers,
          activeTimers,
          activeFinishTimers
        );
        break;
      case "allRoomsOnline":
        impLotoNav.updateAllRoomsOnline(msg.rooms);
        break;
      case "updateAllRoomsBank":
        impLotoNav.updateAllRoomsBet(msg.bank);
        break;
      case "updateAllRoomsJackpot":
        impLotoNav.updateAllRoomsJackpot(msg.jackpots);
        break;
      case "allRoomsStartTimers":
        for (let room = 1; room <= 5; room++) {
          if (activeTimers[`room${room}`] != null) {
            clearInterval(activeTimers[`room${room}`]);
            activeTimers[`room${room}`] = null;
          }
        }
        await impLotoNav.startMenuTimerLobby(
          msg.timers,
          activeTimers,
          activeFinishTimers
        );
        break;
      case "allRoomsFinishTimers":
        console.log(activeFinishTimers);
        console.log(msg);
        for (let room = 1; room <= 5; room++) {
          if (activeFinishTimers[`room${room}`] != null) {
            clearInterval(activeFinishTimers[`room${room}`]);
            activeFinishTimers[`room${room}`] = null;
          }
        }
        await impLotoNav.startMenuTimerGame(
          msg.timers,
          activeTimers,
          activeFinishTimers
        );
        break;
      case "updateBalance":
        authinterface.updateBalance(msg.balance);
        break;
      case "connectGame":
        console.log(msg);
        // // проверка есть ли юзер в комнате
        // добавление информации о комнате
        impLotoNav.setBet(msg);
        impLotoNav.updateOnline(msg.online);
        if (msg.startedAt != null) {
          console.log(msg.startedAt);
          impLotoNav.deleteExitButton();
          if (lotoTimer == null) {
            impLotoNav.startLotoTimer(
              msg.startedAt,
              activeTimers,
              activeFinishTimers
            );
          }
        }

        impLotoNav.updatIngameBank(msg.bank);

        if (msg.isJackpotPlaying == true) {
          impLotoNav.animateJackpot();
        }

        let { data: userTickets } = await impHttp.getTickets();
        const userTickesInRoom = userTickets.filter(
          (ticket) => ticket.gameLevel == msg.roomId
        );

        if (msg.userId == localUser.userId && !userTickesInRoom.length) {
          // создаём билет если только зашел в комнату
          let ticketData = impLotoGame.generateLotoCard();
          let cells = ticketData.newCard;
          let ticketId = ticketData.id;
          impLotoNav.createTicket(cells, ticketId);
        }
        break;
      case "disconnectGame":
        impLotoNav.setBet(msg);
        impLotoNav.updateOnline(msg.online);
        // updateBank(msg);
        break;
      case "buyTickets":
        if (msg.isBought == false) {
          impPopup.openErorPopup(siteLanguage.popups.ticketBuyError);
          return;
        }
        impLotoNav.deleteTickets();
        impLotoNav.createTickets(msg);
        // update counter
        const counter = document.querySelector(
          ".loto-gamecontrolls__counter__value"
        );
        counter.innerHTML = document.querySelectorAll(
          ".loto-gamemain__ticket"
        ).length;

        break;

      case "didntBoughtTickets":
        let bet = 0;
        switch (msg.roomId) {
          case 1:
            bet = 0.2;
            break;
          case 2:
            bet = 0.5;
            break;
          case 3:
            bet = 1;
            break;
          case 4:
            bet = 5;
            break;
          case 5:
            bet = 10;
            break;
        }
        // countCards(ws, msg.roomId, bet);
        ws.close(
          1000,
          JSON.stringify({
            roomId: msg.roomId,
            bet: bet,
            userId: localUser.userId,
            username: localUser.username,
            method: "disconnectGame",
            page: "mainLotoPage",
          })
        );
        impPopup.openErorPopup("Вы не купили билеты для игры!");
        break;
      case "updateRoomTimer":
        console.log(msg);
        if (msg.startedAt != null) {
          console.log(msg.startedAt);
          if (lotoTimer == null) {
            impLotoNav.deleteExitButton();
            impLotoNav.startLotoTimer(
              msg.startedAt,
              activeTimers,
              activeFinishTimers
            );
          }
        }
        break;

      case "updateBank":
        impLotoNav.updateBank(msg.bank);
        break;
      case "updateJackpot":
        impLotoNav.updateJackpot(msg.jackpot);
        break;
      case "updateAllRoomsPrevBank":
        impLotoNav.updatePrevBanks(msg.prevBank);
        break;
      case "updateOnline":
        impLotoNav.updateOnline(msg.online);
        break;
      case "openGame":
        console.log(msg);
        location.hash = `#loto-game-${msg.roomId}?bet=${msg.bet}&bank=${msg.bank}&jackpot=${msg.jackpot}&online=${msg.online}&isJackpotPlaying=${msg.isJackpotPlaying}&sound=true`;
        break;
      case "sendNewCask":
        impLotoGame.createCask(ws, msg.cask, msg.caskNumber, msg.pastCasks);
        // await impLotoGame.colorDropedCasks(msg.pastCasks);
        break;

      case "jackpotWon":
        impLotoGame.showJackpotWon(msg.winner, msg.sum);
        localStorage.setItem("jackpotWon", JSON.stringify(true));

        break;

      case "winGame":
        console.log(msg);
        impLotoGame.checkWin(
          msg.winners,
          msg.bank,
          msg.winnersAmount,
          msg.isJackpotWon,
          msg.jackpotData,
          msg.winnersData
        );
        localStorage.setItem("pastCasks", JSON.stringify([]));
        localStorage.setItem("jackpotWon", JSON.stringify(false));
        localStorage.setItem("ticketsInfo", JSON.stringify([]));
        break;
      case "leftSome":
        switch (msg.type) {
          case "left1":
            impLotoNav.handleLeftSome(msg, "left1");
            break;
          case "left2":
            impLotoNav.handleLeftSome(msg, "left2");
            break;
          case "left3":
            impLotoNav.handleLeftSome(msg, "left3");
            break;
        }
        break;
      case "rejectGameBet":
        if (msg.error > 0) {
          impPopup.open("Ошибка выхода из игры", 300);
        } else {
          authinterface.updateBalance(msg.newBalance);
        }
        break;

      // ================== DOMINO ==================

      case "connectDomino":
        impDominoNav.addOnlineToTable(msg);
        let user = localStorage.getItem("user");
        user = JSON.parse(user);
        if (msg.userId == user.userId) {
          window.location.hash = `domino-room-table/${msg.dominoRoomId}/${msg.tableId}/${msg.playerMode}/${msg.gameMode}`;
        }
        // window.location.hash = `domino-room-table/${msg.dominoRoomId}/${msg.tableId}/${msg.playerMode}/${msg.gameMode}`;
        break;

      case "getAllDominoInfo":
        await impDominoNav.addDominoRoomsInfo(msg);
        break;

      case "startDominoTableTimerMenu":
        await impDominoNav.createDominoTimer(msg);
        break;

      case "startDominoTableTimerTable":
        impPopup.openDominoTimerPopup();
        break;

      case "waitingTableData":
        let roomOnline = msg.online;
        const isPopupOpened =
          document.querySelector(".domino-waiting-popup") != null;
        if (!isPopupOpened) {
          if (!msg.isStarted) {
            impPopup.openDominoWaitingPopup(
              roomOnline,
              msg.dominoRoomId,
              msg.tableId,
              msg.playerMode,
              msg.gameMode
            );
          }
        } else {
          impPopup.updateDominoWaitingPopup(roomOnline);
        }

        break;

      case "startDominoGameTable":
        localStorage.removeItem("dominoGameScene");
        window.currentTurn = msg.turn;
        impdominoGame.dropTableInfo();
        console.log(msg.scene);
        localStorage.setItem("dominoGameScene", JSON.stringify(msg.scene));
        impdominoGame.setDominoTableInfo(msg);
        impdominoGame.setDominoTurn(msg.turn, msg.turnTime);
        impdominoGame.tilesState(msg.turn, [], msg.continued, true);
        impdominoGame.tilesController(
          msg.dominoRoomId,
          msg.tableId,
          msg.playerMode,
          msg.gameMode
        );
        let roomStartPreloader = document.querySelector(
          ".domino-game-room__preloader"
        );
        if (roomStartPreloader) {
          roomStartPreloader.remove();
        }
        break;

      case "newDominoTurn":
        localStorage.setItem("dominoGameScene", JSON.stringify(msg.scene));

        window.currentTurn = msg.currentTurn;
        impdominoGame.setDominoTurn(msg.currentTurn, msg.turnTime);
        impdominoGame.tilesState(msg.currentTurn, msg.scene);
        if (
          msg.skipedTurn.skipedTurn == true &&
          msg.skipedTurn.playerId == localUser.userId
        ) {
          impdominoGame.showAutoTurnWindow(true);
        }

        if (msg.skipedTurn.skipedTurn) {
          impdominoGame.showSkippedEnemyTurn(msg.skipedTurn.playerId);
        }

        if (dominoRoomLoader) {
          dominoRoomLoader.remove();
        }
        break;

      case "deleteInventoryTile":
        impdominoGame.deletePlayerTiles(msg.deletedTileId, msg.tiles);
        break;

      case "updateDominoGameScene":
        impdominoGame.updateGameScene(msg.scene);
        break;

      case "openTileMarket":
        impdominoGame.openTilesMarket(msg.market);

        break;

      case "getMarketTile":
        impdominoGame.getMarketTile(msg.tile, msg);
        break;

      case "updateUserTiles":
        // получаем масив всех доминошек
        impdominoGame.drawPlayerTiles(msg.tiles);
        // impdominoGame.tilesState(msg.turn, msg.scene);
        impdominoGame.tilesController(
          msg.dominoRoomId,
          msg.tableId,
          msg.playerMode,
          msg.gameMode
        );
        break;

      case "updateMarketNumber":
        impdominoGame.updateMarketNum(msg.marketNumber, msg.player);
        break;

      case "updateEnemysTilesCount":
        impdominoGame.updateEnemysTilesCount(msg.playerTilesData);
        break;

      case "winDominoGame":
        impdominoGame.dropTableInfo();
        authinterface.updateBalance(localUser.balance + msg.prize - msg.bet);
        impPopup.openDominoWinGame(msg.winners, msg.playersTiles);
        if (dominoRoomLoader) {
          dominoRoomLoader.remove();
        }
        break;

      case "endDominoGame":
        impdominoGame.dropTableInfo();
        authinterface.updateBalance(localUser.balance - msg.lostAmount);
        impPopup.openDominoLoseGame(msg.winners, msg.playersTiles);
        const userData = JSON.parse(localStorage.getItem("user"));
        userData.balance -= msg.lostAmount;
        localStorage.setItem("user", JSON.stringify(userData));
        if (dominoRoomLoader) {
          dominoRoomLoader.remove();
        }
        break;

      case "endAndCloseDominoGame":
        let disconnectDomninoMsg = {
          reason: "createNewWs",
          page: "mainDominoPage",
        };

        let popups = document.querySelectorAll(".popup");
        popups.forEach((popup) => {
          popup.remove();
        });
        if (dominoRoomLoader) {
          dominoRoomLoader.remove();
        }

        window.ws.close(1000, JSON.stringify(disconnectDomninoMsg));

        break;

      case "reconnectDominoGame":
        localStorage.setItem("dominoGameScene", JSON.stringify(msg.scene));
        if (msg.turnTime) {
          window.currentTurn = +msg.turn;
          impdominoGame.reconnectFillTable(msg);
          let roomPreloader = document.querySelector(
            ".domino-game-room__preloader"
          );

          if (roomPreloader) {
            roomPreloader.remove();
          }
          if (dominoRoomLoader) {
            dominoRoomLoader.remove();
          }
        }

        break;

      case "reconnectEndedDominoGame":
        impPopup.openFinisedGamePopup();
        break;

      case "finishTelephoneRound":
        impdominoGame.dropTableInfo();
        impPopup.openDominoTelephoneRoundFinishPopup(
          msg.lastWinnerScore,
          msg.lastWinnerUsername,
          msg.playersScore,
          msg.lastWinnerPrevScore,
          msg.lastWinnerId,
          msg.playersTiles
        );
        if (dominoRoomLoader) {
          dominoRoomLoader.remove();
        }
        break;

      case "notEnoughBalance":
        impPopup.openErorPopup("Недостаточно средств на балансе", 300);
        break;

      case "sendEmoji":
        impdominoGame.showEmoji(msg);
        break;

      case "sendPhrase":
        impdominoGame.showPhrase(msg);
        break;

      case "updatePlayerScore":
        impdominoGame.updatePlayerScore(msg.userId, msg.score, msg.addedScore);
        break;
    }
  };

  ws.onclose = (info) => {
    console.log(info);

    // если вебсокет был закрыт изза проблем с интернетом или другими проблемами клиента
    if (info.code == 1006) {
      if (navigator.onLine) {
        const newWs = connectWebsocketFunctions();
        window.ws = newWs;
        location.hash = "#";
        impNav.pageNavigation(newWs);
        impNav.addHashListeners();
      }
      return;
    }

    // проверяем на reason ответ от вебсокетов
    if (info.reason != "" && info.reason != " ") {
      let infoReason = JSON.parse(info.reason);
      if (infoReason != "" && infoReason.reason == "anotherConnection") {
        return;
      } else {
        if (window.ws) {
          let disconnectMsg = { reason: "createNewWs", page: "mainLotoPage" };
          window.ws.close(1000, JSON.stringify(disconnectMsg));
        }

        console.log(infoReason.page);
        switch (infoReason.page) {
          case "mainLotoPage":
            location.hash = "#";
            break;

          case "mainDominoPage":
            location.hash = "#domino-choose";
            break;
          // default:
          //   location.hash = "";

          //   break;
        }

        const newWs = connectWebsocketFunctions();
        window.ws = newWs;
        impNav.pageNavigation(newWs);
        impNav.addHashListeners();
        return;
      }
    } else {
      if (window.ws) {
        let disconnectMsg = { reason: "createNewWs", page: "mainLotoPage" };
        window.ws.close(1000, JSON.stringify(disconnectMsg));
      }
      switch (infoReason.page) {
        case "mainLotoPage":
          location.hash = "#";
          break;

        case "mainDominoPage":
          location.hash = "#domino-choose";
          break;
        default:
          location.hash = "#";

          break;
      }
      const newWs = connectWebsocketFunctions();
      window.ws = newWs;
      impNav.pageNavigation(newWs);
      impNav.addHashListeners();
    }
  };

  return ws;
};
