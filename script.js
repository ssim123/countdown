// ====== Sydney time config ======
const SYDNEY_OFFSET = "+11:00";

// Trip window 
const TRIP_START = new Date(`2026-02-14T00:00:00${SYDNEY_OFFSET}`);
const RETURN_TIME = new Date(`2026-03-10T06:40:00${SYDNEY_OFFSET}`);

// Messages
const SCHEDULE = [
  { date: `2026-02-14T00:00:00${SYDNEY_OFFSET}`, text: "happy valentines day baby!" },
  { date: `2026-02-15T00:00:00${SYDNEY_OFFSET}`, text: "last day together :(((((" },
  { date: `2026-02-16T00:00:00${SYDNEY_OFFSET}`, text: "i’ll miss you :((( but cant wait to show u what i get up to in the #motherland " },
  { date: `2026-02-17T00:00:00${SYDNEY_OFFSET}`, text: "i hope miles and puffles are getting along <3 " },
  { date: `2026-02-18T00:00:00${SYDNEY_OFFSET}`, text: "cant stop thinking about you " },
  { date: `2026-02-19T00:00:00${SYDNEY_OFFSET}`, text: "hope u enjoy a slay run this morning 😋" },
  { date: `2026-02-20T00:00:00${SYDNEY_OFFSET}`, text: "wedding day!!! hope i can send u some slay pics 😎😎" },
  { date: `2026-02-21T00:00:00${SYDNEY_OFFSET}`, text: "already thinking about giving you the BIGGEST hug when im back!!" },
  { date: `2026-02-22T00:00:00${SYDNEY_OFFSET}`, text: "wonder what ur meal prepping today!!! cant wait until we can have dinner together again" },
  { date: `2026-02-23T00:00:00${SYDNEY_OFFSET}`, text: "hope u got a good sleep and u can enjoy ur day today <33 miss you" },
  { date: `2026-02-24T00:00:00${SYDNEY_OFFSET}`, text: "office today! hope u have fun w the guys!!" },
  { date: `2026-02-25T00:00:00${SYDNEY_OFFSET}`, text: "shrinking day!!! hope this ep doesnt make u cry tooooo much " },
  { date: `2026-02-26T00:00:00${SYDNEY_OFFSET}`, text: "i know ur killing ur study sessions, brain is going crazy 🙂‍↕️🙂‍↕️" },
  { date: `2026-02-27T00:00:00${SYDNEY_OFFSET}`, text: "weekly 50 today! cant wait until were back doing it together <3" },
  { date: `2026-02-28T00:00:00${SYDNEY_OFFSET}`, text: "weekend time!! hope ur chillaxing to the max" },
  { date: `2026-03-01T00:00:00${SYDNEY_OFFSET}`, text: "hope ur morning run puts u in a good mood!" },
  { date: `2026-03-02T00:00:00${SYDNEY_OFFSET}`, text: "missing my monkey like crazy today, you make my life so much brighter and softer" },
  { date: `2026-03-03T00:00:00${SYDNEY_OFFSET}`, text: "hope today was kind to you <3" },
  { date: `2026-03-04T00:00:00${SYDNEY_OFFSET}`, text: "oooh gym ben today! smash ur sesh cant wait to see u and ur big muscles again 😋" },
  { date: `2026-03-05T00:00:00${SYDNEY_OFFSET}`, text: "FOOTYS BACK WOOHOO!! get ready for a charlie curnow masterclass (or disasterclass)" },
  { date: `2026-03-06T00:00:00${SYDNEY_OFFSET}`, text: "not loooooong now ben 😽 (good luck w geelong tonight, im sure dicky will be cheering them on)" },
  { date: `2026-03-07T00:00:00${SYDNEY_OFFSET}`, text: "pls send me a miles update 🙏 missing my son (and u obvi)" },
  { date: `2026-03-08T00:00:00${SYDNEY_OFFSET}`, text: "ooooh were getting close now 😋 lich will be in ur arms sooooo soon ben!" },
  { date: `2026-03-09T00:00:00${SYDNEY_OFFSET}`, text: "one more sleep!!! bags are packed!!" },
  { date: `2026-03-10T06:40:00${SYDNEY_OFFSET}`, text: "WOHOOOOO IM BACK BABYYYYY CANT WAIT TO SEE YOU" }
];

const MESSAGES = SCHEDULE.map(x => x.text);
const UNLOCK_DATES = SCHEDULE.map(x => new Date(x.date));

// localStorage keys
const LS_OPENED = "countdown_opened_v2";  // { [index]: true }
const LS_BURSTED = "countdown_bursted_v2"; // { [index]: true }

// ====== Helpers ======
const $ = (sel) => document.querySelector(sel);

function clamp(n, a, b) {
  return Math.min(b, Math.max(a, n));
}
function pad2(n) {
  return String(n).padStart(2, "0");
}
function loadMap(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
function saveMap(key, obj) {
  localStorage.setItem(key, JSON.stringify(obj));
}
function formatUnlockDate(d) {
  // "Sat 14 Feb"
  return new Intl.DateTimeFormat("en-AU", {
    weekday: "short",
    day: "2-digit",
    month: "short"
  }).format(d);
}

// ====== Unlock logic ======
function getUnlockDateForIndex(i) {
  return UNLOCK_DATES[i];
}
function isUnlocked(i, now = new Date()) {
  return now.getTime() >= getUnlockDateForIndex(i).getTime();
}

// ====== Countdown + progress ======
function tickCountdown() {
  const now = new Date();
  const diff = RETURN_TIME.getTime() - now.getTime();

  const statusLine = $("#statusLine");
  const progressText = $("#progressText");
  const progressPct = $("#progressPct");
  const barFill = $("#barFill");
  const bar = document.querySelector(".bar");

  if (diff <= 0) {
    $("#days").textContent = "0";
    $("#hours").textContent = "0";
    $("#minutes").textContent = "0";
    $("#seconds").textContent = "0";
    statusLine.textContent = "she’s back!!! ";
    progressText.textContent = "progress (complete)";
    progressPct.textContent = "100%";
    barFill.style.width = "100%";
    bar?.setAttribute("aria-valuenow", "100");
    return;
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  $("#days").textContent = String(days);
  $("#hours").textContent = pad2(hours);
  $("#minutes").textContent = pad2(minutes);
  $("#seconds").textContent = pad2(seconds);

  // progress bar: Feb 14 00:00 -> Mar 10 06:40
  const totalTrip = RETURN_TIME.getTime() - TRIP_START.getTime();
  const elapsed = now.getTime() - TRIP_START.getTime();
  const pct = clamp((elapsed / totalTrip) * 100, 0, 100);
  const pctRounded = Math.floor(pct);

  barFill.style.width = `${pct}%`;
  progressPct.textContent = `${pctRounded}%`;
  bar?.setAttribute("aria-valuenow", String(pctRounded));

  if (now.getTime() < TRIP_START.getTime()) {
    statusLine.textContent = "countdown is ready 💌";
  } else {
    statusLine.textContent = "a new note unlocks each day ♡";
  }
}

// ====== Heart burst FX ======
function burstHeartsAt(x, y, count = 22) {
  const layer = $("#fx-layer");
  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "particle";

    const x0 = x + (Math.random() * 16 - 8);
    const y0 = y + (Math.random() * 16 - 8);

    const dx = (Math.random() * 240 - 120);
    const dy = -(Math.random() * 220 + 80);

    const rot = (Math.random() * 140 - 70) + "deg";

    p.style.setProperty("--x0", `${x0}px`);
    p.style.setProperty("--y0", `${y0}px`);
    p.style.setProperty("--x1", `${x0 + dx}px`);
    p.style.setProperty("--y1", `${y0 + dy}px`);
    p.style.setProperty("--r", rot);
    p.style.animationDelay = `${Math.random() * 120}ms`;

    layer.appendChild(p);
    p.addEventListener("animationend", () => p.remove());
  }
}

// ====== Messages UI ======
function renderMessages() {
  const list = $("#messageList");
  list.innerHTML = "";

  const now = new Date();
  const opened = loadMap(LS_OPENED);
  const bursted = loadMap(LS_BURSTED);

  MESSAGES.forEach((text, i) => {
    const unlocked = isUnlocked(i, now);
    const unlockDate = getUnlockDateForIndex(i);

    const row = document.createElement("div");
    row.className = "msg";

    const left = document.createElement("div");
    left.className = "msg-left";

    const title = document.createElement("div");
    title.className = "msg-title";
    title.textContent = `day ${i + 1}`;

    const body = document.createElement("div");
    body.className = "msg-body";

    const meta = document.createElement("div");
    meta.className = "msg-meta";

    if (!unlocked) {
      body.textContent = "🔒 locked";
      meta.textContent = `unlocks ${formatUnlockDate(unlockDate)}`;
    } else {
      body.textContent = opened[i] ? text : "click to open ♡";
      meta.textContent = opened[i] ? "opened" : `unlocked ${formatUnlockDate(unlockDate)}`;
    }

    left.appendChild(title);
    left.appendChild(body);
    left.appendChild(meta);

    const btn = document.createElement("button");
    btn.type = "button";

    if (!unlocked) {
      btn.className = "pill locked";
      btn.textContent = "locked";
      btn.disabled = true;
    } else {
      btn.className = "pill";
      btn.textContent = opened[i] ? "opened ✓" : "open";

      btn.addEventListener("click", () => {
        const openedNow = loadMap(LS_OPENED);
        const burstedNow = loadMap(LS_BURSTED);

        // reveal
        openedNow[i] = true;
        saveMap(LS_OPENED, openedNow);

        // burst 
        if (!burstedNow[i]) {
          const rect = btn.getBoundingClientRect();
          burstHeartsAt(rect.left + rect.width / 2, rect.top + rect.height / 2, 24);
          burstedNow[i] = true;
          saveMap(LS_BURSTED, burstedNow);
        }

        renderMessages();
      });
    }

    row.appendChild(left);
    row.appendChild(btn);
    list.appendChild(row);
  });
}

// ====== Init ======
function init() {
  tickCountdown();
  renderMessages();

  setInterval(() => {
    tickCountdown();
    renderMessages(); 
  }, 1000);
}

init();
