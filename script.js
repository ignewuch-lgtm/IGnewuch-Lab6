// ELEMENTS
const btn = document.getElementById("getData");
const locationSelect = document.getElementById("location");
const results = document.getElementById("results");
const placeholder = document.getElementById("placeholder");
const errorText = document.getElementById("error");

// BUTTON CLICK
btn.addEventListener("click", async () => {
  const value = locationSelect.value;

  // VALIDATION
  if (!value) {
    showError("Please select a location.");
    return;
  }

  const [lat, lng] = value.split(",");

  try {
    clearError();
    setLoading();

    // API URLS
    const todayURL = `https://api.sunrisesunset.io/json?lat=${lat}&lng=${lng}&date=today&time_format=24`;
    const tomorrowURL = `https://api.sunrisesunset.io/json?lat=${lat}&lng=${lng}&date=tomorrow&time_format=24`;

    // FETCH BOTH
    const [todayRes, tomorrowRes] = await Promise.all([
      fetch(todayURL),
      fetch(tomorrowURL)
    ]);

    const todayData = await todayRes.json();
    const tomorrowData = await tomorrowRes.json();

    // API ERROR CHECK
    if (todayData.status !== "OK") {
      throw new Error(todayData.status);
    }

    if (tomorrowData.status !== "OK") {
      throw new Error(tomorrowData.status);
    }

    // UPDATE UI
    updateUI(
      todayData.results,
      tomorrowData.results,
      todayData.results.timezone
    );

  } catch (err) {
    showError(`Error: ${err.message}`);
    console.error(err);
  }
});

// SAFE VALUE HANDLER (handles nulls)
function safe(value) {
  return value === null ? "N/A" : value;
}

// UPDATE UI FUNCTION
function updateUI(today, tomorrow, timezone) {
  placeholder.style.display = "none";
  results.classList.remove("hidden");

  // TODAY
  document.getElementById("sunriseToday").textContent = safe(today.sunrise);
  document.getElementById("sunsetToday").textContent = safe(today.sunset);
  document.getElementById("dawnToday").textContent = safe(today.dawn);
  document.getElementById("duskToday").textContent = safe(today.dusk);
  document.getElementById("dayLengthToday").textContent = safe(today.day_length);
  document.getElementById("solarNoonToday").textContent = safe(today.solar_noon);

  // TOMORROW
  document.getElementById("sunriseTomorrow").textContent = safe(tomorrow.sunrise);
  document.getElementById("sunsetTomorrow").textContent = safe(tomorrow.sunset);
  document.getElementById("dawnTomorrow").textContent = safe(tomorrow.dawn);
  document.getElementById("duskTomorrow").textContent = safe(tomorrow.dusk);
  document.getElementById("dayLengthTomorrow").textContent = safe(tomorrow.day_length);
  document.getElementById("solarNoonTomorrow").textContent = safe(tomorrow.solar_noon);

  // TIMEZONE
  document.getElementById("timezone").textContent = `Timezone: ${timezone}`;
}

// SHOW ERROR
function showError(message) {
  errorText.textContent = message;
  results.classList.add("hidden");
}

// CLEAR ERROR
function clearError() {
  errorText.textContent = "";
}

// LOADING STATE
function setLoading() {
  results.classList.add("hidden");
  placeholder.style.display = "block";
  placeholder.textContent = "Loading data...";
}