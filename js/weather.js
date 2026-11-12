// Fetches weather via user location

window.addEventListener('load', () => {
    const info = document.getElementById('weather-info');

    if (!navigator.geolocation) {
        info.textContent = 'Could not retrieve your location.';
        return;
    }

    navigator.geolocation.getCurrentPosition(getWeather, () => {
        info.textContent = 'Could not retrieve your location.';
    });
});

async function getWeather(position) {
    const info = document.getElementById('weather-info');
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    try {
        const response = await fetch(`weather.php?lat=${lat}&lon=${lon}`);
        const data = await response.json();
        info.textContent = data.error ? 'Could not load weather.' : data.summary;
    } catch (err) {
        info.textContent = 'Could not load weather.';
    }
}