fetch('weather.php?lat=51.5074&lon=-0.1278')
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