// Fetches Weather via user location

window.addEventListener('load', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getWeather, () => {
            document.getElementById('weather-info').textContent = 'Could not retrieve your location.';
        });
    }
});

async function getWeather(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
}

fetch(`weather.php?lat=${lat}&lon=${lon}`)
    .then(response => response.json())
    .then(data => {
        const info = document.getElementById('weather-info');
        if (data.error) {
            info.textContent = data.error;
        } else {
            info.textContent = data.summary;
        }
    })
    .catch(() => {
        document.getElementById('weather-info').textContent = 'Could not load weather.';
    });