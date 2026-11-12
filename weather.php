<?php
header('Content-Type: application/json; charset=utf-8');

$config = require __DIR__ . '/config.php';
$apiKey = $config['openweather_key'];

// Fetches weather

$lat = isset($_GET['lat']) ? $_GET['lat'] : '' ;
$lon = isset($_GET['lon']) ? $_GET['lon'] : '' ;

if (!is_numeric($lat) || !is_numeric($lon)) {
    http_response_code(400);
    echo json_encode(array('error' => 'Invalid coordinates'));
    exit;
}

$url = "https://api.openweathermap.org/data/2.5/weather?lat=$lat&lon=$lon&units=metric&lang=en&appid=$apiKey";

$context = stream_context_create(array('http' => array('ignore_errors' => true)));
$response = @file_get_contents($url, false, $context);

// If the response is false, it will display an error message.

if ($response === false) {
    $err = error_get_last();
    http_response_code(500);
    echo json_encode(array(
        'error' => 'Unable to fetch weather data',
        'details' => isset($err['message']) ? $err['message'] : 'no details'
    ));
    exit;
}

// JSON Response into weather display

$data = json_decode($response, true);

if (isset($data['main']['temp'], $data['weather'][0]['description'])) {
    echo json_encode(array(
        'summary' => round($data['main']['temp']) . "\xC2\xB0C, " . $data['weather'][0]['description']
    ));
} else {
    http_response_code(500);
    echo json_encode(array('error' => isset($data['message']) ? $data['message'] : 'Weather data is incomplete'));
}