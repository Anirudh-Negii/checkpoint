// document.addEventListener("DOMContentLoaded", init);

// ===========================
// SELECTORS
// ===========================

const app = document.querySelector("#app");
const allViews = Array.from(document.querySelectorAll(".view"));
const featureCards = Array.from(document.querySelectorAll("[data-feature]"));
const backButtons = Array.from(document.querySelectorAll("[data-back]"));

const clockEl = document.querySelector("#clock");
const dateEl = document.querySelector("#date-display");
const greetingEl = document.querySelector("#greeting");

const themeToggle = document.querySelector("#theme-toggle");
const themeToggleLabel = document.querySelector("#theme-toggle-label");

const todoPreview = document.querySelector("#todo-preview");
const plannerPreview = document.querySelector("#planner-preview");
const goalsPreviewBar = document.querySelector("#goals-preview-bar");
const goalsPreviewLabel = document.querySelector("#goals-preview-label");
const pomodoroPreviewTime = document.querySelector("#pomodoro-preview-time");
const pomodoroPreviewState = document.querySelector("#pomodoro-preview-state");
const quotePreview = document.querySelector("#quote-preview");
const weatherPreview = document.querySelector("#weather-preview");

const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const todoEmpty = document.querySelector("#todo-empty-state");
const todoFilters = document.querySelector("#todo-filters");

const plannerList = document.querySelector("#planner-list");

const goalForm = document.querySelector("#goal-form");
const goalInput = document.querySelector("#goal-input");
const goalList = document.querySelector("#goal-list");
const goalsEmpty = document.querySelector("#goals-empty-state");
const goalsBar = document.querySelector("#goals-bar");
const goalsLabel = document.querySelector("#goals-label");

const pomodoroDisplay = document.querySelector("#pomodoro-display");
const pomodoroMode = document.querySelector("#pomodoro-mode");
const pomodoroStart = document.querySelector("#pomodoro-start");
const pomodoroPause = document.querySelector("#pomodoro-pause");
const pomodoroReset = document.querySelector("#pomodoro-reset");
const pomodoroWorkInput = document.querySelector("#pomodoro-work-input");
const pomodoroBreakInput = document.querySelector("#pomodoro-break-input");

const quotePanel = document.querySelector("#quote-panel");
const quoteText = document.querySelector("#quote-text");
const quoteAuthor = document.querySelector("#quote-author");
const quoteRefresh = document.querySelector("#quote-refresh");

const weatherPanel = document.querySelector("#weather-panel");
const weatherLocation = document.querySelector("#weather-location");

// ===========================
// GLOBAL VARIABLES
// ===========================

let todos = [];
let todoFilter = "all";
let plannerEntries = {};
let goals = [];

let pomodoroModeValue = "work";
let pomodoroTimer = null;
let pomodoroRunning = false;
let pomodoroSecondsLeft = 1500;

// ===========================
// CONSTANTS
// ===========================

const THEME_KEY = "checkpoint-theme";
const TODO_KEY = "checkpoint-todos";
const PLANNER_KEY = "checkpoint-planner";
const GOALS_KEY = "checkpoint-goals";

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const fallbackQuotes = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "The man who moves a mountain begins by carrying away small stones.", author: "Confucius" },
  { text: "Success is the sum of small efforts, repeated day in & day out.", author: "Robert Collier" },
  { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
  { text: "Don't count the days, Make the days count.", author: "Muhammad Ali" },
  { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Your life does not get better by chance, it gets better by change.", author: "Jim Rohn" },
  { text: "Don't watch the clock; do what it does. Keep going", author: "Sam Levenson" }
];

const weatherCodes = {
  0: "Clear sky",
  1: "Mostly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Foggy",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Heavy drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  80: "Rain showers",
  81: "Rain showers",
  82: "Violent rain showers",
  95: "Thunderstorm",
  96: "Thunderstorm with hail",
  99: "Thunderstorm with hail",
};

// ===========================
// HELPER FUNCTIONS
// ===========================

// HELPER
// Reads a value from local storage and turns it back into an object.
function readJSON(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    if (value) {
      return JSON.parse(value);
    }
    return fallback;
  } catch (error) {
    return fallback;
  }
}

// HELPER
// Saves an object into local storage as a JSON string.
function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // could not save, so just do nothing
  }
}

// HELPER
// Adds a zero in front of numbers smaller than 10.
function zero(value) {
  if (value < 10) {
    return "0" + value;
  }
  return String(value);
}

// HELPER
// Creates a simple unique id using the current time and a random number.
function makeId() {
  return Date.now() + "-" + Math.floor(Math.random() * 100000);
}

// HELPER
// Escapes text so it can be safely put inside HTML.
function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// HELPER
// Plays two short beep sounds using the Web Audio API.
function playChime() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    const audio = new AudioContextClass();

    const firstOscillator = audio.createOscillator();
    const firstGain = audio.createGain();
    firstOscillator.frequency.value = 880;
    firstOscillator.type = "sine";
    firstGain.gain.value = 0.1;
    firstOscillator.connect(firstGain);
    firstGain.connect(audio.destination);
    firstOscillator.start();
    firstOscillator.stop(audio.currentTime + 0.15);

    setTimeout(function () {
      const secondOscillator = audio.createOscillator();
      const secondGain = audio.createGain();
      secondOscillator.frequency.value = 660;
      secondOscillator.type = "sine";
      secondGain.gain.value = 0.1;
      secondOscillator.connect(secondGain);
      secondGain.connect(audio.destination);
      secondOscillator.start();
      secondOscillator.stop(audio.currentTime + 0.15);
    }, 180);
  } catch (error) {
    // could not play sound, so just do nothing
  }
}

// HELPER
// Shows a browser notification if permission has been granted.
function notify(title, body) {
  if (!("Notification" in window)) {
    return;
  }

  if (Notification.permission === "granted") {
    new Notification(title, { body: body });
    return;
  }

  if (Notification.permission === "default") {
    Notification.requestPermission().then(function (permission) {
      if (permission === "granted") {
        new Notification(title, { body: body });
      }
    });
  }
}

// ===========================
// NAVIGATION
// ===========================

// NAVIGATION
// Shows the selected view and hides all the other views.
function showView(viewName) {
  for (let i = 0; i < allViews.length; i++) {
    const view = allViews[i];
    if (view.dataset.view === viewName) {
      view.classList.add("view--active");
    } else {
      view.classList.remove("view--active");
    }
  }

  if (app && app.scrollTo) {
    app.scrollTo({ top: 0 });
  }

  window.scrollTo({ top: 0 });
}

// NAVIGATION
// Sets up click and keyboard events for opening and closing feature cards.
function setupNavigation() {
  featureCards.forEach(function (card) {
    card.addEventListener("click", function () {
      showView(card.dataset.feature);
    });

    card.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        showView(card.dataset.feature);
      }
    });
  });

  backButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      showView("dashboard");
    });
  });
}

// ===========================
// CLOCK
// ===========================

// CLOCK
// Figures out if it is morning, afternoon, evening or night.
function getTimeOfDay(hour) {
  if (hour >= 4 && hour < 12) {
    return "morning";
  } else if (hour >= 12 && hour < 16) {
    return "afternoon";
  } else if (hour >= 16 && hour < 20) {
    return "evening";
  } else {
    return "night";
  }
}

// CLOCK
// Moves the little dot along the day progress arc.
// function updateDayArc(now) {
//   const secondsIntoDay = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
//   const fraction = secondsIntoDay / 86400;
//   const arcLength = dayArcFill.getTotalLength();

//   dayArcFill.style.strokeDasharray = String(arcLength);
//   dayArcFill.style.strokeDashoffset = String(arcLength * (1 - fraction));

//   const point = dayArcFill.getPointAtLength(arcLength * fraction);
//   dayArcMarker.setAttribute("cx", point.x);
//   dayArcMarker.setAttribute("cy", point.y);
// }

// CLOCK
// Adds a highlight class to the planner row that matches the current hour.
// function highlightCurrentPlannerHour(currentHour) {
//   const rows = plannerList.querySelectorAll(".planner-row");
//   rows.forEach(function (row) {
//     if (Number(row.dataset.hour) === currentHour) {
//       row.classList.add("is-current-hour");
//     } else {
//       row.classList.remove("is-current-hour");
//     }
//   });
// }

// CLOCK
// Updates the live clock, date and greeting every second.
function updateClock() {
  const now = new Date();
  const hours24 = now.getHours();
  let hours12 = hours24 % 12;
  if (hours12 === 0) {
    hours12 = 12;
  }
  const minutes = zero(now.getMinutes());
  const seconds = zero(now.getSeconds());
  const suffix = hours24 >= 12 ? "PM" : "AM";

  clockEl.textContent = hours12 + ":" + minutes + ":" + seconds + " " + suffix;
  dateEl.textContent = dayNames[now.getDay()] + ", " + monthNames[now.getMonth()] + " " + now.getDate();

  const timeOfDay = getTimeOfDay(hours24);
  if (timeOfDay === "morning") {
    greetingEl.textContent = "Good morning";
  } else if (timeOfDay === "afternoon") {
    greetingEl.textContent = "Good afternoon";
  } else if (timeOfDay === "evening") {
    greetingEl.textContent = "Good evening";
  } else {
    greetingEl.textContent = "Late night grinding?";
  }

  document.documentElement.dataset.time = timeOfDay;
// //   updateDayArc(now);
//   highlightCurrentPlannerHour(hours24);
}

// ===========================
// THEME
// ===========================

// THEME
// Applies the light or dark theme to the page and updates the toggle label.
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
  themeToggleLabel.textContent = theme === "dark" ? "Dark" : "Light";
}

// THEME
// Loads the saved theme, or falls back to the system preference.
function loadTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(savedTheme || (prefersDark ? "dark" : "light"));
}

// THEME
// Sets up the click event for switching between light and dark theme.
function setupTheme() {
  themeToggle.addEventListener("click", function () {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    localStorage.setItem(THEME_KEY, nextTheme);
  });
}

// ===========================
// TODO
// ===========================

// TODO
// Draws the todo list on the screen based on the current filter.
function renderTodos() {
  let filteredTodos = todos.slice();

  if (todoFilter === "active") {
    filteredTodos = filteredTodos.filter(function (task) {
      return !task.completed;
    });
  } else if (todoFilter === "completed") {
    filteredTodos = filteredTodos.filter(function (task) {
      return task.completed;
    });
  } else if (todoFilter === "important") {
    filteredTodos = filteredTodos.filter(function (task) {
      return task.important;
    });
  }

  let html = "";
  for (let i = 0; i < filteredTodos.length; i++) {
    const task = filteredTodos[i];
    const completedClass = task.completed ? "is-completed" : "";
    const importantClass = task.important ? "is-important" : "";

    html += `
      <li class="todo-item ${completedClass} ${importantClass}" data-id="${task.id}">
        <button class="todo-item-check" data-action="toggle" aria-label="Toggle complete"></button>
        <span class="todo-item-text">${escapeHTML(task.text)}</span>
        <button class="todo-item-star" data-action="important" aria-label="Mark important">★</button>
        <button class="todo-item-delete" data-action="delete" aria-label="Delete task">✕</button>
      </li>
    `;
  }

  todoList.innerHTML = html;
  todoEmpty.hidden = filteredTodos.length !== 0;
}

// TODO
// Draws the short todo summary that shows up on the dashboard card.
function renderTodoPreview() {
  const openTasks = todos.filter(function (task) {
    return !task.completed;
  });

  if (todos.length === 0) {
    todoPreview.innerHTML = '<p class="card-empty">No tasks yet.</p>';
    return;
  }

  if (openTasks.length === 0) {
    todoPreview.innerHTML = '<p class="card-empty">All caught up. Nothing left to do today.</p>';
    return;
  }

  let html = `<p class="card-subtle">${openTasks.length} task${openTasks.length === 1 ? "" : "s"} left</p>`;
  for (let i = 0; i < openTasks.length && i < 3; i++) {
    html += `<p class="card-empty">• ${escapeHTML(openTasks[i].text)}</p>`;
  }
  todoPreview.innerHTML = html;
}

// TODO
// Saves the todo list to local storage and re-draws it on the screen.
function saveTodos() {
  writeJSON(TODO_KEY, todos);
  renderTodos();
  renderTodoPreview();
}

// TODO
// Sets up the form, filter tabs and buttons for the todo list.
function setupTodo() {
  todoForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const text = todoInput.value.trim();
    if (!text) {
      return;
    }

    todos.unshift({ id: makeId(), text: text, completed: false, important: false });
    todoInput.value = "";
    saveTodos();
  });

  todoFilters.addEventListener("click", function (event) {
    const tab = event.target.closest(".filter-tab");
    if (!tab) {
      return;
    }

    todoFilter = tab.dataset.filter;

    const tabs = todoFilters.querySelectorAll(".filter-tab");
    tabs.forEach(function (item) {
      item.classList.toggle("is-active", item === tab);
      item.setAttribute("aria-selected", String(item === tab));
    });

    renderTodos();
  });

  todoList.addEventListener("click", function (event) {
    const button = event.target.closest("button[data-action]");
    if (!button) {
      return;
    }

    const item = button.closest(".todo-item");
    if (!item) {
      return;
    }

    const id = item.dataset.id;
    const action = button.dataset.action;

    if (action === "toggle") {
      todos = todos.map(function (task) {
        if (task.id === id) {
          return { ...task, completed: !task.completed };
        }
        return task;
      });
    } else if (action === "important") {
      todos = todos.map(function (task) {
        if (task.id === id) {
          return { ...task, important: !task.important };
        }
        return task;
      });
    } else if (action === "delete") {
      todos = todos.filter(function (task) {
        return task.id !== id;
      });
    }

    saveTodos();
  });
}

// ===========================
// PLANNER
// ===========================

// PLANNER
// Draws the hourly planner rows from 9 AM to 11 PM.
function renderPlanner() {
  let html = "";

  for (let hour = 9; hour <= 23; hour++) {
    const savedValue = plannerEntries[hour] || "";
    const suffix = hour >= 12 ? "PM" : "AM";
    let displayHour = hour % 12;
    if (displayHour === 0) {
      displayHour = 12;
    }

    html += `
      <div class="planner-row" data-hour="${hour}">
        <span class="planner-hour">${displayHour}:00 ${suffix}</span>
        <input type="text" class="planner-input" data-hour="${hour}" placeholder="What's happening?" value="${escapeHTML(savedValue)}" />
        <button class="planner-clear" data-hour="${hour}" aria-label="Clear this slot">Clear</button>
      </div>`;
  }

  plannerList.innerHTML = html;
}

// PLANNER
// Updates the short planner summary shown on the dashboard card.
function updatePlannerPreview() {
  let filledHours = 0;

  for (const key in plannerEntries) {
    if (plannerEntries[key] && plannerEntries[key].trim()) {
      filledHours = filledHours + 1;
    }
  }

  if (filledHours === 0) {
    plannerPreview.innerHTML = '<p class="card-empty">Your hours from 9 AM to 11 PM are open.</p>';
    return;
  }

  plannerPreview.innerHTML = `<p class="card-subtle">${filledHours} of 14 hours planned</p>`;
}

// PLANNER
// Sets up typing and clear button events for the planner rows.
function setupPlanner() {
  plannerList.addEventListener("input", function (event) {
    const input = event.target.closest(".planner-input");
    if (!input) {
      return;
    }

    plannerEntries[input.dataset.hour] = input.value;
    writeJSON(PLANNER_KEY, plannerEntries);
    updatePlannerPreview();
  });

  plannerList.addEventListener("click", function (event) {
    const button = event.target.closest(".planner-clear");
    if (!button) {
      return;
    }

    delete plannerEntries[button.dataset.hour];
    writeJSON(PLANNER_KEY, plannerEntries);

    const input = plannerList.querySelector(`.planner-input[data-hour="${button.dataset.hour}"]`);
    if (input) {
      input.value = "";
    }

    updatePlannerPreview();
  });
}

// ===========================
// GOALS
// ===========================

// GOALS
// Draws the goal list and updates the progress bar.
function renderGoals() {
  let html = "";

  for (let i = 0; i < goals.length; i++) {
    const goal = goals[i];
    html += `
      <li class="goal-item ${goal.completed ? "is-completed" : ""}" data-id="${goal.id}">
        <button class="goal-item-check" data-action="toggle" aria-label="Toggle complete"></button>
        <span class="goal-item-text">${escapeHTML(goal.text)}</span>
        <button class="goal-item-delete" data-action="delete" aria-label="Delete goal">✕</button>
      </li>`;
  }

  goalList.innerHTML = html;
  goalsEmpty.hidden = goals.length !== 0;

  const completedGoals = goals.filter(function (goal) {
    return goal.completed;
  }).length;

  let percent = 0;
  if (goals.length !== 0) {
    percent = Math.round((completedGoals / goals.length) * 100);
  }

  goalsBar.style.width = percent + "%";
  goalsLabel.textContent = completedGoals + " of " + goals.length + " complete";
  goalsPreviewBar.style.width = percent + "%";
  goalsPreviewLabel.textContent = completedGoals + " of " + goals.length + " done";
}

// GOALS
// Saves the goals list to local storage and re-draws it on the screen.
function saveGoals() {
  writeJSON(GOALS_KEY, goals);
  renderGoals();
}

// GOALS
// Sets up the form and buttons for adding, completing and deleting goals.
function setupGoals() {
  goalForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const text = goalInput.value.trim();
    if (!text) {
      return;
    }

    goals.push({ id: makeId(), text: text, completed: false });
    goalInput.value = "";
    saveGoals();
  });

  goalList.addEventListener("click", function (event) {
    const button = event.target.closest("button[data-action]");
    if (!button) {
      return;
    }

    const item = button.closest(".goal-item");
    if (!item) {
      return;
    }

    const id = item.dataset.id;

    if (button.dataset.action === "toggle") {
      goals = goals.map(function (goal) {
        if (goal.id === id) {
          return { ...goal, completed: !goal.completed };
        }
        return goal;
      });
    } else if (button.dataset.action === "delete") {
      goals = goals.filter(function (goal) {
        return goal.id !== id;
      });
    }

    saveGoals();
  });
}

// ===========================
// POMODORO
// ===========================

// POMODORO
// Draws the timer display, the mode label and the dashboard preview.
function renderPomodoro() {
  const minutes = zero(Math.floor(pomodoroSecondsLeft / 60));
  const seconds = zero(pomodoroSecondsLeft % 60);
  const label = minutes + ":" + seconds;

  pomodoroDisplay.textContent = label;
  pomodoroPreviewTime.textContent = label;
  pomodoroMode.textContent = pomodoroModeValue === "work" ? "Work session" : "Break";

  if (pomodoroRunning) {
    if (pomodoroModeValue === "work") {
      pomodoroPreviewState.textContent = "Focusing…";
    } else {
      pomodoroPreviewState.textContent = "On a break…";
    }
  } else {
    pomodoroPreviewState.textContent = "Ready?";
  }
}

// POMODORO
// Switches between work mode and break mode, then plays a sound and notifies.
function changePomodoroMode() {
  const finishedMode = pomodoroModeValue;

  if (pomodoroModeValue === "work") {
    pomodoroModeValue = "break";
    pomodoroSecondsLeft = Number(pomodoroBreakInput.value) * 60;
  } else {
    pomodoroModeValue = "work";
    pomodoroSecondsLeft = Number(pomodoroWorkInput.value) * 60;
  }

  playChime();

  if (finishedMode === "work") {
    notify("Work session complete", "Time for a break.");
  } else {
    notify("Break complete", "Back to focus.");
  }

  renderPomodoro();
}

// POMODORO
// Counts down one second and switches modes when time runs out.
function tickPomodoro() {
  pomodoroSecondsLeft = pomodoroSecondsLeft - 1;

  if (pomodoroSecondsLeft < 0) {
    changePomodoroMode();
    return;
  }

  renderPomodoro();
}

// POMODORO
// Starts the countdown timer and disables the inputs while it runs.
function startPomodoro() {
  if (pomodoroRunning) {
    return;
  }

  pomodoroRunning = true;
  pomodoroStart.disabled = true;
  pomodoroPause.disabled = false;
  pomodoroWorkInput.disabled = true;
  pomodoroBreakInput.disabled = true;

  notify("CheckPoint", "Timer started.");
  pomodoroTimer = setInterval(tickPomodoro, 1000);
  renderPomodoro();
}

// POMODORO
// Pauses the countdown timer and re-enables the start button.
function pausePomodoro() {
  pomodoroRunning = false;
  clearInterval(pomodoroTimer);
  pomodoroTimer = null;
  pomodoroStart.disabled = false;
  pomodoroPause.disabled = true;
  renderPomodoro();
}

// POMODORO
// Resets the timer back to a fresh work session.
function resetPomodoro() {
  pausePomodoro();
  pomodoroModeValue = "work";
  pomodoroWorkInput.disabled = false;
  pomodoroBreakInput.disabled = false;
  pomodoroSecondsLeft = Number(pomodoroWorkInput.value) * 60;
  renderPomodoro();
}

// POMODORO
// Sets up the start, pause, reset buttons and the minute input fields.
function setupPomodoro() {
  pomodoroSecondsLeft = Number(pomodoroWorkInput.value) * 60;

  pomodoroStart.addEventListener("click", startPomodoro);
  pomodoroPause.addEventListener("click", pausePomodoro);
  pomodoroReset.addEventListener("click", resetPomodoro);

  pomodoroWorkInput.addEventListener("change", function () {
    if (!pomodoroRunning && pomodoroModeValue === "work") {
      pomodoroSecondsLeft = Number(pomodoroWorkInput.value) * 60;
      renderPomodoro();
    }
  });

  pomodoroBreakInput.addEventListener("change", function () {
    if (!pomodoroRunning && pomodoroModeValue === "break") {
      pomodoroSecondsLeft = Number(pomodoroBreakInput.value) * 60;
      renderPomodoro();
    }
  });
}

// ===========================
// QUOTES
// ===========================

// QUOTES
// Draws the quote text and author on the quote panel and the preview card.
function renderQuote(quote, state) {
  quotePanel.dataset.state = state;
  quoteText.textContent = "“" + quote.text + "”";
  quoteAuthor.textContent = quote.author ? "— " + quote.author : "";

  quotePreview.dataset.state = state;
  quotePreview.innerHTML = `
    <p class="quote-preview-text">“${escapeHTML(quote.text)}”</p>
    <p class="card-subtle">— ${escapeHTML(quote.author || "Unknown")}</p>`;
}

// QUOTES
// Fetches a random quote from the DummyJSON API, or uses a fallback quote.
async function loadQuote() {
  quotePanel.dataset.state = "loading";
  quoteText.textContent = "Finding some words…";
  quoteAuthor.textContent = "";
  quotePreview.dataset.state = "loading";
  quotePreview.innerHTML = '<p class="card-loading">Finding some words…</p>';

  try {
    const response = await fetch("https://dummyjson.com/quotes/random");

    if (!response.ok) {
      throw new Error("Quote request failed");
    }

    const data = await response.json();

    renderQuote(
      {
        text: data.quote,
        author: data.author,
      },
      "loaded"
    );
  } catch (error) {
    const fallback =
      fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
    renderQuote(fallback, "error");
  }
}

// QUOTES
// Sets up the refresh button so a new quote can be loaded on click.
function setupQuote() {
  quoteRefresh.addEventListener("click", loadQuote);
}

// ===========================
// WEATHER
// ===========================

// WEATHER
// Draws the weather panel and the dashboard preview with the loaded data.
function renderWeather(locationLabel, current) {
  const condition = weatherCodes[current.weather_code] || "Unknown conditions";

  weatherLocation.textContent = locationLabel;
  weatherPanel.dataset.state = "loaded";
  weatherPanel.innerHTML = `
    <div class="weather-hero">
      <div>
        <p class="weather-temp">${Math.round(current.temperature_2m)}°C</p>
        <p class="weather-condition">${condition}</p>
      </div>
    </div>
    <div class="weather-stats">
      <div class="weather-stat">
        <p class="weather-stat-label">Humidity</p>
        <p class="weather-stat-value">${Math.round(current.relative_humidity_2m)}%</p>
      </div>
      <div class="weather-stat">
        <p class="weather-stat-label">Wind speed</p>
        <p class="weather-stat-value">${Math.round(current.wind_speed_10m)} km/h</p>
      </div>
    </div>`;

  weatherPreview.dataset.state = "loaded";
  weatherPreview.innerHTML = `
    <p class="weather-preview-temp">${Math.round(current.temperature_2m)}°C</p>
    <p class="card-subtle">${condition} · ${locationLabel}</p>`;
}

// WEATHER
// Shows an error message in both the weather panel and the preview card.
function renderWeatherError(message) {
  weatherPanel.dataset.state = "error";
  weatherPanel.innerHTML = `<p class="card-loading">${message}</p>`;
  weatherPreview.dataset.state = "error";
  weatherPreview.innerHTML = `<p class="card-loading">${message}</p>`;
}

// WEATHER
// Fetches weather data from Open Meteo API for a given latitude and longitude.
async function loadWeatherForCoordinates(lat, lon, label) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&temperature_unit=celsius&wind_speed_unit=kmh`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Weather request failed");
  }

  const data = await response.json();
  renderWeather(label, data.current);
}

// WEATHER
// Looks up New Delhi as a default city when location access is not available.
async function loadFallbackWeather() {
  try {
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent("New Delhi")}&count=1`);
    const data = await response.json();
    const place = data.results && data.results[0];

    if (!place) {
      throw new Error("No fallback city");
    }

    await loadWeatherForCoordinates(place.latitude, place.longitude, "New Delhi (default)");
  } catch (error) {
    renderWeatherError("Weather isn't available right now.");
  }
}

// WEATHER
// Asks the browser for the user's location and then loads the weather.
function loadWeather() {
  weatherLocation.textContent = "Locating you…";

  if (!navigator.geolocation) {
    loadFallbackWeather();
    return;
  }

  navigator.geolocation.getCurrentPosition(
    function (position) {
      loadWeatherForCoordinates(position.coords.latitude, position.coords.longitude, "Your Location").catch(function () {
        renderWeatherError("Weather isn't available right now.");
      });
    },
    function () {
      loadFallbackWeather();
    },
    { timeout: 8000 }
  );
}

// ===========================
// INITIALIZATION
// ===========================

// INITIALIZATION
// Loads all saved data, draws every feature and starts the clock.
// function init() {
//   todos = readJSON(TODO_KEY, []);
//   plannerEntries = readJSON(PLANNER_KEY, {});
//   goals = readJSON(GOALS_KEY, []);

//   loadTheme();
//   setupTheme();
//   setupNavigation();

//   setupTodo();
//   renderTodos();
//   renderTodoPreview();

//   renderPlanner();
//   updatePlannerPreview();
//   setupPlanner();

//   setupGoals();
//   renderGoals();

//   setupPomodoro();
//   renderPomodoro();

//   setupQuote();
//   loadQuote();

//   loadWeather();

//   updateClock();
//   setInterval(updateClock, 1000);
// }

  todos = readJSON(TODO_KEY, []);
  plannerEntries = readJSON(PLANNER_KEY, {});
  goals = readJSON(GOALS_KEY, []);

  loadTheme();
  setupTheme();
  setupNavigation();

  setupTodo();
  renderTodos(); 
  renderTodoPreview();

  renderPlanner();
  updatePlannerPreview();
  setupPlanner();

  setupGoals();
  renderGoals();

  setupPomodoro();
  renderPomodoro();

  setupQuote();
  loadQuote();

  loadWeather();

  updateClock();
  setInterval(updateClock, 1000);