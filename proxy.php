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
    curl_close($ch);

    $data = json_decode($response, true);
    $moviesWatched = $data['movies']['watched'] ?? 0;

    header("Content-Type: application/json");
    echo json_encode(['movies' => $moviesWatched]);
    exit;
}

if ($service === 'github') {
    $username = GITHUB_USERNAME;
    $ch = curl_init("https://api.github.com/users/$username");
    curl_setopt($ch, CURLOPT_USERAGENT, 'MySite');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    curl_close($ch);

    $data = json_decode($response, true);
    $publicRepos = $data['public_repos'] ?? 0;

    header("Content-Type: application/json");
    echo json_encode(['repos' => $publicRepos]);
    exit;
}

http_response_code(400);
echo json_encode(['error' => 'Service not supported']);