import { idCompareSort, getCityFromIP } from './utils.js';
import { calculateIdIndexSums } from './ballot.js';
import { mock_db_bracket, renderBracket } from './bracket.js';

import { getCurrentUser, setCurrentUser, handleLogin, authedUserDisplay, handleLogout, forgotPassword, validateInputs, handleSignup, toggleAuthMode } from './auth.js';

import { db_client, PICKERS } from './db_init.js';

/* INITIALIZE AUTHENTICATION UX */
const userDisplay = document.getElementById('userDisplay');
const menuContainer = document.getElementById('userMenu');
const userDropdownMenu = document.getElementById("userDropdown");
const userTrigger = document.querySelector(".User-Trigger");
const userAvatar = document.getElementById('userAvatarInitials');

const loginBtn = document.getElementById("loginBtn");
const loginCloseBtn = document.getElementById("loginCloseBtn");

const logoutBtn = document.getElementById("logoutBtn");

const overlay = document.getElementById("loginOverlay");

const authBox = document.querySelector(".Auth-Box");
const signupForm = document.getElementById("signupForm");
const signupSubmitBtn = signupForm.querySelector("button");
const signupContent = document.getElementById("signup-content");

const successContent = document.getElementById("signup-success");
const successBtn = successContent.querySelector("button");

const errorBox = document.getElementById("signup-error-msg");
const newUsername = document.getElementById("new-username");
const newEmail = document.getElementById("new-email");
const newPassword = document.getElementById("new-password");
const newReferral = document.getElementById("new-referral");

const loginView = document.getElementById('view-login');
const signupView = document.getElementById('view-signup');
const forgotView = document.getElementById('view-forgot');
const modalBox = document.getElementById('mainModalBox');

const forgotToggle = document.getElementById('forgotToggle');
const signupToggle = document.getElementById('signupToggle');
const signinToggle = document.getElementById('signinToggle');
const loginToggle = document.getElementById('loginToggle');

const forgotPasswordForm = document.getElementById('forgotPasswordForm');
const forgotEmail = document.getElementById('forgot-email');

const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

/* FORM */
function openLoginModal() {
  scrollPosition = window.scrollY;

  overlay.classList.add("open");

  document.body.classList.add("drawer-open");
  document.body.style.top = `-${scrollPosition}px`;
}
loginBtn.addEventListener('click', function() {
  openLoginModal();
});

function closeLoginModal(event) {
  if (event && !event.target.classList.contains("Modal-Overlay")) {
    return;
  }

  overlay.classList.remove("open");

  document.body.classList.remove("drawer-open");
  document.body.style.top = "";
  window.scrollTo(0, scrollPosition);
}
loginCloseBtn.addEventListener('click', function() {
  closeLoginModal();
});
overlay.addEventListener('click', function(event) {
  closeLoginModal(event);
});

loginToggle.addEventListener('click', function() {
  toggleAuthMode('login', loginView, signupView, forgotView, modalBox);
});
signinToggle.addEventListener('click', function() {
  toggleAuthMode('login', loginView, signupView, forgotView, modalBox);
});
signupToggle.addEventListener('click', function() {
  toggleAuthMode('signup', loginView, signupView, forgotView, modalBox);
});
forgotToggle.addEventListener('click', function() {
  toggleAuthMode('forgot', loginView, signupView, forgotView, modalBox);
});

/* LOGIN */
loginForm.addEventListener('submit', async function(event) {
  event.preventDefault();
  await handleLogin(usernameInput, passwordInput);
  authedUserDisplay(loginBtn, unauthedPicksContainer, menuContainer, userDisplay, userAvatar, deleteCommentBtns);
  closeLoginModal();
});

/* SIGN UP */
signupForm.addEventListener('submit', function(event) {
  event.preventDefault();
  handleSignup(newUsername, newEmail, newPassword, newReferral, errorBox, signupSubmitBtn, signupContent, successContent, authBox);
});
newPassword.addEventListener('blur', function() {
  validateInputs(errorBox, newReferral, newPassword);
});
newReferral.addEventListener('blur', function() {
  validateInputs(errorBox, newReferral, newPassword);
});

function resetSignupView() {
  closeLoginModal();

  setTimeout(() => {
    signupContent.style.display = "block";
    successContent.style.display = "none";
    toggleAuthMode("login", loginView, signupView, forgotView, modalBox);
  }, 300);
}
successBtn.addEventListener('click', function() { 
  resetSignupView();
});

/* FORGOT */
forgotPasswordForm.addEventListener('submit', function(event) {
  event.preventDefault();
  forgotPassword(forgotEmail.value);
  toggleAuthMode('login', loginView, signupView, forgotView, modalBox);
});

/* USER SETTINGS & LOGOUT */
logoutBtn.addEventListener('click', function() {
  handleLogout(menuContainer, loginBtn, userDropdownMenu);
});

function toggleUserDropdown(event) {
  // Prevent the click from immediately bubbling up and closing the menu
  if (event) event.stopPropagation();

  const isActive = userDropdownMenu.classList.contains("active");

  if (isActive) {
    closeDropdown();
  } else {
    userDropdownMenu.classList.add("active");
    document.addEventListener("click", closeDropdownOnClickOutside);
  }
}
function closeDropdown() {
  if (userDropdownMenu) {
    userDropdownMenu.classList.remove("active");
    document.removeEventListener("click", closeDropdownOnClickOutside);
  }
}
function closeDropdownOnClickOutside(event) {
  // If the click is NOT inside the menu AND NOT on the trigger button
  if (userDropdownMenu && !userDropdownMenu.contains(event.target) && !userTrigger.contains(event.target)) {
    closeDropdown();
  }
}
userTrigger.addEventListener('click', function(event) { 
  toggleUserDropdown(event);
});


















/* QUICK DATE HELPER */
function dateFromTimestamp(ts, opt = 'text') {
  const d = new Date(ts);
  let date;
  if (opt === 'text') {
    date = d.toLocaleString(navigator.language, { month: "short", day: "numeric", weekday: "long" });
  } else {
    date = d.toLocaleString('fr-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
  }
  return date;
}

function getCompactTracker(id) {
    const currEl = document.getElementById(`curr-val-${id}`);
    const totalEl = document.getElementById(`total-val-${id}`);
    return { current: Number(currEl.innerText), total: Number(totalEl.innerText) };
}

function updateCompactTracker(current, total, id) {
    const tracker = document.getElementById(`active-tracker-${id}`);
    const fill = document.getElementById(`bar-fill-${id}`);
    const currEl = document.getElementById(`curr-val-${id}`);
    const totalEl = document.getElementById(`total-val-${id}`);
    
    // 1. Update Text
    currEl.innerText = current;
    totalEl.innerText = total;

    // 2. Calculate Percentage
    let pct = Math.min((current / total) * 100, 100);
    fill.style.width = pct + '%';

    // 3. Status Colors (Blue -> Green)
    if (current >= total) {
        // Finished State
        if (tracker.classList.contains('tracker-v2')) {
            tracker.style.borderLeftColor = '#10B981'; // Green Border
            fill.style.background = '#10B981';
        } else if (tracker.classList.contains('tracker-v3')) {
             fill.style.background = '#d1fae5'; // Light green fill
             tracker.querySelector('.tracker-numbers').style.color = '#059669';
        } else {
            // Default V1
            fill.style.background = '#10B981';
            tracker.querySelector('.tracker-icon').style.color = '#10B981';
        }
    } else {
        // Pending State (Reset to Blue)
        if (tracker.classList.contains('tracker-v2')) {
            tracker.style.borderLeftColor = '#3B82F6';
            fill.style.background = '#3B82F6';
        } else if (tracker.classList.contains('tracker-v3')) {
             fill.style.background = '#e2e8f0';
             tracker.querySelector('.tracker-numbers').style.color = '#3B82F6';
        } else {
            fill.style.background = '#3B82F6';
            tracker.querySelector('.tracker-icon').style.color = '#9ca3af';
        }
    }
}




/* GLOBAL VARS */

var CONF_TOURNEY_PICKS;

const currentDate = new Date();
// should make this const and introduce SELECTED_WEEK
let CURRENT_WEEK = 19;

const TEAMS_ENDPOINT =
  "https://qeuvposbesblckyuflbd.supabase.co/rest/v1/Teams?order=conf.asc,conf_pos.asc";
const D1_ENDPOINT =
  "https://qeuvposbesblckyuflbd.supabase.co/rest/v1/D1?order=name.asc";
const COMMENTS_ENDPOINT =
  "https://qeuvposbesblckyuflbd.supabase.co/rest/v1/Comments";
const USERS_ENDPOINT = "https://qeuvposbesblckyuflbd.supabase.co/rest/v1/Users";

const ANON_API_KEY = "sb_publishable_mZVo1bfw-ChB9iCx1V5QwA_UUKrCx8o";
TEAMS = await fetchD1();

let CACHED_COMMENTS_DB = [];

let currentCellId = null;
let queryString;

var scrollPosition;

var ALL_GAMES = [];
var GAMES = [];
var TEAMS;
var FILTER = null;

let showingAllPicks = false;
let showingConfTourney = false;
let activeSelectorSource = 'top25';
let activeConfTourneyId = null;

const confTourneyBtn = document.getElementById('confTourneyBtn');
const confTourneySection = document.getElementById('confTourneySection');

// Mock-only conference tourney picks state.
const mockDB = {
  users: [
    { id: 'CO', label: 'CookedByCaptainJack', uuid: 'fa3d35cd-6495-4893-a704-cad39542533f' },
    { id: 'FE', label: 'FearTheBeak', uuid: 'a6a59bf1-97d5-4a9b-b1df-f4439bc9c4e9' },
    { id: 'GA', label: 'Gayson', uuid: 'c310b6e4-1827-4df6-a65d-42e6f7523f58' },
    { id: 'NO', label: 'NotFlorida', uuid: '61e46342-e00e-4ed6-ab69-cd3b060e54cd' },
  ],
  tournaments: [
    {
      id: 'ohio-valley',
      conf: 'Ohio Valley (Evansville, IN)',
      tip: '3/7, 9 p.m. ET (ESPN2)',
    },
    {
      id: 'big-south',
      conf: 'Big South (Johnson City, TN)',
      tip: '3/8, 12 p.m. ET (ESPN2)',
    },
    {
      id: 'missouri-valley',
      conf: 'Missouri Valley (St. Louis, MO)',
      tip: '3/8, 12 p.m. ET (CBS)',
    },
    {
      id: 'asun',
      conf: 'ASUN (Jacksonville, FL)',
      tip: '3/8, 2 p.m. ET (ESPN2)',
    },
    {
      id: 'summit-league',
      conf: 'Summit (Sioux Falls, SD)',
      tip: '3/8, 9 p.m. ET (CBSSN)',
    },
    {
      id: 'southern',
      conf: 'Southern (Asheville, NC)',
      tip: '3/9, 7 p.m. ET (ESPN)',
    },
    {
      id: 'sun-belt',
      conf: 'Sun Belt (Pensacola, FL)',
      tip: '3/9, 7 p.m. ET (ESPN2)',
    },
    {
      id: 'coastal-athletic-association',
      conf: 'CAA (Washington D.C.)',
      tip: '3/10, 7 p.m. ET (CBSSN)',
    },
    {
      id: 'horizon-league',
      conf: 'Horizon (Indianapolis, IN)',
      tip: '3/10, 7 p.m. ET (ESPN)',
    },
    {
      id: 'northeast',
      conf: 'NEC (Campus)',
      tip: '3/10, 7 p.m. ET (ESPN2)',
    },
    {
      id: 'metro-atlantic-athletic',
      conf: 'MAAC (Atlantic City, NJ)',
      tip: '3/10, 9 p.m. ET (ESPN2)',
    },
    {
      id: 'west-coast',
      conf: 'West Coast (Paradise, NV)',
      tip: '3/10, 9 p.m. ET (ESPN)',
    },
    {
      id: 'southland',
      conf: 'Southland (Lake Charles, LA)',
      tip: '3/11, 5 p.m. ET (ESPN2)',
    },
    {
      id: 'patriot-league',
      conf: 'Patriot (Campus)',
      tip: '3/11, 7 p.m. ET (CBSSN)',
    },
    {
      id: 'big-sky',
      conf: 'Big Sky (Boise, ID)',
      tip: '3/11, 11:30 p.m. ET (ESPN2)',
    },
    {
      id: 'america-east',
      conf: 'America East (Campus)',
      tip: '3/14, 11 a.m. ET (ESPN2)',
    },
    {
      id: 'mid-eastern-athletic',
      conf: 'MEAC (Norfolk, VA)',
      tip: '3/14, 1 p.m. ET (ESPN2)',
    },
    {
      id: 'big-12',
      conf: 'Big 12 (Kansas City, MO)',
      tip: '3/14, 6 p.m. ET (ESPN)',
    },
    {
      id: 'mountain-west',
      conf: 'Mountain West (Paradise, NV)',
      tip: '3/14, 6 p.m. ET (CBS)',
    },
    {
      id: 'big-east',
      conf: 'Big East (New York, NY)',
      tip: '3/14, 6:30 p.m. ET (FOX)',
    },
    {
      id: 'southwestern-athletic',
      conf: 'SWAC (College Park, GA)',
      tip: '3/14, 7:30 p.m. ET (ESPNU)',
    },
    {
      id: 'mid-american',
      conf: 'MAC (Cleveland, OH)',
      tip: '3/14, 8 p.m. ET (ESPN2)',
    },
    {
      id: 'atlantic-coast',
      conf: 'ACC (Charlotte, NC)',
      tip: '3/14, 8:30 p.m. ET (ESPN)',
    },
    {
      id: 'conference-usa',
      conf: 'Conference USA (Huntsville, AL)',
      tip: '3/14, 8:30 p.m. ET (CBSSN)',
    },
    {
      id: 'big-west',
      conf: 'Big West (Henderson, NV)',
      tip: '3/14, 10 p.m. ET (ESPN2)',
    },
    {
      id: 'western-athletic',
      conf: 'WAC (Paradise, NV)',
      tip: '3/14, 11:59 p.m. ET (ESPN2)',
    },
    {
      id: 'ivy-league',
      conf: 'Ivy (Ithaca, NY)',
      tip: '3/15, 12 p.m. ET (FOX)',
    },
    {
      id: 'atlantic-10',
      conf: 'Atlantic 10 (Pittsburgh, PA)',
      tip: '3/15, 1 p.m. ET (CBS)',
    },
    {
      id: 'southeastern',
      conf: 'SEC (Nashville, TN)',
      tip: '3/15, 1 p.m. ET (ESPN)',
    },
    {
      id: 'american',
      conf: 'American (Birmingham, AL)',
      tip: '3/15, 3:15 p.m. ET (ESPN)',
    },
    {
      id: 'big-ten',
      conf: 'Big Ten (Chicago, IL)',
      tip: '3/15, 3:30 p.m. ET (CBS)',
    },
  ],
};

async function fetchConfTourneyPicks() {
  return db_client.from("Conf_Tourneys").select("*");
}

async function updateConfTourneyPicks(user_id, data) {
  return db_client.from("Conf_Tourneys").update(data).eq("uuid", user_id);
}

function getConfTourneyColumns() {
  return mockDB.users;
}

function renderConfPickCell(tourney, teamId, teamName, isMasked, isEditable) {
  if (isMasked) {
    return `
      <div class="conf-tourney-pick is-masked">
        <span class="conf-tourney-mask">?</span>
      </div>
    `;
  }

  if (!teamId) {
    return `<div class="conf-tourney-pick is-empty">${isEditable ? 'Tap to choose' : '-'}</div>`;
  }

  return `
    <div class="conf-tourney-pick">
      <img class="conf-tourney-pick-logo" src="https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/${teamId}.png&h=200&w=200" alt="${teamName}">
      <!--<span class="conf-tourney-pick-name">${teamName}</span>-->
    </div>
  `;
}

function renderConfTourneyTable(picks) {
  const tableHead = document.getElementById('confTourneyHead');
  const tableBody = document.getElementById('confTourneyBody');
  const stateChip = document.getElementById('confTourneyStateChip');
  const submitBtn = document.getElementById('confTourneySubmitBtn');
  const resetBtn = document.getElementById('confTourneyResetBtn');

  if (!tableHead || !tableBody) return;

  const isSubmitted = CONF_TOURNEY_PICKS?.find(pick => pick.uuid === getCurrentUser()?.sub)?.submitted;
  const hideOtherUsers = !isSubmitted;
  const columns = getConfTourneyColumns();

  tableHead.innerHTML = `
    <tr class="conf-tourney-row">
      <th class="conf-tourney-head conf-tourney-head--meta">Conference</th>
      ${columns.map((user) => `<th class="conf-tourney-head">

<div class="Avatar" style="background-color: ${getPickerObj(user.id).color};">${user.id}</div>

      </th>`).join('')}
    </tr>
  `;

  tableBody.innerHTML = mockDB.tournaments
    .map((tourney) => {
      const cells = columns
        .map((user) => {
          const isCurrentUser = user.uuid === getCurrentUser()?.sub;
          const isEditable = isCurrentUser && !isSubmitted;
          const pickId = picks.find((pick) => pick.uuid === user.uuid)?.[tourney.id] ?? null;
          const winnerId = picks.find((pick) => pick.uuid === '00000000-0000-0000-0000-000000000000')?.[tourney.id] ?? null;
          const winner = pickId === winnerId;
          const pickName = TEAMS?.find(t => t.id === pickId)?.name ?? null;
          const masked = hideOtherUsers && !isCurrentUser;
          const clickAction = isEditable ? `onclick="openConfTourneySelector('${tourney.id}')"` : '';
          const pickableClass = isEditable ? 'is-pickable' : '';
          const winnerClass = winnerId != null ? (winner ? 'correct' : 'incorrect') : '';

          return `
            <td class="conf-tourney-cell ${pickableClass} ${winnerClass}" ${clickAction}>
              ${renderConfPickCell(tourney, pickId, pickName, masked, isEditable)}
            </td>
          `;
        })
        .join('');

      return `
        <tr class="conf-tourney-row">
          <td class="conf-tourney-cell conf-tourney-cell--meta">
            <div class="conf-tourney-conf">${tourney.conf}</div>
            <div class="conf-tourney-time">${tourney.tip}</div>
          </td>
          ${cells}
        </tr>
      `;
    })
    .join('');

  if (stateChip) {
    stateChip.textContent = isSubmitted ? 'Submitted' : 'Draft';
    stateChip.classList.toggle('is-submitted', isSubmitted);
  }
  if (submitBtn) {
    submitBtn.style.display = isSubmitted ? 'none' : 'inline-flex';
  }
  if (resetBtn) {
    resetBtn.style.display = isSubmitted ? 'inline-flex' : 'none';
  }
}

function setConfTourneyVisibility(shouldShow) {
  showingConfTourney = shouldShow;

  if (confTourneyBtn) {
    confTourneyBtn.classList.toggle('active', shouldShow);
    confTourneyBtn.setAttribute('aria-pressed', String(shouldShow));
  }
  if (confTourneySection) {
    confTourneySection.classList.toggle('is-visible', shouldShow);
  }

  const picksContainer = document.querySelector('.Picks-Container');
  const picksMenu = document.getElementById('picksMenu');
  const weekSelector = document.querySelector('.Week-Select-Input');
  if (picksContainer && picksMenu && weekSelector) {
    picksContainer.style.display = shouldShow ? 'none' : 'flex';
    picksMenu.style.display = shouldShow ? 'none' : 'grid';
    weekSelector.disabled = shouldShow;
  }

  if (shouldShow) {
    fetchConfTourneyPicks().then(res=> {
      CONF_TOURNEY_PICKS = res.data;
      renderConfTourneyTable(res.data);
    });
  }
}

function submitConfTourneyPicks() {
  const myPicks = CONF_TOURNEY_PICKS?.find(pick => pick.uuid === getCurrentUser()?.sub) ?? {};
  const missing = mockDB.tournaments.filter((tourney) => !myPicks[tourney.id]);
  if (missing.length > 0) {
    return alert(`Select winners for all conferences before submitting (${missing.length} remaining).`);
  }

    updateConfTourneyPicks(getCurrentUser().sub,{submitted: true}).then(res1 => {
    fetchConfTourneyPicks().then(res=> {
      CONF_TOURNEY_PICKS = res.data;
      renderConfTourneyTable(res.data);
    });
    });
}
window.submitConfTourneyPicks = submitConfTourneyPicks;

function reopenConfTourneyDraft() {
    return;
    updateConfTourneyPicks(getCurrentUser().sub,{submitted: false}).then(res1 => {
    fetchConfTourneyPicks().then(res=> {
      CONF_TOURNEY_PICKS = res.data;
      renderConfTourneyTable(res.data);
    });
    });
}
window.reopenConfTourneyDraft = reopenConfTourneyDraft;

if (confTourneyBtn) {
  confTourneyBtn.addEventListener('click', () => {
    setConfTourneyVisibility(!showingConfTourney);
  });
}
fetchConfTourneyPicks().then(res=> {
  CONF_TOURNEY_PICKS = res.data;
  renderConfTourneyTable(res.data)
});

function changeWeekView(week) {
  CURRENT_WEEK = week;
  renderAll(true);
  const ballot = document.getElementById("top25Rankings");
  ballot.style.display = "none";
  if (CURRENT_WEEK >= 11) {
    showTop25Rankings();
  }
  renderBracket(`week${CURRENT_WEEK}`);
}
window.changeWeekView = changeWeekView;

let currentView = 'DRAFT';
let draftBallot = new Array(25).fill(null); 
let isSubmitted = false;
let activeRowIndex = null;
let sortableInstance = null; // Store the sortable object
let MOCK_DB = {};

function populateMockDB(ballots) {
  if (CURRENT_WEEK < 11) return; // should say no data for selected week
  const submittedBallots = ballots.filter(ballot => ballot[`submitted${CURRENT_WEEK}`]);
  const myBallot = ballots.find(ballot => ballot.id === getCurrentUser().sub);

  const all = submittedBallots.reduce((acc, curr) => {
    const id = curr.id;
    const total = curr[`week${CURRENT_WEEK}`];
    acc[id] = total;
    return acc;
  }, {});

  const arr = calculateIdIndexSums(submittedBallots.map(ballot => ballot[`week${CURRENT_WEEK}`]));

  all['OFFICIAL'] = arr;
  MOCK_DB = { ...all };
  delete MOCK_DB[getCurrentUser().sub];

  isSubmitted = myBallot[`submitted${CURRENT_WEEK}`];
  if (isSubmitted) {
    currentView = 'OFFICIAL';
    viewSelector.options[1].selected = true;
  } else {
    currentView = 'DRAFT';
    viewSelector.options[0].selected = true;
  }
  draftBallot = myBallot[`week${CURRENT_WEEK}`];
}

async function showTop25Rankings() {
    // add submitted eq true
    fetchD1().then((res) => { 
      TEAMS = res;
      getCurrentUser() && fetchTop25().then((res2) => { 
        populateMockDB(res2.data); 
        initSortable(); 
        setTimeout(() => {
          renderBallot(true);
          const ballot = document.getElementById("top25Rankings");
          ballot.style.display = "block";
        }, 200);
      }); 
    });
}

/* HELPER METHODS */

/* DB API Requests */
async function apiReq(url, method, data) {
  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: ANON_API_KEY,
        apikey: ANON_API_KEY,
      },
      body: data == null ? null : JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    if (method === "GET") {
      const responseData = await response.json();
      return responseData;
    } else {
      return;
    }
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

async function fetchTeams() {
  return apiReq(TEAMS_ENDPOINT, "GET");
}

async function fetchD1() {
  return apiReq(D1_ENDPOINT, "GET");
}
TEAMS = await fetchD1();

async function fetchTop25() {
  return db_client.from("Top25").select('*');
}

async function updateTop25(user_id, week, rankings, submit_week, submitted = false) {
  const data = { [week]: rankings, [submit_week]: submitted };
  console.log('updated db top 25');
  return db_client.from("Top25").update(data).eq("id", user_id);
}

async function isUserSignedIn() {
  const data = await db_client.auth.getSession();
  if (data?.session) {
    setCurrentUser(data.session.user?.user_metadata);
    authedUserDisplay(loginBtn, unauthedPicksContainer, menuContainer, userDisplay, userAvatar, deleteCommentBtns);
    fetchConfTourneyPicks().then(res=> {
      CONF_TOURNEY_PICKS = res.data;
      renderConfTourneyTable(res.data);
    });
  }
  // TODO: move
  if (getCurrentUser()?.username === "fearthebeak") {
    document.getElementById("fabButton").style.display = "flex";
    document.querySelectorAll(".Row__Toggle").forEach((element) => {
      element.style.display = "block";
    });
  }
}

/* PAGE INITIALIZATION */

let setActive;

  const inputField = document.getElementById("commentInput");
  const sendButton = document.getElementById("sendBtn");

  inputField.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendButton.click();
    }
  });

  const gridBtn = document.getElementById("gridViewBtn");
  const listBtn = document.getElementById("listViewBtn");
  const picksBtn = document.getElementById("picksViewBtn");
  const top25Btn = document.getElementById("top25ViewBtn");
  const statsBtn = document.getElementById("statsViewBtn");
  const bracketBtn = document.getElementById("bracketViewBtn");
  const mainContent = document.getElementById("MainContent");

  function switchToGrid() {
    gridBtn.classList.add("active");
    listBtn.classList.remove("active");
    picksBtn.classList.remove("active");
    top25Btn.classList.remove("active");
    statsBtn.classList.remove("active");
    bracketBtn.classList.remove("active");

    const list = document.querySelector(".list-container");
    list.style.display = "none";
    const fab = document.querySelector(".Fab-Wrapper");
    fab.style.display = "none";
    const save = document.querySelector(".Fab-Save");
    save.style.display = "none";
    const table = document.querySelector(".table-container");
    table.style.display = "flex";
    const picks = document.querySelector(".Picks-Container");
    picks.style.display = "none";
    if (confTourneySection) confTourneySection.classList.remove('is-visible');
    const picksToggle = document.getElementById("picksMenu");
    picksToggle.style.display = "none";
    const confTourneyToggle = document.getElementById("confTourneyMenu");
    confTourneyToggle.style.display = "none";
    const ballot = document.querySelector(".Top25-Container");
    ballot.style.display = "none";
    const dash = document.getElementById("statsDash");
    dash.style.display = "none";
    const bracket = document.querySelector(".Bracket-Container");
    bracket.style.display = "none";
  }

  function switchToList() {
    listBtn.classList.add("active");
    gridBtn.classList.remove("active");
    picksBtn.classList.remove("active");
    top25Btn.classList.remove("active");
    statsBtn.classList.remove("active");
    bracketBtn.classList.remove("active");

    const table = document.querySelector(".table-container");
    table.style.display = "none";
    const list = document.querySelector(".list-container");
    list.style.display = "flex";
    const fab = document.querySelector(".Fab-Wrapper");
    fab.style.display = "flex";
    const save = document.querySelector(".Fab-Save");
    save.style.display = "none";
    const picks = document.querySelector(".Picks-Container");
    picks.style.display = "none";
    if (confTourneySection) confTourneySection.classList.remove('is-visible');
    const picksToggle = document.getElementById("picksMenu");
    picksToggle.style.display = "none";
    const confTourneyToggle = document.getElementById("confTourneyMenu");
    confTourneyToggle.style.display = "none";
    const ballot = document.querySelector(".Top25-Container");
    ballot.style.display = "none";
    const dash = document.getElementById("statsDash");
    dash.style.display = "none";
    const bracket = document.querySelector(".Bracket-Container");
    bracket.style.display = "none";
  }

  function switchToPicks() {
    listBtn.classList.remove("active");
    gridBtn.classList.remove("active");
    picksBtn.classList.add("active");
    top25Btn.classList.remove("active");
    statsBtn.classList.remove("active");
    bracketBtn.classList.remove("active");

    const table = document.querySelector(".table-container");
    table.style.display = "none";
    const list = document.querySelector(".list-container");
    list.style.display = "none";
    const fab = document.querySelector(".Fab-Wrapper");
    fab.style.display = "none";
    const save = document.querySelector(".Fab-Save");
    //save.style.display = "flex";
    setConfTourneyVisibility(showingConfTourney);
    const picksToggle = document.getElementById("picksMenu");
    picksToggle.style.display = "flex";
    const confTourneyToggle = document.getElementById("confTourneyMenu");
    confTourneyToggle.style.display = "flex";
    const ballot = document.querySelector(".Top25-Container");
    ballot.style.display = "none";
    const dash = document.getElementById("statsDash");
    dash.style.display = "none";
    const bracket = document.querySelector(".Bracket-Container");
    bracket.style.display = "none";
  }

  function switchToTop25() {
    listBtn.classList.remove("active");
    gridBtn.classList.remove("active");
    picksBtn.classList.remove("active");
    top25Btn.classList.add("active");
    statsBtn.classList.remove("active");
    bracketBtn.classList.remove("active");
    
    const table = document.querySelector(".table-container");
    table.style.display = "none";
    const list = document.querySelector(".list-container");
    list.style.display = "none";
    const fab = document.querySelector(".Fab-Wrapper");
    fab.style.display = "none";
    const save = document.querySelector(".Fab-Save");
    save.style.display = "none";
    const picks = document.querySelector(".Picks-Container");
    picks.style.display = "none";
    if (confTourneySection) confTourneySection.classList.remove('is-visible');
    const picksToggle = document.getElementById("picksMenu");
    picksToggle.style.display = "none";
    const confTourneyToggle = document.getElementById("confTourneyMenu");
    confTourneyToggle.style.display = "none";
    if (CURRENT_WEEK >= 11) {
      const ballot = document.querySelector(".Top25-Container");
      ballot.style.display = "flex";
      showTop25Rankings();
    }
    const dash = document.getElementById("statsDash");
    dash.style.display = "none";
    const bracket = document.querySelector(".Bracket-Container");
    bracket.style.display = "none";
  }

  function switchToStats() {
    listBtn.classList.remove("active");
    gridBtn.classList.remove("active");
    picksBtn.classList.remove("active");
    top25Btn.classList.remove("active");
    statsBtn.classList.add("active");
    bracketBtn.classList.remove("active");

    const table = document.querySelector(".table-container");
    table.style.display = "none";
    const list = document.querySelector(".list-container");
    list.style.display = "none";
    const fab = document.querySelector(".Fab-Wrapper");
    fab.style.display = "none";
    const picks = document.querySelector(".Picks-Container");
    picks.style.display = "none";
    if (confTourneySection) confTourneySection.classList.remove('is-visible');
    const picksToggle = document.getElementById("picksMenu");
    picksToggle.style.display = "none";
    const confTourneyToggle = document.getElementById("confTourneyMenu");
    confTourneyToggle.style.display = "none";
    const ballot = document.querySelector(".Top25-Container");
    ballot.style.display = "none";
    const dash = document.getElementById("statsDash");
    dash.style.display = "flex";
    const bracket = document.querySelector(".Bracket-Container");
    bracket.style.display = "none";
  }
  
function switchToBracket() {
    listBtn.classList.remove("active");
    gridBtn.classList.remove("active");
    picksBtn.classList.remove("active");
    top25Btn.classList.remove("active");
    statsBtn.classList.remove("active");
    bracketBtn.classList.add("active");

    const table = document.querySelector(".table-container");
    table.style.display = "none";
    const list = document.querySelector(".list-container");
    list.style.display = "none";
    const fab = document.querySelector(".Fab-Wrapper");
    fab.style.display = "none";
    const picks = document.querySelector(".Picks-Container");
    picks.style.display = "none";
    if (confTourneySection) confTourneySection.classList.remove('is-visible');
    const picksToggle = document.getElementById("picksMenu");
    picksToggle.style.display = "none";
    const confTourneyToggle = document.getElementById("confTourneyMenu");
    confTourneyToggle.style.display = "none";
    const ballot = document.querySelector(".Top25-Container");
    ballot.style.display = "none";
    const dash = document.getElementById("statsDash");
    dash.style.display = "none";
    const bracket = document.querySelector(".Bracket-Container");
    bracket.style.display = "flex";
    renderBracket(`week${CURRENT_WEEK}`);
  }

  gridBtn.addEventListener("click", switchToGrid);
  listBtn.addEventListener("click", switchToList);
  picksBtn.addEventListener("click", switchToPicks);
  top25Btn.addEventListener("click", switchToTop25);

  setActive = (button) => {
    const buttons = document.querySelectorAll('.Grid-Btn');
    buttons.forEach(btn => btn.classList.remove('active')); 
    button.classList.add('active');
  
    const viewId = button.id; 
    switch (viewId) {
      case "gridViewBtn":
        switchToGrid();
        break;
      case "listViewBtn":
        switchToList();
        break;
      case "picksViewBtn":
        switchToPicks();
        break;
      case "top25ViewBtn":
        switchToTop25();
        break;
      case "statsViewBtn":
        switchToStats();
        break;
      case "bracketViewBtn":
        switchToBracket();
        break;
      default:
        switchToGrid();
    }
  };
  window.setActive = setActive;

  queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const view = urlParams.get("view");
  const chat = urlParams.get("chat");

  switch (view) {
    case "grid":
      switchToGrid();
      break;
    case "PBL":
      switchToList();
      break;
    case "picks":
      switchToPicks();
      break;
    case "top25":
      switchToTop25();
      break;
    case "stats":
      switchToStats();
      break;
    case "bracket":
      switchToBracket();
      break;
    default:
      switchToGrid();
  }

  const allCheckbox = document.querySelector('.filter-all');
  const otherCheckboxes = document.querySelectorAll('.filter-other');
  const confCheckboxes = document.querySelectorAll('.filter-conf');

  // Helper: Enable or Disable Conference Options
  function setConferenceState(shouldDisable) {
    confCheckboxes.forEach(input => {
      input.disabled = shouldDisable; // Disable the actual checkbox
      // Find the parent label to style it grey
      const label = input.closest('.Filter-Item');
      if (shouldDisable) {
        label.classList.add('disabled');
      } else {
        label.classList.remove('disabled');
      }
    });
  }

  // Helper: Check logic to see if we should reset to "All"
  const areAllConfsChecked = () => Array.from(confCheckboxes).every(box => box.checked);
  const areNoOthersChecked = () => Array.from(otherCheckboxes).every(box => !box.checked);

  // --- MAIN LOGIC ---
  function handleFilterChange(e) {
    const target = e.target;
    
    // 1. "ALL" CLICKED
    if (target.classList.contains('filter-all')) {
      if (target.checked) {
        // Reset everything
        confCheckboxes.forEach(box => box.checked = true);
        otherCheckboxes.forEach(box => box.checked = false);
        setConferenceState(false); // Enable conferences
        filterGames('all');
      }
    }

    // 2. "OTHER" (SOJR / Close Lines) CLICKED
    else if (target.classList.contains('filter-other')) {
      if (target.checked) {
        // If specific view selected, uncheck "All" and DISABLE conferences
        allCheckbox.checked = false;
        setConferenceState(true);
        filterGames(target.id);
      } else {
        // If unchecking an "Other", we must check if ANY others are still active
        const isAnyOtherActive = Array.from(otherCheckboxes).some(box => box.checked);
        
        if (!isAnyOtherActive) {
          // If no others are active, RE-ENABLE conferences
          setConferenceState(false);
          
          // Check if we effectively returned to "All" state
          if (areAllConfsChecked()) {
            allCheckbox.checked = true;
            filterGames('all');
          }
        }
      }
    }

    // 3. "CONFERENCE" CLICKED
    else if (target.classList.contains('filter-conf')) {
      if (!target.checked) {
        allCheckbox.checked = false;
      } else {
        if (areAllConfsChecked() && areNoOthersChecked()) {
          allCheckbox.checked = true;
        }
      }
    }
  }

  const menu = document.getElementById('filterMenu');
  menu.addEventListener('change', handleFilterChange);

  /* POPULATE TABLE */
  fetchTeams().then((res) => {
    fetchComments().then((comments) => {
      CACHED_COMMENTS_DB = comments.data;
      appendTeamCells(res);

      const header = document.querySelector(".Table__THEAD");
      setTimeout(() => {
        header.classList.add("header-enter");
      }, 100);

      const rows = document.querySelectorAll(".Table__TBODY .Table__TR");
      rows.forEach((row, index) => {
        setTimeout(
          () => {
            row.classList.add("row-enter");
          },
          300 + index * 100,
        ); // Start rows 300ms in, then cascade
      });

      const cells = document.querySelectorAll(".Table__TD");
      cells.forEach((cell) => {
        const team = cell.getAttribute("data-cell-name");
        if (team) {
          if (
            CACHED_COMMENTS_DB?.filter((comment) => comment.team === team)
              .length > 0
          ) {
            cell.classList.add("has-comments");
          }
          cell.addEventListener("click", () => openDrawer(cell));
          if (chat && team === chat) {
            cell.click();
          }
        }
      });
    });
  });

  db_client.auth.onAuthStateChange((event, session) => {
    setCurrentUser(session?.user?.user_metadata);
    if (getCurrentUser()) {
      authedUserDisplay(loginBtn, unauthedPicksContainer, menuContainer, userDisplay, userAvatar, deleteCommentBtns);
    }
    fetchConfTourneyPicks().then(res=> {
      CONF_TOURNEY_PICKS = res.data;
      renderConfTourneyTable(res.data);
    });
  });

  isUserSignedIn();

function toggleFilters() {
  const menu = document.getElementById('filterMenu');
  menu.classList.toggle('show');
}
window.toggleFilters = toggleFilters;

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.closest('.Filter-Dropdown-Container')) {
    const dropdowns = document.getElementsByClassName("Filter-Menu");
    for (let i = 0; i < dropdowns.length; i++) {
      const openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

function filterGames(filterId) {
  switch (filterId) {
    case 'SOJRFilter':
      FILTER = 'SOJR';
      GAMES = ALL_GAMES;
      GAMES = GAMES.filter(game => game.rothstein);//.sort((a, b) => -1 * a.rothstein.localeCompare(b.rothstein));
      document.getElementById('sojrTweet').style.display = 'block';
      renderAll();
      break;
    case 'TorvikFilter':
      FILTER = 'Torvik';
      GAMES = ALL_GAMES;
      GAMES = GAMES.filter(game => {
        return !game.away_torvik || game.away_torvik <= 150 || !game.home_torvik || game.home_torvik <= 150;
      });
      renderAll();
      break;
    default:
      FILTER = null;
      GAMES = ALL_GAMES;
      document.getElementById('sojrTweet').style.display = 'none';
      renderAll();
      break;
  }
  return;
}

/* TABLE GRID FORMAT HELPER */
const appendTeamCells = (data) => {
  const placeholderHtmlString = `
    <!-- X  -->
    <td class="Table__TD">
    </td>
    `;

  data.forEach((team, idx) => {
    const item = document.querySelector(`tr[data-idx="${team.conf_pos}"]`);

    const htmlString = `
      <td class="Table__TD" ext-id="${team.id}" data-cell-id="${team.conf}-${team.conf_pos - 1}" data-cell-name="${team.name}">
        <div class="team-link flex items-centerclr-gray-03 mascot-row mascot-row">
          <span class="pr4 TeamLink__Logo">
            <!-- <a class="AnchorLink" tabindex="0" href="https://www.espn.com/mens-college-basketball/team/stats/_/id/${team.id}" target="_blank" rel="noopener noreferrer"> -->
            <img 
              alt="${team.name}" 
              class="Image Logo Logo__sm" 
              title="${team.name}" 
              data-mptype="image" 
              src="https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/${team.id}.png&h=200&w=200"
            >
            <!-- </a> --->
          </span>
          <div class="meta-stack">
            ${
              team.change > 0
                ? '<div class="trend-tag trend-up"><i>&#9650;</i>' +
                  team.change.toString() +
                  "</div>"
                : team.change < 0
                  ? '<div class="trend-tag trend-down"><i>&#9660;</i>' +
                    (-1 * team.change).toString() +
                    "</div>"
                  : '<div class="trend-tag trend-neutral"><span class="dash-bar"></span></div>'
            }
            ${team.rank != null ? '<div class="ovr-tag">#' + team.rank.toString() + "</div>" : ""}
          </div>
        </div>
      </td>
      `;

    while (
      item.childElementCount - 1 < team.conf &&
      team.conf != 999 &&
      item.childElementCount < 15
    ) {
      item.insertAdjacentHTML("beforeend", placeholderHtmlString);
    }
    item.insertAdjacentHTML("beforeend", htmlString);
  });
};
















/* COMMENTS */

/* DB LOOKUPS (ASYNC) */
async function fetchComments() {
  return db_client.from("Comments").select("*");
}

async function postComment(data) {
  return db_client.from("Comments").insert([data]);
}

async function deleteComment(commentId) {
  return db_client.from("Comments").delete().eq("id", commentId);
}

/* UI METHODS */
function updateCellIndicator() {
  const cell = document.querySelector(
    `.Table__TD[data-cell-id="${currentCellId}"]`,
  );
  if (cell) cell.classList.add("has-comments");
}

function closeDrawer() {
  const drawer = document.getElementById("commentDrawer");
  drawer.classList.remove("open");
  currentCellId = null;
}
window.closeDrawer = closeDrawer;

async function openDrawer(cell) {
  if (event.target.closest("a")) return;

  closeDrawer();
  currentCellId = cell.getAttribute("data-cell-name");

  await renderComments();

  document.querySelector(".Drawer__Title").innerHTML = `
    <a 
      class="AnchorLink" 
      style="text-decoration: none; color: white;" 
      tabindex="0" 
      href="https://www.espn.com/mens-college-basketball/team/stats/_/id/${cell.getAttribute("ext-id")}" 
      target="_blank" 
      rel="noopener noreferrer"
  >
    <img 
      alt="${cell.getAttribute("data-cell-name")}" 
      class="Image Logo Logo__sm" 
      title="${cell.getAttribute("data-cell-name")}" 
      data-mptype="image" 
      src="https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/${cell.getAttribute("ext-id")}.png&h=200&w=200"
    >
  </a>
  `;

  const drawer = document.getElementById("commentDrawer");
  drawer.style.display = "flex";
  setTimeout(() => {
    drawer.classList.add("open");
  }, 300); // TODO: shouldn't need this hardcoded timeout; add an await above for rednder comments
}

async function renderComments() {
  const container = document.getElementById("drawerContent");

  const comments = await fetchComments();
  CACHED_COMMENTS_DB = comments.data;

  const main_comments =
    CACHED_COMMENTS_DB?.filter(
      (comment) =>
        comment.team === currentCellId && comment.reply_to_id == null,
    ) ?? [];

  if (main_comments.length === 0) {
    container.innerHTML = `
        <div style="text-align:center; color: rgba(255,255,255,0.3); margin-top: 50px;">
        <i class="fa-regular fa-comments" style="font-size: 30px; margin-bottom:10px;"></i><br>
        No comments yet.<br>Start the discussion!
        </div>`;
    return;
  }

  let html = "";
  main_comments.forEach((comment) => {
    const replies = CACHED_COMMENTS_DB?.filter(
      (c) => c.reply_to_id == comment.id,
    );

    const isAdmin = comment.author === "Admin";
    const adminBadgeHTML = isAdmin
      ? `<span class="Admin-Badge"><i class="fa-solid fa-thumbtack"></i> Pinned</span>`
      : "";

    const deleteVisibilityClass =
      getCurrentUser() != null && getCurrentUser().username === "fearthebeak"
        ? "is-visible"
        : "";

    html += `
        <div class="Comment-Item">
          <div class="Comment-Box ${isAdmin ? "is-admin" : ""}">
            <div class="Comment-Header">
              <span class="Comment-User">
                ${comment.author}
                ${adminBadgeHTML} 
                <span style="font-weight:400; color:#aaa; margin-left:5px;">
                  (${new Date(comment.created_at).toLocaleString(navigator.language, { dateStyle: "medium", timeStyle: "short" })})
                </span>
              </span>

              <button class="delete-btn ${deleteVisibilityClass}" aria-label="Delete" onclick="deleteCommentModal(${comment.id})">&times;</button>
            </div>

            <p class="Comment-Text">${formatMentions(comment.message)}</p>
      
            <button class="Reply-Btn" onclick="toggleReply(${comment.id})">Reply</button>
    
            <div id="reply-input-${comment.id}" class="Input-Group" style="display:none; margin-top:10px;">
              <input type="text" id="reply-text-${comment.id}" class="Input-Field" placeholder="Reply..." style="font-size: 16px; padding: 5px;">
              <button id="reply-submit-${comment.id}" class="Send-Btn" onclick="submitReply(${comment.id})" style="padding: 2px 10px; font-size: 16px;">Send</button>
            </div>
          </div>

          <div class="Reply-List">
            ${replies
              ?.map(
                (reply) => `
              <div class="Comment-Box" style="margin-top: 10px; background: rgba(255,255,255,0.03);">
                <div class="Comment-Header">
                  <span class="Comment-User" style="color: #2ed573">
                    ${reply.author}
                    <span style="font-weight:400; color:#aaa; margin-left:5px;">
                      (${new Date(reply.created_at).toLocaleString(navigator.language, { dateStyle: "medium", timeStyle: "short" })})
                    </span>
                  </span>
                  <button class="delete-btn ${deleteVisibilityClass}" style="background-color: #05714b;" aria-label="Delete" onclick="deleteCommentModal(${reply.id})">&times;</button>
                </div>
                <p class="Comment-Text">${reply.message}</p>
              </div>
            `,
              )
              .join("")}
          </div>
        </div>
        `;
  });

  container.innerHTML = html;

  main_comments.forEach((comment) => {
    const inputField = document.getElementById(`reply-input-${comment.id}`);
    const sendButton = document.getElementById(`reply-submit-${comment.id}`);

    inputField.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        sendButton.click();
      }
    });
  });
}

function toggleReply(commentId) {
  const el = document.getElementById(`reply-input-${commentId}`);
  if (el.style.display === "flex") {
    el.style.display = "none";
  } else {
    el.style.display = "flex";
  }
}
window.toggleReply = toggleReply;

const deleteCommentBtns = document.querySelectorAll(".delete-btn");
async function deleteCommentModal(commentId) {
  const children = CACHED_COMMENTS_DB.filter(
    (c) => c.reply_to_id === commentId,
  );

  if (children.length > 0) {
    await Promise.all(children.map((c) => deleteComment(c.id)));
  }
  await deleteComment(commentId);
  await renderComments();
  updateCellIndicator();
}
window.deleteCommentModal = deleteCommentModal;

async function submitComment() {
  const input = document.getElementById("commentInput");
  const text = input.value.trim();
  if (!text) return;

  const mentions = getValidMentions(text).map((mention) => mention.email);

  const city = await getCityFromIP();
  await postComment({
    author: getCurrentUser() != null ? getCurrentUser().username : city,
    message: text,
    team: currentCellId,
    mentions: mentions,
  });

  input.value = "";
  await renderComments();
  updateCellIndicator();
}
window.submitComment = submitComment;

async function submitReply(parentId) {
  const input = document.getElementById(`reply-text-${parentId}`);
  const text = input.value.trim();
  if (!text) return;

  const parentComment = CACHED_COMMENTS_DB.find(
    (c) => c.team === currentCellId && c.id === parentId,
  );

  if (parentComment) {
    const city = await getCityFromIP();
    await postComment({
      author: getCurrentUser() != null ? getCurrentUser().username : city,
      message: text,
      team: currentCellId,
      reply_to_id: parentId,
    });
  }
  await renderComments();
}

// TODO: initialization
let MOCK_USERS = [];
const MOCK_USERS2 = db_client
  .from("Profiles")
  .select("username, email, id")
  .then((res) => {
    MOCK_USERS = res.data;
    renderAll();
  });

const mentionList = document.getElementById("mentionList");

inputField.addEventListener("input", (e) => {
  const value = e.target.value;
  const cursor = e.target.selectionStart;

  // Find the word being typed at the cursor
  const textBeforeCursor = value.slice(0, cursor);
  //TODO: spaces...
  const words = textBeforeCursor.split(/\s+/);
  const currentWord = words[words.length - 1];

  // Check if current word starts with @
  if (currentWord.startsWith("@")) {
    const query = currentWord.slice(1).toLowerCase();
    showSuggestions(query, cursor);
  } else {
    hideSuggestions();
  }
});

/* --- PARSER FUNCTION --- */
function getValidMentions(inputText) {
  if (!inputText) return [];

  // 1. Sort users by name length (Longest -> Shortest)
  // This prevents "Hoops" from matching inside "@Hoops Fan"
  const sortedUsers = [...MOCK_USERS].sort(
    (a, b) => b.username.length - a.username.length,
  );

  // 2. Escape special regex characters in names (like ., ?, etc.)
  // This keeps the regex safe if a user is named "Mr. Smith"
  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // 3. Create the Pipe-Separated Pattern
  // Result looks like: (Hoops Fan|Net Ripper|Dr\. Dunk|Admin|Hoops)
  const namesPattern = sortedUsers
    .map((u) => escapeRegex(u.username))
    .join("|");

  // 4. Build the Full Regex
  // @       -> Look for the @ symbol
  // (...)   -> Match one of our names
  // (?!\w)  -> Negative Lookahead: Ensure the NEXT char is NOT a word character
  //            (Prevents matching "@Admin" inside "@Administrator")
  const regex = new RegExp(`@(${namesPattern})(?!\\w)`, "gi");

  // 5. Execute Match
  const matches = [...inputText.matchAll(regex)];

  // 6. Map matches back to full User Objects
  const foundUsers = matches.map((match) => {
    // match[1] contains the captured name (e.g., "Hoops Fan")
    // We use find() to get the original object with case-insensitivity
    return MOCK_USERS.find(
      (u) => u.username.toLowerCase() === match[1].toLowerCase(),
    );
  });

  // 7. Deduplicate (Remove duplicates if user mentioned same person twice)
  const uniqueUsers = [
    ...new Map(foundUsers.map((u) => [u.username, u])).values(),
  ];

  return uniqueUsers;
}

function showSuggestions(query, cursorPos) {
  // Filter Users
  const matches = MOCK_USERS.filter((u) =>
    u.username.toLowerCase().includes(query),
  );

  if (matches.length === 0) {
    hideSuggestions();
    return;
  }

  // Build HTML
  mentionList.innerHTML = matches
    .map(
      (u) => `
    <div class="Mention-Item" onclick="insertMention('${u.username}')">
      <div class="Mention-Avatar">${u.username[0]}</div>
      ${u.username}
    </div>
  `,
    )
    .join("");

  mentionList.classList.add("active");
}

function hideSuggestions() {
  mentionList.classList.remove("active");
}

function insertMention(name) {
  const value = inputField.value;
  const cursor = inputField.selectionStart;
  const textBefore = value.slice(0, cursor);
  const textAfter = value.slice(cursor);

  // Replace the partial @word with the full @Name
  const words = textBefore.split(/\s+/);
  words.pop(); // Remove the partial word

  const newValue =
    words.join(" ") +
    (words.length > 0 ? " " : "") +
    "@" +
    name +
    " " +
    textAfter;

  inputField.value = newValue;
  inputField.focus();
  hideSuggestions();
}
window.insertMention = insertMention;

function formatMentions(text) {
  if (!text) return "";

  // 1. Sort users by length (Longest -> Shortest)
  // CRITICAL: We must match "Hoops Fan" before we match "Hoops",
  // otherwise the regex will stop early and leave " Fan" as plain text.
  const sortedUsers = [...MOCK_USERS].sort(
    (a, b) => b.username.length - a.username.length,
  );

  // 2. Escape special characters for Regex safety
  const escapeRegex = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // 3. Build the Pattern
  // Creates a string like: (Hoops Fan|Net Ripper|Admin|...)
  const namesPattern = sortedUsers
    .map((u) => escapeRegex(u.username))
    .join("|");

  // 4. Create Regex
  // @       -> Literal @ symbol
  // (...)   -> Capture group for the name
  // (?!\w)  -> Negative Lookahead: Ensure the next char is NOT a letter/number
  const regex = new RegExp(`@(${namesPattern})(?!\\w)`, "gi");

  // 5. Perform Replacement
  return text.replace(regex, (fullMatch, capturedName) => {
    // 'capturedName' is what the user typed (e.g. "admin" or "Hoops fan")

    // Optional Polish: Look up the "Official" casing from the list
    // (So if they typed "@admin", we render "Admin")
    const officialUser = MOCK_USERS.find(
      (u) => u.username.toLowerCase() === capturedName.toLowerCase(),
    );
    const displayName = officialUser ? officialUser.username : capturedName;

    return `<span class="Mention-Badge">@${displayName}</span>`;
  });
}

/* LIST VIEW */

const teamsData = [
  { id: "pbl-row1", name: "Mark Anti-Pope", record: "9-4", streak: "W4" },
  { id: "pbl-row2", name: "Will Fade", record: "9-4", streak: "W2" },
  { id: "pbl-row3", name: "Minnesota T-Wolves", record: "56-26", streak: "W2" },
];

const modal = document.getElementById("addTeamModal");

// Open Modal (handles both Add and Edit states)
function openAddModal(teamIdToEdit = null) {
  const listContainer = document.getElementById("rankingList");
  //const modal = document.getElementById('teamModal');
  const modalTitle = document.getElementById("modalTitle");
  const modalDesc = document.getElementById("modalDesc");
  const modalSubmitBtn = document.getElementById("modalSubmitBtn");
  //const editRowIdInput = document.getElementById('editRowId');
  const inputName = document.getElementById("inputName");
  const inputRecord = document.getElementById("inputRecord");
  const inputStreak = document.getElementById("inputStreak");
  // Reset form first
  //document.querySelector('form').reset();
  //editRowIdInput.value = '';

  if (teamIdToEdit) {
    const team = teamsData.find((t) => t.id === teamIdToEdit);
    modalTitle.textContent = "Edit Team";
    modalDesc.textContent = "Update team statistics.";
    modalSubmitBtn.textContent = "Save Changes";
    //editRowIdInput.value = team.id;
    inputName.value = team.name;
    inputRecord.value = team.record;
    inputStreak.value = team.streak;
    toggleDrawer(teamIdToEdit); // Close drawer on click
  } else {
    // --- ADD MODE ---
    modalTitle.textContent = "New Fraud";
    modalDesc.textContent = "Add a team to the parlay banned list.";
    modalSubmitBtn.textContent = "Add to List";
  }

  modal.classList.add("open");
  setTimeout(() => inputName.focus(), 100);
}
window.openAddModal = openAddModal;

function closeAddModal(e) {
  // If e is passed (click event), only close if clicking overlay background
  if (e && e.target !== modal) return;
  modal.classList.remove("open");

  // Clear inputs after transition
  setTimeout(() => {
    document.getElementById("inputName").value = "";
    document.getElementById("inputRecord").value = "";
    document.getElementById("inputStreak").value = "";
  }, 300);
}
window.closeAddModal = closeAddModal;

function toggleDrawer(id) {
  const row = document.getElementById(id);
  // Close others first (optional, but cleaner UX)
  document.querySelectorAll(".Ranking-Row-Wrapper").forEach((r) => {
    if (r.id !== id) r.classList.remove("drawer-open");
  });
  row.classList.toggle("drawer-open");
}
window.toggleDrawer = toggleDrawer;

// TODO: implement
function deleteTeam(id) {
  if (confirm("Coming soon!")) {
    // Remove from data array
    //teamsData = teamsData.filter(t => t.id !== id);
    // Re-render list to update ranks
    //renderList();
    return;
  }
  return;
}
window.deleteTeam = deleteTeam;

function handleNewTeam(event) {
  event.preventDefault();
  alert("Coming soon!");
  return;

  /*
            const name = document.getElementById('inputName').value;
            const record = document.getElementById('inputRecord').value;
            const streak = document.getElementById('inputStreak').value.toUpperCase();

            // Determine Streak Color
            let streakClass = "";
            if (streak.startsWith('W')) streakClass = "is-win";
            if (streak.startsWith('L')) streakClass = "is-loss";

            const list = document.getElementById('rankingList');
            const rank = list.children.length + 1;

            // HTML for new row
            const newRow = document.createElement('div');
            newRow.className = 'Ranking-Row';
            newRow.innerHTML = `
                <div class="Row__Rank">${rank}</div>
                <div class="Row__Team">
                    <div class="Team__Name">${name}</div>
                </div>
                <div class="Row__Stats">
                    <div class="Stat-Group">
                        <span class="Stat__Value">${record}</span>
                        <span class="Stat__Label">Rec</span>
                    </div>
                    <div class="Stat-Group">
                        <span class="Stat__Value ${streakClass}">${streak}</span>
                        <span class="Stat__Label">Strk</span>
                    </div>
                </div>
            `;

            list.appendChild(newRow);
            
            // Scroll to new item
            newRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Close modal
            closeAddModal();
            */
}

/* PICKS */

const unauthedPicksContainer = document.querySelector('.Unauthed-Picks');

/* DB CALLS */
async function addValueToArray(columnName, valueToAdd, rowId) {
  const { data, error } = await db_client.rpc('add_pick_value', {
    row_id: rowId,
    target_column: columnName,
    val_to_add: valueToAdd
  });

  if (error) {
    console.error('Error adding value:', error.message);
  } else {
    console.log('Value added successfully');
  }
}

async function removeValueFromArray(columnName, valueToRemove, rowId) {
  const { data, error } = await db_client.rpc('remove_pick_value', {
    row_id: rowId,
    target_column: columnName,
    val_to_remove: valueToRemove
  });

  if (error) {
    console.error('Error removing value:', error.message);
  } else {
    console.log('Value removed successfully');
  }
}

async function fetchPicks(week) {
  const CHUNK_SIZE = 1000;
  const MAX_ROWS = 10000;
  
  let allPicks = [];
  let lastId = 0; 
  
  while (allPicks.length < MAX_ROWS) {
    let query = db_client
      .from("Picks")
      .select("*")
      .order('id', { ascending: true }) 
      .limit(CHUNK_SIZE);

    if (week !== 'all') {
      query = query.eq('week', week);
    }

    if (lastId > 0) {
      query = query.gt('id', lastId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching picks:", error);
      return [];
    }

    if (!data || data.length === 0) {
      break;
    }

    allPicks = allPicks.concat(data);

    lastId = data[data.length - 1].id;

    if (data.length < CHUNK_SIZE) {
      break;
    }
  }

  // Trim to exact MAX_ROWS 
  if (allPicks.length > MAX_ROWS) {
    allPicks = allPicks.slice(0, MAX_ROWS);
  }

  // Since we fetched by ID, the result is currently sorted by ID. 
  allPicks.sort((a, b) => {
    return new Date(a.time) - new Date(b.time) || a.id - b.id;
  });

  return allPicks; 
}


// TODO: make this more scalable for many users
function getPickerObj(id) {
  return PICKERS.find(p => p.id === id) ?? { id: '?', color: '#ff7675' };
}

function toggleView() {
  showingAllPicks = document.getElementById('viewToggle').checked;
  renderAll();
  toggleLegend();
}
window.toggleView = toggleView;

function switchPick(gameId, targetSide) {
    const gamePicks = GAMES.find( game => game.id ===  gameId );
    const userId = getCurrentUser()?.username?.slice(0,2).toUpperCase();
    const currentSide = gamePicks.away_picks?.includes(userId) ? 'away_picks' : (gamePicks.home_picks?.includes(userId) ? 'home_picks' : null);
    
    const date = dateFromTimestamp(gamePicks.time, 'num');
    const tracker = getCompactTracker(date);
    if (!currentSide) {
      updateCompactTracker(tracker.current + 1, tracker.total, date);
    } else if (currentSide === targetSide) {
      updateCompactTracker(tracker.current - 1, tracker.total, date);
    }

    // Remove from current side
    if (currentSide) {
      gamePicks[currentSide] = gamePicks[currentSide]?.filter(id => id !== userId);
      removeValueFromArray(currentSide, getCurrentUser()?.sub, gameId);
    }
    
    // If user clicked the side they are already on, do nothing
    if (currentSide !== targetSide) {
      if (gamePicks[targetSide] == null) {
        gamePicks[targetSide] = [];
      }
      gamePicks[targetSide].push(userId);
      addValueToArray(targetSide, getCurrentUser()?.sub, gameId);
    }

    // Re-render only this card
    renderCardToDOM(gameId);
}
window.switchPick = switchPick;

        function createAvatarHTML(pickerIds) {
            if (pickerIds == null) return '';
            
            const userId = getCurrentUser()?.username?.slice(0,2).toUpperCase();
            let visibleIds = pickerIds;
            if (!showingAllPicks) visibleIds = pickerIds.filter(id => id === userId);
            
            return visibleIds.map(id => {
                const p = getPickerObj(id);
                
                const extraClass = (id === userId) ? 'just-added' : '';
                const userClass = (id === userId) ? 'current-user' : '';
                
                return `<div class="Avatar ${userClass} ${extraClass}" style="background-color: ${p.color};">${p.id}</div>`;
            }).join('');
        }

        function renderCardHTML(game, week) {
            // Check Consensus (5 pickers total)
            const isAwayConsensus = game.away_picks?.length >= 4 && (!game.home_picks || game.home_picks.length == 0);
            const isHomeConsensus = game.home_picks?.length >= 4 && (!game.away_picks || game.away_picks.length == 0);

            let awayClasses = [];
            let homeClasses = [];

            if (!showingAllPicks) {
                awayClasses.push(game.winner === 'away' ? 'is-winner' : ''); 
                homeClasses.push(game.winner === 'home' ? ' is-winner' : '');
            } else {
              if (isAwayConsensus) awayClasses.push('is-consensus');
              if (isHomeConsensus) homeClasses.push('is-consensus');

              if (game.winner) {
                awayClasses.push(game.winner === 'away' ? ' is-winner' : ' is-loser');
                homeClasses.push(game.winner === 'home' ? ' is-winner' : ' is-loser');
              }
            }

            const gameDate = new Date(game.time)
            const gameTime = gameDate.toLocaleString(navigator.language, {
              // year: "numeric", 
              // month: "short", 
              // day: "numeric", 
              hour: "numeric", 
              minute: "2-digit", 
              timeZoneName: "short" 
            });

            let gameClasses = '';
            let loadingClass = '';
            let loadingLabel = '';
            const gameStarted = gameDate <= currentDate;
            if (gameStarted) {
                gameClasses = 'is-locked';
                loadingClass = 'is-loading';
                loadingLabel = `
                    <div class="Lock-Indicator"><i class="fa-solid fa-lock"></i>
                    <div class="Sketch-Label">Live</div>
                    </div>
                `;
            }
            if (game.winner) {
              loadingClass = 'is-complete';
                loadingLabel = `
                    <div class="Lock-Indicator"><i class="fa-solid fa-check"></i>
                    <div class="Sketch-Label">Final</div>
                    </div>
                `;
            }
            const awayClickFn = !gameStarted ? `onclick="switchPick(${game.id}, 'away_picks')"` : '';
            const homeClickFn = !gameStarted ? `onclick="switchPick(${game.id}, 'home_picks')"` : '';

            const awayClass = awayClasses.join(' ');
            const homeClass = homeClasses.join(' ');
            
            const awayLog = `https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/${game.away_id}.png&h=200&w=200`;
            const homeLog = `https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/${game.home_id}.png&h=200&w=200`;

            const awayScore = game.away_score ? `<div class="Score-Badge">${game.away_score}</div>` : '';
            const homeScore = game.home_score ? `<div class="Score-Badge">${game.home_score}</div>` : '';

            const awayRecord = game.away_torvik ? `${game.away_record} | Torvik: ${game.away_torvik}` : `${game.away_record}`;
            const homeRecord = game.home_torvik ? `${game.home_record} | Torvik: ${game.home_torvik}` : `${game.home_record}`;

            const tv = game.tv ? `<div class="Broadcast-Badge"><i class="fa-solid fa-tv"></i> <span>${game.tv}</span></div>` : '';  

            return `
            <div class="Game-Slip ${gameClasses}" id="game-${game.id}">
                <div class="Sketch-Progress-Wrapper">
                    <div class="Sketch-Box ${loadingClass}">
                        <div class="Sketch-Fill"></div>
                    </div>
                    ${loadingLabel}
                </div>
                <div class="Slip__Meta">
                    <span class="Meta-Item"><i class="fa-solid fa-basketball"></i>${game.league}</span>
                    ${tv}
                    <span class="Meta-Item">${gameTime}</span>
                </div>

                <div class="Team-Section ${awayClass}" ${awayClickFn}>
                    <div class="Team__Header">
                        <img src="${awayLog}" class="Team__Logo" alt="${game.away}">
                        <div class="Team__Text">
                            <span class="Team__Name">${game.away}</span>
                            <span class="Team__Record">${awayRecord}</span>
                        </div>
                    </div>
                    ${awayScore}
                    <div class="Picker-Row">
                        ${createAvatarHTML(game.away_picks?.sort())}
                    </div>
                    <div class="Consensus-Badge"> <i class="fa-solid fa-check"></i></div>
                </div>

                <div class="Slip__Divider"><span style="color:#4A505E;">VS</span></div>

                <div class="Team-Section ${homeClass}" ${homeClickFn}>
                    <div class="Team__Header">
                        <img src="${homeLog}" class="Team__Logo" alt="${game.home}">
                         <div class="Team__Text">
                            <span class="Team__Name">${game.home}</span>
                            <span class="Team__Record">${homeRecord}</span>
                        </div>
                    </div>
                    ${homeScore}
                    <div class="Picker-Row">
                        ${createAvatarHTML(game.home_picks?.sort())}
                    </div>
                    <div class="Consensus-Badge"> <i class="fa-solid fa-check"></i></div>
                </div>
            </div>
            `;
        }

        function renderCardToDOM(gameId) {
            const game = GAMES.find(g => g.id === gameId);
            const week = document.querySelector('.Week-Select-Input')?.value.split(' ').at(-1) ?? '9';
            const cardHTML = renderCardHTML(game, week);
            
            const existingEl = document.getElementById(`game-${gameId}`);
            if (existingEl) {
                existingEl.outerHTML = cardHTML;
            }
        }

        async function renderAll(forceRefresh = false) {
            document.querySelector('.Legend-Wrapper').style.display = showingAllPicks ? 'flex' : 'none';
            renderLegend();
            
            const list = document.getElementById('picks-new');
            const finalList = document.getElementById('picks-final');
            list.innerHTML = '';
            finalList.innerHTML = '';
            const week = document.querySelector('.Week-Select-Input')?.value.split(' ').at(-1) ?? '9';
            
            if (GAMES.length === 0 || forceRefresh) {
              const g = await fetchPicks(week);
              GAMES = g.filter( game => game['quality'] !== '*'); // TODO: filter out bad games
              GAMES.forEach((game, index) => {
                game['home_picks'] = game['home_picks']?.map(uuid => MOCK_USERS.find(user => user.id === uuid)?.username?.slice(0,2).toUpperCase() ?? '?');
                game['away_picks'] = game['away_picks']?.map(uuid => MOCK_USERS.find(user => user.id === uuid)?.username?.slice(0,2).toUpperCase() ?? '?');
              });
              ALL_GAMES = GAMES;
            }

            USER_STATS['all'] = getHotColdReport(GAMES);
            updateUserStats('all');
            getPopularPicks(GAMES);
            showLoneWolfDisplay(getLoneWolfStats(GAMES));
            showLeaderboardBar(GAMES);
            renderStatsDashboard(GAMES);

            let lastDate = '';
            let days = 0;
            let indexBrk = { 'all': 0 };

            let sojrLast = 'all';

            let dayHTML = '';

            GAMES.forEach((game, index) => {
              let sep = false;
              let separatorHTML = '';
              let filterHTML = '';

              const d = new Date(game.time);
              const date = d.toLocaleString(navigator.language, { month: "short", day: "numeric", weekday: "long" });
              const notCompleted = currentDate < d || date === currentDate.toLocaleString(navigator.language, { month: "short", day: "numeric", weekday: "long" });

              let todaysPicks;
              let todaysTotal;
              let todaysDate;
              if (date !== lastDate) {
                const todaysGames = GAMES.filter(g => dateFromTimestamp(g.time) === date);
                todaysTotal = todaysGames.length;
                todaysPicks = todaysGames.filter(g => (g.home_picks?.includes('FE') || g.away_picks?.includes('FE'))).length;
                todaysDate = dateFromTimestamp(game.time, 'num');
                days += 1;
                separatorHTML = `
                <div class="Date-Separator" id="${days}-date-sep">
                    <div class="Date-Separator__Text">
                        <i class="fa-regular fa-calendar"></i> ${date}
                    </div>
                </div>
                <div class="Tracker-Wrapper-Left" id="${days}-tracker-sep">
                    <div class="tracker-v2" id="active-tracker-${todaysDate}">
                        <div class="tracker-icon">
                            <i class="fa-solid fa-list-check"></i>
                        </div>
                        <div class="tracker-info">
                            <span class="tracker-label">Picks Submitted</span>
                            <div class="tracker-numbers">
                                <span id="curr-val-${todaysDate}">${todaysPicks}</span> / <span id="total-val-${todaysDate}">${todaysTotal}</span>
                            </div>
                        </div>
                        <div class="tracker-bar-bg">
                            <div class="tracker-bar-fill" id="bar-fill-${todaysDate}" style="width: 0%;"></div>
                        </div>
                    </div>
                </div>
                `;
                lastDate = date;
                sep = true;
              }
              
              if (FILTER === 'SOJR' && game.rothstein && (game.rothstein != sojrLast || sep)) {
                if (!document.getElementById(`${days}-${game.rothstein}-col-1`)) {
                filterHTML = `
                  <div class="tweet-content">
                    ${game.rothstein == "watch" ? "TODAY'S GAMES TO WATCH" : "TODAY'S UNDER-THE-RADAR GAMES"}:
                  </div>
                `;
                  sep = true;
                }
                sojrLast = game.rothstein;
                if (!indexBrk[sojrLast]) {
                  indexBrk[sojrLast] = 1;
                }
              }

              if (sep) {
                if (notCompleted) {
                  list.insertAdjacentHTML('beforeend', separatorHTML);
                  list.insertAdjacentHTML('beforeend', filterHTML);
                  list.insertAdjacentHTML('beforeend', `<div class="Matchup-Column matchupsA" id="${days}-${sojrLast}-col-1"></div>`);
                  list.insertAdjacentHTML('beforeend', `<div class="Matchup-Column matchupsB" id="${days}-${sojrLast}-col-2"></div>`);
                  if (separatorHTML !== '') {
                    indexBrk = { 'all': 0 };
                    indexBrk[sojrLast] =  1;
                  }
                } else {
                  if (separatorHTML !== '') {
                    finalList.insertAdjacentHTML('afterbegin', `<div class="Matchup-Column matchupsB" id="${days}-${sojrLast}-col-2"></div>`);
                    finalList.insertAdjacentHTML('afterbegin', `<div class="Matchup-Column matchupsA" id="${days}-${sojrLast}-col-1"></div>`);
                    finalList.insertAdjacentHTML('afterbegin', filterHTML);
                    finalList.insertAdjacentHTML('afterbegin', separatorHTML);
                    indexBrk = { 'all': 0 };
                    indexBrk[sojrLast] =  1;
                  } else {
                    const tempList = document.getElementById(`${days}-tracker-sep`);
                    tempList.insertAdjacentHTML('afterend', `<div class="Matchup-Column matchupsB" id="${days}-${sojrLast}-col-2"></div>`);
                    tempList.insertAdjacentHTML('afterend', `<div class="Matchup-Column matchupsA" id="${days}-${sojrLast}-col-1"></div>`);
                    tempList.insertAdjacentHTML('afterend', filterHTML);
                  }
                }
              }
              if (todaysPicks != null) {
                updateCompactTracker(todaysPicks, todaysTotal, todaysDate);
              }
              
                const colA = document.getElementById(`${days}-${sojrLast}-col-1`);
                const colB = document.getElementById(`${days}-${sojrLast}-col-2`);

                const cardHTML = renderCardHTML(game, week);
                if ((indexBrk[sojrLast] + 1) % 2 === 0) {
                    colA.insertAdjacentHTML(notCompleted ? 'beforeend' : 'afterbegin', cardHTML);
                    indexBrk[sojrLast] += 1;
                } else {
                    colB.insertAdjacentHTML(notCompleted ? 'beforeend' : 'afterbegin', cardHTML);
                    indexBrk[sojrLast] += 1;
                }
            });
        }

// --- LEGEND LOGIC ---

function toggleLegend() {
    const drawer = document.getElementById('rosterList');
    const btnIcon = document.querySelector('.Legend-Toggle-Btn i');
    const btn = document.querySelector('.Legend-Toggle-Btn');
    
    drawer.classList.toggle('open');
    btn.classList.toggle('active');
}

function renderLegend() {
    const container = document.getElementById('rosterList');
    container.innerHTML = PICKERS.map(p => {
        // Reuse your consistent color logic
        // We use a simplified Avatar style just for the legend
        
        const content = p.icon 
            ? `<i class="${p.icon}" style="font-size: 11px;"></i>` 
            : p.id;
        return `
            <div class="Legend-User">
                <div class="Avatar" style="background-color: ${p.color}; width: 20px; height: 20px; font-size: 9px; border:none;">
                    ${content}
                </div>
                <span class="Legend-Name">${MOCK_USERS.find(u => u.id === p.uuid)?.username ?? p.username}</span>
            </div>
        `;
    }).join('');
}



















/* Top 25 */
const container = document.getElementById('ballotContainer');
        const modal1 = document.getElementById('teamModal');
        //const saveBtn = document.getElementById('saveBtn');
        const viewSelector = document.getElementById('viewSelector');

// --- SORTABLE INITIALIZATION ---
function initSortable() {
    sortableInstance = new Sortable(container, {
        handle: '.Drag-Handle', 
        
        // ANIMATION SETTINGS
        animation: 350,          // Slower animation = smoother "push" feel
        easing: "cubic-bezier(1, 0, 0, 1)", // Snappy slide effect
        
        // INTERACTION FEEL
        forceFallback: true,     // Disables native HTML5 DnD (Required for smooth mobile)
        fallbackClass: "sortable-fallback", // Class for the "lifted" item
        ghostClass: "sortable-ghost",       // Class for the "hole"
        
        // UX POLISH
        scroll: true,            // Auto-scroll when dragging near edge
        scrollSensitivity: 100,  // How close to edge to trigger scroll
        scrollSpeed: 20,         // How fast to scroll
        delay: 0,                // Instant pick up (can set to 150 for touch protection)
        fallbackOnBody: true,    // Appends dragged item to Body so it's never clipped

        // DATA LOGIC (Unchanged)
        onEnd: function (evt) {
            const item = draftBallot.splice(evt.oldIndex, 1)[0];
            draftBallot.splice(evt.newIndex, 0, item);
            renderBallot(); 
        }
    });
}

function renderBallot(initialLoad = false, submitted = false) {
    container.innerHTML = '';
    
    // Determine which data to show
    let dataToShow = [];
    let isReadOnly = false;

    if (currentView === 'DRAFT') {
        dataToShow = draftBallot;
        isReadOnly = isSubmitted;
        //saveBtn.classList.remove('hidden');
        if(sortableInstance) sortableInstance.option("disabled", false);
    } else {
        dataToShow = MOCK_DB[currentView]?.slice(0,25);
        isReadOnly = true;
        //saveBtn.classList.add('hidden');
        if(sortableInstance) sortableInstance.option("disabled", true);
    }

    if (currentView === 'OFFICIAL') {
      container.classList.add('mode-official');
      container.classList.add('is-creative');
    } else {
      container.classList.remove('mode-official');
      container.classList.remove('is-creative');
    }
    !initialLoad && updateTop25(getCurrentUser().sub, `week${CURRENT_WEEK}`, draftBallot, `submitted${CURRENT_WEEK}`, submitted);

    updateHeaderControls(isReadOnly);

    let lastVotes = [-1, -1]; // for ties

    dataToShow.forEach((team, index) => {
        const teamKey = currentView === 'OFFICIAL' ? team.key : team;
        const teamVotes = team.totalVotes ?? '25';
        const firstPlaceVotes = team.firstPlace ?? '25';
        const rank = index + 1;
        const isFilled = teamKey != 0;
        const rowClass = isFilled ? 'is-filled' : 'is-empty';
        
        let contentHTML = '';
        let controlsHTML = '';

        const handleHTML = isReadOnly ? '' : `<div class="Drag-Handle"><i class="fa-solid fa-grip-lines"></i></div>`;

        if (isFilled) {
            const team = TEAMS.find(team => team.id == teamKey);
            contentHTML = `
                <div class="Team-Info">
                    <img src="https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/${team.id}.png&h=200&w=200" class="Team-Logo" alt="${team.name}">
                    <div class="Team-Name">${team.name}</div>
                </div>
            `;
            
            // CONTROLS (Only in Draft Mode)
            if (!isReadOnly) {
                const upVisibility = index === 0 ? 'hidden' : '';
                const downVisibility = index === 24 ? 'hidden' : '';
                controlsHTML = `
                    <div class="Row__Controls">
                        <button class="Control-Btn ${upVisibility}" onclick="moveTeam(${index}, -1)">
                            <i class="fa-solid fa-chevron-up"></i>
                        </button>
                        <!--
                        <button class="Control-Btn remove" onclick="clearRow(${index})">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                        -->
                        <button class="Control-Btn ${downVisibility}" onclick="moveTeam(${index}, 1)">
                            <i class="fa-solid fa-chevron-down"></i>
                        </button>
                    </div>
                `;
            } else if (currentView === 'OFFICIAL') {
                controlsHTML = `<p style="color: gray; font-family:'Oswald'; width: 70px;">${teamVotes} ${firstPlaceVotes > 0 ? '(' + firstPlaceVotes.toString() + ')' : ''}</p>`
            }
        } else {
            // EMPTY STATE (Only in Draft Mode)
            contentHTML = `<div class="Placeholder-Text">${isReadOnly ? '-' : 'Tap to Select'}</div>`;
        }

        // Handle Click (Disable in ReadOnly)
        const clickAction = (!isReadOnly) ? `onclick="openSelector(${index})"` : '';
        const readonlyClass = isReadOnly ? 'readonly' : '';


        if (currentView !== 'OFFICIAL') {
          const html = `
              <div class="Ballot-Row ${rowClass}">
                  ${handleHTML}
                  <div class="Row__Rank">${rank}</div>
                  <div class="Row__Content ${readonlyClass}" ${clickAction}>
                      ${contentHTML}
                  </div>
                  ${controlsHTML}
              </div>
          `;
          container.insertAdjacentHTML('beforeend', html);
        } else {
        // --- VIEW 2: OFFICIAL (Colored Creative Grid) ---
        //document.body.classList.add('mode-official');
        //listElement.classList.add('is-creative');
        
        if(sortableInstance) sortableInstance.option("disabled", true);

        const data = MOCK_DB['OFFICIAL'];
       
        //${data[0].totalVotes} ${firstPlace > 0 ? ("(" + firstplace ")") : ""}
        if (index === 0) {
          renderCreativeCard(data[0].key, 1, data[0].totalVotes, data[0].firstPlace, 'rank-1');
        } else {
          renderCreativeCard(data[index].key, data[index].totalVotes === lastVotes[0] ? lastVotes[1] : index + 1, data[index].totalVotes, data[index].firstPlace, 'rank-grid');
        }
        if (data[index].totalVotes !== lastVotes[0]) {
          lastVotes[0] = data[index].totalVotes;
          lastVotes[1] = index + 1;
        }
      }
    });

const listHTML = currentView === 'OFFICIAL' ? `
<div class="ORV-Container">
<span class="ORV-Label">Others receiving votes:</span> 
${MOCK_DB[currentView].slice(25).map(t => `${TEAMS.find(team => team.id == t.key).name} ${t.totalVotes}`).join(', ')}
</div>
` : '';

container.insertAdjacentHTML('beforeend', listHTML);

}

// Helper for Creative Cards
function renderCreativeCard(teamKey, rank, votes, firstPlace, className) {
    let teamName = TEAMS.find(team => team.id == teamKey).name;
    let firstPlaceClass = className;
    if (teamName === 'North Carolina Tar Heels') teamName = 'UNC Tar Heels';
    if (teamName === 'Nebraska Cornhuskers' && rank === 1) {
      firstPlaceClass = 'rank-corn';
    } else if (teamName === 'Michigan Wolverines' && rank === 1) {
      firstPlaceClass = 'rank-mich';
    } else if (teamName === 'Duke Blue Devils' && rank === 1) {
      firstPlaceClass = 'rank-duke';
    }
    const firstPlaceHTML = firstPlace > 0 ? '<span class="Votes-First">(' + firstPlace  + ')</span>' : '';
    container.insertAdjacentHTML('beforeend', `
        <div class="Creative-Card ${firstPlaceClass}">
            <div class="Creative-Content">
                <div class="Creative-Rank">${rank}</div>
                <img src="https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/${teamKey}.png&h=200&w=200" class="Creative-Logo Team-Logo" alt="Test">
                <div class="Creative-Name">${teamName}</div>
<div class="Creative-Votes">
<span class="Votes-Total">${votes}</span>
${firstPlaceHTML}
</div>
        </div>
    `);
}

function switchView(newView) {
    currentView = newView;
    renderBallot(true);
}
window.switchView = switchView;

// --- MODAL & SEARCH ---

function openSelector(index) {
    activeSelectorSource = 'top25';
    activeConfTourneyId = null;
    activeRowIndex = index;
    const modalHeader = document.getElementById('teamModalHeader');
    if (modalHeader) modalHeader.textContent = 'Select Team';
    document.getElementById('teamSearch').value = ''; // Reset Search
    renderTeamGrid();
    modal1.classList.add('active');
    setTimeout(() => document.getElementById('teamSearch').focus(), 100);
}
window.openSelector = openSelector;

function openConfTourneySelector(tourneyId) {
    if (CONF_TOURNEY_PICKS?.find(pick => pick.uuid === getCurrentUser()?.sub)?.submitted) return;
    activeSelectorSource = 'conf-tourney';
    activeConfTourneyId = tourneyId;

    const modalHeader = document.getElementById('teamModalHeader');
    const tourney = mockDB.tournaments.find((item) => item.id === tourneyId);
    if (modalHeader) {
      modalHeader.textContent = tourney ? `Pick Winner: ${tourney.conf}` : 'Select Team';
    }

    document.getElementById('teamSearch').value = '';
    renderTeamGrid();
    modal1.classList.add('active');
    setTimeout(() => document.getElementById('teamSearch').focus(), 100);
}
window.openConfTourneySelector = openConfTourneySelector;

function filterTeams() {
    const query = document.getElementById('teamSearch').value.toLowerCase();
    const items = document.querySelectorAll('.Selectable-Team');
    
    items.forEach(item => {
        const name = item.getAttribute('data-name').toLowerCase();
        if (name.includes(query)) {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    });
}
window.filterTeams = filterTeams;

async function renderTeamGrid() {
    const grid = document.getElementById('teamGrid');
    grid.innerHTML = '';

    if (!TEAMS) {
      TEAMS = await fetchD1();
    }

    if (activeSelectorSource === 'conf-tourney') {
        const tourney = mockDB.tournaments.find((item) => item.id === activeConfTourneyId);
        if (!tourney) return;

        const selectedTeamId = CONF_TOURNEY_PICKS?.find(pick => pick.uuid === getCurrentUser().sub)?.[tourney.id];
        for (const team of TEAMS.filter(t => t.conf === activeConfTourneyId)) {
            const isSelected = String(selectedTeamId) === String(team.id);
            const selectedStyle = isSelected ? 'border-color: #0984e3; background: #f0f8ff;' : '';
            const html = `
                <div class="Selectable-Team"
                     style="${selectedStyle}"
                     onclick="selectTeam('${team.id}')"
                     data-name="${team.name}">
                    <img src="https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/${team.id}.png&h=200&w=200">
                    <span>${team.name}</span>
                    ${isSelected ? '<i class="fa-solid fa-check" style="margin-left:auto; color:#0984e3;"></i>' : ''}
                </div>
            `;
            grid.insertAdjacentHTML('beforeend', html);
        }
        return;
    }

    const usedTeams = draftBallot.filter(t => t != 0);

    for (const team of TEAMS) {
        // Determine disabled state
        const isUsed = (usedTeams.includes(team.id) || usedTeams.includes(team.id.toString())) && draftBallot[activeRowIndex] != team.id;
        const disabledClass = isUsed ? 'disabled' : '';
        const style = isUsed ? 'opacity: 0.4;' : '';

        const html = `
            <div class="Selectable-Team ${disabledClass}" 
                 style="${style}" 
                 onclick="selectTeam('${team.id}')"
                 data-name="${team.name}">
                <img src="https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/${team.id}.png&h=200&w=200">
                <span>${team.name}</span>
                ${isUsed ? '<i class="fa-solid fa-check" style="margin-left:auto; color:#b2bec3;"></i>' : ''}
            </div>
        `;
        grid.insertAdjacentHTML('beforeend', html);
    }
}

function selectTeam(teamKey) {
    if (activeSelectorSource === 'conf-tourney') {
        if (!activeConfTourneyId) return;
        updateConfTourneyPicks(getCurrentUser().sub,{[activeConfTourneyId]: String(teamKey)}).then(res1 => {
        fetchConfTourneyPicks().then(res=> {
          CONF_TOURNEY_PICKS = res.data;
          renderConfTourneyTable(res.data);
        });
        });
        console.log('test');
        closeModal();
        return;
    }

    draftBallot[activeRowIndex] = teamKey;
    closeModal();
    renderBallot();
}
window.selectTeam = selectTeam;

function closeModal(e) {
    if (e && !e.target.classList.contains('Modal-Overlay') && !e.target.classList.contains('Modal-Close')) return;
    modal1.classList.remove('active');
}
window.closeModal = closeModal;

// --- DRAFT MANIPULATION ---

function clearRow(index) {
    event.stopPropagation();
    draftBallot[index] = 0;
    renderBallot();
}
window.clearRow = clearRow;

function moveTeam(index, direction) {
    event.stopPropagation();
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= draftBallot.length) return;
    const temp = draftBallot[index];
    draftBallot[index] = draftBallot[newIndex];
    draftBallot[newIndex] = temp;
    renderBallot();
}
window.moveTeam = moveTeam;

function saveBallot() {
    return;
    // Validate
    const filledCount = draftBallot.filter(t => t !== null).length;
    if (filledCount === 0) {
        alert("Please select at least one team.");
        return;
    }

    // 1. Save logic (mocking DB save)
    // We update 'DRAFT' view or create a 'MY_SAVED' view. 
    // For demo, let's pretend we submitted to Official.
    
    alert(`Ballot Submitted! Switching to Official Rankings.`);

    // 2. Transition View
    viewSelector.value = "OFFICIAL";
    switchView("OFFICIAL");
}

function updateHeaderControls(readOnly) {
    const btnSubmit = document.getElementById('btnSubmit');
    const badge = document.getElementById('badgeSubmitted');

        Object.keys(MOCK_DB).sort(idCompareSort).forEach((picker, idx) => {
          if (idx > 0 && !viewSelector.options[idx+1]) {
          viewSelector.options.add(new Option(MOCK_USERS.find(u => u.id === picker)?.username ?? picker,picker));
          }
        });
    
    // If we are looking at Official data, hide everything
    if (currentView !== 'DRAFT') {
        btnSubmit.classList.add('hidden');
        badge.classList.add('hidden');
        viewSelector.options[0].text = "My Ballot";
        viewSelector.disabled = false;
        return;
    }

    // If Draft mode, toggle based on submission state
    if (isSubmitted) {
        viewSelector.disabled = false;
        viewSelector.options[0].text = "My Ballot";
        btnSubmit.classList.add('hidden');
        badge.classList.remove('hidden');
    } else {
        viewSelector.disabled = true;
        viewSelector.options[0].text = "My Draft Ballot";
        btnSubmit.classList.remove('hidden');
        badge.classList.add('hidden');
    }


}

function submitBallot() {
    const filledCount = draftBallot.filter(x => x != 0).length;
    if (filledCount !== 25) return alert("You must complete entire ballot before submitting!");

    isSubmitted = true;
    
    // TODO: Set Time
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    //document.getElementById('submissionTime').innerText = `Submitted ${timeString}`;

    renderBallot(false, true);
    setTimeout( () => {fetchD1().then((res) => { TEAMS = res; getCurrentUser() && fetchTop25().then((res2) => { populateMockDB(res2.data); initSortable(); renderBallot(true); }); });}, 1000 );
}
window.submitBallot = submitBallot;

function toggleUnsubmitMenu() {
    const menu = document.getElementById('unsubmitDropdown');
    menu.classList.toggle('active');
    
    // Auto close if clicking elsewhere
    if(menu.classList.contains('active')) {
        setTimeout(() => {
            document.addEventListener('click', closeMenuOutside, {once:true});
        }, 0);
    }
}
window.toggleUnsubmitMenu = toggleUnsubmitMenu;

function closeMenuOutside(e) {
  if (!e.target.closest('.Badge-Submitted')) {
    document.getElementById('unsubmitDropdown').classList.remove('active');
  }
}
window.closeMenuOutside = closeMenuOutside;

function unsubmitBallot() {
  isSubmitted = false;
  document.getElementById('unsubmitDropdown').classList.remove('active');
  renderBallot(false, false); 
}
window.unsubmitBallot = unsubmitBallot;

















// AUTH LOGIC
const isUserLoggedIn = false;
if (!isUserLoggedIn) {
  document.getElementById('gatekeeper').classList.add('active');
  const cont = document.querySelector('.Picks-Container');
  cont.classList.add('is-locked');
}

function simulateLogin() {
  const btn = document.querySelector('.GK__Button');
  btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Verifying...';
  setTimeout(() => {
    document.getElementById('lockIcon').classList.replace('locked','unlocked');
    document.getElementById('iconSymbol').classList.replace('fa-lock','fa-lock-open');
    btn.style.background = '#00b894'; btn.innerText = "Welcome!";
    setTimeout(() => {
      document.getElementById('gatekeeper').style.transform = 'translateY(-100%)';
      document.body.classList.remove('is-locked');
    }, 800);
  }, 1000);
}
























/* ANALYTICS DASHBOARD */
const USER_STATS = {
  'all': {}
};

function updateUserStats(userId) {
    const data = USER_STATS[userId] || { hot: [], cold: [] };
    const hotContainer = document.getElementById('hotList');
    const coldContainer = document.getElementById('coldList');

    hotContainer.innerHTML = data.hot.map(team => {
      const victories = team.victory.map(w => `
                <div class="Mini-Game">
                    ${w.venue === 'away' ? `<span class="Loc-Badge">@</span>` : ''}
                    <img src="https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/${w.id}.png&h=50&w=50" class="Mini-Logo" title="">
                </div>
          `).join('');
      const defeats = team.defeat.map(l => `
                <div class="Mini-Game">
                    ${l.venue === 'home' ? `<span class="Loc-Badge">@</span>` : ''}
                    <img src="https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/${l.id}.png&h=50&w=50" class="Mini-Logo" title="">
                </div>
          `).join('');
      return `
        <div class="Team-Record-Item">
            <div class="Team-Identity">
                <img src="https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/${team.id}.png&h=200&w=200" class="Team-Logo">
<div class="Name-Container">
      <div class="Team-Name">${team.name}</div>

      <div class="History-Track is-loss">
      ${defeats}
            </div>

            <div class="History-Track is-win">
      ${victories}
                
            </div>
      
    </div>
            </div>
            <div>
                <div class="Record-Badge">${team.record}</div>
                <div class="Win-Pct">${team.pct}</div>
            </div>
        </div>
    `; 
    }).join('');

    coldContainer.innerHTML = data.cold.map(team => {
      const victories = team.victory.map(w => `
                <div class="Mini-Game">
                    ${w.venue === 'away' ? `<span class="Loc-Badge">@</span>` : ''}
                    <img src="https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/${w.id}.png&h=50&w=50" class="Mini-Logo" title="">
                </div>
          `).join('');
      const defeats = team.defeat.map(l => `
                <div class="Mini-Game">
                    ${l.venue === 'home' ? `<span class="Loc-Badge">@</span>` : ''}
                    <img src="https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/${l.id}.png&h=50&w=50" class="Mini-Logo" title="">
                </div>
          `).join('');
    return `
        <div class="Team-Record-Item">
            <div class="Team-Identity">
                <img src="https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/${team.id}.png&h=200&w=200" class="Team-Logo">
<div class="Name-Container">
      <div class="Team-Name">${team.name}</div>

      <div class="History-Track is-loss">
      ${defeats}
            </div>

            <div class="History-Track is-win">
      ${victories}
            </div>
      
    </div>
            </div>
            <div>
                <div class="Record-Badge">${team.record}</div>
                <div class="Win-Pct">${team.pct}</div>
            </div>
        </div>
    `;
    }).join('');

    if (data.hot.length === 0) {
      hotContainer.innerHTML = `<div class="Pulse-Empty">No hot teams yet for this filter.</div>`;
    }

    if (data.cold.length === 0) {
      coldContainer.innerHTML = `<div class="Pulse-Empty">No cold teams yet for this filter.</div>`;
    }
}

function initCharts() {
    Chart.defaults.font.family = "'Segoe UI', sans-serif";
    Chart.defaults.color = '#64748b';

    /* RADAR CHART */
    const ctxRadar = document.getElementById('radarChart').getContext('2d');
    new Chart(ctxRadar, {
        type: 'radar',
        data: {
            labels: ['NBA', 'NFL', 'NCAA B', 'NCAA F', 'MLB', 'NHL'],
            datasets: [
                {
                    label: 'JD',
                    data: [85, 60, 70, 90, 55, 40],
                    borderColor: '#CC0033',
                    backgroundColor: 'rgba(204, 0, 51, 0.2)',
                    pointBackgroundColor: '#CC0033',
                    borderWidth: 2
                },
                {
                    label: 'ArchStep',
                    data: [50, 85, 60, 50, 75, 80],
                    borderColor: '#003366', // Husker Blue
                    backgroundColor: 'rgba(0, 51, 102, 0.2)',
                    pointBackgroundColor: '#003366',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: { color: '#e2e8f0' },
                    grid: { color: '#e2e8f0' },
                    pointLabels: {
                        font: { size: 12, weight: '700', family: 'Oswald' },
                        color: '#1e293b'
                    },
                    ticks: { display: false } // Hide numbers on axis
                }
            },
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

function hexToRgba(hex, alpha = 1) {
  if (!hex) return `rgba(100, 116, 139, ${alpha})`;

  if (hex.startsWith('rgb')) {
    const values = hex.replace(/[^\d,]/g, '').split(',').map(Number);
    if (values.length >= 3) {
      return `rgba(${values[0]}, ${values[1]}, ${values[2]}, ${alpha})`;
    }
  }

  let clean = hex.replace('#', '');
  if (clean.length === 3) {
    clean = clean.split('').map(ch => ch + ch).join('');
  }

  const r = Number.parseInt(clean.slice(0, 2), 16);
  const g = Number.parseInt(clean.slice(2, 4), 16);
  const b = Number.parseInt(clean.slice(4, 6), 16);

  if ([r, g, b].some(v => Number.isNaN(v))) {
    return `rgba(100, 116, 139, ${alpha})`;
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function createGradient(ctx, color) {
  const gradient = ctx.createLinearGradient(0, 0, 0, 360);
  gradient.addColorStop(0, hexToRgba(color, 0.24));
  gradient.addColorStop(1, hexToRgba(color, 0.03));
  return gradient;
}

let raceChartInstance = null;
let leagueMixChartInstance = null;
let consensusStrengthChartInstance = null;

function toPct(value, total, digits = 1) {
  if (!total) return `${(0).toFixed(digits)}%`;
  return `${((value / total) * 100).toFixed(digits)}%`;
}

function toPctNumber(value, total) {
  if (!total) return 0;
  return (value / total) * 100;
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function computeGameAnalytics(games) {
  const validPickerIds = new Set(PICKERS.map(picker => picker.id));
  const analytics = {
    totalGames: games.length,
    resolvedGames: 0,
    pendingGames: 0,
    totalPicks: 0,
    resolvedPicks: 0,
    winningPicks: 0,
    activePickers: new Set(),
    consensusGames: 0,
    consensusWins: 0,
    leaguePickVolume: {},
    dayStats: {},
    consensusBuckets: {},
  };

  games.forEach(game => {
    const homePicks = Array.isArray(game.home_picks) ? game.home_picks : [];
    const awayPicks = Array.isArray(game.away_picks) ? game.away_picks : [];
    const totalPicks = homePicks.length + awayPicks.length;

    analytics.totalPicks += totalPicks;
    homePicks.forEach(id => { if (validPickerIds.has(id)) analytics.activePickers.add(id); });
    awayPicks.forEach(id => { if (validPickerIds.has(id)) analytics.activePickers.add(id); });

    const leagueLabel = game.league || 'Unlisted';
    analytics.leaguePickVolume[leagueLabel] = (analytics.leaguePickVolume[leagueLabel] || 0) + totalPicks;

    const dayKey = dateFromTimestamp(game.time, 'num');
    if (!analytics.dayStats[dayKey]) {
      analytics.dayStats[dayKey] = {
        key: dayKey,
        label: dateFromTimestamp(game.time),
        games: 0,
        resolvedGames: 0,
        picks: 0,
        resolvedPicks: 0,
        winningPicks: 0,
      };
    }

    const day = analytics.dayStats[dayKey];
    day.games += 1;
    day.picks += totalPicks;

    const hasWinner = game.winner === 'home' || game.winner === 'away';
    if (!hasWinner) {
      analytics.pendingGames += 1;
      return;
    }

    analytics.resolvedGames += 1;
    analytics.resolvedPicks += totalPicks;
    day.resolvedGames += 1;
    day.resolvedPicks += totalPicks;

    const winningCount = game.winner === 'home' ? homePicks.length : awayPicks.length;
    analytics.winningPicks += winningCount;
    day.winningPicks += winningCount;

    if (homePicks.length !== awayPicks.length) {
      const dominantSide = homePicks.length > awayPicks.length ? 'home' : 'away';
      const dominantCount = Math.max(homePicks.length, awayPicks.length);
      const bucketLabel = `${dominantCount} pick${dominantCount === 1 ? '' : 's'}`;

      if (!analytics.consensusBuckets[bucketLabel]) {
        analytics.consensusBuckets[bucketLabel] = { label: bucketLabel, count: dominantCount, wins: 0, total: 0 };
      }
      analytics.consensusBuckets[bucketLabel].total += 1;
      if (dominantSide === game.winner) {
        analytics.consensusBuckets[bucketLabel].wins += 1;
      }

      if (dominantCount >= 3 && Math.abs(homePicks.length - awayPicks.length) >= 2) {
        analytics.consensusGames += 1;
        if (dominantSide === game.winner) {
          analytics.consensusWins += 1;
        }
      }
    }
  });

  return {
    ...analytics,
    daily: Object.values(analytics.dayStats).sort((a, b) => new Date(b.key) - new Date(a.key)),
    consensusSeries: Object.values(analytics.consensusBuckets).sort((a, b) => a.count - b.count),
  };
}

function renderStatsKpis(analytics) {
  const profileCount = Array.isArray(MOCK_USERS) ? MOCK_USERS.length : 0;

  setText('kpiResolvedGames', `${analytics.resolvedGames}/${analytics.totalGames}`);
  setText('kpiResolvedSub', `${analytics.pendingGames} pending`);
  setText('kpiTotalPicks', analytics.totalPicks.toLocaleString());
  setText('kpiPendingPicks', `${analytics.resolvedPicks.toLocaleString()} resolved picks`);
  setText('kpiHitRate', toPct(analytics.winningPicks, analytics.resolvedPicks));
  setText('kpiConsensusRate', toPct(analytics.consensusWins, analytics.consensusGames));
  setText('kpiConsensusSub', `${analytics.consensusGames} high-consensus games`);
  setText('kpiActivePickers', analytics.activePickers.size.toString());
  setText('kpiProfilesSeen', `${profileCount} profiles fetched`);
}

function renderPickerPulse(games) {
  const container = document.getElementById('pickerPulseList');
  if (!container) return;

  const playerStats = getPlayerStats(games)
    .map(player => {
      const picker = PICKERS.find(p => p.id === player.id);
      if (!picker || !picker.username || picker.id === 'BOOTS') return null;
      return {
        ...player,
        picker,
        winPct: toPctNumber(player.wins, player.attempts),
      };
    })
    .filter(Boolean)
    .filter(player => player.attempts >= 3)
    .sort((a, b) => b.winPct - a.winPct || b.attempts - a.attempts)
    .slice(0, 7);

  if (playerStats.length === 0) {
    container.innerHTML = `<div class="Pulse-Empty">No completed games yet for picker pulse.</div>`;
    return;
  }

  container.innerHTML = playerStats.map((player, idx) => `
    <div class="Pulse-Row">
      <div class="Pulse-Rank">${idx + 1}</div>
      <div class="Pulse-User">
        <span class="Pulse-Avatar" style="background-color: ${player.picker.color};">${player.picker.id}</span>
        <span class="Pulse-Name">${player.picker.username}</span>
      </div>
      <div class="Pulse-Record">${player.wins}-${player.attempts - player.wins}</div>
      <div class="Pulse-Rate">${player.winPct.toFixed(1)}%</div>
    </div>
  `).join('');
}

function renderDailyPulse(analytics) {
  const container = document.getElementById('dailyPulseList');
  if (!container) return;

  const rows = analytics.daily.slice(0, 8);
  if (rows.length === 0) {
    container.innerHTML = `<div class="Pulse-Empty">No game-day data for this view.</div>`;
    return;
  }

  container.innerHTML = rows.map(day => `
    <div class="Day-Pulse-Row">
      <div class="Day-Pulse-Date">${day.label}</div>
      <div class="Day-Pulse-Volume">${day.resolvedGames}/${day.games} final • ${day.picks} picks</div>
      <div class="Day-Pulse-Rate">${toPct(day.winningPicks, day.resolvedPicks)}</div>
    </div>
  `).join('');
}

function getWeeklyTrendSeries(games) {
  const pickerMap = PICKERS.reduce((acc, picker) => {
    acc[picker.id] = picker;
    return acc;
  }, {});

  const weeks = new Set();
  const playerStats = {};

  const tallyPicks = (ids, won, week) => {
    ids.forEach(playerId => {
      const picker = pickerMap[playerId];
      if (!picker || picker.id === 'BOOTS') return;

      if (!playerStats[playerId]) {
        playerStats[playerId] = { picker, wins: 0, attempts: 0, byWeek: {} };
      }

      if (!playerStats[playerId].byWeek[week]) {
        playerStats[playerId].byWeek[week] = { wins: 0, attempts: 0 };
      }

      playerStats[playerId].attempts += 1;
      playerStats[playerId].byWeek[week].attempts += 1;

      if (won) {
        playerStats[playerId].wins += 1;
        playerStats[playerId].byWeek[week].wins += 1;
      }
    });
  };

  games.forEach(game => {
    if (!game || (game.winner !== 'home' && game.winner !== 'away')) return;

    const week = String(game.week ?? CURRENT_WEEK);
    weeks.add(week);

    const homePicks = Array.isArray(game.home_picks) ? game.home_picks : [];
    const awayPicks = Array.isArray(game.away_picks) ? game.away_picks : [];

    tallyPicks(homePicks, game.winner === 'home', week);
    tallyPicks(awayPicks, game.winner === 'away', week);
  });

  const sortedWeeks = [...weeks].sort((a, b) => Number(a) - Number(b));
  const topPlayers = Object.values(playerStats)
    .filter(player => player.attempts >= 3)
    .sort((a, b) => (b.wins / b.attempts) - (a.wins / a.attempts) || b.attempts - a.attempts)
    .slice(0, 6);

  return {
    weeks: sortedWeeks,
    datasets: topPlayers.map(player => ({
      label: player.picker.username,
      color: player.picker.color,
      data: sortedWeeks.map(week => {
        const row = player.byWeek[week];
        if (!row || row.attempts === 0) return null;
        return Number(((row.wins / row.attempts) * 100).toFixed(1));
      }),
    })),
  };
}

function showRaceChart(games) {
  const canvas = document.getElementById('raceChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const subtitle = document.getElementById('trendChartSubtitle');
  const trendData = getWeeklyTrendSeries(games);

  if (raceChartInstance) {
    raceChartInstance.destroy();
  }

  if (trendData.weeks.length === 0 || trendData.datasets.length === 0) {
    if (subtitle) subtitle.textContent = 'No completed game trend yet for this filter';
    raceChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['No Data'],
        datasets: [{
          data: [0],
          borderColor: '#cbd5e1',
          backgroundColor: 'rgba(203, 213, 225, 0.2)',
          fill: true,
          pointRadius: 0,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: { x: { grid: { display: false } }, y: { display: false } },
      },
    });
    return;
  }

  if (subtitle) {
    const firstWeek = trendData.weeks[0];
    const lastWeek = trendData.weeks[trendData.weeks.length - 1];
    subtitle.textContent = `Weeks ${firstWeek}-${lastWeek} • Top ${trendData.datasets.length} pickers`;
  }

  raceChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: trendData.weeks.map(week => `Wk ${week}`),
      datasets: trendData.datasets.map(dataset => ({
        label: dataset.label,
        data: dataset.data,
        borderColor: dataset.color,
        backgroundColor: createGradient(ctx, dataset.color),
        borderWidth: 3,
        tension: 0.25,
        pointRadius: 3,
        pointHoverRadius: 6,
        spanGaps: true,
        fill: true,
      })),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          position: 'top',
          labels: { usePointStyle: true, boxWidth: 7, font: { family: 'Oswald', size: 11 } },
        },
        tooltip: {
          callbacks: { label: (context) => ` ${context.dataset.label}: ${context.raw}%` },
        },
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#64748b', font: { family: 'Oswald' } } },
        y: {
          beginAtZero: true,
          min: 0,
          max: 100,
          grid: { color: '#e2e8f0' },
          ticks: { callback: value => `${value}%`, color: '#64748b', font: { family: 'Oswald' } },
        },
      },
    },
  });
}

function showLeagueMixChart(analytics) {
  const canvas = document.getElementById('leagueMixChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  if (leagueMixChartInstance) {
    leagueMixChartInstance.destroy();
  }

  const sorted = Object.entries(analytics.leaguePickVolume).sort((a, b) => b[1] - a[1]);
  const topLeagues = sorted.slice(0, 6);
  if (sorted.length > 6) {
    const otherTotal = sorted.slice(6).reduce((sum, [, total]) => sum + total, 0);
    topLeagues.push(['Other', otherTotal]);
  }

  if (topLeagues.length === 0) {
    leagueMixChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['No data'],
        datasets: [{ data: [1], backgroundColor: ['#e2e8f0'], borderWidth: 0 }],
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { enabled: false } } },
    });
    return;
  }

  const palette = ['#6c5ce7', '#00cec9', '#fab1a0', '#fdcb6e', '#d63031', '#0984e3', '#00b894'];

  leagueMixChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: topLeagues.map(([league]) => league),
      datasets: [{
        data: topLeagues.map(([, total]) => total),
        backgroundColor: topLeagues.map((_, index) => palette[index % palette.length]),
        borderColor: '#fff',
        borderWidth: 2,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '58%',
      plugins: {
        legend: { position: 'bottom', labels: { boxWidth: 10, font: { family: 'Oswald', size: 11 } } },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const total = topLeagues.reduce((sum, [, value]) => sum + value, 0);
              const pct = total ? ((ctx.raw / total) * 100).toFixed(1) : '0.0';
              return ` ${ctx.label}: ${ctx.raw} picks (${pct}%)`;
            },
          },
        },
      },
    },
  });
}

function showConsensusStrengthChart(analytics) {
  const canvas = document.getElementById('consensusStrengthChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  if (consensusStrengthChartInstance) {
    consensusStrengthChartInstance.destroy();
  }

  const series = analytics.consensusSeries.filter(row => row.total > 0);

  if (series.length === 0) {
    consensusStrengthChartInstance = new Chart(ctx, {
      type: 'bar',
      data: { labels: ['No data'], datasets: [{ data: [0], backgroundColor: '#cbd5e1' }] },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: { x: { grid: { display: false } }, y: { display: false } },
      },
    });
    return;
  }

  consensusStrengthChartInstance = new Chart(ctx, {
    data: {
      labels: series.map(row => row.label),
      datasets: [
        {
          type: 'bar',
          label: 'Accuracy %',
          data: series.map(row => Number(((row.wins / row.total) * 100).toFixed(1))),
          backgroundColor: '#0984e3',
          borderRadius: 8,
          yAxisID: 'y',
        },
        {
          type: 'line',
          label: 'Games',
          data: series.map(row => row.total),
          borderColor: '#fdcb6e',
          backgroundColor: '#fdcb6e',
          tension: 0.2,
          pointRadius: 3,
          yAxisID: 'y1',
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { position: 'bottom', labels: { font: { family: 'Oswald', size: 11 } } },
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { family: 'Oswald', size: 11 } } },
        y: {
          beginAtZero: true,
          max: 100,
          ticks: { callback: value => `${value}%`, font: { family: 'Oswald', size: 11 } },
          grid: { color: '#e2e8f0' },
        },
        y1: {
          position: 'right',
          beginAtZero: true,
          grid: { display: false },
          ticks: { font: { family: 'Oswald', size: 11 } },
        },
      },
    },
  });
}

function computeHomeAwayStats(games) {
  const stats = {
    homeWins: 0,
    awayWins: 0,
    totalResolved: 0,
  };

  games.forEach(game => {
    if (game.winner === 'home') {
      stats.homeWins += 1;
      stats.totalResolved += 1;
    } else if (game.winner === 'away') {
      stats.awayWins += 1;
      stats.totalResolved += 1;
    }
  });

  return stats;
}

function computeTorvikStats(games) {
  const stats = {
    betterTorvikWins: 0,
    worseTorvikWins: 0,
    totalTorvikGames: 0,
    gamesWithTorvik: [],
  };

  games.forEach(game => {
    if (game.home_torvik && game.away_torvik && game.winner) {
      stats.totalTorvikGames += 1;
      
      // Lower torvik = better team
      const homeBetter = game.home_torvik < game.away_torvik;
      const homeWon = game.winner === 'home';
      
      if ((homeBetter && homeWon) || (!homeBetter && !homeWon)) {
        stats.betterTorvikWins += 1;
      } else {
        stats.worseTorvikWins += 1;
      }

      stats.gamesWithTorvik.push({
        ...game,
        betterSide: homeBetter ? 'home' : 'away',
        betterWon: (homeBetter && homeWon) || (!homeBetter && !homeWon),
      });
    }
  });

  return stats;
}

function computePickerTorvikStats(games) {
  const pickerStats = {};
  
  PICKERS.forEach(picker => {
    if (picker.id !== 'BOOTS') {
      pickerStats[picker.id] = {
        picker,
        pickedBetter: 0,
        pickedWorse: 0,
        pickedBetterWins: 0,
        pickedWorseWins: 0,
      };
    }
  });

  games.forEach(game => {
    if (game.home_torvik && game.away_torvik && game.winner) {
      const homeBetter = game.home_torvik < game.away_torvik;
      const homeWon = game.winner === 'home';
      
      const homePicks = Array.isArray(game.home_picks) ? game.home_picks : [];
      const awayPicks = Array.isArray(game.away_picks) ? game.away_picks : [];

      homePicks.forEach(pickerId => {
        if (pickerStats[pickerId]) {
          if (homeBetter) {
            pickerStats[pickerId].pickedBetter += 1;
            if (homeWon) pickerStats[pickerId].pickedBetterWins += 1;
          } else {
            pickerStats[pickerId].pickedWorse += 1;
            if (homeWon) pickerStats[pickerId].pickedWorseWins += 1;
          }
        }
      });

      awayPicks.forEach(pickerId => {
        if (pickerStats[pickerId]) {
          if (!homeBetter) {
            pickerStats[pickerId].pickedBetter += 1;
            if (!homeWon) pickerStats[pickerId].pickedBetterWins += 1;
          } else {
            pickerStats[pickerId].pickedWorse += 1;
            if (!homeWon) pickerStats[pickerId].pickedWorseWins += 1;
          }
        }
      });
    }
  });

  return Object.values(pickerStats).filter(stat => stat.pickedBetter + stat.pickedWorse > 0);
}

function computeFavoriteTeams(games) {
  const pickerTeamStats = {};

  PICKERS.forEach(picker => {
    if (picker.id !== 'BOOTS') {
      pickerTeamStats[picker.id] = {
        picker,
        teams: {},
      };
    }
  });

  games.forEach(game => {
    const homePicks = Array.isArray(game.home_picks) ? game.home_picks : [];
    const awayPicks = Array.isArray(game.away_picks) ? game.away_picks : [];

    homePicks.forEach(pickerId => {
      if (pickerTeamStats[pickerId]) {
        const teamName = game.home;
        if (!pickerTeamStats[pickerId].teams[teamName]) {
          pickerTeamStats[pickerId].teams[teamName] = { picks: 0, wins: 0, teamId: game.home_id };
        }
        pickerTeamStats[pickerId].teams[teamName].picks += 1;
        if (game.winner === 'home') {
          pickerTeamStats[pickerId].teams[teamName].wins += 1;
        }
      }
    });

    awayPicks.forEach(pickerId => {
      if (pickerTeamStats[pickerId]) {
        const teamName = game.away;
        if (!pickerTeamStats[pickerId].teams[teamName]) {
          pickerTeamStats[pickerId].teams[teamName] = { picks: 0, wins: 0, teamId: game.away_id };
        }
        pickerTeamStats[pickerId].teams[teamName].picks += 1;
        if (game.winner === 'away') {
          pickerTeamStats[pickerId].teams[teamName].wins += 1;
        }
      }
    });
  });

  // Determine favorite team for each picker using creative metric
  const favorites = Object.values(pickerTeamStats).map(pickerData => {
    const teamsArray = Object.entries(pickerData.teams).map(([teamName, stats]) => ({
      teamName,
      ...stats,
      winRate: stats.picks > 0 ? stats.wins / stats.picks : 0,
      // "Devotion Score" = (picks^1.5) * (1 + winRate) - rewards frequency and success
      devotionScore: Math.pow(stats.picks, 1.5) * (1 + stats.winRate),
    }));

    teamsArray.sort((a, b) => b.devotionScore - a.devotionScore);

    const favoriteTeam = teamsArray[0];
    if (!favoriteTeam) return null;

    // Creative justification based on stats
    let justification = '';
    if (favoriteTeam.picks >= 5 && favoriteTeam.winRate >= 0.7) {
      justification = `🎯 Loyal champion — ${favoriteTeam.picks} picks with ${(favoriteTeam.winRate * 100).toFixed(0)}% success`;
    } else if (favoriteTeam.picks >= 6) {
      justification = `❤️ Die-hard fan — picked ${favoriteTeam.picks} times regardless of outcome`;
    } else if (favoriteTeam.winRate === 1.0 && favoriteTeam.picks >= 3) {
      justification = `🔥 Perfect record — ${favoriteTeam.picks}-0 when backing them`;
    } else if (favoriteTeam.picks >= 4) {
      justification = `💪 Frequent backer — ${favoriteTeam.picks} picks (${favoriteTeam.wins}-${favoriteTeam.picks - favoriteTeam.wins})`;
    } else {
      justification = `⭐ Early favorite — ${favoriteTeam.picks} picks so far`;
    }

    return {
      picker: pickerData.picker,
      favoriteTeam: favoriteTeam.teamName,
      teamId: favoriteTeam.teamId,
      picks: favoriteTeam.picks,
      wins: favoriteTeam.wins,
      winRate: favoriteTeam.winRate,
      justification,
    };
  }).filter(Boolean);

  return favorites;
}

function renderHomeAwayStats(stats) {
  setText('homeWins', stats.homeWins.toString());
  setText('awayWins', stats.awayWins.toString());
  setText('homeWinRate', toPct(stats.homeWins, stats.totalResolved));
  setText('awayWinRate', toPct(stats.awayWins, stats.totalResolved));
}

function renderTorvikStats(torvikStats) {
  setText('torvikBetterWins', torvikStats.betterTorvikWins.toString());
  setText('torvikWorseWins', torvikStats.worseTorvikWins.toString());
  setText('torvikGamesTotal', torvikStats.totalTorvikGames.toString());
  setText('torvikAccuracy', toPct(torvikStats.betterTorvikWins, torvikStats.totalTorvikGames));
}

function renderPickerTorvikStats(pickerStats) {
  const container = document.getElementById('pickerTorvikList');
  if (!container) return;

  if (pickerStats.length === 0) {
    container.innerHTML = `<div class="Pulse-Empty">No Torvik data available for pickers yet.</div>`;
    return;
  }

  const sorted = pickerStats
    .map(stat => ({
      ...stat,
      betterRate: stat.pickedBetter > 0 ? stat.pickedBetterWins / stat.pickedBetter : 0,
      totalPicks: stat.pickedBetter + stat.pickedWorse,
    }))
    .filter(stat => stat.totalPicks >= 3)
    .sort((a, b) => b.betterRate - a.betterRate)
    .slice(0, 7);

  container.innerHTML = sorted.map((stat, idx) => `
    <div class="Pulse-Row">
      <div class="Pulse-Rank">${idx + 1}</div>
      <div class="Pulse-User">
        <span class="Pulse-Avatar" style="background-color: ${stat.picker.color};">${stat.picker.id}</span>
        <span class="Pulse-Name">${stat.picker.username}</span>
      </div>
      <div class="Pulse-Record">${stat.pickedBetter} better picks</div>
      <div class="Pulse-Rate">${(stat.betterRate * 100).toFixed(1)}%</div>
    </div>
  `).join('');
}

function renderFavoriteTeams(favorites) {
  const container = document.getElementById('favoriteTeamsList');
  if (!container) return;

  if (favorites.length === 0) {
    container.innerHTML = `<div class="Pulse-Empty">Not enough data to determine favorites yet.</div>`;
    return;
  }

  container.innerHTML = favorites.map(fav => {
    const logoUrl = `https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/${fav.teamId}.png&h=80&w=80`;
    return `
      <div class="Favorite-Team-Card">
        <div class="Favorite-Team-Header">
          <span class="Pulse-Avatar" style="background-color: ${fav.picker.color};">${fav.picker.id}</span>
          <span class="Favorite-Team-Picker">${fav.picker.username}</span>
        </div>
        <div class="Favorite-Team-Info">
          <img src="${logoUrl}" class="Favorite-Team-Logo" alt="${fav.favoriteTeam}">
          <div class="Favorite-Team-Name">${fav.favoriteTeam}</div>
          <div class="Favorite-Team-Record">${fav.wins}-${fav.picks - fav.wins} (${(fav.winRate * 100).toFixed(0)}%)</div>
        </div>
        <div class="Favorite-Team-Reason">${fav.justification}</div>
      </div>
    `;
  }).join('');
}

function computeContrarianStats(games) {
  const pickerStats = {};
  
  PICKERS.forEach(picker => {
    if (picker.id !== 'BOOTS') {
      pickerStats[picker.id] = {
        picker,
        totalPicks: 0,
        contrarianPicks: 0,
        contrarianWins: 0,
        consensusPicks: 0,
        consensusWins: 0,
      };
    }
  });

  games.forEach(game => {
    if (!game.winner) return;
    
    const homePicks = Array.isArray(game.home_picks) ? game.home_picks : [];
    const awayPicks = Array.isArray(game.away_picks) ? game.away_picks : [];
    const totalPicks = homePicks.length + awayPicks.length;
    
    if (totalPicks === 0) return;

    const majorityThreshold = totalPicks / 2;
    const homeIsMajority = homePicks.length > majorityThreshold;
    const awayIsMajority = awayPicks.length > majorityThreshold;
    const hasConsensus = homeIsMajority || awayIsMajority;

    homePicks.forEach(pickerId => {
      if (pickerStats[pickerId]) {
        pickerStats[pickerId].totalPicks += 1;
        if (hasConsensus && awayIsMajority) {
          pickerStats[pickerId].contrarianPicks += 1;
          if (game.winner === 'home') pickerStats[pickerId].contrarianWins += 1;
        } else if (hasConsensus && homeIsMajority) {
          pickerStats[pickerId].consensusPicks += 1;
          if (game.winner === 'home') pickerStats[pickerId].consensusWins += 1;
        }
      }
    });

    awayPicks.forEach(pickerId => {
      if (pickerStats[pickerId]) {
        pickerStats[pickerId].totalPicks += 1;
        if (hasConsensus && homeIsMajority) {
          pickerStats[pickerId].contrarianPicks += 1;
          if (game.winner === 'away') pickerStats[pickerId].contrarianWins += 1;
        } else if (hasConsensus && awayIsMajority) {
          pickerStats[pickerId].consensusPicks += 1;
          if (game.winner === 'away') pickerStats[pickerId].consensusWins += 1;
        }
      }
    });
  });

  return Object.values(pickerStats).filter(stat => stat.totalPicks >= 5);
}

function computeConferenceMastery(games) {
  const pickerLeagueStats = {};

  PICKERS.forEach(picker => {
    if (picker.id !== 'BOOTS') {
      pickerLeagueStats[picker.id] = {
        picker,
        leagues: {},
      };
    }
  });

  games.forEach(game => {
    if (!game.winner || !game.league) return;

    const homePicks = Array.isArray(game.home_picks) ? game.home_picks : [];
    const awayPicks = Array.isArray(game.away_picks) ? game.away_picks : [];

    homePicks.forEach(pickerId => {
      if (pickerLeagueStats[pickerId]) {
        if (!pickerLeagueStats[pickerId].leagues[game.league]) {
          pickerLeagueStats[pickerId].leagues[game.league] = { picks: 0, wins: 0 };
        }
        pickerLeagueStats[pickerId].leagues[game.league].picks += 1;
        if (game.winner === 'home') {
          pickerLeagueStats[pickerId].leagues[game.league].wins += 1;
        }
      }
    });

    awayPicks.forEach(pickerId => {
      if (pickerLeagueStats[pickerId]) {
        if (!pickerLeagueStats[pickerId].leagues[game.league]) {
          pickerLeagueStats[pickerId].leagues[game.league] = { picks: 0, wins: 0 };
        }
        pickerLeagueStats[pickerId].leagues[game.league].picks += 1;
        if (game.winner === 'away') {
          pickerLeagueStats[pickerId].leagues[game.league].wins += 1;
        }
      }
    });
  });

  return pickerLeagueStats;
}

function computeRiskProfile(games) {
  const pickerStats = {};
  
  PICKERS.forEach(picker => {
    if (picker.id !== 'BOOTS') {
      pickerStats[picker.id] = {
        picker,
        totalPicks: 0,
        wins: 0,
        contrarianPicks: 0,
        highRiskPicks: 0,
        highRiskWins: 0,
      };
    }
  });

  games.forEach(game => {
    if (!game.winner) return;
    
    const homePicks = Array.isArray(game.home_picks) ? game.home_picks : [];
    const awayPicks = Array.isArray(game.away_picks) ? game.away_picks : [];
    const totalPicks = homePicks.length + awayPicks.length;
    
    if (totalPicks === 0) return;

    const splitRatio = Math.abs(homePicks.length - awayPicks.length) / totalPicks;
    const isHighRisk = splitRatio >= 0.5; // At least 75-25 split

    homePicks.forEach(pickerId => {
      if (pickerStats[pickerId]) {
        pickerStats[pickerId].totalPicks += 1;
        if (game.winner === 'home') pickerStats[pickerId].wins += 1;
        
        if (awayPicks.length > homePicks.length) {
          pickerStats[pickerId].contrarianPicks += 1;
        }
        
        if (isHighRisk && awayPicks.length > homePicks.length) {
          pickerStats[pickerId].highRiskPicks += 1;
          if (game.winner === 'home') pickerStats[pickerId].highRiskWins += 1;
        }
      }
    });

    awayPicks.forEach(pickerId => {
      if (pickerStats[pickerId]) {
        pickerStats[pickerId].totalPicks += 1;
        if (game.winner === 'away') pickerStats[pickerId].wins += 1;
        
        if (homePicks.length > awayPicks.length) {
          pickerStats[pickerId].contrarianPicks += 1;
        }
        
        if (isHighRisk && homePicks.length > awayPicks.length) {
          pickerStats[pickerId].highRiskPicks += 1;
          if (game.winner === 'away') pickerStats[pickerId].highRiskWins += 1;
        }
      }
    });
  });

  return Object.values(pickerStats).filter(stat => stat.totalPicks >= 5);
}

let contrarianChartInstance = null;
let conferenceMasteryChartInstance = null;
let riskProfileChartInstance = null;

function showContrarianChart(contrarianStats) {
  const canvas = document.getElementById('contrarianChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  if (contrarianChartInstance) {
    contrarianChartInstance.destroy();
  }

  const sorted = contrarianStats
    .map(stat => ({
      ...stat,
      contrarianRate: stat.totalPicks > 0 ? (stat.contrarianPicks / stat.totalPicks) * 100 : 0,
      contrarianWinRate: stat.contrarianPicks > 0 ? (stat.contrarianWins / stat.contrarianPicks) * 100 : 0,
      consensusWinRate: stat.consensusPicks > 0 ? (stat.consensusWins / stat.consensusPicks) * 100 : 0,
    }))
    .filter(stat => stat.contrarianPicks >= 3)
    .sort((a, b) => b.contrarianRate - a.contrarianRate);

  if (sorted.length === 0) {
    contrarianChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['No data'],
        datasets: [{ data: [0], backgroundColor: '#cbd5e1', borderRadius: 6 }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: { x: { grid: { display: false } }, y: { display: false } },
      },
    });
    return;
  }

  contrarianChartInstance = new Chart(ctx, {
    data: {
      labels: sorted.map(stat => stat.picker.username),
      datasets: [
        {
          type: 'bar',
          label: 'Contrarian %',
          data: sorted.map(stat => stat.contrarianRate),
          backgroundColor: sorted.map(stat => hexToRgba(stat.picker.color, 0.7)),
          borderColor: sorted.map(stat => stat.picker.color),
          borderWidth: 2,
          borderRadius: 6,
          yAxisID: 'y',
        },
        {
          type: 'line',
          label: 'Contrarian Win Rate',
          data: sorted.map(stat => stat.contrarianWinRate),
          borderColor: '#d63031',
          backgroundColor: '#d63031',
          borderWidth: 3,
          tension: 0.3,
          pointRadius: 4,
          pointHoverRadius: 6,
          yAxisID: 'y1',
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          position: 'top',
          labels: { font: { family: 'Oswald', size: 11 }, boxWidth: 10 },
        },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              if (ctx.datasetIndex === 0) {
                return ` ${ctx.dataset.label}: ${ctx.raw.toFixed(1)}%`;
              }
              return ` ${ctx.dataset.label}: ${ctx.raw.toFixed(1)}%`;
            },
          },
        },
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { family: 'Oswald', size: 10 } } },
        y: {
          beginAtZero: true,
          max: 100,
          position: 'left',
          ticks: { callback: value => `${value}%`, font: { family: 'Oswald', size: 10 } },
          grid: { color: '#e2e8f0' },
        },
        y1: {
          beginAtZero: true,
          max: 100,
          position: 'right',
          ticks: { callback: value => `${value}%`, font: { family: 'Oswald', size: 10 } },
          grid: { display: false },
        },
      },
    },
  });
}

function showConferenceMasteryChart(leagueStats) {
  const canvas = document.getElementById('conferenceMasteryChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  if (conferenceMasteryChartInstance) {
    conferenceMasteryChartInstance.destroy();
  }

  // Get all unique leagues
  const allLeagues = new Set();
  Object.values(leagueStats).forEach(pickerData => {
    Object.keys(pickerData.leagues).forEach(league => allLeagues.add(league));
  });

  const leagues = [...allLeagues].slice(0, 8); // Top 8 leagues

  if (leagues.length === 0) {
    conferenceMasteryChartInstance = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['No data'],
        datasets: [{ data: [0], backgroundColor: 'rgba(203, 213, 225, 0.2)' }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
      },
    });
    return;
  }

  // Get top 5 pickers by total picks
  const topPickers = Object.values(leagueStats)
    .map(pickerData => {
      const totalPicks = Object.values(pickerData.leagues).reduce((sum, league) => sum + league.picks, 0);
      return { ...pickerData, totalPicks };
    })
    .filter(pickerData => pickerData.totalPicks >= 5)
    .sort((a, b) => b.totalPicks - a.totalPicks)
    .slice(0, 5);

  const datasets = topPickers.map(pickerData => {
    const data = leagues.map(league => {
      const leagueData = pickerData.leagues[league];
      if (!leagueData || leagueData.picks === 0) return 0;
      return (leagueData.wins / leagueData.picks) * 100;
    });

    return {
      label: pickerData.picker.username,
      data: data,
      borderColor: pickerData.picker.color,
      backgroundColor: hexToRgba(pickerData.picker.color, 0.15),
      borderWidth: 2,
      pointRadius: 3,
      pointHoverRadius: 5,
    };
  });

  conferenceMasteryChartInstance = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: leagues,
      datasets: datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { font: { family: 'Oswald', size: 11 }, boxWidth: 10 },
        },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.dataset.label}: ${ctx.raw.toFixed(1)}%`,
          },
        },
      },
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: value => `${value}%`,
            font: { family: 'Oswald', size: 9 },
            stepSize: 25,
          },
          pointLabels: {
            font: { family: 'Oswald', size: 10 },
          },
        },
      },
    },
  });
}

function showRiskProfileChart(riskStats) {
  const canvas = document.getElementById('riskProfileChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  if (riskProfileChartInstance) {
    riskProfileChartInstance.destroy();
  }

  const plotData = riskStats.map(stat => ({
    ...stat,
    boldness: stat.totalPicks > 0 ? (stat.contrarianPicks / stat.totalPicks) * 100 : 0,
    accuracy: stat.totalPicks > 0 ? (stat.wins / stat.totalPicks) * 100 : 0,
    riskReward: stat.highRiskPicks > 0 ? (stat.highRiskWins / stat.highRiskPicks) * 100 : 0,
  }));

  if (plotData.length === 0) {
    riskProfileChartInstance = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [{ data: [], backgroundColor: '#cbd5e1' }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
      },
    });
    return;
  }

  const datasets = plotData.map(stat => ({
    label: stat.picker.username,
    data: [{ x: stat.boldness, y: stat.accuracy }],
    backgroundColor: hexToRgba(stat.picker.color, 0.7),
    borderColor: stat.picker.color,
    borderWidth: 2,
    pointRadius: stat.totalPicks / 3, // Size by volume
    pointHoverRadius: stat.totalPicks / 2.5,
  }));

  riskProfileChartInstance = new Chart(ctx, {
    type: 'scatter',
    data: { datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { font: { family: 'Oswald', size: 10 }, boxWidth: 8 },
        },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const stat = plotData[ctx.datasetIndex];
              return [
                ` ${stat.picker.username}`,
                ` Boldness: ${stat.boldness.toFixed(1)}%`,
                ` Accuracy: ${stat.accuracy.toFixed(1)}%`,
                ` Total Picks: ${stat.totalPicks}`,
              ];
            },
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Boldness (% Contrarian Picks)',
            font: { family: 'Oswald', size: 12 },
          },
          min: 0,
          max: 100,
          ticks: { callback: value => `${value}%`, font: { family: 'Oswald', size: 10 } },
          grid: { color: '#e2e8f0' },
        },
        y: {
          title: {
            display: true,
            text: 'Overall Accuracy (%)',
            font: { family: 'Oswald', size: 12 },
          },
          min: 0,
          max: 100,
          ticks: { callback: value => `${value}%`, font: { family: 'Oswald', size: 10 } },
          grid: { color: '#e2e8f0' },
        },
      },
    },
  });
}

function computeClockWatcherStats(games) {
  const pickerHourStats = {};

  PICKERS.forEach(picker => {
    if (picker.id !== 'BOOTS') {
      pickerHourStats[picker.id] = {
        picker,
        hourlyStats: {},
      };
    }
  });

  games.forEach(game => {
    if (!game.winner || !game.time) return;

    const gameDate = new Date(game.time);
    const hour = gameDate.getHours();

    const homePicks = Array.isArray(game.home_picks) ? game.home_picks : [];
    const awayPicks = Array.isArray(game.away_picks) ? game.away_picks : [];

    homePicks.forEach(pickerId => {
      if (pickerHourStats[pickerId]) {
        if (!pickerHourStats[pickerId].hourlyStats[hour]) {
          pickerHourStats[pickerId].hourlyStats[hour] = { picks: 0, wins: 0 };
        }
        pickerHourStats[pickerId].hourlyStats[hour].picks += 1;
        if (game.winner === 'home') {
          pickerHourStats[pickerId].hourlyStats[hour].wins += 1;
        }
      }
    });

    awayPicks.forEach(pickerId => {
      if (pickerHourStats[pickerId]) {
        if (!pickerHourStats[pickerId].hourlyStats[hour]) {
          pickerHourStats[pickerId].hourlyStats[hour] = { picks: 0, wins: 0 };
        }
        pickerHourStats[pickerId].hourlyStats[hour].picks += 1;
        if (game.winner === 'away') {
          pickerHourStats[pickerId].hourlyStats[hour].wins += 1;
        }
      }
    });
  });

  return pickerHourStats;
}

function computeWeekendWarriorStats(games) {
  const pickerDayStats = {};

  PICKERS.forEach(picker => {
    if (picker.id !== 'BOOTS') {
      pickerDayStats[picker.id] = {
        picker,
        weekday: { picks: 0, wins: 0 },
        weekend: { picks: 0, wins: 0 },
      };
    }
  });

  games.forEach(game => {
    if (!game.winner || !game.time) return;

    const gameDate = new Date(game.time);
    const dayOfWeek = gameDate.getDay(); // 0 = Sunday, 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    const homePicks = Array.isArray(game.home_picks) ? game.home_picks : [];
    const awayPicks = Array.isArray(game.away_picks) ? game.away_picks : [];

    const category = isWeekend ? 'weekend' : 'weekday';

    homePicks.forEach(pickerId => {
      if (pickerDayStats[pickerId]) {
        pickerDayStats[pickerId][category].picks += 1;
        if (game.winner === 'home') {
          pickerDayStats[pickerId][category].wins += 1;
        }
      }
    });

    awayPicks.forEach(pickerId => {
      if (pickerDayStats[pickerId]) {
        pickerDayStats[pickerId][category].picks += 1;
        if (game.winner === 'away') {
          pickerDayStats[pickerId][category].wins += 1;
        }
      }
    });
  });

  return Object.values(pickerDayStats).filter(stat => 
    stat.weekday.picks >= 3 && stat.weekend.picks >= 3
  );
}

function computeTorvikUnderdogTeams(games) {
  const teamStats = {};

  games.forEach(game => {
    if (!game.home_torvik || !game.away_torvik || !game.winner) return;

    const homeBetter = game.home_torvik < game.away_torvik;

    // Track home team performance when they're the underdog
    if (!homeBetter && game.winner === 'home') {
      if (!teamStats[game.home]) {
        teamStats[game.home] = {
          teamName: game.home,
          teamId: game.home_id,
          underdogWins: 0,
          underdogGames: 0,
        };
      }
      teamStats[game.home].underdogWins += 1;
      teamStats[game.home].underdogGames += 1;
    } else if (!homeBetter && game.winner === 'away') {
      if (!teamStats[game.home]) {
        teamStats[game.home] = {
          teamName: game.home,
          teamId: game.home_id,
          underdogWins: 0,
          underdogGames: 0,
        };
      }
      teamStats[game.home].underdogGames += 1;
    }

    // Track away team performance when they're the underdog
    if (homeBetter && game.winner === 'away') {
      if (!teamStats[game.away]) {
        teamStats[game.away] = {
          teamName: game.away,
          teamId: game.away_id,
          underdogWins: 0,
          underdogGames: 0,
        };
      }
      teamStats[game.away].underdogWins += 1;
      teamStats[game.away].underdogGames += 1;
    } else if (homeBetter && game.winner === 'home') {
      if (!teamStats[game.away]) {
        teamStats[game.away] = {
          teamName: game.away,
          teamId: game.away_id,
          underdogWins: 0,
          underdogGames: 0,
        };
      }
      teamStats[game.away].underdogGames += 1;
    }
  });

  return Object.values(teamStats)
    .filter(team => team.underdogGames >= 3)
    .map(team => ({
      ...team,
      winRate: (team.underdogWins / team.underdogGames) * 100,
    }))
    .sort((a, b) => b.winRate - a.winRate || b.underdogWins - a.underdogWins)
    .slice(0, 10);
}

let clockWatcherChartInstance = null;
let weekendWarriorChartInstance = null;
let torvikUnderdogChartInstance = null;

function showClockWatcherChart(hourStats) {
  const canvas = document.getElementById('clockWatcherChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  if (clockWatcherChartInstance) {
    clockWatcherChartInstance.destroy();
  }

  // Get top 5 pickers by total picks
  const topPickers = Object.values(hourStats)
    .map(pickerData => {
      const totalPicks = Object.values(pickerData.hourlyStats).reduce((sum, h) => sum + h.picks, 0);
      return { ...pickerData, totalPicks };
    })
    .filter(p => p.totalPicks >= 10)
    .sort((a, b) => b.totalPicks - a.totalPicks)
    .slice(0, 5);

  if (topPickers.length === 0) {
    clockWatcherChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['No data'],
        datasets: [{ data: [0], backgroundColor: '#cbd5e1' }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
      },
    });
    return;
  }

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const hourLabels = hours.map(h => {
    const period = h >= 12 ? 'PM' : 'AM';
    const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${displayHour}${period}`;
  });

  const datasets = topPickers.map(pickerData => {
    const data = hours.map(hour => {
      const hourData = pickerData.hourlyStats[hour];
      if (!hourData || hourData.picks === 0) return null;
      return (hourData.wins / hourData.picks) * 100;
    });

    return {
      label: pickerData.picker.username,
      data: data,
      borderColor: pickerData.picker.color,
      backgroundColor: hexToRgba(pickerData.picker.color, 0.1),
      borderWidth: 2,
      tension: 0.4,
      pointRadius: 3,
      pointHoverRadius: 5,
      spanGaps: true,
    };
  });

  clockWatcherChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: hourLabels,
      datasets: datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          position: 'bottom',
          labels: { font: { family: 'Oswald', size: 11 }, boxWidth: 10 },
        },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              if (ctx.raw === null) return null;
              return ` ${ctx.dataset.label}: ${ctx.raw.toFixed(1)}%`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { family: 'Oswald', size: 9 }, maxRotation: 45, minRotation: 45 },
        },
        y: {
          beginAtZero: true,
          max: 100,
          ticks: { callback: value => `${value}%`, font: { family: 'Oswald', size: 10 } },
          grid: { color: '#e2e8f0' },
        },
      },
    },
  });
}

function showWeekendWarriorChart(dayStats) {
  const canvas = document.getElementById('weekendWarriorChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  if (weekendWarriorChartInstance) {
    weekendWarriorChartInstance.destroy();
  }

  if (dayStats.length === 0) {
    weekendWarriorChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['No data'],
        datasets: [{ data: [0], backgroundColor: '#cbd5e1', borderRadius: 6 }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: { x: { grid: { display: false } }, y: { display: false } },
      },
    });
    return;
  }

  const labels = dayStats.map(stat => stat.picker.username);
  const weekdayData = dayStats.map(stat => 
    stat.weekday.picks > 0 ? (stat.weekday.wins / stat.weekday.picks) * 100 : 0
  );
  const weekendData = dayStats.map(stat => 
    stat.weekend.picks > 0 ? (stat.weekend.wins / stat.weekend.picks) * 100 : 0
  );

  weekendWarriorChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Weekday Win %',
          data: weekdayData,
          backgroundColor: '#3498db',
          borderColor: '#2980b9',
          borderWidth: 2,
          borderRadius: 6,
        },
        {
          label: 'Weekend Win %',
          data: weekendData,
          backgroundColor: '#e74c3c',
          borderColor: '#c0392b',
          borderWidth: 2,
          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          position: 'top',
          labels: { font: { family: 'Oswald', size: 11 }, boxWidth: 10 },
        },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const stat = dayStats[ctx.dataIndex];
              const isWeekday = ctx.datasetIndex === 0;
              const category = isWeekday ? stat.weekday : stat.weekend;
              return ` ${ctx.dataset.label}: ${ctx.raw.toFixed(1)}% (${category.wins}/${category.picks})`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { family: 'Oswald', size: 10 } },
        },
        y: {
          beginAtZero: true,
          max: 100,
          ticks: { callback: value => `${value}%`, font: { family: 'Oswald', size: 10 } },
          grid: { color: '#e2e8f0' },
        },
      },
    },
  });
}

function showTorvikUnderdogChart(underdogTeams) {
  const canvas = document.getElementById('torvikUnderdogChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  if (torvikUnderdogChartInstance) {
    torvikUnderdogChartInstance.destroy();
  }

  if (underdogTeams.length === 0) {
    torvikUnderdogChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['No data'],
        datasets: [{ data: [0], backgroundColor: '#cbd5e1', borderRadius: 6 }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: { x: { grid: { display: false } }, y: { display: false } },
      },
    });
    return;
  }

  torvikUnderdogChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: underdogTeams.map(team => team.teamName),
      datasets: [
        {
          label: 'Upset Win %',
          data: underdogTeams.map(team => team.winRate),
          backgroundColor: underdogTeams.map((_, i) => {
            const colors = ['#e74c3c', '#e67e22', '#f39c12', '#f1c40f', '#2ecc71', '#1abc9c', '#3498db', '#9b59b6', '#34495e', '#95a5a6'];
            return colors[i % colors.length];
          }),
          borderRadius: 8,
        },
      ],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const team = underdogTeams[ctx.dataIndex];
              return [
                ` Win Rate: ${team.winRate.toFixed(1)}%`,
                ` Record: ${team.underdogWins}-${team.underdogGames - team.underdogWins}`,
                ` Games as underdog: ${team.underdogGames}`,
              ];
            },
          },
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          max: 100,
          ticks: { callback: value => `${value}%`, font: { family: 'Oswald', size: 10 } },
          grid: { color: '#e2e8f0' },
        },
        y: {
          grid: { display: false },
          ticks: { font: { family: 'Oswald', size: 10 } },
        },
      },
    },
  });
}

function renderStatsDashboard(games) {
  const analytics = computeGameAnalytics(games);
  renderStatsKpis(analytics);
  renderPickerPulse(games);
  renderDailyPulse(analytics);
  showRaceChart(games);
  showLeagueMixChart(analytics);
  showConsensusStrengthChart(analytics);
  
  // Advanced stats
  const homeAwayStats = computeHomeAwayStats(games);
  renderHomeAwayStats(homeAwayStats);
  
  const torvikStats = computeTorvikStats(games);
  renderTorvikStats(torvikStats);
  
  const pickerTorvikStats = computePickerTorvikStats(games);
  renderPickerTorvikStats(pickerTorvikStats);
  
  const favoriteTeams = computeFavoriteTeams(games);
  renderFavoriteTeams(favoriteTeams);

  // Very advanced picker-focused charts
  const contrarianStats = computeContrarianStats(games);
  showContrarianChart(contrarianStats);

  const conferenceMastery = computeConferenceMastery(games);
  showConferenceMasteryChart(conferenceMastery);

  const riskProfile = computeRiskProfile(games);
  showRiskProfileChart(riskProfile);

  // Time-based and underdog charts
  const clockWatcherStats = computeClockWatcherStats(games);
  showClockWatcherChart(clockWatcherStats);

  const weekendWarriorStats = computeWeekendWarriorStats(games);
  showWeekendWarriorChart(weekendWarriorStats);

  const torvikUnderdogs = computeTorvikUnderdogTeams(games);
  showTorvikUnderdogChart(torvikUnderdogs);
}

function calculateWinPercentage() {
  const us = {};
  PICKERS.forEach(picker => {us[picker.id] = [0,0];});
  GAMES.forEach(game => {
    if (!game) return;
    if (game.winner === 'away') {
        game.away_picks?.forEach(pick => { if(pick in us) {us[pick][0] += 1;} });
        game.home_picks?.forEach(pick => { if(pick in us) {us[pick][1] += 1;} });
    } else if (game.winner === 'home') {
        game.away_picks?.forEach(pick => { if(pick in us) {us[pick][1] += 1;} });
        game.home_picks?.forEach(pick => { if(pick in us) {us[pick][0] += 1;} });
    }
  });
    const results = {};

    for (const team in us) {
        if (us.hasOwnProperty(team)) {
            const wins = us[team][0];
            const losses = us[team][1];
            const totalGames = wins + losses;

            if (totalGames > 0) {
                // Calculate percentage and round to two decimal places
                const winPercentage = ((wins / totalGames) * 100).toFixed(2);
                results[team] = `${winPercentage}%`;
            } else {
                results[team] = "0.00%"; // Handle cases with zero total games
            }
        }
    }

    return results;
}
//const winPercentages = calculateWinPercentage();

function getHotColdReport(games) {
  const records = {};

  // 1. Tally Wins and Losses
  games.forEach(game => {
    const homePicks = game.home_picks || [];
    const awayPicks = game.away_picks || [];
            
    const isAwayConsensus = game.away_picks?.length >= 4 && (!game.home_picks || game.home_picks.length == 0);
    const isHomeConsensus = game.home_picks?.length >= 4 && (!game.away_picks || game.away_picks.length == 0);

    if (isAwayConsensus || isHomeConsensus) {
      const pick = isHomeConsensus ? 'home' : 'away';
      let corr = pick === game.winner;
      let winnerId, loserId, winnerName, loserName;

      if (game.winner === 'home') {
        winnerId = game.home_id;
        winnerName = game.home;
        loserId = game.away_id;
        loserName = game.away;
      } else if (game.winner === 'away') {
        winnerId = game.away_id;
        winnerName = game.away;
        loserId = game.home_id;
        loserName = game.home;
      }

      if (winnerId && loserId) {

        if (corr) {
          if (!records[winnerId]) records[winnerId] = { name: winnerName, wins: 0, losses: 0, id: winnerId, victory: [], defeat: []};
          records[winnerId].wins++;
          records[winnerId].victory.push({'id': loserId, 'venue': game.winner});
        } else {
          if (!records[loserId]) records[loserId] = { name: loserName, wins: 0, losses: 0, id: loserId, victory: [], defeat: []};
          records[loserId].losses++;
          records[loserId].defeat.push({'id': winnerId, 'venue': game.winner});
        }
      }
    }
  });

  // 2. Format Data
  const teamArray = Object.values(records).map(team => {
    const total = team.wins + team.losses;
    const rawPct = total === 0 ? 0 : (team.wins / total);
    
    return {
      name: team.name,
      id: String(team.id),
      record: `${team.wins}-${team.losses}`,
      pct: `${Math.round(rawPct * 100)}%`,
      rawPct: rawPct,
      wins: team.wins, losses: team.losses, victory: team.victory, defeat: team.defeat,
    };
  });

  // 3. Split by 60% Threshold
  // Hot: >= 0.6 | Cold: < 0.6
  const hotList = teamArray.filter(t => t.rawPct >= 0.60);
  const coldList = teamArray.filter(t => t.rawPct < 0.60);

  // 4. Sort Hot List
  // Primary: Pct Descending | Secondary: Wins Descending
  hotList.sort((a, b) => {
    if (b.rawPct !== a.rawPct) {
      return b.rawPct - a.rawPct;
    }
    return b.wins - a.wins; 
  });

  // 5. Sort Cold List
  // Primary: Pct Ascending | Secondary: Wins Ascending (Fewer wins = "colder")
  coldList.sort((a, b) => {
    if (a.rawPct !== b.rawPct) {
      return a.rawPct - b.rawPct;
    }
    return b.losses - a.losses;
  });

  // 6. Cleanup helper properties
  const clean = (list) => list.map(({ rawPct, wins, ...item }) => item);

  const result = {
    hot: clean(hotList),
    cold: clean(coldList)
  };
  return result;
} 

//initCharts();

let TOP_TEAMS1 = [];

function getPopularPicks(games) {
  let records = {};
  games.forEach(game => {
    const homePicks = game.home_picks || [];
    const awayPicks = game.away_picks || [];

      let winnerId, loserId, winnerName, loserName, loser;

      if (game.winner === 'home') {
        loser = 'away';
        winnerId = game.home_id;
        winnerName = game.home;
        loserId = game.away_id;
        loserName = game.away;
      } else if (game.winner === 'away') {
        loser = 'home';
        winnerId = game.away_id;
        winnerName = game.away;
        loserId = game.home_id;
        loserName = game.home;
      }

      if (winnerId && loserId) {
          if (!records[winnerName]) records[winnerName] = { name: winnerName, wins: 0, losses: 0, id: winnerId, total: 0};
          if (!records[loserName]) records[loserName] = { name: loserName, wins: 0, losses: 0, id: loserId, total: 0};


          records[winnerName].wins += game[`${game.winner}_picks`]?.length ?? 0;
          records[winnerName].total += game[`${game.winner}_picks`]?.length ?? 0;
          records[loserName].losses += game[`${loser}_picks`]?.length ?? 0;
          records[loserName].total += game[`${loser}_picks`]?.length ?? 0;
      }
  });
  TOP_TEAMS1 = Object.entries(records);
  showPopularChart();
}

function getTeamLogo(name) {
  return `https://a.espncdn.com/i/teamlogos/ncaa/500/${name}.png`;
}

const TEAMS1 = [];

Chart.defaults.font.family = "'Oswald', sans-serif";
let currentPage = 0;
const itemsPerPage = 10;
let totalPages = 1;
let popularityChartInstance = null; // Stores the active chart object

// 2. Stacked Bar with Logo Axis
function showPopularChart() {
  const chartCanvas = document.getElementById('popularityChart');
  if (!chartCanvas) return;

  totalPages = Math.max(1, Math.ceil(TOP_TEAMS1.length / itemsPerPage));
  if (currentPage >= totalPages) {
    currentPage = totalPages - 1;
  }

  const start = currentPage * itemsPerPage;
  const end = start + itemsPerPage;
  const globalMax = TOP_TEAMS1.length ? Math.max(...TOP_TEAMS1.map(team => team[1].total)) : 1;

  const topTeams = [...TOP_TEAMS1].sort((a,b)=>b[1].total - a[1].total).slice(start,end);
  const labels = topTeams.map(d=>d[0]);
  const ids = topTeams.map(d=>d[1].id);
  const dataWins = topTeams.map(d=>d[1].wins);
  const dataLosses = topTeams.map(d=>d[1].losses);
  const images = ids.map(l => {
    const img = new Image();
    img.src = getTeamLogo(l);
    return img;
  });

  if (popularityChartInstance) {
    popularityChartInstance.destroy();
  }

  if (topTeams.length === 0) {
    popularityChartInstance = new Chart(chartCanvas, {
      type: 'bar',
      data: {
        labels: ['No data'],
        datasets: [{ data: [0], backgroundColor: '#cbd5e1', borderRadius: 6 }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: { x: { grid: { display: false } }, y: { display: false } },
      },
    });
    document.getElementById('pageIndicator').innerText = 'No resolved picks';
    document.getElementById('prevBtn').disabled = true;
    document.getElementById('nextBtn').disabled = true;
    return;
  }

  // Custom Plugin for Logos
  const logoAxis = {
    id: 'logoAxis',
    afterDraw(chart) {
        const { ctx, scales: { x, y } } = chart;
        const xAxis = chart.scales['x'];
        const yAxis = chart.scales['y'];
        
        xAxis.ticks.forEach((value, index) => {
            const x = xAxis.getPixelForTick(index);
            const img = images[index];
            // Draw image centered on tick
            if (img.complete) {
                ctx.drawImage(img, x - 15, yAxis.bottom + 10, 30, 30);
            } else {
                img.onload = () => chart.draw();
            }
        });
    }
  };

  popularityChartInstance = new Chart(chartCanvas, {
    type: 'bar',
    data: {
        labels: labels,
        datasets: [
            { label: 'Picks Won', data: dataWins, backgroundColor: '#00b894', stack: 'Stack 0', borderRadius: 4 },
            { label: 'Picks Lost', data: dataLosses, backgroundColor: '#d63031', stack: 'Stack 0', borderRadius: 4 }
        ]
    },
    plugins: [logoAxis],
    options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { bottom: 30 } }, // Make room for logos
        scales: {
            x: { 
                stacked: true, 
                grid: { display: false },
                ticks: { display: false } // Hide text labels
            },
            y: { 
                stacked: true, 
                beginAtZero: true,
                grid: { color: '#e2e8f0' },
                max: globalMax + 1
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    title: (ctx) => labels[ctx[0].dataIndex] // Show name in tooltip
                }
            }
        }
    }
  });

  document.getElementById('pageIndicator').innerText = `Page ${currentPage + 1} of ${totalPages}`;
  document.getElementById('prevBtn').disabled = currentPage === 0;
  document.getElementById('nextBtn').disabled = currentPage === totalPages - 1;
}

function changePage(direction) {
    currentPage += direction;
    // Clamp values
    if(currentPage < 0) currentPage = 0;
    if(currentPage >= totalPages) currentPage = totalPages - 1;
    
    showPopularChart();
}
window.changePage = changePage;

function getLoneWolfStats(games) {
  // Key: "User_TeamID" -> Value: { user, teamName, wins, losses }
  const tracker = {};

  games.forEach(game => {
    const homePicks = game.home_picks || [];
    const awayPicks = game.away_picks || [];

    let loneWolfUser = null;
    let pickedSide = null; // 'home' or 'away'
    
    // 1. Identify Lone Wolf Scenarios
    // Condition: One side has exactly 1 pick, the other has >= 3
    if (homePicks.length === 1 && awayPicks.length >= 3) {
      loneWolfUser = homePicks[0];
      pickedSide = 'home';
    } else if (awayPicks.length === 1 && homePicks.length >= 3) {
      loneWolfUser = awayPicks[0];
      pickedSide = 'away';
    }

    // 2. Process Result if Lone Wolf exists and Game is finished
    if (loneWolfUser && game.winner) {
      const pickedTeamId = pickedSide === 'home' ? game.home_id : game.away_id;
      const pickedTeamName = pickedSide === 'home' ? game.home : game.away;
      const pickedTeamScore = pickedSide === 'home' ? game.home_score : game.away_score;
      const oppTeamId = pickedSide === 'away' ? game.home_id : game.away_id  
      const oppTeamName = pickedSide === 'away' ? game.home : game.away;
      const oppTeamScore = pickedSide === 'away' ? game.home_score : game.away_score;
      let pickedWinner = false;
      
      // Create a unique key for this User + Team combo
      const recordKey = `${loneWolfUser}`;

      // Initialize if not exists
      if (!tracker[recordKey]) {
        tracker[recordKey] = {
          user: loneWolfUser,
          teams: [],
          wins: 0,
          losses: 0,
          winsBarHTML: '',
        };
      }

      // 3. Tally Win or Loss
      // If the game winner matches the side the Lone Wolf picked
      if (game.winner === pickedSide) {
        tracker[recordKey].wins++;
        tracker[recordKey].winsBarHTML += '<div class="Bar b-win"></div>';
          
        pickedWinner = true;
      } else {
        tracker[recordKey].losses++;
        tracker[recordKey].winsBarHTML += '<div class="Bar b-loss"></div>'; 
      }

      tracker[recordKey].teams.push({ name: pickedTeamName, id: pickedTeamId, score: pickedTeamScore, oppName: oppTeamName, oppId: oppTeamId, oppScore: oppTeamScore, winner: pickedWinner });
    }
  });

  // 4. Convert to Array and Sort
  const results = Object.values(tracker).map(entry => ({
    user: entry.user,
    teams: entry.teams,
    record: `${entry.wins}-${entry.losses}`,
    wins: entry.wins,
    winsBarHTML: entry.winsBarHTML,
  }));

  // Sort: Most Wins -> Fewest Wins
  results.sort((a, b) => b.wins - a.wins);

  // Remove the raw 'wins' property for cleaner final output
  return results.map(({ wins, ...rest }) => rest);
}
window.getLoneWolfStats = getLoneWolfStats;

function showLoneWolfDisplay(wolfStats) {
    const wolfBox = document.getElementById('wolfBox');
    if (!wolfBox) return;
    wolfBox.innerHTML = '';
    if (!wolfStats || wolfStats.length === 0) {
      wolfBox.innerHTML = `<div class="Pulse-Empty">No lone wolf outcomes yet in this view.</div>`;
      return;
    }
    for (const userStat of wolfStats) {
        let wolfPicksHTML = '';
        for (const team of userStat.teams) {
          wolfPicksHTML += `
            <div class="Pick-Row ${team.winner ? 'is-win' : 'is-loss'}">
                <div class="Status-Border"></div>
                <div class="Team-Col User-Col"><img src="https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/${team.id}.png&h=50&w=50">
                <span>${team.name}</span>
                </div>
                <div class="Score-Wrapper"><div class="Score-Pill">${team.score}-${team.oppScore}</div></div>
                <div class="Team-Col Opponent-Col"><img src="https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/${team.oppId}.png&h=50&w=50">
                <span>${team.oppName}</span>
                </div>
            </div>
          `;
        }
        const newCard = document.createElement('div');
        newCard.classList.add('Wolf-Card');

        const picker = PICKERS.find(p => p.id === userStat.user);
        newCard.innerHTML = `
        <div class="Card-Header">
            <div class="User-Group">
                <div class="Avatar-Wolf" style="background-color: ${picker?.color};">${picker?.id}</div>
                <div class="User-Meta">
                    <span class="User-Name">${picker?.username}</span>
                </div>
            </div>
            <div class="Record-Box">
                <div class="Record-Text">${userStat.record}</div>
                <div class="Micro-Graph">${userStat.winsBarHTML}
                </div>
            </div>
        </div>
        <div class="Picks-Container">
          ${wolfPicksHTML}
        </div>
        `;
        wolfBox.append(newCard);

    }
}
window.showLoneWolfDisplay = showLoneWolfDisplay;

function getPlayerStats(games) {
  const stats = {};

  // Helper to ensure a player object exists in our tracker
  const initPlayer = (id) => {
    if (!stats[id]) {
      stats[id] = { wins: 0, attempts: 0 };
    }
  };

  games.forEach(game => {
    // 1. Skip games that haven't finished (no winner)
    if (!game.winner) return;

    const homePicks = game.home_picks || [];
    const awayPicks = game.away_picks || [];

    // 2. Process Home Picks
    homePicks.forEach(playerId => {
      initPlayer(playerId);
      stats[playerId].attempts++;
      
      // If winner is 'home', these players win
      if (game.winner === 'home') {
        stats[playerId].wins++;
      }
    });

    // 3. Process Away Picks
    awayPicks.forEach(playerId => {
      initPlayer(playerId);
      stats[playerId].attempts++;
      
      // If winner is 'away', these players win
      if (game.winner === 'away') {
        stats[playerId].wins++;
      }
    });
  });

  // 4. Convert to the requested Array format
  const players = Object.keys(stats).map(playerId => {
    return {
      id: playerId,
      wins: stats[playerId].wins,
      attempts: stats[playerId].attempts
    };
  });

  // Optional: Sort by most wins descending
  players.sort((a, b) => b.wins - a.wins);

  return players;
}

let leaderboardChartInstance = null;
function showLeaderboardBar(games) {
    const chartCanvas = document.getElementById('leaderboardChart');
    if (!chartCanvas) return;

    let players = getPlayerStats(games)
      .map(player => {
        const picker = PICKERS.find(candidate => candidate.id === player.id);
        if (!picker || !picker.username || picker.id === 'BOOTS') return null;
        return {
          ...player,
          name: picker.username,
          initials: picker.id,
          color: picker.color,
          winPct: (player.wins / player.attempts) * 100,
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.winPct - a.winPct || b.attempts - a.attempts)
      .slice(0, 10);

    if (leaderboardChartInstance) {
      leaderboardChartInstance.destroy();
    }

    if (players.length === 0) {
      leaderboardChartInstance = new Chart(chartCanvas.getContext('2d'), {
        type: 'bar',
        data: {
          labels: ['No data'],
          datasets: [{ data: [0], backgroundColor: '#cbd5e1', borderRadius: 6 }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { enabled: false } },
          scales: { x: { grid: { display: false } }, y: { display: false } },
        },
      });
      return;
    }

    // --- 2. Chart.js Custom Plugin for Avatars ---

    const avatarYAxis = {
        id: 'avatarYAxis',
        afterDraw(chart, args, options) {
            const { ctx } = chart;
            const yAxis = chart.scales.y;
            const xAxis = chart.scales.x;
            
            // Avatar styling properties
            const avatarRadius = 18;
            const paddingRight = 10; // Space between avatar and bar start
            const fontSize = 14;
            
            chart.getDatasetMeta(0).data.forEach((bar, index) => {
                const playerData = players[index];
                const centerY = bar.y;
                // Position x coordinate just to the left of the chart area
                const centerX = xAxis.left - avatarRadius - paddingRight;

                // 1. Draw Circle Background
                ctx.save();
                ctx.beginPath();
                ctx.arc(centerX, centerY, avatarRadius, 0, 2 * Math.PI);
                ctx.fillStyle = playerData.color;
                ctx.fill();
                ctx.restore();

                // 2. Draw Initials
                ctx.save();
                ctx.font = `bold ${fontSize}px sans-serif`;
                ctx.fillStyle = '#fff'; // Dark gray text for contrast on pastels
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                // Offset y slightly for visual centering depending on font
                ctx.fillText(playerData.initials, centerX, centerY + 1); 
                ctx.restore();
            });
        }
    };


    // --- 3. Chart Configuration ---
    const ctx = chartCanvas.getContext('2d');

    leaderboardChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            // Using names as labels for accessibility, though they are hidden visually on axis
            labels: players.map(p => p.name), 
            datasets: [{
                data: players.map(p => p.winPct),
                backgroundColor: players.map(p => p.color),
                // Darker borders for clearer definition
                //borderColor: players.map(p => p.color.replace(')', ', 0.8)').replace('rgb', 'rgba')), 
                borderWidth: 1,
                borderRadius: 6, // Rounded bar ends
                barPercentage: 0.7, // Makes bars slightly thinner
            }]
        },
        options: {
            indexAxis: 'y', // Makes it a horizontal bar chart
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    // Add left padding to make room for our custom drawn avatars
                    left: 50 
                }
            },
            plugins: {
                legend: { display: false }, // Hide legend as colors are distinct per player
                tooltip: {
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    titleFont: { size: 14 },
                    bodyFont: { size: 14 },
                    padding: 12,
                    displayColors: false, // Don't show the color box in tooltip
                    callbacks: {
                        title: (tooltipItems) => {
                             return players[tooltipItems[0].dataIndex].name;
                        },
                        label: (context) => {
                            const player = players[context.dataIndex];
                            // Custom tooltip text showing percentage AND wins/attempts count
                            return [
                                `Win Rate: ${player.winPct.toFixed(1)}%`,
                                `Record: ${player.wins} Wins / ${player.attempts} Attempts`
                            ];
                        }
                    }
                },
                // Register our custom avatar plugin here
                avatarYAxis: true 
            },
            scales: {
                x: {
                    // Optimization: Zoom in the X-axis. 
                    // Since data is 40%-70%, setting min to 35 and max to 75 highlights differences better.
                    min: 40, 
                    max: 100,
                    grid: {
                        color: '#e0e0e0'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '%'; // Add % sign to x-axis ticks
                        },
                        font: { size: 12 }
                    },
                    title: {
                        display: true,
                        text: 'Winning Percentage',
                        font: { weight: 'bold' }
                    }
                },
                y: {
                    // Hide default labels and grids because we are drawing our own avatars
                    ticks: { display: false },
                    grid: { display: false }
                }
            }
        },
        // Register plugin globally for this chart instance
        plugins: [avatarYAxis] 
    });
}
