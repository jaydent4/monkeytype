// this file should be concatenated at the top of the legacy ts files
import "jquery-color";
import "jquery.easing";

import "./event-handlers/global";
import "./event-handlers/footer";
import "./event-handlers/keymap";
import "./event-handlers/test";
import "./event-handlers/about";
import "./event-handlers/settings";
import "./event-handlers/account";
import "./event-handlers/leaderboards";
import "./event-handlers/login";

import "./modals/google-sign-up";

import "./firebase";
import * as Logger from "./utils/logger";
import * as DB from "./db";
import "./ui";
import "./elements/settings/account-settings-notice";
import "./controllers/ad-controller";
import Config, { loadFromLocalStorage } from "./config";
import * as TestStats from "./test/test-stats";
import * as Replay from "./test/replay";
import * as TestTimer from "./test/test-timer";
import * as Result from "./test/result";
import "./controllers/account-controller";
import { enable } from "./states/glarses-mode";
import "./test/caps-warning";
import "./modals/simple-modals";
import * as CookiesModal from "./modals/cookies";
import "./controllers/input-controller";
import "./ready";
import "./controllers/route-controller";
import "./pages/about";
import "./elements/scroll-to-top";
import * as Account from "./pages/account";
import "./elements/no-css";
import { egVideoListener } from "./popups/video-ad-popup";
import "./states/connection";
import "./test/tts";
import "./elements/fps-counter";
import "./controllers/profile-search-controller";
import { isDevEnvironment } from "./utils/misc";
import * as VersionButton from "./elements/version-button";
import * as Focus from "./test/focus";
import { getDevOptionsModal } from "./utils/async-modules";
import * as Sentry from "./sentry";
import * as Cookies from "./cookies";

// Lock Math.random
Object.defineProperty(Math, "random", {
  value: Math.random,
  writable: false,
  configurable: false,
  enumerable: true,
});

// Freeze Math object
Object.freeze(Math);

// Lock Math on window
Object.defineProperty(window, "Math", {
  value: Math,
  writable: false,
  configurable: false,
  enumerable: true,
});

function addToGlobal(items: Record<string, unknown>): void {
  for (const [name, item] of Object.entries(items)) {
    //@ts-expect-error dev
    window[name] = item;
  }
}

void loadFromLocalStorage();
void VersionButton.update();
Focus.set(true, true);

const accepted = Cookies.getAcceptedCookies();
if (accepted === null) {
  CookiesModal.show();
} else {
  Cookies.activateWhatsAccepted();
}

addToGlobal({
  snapshot: DB.getSnapshot,
  config: Config,
  toggleFilterDebug: Account.toggleFilterDebug,
  glarsesMode: enable,
  stats: TestStats.getStats,
  replay: Replay.getReplayExport,
  enableTimerDebug: TestTimer.enableTimerDebug,
  getTimerStats: TestTimer.getTimerStats,
  toggleUnsmoothedRaw: Result.toggleUnsmoothedRaw,
  egVideoListener: egVideoListener,
  toggleDebugLogs: Logger.toggleDebugLogs,
  toggleSentryDebug: Sentry.toggleDebug,
});

if (isDevEnvironment()) {
  void import("jquery").then((jq) => {
    addToGlobal({ $: jq.default });
  });
  void getDevOptionsModal().then((module) => {
    module.appendButton();
  });
}
