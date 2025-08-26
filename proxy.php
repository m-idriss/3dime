<?php
require_once 'config.php';

$service = $_GET['service'] ?? '';

define('CONTENT_TYPE_JSON', 'Content-Type: application/json');

if ($service === 'trakt') {

    $ch = curl_init("https://api.trakt.tv/users/3dime/stats");
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        CONTENT_TYPE_JSON,
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
    // GitHub API service - supports user stats, repository stats, and commit activity
    // Parameters:
    // - type: 'user' (default) for user stats, 'repo' for repository stats, 'commits' for commit activity
    // - repo: repository name (defaults to GITHUB_REPO constant)
    //
    // Returns for type='user': user_id, repos, followers, following
    // Returns for type='repo': repo_id, name, full_name, stars, forks, watchers, issues, size, language, created_at, updated_at
    // Returns for type='commits': weekly commit activity data for heatmap

    $username = GITHUB_USERNAME;
    if (isset($_GET['repo']) && preg_match('/^[A-Za-z0-9._-]+$/', $_GET['repo'])) {
        $repo = $_GET['repo'];
    } else {
        $repo = GITHUB_REPO;
    }
    $type = $_GET['type'] ?? 'user'; // 'user' for user stats, 'repo' for repository stats, 'commits' for commit activity
    
    // Determine API endpoint based on type
    if ($type === 'repo') {
        $apiUrl = "https://api.github.com/repos/$username/$repo";
    } elseif ($type === 'commits') {
        $apiUrl = "https://api.github.com/repos/$username/$repo/stats/commit_activity";
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

    $data = json_decode($response, true);

    // Handle 403 errors: distinguish rate limit from auth errors
    if ($httpCode === 403) {
        $errorMessage = is_array($data) && isset($data['message']) ? strtolower($data['message']) : '';
        if (strpos($errorMessage, 'rate limit') !== false) {
            http_response_code(429);
            echo json_encode(['error' => 'Rate limit exceeded', 'message' => $data['message'] ?? 'GitHub API rate limit reached']);
            exit;
        } elseif (strpos($errorMessage, 'bad credentials') !== false) {
            http_response_code(401);
            echo json_encode(['error' => 'Authentication failed', 'message' => $data['message'] ?? 'Bad credentials']);
            exit;
        } else {
            http_response_code(403);
            echo json_encode(['error' => 'Forbidden', 'message' => $data['message'] ?? 'Access forbidden']);
            exit;
        }
    }

    if ($httpCode !== 200) {
        http_response_code($httpCode);
        echo json_encode(['error' => 'GitHub API error', 'code' => $httpCode, 'message' => $data['message'] ?? '']);
        exit;
    }
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
    } elseif ($type === 'commits') {
        // Transform GitHub's weekly commit activity to daily data for Cal-Heatmap
        $dailyData = [];
        if (is_array($data)) {
            foreach ($data as $week) {
                if (isset($week['week']) && isset($week['days']) && is_array($week['days'])) {
                    $weekTimestamp = $week['week'];
                    for ($i = 0; $i < 7; $i++) {
                        $dayTimestamp = $weekTimestamp + ($i * 86400); // Add days in seconds
                        $commits = $week['days'][$i] ?? 0;
                        if ($commits > 0) {
                            $dailyData[$dayTimestamp] = $commits;
                        }
                    }
                }
            }
        }
        $result = ['commits' => $dailyData];
    } else {
        $result = [
            'user_id' => $data['id'] ?? 0,
            'repos' => $data['public_repos'] ?? 0,
            'followers' => $data['followers'] ?? 0,
            'following' => $data['following'] ?? 0
        ];
    }

    header(CONTENT_TYPE_JSON);
    echo json_encode($result);
    exit;
}

if ($service === 'x' || $service === 'twitter') {
    // Check if X_USERNAME is configured
    if (!defined('X_USERNAME') || !X_USERNAME) {
        http_response_code(500);
        echo json_encode(['error' => 'X_USERNAME not configured', 'followers' => 0]);
        exit;
    }

    // Check if bearer token is configured
    if (!defined('X_BEARER_TOKEN') || !X_BEARER_TOKEN || X_BEARER_TOKEN === 'your_twitter_bearer_token_here') {
        http_response_code(500);
        echo json_encode(['error' => 'X_BEARER_TOKEN not configured', 'followers' => 0]);
        exit;
    }

    $username = X_USERNAME;
    
    // First get user ID from username using Twitter API v2
    $userUrl = "https://api.twitter.com/2/users/by/username/$username";
    $ch = curl_init($userUrl);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: Bearer " . X_BEARER_TOKEN,
        "User-Agent: 3dime-proxy-script"
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $userResponse = curl_exec($ch);
    
    if ($userResponse === false) {
        $error = curl_error($ch);
        curl_close($ch);
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch user data', 'details' => $error, 'followers' => 0]);
        exit;
    }
    curl_close($ch);

    $userData = json_decode($userResponse, true);
    if ($userData === null || !isset($userData['data']['id'])) {
        http_response_code(500);
        echo json_encode(['error' => 'Invalid user response or user not found', 'followers' => 0]);
        exit;
    }

    $userId = $userData['data']['id'];
    
    // Now get user details including follower count
    $userDetailUrl = "https://api.twitter.com/2/users/$userId?user.fields=public_metrics";
    $ch = curl_init($userDetailUrl);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: Bearer " . X_BEARER_TOKEN,
        "User-Agent: 3dime-proxy-script"
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $detailResponse = curl_exec($ch);
    
    if ($detailResponse === false) {
        $error = curl_error($ch);
        curl_close($ch);
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch follower data', 'details' => $error, 'followers' => 0]);
        exit;
    }
    curl_close($ch);

    $detailData = json_decode($detailResponse, true);
    if ($detailData === null) {
        http_response_code(500);
        echo json_encode(['error' => 'Invalid follower response', 'followers' => 0]);
        exit;
    }
    
    $followersCount = $detailData['data']['public_metrics']['followers_count'] ?? 0;

    header("Content-Type: application/json");
    echo json_encode(['followers' => $followersCount]);
    exit;
}

http_response_code(400);
echo json_encode(['error' => 'Service not supported']);
