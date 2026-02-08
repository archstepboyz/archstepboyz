import { idCompareSort, getCityFromIP } from './utils.js';
import { calculateIdIndexSums } from './ballot.js';

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























/* GLOBAL VARS */

const currentDate = new Date();
// should make this const and introduce SELECTED_WEEK
let CURRENT_WEEK = 14;

const TEAMS_ENDPOINT =
  "https://qeuvposbesblckyuflbd.supabase.co/rest/v1/Teams?order=conf.asc,conf_pos.asc";
const D1_ENDPOINT =
  "https://qeuvposbesblckyuflbd.supabase.co/rest/v1/D1?order=name.asc";
const COMMENTS_ENDPOINT =
  "https://qeuvposbesblckyuflbd.supabase.co/rest/v1/Comments";
const USERS_ENDPOINT = "https://qeuvposbesblckyuflbd.supabase.co/rest/v1/Users";

const ANON_API_KEY = "sb_publishable_mZVo1bfw-ChB9iCx1V5QwA_UUKrCx8o";

let CACHED_COMMENTS_DB = [];

let currentCellId = null;
let queryString;

var scrollPosition;

var ALL_GAMES = [];
var GAMES = [];
var TEAMS;
var FILTER = null;

let showingAllPicks = false;

function changeWeekView(week) {
  CURRENT_WEEK = week;
  renderAll(true);
  const ballot = document.getElementById("top25Rankings");
  ballot.style.display = "none";
  if (CURRENT_WEEK >= 11) {
    showTop25Rankings();
  }
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
    const picksToggle = document.getElementById("picksMenu");
    picksToggle.style.display = "none";
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
    const picksToggle = document.getElementById("picksMenu");
    picksToggle.style.display = "none";
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
    const picks = document.querySelector(".Picks-Container");
    picks.style.display = "flex";
    const picksToggle = document.getElementById("picksMenu");
    picksToggle.style.display = "flex";
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
    const picksToggle = document.getElementById("picksMenu");
    picksToggle.style.display = "none";
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
    const picksToggle = document.getElementById("picksMenu");
    picksToggle.style.display = "none";
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
    const picksToggle = document.getElementById("picksMenu");
    picksToggle.style.display = "none";
    const ballot = document.querySelector(".Top25-Container");
    ballot.style.display = "none";
    const dash = document.getElementById("statsDash");
    dash.style.display = "none";
    const bracket = document.querySelector(".Bracket-Container");
    bracket.style.display = "flex";
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
            const isAwayConsensus = game.away_picks?.length >= 4;
            const isHomeConsensus = game.home_picks?.length >= 4;

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
              USER_STATS['all'] = getHotColdReport(GAMES);
              updateUserStats('all');
              getPopularPicks(GAMES);
              showLoneWolfDisplay(getLoneWolfStats(GAMES));
              showLeaderboardBar(GAMES);
            }

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
              if (date !== lastDate) {
                days += 1;
                separatorHTML = `
                <div class="Date-Separator" id="${days}-date-sep">
                    <div class="Date-Separator__Text">
                        <i class="fa-regular fa-calendar"></i> ${date}
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
                    const tempList = document.getElementById(`${days}-date-sep`);
                    tempList.insertAdjacentHTML('afterend', `<div class="Matchup-Column matchupsB" id="${days}-${sojrLast}-col-2"></div>`);
                    tempList.insertAdjacentHTML('afterend', `<div class="Matchup-Column matchupsA" id="${days}-${sojrLast}-col-1"></div>`);
                    tempList.insertAdjacentHTML('afterend', filterHTML);
                  }
                }
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
    activeRowIndex = index;
    document.getElementById('teamSearch').value = ''; // Reset Search
    renderTeamGrid();
    modal1.classList.add('active');
    setTimeout(() => document.getElementById('teamSearch').focus(), 100);
}
window.openSelector = openSelector;

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

function renderTeamGrid() {
    const grid = document.getElementById('teamGrid');
    grid.innerHTML = '';

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
    const data = USER_STATS[userId];
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

function createGradient(ctx, color) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, color.replace(')', ', 0.2)').replace('rgb', 'rgba'));
    gradient.addColorStop(1, color.replace(')', ', 0.0)').replace('rgb', 'rgba'));
    return gradient;
}

const ctxRace = document.getElementById('raceChart').getContext('2d');

const c_fear = 'rgb(108, 92, 231)'; // #6c5ce7
const c_notf = 'rgb(250, 177, 160)'; // #fab1a0
const c_gays = 'rgb(0, 206, 201)';   // #00cec9
const c_cook = 'rgb(214, 48, 49)';   // #d63031

new Chart(ctxRace, {
    type: 'line',
    data: {
        // SCALABLE: Add more weeks here in the future
        labels: ['Wk 9', 'Wk 10', 'Wk 11'], 
        datasets: [
            {
                label: ' fearthebeak',
                data: [62.07, 64.17, 65.66],
                borderColor: c_fear,
                backgroundColor: createGradient(ctxRace, c_fear),
                borderWidth: 3,
                tension: 0,
                pointRadius: 4,
                pointHoverRadius: 8, 
                fill: true
            },
            {
                label: ' notflorida',
                data: [66.34, 68.13, 65.87],
                borderColor: c_notf,
                backgroundColor: createGradient(ctxRace, c_notf),
                borderWidth: 3,
                tension: 0,
                pointRadius: 4,
                pointHoverRadius: 8,
                fill: true
            },
            {
                label: ' Gayson Tatum',
                data: [64.36, 69.38, 68.27],
                borderColor: c_gays,
                backgroundColor: createGradient(ctxRace, c_gays),
                borderWidth: 3,
                tension: 0,
                pointRadius: 4,
                pointHoverRadius: 8,
                fill: true
            },
            {
                label: ' cookedbycapjack',
                data: [68.32, 69.38, 67.31],
                borderColor: c_cook,
                backgroundColor: createGradient(ctxRace, c_cook),
                borderWidth: 3,
                tension: 0,
                pointRadius: 4,
                pointHoverRadius: 8,
                fill: true
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false, // CRITICAL for mobile responsiveness
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: { 
                position: 'top', 
                align: 'end', 
                labels: { 
                    usePointStyle: true,
                    boxWidth: 8,
                    font: { family: 'Oswald', size: 12 }
                } 
            },
            tooltip: { 
                backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                titleFont: { family: 'Oswald', size: 14 },
                bodyFont: { family: 'Segoe UI', size: 13 },
                padding: 10,
                cornerRadius: 8,
                callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ${ctx.raw}%` }
            }
        },
        scales: {
            y: { 
                beginAtZero: false, 
                min: 55, 
                max: 75, 
                grid: { color: '#f1f5f9', borderDash: [5, 5] },
                ticks: { font: { family: 'Oswald' }, color: '#94a3b8' }
            },
            x: { 
                grid: { display: false },
                ticks: { 
                    font: { family: 'Oswald' }, 
                    color: '#94a3b8',
                    maxTicksLimit: 6 // Prevents overcrowding if you add 20 weeks
                } 
            }
        }
    }
});

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

    if (homePicks.length > 3 || awayPicks.length > 3) {
      const pick = homePicks.length > 3 ? 'home' : 'away';
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
const totalPages = 100;
let popularityChartInstance = null; // Stores the active chart object

// 2. Stacked Bar with Logo Axis
function showPopularChart() {
  const start = currentPage * itemsPerPage;
  const end = start + itemsPerPage;
  const globalMax = Math.max(...TOP_TEAMS1.map(team => team[1].total)); 
  const totalPages = Math.ceil(TOP_TEAMS1.length / itemsPerPage);

  const topTeams = TOP_TEAMS1.sort((a,b)=>b[1].total - a[1].total).slice(start,end);
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

  popularityChartInstance = new Chart(document.getElementById('popularityChart'), {
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
    wolfBox.innerHTML = '';
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
    const names = PICKERS.map(picker => picker.username);
    const userids = PICKERS.map(picker => picker.id);
    const pastelColors = PICKERS.map(picker => picker.color);
    /* MORE COLORS
        '#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF',
        '#E0BBE4', '#957DAD', '#D291BC', '#FEC8D8', '#FFDFD3'
    */

    // Helper to get random integer between min and max (inclusive)
    const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    let players = [];

    for (let i = 0; i < 10; i++) {
        const fullName = names[i];
        const initials = userids[i];
        if (!fullName || fullName.startsWith('Boots')) continue;

        // Constraints: Attempts between 50 and 1000
        const attempts = getRandomInt(50, 1000);
        
        // Constraints: Win % roughly between 40% and 70%. 
        // We generate a random factor between 0.40 and 0.70.
        const targetWinFactor = (Math.random() * 0.30) + 0.40;
        
        // Calculate wins based on the factor, rounded to nearest whole number
        const wins = Math.round(attempts * targetWinFactor);

        // Recalculate precise win percentage based on actual whole numbers
        const winPct = (wins / attempts * 100);

        players.push({
            id: i,
            name: fullName,
            initials: initials,
            color: pastelColors[i],
            wins: wins,
            attempts: attempts,
            winPct: winPct
        });
    }

    // SORTING: Crucial step for a leaderboard. Sort by Win % descending.
    players.sort((a, b) => b.winPct - a.winPct);

    players = getPlayerStats(games);

    for (const id in players) {
        const play = PICKERS.find((picker) => picker.id === players[id].id);
        players[id]['name'] = play.username;
        players[id]['initials'] = play.id;
        players[id]['color'] = play.color;
        players[id]['winPct'] = players[id].wins / players[id].attempts * 100;
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
  if (leaderboardChartInstance) {
    leaderboardChartInstance.destroy();
  }

    const ctx = document.getElementById('leaderboardChart').getContext('2d');

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
