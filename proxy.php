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
    // GitHub API service - supports both user and repository statistics
    // Parameters:
    // - type: 'user' (default) for user stats, 'repo' for repository stats  
    // - repo: repository name (defaults to GITHUB_REPO constant)
    //
    // Returns for type='user': user_id, repos, followers, following
    // Returns for type='repo': repo_id, name, full_name, stars, forks, watchers, issues, size, language, created_at, updated_at
    
    $username = GITHUB_USERNAME;
    $repo = $_GET['repo'] ?? GITHUB_REPO;
    $type = $_GET['type'] ?? 'user'; // 'user' for user stats, 'repo' for repository stats
    
    // Determine API endpoint based on type
    if ($type === 'repo') {
        $apiUrl = "https://api.github.com/repos/$username/$repo";
    } else {
        $apiUrl = "https://api.github.com/users/$username";
    }
    
    $ch = curl_init($apiUrl);
    curl_setopt($ch, CURLOPT_USERAGENT, '3dime-proxy-script');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    
    // Add authentication if GitHub token is available
    if (!empty(GITHUB_TOKEN)) {
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: token ' . GITHUB_TOKEN,
            'Accept: application/vnd.github.v3+json'
        ]);
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    
    if ($response === false) {
        $error = curl_error($ch);
        curl_close($ch);
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch data', 'details' => $error]);
        exit;
    }
    curl_close($ch);
    
    // Handle rate limiting
    if ($httpCode === 403) {
        http_response_code(429);
        echo json_encode(['error' => 'Rate limit exceeded', 'message' => 'GitHub API rate limit reached']);
        exit;
    }
    
    if ($httpCode !== 200) {
        http_response_code($httpCode);
        echo json_encode(['error' => 'GitHub API error', 'code' => $httpCode]);
        exit;
    }

    $data = json_decode($response, true);
    if ($data === null) {
        http_response_code(500);
        echo json_encode(['error' => 'Invalid JSON response']);
        exit;
    }
    
    // Prepare response based on type
    if ($type === 'repo') {
        $result = [
            'repo_id' => $data['id'] ?? 0,
            'name' => $data['name'] ?? '',
            'full_name' => $data['full_name'] ?? '',
            'stars' => $data['stargazers_count'] ?? 0,
            'forks' => $data['forks_count'] ?? 0,
            'watchers' => $data['watchers_count'] ?? 0,
            'issues' => $data['open_issues_count'] ?? 0,
            'size' => $data['size'] ?? 0,
            'language' => $data['language'] ?? '',
            'created_at' => $data['created_at'] ?? '',
            'updated_at' => $data['updated_at'] ?? ''
        ];
    } else {
        $result = [
            'user_id' => $data['id'] ?? 0,
            'repos' => $data['public_repos'] ?? 0,
            'followers' => $data['followers'] ?? 0,
            'following' => $data['following'] ?? 0
        ];
    }

    header("Content-Type: application/json");
    echo json_encode($result);
    exit;
}

http_response_code(400);
echo json_encode(['error' => 'Service not supported']);