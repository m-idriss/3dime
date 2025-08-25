<?php
require_once 'config.php';

$service = $_GET['service'] ?? '';

if ($service === 'trakt') {

    $ch = curl_init("https://api.trakt.tv/users/3dime/stats");
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Content-Type: application/json",
        "trakt-api-version: 2",
        "trakt-api-key: " . TRAKT_CLIENT_ID
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    if ($response === false) {
        $error = curl_error($ch);
        curl_close($ch);
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch data', 'details' => $error]);
        exit;
    }
    curl_close($ch);

    $data = json_decode($response, true);
    if ($data === null) {
        http_response_code(500);
        echo json_encode(['error' => 'Invalid JSON response']);
        exit;
    }
    $moviesWatched = $data['movies']['watched'] ?? 0;

    header("Content-Type: application/json");
    echo json_encode(['movies' => $moviesWatched]);
    exit;
}

if ($service === 'github') {
    $username = 'm-idriss';
    $ch = curl_init("https://api.github.com/users/$username");
    curl_setopt($ch, CURLOPT_USERAGENT, '3dime-proxy-script');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    if ($response === false) {
        $error = curl_error($ch);
        curl_close($ch);
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch data', 'details' => $error]);
        exit;
    }
    curl_close($ch);

    $data = json_decode($response, true);
    if ($data === null) {
        http_response_code(500);
        echo json_encode(['error' => 'Invalid JSON response']);
        exit;
    }
    $publicRepos = $data['public_repos'] ?? 0;

    header("Content-Type: application/json");
    echo json_encode(['repos' => $publicRepos]);
    exit;
}

if ($service === 'facebook') {
    // Facebook badge implementation
    // Note: Facebook's API requires authentication and doesn't provide public metrics
    // for personal profiles. This is a placeholder implementation that could be 
    // extended in the future if Facebook data becomes available.
    
    // For now, return a placeholder count
    $placeholder_count = 0; // Could be configured or calculated differently
    
    header("Content-Type: application/json");
    echo json_encode(['friends' => $placeholder_count]);
    exit;
}

http_response_code(400);
echo json_encode(['error' => 'Service not supported']);