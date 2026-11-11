// Get HTML elements
const pinInput = document.getElementById("pin");
const loginBtn = document.getElementById("login-btn");
const pinMessage = document.getElementById("pin-message");
const pinLogin = document.querySelector(".pin-login");
const moodApp = document.getElementById("mood-app");
const moodForm = document.getElementById("mood-form");
const moodText = document.getElementById("mood-log");
const moodButtons = document.querySelectorAll(".mood-btn");
const entriesList = document.getElementById("entries");
const weatherInfo = document.getElementById("weather-info");

let selectedMood = "";

// Check if a PIN already exists
const isFirstRun = !localStorage.getItem("salt");

if (isFirstRun) {
    loginBtn.textContent = "Set PIN";
}

// Show the app
function showApp() {
    pinLogin.style.display = "none";
    moodApp.hidden = false;
    renderEntries();
}

// Display saved entries
function renderEntries() {
    entriesList.innerHTML = "";
    let entries = loadEntries();

    entries.reverse().forEach(entry => {
        let li = document.createElement("li");
        li.textContent = entry.date + ": " + entry.mood + " - " + entry.note + " (" + entry.weather + ")";
        entriesList.appendChild(li);
    });
}

// Login
function handleLogin() {
    let pin = pinInput.value;

    if (pin.length < 4) {
        pinMessage.textContent = "PIN must be at least 4 characters.";
        return;
    }

    if (isFirstRun) {
        setPin(pin);
        showApp();
    } else if (unlock(pin)) {
        showApp();
    } else {
        pinMessage.textContent = "Wrong PIN.";
    }
}

loginBtn.addEventListener("click", handleLogin);

// Login when Enter is pressed
pinInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        handleLogin();
    }
});

// Select a mood
moodButtons.forEach(button => {
    button.addEventListener("click", function() {
        if (!button.dataset.mood) return;
        selectedMood = button.dataset.mood;
        moodButtons.forEach(b => b.classList.remove("selected"));
        button.classList.add("selected");
    });
});

// Save mood entry
moodForm.addEventListener("submit", function(event) {
    event.preventDefault();
    let note = moodText.value.trim();

    if (selectedMood === "" && note === "") return;

    let weather = weatherInfo.textContent;

    if (weather.startsWith("Loading") || weather.startsWith("Could not")) {
        weather = "weather unavailable";
    }

    let entry = {
        mood: selectedMood || "not chosen",
        note: note,
        date: new Date().toLocaleString(),
        weather: weather
    };

    saveEntry(entry);
    moodText.value = "";
    selectedMood = "";
    moodButtons.forEach(button => button.classList.remove("selected"));
    renderEntries();
});