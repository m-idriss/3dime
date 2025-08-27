<?php
// GitHub API service

function fetchGithubData($type = 'user', $repo = null) {
    $username = GITHUB_USERNAME;
    if ($repo === null) {
        $repo = GITHUB_REPO;
    }
    
    // Validate repo parameter
    if (isset($repo) && !preg_match('/^[A-Za-z0-9._-]+$/', $repo)) {
        throw new Exception('Invalid repository name');
    }
    
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
        throw new Exception('Failed to fetch data: ' . $error);
    }
    curl_close($ch);

    $data = json_decode($response, true);

    // Handle 403 errors: distinguish rate limit from auth errors
    if ($httpCode === 403) {
        $errorMessage = is_array($data) && isset($data['message']) ? strtolower($data['message']) : '';
        if (strpos($errorMessage, 'rate limit') !== false) {
            throw new Exception('Rate limit exceeded: ' . ($data['message'] ?? 'GitHub API rate limit reached'), 429);
        } elseif (strpos($errorMessage, 'bad credentials') !== false) {
            throw new Exception('Authentication failed: ' . ($data['message'] ?? 'Bad credentials'), 401);
        } else {
            throw new Exception('Forbidden: ' . ($data['message'] ?? 'Access forbidden'), 403);
        }
    }

    if ($httpCode !== 200) {
        $message = is_array($data) && isset($data['message']) ? $data['message'] : '';
        throw new Exception('GitHub API error: ' . $message, $httpCode);
    }
    
    if ($data === null) {
        throw new Exception('Invalid JSON response');
    }
    
    // Prepare response based on type
    if ($type === 'repo') {
        return [
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
        // Transform GitHub's weekly commit activity data to daily format for heatmap
        $dailyCommits = [];
        if (is_array($data)) {
            foreach ($data as $week) {
                if (isset($week['week']) && isset($week['days']) && is_array($week['days'])) {
                    $weekStart = $week['week'];
                    for ($i = 0; $i < 7; $i++) {
                        $dayTimestamp = $weekStart + ($i * 86400); // Add days in seconds
                        $dailyCommits[date('Y-m-d', $dayTimestamp)] = $week['days'][$i] ?? 0;
                    }
                }
            }
        }
        return [
            'commit_activity' => $dailyCommits
        ];
    } else {
        return [
            'user_id' => $data['id'] ?? 0,
            'repos' => $data['public_repos'] ?? 0,
            'followers' => $data['followers'] ?? 0,
            'following' => $data['following'] ?? 0
        ];
    }
}
?>