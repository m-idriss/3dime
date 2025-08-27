<?php
// Trakt TV API service

function fetchTraktStats() {
    $ch = curl_init("https://api.trakt.tv/users/3dime/stats");
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        "trakt-api-version: 2",
        "trakt-api-key: " . TRAKT_CLIENT_ID
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    
    if ($response === false) {
        $error = curl_error($ch);
        curl_close($ch);
        throw new Exception('Failed to fetch data: ' . $error);
    }
    curl_close($ch);

    $data = json_decode($response, true);
    if ($data === null) {
        throw new Exception('Invalid JSON response');
    }
    
    $moviesWatched = $data['movies']['watched'] ?? 0;
    return $moviesWatched;
}
?>