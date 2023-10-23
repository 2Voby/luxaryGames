import * as impAuth from "./modules/pages/authorization.js";
import * as impLotoNav from "./modules/loto/loto-navigation.js";
import * as impWSNavigation from "./modules/ws-navigation.js";
import * as impNav from "./modules/navigation.js";
import * as impHttp from "./modules/http.js";
import * as impAdminNav from "./modules/pages/admin-navigation.js";
import * as impMoveElement from "./modules/move-element.js";
import * as impLocalization from "./modules/localize.js";
import * as impPopup from "./modules/pages/popup.js";
import * as impDominoGame from "./modules/domino/domino-game.js";
window.ws = null;
// impDominoGame.tablePlacement();

let preloader = document.querySelector(".page-preloader");
let siteLanguage = await impLocalization.getCurrentSiteLang();
window.siteLanguage = siteLanguage;
impLocalization.translateMainPage();
impLocalization.translateAuthPage();
console.log(siteLanguage);
impAuth.registrationForm();
impAuth.createLoginForm();

impNav.applyDefaultSettings();

impNav.addUnauthorizedHashListeners();

if (await impAuth.isAuth()) {
  // preloader.classList.remove("d-none");
  location.hash = "";
  impNav.hideAuthorization();

  if (await impAuth.isAdmin()) {
    impAdminNav.createAdminButton();
  }
  let ws = impWSNavigation.connectWebsocketFunctions();
  impNav.pageNavigation(ws);
  impNav.addHashListeners(ws);
  // impNav.addHashListenersWS(ws);

  impNav.addListeners(ws);
  // preloader.classList.add("d-none");
}

// розблокировать чат после f5 а то он будет заблочен
window.isChatBlocked = false;

// если сайт стал офлайн то показываем окно ошибки

window.addEventListener("offline", (event) => {
  let siteLanguage = window.siteLanguage;
  impPopup.openConnectionErorPopup(
    `${siteLanguage.popups.connectionErrorText}`
  );
});
